import React, { useState, useRef } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  TextInput as RNTextInput,
  Pressable,
  Easing,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AnimatedTextInput = Animated.createAnimatedComponent(RNTextInput);

interface UsuarioLoginFormularioProps {
  onLogin: (cpf: string, senha: string) => void;
}

const UsuarioLoginFormulario: React.FC<UsuarioLoginFormularioProps> = ({ onLogin }) => {
  const [cpf, setCpf] = useState('');
  const [senha, setSenha] = useState('');
  const [cpfError, setCpfError] = useState('');

  const navigation = useNavigation();

  const cpfFocusAnim = useRef(new Animated.Value(0)).current;
  const senhaFocusAnim = useRef(new Animated.Value(0)).current;
  const underlineAnim = useRef(new Animated.Value(0)).current;
  const botaoAnim = useRef(new Animated.Value(0)).current;

  const cpfBorderAnim = useRef(new Animated.Value(0)).current;
  const senhaBorderAnim = useRef(new Animated.Value(0)).current;

  const mottuGreen = '#00c534';
  const mottuGreenVibrant = '#00ff00';
  const mottuGreenDark = '#009b29';
  const textDefault = '#0c0c0c';
  const errorColor = '#ff4d4d';

  const formatCpf = (value: string) => {
    const digits = value.replace(/\D/g, '');
    const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})$/);
    if (!match) return value;
    return [match[1], match[2], match[3]].filter(Boolean).join('.') + (match[4] ? `-${match[4]}` : '');
  };

  const isValidCpf = (cpf: string) => {
    const cleaned = cpf.replace(/[^\d]/g, '');
    if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) return false;

    const calcCheckDigit = (base: string, factor: number) =>
      (base.split('').reduce((acc, num, idx) => acc + parseInt(num) * (factor - idx), 0) * 10) % 11 % 10;

    const base = cleaned.slice(0, 9);
    const digit1 = calcCheckDigit(base, 10);
    const digit2 = calcCheckDigit(base + digit1, 11);
    return cleaned === base + `${digit1}${digit2}`;
  };

  const handleCpfChange = (value: string) => {
    const masked = formatCpf(value);
    setCpf(masked);

    if (masked.length >= 14) {
      const valid = isValidCpf(masked);
      setCpfError(valid ? '' : 'CPF inválido');
      Animated.timing(cpfBorderAnim, {
        toValue: valid ? 1 : 2,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else if (masked.length > 0 && masked.length < 14) {
      setCpfError('CPF incompleto');
      Animated.timing(cpfBorderAnim, {
        toValue: 2,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      setCpfError('');
      Animated.timing(cpfBorderAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleCpfFocus = () => {
    Animated.timing(cpfFocusAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    if (!cpfError) {
      Animated.timing(cpfBorderAnim, {
        toValue: 1, 
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleCpfBlur = () => {
    Animated.timing(cpfFocusAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    const cleaned = cpf.replace(/\D/g, '');

    if (cleaned.length === 0) {
      setCpfError('');
      Animated.timing(cpfBorderAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else if (!isValidCpf(cpf)) {
      setCpfError('CPF inválido');
      Animated.timing(cpfBorderAnim, {
        toValue: 2,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      setCpfError('');
      Animated.timing(cpfBorderAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleSenhaFocus = () => {
    Animated.timing(senhaFocusAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(senhaBorderAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleSenhaBlur = () => {
    Animated.timing(senhaFocusAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();

    Animated.timing(senhaBorderAnim, {
      toValue: senha.length > 0 ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handlePressIn = () => animateBotaoTo(2);
  const handlePressOut = () => animateBotaoTo(0);
  const handleHoverIn = () => {
    animateBotaoTo(1);
  };
  const handleHoverOut = () => {
    animateBotaoTo(0);
  };

  const cpfBorderColor = cpfBorderAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['#0f210f', mottuGreenVibrant, errorColor],
  });

  const senhaBorderColor = senhaBorderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#0f210f', mottuGreenVibrant],
  });

  const botaoBackgroundColor = botaoAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [mottuGreen, textDefault, mottuGreenDark],
  });

  const botaoTextColor = botaoAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [textDefault, mottuGreen, mottuGreen],
  });

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

  const animateBotaoTo = (value: number) => {
    Animated.timing(botaoAnim, {
      toValue: value,
      duration: 150,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const handleLogin = () => {
    const cleaned = cpf.replace(/\D/g, '');

    if (cleaned.length !== 11 || cpfError || !isValidCpf(cpf)) {
      setCpfError('CPF inválido');
      Animated.timing(cpfBorderAnim, {
        toValue: 2,
        duration: 300,
        useNativeDriver: false,
      }).start();
      return;
    }

    onLogin(cpf, senha);
  };

  const irParaRegistro = () => navigation.navigate('UsuarioRegistro' as never);

  const underlineWidth = underlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 220],
  });

  return (
    <View style={styles.outerContainer}>
      <View style={styles.formContainer}>
        <Text style={styles.label}>CPF</Text>
        <AnimatedTextInput
          style={[styles.input, { borderBottomColor: cpfBorderColor }]}
          placeholder="Digite seu CPF"
          value={cpf}
          onChangeText={handleCpfChange}
          keyboardType="numeric"
          placeholderTextColor="#999"
          onFocus={handleCpfFocus}
          onBlur={handleCpfBlur}
        />
        <View style={{ minHeight: 20, marginBottom: 10 }}>
          {cpfError ? (
            <Text style={styles.errorText}>{cpfError}</Text>
          ) : (
            <Text style={{ fontSize: 12, opacity: 0 }}>&nbsp;</Text>
          )}
        </View>

        <Text style={styles.label}>Senha</Text>
        <AnimatedTextInput
          style={[styles.input, { borderBottomColor: senhaBorderColor }]}
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholderTextColor="#999"
          onFocus={handleSenhaFocus}
          onBlur={handleSenhaBlur}
        />

        <Pressable
          onPress={handleLogin}
          onHoverIn={handleHoverIn}
          onHoverOut={handleHoverOut}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={{ borderColor: mottuGreen, borderWidth: 2, borderRadius: 8, marginTop: 30 }}
        >
          <Animated.View
            style={[
              styles.botao,
              {
                backgroundColor: botaoBackgroundColor,
              },
            ]}
          >
            <Animated.Text
              style={{
                color: botaoTextColor,
                fontWeight: 'bold',
                fontSize: 16,
              }}
            >
              Entrar
            </Animated.Text>
          </Animated.View>
        </Pressable>

        <Pressable
          onPress={irParaRegistro}
          onHoverIn={animateHoverIn}
          onHoverOut={animateHoverOut}
          style={{ alignItems: 'center', marginTop: 20 }}
        >
          <Text style={styles.link}>Ainda não tem conta? Cadastre-se</Text>
          <Animated.View
            style={[
              styles.underline,
              {
                width: underlineWidth,
              },
            ]}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default UsuarioLoginFormulario;

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0c0c0c',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    minWidth: 280,
  },
  input: {
    borderBottomWidth: 2,
    padding: 12,
    marginBottom: 10,
    color: '#fff',
    backgroundColor: 'transparent',
    outlineWidth: 0,
    fontSize: 20,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#4f4f4f',
  },
  errorText: {
    color: '#ff4d4d',
    fontSize: 12,
  },
  botao: {
    padding: 12,
    alignItems: 'center',
    borderRadius: 6,
    outlineWidth: 0,
  },
  link: {
    color: '#66ff66',
    fontSize: 14,
    fontWeight: '300',
  },
  underline: {
    height: 2,
    backgroundColor: '#66ff66',
    marginTop: 2,
    borderRadius: 1,
  },
});
