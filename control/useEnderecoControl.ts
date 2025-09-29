import { useContext, useState } from 'react';
import { 
    salvarEndereco, carregarEnderecos, apagarEndereco, atualizarEndereco, buscarEnderecoPorId, 
    buscarEnderecoPorCep, buscarEnderecoPorEstado, buscarEnderecoPorCidade, 
    buscarEnderecoPorBairro, buscarEnderecoPorPatio
} from '../service/enderecoService';
import { Endereco, EnderecoCreateDto, EnderecoUpdateDto } from '../model';
import { ContextoPrincipal } from '../contexto/ContextoPrincipal';

const enderecoLimpo: Endereco = {
    idEndereco: 0,
    cepEndereco: "",
    logradouroEndereco: "",
    numeroEndereco: "",
    bairroEndereco: "",
    cidadeEndereco: "",
    estadoEndereco: "",
    patioId: 0
};

const useEnderecoControl = () => {
    const { 
        enderecos, setEnderecos, enderecoSelecionado, setEnderecoSelecionado,
        loading, setLoading, mensagem, setMensagem, status, setStatus,
        toastRef
    } = useContext(ContextoPrincipal);
    
    const [endereco, setEndereco] = useState<Endereco>(enderecoLimpo);
    const [listaEnderecos, setListaEnderecos] = useState<Endereco[]>([]);

    const salvar = () => {
        setLoading(true);
        const enderecoCreate: EnderecoCreateDto = {
            cepEndereco: endereco.cepEndereco,
            logradouroEndereco: endereco.logradouroEndereco,
            numeroEndereco: endereco.numeroEndereco,
            bairroEndereco: endereco.bairroEndereco,
            cidadeEndereco: endereco.cidadeEndereco,
            estadoEndereco: endereco.estadoEndereco,
            patioId: endereco.patioId
        };
        salvarEndereco(enderecoCreate, (success, message, errors) => {
            if (success) {
                setMensagem("Endereço salvo com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Endereço salvo com sucesso!', 'success');
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
        carregarEnderecos((success, message, enderecos) => {
            if (success) {
                setListaEnderecos(enderecos);
                setEnderecos(enderecos);
                setMensagem("Endereços carregados com sucesso");
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
        apagarEndereco(id, (success, message) => {
            if (success) {
                setMensagem("Endereço removido com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Endereço removido com sucesso!', 'success');
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
        const enderecoUpdate: EnderecoUpdateDto = {
            cepEndereco: endereco.cepEndereco,
            logradouroEndereco: endereco.logradouroEndereco,
            numeroEndereco: endereco.numeroEndereco,
            bairroEndereco: endereco.bairroEndereco,
            cidadeEndereco: endereco.cidadeEndereco,
            estadoEndereco: endereco.estadoEndereco,
            patioId: endereco.patioId
        };
        atualizarEndereco(id, enderecoUpdate, (success, message, errors) => {
            if (success) {
                setMensagem("Endereço atualizado com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Endereço atualizado com sucesso!', 'success');
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
        buscarEnderecoPorId(id, (success, message, endereco) => {
            if (success && endereco) {
                setEnderecoSelecionado(endereco);
                setMensagem("Endereço encontrado");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorCep = (cep: string) => {
        setLoading(true);
        buscarEnderecoPorCep(cep, (success, message, enderecos) => {
            if (success) {
                setListaEnderecos(enderecos);
                setEnderecos(enderecos);
                setMensagem("Endereços encontrados");
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
        buscarEnderecoPorEstado(estado, (success, message, enderecos) => {
            if (success) {
                setListaEnderecos(enderecos);
                setEnderecos(enderecos);
                setMensagem("Endereços encontrados");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorCidade = (cidade: string) => {
        setLoading(true);
        buscarEnderecoPorCidade(cidade, (success, message, enderecos) => {
            if (success) {
                setListaEnderecos(enderecos);
                setEnderecos(enderecos);
                setMensagem("Endereços encontrados");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorBairro = (bairro: string) => {
        setLoading(true);
        buscarEnderecoPorBairro(bairro, (success, message, enderecos) => {
            if (success) {
                setListaEnderecos(enderecos);
                setEnderecos(enderecos);
                setMensagem("Endereços encontrados");
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
        buscarEnderecoPorPatio(patioId, (success, message, enderecos) => {
            if (success) {
                setListaEnderecos(enderecos);
                setEnderecos(enderecos);
                setMensagem("Endereços encontrados");
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
        const novoEndereco = { ...endereco };
        if (nomeCampo === 'patioId') {
            (novoEndereco as any)[nomeCampo] = parseInt(texto);
        } else {
            (novoEndereco as any)[nomeCampo] = texto;
        }
        setEndereco(novoEndereco);
    };

    const limparEndereco = () => {
        setEndereco(enderecoLimpo);
    };

    const selecionarEndereco = (endereco: Endereco) => {
        setEnderecoSelecionado(endereco);
        setEndereco(endereco);
    };

    return {
        endereco,
        listaEnderecos,
        enderecoSelecionado,
        loading,
        mensagem,
        status,
        handlerInput,
        salvar,
        carregarLista,
        apagar,
        atualizar,
        buscarPorId,
        buscarPorCep,
        buscarPorEstado,
        buscarPorCidade,
        buscarPorBairro,
        buscarPorPatio,
        limparEndereco,
        selecionarEndereco
    };
};

export { useEnderecoControl };
