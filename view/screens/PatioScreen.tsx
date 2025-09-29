import React, { useEffect, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack';
import PatioListDashboard from '../components/PatioListagem';
import { ToastMessageRef } from '../components/Toast';
import { useEstilos } from '../../hooks/useEstilos';
import PatioDetalhes from '../components/PatioDetalhes';
import PatioFormulario from '../components/PatioFormulario';
import PatioFormularioCompleto from '../components/PatioFormularioCompleto';
import { usePatioControl } from '../../control/usePatioControl';
import { useLayoutPatioControl } from '../../control/useLayoutPatioControl';
import { useQrCodePontoControl } from '../../control/useQrCodePontoControl';
import { useCameraControl } from '../../control/useCameraControl';
import { useMotoControl } from '../../control/useMotoControl';
import { Moto } from '../../model/Moto';
import { Camera } from '../../model/Camera';
import { ContextoPrincipal } from '../../contexto/ContextoPrincipal';

interface Patio {
  idPatio: number;
  nomePatio: string;
  motosTotaisPatio: number;
  motosDisponiveisPatio: number;
  dataPatio: Date;
}


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
  const { cores } = useEstilos();
  // Usar contexto para obter pátios
  const { patios: patiosDoContexto } = useContext(ContextoPrincipal);
  

  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>
      <PatioListDashboard
        patios={patiosDoContexto} // Usar pátios do contexto
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
  motos: Moto[];
  cameras: Camera[];
  onDelete: (idPatio: number) => void;
  toastRef: React.RefObject<ToastMessageRef | null>;
  onNavigateToMoto: (idMoto: number) => void;
};

const PatioDetalhesScreen: React.FC<PatioDetalhesScreenProps> = ({ 
  patios, 
  motos,
  cameras,
  onDelete, 
  navigation, 
  route,
  toastRef,
  onNavigateToMoto,
}) => {
  const { cores } = useEstilos();
  // Usar contexto para obter dados
  const { patios: patiosDoContexto, motos: motosDoContexto, cameras: camerasDoContexto } = useContext(ContextoPrincipal);
  
  const patio = patiosDoContexto.find(p => p.idPatio === route.params.idPatio);

  if (!patio) {
    return <View style={[styles.container, { backgroundColor: cores.fundo }]} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>
      <PatioDetalhes
        patio={patio}
        patios={patiosDoContexto}
        motos={motosDoContexto}
        cameras={camerasDoContexto}
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
  onAtualizarMotosCameras?: (idPatio: number, motosIds: number[], camerasIds: number[]) => void;
};

const PatioFormularioScreen: React.FC<PatioFormularioScreenProps> = ({
  navigation,
  route,
  onSalvar,
  onEditar,
  onAtualizarMotosCameras,
}) => {
  const { cores } = useEstilos();
  const patioParaEditar = route.params?.patio;
  const isEditing = !!patioParaEditar;

  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>
      {isEditing ? (
        <PatioFormularioCompleto
          patio={patioParaEditar}
          onSalvar={(patio: Patio) => {
            onEditar(patio);
            navigation.goBack();
          }}
          onCancelar={() => {
            navigation.goBack();
          }}
          onAtualizarMotosCameras={onAtualizarMotosCameras}
        />
      ) : (
        <PatioFormulario
          patio={patioParaEditar}
          onSalvar={(patio: Patio) => {
            onSalvar(patio);
            navigation.goBack();
          }}
          onCancelar={() => {
            navigation.goBack();
          }}
        />
      )}
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
  const { cores } = useEstilos();
  // Control principal para pátios
  const { 
    listaPatios, 
    carregarLista, 
    salvar, 
    salvarComDados,
    atualizar, 
    atualizarComDados,
    apagar, 
    selecionarPatio,
    limparPatio,
    handlerInput,
    patio,
    atualizarMotosCamerasPatio
  } = usePatioControl();

  // Controls para layout dos pátios
  const {
    listaLayoutPatios,
    carregarLista: carregarLayoutPatios,
    salvar: salvarLayoutPatio,
    apagar: apagarLayoutPatio,
    atualizar: atualizarLayoutPatio
  } = useLayoutPatioControl();

  // Controls para QR Code de pontos dos pátios
  const {
    listaQrCodePontos,
    carregarLista: carregarQrCodePontos,
    salvar: salvarQrCodePonto,
    apagar: apagarQrCodePonto,
    atualizar: atualizarQrCodePonto
  } = useQrCodePontoControl();

  // Controls para câmeras dos pátios
  const {
    listaCameras,
    carregarLista: carregarCameras,
    salvar: salvarCamera,
    apagar: apagarCamera,
    atualizar: atualizarCamera
  } = useCameraControl();

  // Controls para motos (para mostrar no detalhes do pátio)
  const {
    listaMotos,
    carregarLista: carregarMotos
  } = useMotoControl();

  useEffect(() => {
    // Carregar dados necessários
    carregarLista(); // Carregar pátios
    carregarLayoutPatios();
    carregarQrCodePontos();
    carregarCameras();
    carregarMotos(); // Carregar motos para detalhes
  }, []);

  const gravarPatio = (patioData: Patio) => {
    // Chamar salvar diretamente com os dados
    salvarComDados(patioData);
  };

  const editarPatio = (patioEditado: Patio) => {
    // Chamar atualizar diretamente com os dados
    atualizarComDados(patioEditado);
  };

  const deletarPatio = (idPatio: number) => {
    apagar(idPatio);
  };

  return (
    <View style={{ flex: 1, backgroundColor: cores.fundo }}>
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
            motos={listaMotos}
            cameras={listaCameras}
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
            onAtualizarMotosCameras={atualizarMotosCamerasPatio}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
    </View>
  );
};

export default PatioScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
  },
});