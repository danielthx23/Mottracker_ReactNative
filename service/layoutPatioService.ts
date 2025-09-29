import { ValidationError } from 'yup';
import { 
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdApi, buscarPorPatioApi, buscarPorDataCriacaoApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar
} from '../fetcher/LayoutPatioFetcher';
import { LayoutPatio, LayoutPatioCreateDto, LayoutPatioUpdateDto } from '../model';

// Schema de validação para LayoutPatio
const layoutPatioSchema = {
    validate: (layoutPatio: LayoutPatio, options?: any) => {
        return new Promise((resolve, reject) => {
            const errors: string[] = [];
            
            if (!layoutPatio.nomeLayoutPatio || layoutPatio.nomeLayoutPatio.trim() === '') {
                errors.push('Nome do layout é obrigatório');
            }
            
            if (!layoutPatio.descricaoLayoutPatio || layoutPatio.descricaoLayoutPatio.trim() === '') {
                errors.push('Descrição do layout é obrigatória');
            }
            
            if (!layoutPatio.dataCriacaoLayoutPatio) {
                errors.push('Data de criação é obrigatória');
            }
            
            if (layoutPatio.patioId <= 0) {
                errors.push('ID do pátio é obrigatório');
            }
            
            if (errors.length > 0) {
                const error = new Error(errors.join(', '));
                (error as any).inner = errors.map(msg => ({ path: 'layoutPatio', message: msg }));
                reject(error);
            } else {
                resolve(layoutPatio);
            }
        });
    }
};

const salvarLayoutPatio = (layoutPatio: LayoutPatioCreateDto, callback: CallBackSalvar) => {
    layoutPatioSchema.validate(layoutPatio as any, { abortEarly: false })
        .then(() => {
            salvarApi(layoutPatio, callback);
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

const atualizarLayoutPatio = (id: number, layoutPatio: LayoutPatioUpdateDto, callback: CallBackAtualizar) => {
    layoutPatioSchema.validate(layoutPatio as any, { abortEarly: false })
        .then(() => {
            atualizarApi(id, layoutPatio, callback);
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

const apagarLayoutPatio = (id: number, callback: CallBackApagar) => {
    apagarApi(id, callback);
};

const carregarLayoutPatios = (carregarCallBack: CallBackCarregar) => {
    carregarApi(carregarCallBack);
};

const buscarLayoutPatioPorId = (id: number, callback: CallBackBuscar) => {
    buscarPorIdApi(id, callback);
};

const buscarLayoutPatioPorPatio = (patioId: number, callback: CallBackCarregar) => {
    buscarPorPatioApi(patioId, callback);
};

const buscarLayoutPatioPorDataCriacao = (dataInicio: string, dataFim: string, callback: CallBackCarregar) => {
    buscarPorDataCriacaoApi(dataInicio, dataFim, callback);
};

export {
    salvarLayoutPatio,
    carregarLayoutPatios,
    apagarLayoutPatio,
    atualizarLayoutPatio,
    buscarLayoutPatioPorId,
    buscarLayoutPatioPorPatio,
    buscarLayoutPatioPorDataCriacao
};


