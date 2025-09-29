import { Usuario, UsuarioDto, UsuarioCreateDto, UsuarioUpdateDto, UsuarioLoginDto, UsuarioLoginResponseDto } from '../model';
import axios, { AxiosResponse } from 'axios';

const apiUsuario = axios.create({ 
    baseURL: "https://mottracker-dotnet.onrender.com/api/v1/usuario"
});

interface CallBackSalvar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackCarregar {
    (sucesso: boolean, mensagem: string, lista: Usuario[]): void
}

interface CallBackApagar {
    (sucesso: boolean, mensagem: string): void
}

interface CallBackAtualizar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackBuscar {
    (sucesso: boolean, mensagem: string, item: Usuario | null): void
}

interface CallBackLogin {
    (sucesso: boolean, mensagem: string, usuario: Usuario | null, token: string | null): void
}

const salvarApi = (usuario: UsuarioCreateDto, callback: CallBackSalvar) => {
    
    // Converter UsuarioCreateDto para Usuario completo
    const usuarioCompleto = {
        idUsuario: 0,
        nomeUsuario: usuario.nomeUsuario,
        cpfUsuario: usuario.cpfUsuario,
        senhaUsuario: usuario.senhaUsuario,
        cnhUsuario: usuario.cnhUsuario,
        emailUsuario: usuario.emailUsuario,
        tokenUsuario: "token123", // Será gerado pelo backend - null em vez de string vazia
        dataNascimentoUsuario: new Date(usuario.dataNascimentoUsuario).toISOString(),
        criadoEmUsuario: new Date().toISOString()
    };
    
    
    apiUsuario.post("", usuarioCompleto)
        .then((response) => {
            callback(true, "Usuário salvo com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message || "Erro interno do servidor");
        });
}

const apagarApi = (id: number, callback: CallBackApagar) => {
    apiUsuario.delete(`/${id}`)
        .then(() => {
            callback(true, "Usuário removido com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const atualizarApi = (id: number, usuario: UsuarioUpdateDto, callback: CallBackAtualizar) => {
    apiUsuario.put(`/${id}`, usuario)
        .then(() => {
            callback(true, "Usuário atualizado com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const carregarApi = (callback: CallBackCarregar) => {
    apiUsuario.get("")
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
            
            const lista: Usuario[] = dataToMap.map((dto: any) => ({
                idUsuario: dto.idUsuario,
                nomeUsuario: dto.nomeUsuario,
                cpfUsuario: dto.cpfUsuario,
                senhaUsuario: dto.senhaUsuario,
                cnhUsuario: dto.cnhUsuario,
                emailUsuario: dto.emailUsuario,
                tokenUsuario: dto.tokenUsuario,
                dataNascimentoUsuario: new Date(dto.dataNascimentoUsuario),
                criadoEmUsuario: new Date(dto.criadoEmUsuario)
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorIdApi = (id: number, callback: CallBackBuscar) => {
    apiUsuario.get(`/${id}`)
        .then((response: AxiosResponse<UsuarioDto>) => {
            const usuario: Usuario = {
                idUsuario: response.data.idUsuario,
                nomeUsuario: response.data.nomeUsuario,
                cpfUsuario: response.data.cpfUsuario,
                senhaUsuario: response.data.senhaUsuario,
                cnhUsuario: response.data.cnhUsuario,
                emailUsuario: response.data.emailUsuario,
                tokenUsuario: response.data.tokenUsuario,
                dataNascimentoUsuario: new Date(response.data.dataNascimentoUsuario),
                criadoEmUsuario: new Date(response.data.criadoEmUsuario)
            };
            callback(true, "", usuario);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, null);
        });
}

const buscarPorEmailApi = (email: string, callback: CallBackBuscar) => {
    apiUsuario.get(`/email/${encodeURIComponent(email)}`)
        .then((response: AxiosResponse<UsuarioDto>) => {
            const usuario: Usuario = {
                idUsuario: response.data.idUsuario,
                nomeUsuario: response.data.nomeUsuario,
                cpfUsuario: response.data.cpfUsuario,
                senhaUsuario: response.data.senhaUsuario,
                cnhUsuario: response.data.cnhUsuario,
                emailUsuario: response.data.emailUsuario,
                tokenUsuario: response.data.tokenUsuario,
                dataNascimentoUsuario: new Date(response.data.dataNascimentoUsuario),
                criadoEmUsuario: new Date(response.data.criadoEmUsuario)
            };
            callback(true, "", usuario);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, null);
        });
}

const loginApi = (loginData: UsuarioLoginDto, callback: CallBackLogin) => {
    apiUsuario.post("/login", loginData)
        .then((response: AxiosResponse<any>) => {
            // A API retorna os dados em response.data.data
            const apiData = response.data.data;
            
            if (!apiData) {
                callback(false, "Resposta da API não contém dados do usuário", null, null);
                return;
            }
            
            
            const usuario: Usuario = {
                idUsuario: apiData.idUsuario,
                nomeUsuario: apiData.nomeUsuario,
                cpfUsuario: apiData.cpfUsuario || "", // Pode não estar na resposta
                senhaUsuario: "", // Não retornamos a senha por segurança
                cnhUsuario: apiData.cnhUsuario || "", // Pode não estar na resposta
                emailUsuario: apiData.emailUsuario,
                tokenUsuario: apiData.tokenUsuario,
                dataNascimentoUsuario: new Date(apiData.dataNascimentoUsuario),
                criadoEmUsuario: new Date(apiData.criadoEmUsuario)
            };
            
            callback(true, apiData.mensagem || "Login realizado com sucesso", usuario, apiData.tokenUsuario);
        })
        .catch((erro: any) => {
            
            // Tratamento específico para diferentes tipos de erro
            let mensagemErro = "Erro interno do servidor";
            
            if (erro.response?.status === 500) {
                mensagemErro = "Erro interno do servidor. Tente novamente em alguns minutos.";
            } else if (erro.response?.status === 401) {
                mensagemErro = "E-mail ou senha incorretos";
            } else if (erro.response?.status === 400) {
                mensagemErro = "Dados inválidos. Verifique e-mail e senha.";
            } else if (erro.response?.status === 404) {
                mensagemErro = "Serviço não encontrado. Verifique sua conexão.";
            } else if (erro.response?.data?.message) {
                mensagemErro = erro.response.data.message;
            } else if (erro.message) {
                mensagemErro = erro.message;
            }
            
            callback(false, mensagemErro, null, null);
        });
}

export {
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdApi, buscarPorEmailApi, loginApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar, CallBackLogin
};


