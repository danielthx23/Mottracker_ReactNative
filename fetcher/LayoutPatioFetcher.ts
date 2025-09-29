import { LayoutPatio, LayoutPatioDto, LayoutPatioCreateDto, LayoutPatioUpdateDto } from '../model';
import axios, { AxiosResponse } from 'axios';

const apiLayoutPatio = axios.create({ 
    baseURL: "https://mottracker-dotnet.onrender.com/api/v1/layout-patio"
});

interface CallBackSalvar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackCarregar {
    (sucesso: boolean, mensagem: string, lista: LayoutPatio[]): void
}

interface CallBackApagar {
    (sucesso: boolean, mensagem: string): void
}

interface CallBackAtualizar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackBuscar {
    (sucesso: boolean, mensagem: string, item: LayoutPatio | null): void
}

const salvarApi = (layoutPatio: LayoutPatioCreateDto, callback: CallBackSalvar) => {
    console.log("salvarApi(): acionado");
    apiLayoutPatio.post("", layoutPatio)
        .then(() => {
            callback(true, "Layout de pátio salvo com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const apagarApi = (id: number, callback: CallBackApagar) => {
    console.log("apagarApi(): acionado");
    apiLayoutPatio.delete(`/${id}`)
        .then(() => {
            callback(true, "Layout de pátio removido com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const atualizarApi = (id: number, layoutPatio: LayoutPatioUpdateDto, callback: CallBackAtualizar) => {
    console.log("atualizarApi(): acionado");
    apiLayoutPatio.put(`/${id}`, layoutPatio)
        .then(() => {
            callback(true, "Layout de pátio atualizado com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const carregarApi = (callback: CallBackCarregar) => {
    apiLayoutPatio.get("")
        .then((response: AxiosResponse<LayoutPatioDto[]>) => {
            const lista: LayoutPatio[] = response.data.map((dto: any) => ({
                idLayoutPatio: dto.idLayoutPatio,
                nomeLayoutPatio: dto.nomeLayoutPatio,
                descricaoLayoutPatio: dto.descricaoLayoutPatio,
                dataCriacaoLayoutPatio: new Date(dto.dataCriacaoLayoutPatio),
                patioId: dto.patioId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorIdApi = (id: number, callback: CallBackBuscar) => {
    console.log("buscarPorIdApi(): acionado");
    apiLayoutPatio.get(`/${id}`)
        .then((response: AxiosResponse<LayoutPatioDto>) => {
            const layoutPatio: LayoutPatio = {
                idLayoutPatio: response.data.idLayoutPatio,
                nomeLayoutPatio: response.data.nomeLayoutPatio,
                descricaoLayoutPatio: response.data.descricaoLayoutPatio,
                dataCriacaoLayoutPatio: new Date(response.data.dataCriacaoLayoutPatio),
                patioId: response.data.patioId
            };
            callback(true, "", layoutPatio);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, null);
        });
}

const buscarPorPatioApi = (patioId: number, callback: CallBackCarregar) => {
    console.log("buscarPorPatioApi(): acionado");
    apiLayoutPatio.get(`/patio/${patioId}`)
        .then((response: AxiosResponse<LayoutPatioDto[]>) => {
            const lista: LayoutPatio[] = response.data.map((dto: any) => ({
                idLayoutPatio: dto.idLayoutPatio,
                nomeLayoutPatio: dto.nomeLayoutPatio,
                descricaoLayoutPatio: dto.descricaoLayoutPatio,
                dataCriacaoLayoutPatio: new Date(dto.dataCriacaoLayoutPatio),
                patioId: dto.patioId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorDataCriacaoApi = (dataInicio: string, dataFim: string, callback: CallBackCarregar) => {
    console.log("buscarPorDataCriacaoApi(): acionado");
    apiLayoutPatio.get(`/data-criacao?dataCriacao=${encodeURIComponent(dataInicio)}`)
        .then((response: AxiosResponse<LayoutPatioDto[]>) => {
            const lista: LayoutPatio[] = response.data.map((dto: any) => ({
                idLayoutPatio: dto.idLayoutPatio,
                nomeLayoutPatio: dto.nomeLayoutPatio,
                descricaoLayoutPatio: dto.descricaoLayoutPatio,
                dataCriacaoLayoutPatio: new Date(dto.dataCriacaoLayoutPatio),
                patioId: dto.patioId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

export {
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdApi, buscarPorPatioApi, buscarPorDataCriacaoApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar
};


