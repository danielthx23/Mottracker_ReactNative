import { useContext, useState } from 'react';
import { 
    salvarContrato, carregarContratos, apagarContrato, atualizarContrato, buscarContratoPorId, 
    buscarContratoPorAtivo, buscarContratoPorUsuario, buscarContratoPorMoto, 
    buscarContratosNaoExpirados, buscarContratoPorRenovacaoAutomatica, buscarContratoPorDataEntrada
} from '../service/contratoService';
import { Contrato, ContratoCreateDto, ContratoUpdateDto } from '../model';
import { ContextoPrincipal } from '../contexto/ContextoPrincipal';

const contratoLimpo: Contrato = {
    idContrato: 0,
    usuarioId: 0,
    motoId: 0,
    dataEntradaContrato: new Date(),
    dataSaidaContrato: new Date(),
    ativoContrato: true,
    renovacaoAutomaticaContrato: false
};

const useContratoControl = () => {
    const { 
        contratos, setContratos, contratoSelecionado, setContratoSelecionado,
        loading, setLoading, mensagem, setMensagem, status, setStatus,
        toastRef
    } = useContext(ContextoPrincipal);
    
    const [contrato, setContrato] = useState<Contrato>(contratoLimpo);
    const [listaContratos, setListaContratos] = useState<Contrato[]>([]);

    const salvar = () => {
        setLoading(true);
        const contratoCreate: ContratoCreateDto = {
            usuarioId: contrato.usuarioId,
            motoId: contrato.motoId,
            dataEntradaContrato: contrato.dataEntradaContrato.toISOString(),
            dataSaidaContrato: contrato.dataSaidaContrato?.toISOString(),
            ativoContrato: contrato.ativoContrato,
            renovacaoAutomaticaContrato: contrato.renovacaoAutomaticaContrato
        };
        salvarContrato(contratoCreate, (success, message, errors) => {
            if (success) {
                setMensagem("Contrato salvo com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Contrato salvo com sucesso!', 'success');
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
        carregarContratos((success, message, contratos) => {
            if (success) {
                setListaContratos(contratos);
                setContratos(contratos);
                setMensagem("Contratos carregados com sucesso");
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
        apagarContrato(id, (success, message) => {
            if (success) {
                setMensagem("Contrato removido com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Contrato removido com sucesso!', 'success');
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
        const contratoUpdate: ContratoUpdateDto = {
            dataEntradaContrato: contrato.dataEntradaContrato.toISOString(),
            dataSaidaContrato: contrato.dataSaidaContrato?.toISOString(),
            ativoContrato: contrato.ativoContrato,
            renovacaoAutomaticaContrato: contrato.renovacaoAutomaticaContrato
        };
        atualizarContrato(id, contratoUpdate, (success, message, errors) => {
            if (success) {
                setMensagem("Contrato atualizado com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Contrato atualizado com sucesso!', 'success');
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
        buscarContratoPorId(id, (success, message, contrato) => {
            if (success && contrato) {
                setContratoSelecionado(contrato);
                setMensagem("Contrato encontrado");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorAtivo = (ativo: boolean) => {
        setLoading(true);
        buscarContratoPorAtivo(ativo, (success, message, contratos) => {
            if (success) {
                setListaContratos(contratos);
                setContratos(contratos);
                setMensagem("Contratos encontrados");
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
        buscarContratoPorUsuario(usuarioId, (success, message, contratos) => {
            if (success) {
                setListaContratos(contratos);
                setContratos(contratos);
                setMensagem("Contratos encontrados");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorMoto = (motoId: number) => {
        setLoading(true);
        buscarContratoPorMoto(motoId, (success, message, contratos) => {
            if (success) {
                setListaContratos(contratos);
                setContratos(contratos);
                setMensagem("Contratos encontrados");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarNaoExpirados = () => {
        setLoading(true);
        buscarContratosNaoExpirados((success, message, contratos) => {
            if (success) {
                setListaContratos(contratos);
                setContratos(contratos);
                setMensagem("Contratos encontrados");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorRenovacaoAutomatica = (renovacao: boolean) => {
        setLoading(true);
        buscarContratoPorRenovacaoAutomatica(renovacao, (success, message, contratos) => {
            if (success) {
                setListaContratos(contratos);
                setContratos(contratos);
                setMensagem("Contratos encontrados");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorDataEntrada = (dataInicio: string, dataFim: string) => {
        setLoading(true);
        buscarContratoPorDataEntrada(dataInicio, dataFim, (success, message, contratos) => {
            if (success) {
                setListaContratos(contratos);
                setContratos(contratos);
                setMensagem("Contratos encontrados");
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
        const novoContrato = { ...contrato };
        if (nomeCampo === 'dataEntradaContrato' || nomeCampo === 'dataSaidaContrato') {
            (novoContrato as any)[nomeCampo] = new Date(texto);
        } else if (nomeCampo === 'usuarioId' || nomeCampo === 'motoId') {
            (novoContrato as any)[nomeCampo] = parseInt(texto);
        } else if (nomeCampo === 'ativoContrato' || nomeCampo === 'renovacaoAutomaticaContrato') {
            (novoContrato as any)[nomeCampo] = texto === 'true';
        } else {
            (novoContrato as any)[nomeCampo] = texto;
        }
        setContrato(novoContrato);
    };

    const limparContrato = () => {
        setContrato(contratoLimpo);
    };

    const selecionarContrato = (contrato: Contrato) => {
        setContratoSelecionado(contrato);
        setContrato(contrato);
    };

    return {
        contrato,
        listaContratos,
        contratoSelecionado,
        loading,
        mensagem,
        status,
        handlerInput,
        salvar,
        carregarLista,
        apagar,
        atualizar,
        buscarPorId,
        buscarPorAtivo,
        buscarPorUsuario,
        buscarPorMoto,
        buscarNaoExpirados,
        buscarPorRenovacaoAutomatica,
        buscarPorDataEntrada,
        limparContrato,
        selecionarContrato
    };
};

export { useContratoControl };
