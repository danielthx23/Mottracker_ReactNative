import { ValidationError } from 'yup';
import { 
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdApi, buscarPorNomeApi, buscarPorStatusApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar
} from '../fetcher/CameraFetcher';
import { Camera, CameraCreateDto, CameraUpdateDto } from '../model';

// Schema de validação para Camera
const cameraSchema = {
    validate: (camera: Camera, options?: any) => {
        return new Promise((resolve, reject) => {
            const errors: string[] = [];
            
            if (!camera.nomeCamera || camera.nomeCamera.trim() === '') {
                errors.push('Nome da câmera é obrigatório');
            }
            
            if (camera.ipCamera && camera.ipCamera.trim() !== '') {
                // Validação básica de IP
                const ipRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
                if (!ipRegex.test(camera.ipCamera)) {
                    errors.push('IP da câmera deve ser válido');
                }
            }
            
            if (camera.status === undefined || camera.status === null || camera.status === '') {
                errors.push('Status da câmera é obrigatório');
            }
            
            if (camera.posX !== undefined && camera.posX < 0) {
                errors.push('Posição X deve ser positiva');
            }
            
            if (camera.posY !== undefined && camera.posY < 0) {
                errors.push('Posição Y deve ser positiva');
            }
            
            if (errors.length > 0) {
                const error = new Error(errors.join(', '));
                (error as any).inner = errors.map(msg => ({ path: 'camera', message: msg }));
                reject(error);
            } else {
                resolve(camera);
            }
        });
    }
};

const salvarCamera = (camera: CameraCreateDto, callback: CallBackSalvar) => {
    cameraSchema.validate(camera as any, { abortEarly: false })
        .then(() => {
            salvarApi(camera, callback);
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

const atualizarCamera = (id: number, camera: CameraUpdateDto, callback: CallBackAtualizar) => {
    cameraSchema.validate(camera as any, { abortEarly: false })
        .then(() => {
            atualizarApi(id, camera, callback);
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

const apagarCamera = (id: number, callback: CallBackApagar) => {
    apagarApi(id, callback);
};

const carregarCameras = (carregarCallBack: CallBackCarregar) => {
    carregarApi(carregarCallBack);
};

const buscarCameraPorId = (id: number, callback: CallBackBuscar) => {
    buscarPorIdApi(id, callback);
};

const buscarCameraPorNome = (nome: string, callback: CallBackCarregar) => {
    buscarPorNomeApi(nome, callback);
};

const buscarCameraPorStatus = (status: string, callback: CallBackCarregar) => {
    buscarPorStatusApi(status, callback);
};

export {
    salvarCamera,
    carregarCameras,
    apagarCamera,
    atualizarCamera,
    buscarCameraPorId,
    buscarCameraPorNome,
    buscarCameraPorStatus
};


