import { ValidationError } from 'yup';
import { 
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdApi, buscarPorNomeApi, buscarPorDescricaoApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar
} from '../fetcher/PermissaoFetcher';
import { Permissao, PermissaoCreateDto, PermissaoUpdateDto } from '../model';

// Schema de validação para Permissao
const permissaoSchema = {
    validate: (permissao: Permissao, options?: any) => {
        return new Promise((resolve, reject) => {
            const errors: string[] = [];
            
            if (!permissao.nomePermissao || permissao.nomePermissao.trim() === '') {
                errors.push('Nome da permissão é obrigatório');
            }
            
            if (!permissao.descricaoPermissao || permissao.descricaoPermissao.trim() === '') {
                errors.push('Descrição da permissão é obrigatória');
            }
            
            if (errors.length > 0) {
                const error = new Error(errors.join(', '));
                (error as any).inner = errors.map(msg => ({ path: 'permissao', message: msg }));
                reject(error);
            } else {
                resolve(permissao);
            }
        });
    }
};

const salvarPermissao = (permissao: PermissaoCreateDto, callback: CallBackSalvar) => {
    permissaoSchema.validate(permissao as any, { abortEarly: false })
        .then(() => {
            salvarApi(permissao, callback);
        })
        .catch((error) => {
            const errosFinais: any = {};
            if (error.inner) {
                error.inner.forEach((er: ValidationError) => {
                    errosFinais[er.path as keyof typeof errosFinais] = er.message;
                });
            }
            callback(false, error.message, errosFinais);
        });
};

const atualizarPermissao = (id: number, permissao: PermissaoUpdateDto, callback: CallBackAtualizar) => {
    permissaoSchema.validate(permissao as any, { abortEarly: false })
        .then(() => {
            atualizarApi(id, permissao, callback);
        })
        .catch((error) => {
            const errosFinais: any = {};
            if (error.inner) {
                error.inner.forEach((er: ValidationError) => {
                    errosFinais[er.path as keyof typeof errosFinais] = er.message;
                });
            }
            callback(false, error.message, errosFinais);
        });
};

const apagarPermissao = (id: number, callback: CallBackApagar) => {
    apagarApi(id, callback);
};

const carregarPermissoes = (carregarCallBack: CallBackCarregar) => {
    carregarApi(carregarCallBack);
};

const buscarPermissaoPorId = (id: number, callback: CallBackBuscar) => {
    buscarPorIdApi(id, callback);
};

const buscarPermissaoPorNome = (nome: string, callback: CallBackCarregar) => {
    buscarPorNomeApi(nome, callback);
};

const buscarPermissaoPorDescricao = (descricao: string, callback: CallBackCarregar) => {
    buscarPorDescricaoApi(descricao, callback);
};

export {
    salvarPermissao,
    carregarPermissoes,
    apagarPermissao,
    atualizarPermissao,
    buscarPermissaoPorId,
    buscarPermissaoPorNome,
    buscarPermissaoPorDescricao
};


