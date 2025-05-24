import React from 'react';
import { View, Text } from 'react-native';
import HomeDashboard from '../components/HomeDashboard'; // ajuste o caminho conforme necessário
import { ToastMessageRef } from '../components/Toast';

const HomeScreen = ({ toastRef }: {toastRef: React.RefObject<ToastMessageRef | null>}) => {
  return (
    <View style={{ flex: 1, backgroundColor: '#0c0c0c' }}>
      <HomeDashboard
        motosRetiradas={133}
        motosEmPatio={80}
        motosEmManutencao={7}
        cameras={[
          { id: 1, status: 'online' },
          { id: 2, status: 'offline' },
          { id: 3, status: 'online' },
          { id: 4, status: 'offline' },
        ]}
        patios={[
          { nome: 'Pátio A', quantidadeMotos: 24 },
          { nome: 'Pátio B', quantidadeMotos: 15 },
          { nome: 'Pátio C', quantidadeMotos: 10 },
        ]} 
        // esse toastref tem que ficar na context urgente
        toastRef={toastRef}        />
    </View>
  );
};

export default HomeScreen;
