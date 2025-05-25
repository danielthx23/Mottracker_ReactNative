import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import MotoListDashboard from '../components/MotoListagem';
import MotoDetalhes from '../components/MotoDetalhes';
import MotoFormulario from '../components/MotoFormulario';
import { ToastMessageRef } from '../components/Toast';
import { Estados, Moto } from '../types/Moto';

const mapStatusToEstado = (status: string): Estados => {
  switch (status) {
    case 'pátio': return Estados.NoPatio;
    case 'pátio errado': return Estados.NoPatioErrado;
    case 'retirada': return Estados.Retirada;
    case 'manutenção': return Estados.NaoDevolvida;
    default: return Estados.NoPatio;
  }
};

const motos: Moto[] = Array.from({ length: 300 }, (_, i) => {
  const horas = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];
  const modelos = ['Honda CG', 'Yamaha XTZ', 'KTM RC', 'BMW GS', 'Ducati Multistrada', 'Harley Road King'];
  const statusList = ['pátio', 'retirada', 'manutenção', 'pátio errado'];

  return {
    idMoto: i + 1,
    placaMoto: `ZZZ${1000 + i}`,
    modeloMoto: modelos[Math.floor(Math.random() * modelos.length)],
    anoMoto: 2022,
    quilometragemMoto: 12345,
    estadoMoto: mapStatusToEstado(statusList[Math.floor(Math.random() * statusList.length)]),
    condicoesMoto: 'Boa',
    hora: horas[Math.floor(Math.random() * horas.length)],
  };
});

type MotoStackParamList = {
  MotoList: undefined;
  MotoDetalhes: { idMoto: number };
  MotoFormulario: { moto?: Moto } | undefined;
};

const Stack = createStackNavigator<MotoStackParamList>();

type MotoListScreenProps = StackScreenProps<MotoStackParamList, 'MotoList'> & {
  toastRef: React.RefObject<ToastMessageRef | null>;
  motos: Moto[];
};

const MotoListScreen: React.FC<MotoListScreenProps> = ({
  navigation,
  toastRef,
  motos,
}) => {
  return (
    <View style={styles.container}>
      <MotoListDashboard
        motos={motos}
        toastRef={toastRef}
        onCreateMoto={() => {
          navigation.navigate('MotoFormulario');
        }}
        onMotoDetails={(idMoto) => {
          navigation.navigate('MotoDetalhes', { idMoto: idMoto });
        }}
      />
    </View>
  );
};

type MotoDetalhesScreenProps = StackScreenProps<MotoStackParamList, 'MotoDetalhes'> & {
  motos: Moto[];
  onDelete: (idMoto: number) => void;
};

const MotoDetalhesScreen: React.FC<MotoDetalhesScreenProps> = ({ 
  motos, 
  onDelete, 
  navigation, 
  route 
}) => {
  const patioVertices = [
    { id: 'p1', x: 10, y: 10 },
    { id: 'p2', x: 370, y: 10 },
    { id: 'p3', x: 370, y: 140 },
    { id: 'p4', x: 180, y: 140 },
    { id: 'p5', x: 180, y: 350 },
    { id: 'p6', x: 10, y: 350 },
  ];

  const motoPosition = { x: 50, y: 250 };
  const userPosition = { x: 250, y: 100 };

  return (
    <View style={styles.container}>
      <MotoDetalhes
        motos={motos}
        patioVertices={patioVertices}
        motoPosition={motoPosition}
        userPosition={userPosition} 
        onDelete={onDelete}
      />
    </View>
  );
};

const MotoScreen = ({ toastRef }: { toastRef: React.RefObject<ToastMessageRef | null> }) => {
  const [listaMotos, setListaMotos] = useState<Moto[]>(motos);

  const gravarMoto = (moto: Moto) => {
    const novaMoto: Moto = {
      ...moto,
      idMoto: listaMotos.length > 0 ? Math.max(...listaMotos.map(m => m.idMoto)) + 1 : 1,
      hora: `${8 + Math.floor(Math.random() * 11)}:00`,
    };
    setListaMotos(prev => [...prev, novaMoto]);
    toastRef.current?.show('Sucesso', 'Moto cadastrada com sucesso!', 'success');
  };

  const editarMoto = (motoEditada: Moto) => {
    const atualizadas = listaMotos.map(m => m.idMoto === motoEditada.idMoto ? motoEditada : m);
    setListaMotos(atualizadas);
    toastRef.current?.show('Sucesso', `Moto atualizada com sucesso! ${motoEditada.modeloMoto}`, 'success');
  };

  const deletarMoto = (idMoto: number) => {
    const atualizadas = listaMotos.filter(m => m.idMoto !== idMoto);
    setListaMotos(atualizadas);
    toastRef.current?.show('Sucesso', 'Moto deletada com sucesso!', 'success');
  };

  return (
    <Stack.Navigator initialRouteName="MotoList" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MotoList">
        {(props) => (
          <MotoListScreen
            {...props}
            toastRef={toastRef}
            motos={listaMotos}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="MotoDetalhes">
        {(props) => (
          <MotoDetalhesScreen
            motos={listaMotos} 
            {...props}
            onDelete={(idMoto) => {
              deletarMoto(idMoto);
              props.navigation.goBack();
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="MotoFormulario">
        {(props) => {
          const motoParaEditar = props.route.params?.moto;
          return (
            <MotoFormulario
              moto={motoParaEditar} 
              onSalvar={(moto: Moto) => {
                gravarMoto(moto);
                props.navigation.goBack();
              }}
              onEditar={(moto: Moto) => {
                editarMoto(moto);
                props.navigation.goBack();
              }}
              onCancelar={() => {
                props.navigation.goBack();
              }}
            />
          );
        }}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default MotoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
});