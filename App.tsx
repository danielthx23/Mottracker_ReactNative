import React, { useState, useRef, useEffect } from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import UsuarioScreen from './screens/UsuarioScreen';
import MotoScreen from './screens/MotoScreen';
import Usuario from './types/Usuario';
import ToastMessage, { ToastMessageRef } from './components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './screens/HomeScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator({ usuarioLogado, toastRef, navigationRef }: { usuarioLogado?: Usuario, toastRef: React.RefObject<ToastMessageRef | null>, navigationRef: React.RefObject<NavigationContainerRef<any>| null>}) {
  const [menuVisible, setMenuVisible] = useState(false);

  const signOut = async () => {
    try {
      await AsyncStorage.removeItem('user_token');
      toastRef.current?.show("Sessão encerrada", "Você foi deslogado com sucesso.", "info");
    } catch (error) {
      console.error("Erro ao remover token de usuário:", error);
      toastRef.current?.show("Erro", "Não foi possível encerrar a sessão.", "danger");
    } finally {
      setMenuVisible(false);
      setTimeout(() => {
        navigationRef.current?.navigate('Usuario' as never);
      }, 1000);
    }
  };

  return (
    <>
    <Drawer.Navigator
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#0c0c0c',
          },
          drawerLabelStyle: {
            fontSize: 16,
          },
          drawerItemStyle: {
            borderRadius: 0,
          },
          drawerActiveBackgroundColor: '#1b1b1b',
          drawerActiveTintColor: '#009b29',
          drawerInactiveTintColor: '#383838',
          headerShown: true,
          headerStyle: {
            backgroundColor: '#0c0c0c',
            height: 100,
            borderWidth: 0,
          },
          headerTitleStyle: {
            fontSize: 18,
          },
          headerTintColor: '#fff',
          headerLeftContainerStyle: {
            paddingLeft: 10,
          },
          headerRightContainerStyle: {
            paddingRight: 10,
          },
          headerRight: () => (
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#0f0f0f', padding: 6, paddingInline: 16, borderRadius: 30 }}
                onPress={() => setMenuVisible(!menuVisible)}
              >
                <Text style={{ color: '#fff', fontSize: 16, marginRight: 4 }}>
                  {usuarioLogado?.nomeUsuario ?? ''}
                </Text>
                <Ionicons name="chevron-down" size={18} color="#fff" />
              </TouchableOpacity>
              <Modal
                visible={menuVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setMenuVisible(false)}
              >
                <Pressable style={styles.modalOverlay} onPress={() => setMenuVisible(false)}>
                  <View style={styles.dropdownMenu}>
                    <TouchableOpacity
                      style={styles.dropdownItem}
                      onPress={() => {
                        toastRef.current?.show("TODO", "Botão de editar usuário em progresso.", "warning");
                        setMenuVisible(false);
                      }}
                    >
                      <Text style={styles.dropdownText}>Editar Usuário</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropdownItem} onPress={signOut}>
                      <Text style={[styles.dropdownText, styles.dropdownTextSignOut]}>Sair</Text>
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
        <Drawer.Screen name="Motos" component={MotoScreen} />
        <Drawer.Screen name="Patios" component={MotoScreen} />
      </Drawer.Navigator>
      </>
  );
}

export default function App() {

  // Os dois na teoria vao ficar em uma context API, mas como não aprendemos ainda, vou deixar assim
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | undefined>();
  const toastRef = useRef<ToastMessageRef>(null);
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const token = await AsyncStorage.getItem('user_token');
        const usuariosJson = await AsyncStorage.getItem('usuarios');
  
        if (token && usuariosJson) {
          const usuarios: Usuario[] = JSON.parse(usuariosJson);
          const usuarioEncontrado = usuarios.find(u => u.tokenUsuario === token);
  
          if (usuarioEncontrado) {
            setUsuarioLogado(usuarioEncontrado);
            navigationRef.current?.navigate('MainApp' as never);
            toastRef.current?.show("Login efetuado!", "Bem-vindo(a) de volta.", "success");
          } else {
            await AsyncStorage.removeItem('user_token');
            navigationRef.current?.navigate('Usuario' as never);
            toastRef.current?.show("Tempo de conexão encerrada!", "Por favor, informe suas credenciais novamente.", "warning");
          }
        } else {
          navigationRef.current?.navigate('Usuario' as never);
        }
      } catch (error) {
        console.error("Erro ao verificar token de sessão:", error);
        toastRef.current?.show("Erro", "Falha ao restaurar a sessão.", "danger");
        navigationRef.current?.navigate('Usuario' as never);
      }
    };
  
    verificarToken();
  }, []); 

  return (
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
              setUsuarioLogado={async (usuario) => {
                try {
                  setUsuarioLogado(usuario);
                  if (usuario.tokenUsuario) {
                    await AsyncStorage.setItem('user_token', usuario.tokenUsuario);
                    toastRef.current?.show("Login efetuado!", "Bem-vindo(a) de volta.", "success");
                  } else {
                    toastRef.current?.show("Erro de Login!", "Houve algum erro ao entrar na sua conta.", "danger");
                  }
                } catch (error) {
                  console.error("Erro ao salvar token de usuário:", error);
                  toastRef.current?.show("Erro", "Não foi possível salvar a sessão.", "danger");
                }
              }}
            />
            )}
          </Stack.Screen>
          <Stack.Screen name="MainApp">
            {(props) => <DrawerNavigator {...props} usuarioLogado={usuarioLogado} toastRef={toastRef} navigationRef={navigationRef}/>}
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
