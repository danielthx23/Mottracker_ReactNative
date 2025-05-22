import React, { useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import UsuarioScreen from './screens/UsuarioScreen';
import MotoScreen from './screens/MotoScreen';
import Usuario from './types/Usuario';
import ToastMessage, { ToastMessageRef } from './components/Toast'; // <-- ajuste o caminho se necessário

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator({ usuarioLogado }: { usuarioLogado?: Usuario }) {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      screenOptions={{
        drawerStyle: {
          backgroundColor: '#0c0c0c',
        },
        drawerLabelStyle: {
          fontSize: 16,
        },
        drawerActiveBackgroundColor: '#1b1b1b',
        drawerActiveTintColor: '#009b29',
        drawerInactiveTintColor: '#383838',
        drawerItemStyle: {
          borderRadius: 0,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: '#0c0c0c',
          height: 80,
        },
        headerTitleStyle: {
          fontSize: 18,
          color: '#009b29',
          textDecorationLine: 'underline',
        },
        headerTintColor: '#fff',
        headerRight: () => (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16, gap: 16 }}>
            <TouchableOpacity onPress={() => {
              // TODO: Preferências do Usuário
            }}>
              <Ionicons name="settings-sharp" size={22} color="#fff" />
            </TouchableOpacity>

            <Text style={{ color: '#fff' }}>|</Text>

            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center' }}
              onPress={() => {
                // TODO: Sign out (deslogar)
              }}
            >
              <Text style={{ color: '#fff', fontSize: 16, marginRight: 4 }}>
                {usuarioLogado?.nomeUsuario ?? ''}
              </Text>
              <Ionicons name="chevron-down" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        ),
      }}
    >
      <Drawer.Screen name="Home" component={MotoScreen} />
      <Drawer.Screen name="Motos" component={MotoScreen} />
      <Drawer.Screen name="Patios" component={MotoScreen} />
    </Drawer.Navigator>
  );
}

export default function App() {
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | undefined>();
  const toastRef = useRef<ToastMessageRef>(null);

  return (
    <View style={styles.container}>
      <ToastMessage
        ref={toastRef}
        type="success"
        text="Login efetuado!"
        description="Bem-vindo(a) de volta."
      />

      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Usuario">
          <Stack.Screen name="Usuario">
            {(props) => (
              <UsuarioScreen
                {...props}
                setUsuarioLogado={(usuario) => {
                  setUsuarioLogado(usuario);
                  toastRef.current?.show(); // Mostra o toast ao logar
                }}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="MainApp">
            {(props) => <DrawerNavigator {...props} usuarioLogado={usuarioLogado} />}
          </Stack.Screen>
        </Stack.Navigator>
        <StatusBar />
      </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
});
