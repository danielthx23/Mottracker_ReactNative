import React, { useState, useRef } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  Pressable,
  Alert,
  ScrollView,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Usuario from '../types/Usuario';

interface UsuarioRegistroProps {
  onGravar: (usuario: Usuario) => void;
}

const UsuarioRegistroFormulario: React.FC<UsuarioRegistroProps> = ({ onGravar }) => {
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [cnh, setCnh] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [erros, setErros] = useState<{ [key: string]: string }>({});

  const mottuGreen = '#00c534';
  const mottuGreenDark = '#009b29';
  const textDefault = '#0c0c0c';
  const gray = '#4f4f4f';
  const neutral = '#ccc';
  const error = '#ff4d4d';

  const botaoAnim = useRef(new Animated.Value(0)).current;
  const underlineAnim = useRef(new Animated.Value(0)).current;

  const botaoBackgroundColor = botaoAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [mottuGreen, textDefault, mottuGreenDark],
  });

  const botaoTextColor = botaoAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [textDefault, mottuGreen, mottuGreen],
  });

  const underlineWidth = underlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 180],
  });

  const animateBotaoTo = (value: number) => {
    Animated.timing(botaoAnim, {
      toValue: value,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const animateHoverIn = () => {
    Animated.spring(underlineAnim, {
      toValue: 1,
      speed: 12,
      bounciness: 8,
      useNativeDriver: false,
    }).start();
  };

  const animateHoverOut = () => {
    Animated.spring(underlineAnim, {
      toValue: 0,
      speed: 12,
      bounciness: 0,
      useNativeDriver: false,
    }).start();
  };

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
    if (!match) return value;
    return [match[1], match[2], match[3]].filter(Boolean).join('.') + (match[4] ? `-${match[4]}` : '');
  };

  const validar = () => {
    const novosErros: { [key: string]: string } = {};

    if (!nome) novosErros.nome = 'Nome é obrigatório';
    if (!cpf || cpf.replace(/\D/g, '').length !== 11) novosErros.cpf = 'CPF inválido';
    if (!cnh) novosErros.cnh = 'CNH é obrigatória';
    if (!email.includes('@')) novosErros.email = 'Email inválido';
    if (!dataNascimento || isNaN(new Date(dataNascimento).getTime())) {
      novosErros.dataNascimento = 'Data inválida. Use o formato AAAA-MM-DD';
    }
    if (!senha) novosErros.senha = 'Senha é obrigatória';
    if (senha !== confirmarSenha) novosErros.confirmarSenha = 'As senhas não coincidem';

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const validarCampo = (key: string, value: string) => {
    setErros((prev) => {
      const novos = { ...prev };

      switch (key) {
        case 'nome':
          novos.nome = value ? '' : 'Nome é obrigatório';
          break;
        case 'cpf':
          novos.cpf = /^\d{11}$/.test(value.replace(/\D/g, '')) ? '' : 'CPF inválido';
          break;
        case 'cnh':
          novos.cnh = value ? '' : 'CNH é obrigatória';
          break;
        case 'email':
          novos.email = value.includes('@') ? '' : 'Email inválido';
          break;
        case 'dataNascimento':
          novos.dataNascimento = !value || isNaN(new Date(value).getTime())
            ? 'Data inválida. Use o formato AAAA-MM-DD'
            : '';
          break;
        case 'senha':
          novos.senha = value ? '' : 'Senha é obrigatória';
          novos.confirmarSenha = confirmarSenha && confirmarSenha !== value ? 'As senhas não coincidem' : '';
          break;
        case 'confirmarSenha':
          novos.confirmarSenha = value !== senha ? 'As senhas não coincidem' : '';
          break;
      }

      return novos;
    });
  };

  const getInputBorderColor = (key: string, value: string) => {
    if (erros[key]) return error;
    if (value) return mottuGreen;
    return neutral;
  };

  const handleRegistro = () => {
    if (!validar()) return;

    const novoUsuario: Usuario = {
      idUsuario: 0,
      nomeUsuario: nome,
      cpfUsuario: cpf,
      senhaUsuario: senha,
      cnhUsuario: cnh,
      emailUsuario: email,
      dataNascimentoUsuario: new Date(dataNascimento),
      criadoEmUsuario: new Date(),
    };

    onGravar(novoUsuario);

    navigation.navigate('UsuarioLogin' as never);
  };

  const renderInput = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    key: string,
    extra?: any
  ) => (
    <View key={key} style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, { borderBottomColor: getInputBorderColor(key, value) }]}
        value={value}
        onChangeText={(text) => {
          onChange(text);
          validarCampo(key, text);
        }}
        placeholder={extra?.placeholder || label}
        placeholderTextColor="#999"
        secureTextEntry={extra?.secureTextEntry}
        keyboardType={extra?.keyboardType}
      />
      <Text style={styles.error}>{erros[key] || ' '}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.formContainer}>
        <Text style={{ color: mottuGreen, fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
          Registro de Usuário
        </Text>
        {renderInput('Nome', nome, setNome, 'nome')}
          {renderInput('CPF', cpf, (text) => {
              const formatado = formatCpf(text);
              setCpf(formatado);
              validarCampo('cpf', formatado);
            }, 'cpf', { keyboardType: 'numeric' })}

          {renderInput('CNH', cnh, setCnh, 'cnh')}
        {renderInput('E-mail', email, setEmail, 'email', { keyboardType: 'email-address' })}
        {renderInput('Data de Nascimento', dataNascimento, setDataNascimento, 'dataNascimento', {
          placeholder: 'AAAA-MM-DD',
        })}
        {renderInput('Senha', senha, setSenha, 'senha', { secureTextEntry: true })}
        {renderInput('Confirmar Senha', confirmarSenha, setConfirmarSenha, 'confirmarSenha', {
          secureTextEntry: true,
        })}

        <Pressable
          onPress={handleRegistro}
          onHoverIn={() => animateBotaoTo(1)}
          onHoverOut={() => animateBotaoTo(0)}
          onPressIn={() => animateBotaoTo(2)}
          onPressOut={() => animateBotaoTo(0)}
          style={{ borderColor: mottuGreen, borderWidth: 2, borderRadius: 8, marginTop: 10 }}
        >
          <Animated.View style={[styles.botao, { backgroundColor: botaoBackgroundColor }]}>
            <Animated.Text style={{ color: botaoTextColor, fontWeight: 'bold', fontSize: 16 }}>
              Registrar
            </Animated.Text>
          </Animated.View>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('UsuarioLogin' as never)}
          onHoverIn={animateHoverIn}
          onHoverOut={animateHoverOut}
          style={{ alignItems: 'center' }}
        >
          <Text style={styles.link}>Já tem conta? Voltar ao login</Text>
          <Animated.View style={[styles.underline, { width: underlineWidth }]} />
        </Pressable>
      </View>
    </ScrollView>
  );
};

export default UsuarioRegistroFormulario;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0c0c0c',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  formContainer: {
    width: '100%',
    paddingBlock: 50,
  },
  inputGroup: {
    width: '100%',
    maxWidth: 400,
    minWidth: 350,
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 500,
  },
  label: {
    color: '#4f4f4f',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: 2,
  },
  input: {
    width: '100%',
    padding: 6,
    color: '#fff',
    borderBottomWidth: 2,
    fontSize: 16,
    marginBottom: 10,
    outlineWidth: 0,
  },
  error: {
    color: '#ff4d4d',
    fontSize: 14,
    minHeight: 16,
  },
  botao: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
    outlineWidth: 0,
  },
  underline: {
    height: 2,
    backgroundColor: '#66ff66',
    marginTop: 4,
  },
  link: {
    marginTop: 20,
    color: '#66ff66',
    fontSize: 14,
    fontWeight: '300',
    outlineWidth: 0,
  },
});
