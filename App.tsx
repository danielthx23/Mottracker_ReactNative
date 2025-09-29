import React, { useState, useRef, useEffect } from 'react';
import { NavigationContainer, NavigationContainerRef, useNavigation } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import UsuarioScreen from './view/screens/UsuarioScreen';
import MotoScreen from './view/screens/MotoScreen';
import { Usuario } from './model';
import ToastMessage, { ToastMessageRef } from './view/components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './view/screens/HomeScreen';
import PatioScreen from './view/screens/PatioScreen';
import { UsuarioProvider, useUsuario } from './context/UsuarioContext';
import { ContextoPrincipalProvider } from './contexto/ContextoPrincipal';
import { TemaProvider } from './context/TemaContext';
import TemaToggle from './view/components/TemaToggle';
import { useEstilos } from './hooks/useEstilos';

type RootStackParamList = {
  Usuario: undefined;
  MainApp: undefined;
};

type DrawerParamList = {
  Home: undefined;
  Motos: undefined | {
    screen: string;
    params: {
      screen: string;
      params: { idMoto: number };
    };
  };
  Patios: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator<DrawerParamList>();

function DrawerNavigatorInternal({ toastRef, navigationRef }: { toastRef: React.RefObject<ToastMessageRef | null>, navigationRef: React.RefObject<NavigationContainerRef<any>| null>}) {
  const { cores } = useEstilos();
  const { usuarioLogado, logout } = useUsuario();
  
  
  const [menuVisible, setMenuVisible] = useState(false);

  const signOut = async () => {
    try {
      await logout();
      toastRef.current?.show("Sessão encerrada", "Você foi deslogado com sucesso.", "info");
    } catch (error) {
      console.error("Erro ao remover token de usuário:", error);
      toastRef.current?.show("Erro", "Não foi possível encerrar a sessão.", "danger");
    } finally {
      setMenuVisible(false);
      setTimeout(() => {
              navigationRef.current?.navigate('Usuario');
            }, 1000);
    }
  };

  const navigateToMoto = (idMoto: number) => {
    navigationRef.current?.navigate('MainApp', {
      screen: 'Motos',
      params: {
        screen: 'MotoDetalhes',
        params: { idMoto }
      }
    });
  };

  return (
    <>
    <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: cores.fundo,
          },
          drawerLabelStyle: {
            fontSize: 16,
            color: cores.texto,
          },
          drawerItemStyle: {
            borderRadius: 0,
          },
          drawerActiveBackgroundColor: cores.fundoCard,
          drawerActiveTintColor: cores.primaria,
          drawerInactiveTintColor: cores.textoSecundario,
          headerShown: true,
          headerStyle: {
            backgroundColor: cores.fundo,
            height: 100,
            borderWidth: 0,
          },
          headerTitleStyle: {
            fontSize: 18,
            color: cores.texto,
          },
          headerTintColor: cores.texto,
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TemaToggle style={{ marginRight: 10 }} />
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: cores.fundoCard, padding: 6, paddingInline: 16, borderRadius: 30, borderWidth: 1, borderColor: cores.borda }}
                onPress={() => setMenuVisible(!menuVisible)}
              >
                <Text style={{ color: cores.texto, fontSize: 16, marginRight: 4 }}>
                  {usuarioLogado?.nomeUsuario ?? 'Usuário'}
                </Text>
                <Ionicons name="chevron-down" size={18} color={cores.texto} />
              </TouchableOpacity>
              <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
              >
                <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
                  <View style={[styles.dropdownMenu, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        toastRef.current?.show("TODO", "Botão de editar usuário em progresso.", "warning");
                        setMenuVisible(false);
                      }}
                    >
                      <Text style={[styles.dropdownText, { color: cores.texto }]}>Editar Usuário</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropdownItem} onPress={signOut}>
                      <Text style={[styles.dropdownText, styles.dropdownTextSignOut, { color: cores.erro }]}>Sair</Text>
                    </TouchableOpacity>
                  </View>
                </Pressable>
              </Modal>
            </View>
          ),
        }}
      >
        <Drawer.Screen name="Home">
          {(props) => <HomeScreen {...props} toastRef={toastRef} />}
        </Drawer.Screen>
        <Drawer.Screen name="Motos">
          {(props) => <MotoScreen {...props} toastRef={toastRef} />}
        </Drawer.Screen>
        <Drawer.Screen name="Patios">
          {(props) => <PatioScreen {...props} toastRef={toastRef} onNavigateToMoto={navigateToMoto} />}
        </Drawer.Screen>
      </Drawer.Navigator>
      </>
  );
}

function DrawerNavigator({ toastRef, navigationRef }: { toastRef: React.RefObject<ToastMessageRef | null>, navigationRef: React.RefObject<NavigationContainerRef<any>| null>}) {
  return <DrawerNavigatorInternal toastRef={toastRef} navigationRef={navigationRef} />;
}

export default function App() {
  const toastRef = useRef<ToastMessageRef>(null);
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  
  return (
    <TemaProvider>
      <ContextoPrincipalProvider>
        <UsuarioProvider>
          <View style={styles.container}>
          <ToastMessage
            ref={toastRef}
          />

          <NavigationContainer ref={navigationRef}>
            <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Usuario">
              <Stack.Screen name="Usuario">
                {(props) => (
                  <UsuarioScreen
                    toastRef={toastRef} 
                    {...props}
                  />
                )}
              </Stack.Screen>
              <Stack.Screen name="MainApp">
                {(props) => <DrawerNavigator {...props} toastRef={toastRef} navigationRef={navigationRef}/>}
              </Stack.Screen>
            </Stack.Navigator>
            <StatusBar />
          </NavigationContainer>
          </View>
        </UsuarioProvider>
      </ContextoPrincipalProvider>
    </TemaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  dropdownMenu: {
    position: 'absolute',
    top: 55, 
    right: 20, 
    backgroundColor: '#1c1c1c',
    borderRadius: 6,
    paddingVertical: 8,
    width: 160,
    elevation: 5,
  },  
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  dropdownTextSignOut: {
    color: '#ff4d4d',
  },
  dropdownText: {
    color: '#fff',
    fontSize: 16,
  },
});
