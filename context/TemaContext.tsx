import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type TemaTipo = 'claro' | 'escuro';

interface TemaContextData {
  tema: TemaTipo;
  toggleTema: () => void;
  cores: {
    // Cores principais
    primaria: string;
    secundaria: string;
    sucesso: string;
    erro: string;
    aviso: string;
    info: string;
    
    // Cores de fundo
    fundo: string;
    fundoCard: string;
    fundoModal: string;
    
    // Cores de texto
    texto: string;
    textoSecundario: string;
    textoInvertido: string;
    
    // Cores de borda
    borda: string;
    bordaFoco: string;
    
    // Cores de status
    statusAtivo: string;
    statusInativo: string;
    statusPendente: string;
  };
}

const TemaContext = createContext<TemaContextData>({} as TemaContextData);

// Cores do tema claro
const coresClaro = {
  primaria: '#007AFF',
  secundaria: '#5856D6',
  sucesso: '#34C759',
  erro: '#FF3B30',
  aviso: '#FF9500',
  info: '#5AC8FA',
  
  fundo: '#FFFFFF',
  fundoCard: '#F2F2F7',
  fundoModal: 'rgba(0, 0, 0, 0.5)',
  
  texto: '#000000',
  textoSecundario: '#8E8E93',
  textoInvertido: '#FFFFFF',
  
  borda: '#C6C6C8',
  bordaFoco: '#007AFF',
  
  statusAtivo: '#34C759',
  statusInativo: '#8E8E93',
  statusPendente: '#FF9500',
};

// Cores do tema escuro
const coresEscuro = {
  primaria: '#0A84FF',
  secundaria: '#5E5CE6',
  sucesso: '#30D158',
  erro: '#FF453A',
  aviso: '#FF9F0A',
  info: '#64D2FF',
  
  fundo: '#0f0f0f',
  fundoCard: '#1f1f1f',
  fundoModal: 'rgba(0, 0, 0, 0.8)',
  
  texto: '#FFFFFF',
  textoSecundario: '#8E8E93',
  textoInvertido: '#000000',
  
  borda: '#38383A',
  bordaFoco: '#0A84FF',
  
  statusAtivo: '#30D158',
  statusInativo: '#8E8E93',
  statusPendente: '#FF9F0A',
};

export const TemaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tema, setTema] = useState<TemaTipo>('claro');

  // Carregar tema salvo ao inicializar
  useEffect(() => {
    carregarTemaSalvo();
  }, []);

  const carregarTemaSalvo = async () => {
    try {
      const temaSalvo = await AsyncStorage.getItem('@Mottracker:tema');
      if (temaSalvo) {
        setTema(temaSalvo as TemaTipo);
      }
    } catch (error) {
      console.log('Erro ao carregar tema:', error);
    }
  };

  const salvarTema = async (novoTema: TemaTipo) => {
    try {
      await AsyncStorage.setItem('@Mottracker:tema', novoTema);
    } catch (error) {
      console.log('Erro ao salvar tema:', error);
    }
  };

  const toggleTema = () => {
    const novoTema = tema === 'claro' ? 'escuro' : 'claro';
    setTema(novoTema);
    salvarTema(novoTema);
  };

  const cores = tema === 'claro' ? coresClaro : coresEscuro;

  return (
    <TemaContext.Provider value={{ tema, toggleTema, cores }}>
      {children}
    </TemaContext.Provider>
  );
};

export const useTema = () => {
  const context = useContext(TemaContext);
  if (!context) {
    throw new Error('useTema deve ser usado dentro de um TemaProvider');
  }
  return context;
};
