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
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Usuario } from '../../model/Usuario';
import { useEstilos } from '../../hooks/useEstilos';
import { useTema } from '../../context/TemaContext';

interface UsuarioRegistroProps {
  onGravar: (usuario: Usuario) => void;
}

const UsuarioRegistroFormulario: React.FC<UsuarioRegistroProps> = ({ onGravar }) => {
  const { cores } = useEstilos();
  const { toggleTema } = useTema();
  const navigation = useNavigation();

  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [cnh, setCnh] = useState('');
  const [email, setEmail] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [erros, setErros] = useState<{ [key: string]: string }>({});

  const mottuGreen = cores.sucesso;
  const mottuGreenDark = cores.sucesso;
  const textDefault = cores.textoInvertido;
  const gray = cores.textoSecundario;
  const neutral = cores.textoSecundario;
  const error = cores.erro;

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

  const formatCnh = (value: string) => {
    // CNH should only accept digits and limit to 11 characters
    return value.replace(/\D/g, '').slice(0, 11);
  };

  const validar = () => {
    const novosErros: { [key: string]: string } = {};


    // Nome validation - minimum 2 characters
    if (!nome) {
      novosErros.nome = 'Nome é obrigatório';
    } else if (nome.length < 2) {
      novosErros.nome = 'Nome deve ter pelo menos 2 caracteres';
    }

    // CPF validation - must be in format 000.000.000-00
    if (!cpf) {
      novosErros.cpf = 'CPF é obrigatório';
    } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
      novosErros.cpf = 'CPF deve estar no formato 000.000.000-00';
    }

    // CNH validation - exactly 11 digits
    if (!cnh) {
      novosErros.cnh = 'CNH é obrigatória';
    } else if (!/^\d{11}$/.test(cnh)) {
      novosErros.cnh = 'CNH deve ter 11 dígitos';
    }

    // Email validation - must be valid email format
    if (!email) {
      novosErros.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      novosErros.email = 'Email deve ser válido';
    }

    // Data de nascimento validation
    if (!dataNascimento) {
      novosErros.dataNascimento = 'Data de nascimento é obrigatória';
    } else if (isNaN(new Date(dataNascimento).getTime())) {
      novosErros.dataNascimento = 'Data inválida. Use o formato AAAA-MM-DD';
    }

    // Senha validation - minimum 6 characters
    if (!senha) {
      novosErros.senha = 'Senha é obrigatória';
    } else if (senha.length < 6) {
      novosErros.senha = 'Senha deve ter pelo menos 6 caracteres';
    }

    // Confirmar senha validation
    if (senha !== confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não coincidem';
    }

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const validarCampo = (key: string, value: string) => {
    setErros((prev) => {
      const novos = { ...prev };

      switch (key) {
        case 'nome':
          if (!value) {
            novos.nome = 'Nome é obrigatório';
          } else if (value.length < 2) {
            novos.nome = 'Nome deve ter pelo menos 2 caracteres';
          } else {
            novos.nome = '';
          }
          break;
        case 'cpf':
          if (!value) {
            novos.cpf = 'CPF é obrigatório';
          } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(value)) {
            novos.cpf = 'CPF deve estar no formato 000.000.000-00';
          } else {
            novos.cpf = '';
          }
          break;
        case 'cnh':
          if (!value) {
            novos.cnh = 'CNH é obrigatória';
          } else if (!/^\d{11}$/.test(value)) {
            novos.cnh = 'CNH deve ter 11 dígitos';
          } else {
            novos.cnh = '';
          }
          break;
        case 'email':
          if (!value) {
            novos.email = 'Email é obrigatório';
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            novos.email = 'Email deve ser válido';
          } else {
            novos.email = '';
          }
          break;
        case 'dataNascimento':
          if (!value) {
            novos.dataNascimento = 'Data de nascimento é obrigatória';
          } else if (isNaN(new Date(value).getTime())) {
            novos.dataNascimento = 'Data inválida. Use o formato AAAA-MM-DD';
          } else {
            novos.dataNascimento = '';
          }
          break;
        case 'senha':
          if (!value) {
            novos.senha = 'Senha é obrigatória';
          } else if (value.length < 6) {
            novos.senha = 'Senha deve ter pelo menos 6 caracteres';
          } else {
            novos.senha = '';
          }
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
      <Text style={[styles.label, { color: cores.textoSecundario }]}>{label}</Text>
      <TextInput
        style={[styles.input, { borderBottomColor: getInputBorderColor(key, value), color: cores.texto }]}
        value={value}
        onChangeText={(text) => {
          onChange(text);
          validarCampo(key, text);
        }}
        placeholder={extra?.placeholder || label}
        placeholderTextColor={cores.textoSecundario}
        secureTextEntry={extra?.secureTextEntry}
        keyboardType={extra?.keyboardType}
      />
      <Text style={[styles.error, { color: cores.erro }]}>{erros[key] || ' '}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: cores.fundo }]} keyboardShouldPersistTaps="handled">
      <TouchableOpacity 
        onPress={toggleTema}
        style={[styles.themeButton, { backgroundColor: cores.fundoCard }]}
      >
        <Ionicons name="color-palette" size={24} color={cores.texto} />
      </TouchableOpacity>
      <View style={styles.formContainer}>
        <Text style={{ color: cores.sucesso, fontSize: 20, fontWeight: 'bold', marginBottom: 20 }}>
          Registro de Usuário
        </Text>
        {renderInput('Nome', nome, setNome, 'nome')}
          {renderInput('CPF', cpf, (text) => {
              const formatado = formatCpf(text);
              setCpf(formatado);
              validarCampo('cpf', formatado);
            }, 'cpf', { keyboardType: 'numeric' })}

          {renderInput('CNH', cnh, (text) => {
              const formatado = formatCnh(text);
              setCnh(formatado);
              validarCampo('cnh', formatado);
            }, 'cnh', { keyboardType: 'numeric' })}
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
  themeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 12,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
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
