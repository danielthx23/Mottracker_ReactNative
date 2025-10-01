import { useContext, useState } from 'react';
import { 
    salvarLayoutPatio, carregarLayoutPatios, apagarLayoutPatio, atualizarLayoutPatio, 
    buscarLayoutPatioPorId, buscarLayoutPatioPorPatio, buscarLayoutPatioPorDataCriacao
} from '../service/layoutPatioService';
import { LayoutPatio, LayoutPatioCreateDto, LayoutPatioUpdateDto } from '../model';
import { ContextoPrincipal } from '../context/ContextoPrincipal';

const layoutPatioLimpo: LayoutPatio = {
    idLayoutPatio: 0,
    nomeLayoutPatio: "",
    descricaoLayoutPatio: "",
    dataCriacaoLayoutPatio: new Date(),
    patioId: 0
};

const useLayoutPatioControl = () => {
    const { 
        layoutPatios, setLayoutPatios, layoutPatioSelecionado, setLayoutPatioSelecionado,
        loading, setLoading, mensagem, setMensagem, status, setStatus,
        toastRef
    } = useContext(ContextoPrincipal);
    
    const [layoutPatio, setLayoutPatio] = useState<LayoutPatio>(layoutPatioLimpo);
    const [listaLayoutPatios, setListaLayoutPatios] = useState<LayoutPatio[]>([]);

    const salvar = () => {
        setLoading(true);
        const layoutPatioCreate: LayoutPatioCreateDto = {
            nomeLayoutPatio: layoutPatio.nomeLayoutPatio,
            descricaoLayoutPatio: layoutPatio.descricaoLayoutPatio,
            dataCriacaoLayoutPatio: layoutPatio.dataCriacaoLayoutPatio.toISOString(),
            patioId: layoutPatio.patioId
        };
        salvarLayoutPatio(layoutPatioCreate, (success, message, errors) => {
            if (success) {
                setMensagem("Layout de pátio salvo com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Layout de pátio salvo com sucesso!', 'success');
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
        carregarLayoutPatios((success, message, layoutPatios) => {
            if (success) {
                setListaLayoutPatios(layoutPatios);
                setLayoutPatios(layoutPatios);
                setMensagem("Layouts de pátio carregados com sucesso");
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
        apagarLayoutPatio(id, (success, message) => {
            if (success) {
                setMensagem("Layout de pátio removido com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Layout de pátio removido com sucesso!', 'success');
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
        const layoutPatioUpdate: LayoutPatioUpdateDto = {
            nomeLayoutPatio: layoutPatio.nomeLayoutPatio,
            descricaoLayoutPatio: layoutPatio.descricaoLayoutPatio,
            dataCriacaoLayoutPatio: layoutPatio.dataCriacaoLayoutPatio.toISOString(),
            patioId: layoutPatio.patioId
        };
        atualizarLayoutPatio(id, layoutPatioUpdate, (success, message, errors) => {
            if (success) {
                setMensagem("Layout de pátio atualizado com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Layout de pátio atualizado com sucesso!', 'success');
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
        buscarLayoutPatioPorId(id, (success, message, layoutPatio) => {
            if (success && layoutPatio) {
                setLayoutPatioSelecionado(layoutPatio);
                setMensagem("Layout de pátio encontrado");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorPatio = (patioId: number) => {
        setLoading(true);
        buscarLayoutPatioPorPatio(patioId, (success, message, layoutPatios) => {
            if (success) {
                setListaLayoutPatios(layoutPatios);
                setLayoutPatios(layoutPatios);
                setMensagem("Layouts de pátio encontrados");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorDataCriacao = (dataInicio: string, dataFim: string) => {
        setLoading(true);
        buscarLayoutPatioPorDataCriacao(dataInicio, dataFim, (success, message, layoutPatios) => {
            if (success) {
                setListaLayoutPatios(layoutPatios);
                setLayoutPatios(layoutPatios);
                setMensagem("Layouts de pátio encontrados");
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
        const novoLayoutPatio = { ...layoutPatio };
        if (nomeCampo === 'dataCriacaoLayoutPatio') {
            (novoLayoutPatio as any)[nomeCampo] = new Date(texto);
        } else if (nomeCampo === 'patioId') {
            (novoLayoutPatio as any)[nomeCampo] = parseInt(texto);
        } else {
            (novoLayoutPatio as any)[nomeCampo] = texto;
        }
        setLayoutPatio(novoLayoutPatio);
    };

    const limparLayoutPatio = () => {
        setLayoutPatio(layoutPatioLimpo);
    };

    const selecionarLayoutPatio = (layoutPatio: LayoutPatio) => {
        setLayoutPatioSelecionado(layoutPatio);
        setLayoutPatio(layoutPatio);
    };

    return {
        layoutPatio,
        listaLayoutPatios,
        layoutPatioSelecionado,
        loading,
        mensagem,
        status,
        handlerInput,
        salvar,
        carregarLista,
        apagar,
        atualizar,
        buscarPorId,
        buscarPorPatio,
        buscarPorDataCriacao,
        limparLayoutPatio,
        selecionarLayoutPatio
    };
};

export { useLayoutPatioControl };
