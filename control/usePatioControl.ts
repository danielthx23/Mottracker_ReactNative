import { useContext, useState } from 'react';
import { 
    salvarPatio, carregarPatios, apagarPatio, atualizarPatio, buscarPatioPorId, buscarPatioPorNome, 
    buscarMotosDisponiveisMaiorQue as buscarMotosDisponiveisMaiorQueService, 
    buscarDataPosterior as buscarDataPosteriorService, 
    buscarDataAnterior as buscarDataAnteriorService,
    atualizarMotosCameras
} from '../service/patioService';
import { Patio, PatioCreateDto, PatioUpdateDto } from '../model';
import { ContextoPrincipal } from '../context/ContextoPrincipal';

const patioLimpo: Patio = {
    idPatio: 0,
    nomePatio: "",
    motosTotaisPatio: 0,
    motosDisponiveisPatio: 0,
    dataPatio: new Date()
};

const usePatioControl = () => {
    const { 
        patios, setPatios, patioSelecionado, setPatioSelecionado,
        loading, setLoading, mensagem, setMensagem, status, setStatus,
        toastRef
    } = useContext(ContextoPrincipal);
    
    const [patio, setPatio] = useState<Patio>(patioLimpo);
    const [listaPatios, setListaPatios] = useState<Patio[]>([]);

    const salvar = () => {
        setLoading(true);
        const patioCreate: PatioCreateDto = {
            nomePatio: patio.nomePatio,
            motosTotaisPatio: patio.motosTotaisPatio,
            motosDisponiveisPatio: patio.motosDisponiveisPatio,
            dataPatio: patio.dataPatio.toISOString()
        };
        salvarPatio(patioCreate, (success, message, errors) => {
            if (success) {
                setMensagem("Pátio salvo com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Pátio salvo com sucesso!', 'success');
                carregarLista();
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const salvarComDados = (patioData: Patio) => {
        setLoading(true);
        const patioCreate: PatioCreateDto = {
            nomePatio: patioData.nomePatio,
            motosTotaisPatio: patioData.motosTotaisPatio,
            motosDisponiveisPatio: patioData.motosDisponiveisPatio,
            dataPatio: patioData.dataPatio.toISOString()
        };
        salvarPatio(patioCreate, (success, message, errors) => {
            if (success) {
                setMensagem("Pátio salvo com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Pátio salvo com sucesso!', 'success');
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
        carregarPatios((success, message, patios) => {
            
            if (success) {
                setListaPatios(patios);
                setPatios(patios);
                setMensagem("Pátios carregados com sucesso");
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
        apagarPatio(id, (success, message) => {
            if (success) {
                setMensagem("Pátio removido com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Pátio removido com sucesso!', 'success');
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
        const patioUpdate: PatioUpdateDto = {
            nomePatio: patio.nomePatio,
            motosTotaisPatio: patio.motosTotaisPatio,
            motosDisponiveisPatio: patio.motosDisponiveisPatio,
            dataPatio: patio.dataPatio.toISOString()
        };
        atualizarPatio(id, patioUpdate, (success, message, errors) => {
            if (success) {
                setMensagem("Pátio atualizado com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Pátio atualizado com sucesso!', 'success');
                carregarLista();
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const atualizarComDados = (patioData: Patio) => {
        setLoading(true);
        const patioUpdate: PatioUpdateDto = {
            nomePatio: patioData.nomePatio,
            motosTotaisPatio: patioData.motosTotaisPatio,
            motosDisponiveisPatio: patioData.motosDisponiveisPatio,
            dataPatio: patioData.dataPatio.toISOString()
        };
        atualizarPatio(patioData.idPatio, patioUpdate, (success, message, errors) => {
            if (success) {
                setMensagem("Pátio atualizado com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Pátio atualizado com sucesso!', 'success');
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
        buscarPatioPorId(id, (success, message, patio) => {
            if (success && patio) {
                setPatioSelecionado(patio);
                setMensagem("Pátio encontrado");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorNome = (nome: string) => {
        setLoading(true);
        buscarPatioPorNome(nome, (success, message, patios) => {
            if (success) {
                setListaPatios(patios);
                setPatios(patios);
                setMensagem("Pátios encontrados");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarMotosDisponiveisMaiorQue = (quantidade: number) => {
        setLoading(true);
        buscarMotosDisponiveisMaiorQueService(quantidade, (success, message, patios) => {
            if (success) {
                setListaPatios(patios);
                setPatios(patios);
                setMensagem("Pátios encontrados");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarDataPosterior = (data: string) => {
        setLoading(true);
        buscarDataPosteriorService(data, (success, message, patios) => {
            if (success) {
                setListaPatios(patios);
                setPatios(patios);
                setMensagem("Pátios encontrados");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarDataAnterior = (data: string) => {
        setLoading(true);
        buscarDataAnteriorService(data, (success, message, patios) => {
            if (success) {
                setListaPatios(patios);
                setPatios(patios);
                setMensagem("Pátios encontrados");
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
        const novoPatio = { ...patio };
        if (nomeCampo === 'motosTotaisPatio' || nomeCampo === 'motosDisponiveisPatio') {
            (novoPatio as any)[nomeCampo] = parseInt(texto);
        } else if (nomeCampo === 'dataPatio') {
            (novoPatio as any)[nomeCampo] = new Date(texto);
        } else {
            (novoPatio as any)[nomeCampo] = texto;
        }
        setPatio(novoPatio);
    };

    const limparPatio = () => {
        setPatio(patioLimpo);
    };

    const selecionarPatio = (patio: Patio) => {
        setPatioSelecionado(patio);
        setPatio(patio);
    };

    const atualizarMotosCamerasPatio = (idPatio: number, motosIds: number[], camerasIds: number[]) => {
        setLoading(true);
        atualizarMotosCameras(idPatio, motosIds, camerasIds, (success: boolean, message: string) => {
            if (success) {
                setMensagem("Motos e câmeras do pátio atualizadas com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Motos e câmeras do pátio atualizadas com sucesso!', 'success');
                carregarLista();
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    return {
        patio,
        listaPatios,
        patioSelecionado,
        loading,
        mensagem,
        status,
        handlerInput,
        salvar,
        salvarComDados,
        carregarLista,
        apagar,
        atualizar,
        atualizarComDados,
        buscarPorId,
        buscarPorNome,
        buscarMotosDisponiveisMaiorQue,
        buscarDataPosterior,
        buscarDataAnterior,
        limparPatio,
        selecionarPatio,
        atualizarMotosCamerasPatio
    };
};

export { usePatioControl };
