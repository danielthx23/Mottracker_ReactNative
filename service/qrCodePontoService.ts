import { ValidationError } from 'yup';
import { 
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdApi, buscarPorIdentificadorApi, 
    buscarPorLayoutPatioApi, buscarPorPosXApi, buscarPorPosYApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar
} from '../fetcher/QrCodePontoFetcher';
import { QrCodePonto, QrCodePontoCreateDto, QrCodePontoUpdateDto } from '../model';

// Schema de validação para QrCodePonto
const qrCodePontoSchema = {
    validate: (qrCodePonto: QrCodePonto, options?: any) => {
        return new Promise((resolve, reject) => {
            const errors: string[] = [];
            
            if (!qrCodePonto.identificadorQrCodePonto || qrCodePonto.identificadorQrCodePonto.trim() === '') {
                errors.push('Identificador do QR Code é obrigatório');
            }
            
            if (qrCodePonto.posXQrCodePonto < 0) {
                errors.push('Posição X deve ser positiva');
            }
            
            if (qrCodePonto.posYQrCodePonto < 0) {
                errors.push('Posição Y deve ser positiva');
            }
            
            if (qrCodePonto.layoutPatioId <= 0) {
                errors.push('ID do layout do pátio é obrigatório');
            }
            
            if (errors.length > 0) {
                const error = new Error(errors.join(', '));
                (error as any).inner = errors.map(msg => ({ path: 'qrCodePonto', message: msg }));
                reject(error);
            } else {
                resolve(qrCodePonto);
            }
        });
    }
};

const salvarQrCodePonto = (qrCodePonto: QrCodePontoCreateDto, callback: CallBackSalvar) => {
    qrCodePontoSchema.validate(qrCodePonto as any, { abortEarly: false })
        .then(() => {
            salvarApi(qrCodePonto, callback);
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

const atualizarQrCodePonto = (id: number, qrCodePonto: QrCodePontoUpdateDto, callback: CallBackAtualizar) => {
    qrCodePontoSchema.validate(qrCodePonto as any, { abortEarly: false })
        .then(() => {
            atualizarApi(id, qrCodePonto, callback);
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

const apagarQrCodePonto = (id: number, callback: CallBackApagar) => {
    apagarApi(id, callback);
};

const carregarQrCodePontos = (carregarCallBack: CallBackCarregar) => {
    carregarApi(carregarCallBack);
};

const buscarQrCodePontoPorId = (id: number, callback: CallBackBuscar) => {
    buscarPorIdApi(id, callback);
};

const buscarQrCodePontoPorIdentificador = (identificador: string, callback: CallBackBuscar) => {
    buscarPorIdentificadorApi(identificador, callback);
};

const buscarQrCodePontoPorLayoutPatio = (layoutPatioId: number, callback: CallBackCarregar) => {
    buscarPorLayoutPatioApi(layoutPatioId, callback);
};

const buscarQrCodePontoPorPosX = (posXMin: number, posXMax: number, callback: CallBackCarregar) => {
    buscarPorPosXApi(posXMin, posXMax, callback);
};

const buscarQrCodePontoPorPosY = (posYMin: number, posYMax: number, callback: CallBackCarregar) => {
    buscarPorPosYApi(posYMin, posYMax, callback);
};

export {
    salvarQrCodePonto,
    carregarQrCodePontos,
    apagarQrCodePonto,
    atualizarQrCodePonto,
    buscarQrCodePontoPorId,
    buscarQrCodePontoPorIdentificador,
    buscarQrCodePontoPorLayoutPatio,
    buscarQrCodePontoPorPosX,
    buscarQrCodePontoPorPosY
};


