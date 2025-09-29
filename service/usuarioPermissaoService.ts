import { ValidationError } from 'yup';
import { 
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdCompostoApi, buscarPorUsuarioApi, 
    buscarPorPermissaoApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar
} from '../fetcher/UsuarioPermissaoFetcher';
import { UsuarioPermissao, UsuarioPermissaoCreateDto, UsuarioPermissaoUpdateDto } from '../model';

// Schema de validação para UsuarioPermissao
const usuarioPermissaoSchema = {
    validate: (usuarioPermissao: UsuarioPermissao, options?: any) => {
        return new Promise((resolve, reject) => {
            const errors: string[] = [];
            
            if (usuarioPermissao.usuarioId <= 0) {
                errors.push('ID do usuário é obrigatório');
            }
            
            if (usuarioPermissao.permissaoId <= 0) {
                errors.push('ID da permissão é obrigatório');
            }
            
            if (!usuarioPermissao.dataAtribuicao) {
                errors.push('Data de atribuição é obrigatória');
            }
            
            if (errors.length > 0) {
                const error = new Error(errors.join(', '));
                (error as any).inner = errors.map(msg => ({ path: 'usuarioPermissao', message: msg }));
                reject(error);
            } else {
                resolve(usuarioPermissao);
            }
        });
    }
};

const salvarUsuarioPermissao = (usuarioPermissao: UsuarioPermissaoCreateDto, callback: CallBackSalvar) => {
    usuarioPermissaoSchema.validate(usuarioPermissao as any, { abortEarly: false })
        .then(() => {
            salvarApi(usuarioPermissao, callback);
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

const atualizarUsuarioPermissao = (usuarioId: number, permissaoId: number, usuarioPermissao: UsuarioPermissaoUpdateDto, callback: CallBackAtualizar) => {
    usuarioPermissaoSchema.validate(usuarioPermissao as any, { abortEarly: false })
        .then(() => {
            atualizarApi(usuarioId, permissaoId, usuarioPermissao, callback);
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

const apagarUsuarioPermissao = (usuarioId: number, permissaoId: number, callback: CallBackApagar) => {
    apagarApi(usuarioId, permissaoId, callback);
};

const carregarUsuarioPermissoes = (carregarCallBack: CallBackCarregar) => {
    carregarApi(carregarCallBack);
};

const buscarUsuarioPermissaoPorIdComposto = (usuarioId: number, permissaoId: number, callback: CallBackBuscar) => {
    buscarPorIdCompostoApi(usuarioId, permissaoId, callback);
};

const buscarUsuarioPermissaoPorUsuario = (usuarioId: number, callback: CallBackCarregar) => {
    buscarPorUsuarioApi(usuarioId, callback);
};

const buscarUsuarioPermissaoPorPermissao = (permissaoId: number, callback: CallBackCarregar) => {
    buscarPorPermissaoApi(permissaoId, callback);
};

export {
    salvarUsuarioPermissao,
    carregarUsuarioPermissoes,
    apagarUsuarioPermissao,
    atualizarUsuarioPermissao,
    buscarUsuarioPermissaoPorIdComposto,
    buscarUsuarioPermissaoPorUsuario,
    buscarUsuarioPermissaoPorPermissao
};


