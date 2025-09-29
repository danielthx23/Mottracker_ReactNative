import React from 'react';
import { 
    MainAppStackParamList 
} from './navigationDefinition';
import HomeScreen from '../view/screens/HomeScreen';
import MotoScreen from '../view/screens/MotoScreen';
import PatioScreen from '../view/screens/PatioScreen';
import UsuarioScreen from '../view/screens/UsuarioScreen';

// Simulando BottomTabNavigator com Stack Navigator
import { createStackNavigator } from '@react-navigation/stack';
const Tab = createStackNavigator<MainAppStackParamList>();

interface BottomTabNavigatorProps {
    toastRef: React.RefObject<any>;
    setUsuarioLogado: (usuario: any) => void;
    onNavigateToMoto: (idMoto: number) => void;
}

const BottomTabNavigatorComponent: React.FC<BottomTabNavigatorProps> = ({
    toastRef,
    setUsuarioLogado,
    onNavigateToMoto
}) => {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tab.Screen 
                name="Home"
            >
                {(props) => (
                    <HomeScreen
                        {...props}
                        toastRef={toastRef}
                        navigation={props.navigation}
                    />
                )}
            </Tab.Screen>
            <Tab.Screen 
                name="Moto"
            >
                {(props) => (
                    <MotoScreen
                        {...props}
                        toastRef={toastRef}
                    />
                )}
            </Tab.Screen>
            <Tab.Screen 
                name="Patio"
            >
                {(props) => (
                    <PatioScreen
                        {...props}
                        toastRef={toastRef}
                        onNavigateToMoto={onNavigateToMoto}
                    />
                )}
            </Tab.Screen>
            <Tab.Screen 
                name="Usuario"
            >
                {(props) => (
                    <UsuarioScreen
                        {...props}
                        setUsuarioLogado={setUsuarioLogado}
                        toastRef={toastRef}
                    />
                )}
            </Tab.Screen>
        </Tab.Navigator>
    );
};

export default BottomTabNavigatorComponent;
