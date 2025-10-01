import React, { createContext, useState, useRef } from "react";
import { ToastMessageRef } from '../view/components/Toast';
import { Usuario, Moto, Patio, Camera, Contrato, Endereco, LayoutPatio, Permissao, QrCodePonto, Telefone, UsuarioPermissao } from '../model';

type CorpoContextoPrincipal = { 
    // Autenticação
    token: string | null,
    setToken: (valorToken: string | null) => void,
    email: string | null, 
    setEmail: (valorEmail: string | null) => void,
    fecharSessao: () => void,
    isAuthenticated: boolean,
    usuarioLogado: Usuario | null,
    setUsuarioLogado: (usuario: Usuario | null) => void,
    
    // Toast
    toastRef: React.RefObject<ToastMessageRef>,
    
    // Estados globais
    loading: boolean,
    setLoading: (loading: boolean) => void,
    mensagem: string,
    setMensagem: (mensagem: string) => void,
    status: string,
    setStatus: (status: string) => void,
    
    // Usuários
    usuarios: Usuario[],
    setUsuarios: (usuarios: Usuario[]) => void,
    usuarioSelecionado: Usuario | null,
    setUsuarioSelecionado: (usuario: Usuario | null) => void,
    
    // Motos
    motos: Moto[],
    setMotos: (motos: Moto[]) => void,
    motoSelecionada: Moto | null,
    setMotoSelecionada: (moto: Moto | null) => void,
    
    // Pátios
    patios: Patio[],
    setPatios: (patios: Patio[]) => void,
    patioSelecionado: Patio | null,
    setPatioSelecionado: (patio: Patio | null) => void,
    
    // Câmeras
    cameras: Camera[],
    setCameras: (cameras: Camera[]) => void,
    cameraSelecionada: Camera | null,
    setCameraSelecionada: (camera: Camera | null) => void,
    
    // Contratos
    contratos: Contrato[],
    setContratos: (contratos: Contrato[]) => void,
    contratoSelecionado: Contrato | null,
    setContratoSelecionado: (contrato: Contrato | null) => void,
    
    // Endereços
    enderecos: Endereco[],
    setEnderecos: (enderecos: Endereco[]) => void,
    enderecoSelecionado: Endereco | null,
    setEnderecoSelecionado: (endereco: Endereco | null) => void,
    
    // Layout de Pátio
    layoutPatios: LayoutPatio[],
    setLayoutPatios: (layoutPatios: LayoutPatio[]) => void,
    layoutPatioSelecionado: LayoutPatio | null,
    setLayoutPatioSelecionado: (layoutPatio: LayoutPatio | null) => void,
    
    // Permissões
    permissoes: Permissao[],
    setPermissoes: (permissoes: Permissao[]) => void,
    permissaoSelecionada: Permissao | null,
    setPermissaoSelecionada: (permissao: Permissao | null) => void,
    
    // QR Code de Ponto
    qrCodePontos: QrCodePonto[],
    setQrCodePontos: (qrCodePontos: QrCodePonto[]) => void,
    qrCodePontoSelecionado: QrCodePonto | null,
    setQrCodePontoSelecionado: (qrCodePonto: QrCodePonto | null) => void,
    
    // Telefones
    telefones: Telefone[],
    setTelefones: (telefones: Telefone[]) => void,
    telefoneSelecionado: Telefone | null,
    setTelefoneSelecionado: (telefone: Telefone | null) => void,
    
    // Usuário Permissão
    usuarioPermissoes: UsuarioPermissao[],
    setUsuarioPermissoes: (usuarioPermissoes: UsuarioPermissao[]) => void,
    usuarioPermissaoSelecionado: UsuarioPermissao | null,
    setUsuarioPermissaoSelecionado: (usuarioPermissao: UsuarioPermissao | null) => void
}

const corpoVazioContextoPrincipal: CorpoContextoPrincipal = { 
    // Autenticação
    token: null,
    email: null,
    setToken: (valorToken: string | null) => {},
    setEmail: (valorEmail: string | null) => {},
    fecharSessao: () => {},
    isAuthenticated: false,
    usuarioLogado: null,
    setUsuarioLogado: (usuario: Usuario | null) => {},
    
    // Toast
    toastRef: { current: null as any },
    
    // Estados globais
    loading: false,
    setLoading: () => {},
    mensagem: "",
    setMensagem: () => {},
    status: "sucesso",
    setStatus: () => {},
    
    // Usuários
    usuarios: [],
    setUsuarios: () => {},
    usuarioSelecionado: null,
    setUsuarioSelecionado: () => {},
    
    // Motos
    motos: [],
    setMotos: () => {},
    motoSelecionada: null,
    setMotoSelecionada: () => {},
    
    // Pátios
    patios: [],
    setPatios: () => {},
    patioSelecionado: null,
    setPatioSelecionado: () => {},
    
    // Câmeras
    cameras: [],
    setCameras: () => {},
    cameraSelecionada: null,
    setCameraSelecionada: () => {},
    
    // Contratos
    contratos: [],
    setContratos: () => {},
    contratoSelecionado: null,
    setContratoSelecionado: () => {},
    
    // Endereços
    enderecos: [],
    setEnderecos: () => {},
    enderecoSelecionado: null,
    setEnderecoSelecionado: () => {},
    
    // Layout de Pátio
    layoutPatios: [],
    setLayoutPatios: () => {},
    layoutPatioSelecionado: null,
    setLayoutPatioSelecionado: () => {},
    
    // Permissões
    permissoes: [],
    setPermissoes: () => {},
    permissaoSelecionada: null,
    setPermissaoSelecionada: () => {},
    
    // QR Code de Ponto
    qrCodePontos: [],
    setQrCodePontos: () => {},
    qrCodePontoSelecionado: null,
    setQrCodePontoSelecionado: () => {},
    
    // Telefones
    telefones: [],
    setTelefones: () => {},
    telefoneSelecionado: null,
    setTelefoneSelecionado: () => {},
    
    // Usuário Permissão
    usuarioPermissoes: [],
    setUsuarioPermissoes: () => {},
    usuarioPermissaoSelecionado: null,
    setUsuarioPermissaoSelecionado: () => {}
}

const ContextoPrincipal = createContext<CorpoContextoPrincipal>(corpoVazioContextoPrincipal);

interface ContextoPrincipalProviderProps {
    children: React.ReactNode;
}

const ContextoPrincipalProvider: React.FC<ContextoPrincipalProviderProps> = ({ children }) => {
    // Autenticação
    const [token, setToken] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [usuarioLogado, setUsuarioLogado] = useState<Usuario | null>(null);
    
    // Toast
    const toastRef = useRef<ToastMessageRef>(null as any);
    
    // Estados globais
    const [loading, setLoading] = useState<boolean>(false);
    const [mensagem, setMensagem] = useState<string>("");
    const [status, setStatus] = useState<string>("sucesso");
    
    // Usuários
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
    
    // Motos
    const [motos, setMotos] = useState<Moto[]>([]);
    const [motoSelecionada, setMotoSelecionada] = useState<Moto | null>(null);
    
    // Pátios
    const [patios, setPatios] = useState<Patio[]>([]);
    const [patioSelecionado, setPatioSelecionado] = useState<Patio | null>(null);
    
    // Câmeras
    const [cameras, setCameras] = useState<Camera[]>([]);
    const [cameraSelecionada, setCameraSelecionada] = useState<Camera | null>(null);
    
    // Contratos
    const [contratos, setContratos] = useState<Contrato[]>([]);
    const [contratoSelecionado, setContratoSelecionado] = useState<Contrato | null>(null);
    
    // Endereços
    const [enderecos, setEnderecos] = useState<Endereco[]>([]);
    const [enderecoSelecionado, setEnderecoSelecionado] = useState<Endereco | null>(null);
    
    // Layout de Pátio
    const [layoutPatios, setLayoutPatios] = useState<LayoutPatio[]>([]);
    const [layoutPatioSelecionado, setLayoutPatioSelecionado] = useState<LayoutPatio | null>(null);
    
    // Permissões
    const [permissoes, setPermissoes] = useState<Permissao[]>([]);
    const [permissaoSelecionada, setPermissaoSelecionada] = useState<Permissao | null>(null);
    
    // QR Code de Ponto
    const [qrCodePontos, setQrCodePontos] = useState<QrCodePonto[]>([]);
    const [qrCodePontoSelecionado, setQrCodePontoSelecionado] = useState<QrCodePonto | null>(null);
    
    // Telefones
    const [telefones, setTelefones] = useState<Telefone[]>([]);
    const [telefoneSelecionado, setTelefoneSelecionado] = useState<Telefone | null>(null);
    
    // Usuário Permissão
    const [usuarioPermissoes, setUsuarioPermissoes] = useState<UsuarioPermissao[]>([]);
    const [usuarioPermissaoSelecionado, setUsuarioPermissaoSelecionado] = useState<UsuarioPermissao | null>(null);

    const fecharSessao = () => {
        setToken(null);
        setEmail(null);
        setUsuarioLogado(null);
    };

    const isAuthenticated = !!token && !!usuarioLogado;

    const valorContexto: CorpoContextoPrincipal = {
        // Autenticação
        token,
        setToken,
        email,
        setEmail,
        fecharSessao,
        isAuthenticated,
        usuarioLogado,
        setUsuarioLogado,
        
        // Toast
        toastRef,
        
        // Estados globais
        loading,
        setLoading,
        mensagem,
        setMensagem,
        status,
        setStatus,
        
        // Usuários
        usuarios,
        setUsuarios,
        usuarioSelecionado,
        setUsuarioSelecionado,
        
        // Motos
        motos,
        setMotos,
        motoSelecionada,
        setMotoSelecionada,
        
        // Pátios
        patios,
        setPatios,
        patioSelecionado,
        setPatioSelecionado,
        
        // Câmeras
        cameras,
        setCameras,
        cameraSelecionada,
        setCameraSelecionada,
        
        // Contratos
        contratos,
        setContratos,
        contratoSelecionado,
        setContratoSelecionado,
        
        // Endereços
        enderecos,
        setEnderecos,
        enderecoSelecionado,
        setEnderecoSelecionado,
        
        // Layout de Pátio
        layoutPatios,
        setLayoutPatios,
        layoutPatioSelecionado,
        setLayoutPatioSelecionado,
        
        // Permissões
        permissoes,
        setPermissoes,
        permissaoSelecionada,
        setPermissaoSelecionada,
        
        // QR Code de Ponto
        qrCodePontos,
        setQrCodePontos,
        qrCodePontoSelecionado,
        setQrCodePontoSelecionado,
        
        // Telefones
        telefones,
        setTelefones,
        telefoneSelecionado,
        setTelefoneSelecionado,
        
        // Usuário Permissão
        usuarioPermissoes,
        setUsuarioPermissoes,
        usuarioPermissaoSelecionado,
        setUsuarioPermissaoSelecionado
    };

    return (
        <ContextoPrincipal.Provider value={valorContexto}>
            {children}
        </ContextoPrincipal.Provider>
    );
};

export { 
    CorpoContextoPrincipal, 
    corpoVazioContextoPrincipal, 
    ContextoPrincipal,
    ContextoPrincipalProvider
};
