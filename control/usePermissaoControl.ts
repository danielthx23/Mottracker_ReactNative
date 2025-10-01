import { useContext, useState } from 'react';
import { 
    salvarPermissao, carregarPermissoes, apagarPermissao, atualizarPermissao, buscarPermissaoPorId, buscarPermissaoPorNome, buscarPermissaoPorDescricao
} from '../service/permissaoService';
import { Permissao, PermissaoCreateDto, PermissaoUpdateDto } from '../model';
import { ContextoPrincipal } from '../context/ContextoPrincipal';

const permissaoLimpa: Permissao = {
    idPermissao: 0,
    nomePermissao: "",
    descricaoPermissao: ""
};

const usePermissaoControl = () => {
    const { 
        permissoes, setPermissoes, permissaoSelecionada, setPermissaoSelecionada,
        loading, setLoading, mensagem, setMensagem, status, setStatus,
        toastRef
    } = useContext(ContextoPrincipal);
    
    const [permissao, setPermissao] = useState<Permissao>(permissaoLimpa);
    const [listaPermissoes, setListaPermissoes] = useState<Permissao[]>([]);


    const salvar = () => {
        setLoading(true);
        const permissaoCreate: PermissaoCreateDto = {
            nomePermissao: permissao.nomePermissao,
            descricaoPermissao: permissao.descricaoPermissao
        };
        salvarPermissao(permissaoCreate, (success, message, errors) => {
            if (success) {
                setMensagem("Permissão salva com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Permissão salva com sucesso!', 'success');
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
        carregarPermissoes((success, message, permissoes) => {
            if (success) {
                setListaPermissoes(permissoes);
                setPermissoes(permissoes);
                setMensagem("Permissões carregadas com sucesso");
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
        apagarPermissao(id, (success, message) => {
            if (success) {
                setMensagem("Permissão removida com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Permissão removida com sucesso!', 'success');
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
        const permissaoUpdate: PermissaoUpdateDto = {
            nomePermissao: permissao.nomePermissao,
            descricaoPermissao: permissao.descricaoPermissao
        };
        atualizarPermissao(id, permissaoUpdate, (success, message, errors) => {
            if (success) {
                setMensagem("Permissão atualizada com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Permissão atualizada com sucesso!', 'success');
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
        buscarPermissaoPorId(id, (success, message, permissao) => {
            if (success && permissao) {
                setPermissaoSelecionada(permissao);
                setMensagem("Permissão encontrada");
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
        buscarPermissaoPorNome(nome, (success, message, permissoes) => {
            if (success) {
                setListaPermissoes(permissoes);
                setPermissoes(permissoes);
                setMensagem("Permissões encontradas");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorDescricao = (descricao: string) => {
        setLoading(true);
        buscarPermissaoPorDescricao(descricao, (success, message, permissoes) => {
            if (success) {
                setListaPermissoes(permissoes);
                setPermissoes(permissoes);
                setMensagem("Permissões encontradas");
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
        const novaPermissao = { ...permissao };
        (novaPermissao as any)[nomeCampo] = texto;
        setPermissao(novaPermissao);
    };

    const limparPermissao = () => {
        setPermissao(permissaoLimpa);
    };

    const selecionarPermissao = (permissao: Permissao) => {
        setPermissaoSelecionada(permissao);
        setPermissao(permissao);
    };

    return {
        permissao,
        listaPermissoes,
        permissaoSelecionada,
        loading,
        mensagem,
        status,
        handlerInput,
        salvar,
        carregarLista,
        apagar,
        atualizar,
        buscarPorId,
        buscarPorNome,
        buscarPorDescricao,
        limparPermissao,
        selecionarPermissao
    };
};

export { usePermissaoControl };
