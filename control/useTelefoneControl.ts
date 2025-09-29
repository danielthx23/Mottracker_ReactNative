import { useContext, useState } from 'react';
import { 
    salvarTelefone, carregarTelefones, apagarTelefone, atualizarTelefone, buscarTelefonePorId, buscarTelefonePorNumero, 
    buscarTelefonePorUsuario, buscarTelefonePorTipo
} from '../service/telefoneService';
import { Telefone, TelefoneCreateDto, TelefoneUpdateDto, TipoTelefone } from '../model';
import { ContextoPrincipal } from '../contexto/ContextoPrincipal';

const telefoneLimpo: Telefone = {
    idTelefone: 0,
    numeroTelefone: "",
    tipoTelefone: "Celular" as TipoTelefone,
    usuarioId: 0
};

const useTelefoneControl = () => {
    const { 
        telefones, setTelefones, telefoneSelecionado, setTelefoneSelecionado,
        loading, setLoading, mensagem, setMensagem, status, setStatus,
        toastRef
    } = useContext(ContextoPrincipal);
    
    const [telefone, setTelefone] = useState<Telefone>(telefoneLimpo);
    const [listaTelefones, setListaTelefones] = useState<Telefone[]>([]);


    const salvar = () => {
        setLoading(true);
        const telefoneCreate: TelefoneCreateDto = {
            numeroTelefone: telefone.numeroTelefone,
            tipoTelefone: telefone.tipoTelefone,
            usuarioId: telefone.usuarioId
        };
        salvarTelefone(telefoneCreate, (success, message, errors) => {
            if (success) {
                setMensagem("Telefone salvo com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Telefone salvo com sucesso!', 'success');
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
        carregarTelefones((success, message, telefones) => {
            if (success) {
                setListaTelefones(telefones);
                setTelefones(telefones);
                setMensagem('Telefones carregados com sucesso');
                setStatus('sucesso');
            } else {
                setMensagem(message);
                setStatus('erro');
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const apagar = (id: number) => {
        setLoading(true);
        apagarTelefone(id, (success, message) => {
            if (success) {
                setMensagem('Telefone removido com sucesso');
                setStatus('sucesso');
                toastRef.current?.show('Sucesso', 'Telefone removido com sucesso!', 'success');
                carregarLista();
            } else {
                setMensagem(message);
                setStatus('erro');
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const atualizar = (id: number) => {
        setLoading(true);
        const telefoneUpdate: TelefoneUpdateDto = {
            numeroTelefone: telefone.numeroTelefone,
            tipoTelefone: telefone.tipoTelefone,
            usuarioId: telefone.usuarioId
        };
        atualizarTelefone(id, telefoneUpdate, (success, message, errors) => {
            if (success) {
                setMensagem('Telefone atualizado com sucesso');
                setStatus('sucesso');
                toastRef.current?.show('Sucesso', 'Telefone atualizado com sucesso!', 'success');
                carregarLista();
            } else {
                setMensagem(message);
                setStatus('erro');
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorId = (id: number) => {
        setLoading(true);
        buscarTelefonePorId(id, (success, message, telefone) => {
            if (success && telefone) {
                setTelefoneSelecionado(telefone);
                setMensagem("Telefone encontrado");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorNumero = (numero: string) => {
        setLoading(true);
        buscarTelefonePorNumero(numero, (success, message, telefones) => {
            if (success) {
                setListaTelefones(telefones);
                setTelefones(telefones);
                setMensagem("Telefones encontrados");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorUsuario = (usuarioId: number) => {
        setLoading(true);
        buscarTelefonePorUsuario(usuarioId, (success, message, telefones) => {
            if (success) {
                setListaTelefones(telefones);
                setTelefones(telefones);
                setMensagem("Telefones encontrados");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorTipo = (tipo: string) => {
        setLoading(true);
        buscarTelefonePorTipo(tipo as TipoTelefone, (success, message, telefones) => {
            if (success) {
                setListaTelefones(telefones);
                setTelefones(telefones);
                setMensagem("Telefones encontrados");
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
        const novoTelefone = { ...telefone };
        if (nomeCampo === 'usuarioId') {
            (novoTelefone as any)[nomeCampo] = parseInt(texto);
        } else if (nomeCampo === 'tipoTelefone') {
            (novoTelefone as any)[nomeCampo] = texto as TipoTelefone;
        } else {
            (novoTelefone as any)[nomeCampo] = texto;
        }
        setTelefone(novoTelefone);
    };

    const limparTelefone = () => {
        setTelefone(telefoneLimpo);
    };

    const selecionarTelefone = (telefone: Telefone) => {
        setTelefoneSelecionado(telefone);
        setTelefone(telefone);
    };

    return {
        telefone,
        listaTelefones,
        telefoneSelecionado,
        loading,
        mensagem,
        status,
        handlerInput,
        salvar,
        carregarLista,
        apagar,
        atualizar,
        buscarPorId,
        buscarPorNumero,
        buscarPorUsuario,
        buscarPorTipo,
        limparTelefone,
        selecionarTelefone
    };
};

export { useTelefoneControl };
