import { Permissao, PermissaoDto, PermissaoCreateDto, PermissaoUpdateDto } from '../model';
import axios, { AxiosResponse } from 'axios';

const apiPermissao = axios.create({ 
    baseURL: "https://mottracker-dotnet.onrender.com/api/v1/permissao"
});

interface CallBackSalvar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackCarregar {
    (sucesso: boolean, mensagem: string, lista: Permissao[]): void
}

interface CallBackApagar {
    (sucesso: boolean, mensagem: string): void
}

interface CallBackAtualizar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackBuscar {
    (sucesso: boolean, mensagem: string, item: Permissao | null): void
}

const salvarApi = (permissao: PermissaoCreateDto, callback: CallBackSalvar) => {
    console.log("salvarApi(): acionado");
    apiPermissao.post("", permissao)
        .then(() => {
            callback(true, "Permissão salva com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const apagarApi = (id: number, callback: CallBackApagar) => {
    console.log("apagarApi(): acionado");
    apiPermissao.delete(`/${id}`)
        .then(() => {
            callback(true, "Permissão removida com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const atualizarApi = (id: number, permissao: PermissaoUpdateDto, callback: CallBackAtualizar) => {
    console.log("atualizarApi(): acionado");
    apiPermissao.put(`/${id}`, permissao)
        .then(() => {
            callback(true, "Permissão atualizada com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const carregarApi = (callback: CallBackCarregar) => {
    apiPermissao.get("")
        .then((response: AxiosResponse<PermissaoDto[]>) => {
            const lista: Permissao[] = response.data.map((dto: any) => ({
                idPermissao: dto.idPermissao,
                nomePermissao: dto.nomePermissao,
                descricaoPermissao: dto.descricaoPermissao
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorIdApi = (id: number, callback: CallBackBuscar) => {
    console.log("buscarPorIdApi(): acionado");
    apiPermissao.get(`/${id}`)
        .then((response: AxiosResponse<PermissaoDto>) => {
            const permissao: Permissao = {
                idPermissao: response.data.idPermissao,
                nomePermissao: response.data.nomePermissao,
                descricaoPermissao: response.data.descricaoPermissao
            };
            callback(true, "", permissao);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, null);
        });
}

const buscarPorNomeApi = (nome: string, callback: CallBackCarregar) => {
    console.log("buscarPorNomeApi(): acionado");
    apiPermissao.get(`/nome/${encodeURIComponent(nome)}`)
        .then((response: AxiosResponse<PermissaoDto[]>) => {
            const lista: Permissao[] = response.data.map((dto: any) => ({
                idPermissao: dto.idPermissao,
                nomePermissao: dto.nomePermissao,
                descricaoPermissao: dto.descricaoPermissao
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorDescricaoApi = (descricao: string, callback: CallBackCarregar) => {
    console.log("buscarPorDescricaoApi(): acionado");
    apiPermissao.get(`/descricao/${encodeURIComponent(descricao)}`)
        .then((response: AxiosResponse<PermissaoDto[]>) => {
            const lista: Permissao[] = response.data.map((dto: any) => ({
                idPermissao: dto.idPermissao,
                nomePermissao: dto.nomePermissao,
                descricaoPermissao: dto.descricaoPermissao
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

export {
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdApi, buscarPorNomeApi, buscarPorDescricaoApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar
};


