import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert } from 'react-native';
import Usuario from '../types/Usuario';

interface UsuarioRegistroProps {
  onGravar: (usuario: Usuario) => void;
}

const UsuarioRegistroFormulario: React.FC<UsuarioRegistroProps> = ({ onGravar }) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [cnh, setCnh] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [erro, setErro] = useState('');

  const handleRegistro = () => {
    if (senha !== confirmarSenha) {
      setErro('As senhas não coincidem');
      return;
    }

    const novaDataNascimento = new Date(dataNascimento);
    if (isNaN(novaDataNascimento.getTime())) {
      setErro('Data de nascimento inválida. Use o formato AAAA-MM-DD.');
      return;
    }

    const novoUsuario: Usuario = {
      idUsuario: 0,
      nomeUsuario: nome,
      cpfUsuario: cpf,
      senhaUsuario: senha,
      cnhUsuario: cnh,
      emailUsuario: email,
      dataNascimentoUsuario: novaDataNascimento,
      criadoEmUsuario: new Date(),
    };

    setErro('');
    onGravar(novoUsuario);
    Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} placeholder="Nome completo" />

      <Text style={styles.label}>CPF:</Text>
      <TextInput style={styles.input} value={cpf} onChangeText={setCpf} keyboardType="numeric" placeholder="CPF" />

      <Text style={styles.label}>CNH:</Text>
      <TextInput style={styles.input} value={cnh} onChangeText={setCnh} placeholder="CNH" />

      <Text style={styles.label}>E-mail:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="Email" />

      <Text style={styles.label}>Data de Nascimento:</Text>
      <TextInput style={styles.input} value={dataNascimento} onChangeText={setDataNascimento} placeholder="AAAA-MM-DD" />

      <Text style={styles.label}>Senha:</Text>
      <TextInput style={styles.input} value={senha} onChangeText={setSenha} secureTextEntry placeholder="Senha" />

      <Text style={styles.label}>Confirmar Senha:</Text>
      <TextInput style={styles.input} value={confirmarSenha} onChangeText={setConfirmarSenha} secureTextEntry placeholder="Confirmar senha" />

      {erro ? <Text style={styles.erro}>{erro}</Text> : null}

      <Button title="Registrar" onPress={handleRegistro} />
    </View>
  );
};

export default UsuarioRegistroFormulario;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  erro: {
    color: 'red',
    marginBottom: 10,
  },
});
