import { useContext, useState } from 'react';
import { 
    salvarQrCodePonto, carregarQrCodePontos, apagarQrCodePonto, atualizarQrCodePonto, buscarQrCodePontoPorId, buscarQrCodePontoPorIdentificador, 
    buscarQrCodePontoPorLayoutPatio, buscarQrCodePontoPorPosX, buscarQrCodePontoPorPosY
} from '../service/qrCodePontoService';
import { QrCodePonto, QrCodePontoCreateDto, QrCodePontoUpdateDto } from '../model';
import { ContextoPrincipal } from '../context/ContextoPrincipal';

const qrCodePontoLimpo: QrCodePonto = {
    idQrCodePonto: 0,
    identificadorQrCodePonto: "",
    posXQrCodePonto: 0,
    posYQrCodePonto: 0,
    layoutPatioId: 0
};

const useQrCodePontoControl = () => {
    const { 
        qrCodePontos, setQrCodePontos, qrCodePontoSelecionado, setQrCodePontoSelecionado,
        loading, setLoading, mensagem, setMensagem, status, setStatus,
        toastRef
    } = useContext(ContextoPrincipal);
    
    const [qrCodePonto, setQrCodePonto] = useState<QrCodePonto>(qrCodePontoLimpo);
    const [listaQrCodePontos, setListaQrCodePontos] = useState<QrCodePonto[]>([]);


    const salvar = () => {
        setLoading(true);
        const qrCodePontoCreate: QrCodePontoCreateDto = {
            identificadorQrCodePonto: qrCodePonto.identificadorQrCodePonto,
            posXQrCodePonto: qrCodePonto.posXQrCodePonto,
            posYQrCodePonto: qrCodePonto.posYQrCodePonto,
            layoutPatioId: qrCodePonto.layoutPatioId
        };
        salvarQrCodePonto(qrCodePontoCreate, (success, message, errors) => {
            if (success) {
                setMensagem("QR Code de ponto salvo com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'QR Code de ponto salvo com sucesso!', 'success');
                carregarLista();
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const carregarLista = () => {
        setLoading(true);
        carregarQrCodePontos((success, message, qrCodePontos) => {
            if (success) {
                setListaQrCodePontos(qrCodePontos);
                setQrCodePontos(qrCodePontos);
                setMensagem("QR Code de pontos carregados com sucesso");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const apagar = (id: number) => {
        setLoading(true);
        apagarQrCodePonto(id, (success, message) => {
            if (success) {
                setMensagem("QR Code de ponto removido com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'QR Code de ponto removido com sucesso!', 'success');
                carregarLista();
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const atualizar = (id: number) => {
        setLoading(true);
        const qrCodePontoUpdate: QrCodePontoUpdateDto = {
            identificadorQrCodePonto: qrCodePonto.identificadorQrCodePonto,
            posXQrCodePonto: qrCodePonto.posXQrCodePonto,
            posYQrCodePonto: qrCodePonto.posYQrCodePonto,
            layoutPatioId: qrCodePonto.layoutPatioId
        };
        atualizarQrCodePonto(id, qrCodePontoUpdate, (success, message, errors) => {
            if (success) {
                setMensagem("QR Code de ponto atualizado com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'QR Code de ponto atualizado com sucesso!', 'success');
                carregarLista();
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorId = (id: number) => {
        setLoading(true);
        buscarQrCodePontoPorId(id, (success, message, qrCodePonto) => {
            if (success && qrCodePonto) {
                setQrCodePontoSelecionado(qrCodePonto);
                setMensagem("QR Code de ponto encontrado");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorIdentificador = (identificador: string) => {
        setLoading(true);
        buscarQrCodePontoPorIdentificador(identificador, (success, message, qrCodePontos) => {
            if (success && qrCodePontos) {
                const qrCodePontosArray = Array.isArray(qrCodePontos) ? qrCodePontos : [qrCodePontos];
                setListaQrCodePontos(qrCodePontosArray);
                setQrCodePontos(qrCodePontosArray);
                setMensagem("QR Code de pontos encontrados");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorLayoutPatio = (layoutPatioId: number) => {
        setLoading(true);
        buscarQrCodePontoPorLayoutPatio(layoutPatioId, (success, message, qrCodePontos) => {
            if (success && qrCodePontos) {
                const qrCodePontosArray = Array.isArray(qrCodePontos) ? qrCodePontos : [qrCodePontos];
                setListaQrCodePontos(qrCodePontosArray);
                setQrCodePontos(qrCodePontosArray);
                setMensagem("QR Code de pontos encontrados");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorPosX = (posXMin: number, posXMax: number) => {
        setLoading(true);
        buscarQrCodePontoPorPosX(posXMin, posXMax, (success, message, qrCodePontos) => {
            if (success && qrCodePontos) {
                const qrCodePontosArray = Array.isArray(qrCodePontos) ? qrCodePontos : [qrCodePontos];
                setListaQrCodePontos(qrCodePontosArray);
                setQrCodePontos(qrCodePontosArray);
                setMensagem("QR Code de pontos encontrados");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorPosY = (posYMin: number, posYMax: number) => {
        setLoading(true);
        buscarQrCodePontoPorPosY(posYMin, posYMax, (success, message, qrCodePontos) => {
            if (success && qrCodePontos) {
                const qrCodePontosArray = Array.isArray(qrCodePontos) ? qrCodePontos : [qrCodePontos];
                setListaQrCodePontos(qrCodePontosArray);
                setQrCodePontos(qrCodePontosArray);
                setMensagem("QR Code de pontos encontrados");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const handlerInput = (texto: string, nomeCampo: string) => {
        const novoQrCodePonto = { ...qrCodePonto };
        if (nomeCampo === 'posXQrCodePonto' || nomeCampo === 'posYQrCodePonto' || nomeCampo === 'layoutPatioId') {
            (novoQrCodePonto as any)[nomeCampo] = parseFloat(texto);
        } else {
            (novoQrCodePonto as any)[nomeCampo] = texto;
        }
        setQrCodePonto(novoQrCodePonto);
    };

    const limparQrCodePonto = () => {
        setQrCodePonto(qrCodePontoLimpo);
    };

    const selecionarQrCodePonto = (qrCodePonto: QrCodePonto) => {
        setQrCodePontoSelecionado(qrCodePonto);
        setQrCodePonto(qrCodePonto);
    };

    return {
        qrCodePonto,
        listaQrCodePontos,
        qrCodePontoSelecionado,
        loading,
        mensagem,
        status,
        handlerInput,
        salvar,
        carregarLista,
        apagar,
        atualizar,
        buscarPorId,
        buscarPorIdentificador,
        buscarPorLayoutPatio,
        buscarPorPosX,
        buscarPorPosY,
        limparQrCodePonto,
        selecionarQrCodePonto
    };
};

export { useQrCodePontoControl };
