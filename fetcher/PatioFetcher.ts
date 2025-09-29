import { Patio, PatioDto, PatioCreateDto, PatioUpdateDto } from '../model';
import axios, { AxiosResponse } from 'axios';

const apiPatio = axios.create({ 
    baseURL: "https://mottracker-dotnet.onrender.com/api/v1/patio"
});

interface CallBackSalvar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackCarregar {
    (sucesso: boolean, mensagem: string, lista: Patio[]): void
}

interface CallBackApagar {
    (sucesso: boolean, mensagem: string): void
}

interface CallBackAtualizar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackBuscar {
    (sucesso: boolean, mensagem: string, item: Patio | null): void
}

interface CallBackAtualizarMotosCameras {
    (sucesso: boolean, mensagem: string): void
}

const salvarApi = (patio: PatioCreateDto, callback: CallBackSalvar) => {
    apiPatio.post("", patio)
        .then(() => {
            callback(true, "Pátio salvo com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const apagarApi = (id: number, callback: CallBackApagar) => {
    apiPatio.delete(`/${id}`)
        .then(() => {
            callback(true, "Pátio removido com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const atualizarApi = (id: number, patio: PatioUpdateDto, callback: CallBackAtualizar) => {
    apiPatio.put(`/${id}`, patio)
        .then(() => {
            callback(true, "Pátio atualizado com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const carregarApi = (callback: CallBackCarregar) => {
    // Buscar todos os pátios (deslocamento=0, registros=100 para pegar todos)
    apiPatio.get("?Deslocamento=0&RegistrosRetornado=100")
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
            
            const lista: Patio[] = dataToMap.map((dto: any) => ({
                idPatio: dto.idPatio,
                nomePatio: dto.nomePatio,
                motosTotaisPatio: dto.motosTotaisPatio,
                motosDisponiveisPatio: dto.motosDisponiveisPatio,
                dataPatio: new Date(dto.dataPatio),
                motosPatioAtual: dto.motosPatioAtual || [],
                camerasPatio: dto.camerasPatio || []
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorIdApi = (id: number, callback: CallBackBuscar) => {
    apiPatio.get(`/${id}`)
        .then((response: AxiosResponse<any>) => {
            const patio: Patio = {
                idPatio: response.data.idPatio,
                nomePatio: response.data.nomePatio,
                motosTotaisPatio: response.data.motosTotaisPatio,
                motosDisponiveisPatio: response.data.motosDisponiveisPatio,
                dataPatio: new Date(response.data.dataPatio),
                motosPatioAtual: response.data.motosPatioAtual || [],
                camerasPatio: response.data.camerasPatio || []
            };
            callback(true, "", patio);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, null);
        });
}

const buscarPorNomeApi = (nome: string, callback: CallBackCarregar) => {
    apiPatio.get(`/nome/${encodeURIComponent(nome)}`)
        .then((response: AxiosResponse<PatioDto[]>) => {
            const lista: Patio[] = response.data.map((dto: any) => ({
                idPatio: dto.idPatio,
                nomePatio: dto.nomePatio,
                motosTotaisPatio: dto.motosTotaisPatio,
                motosDisponiveisPatio: dto.motosDisponiveisPatio,
                dataPatio: new Date(dto.dataPatio)
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarMotosDisponiveisMaiorQueApi = (quantidade: number, callback: CallBackCarregar) => {
    apiPatio.get(`/motos-disponiveis/${quantidade}`)
        .then((response: AxiosResponse<PatioDto[]>) => {
            const lista: Patio[] = response.data.map((dto: any) => ({
                idPatio: dto.idPatio,
                nomePatio: dto.nomePatio,
                motosTotaisPatio: dto.motosTotaisPatio,
                motosDisponiveisPatio: dto.motosDisponiveisPatio,
                dataPatio: new Date(dto.dataPatio)
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarDataPosteriorApi = (data: string, callback: CallBackCarregar) => {
    apiPatio.get(`/data-posterior?data=${encodeURIComponent(data)}`)
        .then((response: AxiosResponse<PatioDto[]>) => {
            const lista: Patio[] = response.data.map((dto: any) => ({
                idPatio: dto.idPatio,
                nomePatio: dto.nomePatio,
                motosTotaisPatio: dto.motosTotaisPatio,
                motosDisponiveisPatio: dto.motosDisponiveisPatio,
                dataPatio: new Date(dto.dataPatio)
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarDataAnteriorApi = (data: string, callback: CallBackCarregar) => {
    apiPatio.get(`/data-anterior?data=${encodeURIComponent(data)}`)
        .then((response: AxiosResponse<PatioDto[]>) => {
            const lista: Patio[] = response.data.map((dto: any) => ({
                idPatio: dto.idPatio,
                nomePatio: dto.nomePatio,
                motosTotaisPatio: dto.motosTotaisPatio,
                motosDisponiveisPatio: dto.motosDisponiveisPatio,
                dataPatio: new Date(dto.dataPatio)
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const atualizarMotosCamerasApi = (idPatio: number, motosIds: number[], camerasIds: number[], callback: CallBackAtualizarMotosCameras) => {
    // Por enquanto, vamos apenas simular sucesso
    // Em uma implementação real, isso seria uma chamada para o backend
    // Para implementar, seria necessário:
    // 1. Criar endpoint PUT /api/v1/patio/{id}/motos
    // 2. Criar endpoint PUT /api/v1/patio/{id}/cameras
    // 3. Ou atualizar individualmente cada moto com motoPatioAtualId
    
    // Simular sucesso por enquanto
    callback(true, "Motos e câmeras do pátio atualizadas com sucesso (simulado)");
}

export {
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdApi, buscarPorNomeApi, 
    buscarMotosDisponiveisMaiorQueApi, buscarDataPosteriorApi, buscarDataAnteriorApi,
    atualizarMotosCamerasApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar, CallBackAtualizarMotosCameras
};


