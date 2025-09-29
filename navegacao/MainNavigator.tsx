import React, { useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { 
    AuthStackParamList,
    MainAppStackParamList 
} from './navigationDefinition';
import BottomTabNavigatorComponent from './BottomTabNavigator';
import UsuarioNavigatorComponent from './UsuarioNavigator';
import MotoNavigatorComponent from './MotoNavigator';
import PatioNavigatorComponent from './PatioNavigator';
import CameraNavigatorComponent from './CameraNavigator';
import ContratoNavigatorComponent from './ContratoNavigator';
import EnderecoNavigatorComponent from './EnderecoNavigator';
import LayoutPatioNavigatorComponent from './LayoutPatioNavigator';
import PermissaoNavigatorComponent from './PermissaoNavigator';
import QrCodePontoNavigatorComponent from './QrCodePontoNavigator';
import TelefoneNavigatorComponent from './TelefoneNavigator';
import UsuarioPermissaoNavigatorComponent from './UsuarioPermissaoNavigator';
import ToastMessage, { ToastMessageRef } from '../view/components/Toast';

const AuthStack = createStackNavigator<AuthStackParamList>();
const MainAppStack = createStackNavigator<MainAppStackParamList>();

interface MainNavigatorProps {
    isAuthenticated: boolean;
    setUsuarioLogado: (usuario: any) => void;
}

const MainNavigator: React.FC<MainNavigatorProps> = ({
    isAuthenticated,
    setUsuarioLogado
}) => {
    const toastRef = useRef<ToastMessageRef>(null);

    const handleNavigateToMoto = (idMoto: number) => {
        // Implementar navegação para moto específica
        console.log('Navegar para moto:', idMoto);
    };

    const handleLogin = (cpf: string, senha: string, navigation: any) => {
        // Implementar lógica de login
        console.log('Login:', cpf, senha);
        // setUsuarioLogado(usuario);
        // navigation.navigate('MainApp');
    };

    const handleRegister = (usuario: any, navigation: any) => {
        // Implementar lógica de registro
        console.log('Registro:', usuario);
        // navigation.navigate('UsuarioLogin');
    };

    const handleMotoDelete = (idMoto: number) => {
        console.log('Deletar moto:', idMoto);
    };

    const handleMotoSave = (moto: any) => {
        console.log('Salvar moto:', moto);
    };

    const handleMotoEdit = (moto: any) => {
        console.log('Editar moto:', moto);
    };

    const handlePatioDelete = (idPatio: number) => {
        console.log('Deletar pátio:', idPatio);
    };

    const handlePatioSave = (patio: any) => {
        console.log('Salvar pátio:', patio);
    };

    const handlePatioEdit = (patio: any) => {
        console.log('Editar pátio:', patio);
    };

    if (isAuthenticated) {
        return (
            <NavigationContainer>
                <MainAppStack.Navigator 
                    initialRouteName="Home" 
                    screenOptions={{ headerShown: false }}
                >
                    <MainAppStack.Screen name="Home">
                        {(props) => (
                            <BottomTabNavigatorComponent
                                {...props}
                                toastRef={toastRef}
                                setUsuarioLogado={setUsuarioLogado}
                                onNavigateToMoto={handleNavigateToMoto}
                            />
                        )}
                    </MainAppStack.Screen>
                    
                    <MainAppStack.Screen name="Moto">
                        {(props) => (
                            <MotoNavigatorComponent
                                {...props}
                                toastRef={toastRef}
                                motos={[]}
                                onDelete={handleMotoDelete}
                                onSave={handleMotoSave}
                                onEdit={handleMotoEdit}
                            />
                        )}
                    </MainAppStack.Screen>
                    
                    <MainAppStack.Screen name="Patio">
                        {(props) => (
                            <PatioNavigatorComponent
                                {...props}
                                toastRef={toastRef}
                                patios={[]}
                                onDelete={handlePatioDelete}
                                onSave={handlePatioSave}
                                onEdit={handlePatioEdit}
                                onNavigateToMoto={handleNavigateToMoto}
                            />
                        )}
                    </MainAppStack.Screen>
                    
                    <MainAppStack.Screen name="Usuario">
                        {(props) => (
                            <UsuarioNavigatorComponent
                                {...props}
                                setUsuarioLogado={setUsuarioLogado}
                                toastRef={toastRef}
                                onLogin={handleLogin}
                                onRegister={handleRegister}
                            />
                        )}
                    </MainAppStack.Screen>
                    
                    <MainAppStack.Screen name="Camera">
                        {(props) => (
                            <CameraNavigatorComponent
                                {...props}
                                toastRef={toastRef}
                                cameras={[]}
                                onDelete={() => {}}
                                onSave={() => {}}
                                onEdit={() => {}}
                            />
                        )}
                    </MainAppStack.Screen>
                    
                    <MainAppStack.Screen name="Contrato">
                        {(props) => (
                            <ContratoNavigatorComponent
                                {...props}
                                toastRef={toastRef}
                                contratos={[]}
                                onDelete={() => {}}
                                onSave={() => {}}
                                onEdit={() => {}}
                            />
                        )}
                    </MainAppStack.Screen>
                    
                    <MainAppStack.Screen name="Endereco">
                        {(props) => (
                            <EnderecoNavigatorComponent
                                {...props}
                                toastRef={toastRef}
                                enderecos={[]}
                                onDelete={() => {}}
                                onSave={() => {}}
                                onEdit={() => {}}
                            />
                        )}
                    </MainAppStack.Screen>
                    
                    <MainAppStack.Screen name="LayoutPatio">
                        {(props) => (
                            <LayoutPatioNavigatorComponent
                                {...props}
                                toastRef={toastRef}
                                layoutPatios={[]}
                                onDelete={() => {}}
                                onSave={() => {}}
                                onEdit={() => {}}
                            />
                        )}
                    </MainAppStack.Screen>
                    
                    <MainAppStack.Screen name="Permissao">
                        {(props) => (
                            <PermissaoNavigatorComponent
                                {...props}
                                toastRef={toastRef}
                                permissoes={[]}
                                onDelete={() => {}}
                                onSave={() => {}}
                                onEdit={() => {}}
                            />
                        )}
                    </MainAppStack.Screen>
                    
                    <MainAppStack.Screen name="QrCodePonto">
                        {(props) => (
                            <QrCodePontoNavigatorComponent
                                {...props}
                                toastRef={toastRef}
                                qrCodePontos={[]}
                                onDelete={() => {}}
                                onSave={() => {}}
                                onEdit={() => {}}
                            />
                        )}
                    </MainAppStack.Screen>
                    
                    <MainAppStack.Screen name="Telefone">
                        {(props) => (
                            <TelefoneNavigatorComponent
                                {...props}
                                toastRef={toastRef}
                                telefones={[]}
                                onDelete={() => {}}
                                onSave={() => {}}
                                onEdit={() => {}}
                            />
                        )}
                    </MainAppStack.Screen>
                    
                    <MainAppStack.Screen name="UsuarioPermissao">
                        {(props) => (
                            <UsuarioPermissaoNavigatorComponent
                                {...props}
                                toastRef={toastRef}
                                usuarioPermissoes={[]}
                                onDelete={() => {}}
                                onSave={() => {}}
                                onEdit={() => {}}
                            />
                        )}
                    </MainAppStack.Screen>
                </MainAppStack.Navigator>
                
                <ToastMessage ref={toastRef} />
            </NavigationContainer>
        );
    }

    return (
        <NavigationContainer>
            <AuthStack.Navigator 
                initialRouteName="UsuarioLogin" 
                screenOptions={{ headerShown: false }}
            >
                <AuthStack.Screen name="UsuarioLogin">
                    {(props) => (
                        <UsuarioNavigatorComponent
                            {...props}
                            setUsuarioLogado={setUsuarioLogado}
                            toastRef={toastRef}
                            onLogin={handleLogin}
                            onRegister={handleRegister}
                        />
                    )}
                </AuthStack.Screen>
                
                <AuthStack.Screen name="UsuarioRegistro">
                    {(props) => (
                        <UsuarioNavigatorComponent
                            {...props}
                            setUsuarioLogado={setUsuarioLogado}
                            toastRef={toastRef}
                            onLogin={handleLogin}
                            onRegister={handleRegister}
                        />
                    )}
                </AuthStack.Screen>
            </AuthStack.Navigator>
            
            <ToastMessage ref={toastRef} />
        </NavigationContainer>
    );
};

export default MainNavigator;
