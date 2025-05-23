import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import UsuarioLoginFormulario from '../components/UsuarioLoginFormulario';
import UsuarioRegistroFormulario from '../components/UsuarioRegisterFormulario';
import Usuario from '../types/Usuario';
import ToastMessage, { ToastMessageRef } from '../components/Toast';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

const Stack = createStackNavigator();

const UsuarioScreen = ({ setUsuarioLogado }: { setUsuarioLogado: (usuario: Usuario) => void }) => {
  const toastRef = useRef<ToastMessageRef>(null);
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
        // Guardar os usuários no asyncstorage logicamente não é ideal, mas para o exemplo, funciona
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
    const jaExiste = usuarios.some((u) => u.cpfUsuario === usuario.cpfUsuario);
    if (jaExiste) {
      toastRef.current?.show('Erro', 'Já existe um usuário com este CPF.', 'danger');
      return;
    }
  
    // Não é ideal fazer isso aqui no frontend, seria para o backend fazer isso, mas para o exemplo, funciona
    usuario.tokenUsuario = uuidv4();
  
    const novosUsuarios = [...usuarios, usuario];
    setUsuarios(novosUsuarios);

    // Não é ideal fazer isso aqui, mas para o exemplo, funciona
    await AsyncStorage.setItem('usuarios', JSON.stringify(novosUsuarios));
    
    toastRef.current?.show('Sucesso', 'Usuário registrado com sucesso!', 'success');
    navigation.navigate('UsuarioLogin');
  };  

  return (
    <>
      <ToastMessage ref={toastRef} />
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
