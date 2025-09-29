import { Endereco, EnderecoDto, EnderecoCreateDto, EnderecoUpdateDto } from '../model';
import axios, { AxiosResponse } from 'axios';

const apiEndereco = axios.create({ 
    baseURL: "https://mottracker-dotnet.onrender.com/api/v1/endereco"
});

interface CallBackSalvar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackCarregar {
    (sucesso: boolean, mensagem: string, lista: Endereco[]): void
}

interface CallBackApagar {
    (sucesso: boolean, mensagem: string): void
}

interface CallBackAtualizar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackBuscar {
    (sucesso: boolean, mensagem: string, item: Endereco | null): void
}

const salvarApi = (endereco: EnderecoCreateDto, callback: CallBackSalvar) => {
    apiEndereco.post("", endereco)
        .then(() => {
            callback(true, "Endereço salvo com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const apagarApi = (id: number, callback: CallBackApagar) => {
    console.log("apagarApi(): acionado");
    apiEndereco.delete(`/${id}`)
        .then(() => {
            callback(true, "Endereço removido com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const atualizarApi = (id: number, endereco: EnderecoUpdateDto, callback: CallBackAtualizar) => {
    console.log("atualizarApi(): acionado");
    apiEndereco.put(`/${id}`, endereco)
        .then(() => {
            callback(true, "Endereço atualizado com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const carregarApi = (callback: CallBackCarregar) => {
    apiEndereco.get("")
        .then((response: AxiosResponse<EnderecoDto[]>) => {
            const lista: Endereco[] = response.data.map((dto: any) => ({
                idEndereco: dto.idEndereco,
                cepEndereco: dto.cepEndereco,
                logradouroEndereco: dto.logradouroEndereco,
                numeroEndereco: dto.numeroEndereco,
                bairroEndereco: dto.bairroEndereco,
                cidadeEndereco: dto.cidadeEndereco,
                estadoEndereco: dto.estadoEndereco,
                complementoEndereco: dto.complementoEndereco,
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
    apiEndereco.get(`/${id}`)
        .then((response: AxiosResponse<EnderecoDto>) => {
            const endereco: Endereco = {
                idEndereco: response.data.idEndereco,
                cepEndereco: response.data.cepEndereco,
                logradouroEndereco: response.data.logradouroEndereco,
                numeroEndereco: response.data.numeroEndereco,
                bairroEndereco: response.data.bairroEndereco,
                cidadeEndereco: response.data.cidadeEndereco,
                estadoEndereco: response.data.estadoEndereco,
                complementoEndereco: response.data.complementoEndereco,
                patioId: response.data.patioId
            };
            callback(true, "", endereco);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, null);
        });
}

const buscarPorCepApi = (cep: string, callback: CallBackCarregar) => {
    console.log("buscarPorCepApi(): acionado");
    apiEndereco.get(`/cep/${encodeURIComponent(cep)}`)
        .then((response: AxiosResponse<EnderecoDto[]>) => {
            const lista: Endereco[] = response.data.map((dto: any) => ({
                idEndereco: dto.idEndereco,
                cepEndereco: dto.cepEndereco,
                logradouroEndereco: dto.logradouroEndereco,
                numeroEndereco: dto.numeroEndereco,
                bairroEndereco: dto.bairroEndereco,
                cidadeEndereco: dto.cidadeEndereco,
                estadoEndereco: dto.estadoEndereco,
                complementoEndereco: dto.complementoEndereco,
                patioId: dto.patioId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorEstadoApi = (estado: string, callback: CallBackCarregar) => {
    console.log("buscarPorEstadoApi(): acionado");
    apiEndereco.get(`/estado/${encodeURIComponent(estado)}`)
        .then((response: AxiosResponse<EnderecoDto[]>) => {
            const lista: Endereco[] = response.data.map((dto: any) => ({
                idEndereco: dto.idEndereco,
                cepEndereco: dto.cepEndereco,
                logradouroEndereco: dto.logradouroEndereco,
                numeroEndereco: dto.numeroEndereco,
                bairroEndereco: dto.bairroEndereco,
                cidadeEndereco: dto.cidadeEndereco,
                estadoEndereco: dto.estadoEndereco,
                complementoEndereco: dto.complementoEndereco,
                patioId: dto.patioId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorCidadeApi = (cidade: string, callback: CallBackCarregar) => {
    console.log("buscarPorCidadeApi(): acionado");
    apiEndereco.get(`/cidade/${encodeURIComponent(cidade)}`)
        .then((response: AxiosResponse<EnderecoDto[]>) => {
            const lista: Endereco[] = response.data.map((dto: any) => ({
                idEndereco: dto.idEndereco,
                cepEndereco: dto.cepEndereco,
                logradouroEndereco: dto.logradouroEndereco,
                numeroEndereco: dto.numeroEndereco,
                bairroEndereco: dto.bairroEndereco,
                cidadeEndereco: dto.cidadeEndereco,
                estadoEndereco: dto.estadoEndereco,
                complementoEndereco: dto.complementoEndereco,
                patioId: dto.patioId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorBairroApi = (bairro: string, callback: CallBackCarregar) => {
    console.log("buscarPorBairroApi(): acionado");
    apiEndereco.get(`/bairro/${encodeURIComponent(bairro)}`)
        .then((response: AxiosResponse<EnderecoDto[]>) => {
            const lista: Endereco[] = response.data.map((dto: any) => ({
                idEndereco: dto.idEndereco,
                cepEndereco: dto.cepEndereco,
                logradouroEndereco: dto.logradouroEndereco,
                numeroEndereco: dto.numeroEndereco,
                bairroEndereco: dto.bairroEndereco,
                cidadeEndereco: dto.cidadeEndereco,
                estadoEndereco: dto.estadoEndereco,
                complementoEndereco: dto.complementoEndereco,
                patioId: dto.patioId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorPatioApi = (patioId: number, callback: CallBackCarregar) => {
    console.log("buscarPorPatioApi(): acionado");
    apiEndereco.get(`/patio/${patioId}`)
        .then((response: AxiosResponse<EnderecoDto[]>) => {
            const lista: Endereco[] = response.data.map((dto: any) => ({
                idEndereco: dto.idEndereco,
                cepEndereco: dto.cepEndereco,
                logradouroEndereco: dto.logradouroEndereco,
                numeroEndereco: dto.numeroEndereco,
                bairroEndereco: dto.bairroEndereco,
                cidadeEndereco: dto.cidadeEndereco,
                estadoEndereco: dto.estadoEndereco,
                complementoEndereco: dto.complementoEndereco,
                patioId: dto.patioId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

export {
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdApi, buscarPorCepApi, 
    buscarPorEstadoApi, buscarPorCidadeApi, buscarPorBairroApi, buscarPorPatioApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar
};


