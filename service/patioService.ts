import { ValidationError } from 'yup';
import { 
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdApi, buscarPorNomeApi, 
    buscarMotosDisponiveisMaiorQueApi, buscarDataPosteriorApi, buscarDataAnteriorApi,
    atualizarMotosCamerasApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar, CallBackAtualizarMotosCameras
} from '../fetcher/PatioFetcher';
import { Patio, PatioCreateDto, PatioUpdateDto } from '../model';

// Schema de validação para Patio
const patioSchema = {
    validate: (patio: Patio, options?: any) => {
        return new Promise((resolve, reject) => {
            const errors: string[] = [];
            
            if (!patio.nomePatio || patio.nomePatio.trim() === '') {
                errors.push('Nome do pátio é obrigatório');
            }
            
            if (patio.motosTotaisPatio < 0) {
                errors.push('Total de motos deve ser positivo');
            }
            
            if (patio.motosDisponiveisPatio < 0) {
                errors.push('Motos disponíveis deve ser positivo');
            }
            
            if (patio.motosDisponiveisPatio > patio.motosTotaisPatio) {
                errors.push('Motos disponíveis não pode ser maior que o total');
            }
            
            if (!patio.dataPatio) {
                errors.push('Data do pátio é obrigatória');
            }
            
            if (errors.length > 0) {
                const error = new Error(errors.join(', '));
                (error as any).inner = errors.map(msg => ({ path: 'patio', message: msg }));
                reject(error);
            } else {
                resolve(patio);
            }
        });
    }
};

const salvarPatio = (patio: PatioCreateDto, callback: CallBackSalvar) => {
    patioSchema.validate(patio as any, { abortEarly: false })
        .then(() => {
            salvarApi(patio, callback);
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

const atualizarPatio = (id: number, patio: PatioUpdateDto, callback: CallBackAtualizar) => {
    patioSchema.validate(patio as any, { abortEarly: false })
        .then(() => {
            atualizarApi(id, patio, callback);
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

const apagarPatio = (id: number, callback: CallBackApagar) => {
    apagarApi(id, callback);
};

const carregarPatios = (carregarCallBack: CallBackCarregar) => {
    carregarApi(carregarCallBack);
};

const buscarPatioPorId = (id: number, callback: CallBackBuscar) => {
    buscarPorIdApi(id, callback);
};

const buscarPatioPorNome = (nome: string, callback: CallBackCarregar) => {
    buscarPorNomeApi(nome, callback);
};

const buscarMotosDisponiveisMaiorQue = (quantidade: number, callback: CallBackCarregar) => {
    buscarMotosDisponiveisMaiorQueApi(quantidade, callback);
};

const buscarDataPosterior = (data: string, callback: CallBackCarregar) => {
    buscarDataPosteriorApi(data, callback);
};

const buscarDataAnterior = (data: string, callback: CallBackCarregar) => {
    buscarDataAnteriorApi(data, callback);
};

const atualizarMotosCameras = (idPatio: number, motosIds: number[], camerasIds: number[], callback: CallBackAtualizarMotosCameras) => {
    atualizarMotosCamerasApi(idPatio, motosIds, camerasIds, callback);
};

export {
    salvarPatio,
    carregarPatios,
    apagarPatio,
    atualizarPatio,
    buscarPatioPorId,
    buscarPatioPorNome,
    buscarMotosDisponiveisMaiorQue,
    buscarDataPosterior,
    buscarDataAnterior,
    atualizarMotosCameras
};


