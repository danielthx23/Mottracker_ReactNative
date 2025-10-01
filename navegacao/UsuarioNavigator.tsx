import React from 'react';
import { 
    UsuarioNavigator, 
    UsuarioStackParamList 
} from './navigationDefinition';
import UsuarioLoginFormulario from '../view/components/UsuarioLoginFormulario';
import UsuarioRegisterFormulario from '../view/components/UsuarioRegisterFormulario';

interface UsuarioNavigatorProps {
    setUsuarioLogado: (usuario: any) => void;
    toastRef: React.RefObject<any>;
    onLogin: (cpf: string, senha: string, navigation: any) => void;
    onRegister: (usuario: any, navigation: any) => void;
}

const UsuarioNavigatorComponent: React.FC<UsuarioNavigatorProps> = ({
    setUsuarioLogado,
    toastRef,
    onLogin,
    onRegister
}) => {
    return (
        <UsuarioNavigator.Navigator 
            initialRouteName="UsuarioLogin" 
            screenOptions={{ headerShown: false }}
        >
            <UsuarioNavigator.Screen name="UsuarioLogin">
                {(props) => (
                    <UsuarioLoginFormulario
                        {...props}
                        onLogin={(cpf, senha) => onLogin(cpf, senha, props.navigation)}
                        loginError=""
                        setLoginError={() => {}}
                    />
                )}
            </UsuarioNavigator.Screen>
            
            <UsuarioNavigator.Screen name="UsuarioRegistro">
                {(props) => (
                    <UsuarioRegisterFormulario
                        {...props}
                        onGravar={(usuario) => onRegister(usuario, props.navigation)}
                    />
                )}
            </UsuarioNavigator.Screen>
        </UsuarioNavigator.Navigator>
    );
};

export default UsuarioNavigatorComponent;




