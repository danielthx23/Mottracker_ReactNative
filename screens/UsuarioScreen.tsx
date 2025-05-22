import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import UsuarioLoginFormulario from '../components/UsuarioLoginFormulario';
import UsuarioRegistroFormulario from '../components/UsuarioRegisterFormulario';
import Usuario from '../types/Usuario';

const Stack = createStackNavigator();

const UsuarioScreen = ({ setUsuarioLogado }: { setUsuarioLogado: (usuario: Usuario) => void }) => {
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

  const login = (cpf: string, senha: string, navigation: any): void => {
    console.log('Tentando login com CPF:', cpf, 'e senha:', senha);
    const usuarioEncontrado = usuarios.find(
      (u) => u.cpfUsuario === cpf && u.senhaUsuario === senha
    );

    if (usuarioEncontrado) {
      console.log('Login realizado com sucesso');
      setUsuarioLogado(usuarioEncontrado);
      navigation.navigate('MainApp');
    } else {
      console.log('Login falhou');
      Alert.alert('Erro', 'CPF ou senha inválidos');
    }
  };

  const gravar = (usuario: Usuario, navigation: any) => {
    console.log('Gravando usuário', usuario);

    const jaExiste = usuarios.some((u) => u.cpfUsuario === usuario.cpfUsuario);
    if (jaExiste) {
      Alert.alert('Erro', 'Já existe um usuário com este CPF.');
      return;
    }

    setUsuarios((prev) => [...prev, usuario]);
    Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
    navigation.navigate('UsuarioLogin');
  };

  return (
    <Stack.Navigator
      initialRouteName="UsuarioLogin"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="UsuarioLogin">
        {(props) => (
          <UsuarioLoginFormulario
            onLogin={(cpf, senha) => login(cpf, senha, props.navigation)}
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
  );
};

export default UsuarioScreen;
