import { Telefone, TelefoneDto, TelefoneCreateDto, TelefoneUpdateDto, TipoTelefone } from '../model';
import axios, { AxiosResponse } from 'axios';

const apiTelefone = axios.create({ 
    baseURL: "https://mottracker-dotnet.onrender.com/api/v1/telefone"
});

interface CallBackSalvar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackCarregar {
    (sucesso: boolean, mensagem: string, lista: Telefone[]): void
}

interface CallBackApagar {
    (sucesso: boolean, mensagem: string): void
}

interface CallBackAtualizar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackBuscar {
    (sucesso: boolean, mensagem: string, item: Telefone | null): void
}

const salvarApi = (telefone: TelefoneCreateDto, callback: CallBackSalvar) => {
    console.log("salvarApi(): acionado");
    apiTelefone.post("", telefone)
        .then(() => {
            callback(true, "Telefone salvo com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const apagarApi = (id: number, callback: CallBackApagar) => {
    console.log("apagarApi(): acionado");
    apiTelefone.delete(`/${id}`)
        .then(() => {
            callback(true, "Telefone removido com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const atualizarApi = (id: number, telefone: TelefoneUpdateDto, callback: CallBackAtualizar) => {
    console.log("atualizarApi(): acionado");
    apiTelefone.put(`/${id}`, telefone)
        .then(() => {
            callback(true, "Telefone atualizado com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const carregarApi = (callback: CallBackCarregar) => {
    apiTelefone.get("")
        .then((response: AxiosResponse<TelefoneDto[]>) => {
            const lista: Telefone[] = response.data.map((dto: any) => ({
                idTelefone: dto.idTelefone,
                numeroTelefone: dto.numeroTelefone,
                tipoTelefone: dto.tipoTelefone as TipoTelefone,
                usuarioId: dto.usuarioId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorIdApi = (id: number, callback: CallBackBuscar) => {
    console.log("buscarPorIdApi(): acionado");
    apiTelefone.get(`/${id}`)
        .then((response: AxiosResponse<TelefoneDto>) => {
            const telefone: Telefone = {
                idTelefone: response.data.idTelefone,
                numeroTelefone: response.data.numeroTelefone,
                tipoTelefone: response.data.tipoTelefone as TipoTelefone,
                usuarioId: response.data.usuarioId
            };
            callback(true, "", telefone);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, null);
        });
}

const buscarPorNumeroApi = (numero: string, callback: CallBackCarregar) => {
    console.log("buscarPorNumeroApi(): acionado");
    apiTelefone.get(`/numero/${encodeURIComponent(numero)}`)
        .then((response: AxiosResponse<TelefoneDto[]>) => {
            const lista: Telefone[] = response.data.map((dto: any) => ({
                idTelefone: dto.idTelefone,
                numeroTelefone: dto.numeroTelefone,
                tipoTelefone: dto.tipoTelefone as TipoTelefone,
                usuarioId: dto.usuarioId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorUsuarioApi = (usuarioId: number, callback: CallBackCarregar) => {
    console.log("buscarPorUsuarioApi(): acionado");
    apiTelefone.get(`/usuario/${usuarioId}`)
        .then((response: AxiosResponse<TelefoneDto[]>) => {
            const lista: Telefone[] = response.data.map((dto: any) => ({
                idTelefone: dto.idTelefone,
                numeroTelefone: dto.numeroTelefone,
                tipoTelefone: dto.tipoTelefone as TipoTelefone,
                usuarioId: dto.usuarioId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorTipoApi = (tipo: string, callback: CallBackCarregar) => {
    console.log("buscarPorTipoApi(): acionado");
    apiTelefone.get(`/tipo/${encodeURIComponent(tipo)}`)
        .then((response: AxiosResponse<TelefoneDto[]>) => {
            const lista: Telefone[] = response.data.map((dto: any) => ({
                idTelefone: dto.idTelefone,
                numeroTelefone: dto.numeroTelefone,
                tipoTelefone: dto.tipoTelefone as TipoTelefone,
                usuarioId: dto.usuarioId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

export {
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdApi, buscarPorNumeroApi, 
    buscarPorUsuarioApi, buscarPorTipoApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar
};


