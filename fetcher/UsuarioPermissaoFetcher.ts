import { UsuarioPermissao, UsuarioPermissaoDto, UsuarioPermissaoCreateDto, UsuarioPermissaoUpdateDto } from '../model';
import axios, { AxiosResponse } from 'axios';

const apiUsuarioPermissao = axios.create({ 
    baseURL: "https://mottracker-dotnet.onrender.com/api/v1/usuario-permissao"
});

interface CallBackSalvar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackCarregar {
    (sucesso: boolean, mensagem: string, lista: UsuarioPermissao[]): void
}

interface CallBackApagar {
    (sucesso: boolean, mensagem: string): void
}

interface CallBackAtualizar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackBuscar {
    (sucesso: boolean, mensagem: string, item: UsuarioPermissao | null): void
}

const salvarApi = (usuarioPermissao: UsuarioPermissaoCreateDto, callback: CallBackSalvar) => {
    console.log("salvarApi(): acionado");
    apiUsuarioPermissao.post("", usuarioPermissao)
        .then(() => {
            callback(true, "Permissão de usuário salva com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const apagarApi = (usuarioId: number, permissaoId: number, callback: CallBackApagar) => {
    console.log("apagarApi(): acionado");
    apiUsuarioPermissao.delete(`/usuario/${usuarioId}/permissao/${permissaoId}`)
        .then(() => {
            callback(true, "Permissão de usuário removida com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const atualizarApi = (usuarioId: number, permissaoId: number, usuarioPermissao: UsuarioPermissaoUpdateDto, callback: CallBackAtualizar) => {
    console.log("atualizarApi(): acionado");
    apiUsuarioPermissao.put(`/usuario/${usuarioId}/permissao/${permissaoId}`, usuarioPermissao)
        .then(() => {
            callback(true, "Permissão de usuário atualizada com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const carregarApi = (callback: CallBackCarregar) => {
    apiUsuarioPermissao.get("")
        .then((response: AxiosResponse<UsuarioPermissaoDto[]>) => {
            const lista: UsuarioPermissao[] = response.data.map((dto: any) => ({
                usuarioId: dto.usuarioId,
                permissaoId: dto.permissaoId,
                dataAtribuicao: new Date(dto.dataAtribuicao)
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorIdCompostoApi = (usuarioId: number, permissaoId: number, callback: CallBackBuscar) => {
    console.log("buscarPorIdCompostoApi(): acionado");
    apiUsuarioPermissao.get(`/usuario/${usuarioId}/permissao/${permissaoId}`)
        .then((response: AxiosResponse<UsuarioPermissaoDto>) => {
            const usuarioPermissao: UsuarioPermissao = {
                usuarioId: response.data.usuarioId,
                permissaoId: response.data.permissaoId,
                dataAtribuicao: new Date(response.data.dataAtribuicao)
            };
            callback(true, "", usuarioPermissao);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, null);
        });
}

const buscarPorUsuarioApi = (usuarioId: number, callback: CallBackCarregar) => {
    console.log("buscarPorUsuarioApi(): acionado");
    apiUsuarioPermissao.get(`/usuario/${usuarioId}`)
        .then((response: AxiosResponse<UsuarioPermissaoDto[]>) => {
            const lista: UsuarioPermissao[] = response.data.map((dto: any) => ({
                usuarioId: dto.usuarioId,
                permissaoId: dto.permissaoId,
                dataAtribuicao: new Date(dto.dataAtribuicao)
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorPermissaoApi = (permissaoId: number, callback: CallBackCarregar) => {
    console.log("buscarPorPermissaoApi(): acionado");
    apiUsuarioPermissao.get(`/permissao/${permissaoId}`)
        .then((response: AxiosResponse<UsuarioPermissaoDto[]>) => {
            const lista: UsuarioPermissao[] = response.data.map((dto: any) => ({
                usuarioId: dto.usuarioId,
                permissaoId: dto.permissaoId,
                dataAtribuicao: new Date(dto.dataAtribuicao)
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

export {
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdCompostoApi, 
    buscarPorUsuarioApi, buscarPorPermissaoApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar
};


