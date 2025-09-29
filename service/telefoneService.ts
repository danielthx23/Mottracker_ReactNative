import { ValidationError } from 'yup';
import { 
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdApi, buscarPorNumeroApi, 
    buscarPorUsuarioApi, buscarPorTipoApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar
} from '../fetcher/TelefoneFetcher';
import { Telefone, TelefoneCreateDto, TelefoneUpdateDto } from '../model';

// Schema de validação para Telefone
const telefoneSchema = {
    validate: (telefone: Telefone, options?: any) => {
        return new Promise((resolve, reject) => {
            const errors: string[] = [];
            
            if (!telefone.numeroTelefone || telefone.numeroTelefone.trim() === '') {
                errors.push('Número do telefone é obrigatório');
            }
            
            if (!telefone.tipoTelefone || telefone.tipoTelefone.trim() === '') {
                errors.push('Tipo do telefone é obrigatório');
            }
            
            if (telefone.usuarioId <= 0) {
                errors.push('ID do usuário é obrigatório');
            }
            
            // Validação básica de número de telefone
            const numeroLimpo = telefone.numeroTelefone.replace(/\D/g, '');
            if (numeroLimpo.length < 10 || numeroLimpo.length > 11) {
                errors.push('Número de telefone deve ter 10 ou 11 dígitos');
            }
            
            if (errors.length > 0) {
                const error = new Error(errors.join(', '));
                (error as any).inner = errors.map(msg => ({ path: 'telefone', message: msg }));
                reject(error);
            } else {
                resolve(telefone);
            }
        });
    }
};

const salvarTelefone = (telefone: TelefoneCreateDto, callback: CallBackSalvar) => {
    telefoneSchema.validate(telefone as any, { abortEarly: false })
        .then(() => {
            salvarApi(telefone, callback);
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

const atualizarTelefone = (id: number, telefone: TelefoneUpdateDto, callback: CallBackAtualizar) => {
    telefoneSchema.validate(telefone as any, { abortEarly: false })
        .then(() => {
            atualizarApi(id, telefone, callback);
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

const apagarTelefone = (id: number, callback: CallBackApagar) => {
    apagarApi(id, callback);
};

const carregarTelefones = (carregarCallBack: CallBackCarregar) => {
    carregarApi(carregarCallBack);
};

const buscarTelefonePorId = (id: number, callback: CallBackBuscar) => {
    buscarPorIdApi(id, callback);
};

const buscarTelefonePorNumero = (numero: string, callback: CallBackCarregar) => {
    buscarPorNumeroApi(numero, callback);
};

const buscarTelefonePorUsuario = (usuarioId: number, callback: CallBackCarregar) => {
    buscarPorUsuarioApi(usuarioId, callback);
};

const buscarTelefonePorTipo = (tipo: string, callback: CallBackCarregar) => {
    buscarPorTipoApi(tipo, callback);
};

export {
    salvarTelefone,
    carregarTelefones,
    apagarTelefone,
    atualizarTelefone,
    buscarTelefonePorId,
    buscarTelefonePorNumero,
    buscarTelefonePorUsuario,
    buscarTelefonePorTipo
};


