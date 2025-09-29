import { Camera, CameraDto, CameraCreateDto, CameraUpdateDto } from '../model';
import axios, { AxiosResponse } from 'axios';

const apiCamera = axios.create({ 
    baseURL: "https://mottracker-dotnet.onrender.com/api/v1/camera"
});

interface CallBackSalvar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackCarregar {
    (sucesso: boolean, mensagem: string, lista: Camera[]): void
}

interface CallBackApagar {
    (sucesso: boolean, mensagem: string): void
}

interface CallBackAtualizar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackBuscar {
    (sucesso: boolean, mensagem: string, item: Camera | null): void
}

const salvarApi = (camera: CameraCreateDto, callback: CallBackSalvar) => {
    apiCamera.post("", camera)
        .then(() => {
            callback(true, "Câmera salva com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const apagarApi = (id: number, callback: CallBackApagar) => {
    apiCamera.delete(`/${id}`)
        .then(() => {
            callback(true, "Câmera removida com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const atualizarApi = (id: number, camera: CameraUpdateDto, callback: CallBackAtualizar) => {
    apiCamera.put(`/${id}`, camera)
        .then(() => {
            callback(true, "Câmera atualizada com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const carregarApi = (callback: CallBackCarregar) => {
    // Buscar todas as câmeras (deslocamento=0, registros=100 para pegar todas)
    apiCamera.get("?Deslocamento=0&RegistrosRetornado=100")
        .then((response: AxiosResponse<any>) => {
            
            let dataToMap = response.data;
            
            // Verificar se response.data é um array
            if (!Array.isArray(response.data)) {
                
                // Tentar extrair array de response.data.data se existir
                if (response.data && Array.isArray(response.data.data)) {
                    dataToMap = response.data.data;
                } else {
                    callback(false, "Estrutura de resposta inválida - não é um array", []);
                    return;
                }
            }
            
            const lista: Camera[] = dataToMap.map((dto: any) => ({
                idCamera: dto.idCamera,
                nomeCamera: dto.nomeCamera,
                ipCamera: dto.ipCamera,
                status: dto.status as any,
                posX: dto.posX,
                posY: dto.posY
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorIdApi = (id: number, callback: CallBackBuscar) => {
    apiCamera.get(`/${id}`)
        .then((response: AxiosResponse<CameraDto>) => {
            const camera: Camera = {
                idCamera: response.data.idCamera,
                nomeCamera: response.data.nomeCamera,
                ipCamera: response.data.ipCamera,
                status: response.data.status as any,
                posX: response.data.posX,
                posY: response.data.posY
            };
            callback(true, "", camera);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, null);
        });
}

const buscarPorNomeApi = (nome: string, callback: CallBackCarregar) => {
    apiCamera.get(`/nome/${encodeURIComponent(nome)}`)
        .then((response: AxiosResponse<CameraDto[]>) => {
            const lista: Camera[] = response.data.map((dto: CameraDto) => ({
                idCamera: dto.idCamera,
                nomeCamera: dto.nomeCamera,
                ipCamera: dto.ipCamera,
                status: dto.status as any,
                posX: dto.posX,
                posY: dto.posY
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorStatusApi = (status: string, callback: CallBackCarregar) => {
    apiCamera.get(`/status/${encodeURIComponent(status)}`)
        .then((response: AxiosResponse<CameraDto[]>) => {
            const lista: Camera[] = response.data.map((dto: CameraDto) => ({
                idCamera: dto.idCamera,
                nomeCamera: dto.nomeCamera,
                ipCamera: dto.ipCamera,
                status: dto.status as any,
                posX: dto.posX,
                posY: dto.posY
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

export {
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdApi, buscarPorNomeApi, buscarPorStatusApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar
};
