import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Text,
  Animated,
  TextInput as RNTextInput,
  Pressable,
  Easing,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useEstilos } from '../../hooks/useEstilos';
import { useTema } from '../../context/TemaContext';

const AnimatedTextInput = Animated.createAnimatedComponent(RNTextInput);

interface UsuarioLoginFormularioProps {
  onLogin: (email: string, senha: string) => void;
  loginError?: string;
  setLoginError: (error: string) => void;
  loading?: boolean;
}

const UsuarioLoginFormulario: React.FC<UsuarioLoginFormularioProps> = ({ onLogin, loginError, setLoginError, loading = false }) => {
  const { cores } = useEstilos();
  const { toggleTema } = useTema();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [emailError, setEmailError] = useState('');

  useEffect(() => {
    if (loginError) {
      Animated.timing(emailBorderAnim, {
        toValue: 2,
        duration: 200,
        useNativeDriver: false,
      }).start();
      Animated.timing(senhaBorderAnim, {
        toValue: 2,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  }, [loginError]);

  // Limpar erros quando não houver erro de login
  useEffect(() => {
    if (!loginError) {
      setEmailError('');
    }
  }, [loginError]);

  const navigation = useNavigation();

  const emailFocusAnim = useRef(new Animated.Value(0)).current;
  const senhaFocusAnim = useRef(new Animated.Value(0)).current;
  const underlineAnim = useRef(new Animated.Value(0)).current;
  const botaoAnim = useRef(new Animated.Value(0)).current;

  const emailBorderAnim = useRef(new Animated.Value(0)).current;
  const senhaBorderAnim = useRef(new Animated.Value(0)).current;

  const mottuGreen = cores.sucesso;
  const mottuGreenVibrant = cores.sucesso;
  const mottuGreenDark = cores.sucesso;
  const textDefault = cores.textoInvertido;
  const errorColor = cores.erro;

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (value.length > 0) {
      const valid = isValidEmail(value);
      setEmailError(valid ? '' : 'Email inválido');
      Animated.timing(emailBorderAnim, {
        toValue: valid ? 1 : 2,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      setEmailError('');
      Animated.timing(emailBorderAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleEmailFocus = () => {
    Animated.timing(emailFocusAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();

    if (!emailError) {
      Animated.timing(emailBorderAnim, {
        toValue: 1, 
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleEmailBlur = () => {
    Animated.timing(emailFocusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();

    if (email.length === 0) {
      setEmailError('');
      Animated.timing(emailBorderAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else if (!isValidEmail(email)) {
      setEmailError('Email inválido');
      Animated.timing(emailBorderAnim, {
        toValue: 2,
        duration: 200,
        useNativeDriver: false,
      }).start();
    } else {
      setEmailError('');
      Animated.timing(emailBorderAnim, {
        toValue: 1,
        duration: 200,
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
      duration: 200,
      useNativeDriver: false,
    }).start();

    Animated.timing(senhaBorderAnim, {
      toValue: senha.length > 0 ? 1 : 0,
      duration: 200,
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

  const emailBorderColor = emailBorderAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [cores.borda, cores.sucesso, cores.erro],
  });

  const senhaBorderColor = senhaBorderAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: [cores.borda, cores.sucesso, cores.erro],
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
    
    if (!email || emailError || !isValidEmail(email)) {
      setEmailError('Email inválido');
      Animated.timing(emailBorderAnim, {
        toValue: 2,
        duration: 200,
        useNativeDriver: false,
      }).start();
      return;
    }
  
    if (!senha) {
      Animated.timing(senhaBorderAnim, {
        toValue: 2,
        duration: 200,
        useNativeDriver: false,
      }).start();
      return;
    }
  
    onLogin(email, senha);
  };

  const irParaRegistro = () => {setLoginError(''); navigation.navigate('UsuarioRegistro' as never)};

  const underlineWidth = underlineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 220],
  });

  return (
    <View style={[styles.outerContainer, { backgroundColor: cores.fundo }]}>
      <TouchableOpacity 
        onPress={toggleTema}
        style={[styles.themeButton, { backgroundColor: cores.fundoCard }]}
      >
        <Ionicons name="color-palette" size={24} color={cores.texto} />
      </TouchableOpacity>
      <View style={styles.formContainer}>
        <Text style={[styles.label, { color: cores.textoSecundario }]}>Email</Text>
        <AnimatedTextInput
          style={[styles.input, { borderBottomColor: emailBorderColor, color: cores.texto }]}
          placeholder="Digite seu email"
          value={email}
          onChangeText={handleEmailChange}
          keyboardType="email-address"
          placeholderTextColor={cores.textoSecundario}
          onFocus={handleEmailFocus}
          onBlur={handleEmailBlur}
        />
        <View style={{ minHeight: 20, marginBottom: 10 }}>
          {emailError ? (
            <Text style={[styles.errorText, { color: cores.erro }]}>{emailError}</Text>
          ) : (
            <Text style={{ fontSize: 12, opacity: 0 }}>&nbsp;</Text>
          )}
        </View>

        <Text style={[styles.label, { color: cores.textoSecundario }]}>Senha</Text>
        <AnimatedTextInput
          style={[styles.input, { borderBottomColor: senhaBorderColor, color: cores.texto }]}
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          placeholderTextColor={cores.textoSecundario}
          onFocus={handleSenhaFocus}
          onBlur={handleSenhaBlur}
        />
        <View style={{ minHeight: 20, marginTop: 5 }}>
          {loginError ? (
            <Text style={[styles.errorText, { color: cores.erro }]}>{loginError}</Text>
          ) : (
            <Text style={{ fontSize: 12, opacity: 0 }}>&nbsp;</Text>
          )}
        </View>

        <Pressable
          onPress={handleLogin}
          onHoverIn={handleHoverIn}
          onHoverOut={handleHoverOut}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          disabled={loading}
          style={{ borderColor: mottuGreen, borderWidth: 2, borderRadius: 8, marginTop: 30, opacity: loading ? 0.6 : 1 }}
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
              {loading ? 'Entrando...' : 'Entrar'}
            </Animated.Text>
          </Animated.View>
        </Pressable>

        <Pressable
          onPress={irParaRegistro}
          onHoverIn={animateHoverIn}
          onHoverOut={animateHoverOut}
          style={{ alignItems: 'center', marginTop: 20 }}
        >
          <Text style={[styles.link, { color: cores.primaria }]}>Ainda não tem conta? Cadastre-se</Text>
          <Animated.View
            style={[
              styles.underline,
              {
                width: underlineWidth,
                backgroundColor: cores.primaria,
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
