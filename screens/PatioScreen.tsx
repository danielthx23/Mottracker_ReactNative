import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import PatioListDashboard from '../components/PatioListagem';
import { ToastMessageRef } from '../components/Toast';
import PatioDetalhes from '../components/PatioDetalhes';
import PatioFormulario from '../components/PatioFormulario';

interface Patio {
  idPatio: number;
  nomePatio: string;
  motosTotaisPatio: number;
  motosDisponiveisPatio: number;
  dataPatio: Date;
}

const patios: Patio[] = Array.from({ length: 50 }, (_, i) => {
  const nomes = [
    'Pátio Central', 'Pátio Norte', 'Pátio Sul', 'Pátio Leste', 'Pátio Oeste',
    'Estacionamento Principal', 'Área de Manutenção', 'Pátio VIP', 'Zona de Entrega',
    'Pátio Administrativo', 'Área de Lavagem', 'Pátio de Espera', 'Terminal A',
    'Terminal B', 'Área de Inspeção', 'Pátio Coberto', 'Área Externa',
    'Estacionamento Funcionários', 'Pátio de Carga', 'Área de Testes'
  ];

  const totalMotos = Math.floor(Math.random() * 80) + 20; 
  const disponíveis = Math.floor(Math.random() * totalMotos); 

  return {
    idPatio: i + 1,
    nomePatio: `${nomes[i % nomes.length]} ${Math.floor(i / nomes.length) + 1}`,
    motosTotaisPatio: totalMotos,
    motosDisponiveisPatio: disponíveis,
    dataPatio: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
  };
});

type PatioStackParamList = {
  PatioList: undefined;
  PatioDetalhes: { idPatio: number };
  PatioFormulario: { patio?: Patio } | undefined;
};

const Stack = createStackNavigator<PatioStackParamList>();

type PatioListScreenProps = StackScreenProps<PatioStackParamList, 'PatioList'> & {
  toastRef: React.RefObject<ToastMessageRef | null>;
  patios: Patio[];
};

const PatioListScreen: React.FC<PatioListScreenProps> = ({
  navigation,
  toastRef,
  patios,
}) => {
  return (
    <View style={styles.container}>
      <PatioListDashboard
        patios={patios}
        toastRef={toastRef}
        onCreatePatio={() => {
          navigation.navigate('PatioFormulario');
        }}
        onPatioDetails={(idPatio: number) => {
          navigation.navigate('PatioDetalhes', { idPatio: idPatio });
        }}
      />
    </View>
  );
};

type PatioDetalhesScreenProps = StackScreenProps<PatioStackParamList, 'PatioDetalhes'> & {
  patios: Patio[];
  onDelete: (idPatio: number) => void;
  toastRef: React.RefObject<ToastMessageRef | null>;
  onNavigateToMoto: (idMoto: number) => void;
};

const PatioDetalhesScreen: React.FC<PatioDetalhesScreenProps> = ({ 
  patios, 
  onDelete, 
  navigation, 
  route,
  toastRef,
  onNavigateToMoto,
}) => {
  const patio = patios.find(p => p.idPatio === route.params.idPatio);

  if (!patio) {
    return <View style={styles.container} />;
  }

  return (
    <View style={styles.container}>
      <PatioDetalhes
        patio={patio}
        patios={patios}
        onDelete={onDelete}
        onEdit={() => {
          navigation.navigate('PatioFormulario', { patio });
        }}
        onBack={() => navigation.goBack()} 
        toastRef={toastRef} 
        onNavigateToMoto={onNavigateToMoto}
      />
    </View>
  );
};

type PatioFormularioScreenProps = StackScreenProps<PatioStackParamList, 'PatioFormulario'> & {
  onSalvar: (patio: Patio) => void;
  onEditar: (patio: Patio) => void;
};

const PatioFormularioScreen: React.FC<PatioFormularioScreenProps> = ({
  navigation,
  route,
  onSalvar,
  onEditar,
}) => {
  const patioParaEditar = route.params?.patio;

  return (
    <View style={styles.container}>
      <PatioFormulario
        patio={patioParaEditar}
        onSalvar={(patio: Patio) => {
          if (patioParaEditar) {
            onEditar(patio);
          } else {
            onSalvar(patio);
          }
          navigation.goBack();
        }}
        onCancelar={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
};

const PatioScreen = ({ 
  toastRef, 
  onNavigateToMoto 
}: { 
  toastRef: React.RefObject<ToastMessageRef | null>;
  onNavigateToMoto: (idMoto: number) => void;
}) => {
  const [listaPatios, setListaPatios] = useState<Patio[]>(patios);

  const gravarPatio = (patio: Patio) => {
    const novoPatio: Patio = {
      ...patio,
      idPatio: listaPatios.length > 0 ? Math.max(...listaPatios.map(p => p.idPatio)) + 1 : 1,
      dataPatio: new Date(),
    };
    setListaPatios(prev => [...prev, novoPatio]);
    toastRef.current?.show('Sucesso', 'Pátio cadastrado com sucesso!', 'success');
  };

  const editarPatio = (patioEditado: Patio) => {
    const atualizados = listaPatios.map(p => p.idPatio === patioEditado.idPatio ? patioEditado : p);
    setListaPatios(atualizados);
    toastRef.current?.show('Sucesso', `Pátio "${patioEditado.nomePatio}" atualizado com sucesso!`, 'success');
  };

  const deletarPatio = (idPatio: number) => {
    const patioParaDeletar = listaPatios.find(p => p.idPatio === idPatio);
    const atualizados = listaPatios.filter(p => p.idPatio !== idPatio);
    setListaPatios(atualizados);
    toastRef.current?.show('Sucesso', `Pátio "${patioParaDeletar?.nomePatio}" deletado com sucesso!`, 'success');
  };

  return (
    <Stack.Navigator initialRouteName="PatioList" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PatioList">
        {(props) => (
          <PatioListScreen
            {...props}
            toastRef={toastRef}
            patios={listaPatios}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="PatioDetalhes">
        {(props) => (
          <PatioDetalhesScreen
            patios={listaPatios} 
            {...props}
            toastRef={toastRef}
            onNavigateToMoto={onNavigateToMoto}
            onDelete={(idPatio) => {
              deletarPatio(idPatio);
              props.navigation.goBack();
            }}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="PatioFormulario">
        {(props) => (
          <PatioFormularioScreen
            {...props}
            onSalvar={gravarPatio}
            onEditar={editarPatio}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

export default PatioScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
});