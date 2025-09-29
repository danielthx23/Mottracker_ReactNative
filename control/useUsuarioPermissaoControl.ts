import { useState } from 'react';
import { 
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdCompostoApi, buscarPorUsuarioApi, 
    buscarPorPermissaoApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar
} from '../fetcher/UsuarioPermissaoFetcher';
import { UsuarioPermissao, UsuarioPermissaoCreateDto, UsuarioPermissaoUpdateDto } from '../model';

const usuarioPermissaoLimpo: UsuarioPermissao = {
    usuarioId: 0,
    permissaoId: 0,
    dataAtribuicao: new Date()
};

const useUsuarioPermissaoControl = () => {
    const [usuarioPermissao, setUsuarioPermissao] = useState<UsuarioPermissao>(usuarioPermissaoLimpo);
    const [listaUsuarioPermissoes, setListaUsuarioPermissoes] = useState<UsuarioPermissao[]>([]);
    const [usuarioPermissaoSelecionado, setUsuarioPermissaoSelecionado] = useState<UsuarioPermissao | null>(null);
    
    const [loading, setLoading] = useState<boolean>(false);
    const [mensagem, setMensagem] = useState<string>("");
    const [status, setStatus] = useState<string>("sucesso");

    const callbackSalvar: CallBackSalvar = (success: boolean, texto: string, erros?: object) => {
        if (success) {
            setMensagem("Permissão de usuário salva com sucesso");
            setStatus("sucesso");
            carregarLista();
        } else {
            setMensagem(texto);
            setStatus("erro");
        }
        setLoading(false);
    };

    const callbackCarregar: CallBackCarregar = (success: boolean, texto: string, lista: UsuarioPermissao[]) => {
        if (success) {
            setListaUsuarioPermissoes(lista);
            setMensagem("Permissões de usuário carregadas com sucesso");
            setStatus("sucesso");
        } else {
            setMensagem(texto);
            setStatus("erro");
        }
        setLoading(false);
    };

    const callbackApagar: CallBackApagar = (success: boolean, texto: string) => {
        if (success) {
            setMensagem("Permissão de usuário removida com sucesso");
            setStatus("sucesso");
            carregarLista();
        } else {
            setMensagem(texto);
            setStatus("erro");
        }
        setLoading(false);
    };

    const callbackAtualizar: CallBackAtualizar = (success: boolean, texto: string, erros?: object) => {
        if (success) {
            setMensagem("Permissão de usuário atualizada com sucesso");
            setStatus("sucesso");
            carregarLista();
        } else {
            setMensagem(texto);
            setStatus("erro");
        }
        setLoading(false);
    };

    const callbackBuscar: CallBackBuscar = (success: boolean, texto: string, item: UsuarioPermissao | null) => {
        if (success) {
            setUsuarioPermissaoSelecionado(item);
            setMensagem("Permissão de usuário encontrada");
            setStatus("sucesso");
        } else {
            setMensagem(texto);
            setStatus("erro");
        }
        setLoading(false);
    };

    const salvar = () => {
        setLoading(true);
        const usuarioPermissaoCreate: UsuarioPermissaoCreateDto = {
            usuarioId: usuarioPermissao.usuarioId,
            permissaoId: usuarioPermissao.permissaoId,
            dataAtribuicao: usuarioPermissao.dataAtribuicao.toISOString()
        };
        salvarApi(usuarioPermissaoCreate, callbackSalvar);
    };

    const carregarLista = () => {
        setLoading(true);
        carregarApi(callbackCarregar);
    };

    const apagar = (usuarioId: number, permissaoId: number) => {
        setLoading(true);
        apagarApi(usuarioId, permissaoId, callbackApagar);
    };

    const atualizar = (usuarioId: number, permissaoId: number) => {
        setLoading(true);
        const usuarioPermissaoUpdate: UsuarioPermissaoUpdateDto = {
            dataAtribuicao: usuarioPermissao.dataAtribuicao.toISOString()
        };
        atualizarApi(usuarioId, permissaoId, usuarioPermissaoUpdate, callbackAtualizar);
    };

    const buscarPorIdComposto = (usuarioId: number, permissaoId: number) => {
        setLoading(true);
        buscarPorIdCompostoApi(usuarioId, permissaoId, callbackBuscar);
    };

    const buscarPorUsuario = (usuarioId: number) => {
        setLoading(true);
        buscarPorUsuarioApi(usuarioId, callbackCarregar);
    };

    const buscarPorPermissao = (permissaoId: number) => {
        setLoading(true);
        buscarPorPermissaoApi(permissaoId, callbackCarregar);
    };


    const handlerInput = (texto: string, nomeCampo: string) => {
        const novoUsuarioPermissao = { ...usuarioPermissao };
        if (nomeCampo === 'usuarioId' || nomeCampo === 'permissaoId') {
            novoUsuarioPermissao[nomeCampo as keyof typeof novoUsuarioPermissao] = parseInt(texto) as any;
        } else if (nomeCampo === 'dataAtribuicao') {
            novoUsuarioPermissao[nomeCampo as keyof typeof novoUsuarioPermissao] = new Date(texto) as any;
        } else {
            novoUsuarioPermissao[nomeCampo as keyof typeof novoUsuarioPermissao] = texto as any;
        }
        setUsuarioPermissao(novoUsuarioPermissao);
    };

    const limparUsuarioPermissao = () => {
        setUsuarioPermissao(usuarioPermissaoLimpo);
    };

    const selecionarUsuarioPermissao = (usuarioPermissao: UsuarioPermissao) => {
        setUsuarioPermissaoSelecionado(usuarioPermissao);
        setUsuarioPermissao(usuarioPermissao);
    };

    return {
        usuarioPermissao,
        listaUsuarioPermissoes,
        usuarioPermissaoSelecionado,
        loading,
        mensagem,
        status,
        handlerInput,
        salvar,
        carregarLista,
        apagar,
        atualizar,
        buscarPorIdComposto,
        buscarPorUsuario,
        buscarPorPermissao,
        limparUsuarioPermissao,
        selecionarUsuarioPermissao
    };
};

export { useUsuarioPermissaoControl };
