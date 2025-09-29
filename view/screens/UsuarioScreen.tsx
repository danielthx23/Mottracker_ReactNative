import React, { useEffect } from 'react';
import { View, Text, Alert } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import UsuarioLoginFormulario from '../components/UsuarioLoginFormulario';
import UsuarioRegistroFormulario from '../components/UsuarioRegisterFormulario';
import { Usuario } from '../../model/Usuario';
import ToastMessage, { ToastMessageRef } from '../components/Toast';
import { useUsuarioControl } from '../../control/useUsuarioControl';
import { useTelefoneControl } from '../../control/useTelefoneControl';
import { useEnderecoControl } from '../../control/useEnderecoControl';
import { useUsuarioPermissaoControl } from '../../control/useUsuarioPermissaoControl';
import { useUsuario } from '../../context/UsuarioContext';

const Stack = createStackNavigator();

const UsuarioScreen = ({ toastRef }: { toastRef: React.RefObject<ToastMessageRef | null> } ) => {
  const { setUsuarioLogado } = useUsuario();
  // Controls relacionados ao usuário
  const { 
    login, 
    salvar, 
    carregarLista,
    handlerInput,
    loading,
    mensagem,
    status
  } = useUsuarioControl();

  // Controls para telefones do usuário
  const {
    listaTelefones,
    carregarLista: carregarTelefones,
    salvar: salvarTelefone,
    apagar: apagarTelefone,
    atualizar: atualizarTelefone
  } = useTelefoneControl();

  // Controls para endereços do usuário
  const {
    listaEnderecos,
    carregarLista: carregarEnderecos,
    salvar: salvarEndereco,
    apagar: apagarEndereco,
    atualizar: atualizarEndereco
  } = useEnderecoControl();

  // Controls para permissões do usuário
  const {
    listaUsuarioPermissoes,
    carregarLista: carregarUsuarioPermissoes,
    salvar: salvarUsuarioPermissao,
    apagar: apagarUsuarioPermissao
  } = useUsuarioPermissaoControl();

  useEffect(() => {
    // Removido carregarLista() - não é necessário para login
    // Removido carregarTelefones() - não é necessário para login
    // Removido carregarEnderecos() - não é necessário para login
    // Removido carregarUsuarioPermissoes() - não é necessário para login
  }, []);

  const handleLogin = (email: string, senha: string, navigation: any): void => {
    try {
      login(email, senha);
    } catch (error) {
      console.error('Erro ao chamar login:', error);
    }
    // O control já gerencia o setUsuarioLogado através do contexto
  };

  const handleGravar = (usuario: Usuario, navigation: any) => {
    salvar(usuario);
    navigation.navigate('UsuarioLogin');
  };

  return (
    <>
      <Stack.Navigator initialRouteName="UsuarioLogin" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="UsuarioLogin">
          {(props) => (
            <UsuarioLoginFormulario
              onLogin={(email, senha) => handleLogin(email, senha, props.navigation)}
              loginError={status === 'erro' ? mensagem : undefined}
              setLoginError={() => {}}
              loading={loading}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="UsuarioRegistro">
          {(props) => (
            <UsuarioRegistroFormulario
              {...props}
              onGravar={(usuario) => handleGravar(usuario, props.navigation)}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </>
  );
};

export default UsuarioScreen;
