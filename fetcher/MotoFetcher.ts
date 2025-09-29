import { Moto, MotoDto, MotoCreateDto, MotoUpdateDto, Estados } from '../model';
import axios, { AxiosResponse } from 'axios';

const apiMoto = axios.create({ 
    baseURL: "https://mottracker-dotnet.onrender.com/api/v1/moto"
});

interface CallBackSalvar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackCarregar {
    (sucesso: boolean, mensagem: string, lista: Moto[]): void
}

interface CallBackApagar {
    (sucesso: boolean, mensagem: string): void
}

interface CallBackAtualizar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackBuscar {
    (sucesso: boolean, mensagem: string, item: Moto | null): void
}

const salvarApi = (moto: MotoCreateDto, callback: CallBackSalvar) => {
    apiMoto.post("", moto)
        .then(() => {
            callback(true, "Moto salva com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const apagarApi = (id: number, callback: CallBackApagar) => {
    apiMoto.delete(`/${id}`)
        .then(() => {
            callback(true, "Moto removida com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const atualizarApi = (id: number, moto: MotoUpdateDto, callback: CallBackAtualizar) => {
    apiMoto.put(`/${id}`, moto)
        .then(() => {
            callback(true, "Moto atualizada com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const carregarApi = (callback: CallBackCarregar) => {
    // Buscar todas as motos (deslocamento=0, registros=100 para pegar todas)
    apiMoto.get("?Deslocamento=0&RegistrosRetornado=100")
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
            
            const lista: Moto[] = dataToMap.map((dto: any) => {
                
                return {
                    idMoto: dto.idMoto,
                    placaMoto: dto.placaMoto,
                    modeloMoto: dto.modeloMoto,
                    anoMoto: dto.anoMoto,
                    identificadorMoto: dto.identificadorMoto,
                    quilometragemMoto: dto.quilometragemMoto,
                    estadoMoto: dto.estadoMoto as Estados,
                    condicoesMoto: dto.condicoesMoto,
                    hora: dto.hora || dto.dataHora || dto.criadoEm || dto.dataCriacao || new Date().toISOString()
                };
            });
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorIdApi = (id: number, callback: CallBackBuscar) => {
    apiMoto.get(`/${id}`)
        .then((response: AxiosResponse<MotoDto>) => {
            const moto: Moto = {
                idMoto: response.data.idMoto,
                placaMoto: response.data.placaMoto,
                modeloMoto: response.data.modeloMoto,
                anoMoto: response.data.anoMoto,
                identificadorMoto: response.data.identificadorMoto,
                quilometragemMoto: response.data.quilometragemMoto,
                estadoMoto: response.data.estadoMoto as Estados,
                condicoesMoto: response.data.condicoesMoto,
                hora: response.data.hora
            };
            callback(true, "", moto);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, null);
        });
}

const buscarPorPlacaApi = (placa: string, callback: CallBackBuscar) => {
    apiMoto.get(`/placa/${encodeURIComponent(placa)}`)
        .then((response: AxiosResponse<MotoDto>) => {
            const moto: Moto = {
                idMoto: response.data.idMoto,
                placaMoto: response.data.placaMoto,
                modeloMoto: response.data.modeloMoto,
                anoMoto: response.data.anoMoto,
                identificadorMoto: response.data.identificadorMoto,
                quilometragemMoto: response.data.quilometragemMoto,
                estadoMoto: response.data.estadoMoto as Estados,
                condicoesMoto: response.data.condicoesMoto,
                hora: response.data.hora
            };
            callback(true, "", moto);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, null);
        });
}

const buscarPorEstadoApi = (estado: string, callback: CallBackCarregar) => {
    apiMoto.get(`/estado/${encodeURIComponent(estado)}`)
        .then((response: AxiosResponse<MotoDto[]>) => {
            const lista: Moto[] = response.data.map((dto: any) => ({
                idMoto: dto.idMoto,
                placaMoto: dto.placaMoto,
                modeloMoto: dto.modeloMoto,
                anoMoto: dto.anoMoto,
                identificadorMoto: dto.identificadorMoto,
                quilometragemMoto: dto.quilometragemMoto,
                estadoMoto: dto.estadoMoto as Estados,
                condicoesMoto: dto.condicoesMoto,
                hora: dto.hora
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorContratoApi = (contratoId: number, callback: CallBackCarregar) => {
    apiMoto.get(`/contrato/${contratoId}`)
        .then((response: AxiosResponse<MotoDto[]>) => {
            const lista: Moto[] = response.data.map((dto: any) => ({
                idMoto: dto.idMoto,
                placaMoto: dto.placaMoto,
                modeloMoto: dto.modeloMoto,
                anoMoto: dto.anoMoto,
                identificadorMoto: dto.identificadorMoto,
                quilometragemMoto: dto.quilometragemMoto,
                estadoMoto: dto.estadoMoto as Estados,
                condicoesMoto: dto.condicoesMoto,
                hora: dto.hora
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

export {
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdApi, buscarPorPlacaApi, buscarPorEstadoApi, buscarPorContratoApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar
};


