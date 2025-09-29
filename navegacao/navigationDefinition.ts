import { NavigatorScreenParams } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';

// ===== STACKS PRINCIPAIS =====

// Stack de Autenticação (Login/Registro)
export type AuthStackParamList = {
    UsuarioLogin: undefined;
    UsuarioRegistro: undefined;
};

// Stack Principal da Aplicação (após login)
export type MainAppStackParamList = {
    Home: undefined;
    Moto: NavigatorScreenParams<MotoStackParamList>;
    Patio: NavigatorScreenParams<PatioStackParamList>;
    Usuario: NavigatorScreenParams<UsuarioStackParamList>;
    Camera: NavigatorScreenParams<CameraStackParamList>;
    Contrato: NavigatorScreenParams<ContratoStackParamList>;
    Endereco: NavigatorScreenParams<EnderecoStackParamList>;
    LayoutPatio: NavigatorScreenParams<LayoutPatioStackParamList>;
    Permissao: NavigatorScreenParams<PermissaoStackParamList>;
    QrCodePonto: NavigatorScreenParams<QrCodePontoStackParamList>;
    Telefone: NavigatorScreenParams<TelefoneStackParamList>;
    UsuarioPermissao: NavigatorScreenParams<UsuarioPermissaoStackParamList>;
};

// ===== STACKS ESPECÍFICOS =====

// Stack de Moto
export type MotoStackParamList = {
    MotoList: undefined;
    MotoDetalhes: { idMoto: number };
    MotoFormulario: { moto?: any } | undefined;
};

// Stack de Pátio
export type PatioStackParamList = {
    PatioList: undefined;
    PatioDetalhes: { idPatio: number };
    PatioFormulario: { patio?: any } | undefined;
};

// Stack de Usuário
export type UsuarioStackParamList = {
    UsuarioList: undefined;
    UsuarioDetalhes: { idUsuario: number };
    UsuarioFormulario: { usuario?: any } | undefined;
    UsuarioLogin: undefined;
    UsuarioRegistro: undefined;
};

// Stack de Câmera
export type CameraStackParamList = {
    CameraList: undefined;
    CameraDetalhes: { idCamera: number };
    CameraFormulario: { camera?: any } | undefined;
};

// Stack de Contrato
export type ContratoStackParamList = {
    ContratoList: undefined;
    ContratoDetalhes: { idContrato: number };
    ContratoFormulario: { contrato?: any } | undefined;
};

// Stack de Endereço
export type EnderecoStackParamList = {
    EnderecoList: undefined;
    EnderecoDetalhes: { idEndereco: number };
    EnderecoFormulario: { endereco?: any } | undefined;
};

// Stack de Layout de Pátio
export type LayoutPatioStackParamList = {
    LayoutPatioList: undefined;
    LayoutPatioDetalhes: { idLayoutPatio: number };
    LayoutPatioFormulario: { layoutPatio?: any } | undefined;
};

// Stack de Permissão
export type PermissaoStackParamList = {
    PermissaoList: undefined;
    PermissaoDetalhes: { idPermissao: number };
    PermissaoFormulario: { permissao?: any } | undefined;
};

// Stack de QR Code de Ponto
export type QrCodePontoStackParamList = {
    QrCodePontoList: undefined;
    QrCodePontoDetalhes: { idQrCodePonto: number };
    QrCodePontoFormulario: { qrCodePonto?: any } | undefined;
};

// Stack de Telefone
export type TelefoneStackParamList = {
    TelefoneList: undefined;
    TelefoneDetalhes: { idTelefone: number };
    TelefoneFormulario: { telefone?: any } | undefined;
};

// Stack de Usuário Permissão
export type UsuarioPermissaoStackParamList = {
    UsuarioPermissaoList: undefined;
    UsuarioPermissaoDetalhes: { usuarioId: number; permissaoId: number };
    UsuarioPermissaoFormulario: { usuarioPermissao?: any } | undefined;
};

// ===== NAVIGATORS =====

// Navigator de Autenticação
export const AuthNavigator = createStackNavigator<AuthStackParamList>();

// Navigator Principal da Aplicação
export const MainAppNavigator = createStackNavigator<MainAppStackParamList>();

// Navigators Específicos
export const MotoNavigator = createStackNavigator<MotoStackParamList>();
export const PatioNavigator = createStackNavigator<PatioStackParamList>();
export const UsuarioNavigator = createStackNavigator<UsuarioStackParamList>();
export const CameraNavigator = createStackNavigator<CameraStackParamList>();
export const ContratoNavigator = createStackNavigator<ContratoStackParamList>();
export const EnderecoNavigator = createStackNavigator<EnderecoStackParamList>();
export const LayoutPatioNavigator = createStackNavigator<LayoutPatioStackParamList>();
export const PermissaoNavigator = createStackNavigator<PermissaoStackParamList>();
export const QrCodePontoNavigator = createStackNavigator<QrCodePontoStackParamList>();
export const TelefoneNavigator = createStackNavigator<TelefoneStackParamList>();
export const UsuarioPermissaoNavigator = createStackNavigator<UsuarioPermissaoStackParamList>();

// ===== NAVIGATION PROPS =====

// Props de Navegação Principal
export type MainAppStackNavigationProp = StackNavigationProp<MainAppStackParamList, "Home">;
export type AuthStackNavigationProp = StackNavigationProp<AuthStackParamList, "UsuarioLogin">;

// Props de Navegação Específicas
export type MotoStackNavigationProp = StackNavigationProp<MotoStackParamList, "MotoList">;
export type PatioStackNavigationProp = StackNavigationProp<PatioStackParamList, "PatioList">;
export type UsuarioStackNavigationProp = StackNavigationProp<UsuarioStackParamList, "UsuarioList">;
export type CameraStackNavigationProp = StackNavigationProp<CameraStackParamList, "CameraList">;
export type ContratoStackNavigationProp = StackNavigationProp<ContratoStackParamList, "ContratoList">;
export type EnderecoStackNavigationProp = StackNavigationProp<EnderecoStackParamList, "EnderecoList">;
export type LayoutPatioStackNavigationProp = StackNavigationProp<LayoutPatioStackParamList, "LayoutPatioList">;
export type PermissaoStackNavigationProp = StackNavigationProp<PermissaoStackParamList, "PermissaoList">;
export type QrCodePontoStackNavigationProp = StackNavigationProp<QrCodePontoStackParamList, "QrCodePontoList">;
export type TelefoneStackNavigationProp = StackNavigationProp<TelefoneStackParamList, "TelefoneList">;
export type UsuarioPermissaoStackNavigationProp = StackNavigationProp<UsuarioPermissaoStackParamList, "UsuarioPermissaoList">;

// ===== EXPORTS =====
// Todos os tipos e navigators já estão exportados acima
