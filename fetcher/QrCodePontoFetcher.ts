import { QrCodePonto, QrCodePontoDto, QrCodePontoCreateDto, QrCodePontoUpdateDto } from '../model';
import axios, { AxiosResponse } from 'axios';

const apiQrCodePonto = axios.create({ 
    baseURL: "https://mottracker-dotnet.onrender.com/api/v1/qr-code-ponto"
});

interface CallBackSalvar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackCarregar {
    (sucesso: boolean, mensagem: string, lista: QrCodePonto[]): void
}

interface CallBackApagar {
    (sucesso: boolean, mensagem: string): void
}

interface CallBackAtualizar {
    (sucesso: boolean, mensagem: string, erros?: object): void
}

interface CallBackBuscar {
    (sucesso: boolean, mensagem: string, item: QrCodePonto | null): void
}

const salvarApi = (qrCodePonto: QrCodePontoCreateDto, callback: CallBackSalvar) => {
    console.log("salvarApi(): acionado");
    apiQrCodePonto.post("", qrCodePonto)
        .then(() => {
            callback(true, "QR Code de ponto salvo com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const apagarApi = (id: number, callback: CallBackApagar) => {
    console.log("apagarApi(): acionado");
    apiQrCodePonto.delete(`/${id}`)
        .then(() => {
            callback(true, "QR Code de ponto removido com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const atualizarApi = (id: number, qrCodePonto: QrCodePontoUpdateDto, callback: CallBackAtualizar) => {
    console.log("atualizarApi(): acionado");
    apiQrCodePonto.put(`/${id}`, qrCodePonto)
        .then(() => {
            callback(true, "QR Code de ponto atualizado com sucesso");
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message);
        });
}

const carregarApi = (callback: CallBackCarregar) => {
    apiQrCodePonto.get("")
        .then((response: AxiosResponse<QrCodePontoDto[]>) => {
            const lista: QrCodePonto[] = response.data.map((dto: any) => ({
                idQrCodePonto: dto.idQrCodePonto,
                identificadorQrCodePonto: dto.identificadorQrCodePonto,
                posXQrCodePonto: dto.posXQrCodePonto,
                posYQrCodePonto: dto.posYQrCodePonto,
                layoutPatioId: dto.layoutPatioId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorIdApi = (id: number, callback: CallBackBuscar) => {
    console.log("buscarPorIdApi(): acionado");
    apiQrCodePonto.get(`/${id}`)
        .then((response: AxiosResponse<QrCodePontoDto>) => {
            const qrCodePonto: QrCodePonto = {
                idQrCodePonto: response.data.idQrCodePonto,
                identificadorQrCodePonto: response.data.identificadorQrCodePonto,
                posXQrCodePonto: response.data.posXQrCodePonto,
                posYQrCodePonto: response.data.posYQrCodePonto,
                layoutPatioId: response.data.layoutPatioId
            };
            callback(true, "", qrCodePonto);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, null);
        });
}

const buscarPorIdentificadorApi = (identificador: string, callback: CallBackBuscar) => {
    console.log("buscarPorIdentificadorApi(): acionado");
    apiQrCodePonto.get(`/identificador/${encodeURIComponent(identificador)}`)
        .then((response: AxiosResponse<QrCodePontoDto>) => {
            const qrCodePonto: QrCodePonto = {
                idQrCodePonto: response.data.idQrCodePonto,
                identificadorQrCodePonto: response.data.identificadorQrCodePonto,
                posXQrCodePonto: response.data.posXQrCodePonto,
                posYQrCodePonto: response.data.posYQrCodePonto,
                layoutPatioId: response.data.layoutPatioId
            };
            callback(true, "", qrCodePonto);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, null);
        });
}

const buscarPorLayoutPatioApi = (layoutPatioId: number, callback: CallBackCarregar) => {
    console.log("buscarPorLayoutPatioApi(): acionado");
    apiQrCodePonto.get(`/layout-patio/${layoutPatioId}`)
        .then((response: AxiosResponse<QrCodePontoDto[]>) => {
            const lista: QrCodePonto[] = response.data.map((dto: any) => ({
                idQrCodePonto: dto.idQrCodePonto,
                identificadorQrCodePonto: dto.identificadorQrCodePonto,
                posXQrCodePonto: dto.posXQrCodePonto,
                posYQrCodePonto: dto.posYQrCodePonto,
                layoutPatioId: dto.layoutPatioId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorPosXApi = (posXMin: number, posXMax: number, callback: CallBackCarregar) => {
    console.log("buscarPorPosXApi(): acionado");
    apiQrCodePonto.get(`/posicao-x?posXInicial=${posXMin}&posXFinal=${posXMax}`)
        .then((response: AxiosResponse<QrCodePontoDto[]>) => {
            const lista: QrCodePonto[] = response.data.map((dto: any) => ({
                idQrCodePonto: dto.idQrCodePonto,
                identificadorQrCodePonto: dto.identificadorQrCodePonto,
                posXQrCodePonto: dto.posXQrCodePonto,
                posYQrCodePonto: dto.posYQrCodePonto,
                layoutPatioId: dto.layoutPatioId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

const buscarPorPosYApi = (posYMin: number, posYMax: number, callback: CallBackCarregar) => {
    console.log("buscarPorPosYApi(): acionado");
    apiQrCodePonto.get(`/posicao-y?posYInicial=${posYMin}&posYFinal=${posYMax}`)
        .then((response: AxiosResponse<QrCodePontoDto[]>) => {
            const lista: QrCodePonto[] = response.data.map((dto: any) => ({
                idQrCodePonto: dto.idQrCodePonto,
                identificadorQrCodePonto: dto.identificadorQrCodePonto,
                posXQrCodePonto: dto.posXQrCodePonto,
                posYQrCodePonto: dto.posYQrCodePonto,
                layoutPatioId: dto.layoutPatioId
            }));
            callback(true, "", lista);
        })
        .catch((erro: any) => {
            callback(false, erro.response?.data?.message || erro.message, []);
        });
}

export {
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdApi, buscarPorIdentificadorApi, 
    buscarPorLayoutPatioApi, buscarPorPosXApi, buscarPorPosYApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar
};


