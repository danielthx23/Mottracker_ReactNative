import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { 
    AuthNavigator, 
    MainAppNavigator,
    AuthStackParamList,
    MainAppStackParamList 
} from './navigationDefinition';
import HomeScreen from '../view/screens/HomeScreen';
import MotoScreen from '../view/screens/MotoScreen';
import PatioScreen from '../view/screens/PatioScreen';
import UsuarioScreen from '../view/screens/UsuarioScreen';
import UsuarioLoginFormulario from '../view/components/UsuarioLoginFormulario';
import UsuarioRegisterFormulario from '../view/components/UsuarioRegisterFormulario';

// ===== AUTH STACK SCREENS =====
const AuthStackScreens = ({ toastRef, setUsuarioLogado }: { toastRef: React.RefObject<any>, setUsuarioLogado: (usuario: any) => void }) => {
    return (
        <AuthNavigator.Navigator 
            initialRouteName="UsuarioLogin" 
            screenOptions={{ headerShown: false }}
        >
            <AuthNavigator.Screen 
                name="UsuarioLogin" 
                options={{ headerShown: false }}
            >
                {(props) => (
                    <UsuarioLoginFormulario
                        {...props}
                        onLogin={() => {}}
                        loginError=""
                        setLoginError={() => {}}
                    />
                )}
            </AuthNavigator.Screen>
            <AuthNavigator.Screen 
                name="UsuarioRegistro" 
                options={{ headerShown: false }}
            >
                {(props) => (
                    <UsuarioRegisterFormulario
                        {...props}
                        onGravar={() => {}}
                    />
                )}
            </AuthNavigator.Screen>
        </AuthNavigator.Navigator>
    );
};

// ===== MAIN APP STACK SCREENS =====
const MainAppStackScreens = ({ toastRef, setUsuarioLogado, onNavigateToMoto }: { toastRef: React.RefObject<any>, setUsuarioLogado: (usuario: any) => void, onNavigateToMoto: (idMoto: number) => void }) => {
    return (
        <MainAppNavigator.Navigator 
            initialRouteName="Home" 
            screenOptions={{ headerShown: false }}
        >
            <MainAppNavigator.Screen name="Home">
                {(props) => (
                    <HomeScreen
                        {...props}
                        toastRef={toastRef}
                        navigation={props.navigation}
                    />
                )}
            </MainAppNavigator.Screen>
            <MainAppNavigator.Screen name="Moto">
                {(props) => (
                    <MotoScreen
                        {...props}
                        toastRef={toastRef}
                    />
                )}
            </MainAppNavigator.Screen>
            <MainAppNavigator.Screen name="Patio">
                {(props) => (
                    <PatioScreen
                        {...props}
                        toastRef={toastRef}
                        onNavigateToMoto={() => {}}
                    />
                )}
            </MainAppNavigator.Screen>
            <MainAppNavigator.Screen name="Usuario">
                {(props) => (
                    <UsuarioScreen
                        {...props}
                        setUsuarioLogado={setUsuarioLogado}
                        toastRef={toastRef}
                    />
                )}
            </MainAppNavigator.Screen>
            {/* Adicione outras screens conforme necessário */}
        </MainAppNavigator.Navigator>
    );
};

// ===== MAIN NAVIGATOR =====
interface AppNavigatorProps {
    isAuthenticated: boolean;
    toastRef: React.RefObject<any>;
    setUsuarioLogado: (usuario: any) => void;
    onNavigateToMoto: (idMoto: number) => void;
}

const AppNavigator: React.FC<AppNavigatorProps> = ({
    isAuthenticated,
    toastRef,
    setUsuarioLogado,
    onNavigateToMoto
}) => {
    return (
        <NavigationContainer>
            {isAuthenticated ? (
                <MainAppStackScreens 
                    toastRef={toastRef}
                    setUsuarioLogado={setUsuarioLogado}
                    onNavigateToMoto={onNavigateToMoto}
                />
            ) : (
                <AuthStackScreens 
                    toastRef={toastRef}
                    setUsuarioLogado={setUsuarioLogado}
                />
            )}
        </NavigationContainer>
    );
};

export default AppNavigator;
