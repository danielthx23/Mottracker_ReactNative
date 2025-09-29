import { ValidationError } from 'yup';
import { 
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdApi, buscarPorPlacaApi, 
    buscarPorEstadoApi, buscarPorContratoApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar
} from '../fetcher/MotoFetcher';
import { Moto, MotoCreateDto, MotoUpdateDto } from '../model';

// Schema de validação para Moto
const motoSchema = {
    validate: (moto: Moto, options?: any) => {
        return new Promise((resolve, reject) => {
            const errors: string[] = [];
            
            if (!moto.placaMoto || moto.placaMoto.trim() === '') {
                errors.push('Placa é obrigatória');
            }
            
            if (!moto.modeloMoto || moto.modeloMoto.trim() === '') {
                errors.push('Modelo é obrigatório');
            }
            
            if (!moto.anoMoto || moto.anoMoto < 1900 || moto.anoMoto > new Date().getFullYear() + 1) {
                errors.push('Ano deve ser válido');
            }
            
            if (!moto.identificadorMoto || moto.identificadorMoto.trim() === '') {
                errors.push('Identificador é obrigatório');
            }
            
            if (moto.quilometragemMoto < 0) {
                errors.push('Quilometragem deve ser positiva');
            }
            
            // Contrato é opcional - não validar
            
            if (errors.length > 0) {
                const error = new Error(errors.join(', '));
                (error as any).inner = errors.map(msg => ({ path: 'moto', message: msg }));
                reject(error);
            } else {
                resolve(moto);
            }
        });
    }
};

const salvarMoto = (moto: MotoCreateDto, callback: CallBackSalvar) => {
    motoSchema.validate(moto as any, { abortEarly: false })
        .then(() => {
            salvarApi(moto, callback);
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

const atualizarMoto = (id: number, moto: MotoUpdateDto, callback: CallBackAtualizar) => {
    motoSchema.validate(moto as any, { abortEarly: false })
        .then(() => {
            atualizarApi(id, moto, callback);
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

const apagarMoto = (id: number, callback: CallBackApagar) => {
    apagarApi(id, callback);
};

const carregarMotos = (carregarCallBack: CallBackCarregar) => {
    carregarApi(carregarCallBack);
};

const buscarMotoPorId = (id: number, callback: CallBackBuscar) => {
    buscarPorIdApi(id, callback);
};

const buscarMotoPorPlaca = (placa: string, callback: CallBackBuscar) => {
    buscarPorPlacaApi(placa, callback);
};

const buscarMotoPorEstado = (estado: string, callback: CallBackCarregar) => {
    buscarPorEstadoApi(estado, callback);
};

const buscarMotoPorContrato = (contratoId: number, callback: CallBackCarregar) => {
    buscarPorContratoApi(contratoId, callback);
};

export {
    salvarMoto,
    carregarMotos,
    apagarMoto,
    atualizarMoto,
    buscarMotoPorId,
    buscarMotoPorPlaca,
    buscarMotoPorEstado,
    buscarMotoPorContrato
};


