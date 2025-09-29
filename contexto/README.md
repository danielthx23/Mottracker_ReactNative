# Contexto Principal

Este arquivo contém o contexto principal da aplicação com todos os estados globais necessários.

## Como Usar

### 1. Envolver a aplicação com o Provider

```tsx
import { ContextoPrincipalProvider } from './contexto/ContextoPrincipal';

function App() {
  return (
    <ContextoPrincipalProvider>
      {/* Sua aplicação aqui */}
    </ContextoPrincipalProvider>
  );
}
```

### 2. Usar o contexto em qualquer componente

```tsx
import React, { useContext } from 'react';
import { ContextoPrincipal } from './contexto/ContextoPrincipal';

const MeuComponente = () => {
  const { 
    // Autenticação
    token, setToken, email, setEmail, fecharSessao, isAuthenticated, usuarioLogado, setUsuarioLogado,
    
    // Toast
    toastRef,
    
    // Estados globais
    loading, setLoading, mensagem, setMensagem, status, setStatus,
    
    // Usuários
    usuarios, setUsuarios, usuarioSelecionado, setUsuarioSelecionado,
    
    // Motos
    motos, setMotos, motoSelecionada, setMotoSelecionada,
    
    // Pátios
    patios, setPatios, patioSelecionado, setPatioSelecionado,
    
    // Câmeras
    cameras, setCameras, cameraSelecionada, setCameraSelecionada,
    
    // Contratos
    contratos, setContratos, contratoSelecionado, setContratoSelecionado,
    
    // Endereços
    enderecos, setEnderecos, enderecoSelecionado, setEnderecoSelecionado,
    
    // Layout de Pátio
    layoutPatios, setLayoutPatios, layoutPatioSelecionado, setLayoutPatioSelecionado,
    
    // Permissões
    permissoes, setPermissoes, permissaoSelecionada, setPermissaoSelecionada,
    
    // QR Code de Ponto
    qrCodePontos, setQrCodePontos, qrCodePontoSelecionado, setQrCodePontoSelecionado,
    
    // Telefones
    telefones, setTelefones, telefoneSelecionado, setTelefoneSelecionado,
    
    // Usuário Permissão
    usuarioPermissoes, setUsuarioPermissoes, usuarioPermissaoSelecionado, setUsuarioPermissaoSelecionado
  } = useContext(ContextoPrincipal);

  // Usar os estados e funções aqui
  const handleLogin = () => {
    setToken('token123');
    setEmail('usuario@email.com');
    setUsuarioLogado({ idUsuario: 1, nomeUsuario: 'João' });
  };

  const showToast = () => {
    toastRef.current?.show('Sucesso', 'Operação realizada com sucesso!', 'success');
  };

  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={showToast}>Mostrar Toast</button>
      <button onClick={fecharSessao}>Logout</button>
    </div>
  );
};
```

### 3. Usar com Controls

```tsx
import { useUsuarioControl } from '../control/useUsuarioControl';
import { useContext } from 'react';
import { ContextoPrincipal } from '../contexto/ContextoPrincipal';

const UsuarioComponent = () => {
  const { toastRef, setUsuarios, setLoading, setMensagem, setStatus } = useContext(ContextoPrincipal);
  
  const {
    usuario,
    listaUsuarios,
    loading,
    mensagem,
    status,
    salvar,
    carregarLista,
    apagar,
    atualizar
  } = useUsuarioControl();

  // Sincronizar com o contexto global
  React.useEffect(() => {
    setUsuarios(listaUsuarios);
    setLoading(loading);
    setMensagem(mensagem);
    setStatus(status);
  }, [listaUsuarios, loading, mensagem, status, setUsuarios, setLoading, setMensagem, setStatus]);

  return (
    <div>
      {/* Seu componente aqui */}
    </div>
  );
};
```

## Estados Disponíveis

### Autenticação
- `token`: Token de autenticação
- `email`: Email do usuário logado
- `usuarioLogado`: Dados do usuário logado
- `isAuthenticated`: Se o usuário está autenticado
- `fecharSessao()`: Função para fazer logout

### Toast
- `toastRef`: Referência para o componente de toast

### Estados Globais
- `loading`: Estado de carregamento
- `mensagem`: Mensagem atual
- `status`: Status da operação (sucesso, erro, etc.)

### Entidades
Cada entidade tem:
- Lista de itens (ex: `usuarios`, `motos`, `patios`)
- Item selecionado (ex: `usuarioSelecionado`, `motoSelecionada`)
- Funções de setter correspondentes

## Vantagens

1. **Estado Global**: Todos os estados em um lugar
2. **Toast Global**: Acesso ao toast em qualquer componente
3. **Autenticação Centralizada**: Controle de login/logout
4. **Tipagem Forte**: TypeScript em todos os estados
5. **Fácil de Usar**: Apenas um contexto para tudo


