import { useContext, useState } from 'react';
import { 
    salvarMoto, carregarMotos, apagarMoto, atualizarMoto, buscarMotoPorId, buscarMotoPorPlaca, 
    buscarMotoPorEstado, buscarMotoPorContrato
} from '../service/motoService';
import { Moto, MotoCreateDto, MotoUpdateDto, Estados } from '../model';
import { ContextoPrincipal } from '../context/ContextoPrincipal';

const motoLimpa: Moto = {
    idMoto: 0,
    placaMoto: "",
    modeloMoto: "",
    anoMoto: 0,
    identificadorMoto: "",
    quilometragemMoto: 0,
    estadoMoto: Estados.NoPatio,
    condicoesMoto: "",
    hora: ""
};

const useMotoControl = () => {
    const { 
        motos, setMotos, motoSelecionada, setMotoSelecionada,
        loading, setLoading, mensagem, setMensagem, status, setStatus,
        toastRef
    } = useContext(ContextoPrincipal);
    
    const [moto, setMoto] = useState<Moto>(motoLimpa);
    const [listaMotos, setListaMotos] = useState<Moto[]>([]);


    const salvar = () => {
        setLoading(true);
        const motoCreate: MotoCreateDto = {
            placaMoto: moto.placaMoto,
            modeloMoto: moto.modeloMoto,
            anoMoto: moto.anoMoto,
            identificadorMoto: moto.identificadorMoto,
            quilometragemMoto: moto.quilometragemMoto,
            estadoMoto: typeof moto.estadoMoto === 'string' ? 
                (moto.estadoMoto === 'No pátio' ? 1 : 
                 moto.estadoMoto === 'No pátio errado' ? 2 : 
                 moto.estadoMoto === 'Retirada' ? 3 : 4) : 
                moto.estadoMoto,
            condicoesMoto: moto.condicoesMoto,
            hora: moto.hora
        };
        salvarMoto(motoCreate, (success, message, errors) => {
            if (success) {
                setMensagem("Moto salva com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Moto salva com sucesso!', 'success');
                carregarLista();
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const salvarComDados = (motoData: Moto) => {
        setLoading(true);
        const motoCreate: MotoCreateDto = {
            placaMoto: motoData.placaMoto,
            modeloMoto: motoData.modeloMoto,
            anoMoto: motoData.anoMoto,
            identificadorMoto: motoData.identificadorMoto,
            quilometragemMoto: motoData.quilometragemMoto,
            estadoMoto: typeof motoData.estadoMoto === 'string' ? 
                (motoData.estadoMoto === 'No pátio' ? 1 : 
                 motoData.estadoMoto === 'No pátio errado' ? 2 : 
                 motoData.estadoMoto === 'Retirada' ? 3 : 4) : 
                (motoData.estadoMoto as number),
            condicoesMoto: motoData.condicoesMoto,
            contratoMotoId: motoData.contratoMotoId,
            motoPatioAtualId: motoData.motoPatioAtualId,
            motoPatioOrigemId: motoData.motoPatioOrigemId,
            hora: motoData.hora
        };
        salvarMoto(motoCreate, (success, message, errors) => {
            if (success) {
                setMensagem("Moto salva com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Moto salva com sucesso!', 'success');
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
        carregarMotos((success, message, motos) => {
            
            if (success) {
                setListaMotos(motos);
                setMotos(motos); // Sincronizar com o contexto global
                setMensagem("Motos carregadas com sucesso");
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
        apagarMoto(id, (success, message) => {
            if (success) {
                setMensagem("Moto removida com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Moto removida com sucesso!', 'success');
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
        const motoUpdate: MotoUpdateDto = {
            placaMoto: moto.placaMoto,
            modeloMoto: moto.modeloMoto,
            anoMoto: moto.anoMoto,
            identificadorMoto: moto.identificadorMoto,
            quilometragemMoto: moto.quilometragemMoto,
            estadoMoto: typeof moto.estadoMoto === 'string' ? 
                (moto.estadoMoto === 'No pátio' ? 1 : 
                 moto.estadoMoto === 'No pátio errado' ? 2 : 
                 moto.estadoMoto === 'Retirada' ? 3 : 4) : 
                (moto.estadoMoto as number),
            condicoesMoto: moto.condicoesMoto,
            hora: moto.hora
        };
        atualizarMoto(id, motoUpdate, (success, message, errors) => {
            if (success) {
                setMensagem("Moto atualizada com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Moto atualizada com sucesso!', 'success');
                carregarLista();
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const atualizarComDados = (motoData: Moto) => {
        setLoading(true);
        const motoUpdate: MotoUpdateDto = {
            placaMoto: motoData.placaMoto,
            modeloMoto: motoData.modeloMoto,
            anoMoto: motoData.anoMoto,
            identificadorMoto: motoData.identificadorMoto,
            quilometragemMoto: motoData.quilometragemMoto,
            estadoMoto: typeof motoData.estadoMoto === 'string' ? 
                (motoData.estadoMoto === 'No pátio' ? 1 : 
                 motoData.estadoMoto === 'No pátio errado' ? 2 : 
                 motoData.estadoMoto === 'Retirada' ? 3 : 4) : 
                (motoData.estadoMoto as number),
            condicoesMoto: motoData.condicoesMoto,
            hora: motoData.hora
        };
        atualizarMoto(motoData.idMoto, motoUpdate, (success, message, errors) => {
            if (success) {
                setMensagem("Moto atualizada com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Moto atualizada com sucesso!', 'success');
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
        buscarMotoPorId(id, (success, message, moto) => {
            if (success && moto) {
                setMotoSelecionada(moto);
                setMensagem("Moto encontrada");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorPlaca = (placa: string) => {
        setLoading(true);
        buscarMotoPorPlaca(placa, (success, message, moto) => {
            if (success && moto) {
                setMotoSelecionada(moto);
                setMensagem("Moto encontrada");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorEstado = (estado: string) => {
        setLoading(true);
        buscarMotoPorEstado(estado, (success, message, motos) => {
            if (success) {
                setListaMotos(motos);
                setMotos(motos);
                setMensagem("Motos encontradas");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorContrato = (contratoId: number) => {
        setLoading(true);
        buscarMotoPorContrato(contratoId, (success, message, motos) => {
            if (success) {
                setListaMotos(motos);
                setMotos(motos);
                setMensagem("Motos encontradas");
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
        const novaMoto = { ...moto };
        if (nomeCampo === 'anoMoto' || nomeCampo === 'quilometragemMoto') {
            (novaMoto as any)[nomeCampo] = parseInt(texto);
        } else if (nomeCampo === 'estadoMoto') {
            (novaMoto as any)[nomeCampo] = texto as Estados;
        } else {
            (novaMoto as any)[nomeCampo] = texto;
        }
        setMoto(novaMoto);
    };

    const limparMoto = () => {
        setMoto(motoLimpa);
    };

    const selecionarMoto = (moto: Moto) => {
        setMotoSelecionada(moto);
        setMoto(moto);
    };

    return {
        moto,
        setMoto,
        listaMotos,
        motoSelecionada,
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
        buscarPorPlaca,
        buscarPorEstado,
        buscarPorContrato,
        limparMoto,
        selecionarMoto
    };
};

export { useMotoControl };
