# Exemplo de Uso dos Services nos Controls

Este arquivo mostra como integrar os services com os controls usando o contexto global.

## Exemplo: useUsuarioControl

```tsx
import { useContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { 
    salvarUsuario, carregarUsuarios, apagarUsuario, atualizarUsuario, 
    buscarUsuarioPorId, buscarUsuarioPorEmail, loginUsuario
} from '../service/usuarioService';
import { Usuario, UsuarioCreateDto, UsuarioUpdateDto, UsuarioLoginDto } from '../model';
import { ContextoPrincipal } from '../contexto/ContextoPrincipal';

const useUsuarioControl = () => {
    // Usar o contexto global
    const { 
        usuarios, setUsuarios, usuarioSelecionado, setUsuarioSelecionado,
        loading, setLoading, mensagem, setMensagem, status, setStatus,
        toastRef, setUsuarioLogado, setToken, setEmail
    } = useContext(ContextoPrincipal);
    
    const [usuario, setUsuario] = useState<Usuario>(usuarioLimpo);
    const [listaUsuarios, setListaUsuarios] = useState<Usuario[]>([]);

    const navigation = useNavigation();

    // Função para salvar usuário
    const salvar = () => {
        setLoading(true);
        const usuarioCreate: UsuarioCreateDto = {
            nomeUsuario: usuario.nomeUsuario,
            cpfUsuario: usuario.cpfUsuario,
            senhaUsuario: usuario.senhaUsuario,
            cnhUsuario: usuario.cnhUsuario,
            emailUsuario: usuario.emailUsuario,
            dataNascimentoUsuario: usuario.dataNascimentoUsuario.toISOString()
        };
        
        // Usar o service com validação automática
        salvarUsuario(usuarioCreate, (success, message, errors) => {
            if (success) {
                setMensagem("Usuário salvo com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Usuário salvo com sucesso!', 'success');
                carregarLista(); // Recarrega a lista
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
                if (errors) {
                    console.log('Erros de validação:', errors);
                }
            }
            setLoading(false);
        });
    };

    // Função para carregar lista de usuários
    const carregarLista = () => {
        setLoading(true);
        carregarUsuarios((success, message, usuarios) => {
            if (success) {
                setListaUsuarios(usuarios);
                setUsuarios(usuarios); // Sincronizar com contexto global
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

    // Função para apagar usuário
    const apagar = (id: number) => {
        setLoading(true);
        apagarUsuario(id, (success, message) => {
            if (success) {
                setMensagem("Usuário removido com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Usuário removido com sucesso!', 'success');
                carregarLista(); // Recarrega a lista
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    // Função para atualizar usuário
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
        
        // Usar o service com validação automática
        atualizarUsuario(id, usuarioUpdate, (success, message, errors) => {
            if (success) {
                setMensagem("Usuário atualizado com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Usuário atualizado com sucesso!', 'success');
                carregarLista(); // Recarrega a lista
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
                if (errors) {
                    console.log('Erros de validação:', errors);
                }
            }
            setLoading(false);
        });
    };

    // Função para buscar usuário por ID
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

    // Função para buscar usuário por email
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

    // Função para login
    const login = (email: string, senha: string) => {
        setLoading(true);
        const loginData: UsuarioLoginDto = {
            emailUsuario: email,
            senhaUsuario: senha
        };
        
        // Usar o service com validação automática
        loginUsuario(loginData, (success, message, usuario, token) => {
            if (success && usuario && token) {
                setMensagem("Login realizado com sucesso");
                setStatus("sucesso");
                setUsuario(usuario);
                setUsuarioLogado(usuario); // Salvar no contexto global
                setToken(token); // Salvar token no contexto global
                setEmail(usuario.emailUsuario); // Salvar email no contexto global
                toastRef.current?.show('Sucesso', 'Login realizado com sucesso!', 'success');
                // navigation.navigate("Home");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    // Função para lidar com inputs
    const handlerInput = (texto: string, nomeCampo: string) => {
        const novoUsuario = { ...usuario };
        if (nomeCampo === 'dataNascimentoUsuario') {
            (novoUsuario as any)[nomeCampo] = new Date(texto);
        } else {
            (novoUsuario as any)[nomeCampo] = texto;
        }
        setUsuario(novoUsuario);
    };

    // Função para limpar usuário
    const limparUsuario = () => {
        setUsuario(usuarioLimpo);
    };

    // Função para selecionar usuário
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
```

## Vantagens da Integração

### 1. **Validação Automática**
- Os services implementam validação com Yup
- Erros de validação são tratados automaticamente
- Mensagens de erro específicas para cada campo

### 2. **Contexto Global**
- Estados sincronizados entre componentes
- Toast global disponível em qualquer lugar
- Autenticação centralizada

### 3. **Tratamento de Erros**
- Erros de validação são logados no console
- Toast mostra mensagens de sucesso/erro
- Estados de loading e mensagem atualizados

### 4. **Reutilização**
- Services podem ser usados em qualquer control
- Validação consistente em toda aplicação
- Código mais limpo e organizado

### 5. **Tipagem Forte**
- TypeScript em todos os services
- Interfaces bem definidas
- Autocompletar e verificação de tipos

## Como Usar em Componentes

```tsx
import { useUsuarioControl } from '../control/useUsuarioControl';

const UsuarioComponent = () => {
    const {
        usuario,
        listaUsuarios,
        loading,
        mensagem,
        status,
        handlerInput,
        salvar,
        carregarLista,
        apagar,
        atualizar,
        login
    } = useUsuarioControl();

    return (
        <div>
            {/* Seu componente aqui */}
            <button onClick={salvar}>Salvar</button>
            <button onClick={carregarLista}>Carregar Lista</button>
            <button onClick={() => apagar(1)}>Apagar</button>
            <button onClick={() => atualizar(1)}>Atualizar</button>
            <button onClick={() => login('email@test.com', 'senha123')}>Login</button>
        </div>
    );
};
```

## Próximos Passos

1. **Criar schemas para todas as entidades**
2. **Atualizar todos os controls para usar services**
3. **Implementar validação em tempo real**
4. **Adicionar testes unitários**
5. **Documentar todas as validações**


