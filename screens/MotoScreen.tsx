import React from 'react';
import { View, StyleSheet } from 'react-native';
import MotoListDashboard from '../components/MotoListagem';
import { ToastMessageRef } from '../components/Toast';

interface Moto {
    placa: string;
    modelo: string;
    status: 'pátio' | 'retirada' | 'manutenção';
    hora: string;
  }

  const motos: Moto[] = [
    { placa: 'ABC1234', modelo: 'Honda CG 160', status: 'pátio', hora: '08:00' },
    { placa: 'XYZ5678', modelo: 'Yamaha YBR 125', status: 'retirada', hora: '09:00' },
    { placa: 'DEF2345', modelo: 'Honda Biz', status: 'manutenção', hora: '10:00' },
    { placa: 'GHI6789', modelo: 'Suzuki Yes', status: 'pátio', hora: '11:00' },
    { placa: 'JKL9876', modelo: 'Kawasaki Ninja 300', status: 'retirada', hora: '11:30' },
    { placa: 'MNO4321', modelo: 'Bros 160', status: 'manutenção', hora: '12:00' },
    { placa: 'PQR3456', modelo: 'CG 125', status: 'pátio', hora: '12:30' },
    { placa: 'STU6543', modelo: 'Yamaha Fazer 250', status: 'retirada', hora: '13:00' },
    { placa: 'VWX7654', modelo: 'Honda Titan', status: 'manutenção', hora: '13:30' },
    { placa: 'YZA8765', modelo: 'Suzuki GSX', status: 'pátio', hora: '14:00' },
    { placa: 'BCD9876', modelo: 'Harley-Davidson Sportster', status: 'retirada', hora: '14:30' },
    { placa: 'EFG6543', modelo: 'Ducati Monster 821', status: 'manutenção', hora: '15:00' },
    { placa: 'HIJ3210', modelo: 'BMW F 800 GS', status: 'pátio', hora: '15:30' },
    { placa: 'KLM1234', modelo: 'Triumph Street Triple', status: 'retirada', hora: '16:00' },
    { placa: 'NOP4321', modelo: 'Royal Enfield Himalayan', status: 'manutenção', hora: '16:30' },
    { placa: 'QRS8765', modelo: 'KTM Duke 390', status: 'pátio', hora: '17:00' },
    { placa: 'TUV2345', modelo: 'Honda CRF 250L', status: 'retirada', hora: '17:30' },
    { placa: 'WXY3456', modelo: 'Yamaha MT-07', status: 'manutenção', hora: '18:00' },
    { placa: 'ZAB4567', modelo: 'Kawasaki Z900', status: 'pátio', hora: '18:30' },
    { placa: 'CDE5678', modelo: 'Harley-Davidson Touring', status: 'retirada', hora: '19:00' },
  ];
  
const UsuarioScreen = ({ toastRef }: { toastRef: React.RefObject<ToastMessageRef | null> }) => {
  return (
    <View style={styles.container}>
      <MotoListDashboard motos={motos} toastRef={toastRef} onCreateMoto={function (): void {
        throw new Error('Function not implemented.');
      } } onMotoDetails={function (placa: string): void {
        throw new Error('Function not implemented.');
      } } />
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
