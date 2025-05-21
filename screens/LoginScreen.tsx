import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import UsuarioLogin from '../types/UsuarioLogin';
import UsuarioLoginFormulario from '../components/UsuarioLoginFormulario';
import UsuarioRegistroFormulario from '../components/UsuarioRegisterFormulario';

const Stack = createStackNavigator();

const LoginFlow = () => {
  const [usuarioLogin, setUsuarioLogin] = useState<UsuarioLogin | undefined>();

  const login = (cpf: string, senha: string): void => {
    if (cpf === '12345678900' && senha === '123456') {
      console.log('Login realizado com sucesso');
      setUsuarioLogin({
        cpfUsuario: cpf,
        senhaUsuario: senha,
        tokenUsuario: '1234567890',
      });
    } else {
      console.log('Login falhou');
      setUsuarioLogin(undefined);
    }
  };

  const gravar = (usuario: UsuarioLogin) => {
    console.log('Gravando usuário', usuario);
    setUsuarioLogin(usuario);
  };

  return (
    <Stack.Navigator
    initialRouteName="LoginFormulario"
    screenOptions={{ headerShown: false }}
  >
      <Stack.Screen name="LoginFormulario">
        {() => <UsuarioLoginFormulario onLogin={login} />}
      </Stack.Screen>
      <Stack.Screen name="UsuarioRegistro">
        {(props) => <UsuarioRegistroFormulario {...props} onGravar={gravar} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default LoginFlow;
