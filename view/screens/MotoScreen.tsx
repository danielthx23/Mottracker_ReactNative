import React, { useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import MotoListDashboard from '../components/MotoListagem';
import MotoDetalhes from '../components/MotoDetalhes';
import MotoFormulario from '../components/MotoFormulario';
import { ToastMessageRef } from '../components/Toast';
import { useEstilos } from '../../hooks/useEstilos';
import { Estados, Moto } from '../../model/Moto';
import { useMotoControl } from '../../control/useMotoControl';
import { useContratoControl } from '../../control/useContratoControl';
import { useCameraControl } from '../../control/useCameraControl';
import { Contrato, Patio, Usuario } from '../../model';
import { ContextoPrincipal } from '../../context/ContextoPrincipal';

const mapStatusToEstado = (status: string): Estados => {
  switch (status) {
    case 'pátio': return Estados.NoPatio;
    case 'pátio errado': return Estados.NoPatioErrado;
    case 'retirada': return Estados.Retirada;
    case 'manutenção': return Estados.NaoDevolvida;
    default: return Estados.NoPatio;
  }
};


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
  const { cores } = useEstilos();
  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>
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
  patioVertices: any[];
  motoPosition: { x: number; y: number };
  userPosition: { x: number; y: number };
  contratos: Contrato[];
  usuarios: Usuario[];
  patios: Patio[];
  onDelete: (idMoto: number) => void;
};

const MotoDetalhesScreen: React.FC<MotoDetalhesScreenProps> = ({ 
  motos, 
  patioVertices,
  motoPosition,
  userPosition,
  contratos,
  usuarios,
  patios,
  onDelete, 
  navigation, 
  route 
}) => {
  const { cores } = useEstilos();
  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>
      <MotoDetalhes
        motos={motos}
        patioVertices={patioVertices}
        motoPosition={motoPosition}
        userPosition={userPosition}
        contratos={contratos}
        usuarios={usuarios}
        patios={patios}
        onDelete={onDelete}
      />
    </View>
  );
};

const MotoScreen = ({ toastRef }: { toastRef: React.RefObject<ToastMessageRef | null> }) => {
  const { cores } = useEstilos();
  // Acessar dados do contexto
  const { 
    motos: listaMotos, 
    setMotos,
    contratos: listaContratos, 
    usuarios: listaUsuarios, 
    patios: listaPatios 
  } = useContext(ContextoPrincipal);
  
  
  // Control principal para motos
  const { 
    carregarLista, 
    salvar, 
    salvarComDados,
    atualizar, 
    atualizarComDados,
    apagar, 
    selecionarMoto,
    limparMoto,
    handlerInput,
    moto,
    setMoto
  } = useMotoControl();

  // Controls para contratos das motos
  const {
    carregarLista: carregarContratos,
    salvar: salvarContrato,
    apagar: apagarContrato,
    atualizar: atualizarContrato
  } = useContratoControl();

  // Controls para câmeras (monitoramento das motos)
  const {
    listaCameras,
    carregarLista: carregarCameras,
    salvar: salvarCamera,
    apagar: apagarCamera,
    atualizar: atualizarCamera
  } = useCameraControl();

  useEffect(() => {
    // Carregar dados necessários
    carregarLista(); // Carregar motos
    carregarContratos();
    carregarCameras();
  }, []);


  // Log quando os dados mudarem
  useEffect(() => {
  }, [listaMotos]);

  const gravarMoto = (motoData: Moto) => {
    // Chamar salvar diretamente com os dados
    salvarComDados(motoData);
  };

  const editarMoto = (motoEditada: Moto) => {
    // Chamar atualizar diretamente com os dados
    atualizarComDados(motoEditada);
  };

  const deletarMoto = (idMoto: number) => {
    apagar(idMoto);
  };

  return (
    <View style={{ flex: 1, backgroundColor: cores.fundo }}>
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
            patioVertices={[]}
            motoPosition={{ x: 0, y: 0 }}
            userPosition={{ x: 0, y: 0 }}
            contratos={listaContratos}
            usuarios={listaUsuarios}
            patios={listaPatios}
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
    </View>
  );
};

export default MotoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
});