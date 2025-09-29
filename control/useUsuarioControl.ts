import { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { 
    salvarUsuario, carregarUsuarios, apagarUsuario, atualizarUsuario, buscarUsuarioPorId, buscarUsuarioPorEmail, loginUsuario
} from '../service/usuarioService';
import { Usuario, UsuarioCreateDto, UsuarioUpdateDto, UsuarioLoginDto } from '../model';
import { ContextoPrincipal } from '../contexto/ContextoPrincipal';
import { useUsuario } from '../context/UsuarioContext';

const usuarioLimpo: Usuario = {
    idUsuario: 0,
    nomeUsuario: "",
    cpfUsuario: "",
    senhaUsuario: "",
    cnhUsuario: "",
    emailUsuario: "",
    tokenUsuario: "",
    dataNascimentoUsuario: new Date(),
    criadoEmUsuario: new Date()
};

const useUsuarioControl = () => {
    const { 
        usuarios, setUsuarios, usuarioSelecionado, setUsuarioSelecionado,
        loading, setLoading, mensagem, setMensagem, status, setStatus,
        toastRef, setToken, setEmail
    } = useContext(ContextoPrincipal);
    
    // Usar o novo Context para gerenciar o usuário logado
    const { setUsuarioLogado } = useUsuario();
    
    const [usuario, setUsuario] = useState<Usuario>(usuarioLimpo);
    const [listaUsuarios, setListaUsuarios] = useState<Usuario[]>([]);

    const navigation = useNavigation();


    const salvar = (usuarioData?: Usuario) => {
        setLoading(true);
        
        // Se dados foram passados diretamente, usar eles. Senão, usar o estado
        const dadosParaSalvar = usuarioData || usuario;
        
        const usuarioCreate: UsuarioCreateDto = {
            nomeUsuario: dadosParaSalvar.nomeUsuario,
            cpfUsuario: dadosParaSalvar.cpfUsuario,
            senhaUsuario: dadosParaSalvar.senhaUsuario,
            cnhUsuario: dadosParaSalvar.cnhUsuario,
            emailUsuario: dadosParaSalvar.emailUsuario,
            dataNascimentoUsuario: dadosParaSalvar.dataNascimentoUsuario.toISOString()
        };
        
        salvarUsuario(usuarioCreate, (success, message, errors) => {
            if (success) {
                setMensagem("Usuário salvo com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Usuário salvo com sucesso!', 'success');
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
        carregarUsuarios((success, message, usuarios) => {
            if (success) {
                setListaUsuarios(usuarios);
                setUsuarios(usuarios);
                setMensagem("Usuários carregados com sucesso");
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
        apagarUsuario(id, (success, message) => {
            if (success) {
                setMensagem("Usuário removido com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Usuário removido com sucesso!', 'success');
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
        const usuarioUpdate: UsuarioUpdateDto = {
            nomeUsuario: usuario.nomeUsuario,
            cpfUsuario: usuario.cpfUsuario,
            senhaUsuario: usuario.senhaUsuario,
            cnhUsuario: usuario.cnhUsuario,
            emailUsuario: usuario.emailUsuario,
            dataNascimentoUsuario: usuario.dataNascimentoUsuario.toISOString()
        };
        atualizarUsuario(id, usuarioUpdate, (success, message, errors) => {
            if (success) {
                setMensagem("Usuário atualizado com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Usuário atualizado com sucesso!', 'success');
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
        buscarUsuarioPorId(id, (success, message, usuario) => {
            if (success && usuario) {
                setUsuarioSelecionado(usuario);
                setMensagem("Usuário encontrado");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorEmail = (email: string) => {
        setLoading(true);
        buscarUsuarioPorEmail(email, (success, message, usuario) => {
            if (success && usuario) {
                setUsuarioSelecionado(usuario);
                setMensagem("Usuário encontrado");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const login = (email: string, senha: string) => {
        
        setLoading(true);
        const loginData: UsuarioLoginDto = {
            emailUsuario: email,
            senhaUsuario: senha
        };
        
        
        try {
            loginUsuario(loginData, (success, message, usuario, token) => {
                if (success && usuario && token) {
                    setMensagem("Login realizado com sucesso");
                    setStatus("sucesso");
                    setUsuario(usuario);
                    setUsuarioLogado(usuario);
                    setToken(token);
                    setEmail(usuario.emailUsuario);
                    toastRef.current?.show('Sucesso', 'Login realizado com sucesso!', 'success');
                    try {
                        (navigation as any).navigate("MainApp");
                    } catch (navError) {
                        console.error('Erro na navegação:', navError);
                    }
                } else {
                    setMensagem(message);
                    setStatus("erro");
                    toastRef.current?.show('Erro', message, 'danger');
                }
                setLoading(false);
            });
        } catch (error) {
            setMensagem('Erro interno no login');
            setStatus("erro");
            toastRef.current?.show('Erro', 'Erro interno no login', 'danger');
            setLoading(false);
        }
    };

    const handlerInput = (texto: string, nomeCampo: string) => {
        const novoUsuario = { ...usuario };
        if (nomeCampo === 'dataNascimentoUsuario') {
            (novoUsuario as any)[nomeCampo] = new Date(texto);
        } else {
            (novoUsuario as any)[nomeCampo] = texto;
        }
        setUsuario(novoUsuario);
    };

    const limparUsuario = () => {
        setUsuario(usuarioLimpo);
    };

    const selecionarUsuario = (usuario: Usuario) => {
        setUsuarioSelecionado(usuario);
        setUsuario(usuario);
    };

    return {
        usuario,
        listaUsuarios,
        usuarioSelecionado,
        loading,
        mensagem,
        status,
        handlerInput,
        salvar,
        carregarLista,
        apagar,
        atualizar,
        buscarPorId,
        buscarPorEmail,
        login,
        limparUsuario,
        selecionarUsuario
    };
};

export { useUsuarioControl };
