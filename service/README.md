# Services

Este diretório contém os services que implementam validação e lógica de negócio para cada entidade.

## Como Usar

### 1. Importar o service

```tsx
import { 
    salvarUsuario, 
    carregarUsuarios, 
    apagarUsuario, 
    atualizarUsuario,
    buscarUsuarioPorId,
    buscarUsuarioPorEmail,
    loginUsuario
} from '../service/usuarioService';
```

### 2. Usar nos Controls

```tsx
import { useContext } from 'react';
import { ContextoPrincipal } from '../contexto/ContextoPrincipal';
import { 
    salvarUsuario, 
    carregarUsuarios, 
    apagarUsuario, 
    atualizarUsuario 
} from '../service/usuarioService';

const UsuarioComponent = () => {
    const { toastRef, setUsuarios, setLoading, setMensagem, setStatus } = useContext(ContextoPrincipal);
    
    const handleSalvar = (usuario: UsuarioCreateDto) => {
        setLoading(true);
        salvarUsuario(usuario, (success, message, errors) => {
            if (success) {
                setMensagem('Usuário salvo com sucesso');
                setStatus('sucesso');
                toastRef.current?.show('Sucesso', 'Usuário salvo com sucesso!', 'success');
                carregarUsuarios((success, message, usuarios) => {
                    if (success) {
                        setUsuarios(usuarios);
                    }
                });
            } else {
                setMensagem(message);
                setStatus('erro');
                toastRef.current?.show('Erro', message, 'danger');
                if (errors) {
                    console.log('Erros de validação:', errors);
                }
            }
            setLoading(false);
        });
    };
    
    return (
        <div>
            {/* Seu componente aqui */}
        </div>
    );
};
```

### 3. Validação Automática

Os services implementam validação automática usando schemas personalizados:

```tsx
// Exemplo de validação para Usuario
const usuarioSchema = {
    validate: (usuario: Usuario) => {
        return new Promise((resolve, reject) => {
            const errors: string[] = [];
            
            if (!usuario.nomeUsuario || usuario.nomeUsuario.trim() === '') {
                errors.push('Nome é obrigatório');
            }
            
            if (!usuario.cpfUsuario || usuario.cpfUsuario.trim() === '') {
                errors.push('CPF é obrigatório');
            }
            
            if (!usuario.emailUsuario || usuario.emailUsuario.trim() === '') {
                errors.push('Email é obrigatório');
            }
            
            if (!usuario.senhaUsuario || usuario.senhaUsuario.trim() === '') {
                errors.push('Senha é obrigatória');
            }
            
            if (errors.length > 0) {
                const error = new Error(errors.join(', '));
                (error as any).inner = errors.map(msg => ({ path: 'usuario', message: msg }));
                reject(error);
            } else {
                resolve(usuario);
            }
        });
    }
};
```

## Services Disponíveis

### UsuarioService
- `salvarUsuario()` - Salvar usuário com validação
- `carregarUsuarios()` - Carregar lista de usuários
- `apagarUsuario()` - Apagar usuário
- `atualizarUsuario()` - Atualizar usuário
- `buscarUsuarioPorId()` - Buscar usuário por ID
- `buscarUsuarioPorEmail()` - Buscar usuário por email
- `loginUsuario()` - Login de usuário

### MotoService
- `salvarMoto()` - Salvar moto com validação
- `carregarMotos()` - Carregar lista de motos
- `apagarMoto()` - Apagar moto
- `atualizarMoto()` - Atualizar moto
- `buscarMotoPorId()` - Buscar moto por ID
- `buscarMotoPorPlaca()` - Buscar moto por placa
- `buscarMotoPorEstado()` - Buscar moto por estado
- `buscarMotoPorContrato()` - Buscar moto por contrato

### PatioService
- `salvarPatio()` - Salvar pátio com validação
- `carregarPatios()` - Carregar lista de pátios
- `apagarPatio()` - Apagar pátio
- `atualizarPatio()` - Atualizar pátio
- `buscarPatioPorId()` - Buscar pátio por ID
- `buscarPatioPorNome()` - Buscar pátio por nome
- `buscarMotosDisponiveisMaiorQue()` - Buscar pátios com motos disponíveis
- `buscarDataPosterior()` - Buscar pátios por data posterior
- `buscarDataAnterior()` - Buscar pátios por data anterior

### CameraService
- `salvarCamera()` - Salvar câmera com validação
- `carregarCameras()` - Carregar lista de câmeras
- `apagarCamera()` - Apagar câmera
- `atualizarCamera()` - Atualizar câmera
- `buscarCameraPorId()` - Buscar câmera por ID
- `buscarCameraPorNome()` - Buscar câmera por nome
- `buscarCameraPorStatus()` - Buscar câmera por status

### ContratoService
- `salvarContrato()` - Salvar contrato com validação
- `carregarContratos()` - Carregar lista de contratos
- `apagarContrato()` - Apagar contrato
- `atualizarContrato()` - Atualizar contrato
- `buscarContratoPorId()` - Buscar contrato por ID
- `buscarContratoPorAtivo()` - Buscar contrato por status ativo
- `buscarContratoPorUsuario()` - Buscar contrato por usuário
- `buscarContratoPorMoto()` - Buscar contrato por moto
- `buscarContratosNaoExpirados()` - Buscar contratos não expirados
- `buscarContratoPorRenovacaoAutomatica()` - Buscar contrato por renovação automática
- `buscarContratoPorDataEntrada()` - Buscar contrato por data de entrada

### EnderecoService
- `salvarEndereco()` - Salvar endereço com validação
- `carregarEnderecos()` - Carregar lista de endereços
- `apagarEndereco()` - Apagar endereço
- `atualizarEndereco()` - Atualizar endereço
- `buscarEnderecoPorId()` - Buscar endereço por ID
- `buscarEnderecoPorCep()` - Buscar endereço por CEP
- `buscarEnderecoPorEstado()` - Buscar endereço por estado
- `buscarEnderecoPorCidade()` - Buscar endereço por cidade
- `buscarEnderecoPorBairro()` - Buscar endereço por bairro
- `buscarEnderecoPorPatio()` - Buscar endereço por pátio

### LayoutPatioService
- `salvarLayoutPatio()` - Salvar layout de pátio com validação
- `carregarLayoutPatios()` - Carregar lista de layouts de pátio
- `apagarLayoutPatio()` - Apagar layout de pátio
- `atualizarLayoutPatio()` - Atualizar layout de pátio
- `buscarLayoutPatioPorId()` - Buscar layout de pátio por ID
- `buscarLayoutPatioPorPatio()` - Buscar layout de pátio por pátio
- `buscarLayoutPatioPorDataCriacao()` - Buscar layout de pátio por data de criação

### PermissaoService
- `salvarPermissao()` - Salvar permissão com validação
- `carregarPermissoes()` - Carregar lista de permissões
- `apagarPermissao()` - Apagar permissão
- `atualizarPermissao()` - Atualizar permissão
- `buscarPermissaoPorId()` - Buscar permissão por ID
- `buscarPermissaoPorNome()` - Buscar permissão por nome
- `buscarPermissaoPorDescricao()` - Buscar permissão por descrição

### QrCodePontoService
- `salvarQrCodePonto()` - Salvar QR Code de ponto com validação
- `carregarQrCodePontos()` - Carregar lista de QR Codes de ponto
- `apagarQrCodePonto()` - Apagar QR Code de ponto
- `atualizarQrCodePonto()` - Atualizar QR Code de ponto
- `buscarQrCodePontoPorId()` - Buscar QR Code de ponto por ID
- `buscarQrCodePontoPorIdentificador()` - Buscar QR Code de ponto por identificador
- `buscarQrCodePontoPorLayoutPatio()` - Buscar QR Code de ponto por layout de pátio
- `buscarQrCodePontoPorPosX()` - Buscar QR Code de ponto por posição X
- `buscarQrCodePontoPorPosY()` - Buscar QR Code de ponto por posição Y

### TelefoneService
- `salvarTelefone()` - Salvar telefone com validação
- `carregarTelefones()` - Carregar lista de telefones
- `apagarTelefone()` - Apagar telefone
- `atualizarTelefone()` - Atualizar telefone
- `buscarTelefonePorId()` - Buscar telefone por ID
- `buscarTelefonePorNumero()` - Buscar telefone por número
- `buscarTelefonePorUsuario()` - Buscar telefone por usuário
- `buscarTelefonePorTipo()` - Buscar telefone por tipo

### UsuarioPermissaoService
- `salvarUsuarioPermissao()` - Salvar usuário permissão com validação
- `carregarUsuarioPermissoes()` - Carregar lista de usuário permissões
- `apagarUsuarioPermissao()` - Apagar usuário permissão
- `atualizarUsuarioPermissao()` - Atualizar usuário permissão
- `buscarUsuarioPermissaoPorIdComposto()` - Buscar usuário permissão por ID composto
- `buscarUsuarioPermissaoPorUsuario()` - Buscar usuário permissão por usuário
- `buscarUsuarioPermissaoPorPermissao()` - Buscar usuário permissão por permissão

## Vantagens

1. **Validação Automática:** Todos os services implementam validação
2. **Tratamento de Erros:** Erros de validação são tratados automaticamente
3. **Logs Detalhados:** Console logs para debugging
4. **Tipagem Forte:** TypeScript em todos os services
5. **Reutilização:** Services podem ser usados em qualquer componente
6. **Integração:** Integração perfeita com fetchers e controls


