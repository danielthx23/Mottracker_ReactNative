import React from 'react';
import { View, Text } from 'react-native';
import HomeDashboard from '../components/HomeDashboard'; // ajuste o caminho conforme necessário

const HomeScreen = () => {
  return (
    <View style={{ flex: 1, backgroundColor: '#0c0c0c' }}>
      <HomeDashboard
        motosRetiradas={123}
        motosEmPatio={80}
        motosEmManutencao={7}
        cameras={[
            { id: 1, status: 'online' },
            { id: 2, status: 'offline' },
            { id: 3, status: 'online' },
            { id: 4, status: 'online' },
        ]}
        patios={[
            { nome: 'Pátio A', quantidadeMotos: 24 },
            { nome: 'Pátio B', quantidadeMotos: 15 },
            { nome: 'Pátio C', quantidadeMotos: 10 },
        ]}
        />
    </View>
  );
};

export default HomeScreen;
