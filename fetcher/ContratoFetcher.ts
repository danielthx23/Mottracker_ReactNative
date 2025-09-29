import { Contrato, ContratoDto, ContratoCreateDto, ContratoUpdateDto } from '../model';
import axios, { AxiosResponse } from 'axios';

const apiContrato = axios.create({ 
    baseURL: "https://mottracker-dotnet.onrender.com/api/v1/contrato"
});

interface CallBackSalvar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackCarregar {
    (sucesso: boolean, mensagem: string, lista: Contrato[]): void
}

interface CallBackApagar {
    (sucesso: boolean, mensagem: string): void
}

interface CallBackAtualizar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackBuscar {
    (sucesso: boolean, mensagem: string, item: Contrato | null): void
}

const salvarApi = (contrato: ContratoCreateDto, callback: CallBackSalvar) => {
    apiContrato.post("", contrato)
        .then(() => {
            callback(true, "Contrato salvo com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const apagarApi = (id: number, callback: CallBackApagar) => {
    apiContrato.delete(`/${id}`)
        .then(() => {
            callback(true, "Contrato removido com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const atualizarApi = (id: number, contrato: ContratoUpdateDto, callback: CallBackAtualizar) => {
    apiContrato.put(`/${id}`, contrato)
        .then(() => {
            callback(true, "Contrato atualizado com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const carregarApi = (callback: CallBackCarregar) => {
    apiContrato.get("")
        .then((response: AxiosResponse<ContratoDto[]>) => {
            const lista: Contrato[] = response.data.map((dto: any) => ({
                idContrato: dto.idContrato,
                ativoContrato: dto.ativoContrato,
                dataEntradaContrato: new Date(dto.dataEntradaContrato),
                dataSaidaContrato: dto.dataSaidaContrato ? new Date(dto.dataSaidaContrato) : undefined,
                renovacaoAutomaticaContrato: dto.renovacaoAutomaticaContrato,
                usuarioId: dto.usuarioId,
                motoId: dto.motoId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorIdApi = (id: number, callback: CallBackBuscar) => {
    apiContrato.get(`/${id}`)
        .then((response: AxiosResponse<ContratoDto>) => {
            const contrato: Contrato = {
                idContrato: response.data.idContrato,
                ativoContrato: response.data.ativoContrato,
                dataEntradaContrato: new Date(response.data.dataEntradaContrato),
                dataSaidaContrato: response.data.dataSaidaContrato ? new Date(response.data.dataSaidaContrato) : undefined,
                renovacaoAutomaticaContrato: response.data.renovacaoAutomaticaContrato,
                usuarioId: response.data.usuarioId,
                motoId: response.data.motoId
            };
            callback(true, "", contrato);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, null);
        });
}

const buscarPorAtivoApi = (ativo: boolean, callback: CallBackCarregar) => {
    apiContrato.get(`/ativo/${ativo}`)
        .then((response: AxiosResponse<ContratoDto[]>) => {
            const lista: Contrato[] = response.data.map((dto: any) => ({
                idContrato: dto.idContrato,
                ativoContrato: dto.ativoContrato,
                dataEntradaContrato: new Date(dto.dataEntradaContrato),
                dataSaidaContrato: dto.dataSaidaContrato ? new Date(dto.dataSaidaContrato) : undefined,
                renovacaoAutomaticaContrato: dto.renovacaoAutomaticaContrato,
                usuarioId: dto.usuarioId,
                motoId: dto.motoId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorUsuarioApi = (usuarioId: number, callback: CallBackCarregar) => {
    apiContrato.get(`/usuario/${usuarioId}`)
        .then((response: AxiosResponse<ContratoDto[]>) => {
            const lista: Contrato[] = response.data.map((dto: any) => ({
                idContrato: dto.idContrato,
                ativoContrato: dto.ativoContrato,
                dataEntradaContrato: new Date(dto.dataEntradaContrato),
                dataSaidaContrato: dto.dataSaidaContrato ? new Date(dto.dataSaidaContrato) : undefined,
                renovacaoAutomaticaContrato: dto.renovacaoAutomaticaContrato,
                usuarioId: dto.usuarioId,
                motoId: dto.motoId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorMotoApi = (motoId: number, callback: CallBackCarregar) => {
    apiContrato.get(`/moto/${motoId}`)
        .then((response: AxiosResponse<ContratoDto[]>) => {
            const lista: Contrato[] = response.data.map((dto: any) => ({
                idContrato: dto.idContrato,
                ativoContrato: dto.ativoContrato,
                dataEntradaContrato: new Date(dto.dataEntradaContrato),
                dataSaidaContrato: dto.dataSaidaContrato ? new Date(dto.dataSaidaContrato) : undefined,
                renovacaoAutomaticaContrato: dto.renovacaoAutomaticaContrato,
                usuarioId: dto.usuarioId,
                motoId: dto.motoId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarNaoExpiradosApi = (callback: CallBackCarregar) => {
    apiContrato.get("/nao-expirados")
        .then((response: AxiosResponse<ContratoDto[]>) => {
            const lista: Contrato[] = response.data.map((dto: any) => ({
                idContrato: dto.idContrato,
                ativoContrato: dto.ativoContrato,
                dataEntradaContrato: new Date(dto.dataEntradaContrato),
                dataSaidaContrato: dto.dataSaidaContrato ? new Date(dto.dataSaidaContrato) : undefined,
                renovacaoAutomaticaContrato: dto.renovacaoAutomaticaContrato,
                usuarioId: dto.usuarioId,
                motoId: dto.motoId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarRenovacaoAutomaticaApi = (renovacao: boolean, callback: CallBackCarregar) => {
    apiContrato.get(`/renovacao-automatica/${renovacao}`)
        .then((response: AxiosResponse<ContratoDto[]>) => {
            const lista: Contrato[] = response.data.map((dto: any) => ({
                idContrato: dto.idContrato,
                ativoContrato: dto.ativoContrato,
                dataEntradaContrato: new Date(dto.dataEntradaContrato),
                dataSaidaContrato: dto.dataSaidaContrato ? new Date(dto.dataSaidaContrato) : undefined,
                renovacaoAutomaticaContrato: dto.renovacaoAutomaticaContrato,
                usuarioId: dto.usuarioId,
                motoId: dto.motoId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorDataEntradaApi = (dataInicio: string, dataFim: string, callback: CallBackCarregar) => {
    apiContrato.get(`/por-data-entrada?dataInicio=${encodeURIComponent(dataInicio)}&dataFim=${encodeURIComponent(dataFim)}`)
        .then((response: AxiosResponse<ContratoDto[]>) => {
            const lista: Contrato[] = response.data.map((dto: any) => ({
                idContrato: dto.idContrato,
                ativoContrato: dto.ativoContrato,
                dataEntradaContrato: new Date(dto.dataEntradaContrato),
                dataSaidaContrato: dto.dataSaidaContrato ? new Date(dto.dataSaidaContrato) : undefined,
                renovacaoAutomaticaContrato: dto.renovacaoAutomaticaContrato,
                usuarioId: dto.usuarioId,
                motoId: dto.motoId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

export {
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdApi, buscarPorAtivoApi, 
    buscarPorUsuarioApi, buscarPorMotoApi, buscarNaoExpiradosApi, buscarRenovacaoAutomaticaApi, buscarPorDataEntradaApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar
};


