import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Usuario } from '../model/Usuario';

interface UsuarioContextType {
  usuarioLogado: Usuario | undefined;
  setUsuarioLogado: (usuario: Usuario | undefined) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const UsuarioContext = createContext<UsuarioContextType | undefined>(undefined);

interface UsuarioProviderProps {
  children: ReactNode;
}

export const UsuarioProvider: React.FC<UsuarioProviderProps> = ({ children }) => {
  const [usuarioLogado, setUsuarioLogado] = useState<Usuario | undefined>();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const verificarToken = async () => {
      try {
        const token = await AsyncStorage.getItem('user_token');
        const usuariosJson = await AsyncStorage.getItem('usuarios');

        if (token && token.length > 0 && usuariosJson) {
          const usuarios: Usuario[] = JSON.parse(usuariosJson);
          const usuarioEncontrado = usuarios.find(u => u.tokenUsuario === token);

          if (usuarioEncontrado) {
            setUsuarioLogado(usuarioEncontrado);
          } else {
            await AsyncStorage.removeItem('user_token');
            setUsuarioLogado(undefined);
          }
        } else {
          setUsuarioLogado(undefined);
        }
      } catch (error) {
        console.error("Erro ao verificar token de sessão:", error);
        setUsuarioLogado(undefined);
      } finally {
        setIsLoading(false);
      }
    };

    verificarToken();
  }, []);

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user_token');
      setUsuarioLogado(undefined);
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const handleSetUsuarioLogado = (usuario: Usuario | undefined) => {
    setUsuarioLogado(usuario);
  };

  return (
    <UsuarioContext.Provider 
      value={{ 
        usuarioLogado, 
        setUsuarioLogado: handleSetUsuarioLogado, 
        logout,
        isLoading 
      }}
    >
      {children}
    </UsuarioContext.Provider>
  );
};

export const useUsuario = (): UsuarioContextType => {
  const context = useContext(UsuarioContext);
  if (context === undefined) {
    throw new Error('useUsuario deve ser usado dentro de um UsuarioProvider');
  }
  return context;
};
