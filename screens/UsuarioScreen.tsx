import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import UsuarioLoginFormulario from '../components/UsuarioLoginFormulario';
import UsuarioRegistroFormulario from '../components/UsuarioRegisterFormulario';
import Usuario from '../types/Usuario';
import ToastMessage, { ToastMessageRef } from '../components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import uuid from 'react-native-uuid';

const Stack = createStackNavigator();

const UsuarioScreen = ({ setUsuarioLogado, toastRef }: { setUsuarioLogado: (usuario: Usuario) => void, toastRef: React.RefObject<ToastMessageRef | null> } ) => {
  const [loginError, setLoginError] = useState('');
  const [usuarios, setUsuarios] = useState<Usuario[]>([{
    cpfUsuario: '123.456.789-09', senhaUsuario: 'senha123',
    idUsuario: 0,
    nomeUsuario: 'Daniel Saburo Akiyama',
    cnhUsuario: '',
    emailUsuario: '',
    tokenUsuario: '123',
    dataNascimentoUsuario: new Date(),
    criadoEmUsuario: new Date()
  }]);

  useEffect(() => {
    const getUsuariosFromAsync = async () => {
      try {
        const usuariosJson = await AsyncStorage.getItem('usuarios');
  
        if (usuariosJson) {
          const usuariosAsync: Usuario[] = JSON.parse(usuariosJson);
          setUsuarios((usuarios) => {
            const usuariosAtualizados = usuariosAsync.filter(
              (usuarioAsync) =>
                !usuarios.some((usuario) => usuario.cpfUsuario === usuarioAsync.cpfUsuario)
            );
            return [...usuarios, ...usuariosAtualizados];
          });
        }
      } catch (error) {
        console.error('Erro ao carregar usuários do AsyncStorage:', error);
      }
    };
  
    getUsuariosFromAsync();
  }, []);
  

  const login = (cpf: string, senha: string, navigation: any): void => {
    const usuarioEncontrado = usuarios.find(
      (u) => u.cpfUsuario === cpf && u.senhaUsuario === senha
    );

    if (usuarioEncontrado) {
      setUsuarioLogado(usuarioEncontrado);
      navigation.navigate('MainApp');
    } else {
      toastRef.current?.show('Erro de login', 'CPF ou senha inválidos', 'danger');
      setLoginError('CPF ou senha incorretos');
    }
  };

  
const gravar = async (usuario: Usuario, navigation: any) => {
  try {
    const jaExiste = usuarios.some((u) => u.cpfUsuario === usuario.cpfUsuario);
    if (jaExiste) {
      toastRef.current?.show('Erro', 'Já existe um usuário com este CPF.', 'danger');
      return;
    }

    toastRef.current?.show('Sucesso', 'Usuário registrado com sucesso!', 'success');

    usuario.tokenUsuario = uuid.v4() as string;

    const novosUsuarios = [...usuarios, usuario];
    setUsuarios(novosUsuarios);

    await AsyncStorage.setItem('usuarios', JSON.stringify(novosUsuarios));
    console.log('Usuários gravados com sucesso no AsyncStorage');

    navigation.navigate('UsuarioLogin');
  } catch (error) {
    console.error('Erro ao gravar usuário:', error);
    toastRef.current?.show('Erro', 'Falha ao registrar usuário.', 'danger');
  }
};

  return (
    <>
      <Stack.Navigator initialRouteName="UsuarioLogin" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="UsuarioLogin">
          {(props) => (
            <UsuarioLoginFormulario
              onLogin={(cpf, senha) => login(cpf, senha, props.navigation)}
              loginError={loginError}
              setLoginError={setLoginError}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="UsuarioRegistro">
          {(props) => (
            <UsuarioRegistroFormulario
              {...props}
              onGravar={(usuario) => gravar(usuario, props.navigation)}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default UsuarioScreen;
