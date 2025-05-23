import React from 'react';
import { View, StyleSheet } from 'react-native';
import MotoListDashboard from '../components/MotoListagem';

interface Moto {
    placa: string;
    modelo: string;
    status: 'pátio' | 'retirada' | 'manutenção';
  }

const motos: Moto[] = [
    { placa: 'ABC1234', modelo: 'Honda CG 160', status: 'pátio' },
    { placa: 'XYZ5678', modelo: 'Yamaha YBR 125', status: 'retirada' },
    { placa: 'DEF2345', modelo: 'Honda Biz', status: 'manutenção' },
    { placa: 'GHI6789', modelo: 'Suzuki Yes', status: 'pátio' },
  ];
  

const UsuarioScreen = () => {
  return (
    <View style={styles.container}>
      <MotoListDashboard motos={motos} />
    </View>
  );
};

export default UsuarioScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
});
