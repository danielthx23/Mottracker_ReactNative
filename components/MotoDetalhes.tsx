import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Modal,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryTheme,
  VictoryLabel,
} from 'victory-native';
import Svg, { Polygon, Circle, Line, Text as SvgText } from 'react-native-svg';
import { Estados, Moto } from '../types/Moto';
import { PingCircle } from './PingCircle';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView, Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';

interface MotoDetalhesProps {
    motos: Moto[];
    patioVertices: Vertice[];
    motoPosition: { x: number; y: number };
    userPosition: { x: number; y: number };
    onDelete: (idMoto: number) => void;
  }

interface Vertice {
  id: string;
  x: number;
  y: number;
}

const estadoColors = {
  [Estados.Retirada]: '#3b82f6',
  [Estados.NoPatio]: '#10b981',
  [Estados.NoPatioErrado]: '#ef4444',
  [Estados.NaoDevolvida]: '#f59e0b',
};

const estadoNumericMapping: Record<Estados, number> = {
  [Estados.Retirada]: 4,
  [Estados.NoPatio]: 3,
  [Estados.NoPatioErrado]: 2,
  [Estados.NaoDevolvida]: 1,
};

const estadoLabels: Record<number, string> = {
  4: 'Retirada',
  3: 'No Pátio',
  2: 'No Pátio Errado',
  1: 'Não Devolvida',
};

const exemploStatusDia = [
  { time: '08:00', estado: Estados.NoPatio },
  { time: '10:30', estado: Estados.Retirada },
  { time: '12:00', estado: Estados.NoPatio },
  { time: '14:00', estado: Estados.NoPatioErrado },
  { time: '16:00', estado: Estados.NoPatio },
  { time: '18:00', estado: Estados.NaoDevolvida },
];

const MotoTab = ({ moto, onDelete, navigation }: { navigation: any, moto: Moto, onDelete: () => void }) => {
    const fields = [
        { label: 'ID', value: '#' + moto.idMoto },
        { label: 'Placa', value: moto.placaMoto },
        { label: 'Modelo', value: moto.modeloMoto },
        { label: 'Ano', value: moto.anoMoto },
        { label: 'Quilometragem', value: `${moto.quilometragemMoto} km` },
    ];

    if (moto.identificadorMoto) {
        fields.splice(3, 0, { label: 'Identificador', value: moto.identificadorMoto });
    }

    const [modalVisible, setModalVisible] = useState(false);
    const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

    return (
        <>
            <ScrollView style={styles.awsCard}>
                <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={[styles.awsActionBtn, { alignSelf: 'flex-end', marginBottom: 16 }]}
                    >
                        <Text style={styles.awsActionText}>Actions</Text>
                        <Ionicons name="chevron-down" size={16} color="#f3f4f6" />
                    </TouchableOpacity>
                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                            <View style={styles.modalContent}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalVisible(false);
                                            navigation.navigate('MotoFormulario', {
                                                moto
                                            });
                                    }}
                                    style={styles.modalButton}
                                >
                                    <Text style={styles.modalButtonText}>Editar moto</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalVisible(false);
                                        setConfirmDeleteVisible(true);
                                    }}
                                    style={styles.modalButton}
                                >
                                    <Text style={[styles.modalButtonText, { color: '#ff4d4d' }]}>Deletar moto</Text>
                                </TouchableOpacity>
                            </View>
                        </Pressable>
                    </Modal>
                </View>

                <View style={styles.graficoBox}>
                    <VictoryChart
                        theme={VictoryTheme.material}
                        domain={{ y: [0.5, 4.5] }}
                        height={250}
                        width={350}
                        padding={{ top: 40, bottom: 40, left: 80, right: 20 }}
                    >
                        <VictoryLabel
                            text="Status por Horário Comercial"
                            x={110}
                            y={10}
                            textAnchor="middle"
                            style={{ fill: '#f3f4f6', fontSize: 16, fontWeight: '600' }}
                        />
                        <VictoryAxis
                            tickValues={exemploStatusDia.map((d) => d.time)}
                            style={{ tickLabels: { fontSize: 8, fill: '#ccc', angle: -30, padding: 12 }, axis: { stroke: '#999' } }}
                        />
                        <VictoryAxis
                            dependentAxis
                            tickValues={[1, 2, 3, 4]}
                            tickFormat={(y) => estadoLabels[y]}
                            style={{ tickLabels: { fontSize: 8, fill: '#ccc' }, axis: { stroke: '#999' } }}
                        />
                        <VictoryLine
                            interpolation="stepAfter"
                            data={exemploStatusDia.map(({ time, estado }) => ({
                                x: time,
                                y: estadoNumericMapping[estado],
                            }))}
                            style={{ data: { stroke: '#3b82f6', strokeWidth: 2 } }}
                        />
                    </VictoryChart>
                </View>
                <View style={styles.detalhesContainer}>
                    <Text style={styles.title}>Detalhes da Moto</Text>
                    {fields.map((item, index) => (
                        <View key={index} style={styles.itemRow}>
                            <Text style={styles.itemLabel}>{item.label}</Text>
                            <Text style={styles.itemValue}>{item.value}</Text>
                        </View>
                    ))}
                    <View style={styles.itemRow}>
                        <Text style={styles.itemLabel}>Estado</Text>
                        <View style={styles.estadoContainer}>
                            <Ionicons name="ellipse" size={12} color={estadoColors[moto.estadoMoto]} />
                            <Text style={[styles.itemValue, { color: estadoColors[moto.estadoMoto], marginLeft: 6 }]}>
                                {moto.estadoMoto}
                            </Text>
                        </View>
                    </View>
                    {moto.condicoesMoto && (
                        <View style={styles.itemRow}>
                            <Text style={styles.itemLabel}>Condições</Text>
                            <Text style={styles.itemValue}>{moto.condicoesMoto}</Text>
                        </View>
                    )}
                    <View style={styles.itemRow}>
                        <Text style={styles.itemLabel}>Último horário registrado</Text>
                        <Text style={styles.itemValue}>{moto.hora}</Text>
                    </View>
                </View>
            </ScrollView>
            <Modal
                animationType="fade"
                transparent={true}
                visible={confirmDeleteVisible}
                onRequestClose={() => setConfirmDeleteVisible(false)}
            >
                <Pressable style={styles.modalOverlay} onPress={() => setConfirmDeleteVisible(false)}>
                    <View style={styles.modalContent}>
                        <Text style={[styles.modalTitle, { fontSize: 16 }]}>Deseja realmente deletar esta moto?</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setConfirmDeleteVisible(false);
                                onDelete();
                            }}
                            style={styles.modalButton}
                        >
                            <Text style={[styles.modalButtonText, { color: '#ff4d4d' }]}>Confirmar deleção</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setConfirmDeleteVisible(false)} style={styles.modalButton}>
                            <Text style={[styles.modalButtonText, { color: '#9ca3af' }]}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>
        </>
    );
};

const UsuarioAfiliadoTab = () => (
  <ScrollView style={[styles.awsCard, { padding: 20 }]}>
    <Text style={styles.title}>Usuário Afiliado</Text>
    <View style={styles.itemRow}>
      <Text style={styles.itemLabel}>Nome</Text>
      <Text style={styles.itemValue}>João da Silva</Text>
    </View>
    <View style={styles.itemRow}>
      <Text style={styles.itemLabel}>Email</Text>
      <Text style={styles.itemValue}>joao.silva@email.com</Text>
    </View>
    <View style={styles.itemRow}>
      <Text style={styles.itemLabel}>Telefone</Text>
      <Text style={styles.itemValue}>(11) 91234-5678</Text>
    </View>
    <View style={styles.ruler} />
    <Text style={styles.title}>Contrato Afiliado</Text>
    <View style={styles.itemRow}>
      <Text style={styles.itemLabel}>Data de expiração</Text>
      <Text style={styles.itemValue}>31/12/2025</Text>
    </View>
    <View style={styles.itemRow}>
      <Text style={styles.itemLabel}>Pátio de origem</Text>
      <Text style={styles.itemValue}>Unidade de Guarulhos</Text>
    </View>
  </ScrollView>
);

const LocalizacaoTab = ({ patioVertices, motoPosition, userPosition }: { patioVertices: Vertice[]; motoPosition: { x: number; y: number }; userPosition: { x: number; y: number }; }) => {
  const allX = [...patioVertices.map(v => v.x), motoPosition.x, userPosition.x];
  const allY = [...patioVertices.map(v => v.y), motoPosition.y, userPosition.y];

  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);

  const padding = 15;
  const svgWidth = maxX - minX + padding * 2;
  const svgHeight = maxY - minY + padding * 2;

  const polygonPoints = patioVertices.map(v => `${v.x},${v.y}`).join(' ');

  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(1);
  const startScale = useSharedValue(1);
  const focalX = useSharedValue(0);
  const focalY = useSharedValue(0);
  const MIN_SCALE = 1;
  const MAX_SCALE = 4;
  const BOUNDS_X = 200;
  const BOUNDS_Y = 200;

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      let newX = translateX.value + event.translationX;
      let newY = translateY.value + event.translationY;

      newX = Math.max(-BOUNDS_X, Math.min(newX, BOUNDS_X));
      newY = Math.max(-BOUNDS_Y, Math.min(newY, BOUNDS_Y));

      translateX.value = newX;
      translateY.value = newY;
    })
    .onEnd(() => {
      translateX.value = withSpring(translateX.value);
      translateY.value = withSpring(translateY.value);
    });

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      startScale.value = scale.value;
    })
    .onUpdate((e) => {
      let newScale = startScale.value * e.scale;
      newScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
      scale.value = newScale;
      focalX.value = e.focalX;
      focalY.value = e.focalY;
    });

  const composedGesture = Gesture.Simultaneous(panGesture, pinchGesture);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { translateX: focalX.value },
      { translateY: focalY.value },
      { scale: scale.value },
      { translateX: -focalX.value },
      { translateY: -focalY.value },
    ],
  }));

  const sheetRef = useRef<BottomSheet>(null);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={{ flex: 1, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
        <GestureDetector gesture={composedGesture}>
          <Animated.View style={[styles.mapContainer, animatedStyle]}>
            <Svg width={svgWidth} height={svgHeight} style={{ backgroundColor: '#000' }}>
              <Polygon points={polygonPoints} fill="none" stroke="#007a18" strokeWidth={2} />
              {patioVertices.map((v, i) => {
                const next = patioVertices[(i + 1) % patioVertices.length];
                return <Line key={`${v.id}-${next.id}`} x1={v.x} y1={v.y} x2={next.x} y2={next.y} stroke="#007a18" strokeWidth={1} />;
              })}
              {patioVertices.map((v) => (
                <Circle key={v.id} cx={v.x} cy={v.y} r={6} fill="#007a18" />
              ))}
              <Circle cx={motoPosition.x} cy={motoPosition.y} r={4} fill="#10b981" />
              <PingCircle cx={motoPosition.x} cy={motoPosition.y} color="#10b981" maxRadius={10} />
              <SvgText x={motoPosition.x} y={motoPosition.y - 12} fontSize="14" fill="#10b981" fontWeight="bold" textAnchor="middle">Moto</SvgText>
              <Circle cx={userPosition.x} cy={userPosition.y} r={4} fill="#f59e0b" />
              <PingCircle cx={userPosition.x} cy={userPosition.y} color="#f59e0b" maxRadius={10} />
              <SvgText x={userPosition.x} y={userPosition.y - 12} fontSize="14" fill="#f59e0b" fontWeight="bold" textAnchor="middle">Você</SvgText>
            </Svg>
          </Animated.View>
        </GestureDetector>
        <BottomSheet ref={sheetRef} snapPoints={['15%', '30%']} backgroundStyle={{ backgroundColor: '#1a1a1a' }} handleIndicatorStyle={{ backgroundColor: '#444' }}>
          <BottomSheetView style={[styles.sheetContent, { minHeight: 100 }]}>
            <Text style={styles.mapTitle}>Conectado ao Pátio Guarulhos A</Text>
            <Text style={styles.mapLinkText}>Acessar Gerenciamento do Pátio</Text>
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
};

const MotoDetalhes: React.FC<MotoDetalhesProps> = ({ motos,patioVertices, motoPosition, userPosition, onDelete}) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'moto', title: 'Moto' },
    { key: 'usuario', title: 'Usuário' },
    { key: 'localizacao', title: 'Localização' },
  ]);
  const route = useRoute();
  const { idMoto } = route.params as { idMoto: number };
  const moto = motos.find((m) => m.idMoto === idMoto);

  if (!moto) {
    return <Text>Moto não encontrada</Text>;
  }

  const renderScene = SceneMap({
    moto: () => <MotoTab moto={moto} navigation={useNavigation()} onDelete={() => onDelete(moto.idMoto)} />,
    usuario: UsuarioAfiliadoTab,
    localizacao: () => <LocalizacaoTab patioVertices={patioVertices} motoPosition={motoPosition} userPosition={userPosition} />,
  });

  const navigation = useNavigation();

  return (
    <>
      <TouchableOpacity onPress={() => navigation.reset({
  index: 0,
  routes: [{ name: 'MotoList' as never }],
})} style={{ flexDirection: 'row', justifyContent: 'space-between',alignItems: 'center', padding: 16 }}>
        <Ionicons name="arrow-back" size={24} color="#f3f4f6" />
        <Text style={{ color: '#f3f4f6', fontSize: 16, marginLeft: 14, fontWeight: '600' }}>
          {moto.placaMoto}
        </Text>
        <View style={{ width: 40 }} />
      </TouchableOpacity>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={(props) => (
          <TabBar {...props} style={{ backgroundColor: '#121212' }} indicatorStyle={{ backgroundColor: '#3bf654' }} />
        )}
      />
    </>
  );
};

export default MotoDetalhes;

const styles = StyleSheet.create({
  awsCard: { backgroundColor: '#0b0b0b', flex: 1 },
  awsActionBtn: {
    width: 100,
    backgroundColor: '#1f1f1f',
    paddingVertical: 8,
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#1f1f1f',
    borderWidth: 2,
    borderRadius: 3,
    margin: 20,
  },
  awsActionText: { color: '#f9fafb', fontSize: 14, fontWeight: '800' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#f9fafb', marginBottom: 20 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  itemLabel: { color: '#9ca3af', fontSize: 14 },
  itemValue: { color: '#f3f4f6', fontSize: 16 },
  estadoContainer: { flexDirection: 'row', alignItems: 'center' },
  graficoBox: { flex: 1, alignItems: 'center' },
  mapContainer: { height: 'auto', backgroundColor: '#000000' },
  mapTitle: { color: '#eaeaea', fontWeight: 'bold', fontSize: 22, marginBottom: 20 },
  mapLinkText: { color: '#3b82f6', fontWeight: '600', fontSize: 14 },
  sheetContent: { padding: 20 },
  container: { flex: 1, backgroundColor: 'grey' },
  detalhesContainer: {
    backgroundColor: '#1f1f1f',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    marginTop: 10,
    padding: 20,
    paddingTop: 30,
    height: '100%',
  },
  ruler: {
    width: '100%',
    height: 1,
    backgroundColor: '#1f1f1f',
    marginVertical: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(10, 10, 10, 0)',
  },
  modalContent: {
    backgroundColor: '#1f1f1f',
    borderRadius: 6,
    alignItems: 'center',
    position: 'absolute',
    top: 220, 
    right: 20, 
    padding: 12,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    color: '#f9fafb',
    marginBottom: 20,
    fontWeight: 'bold',
    paddingVertical: 8,
  },
  modalButton: {
    paddingVertical: 8,
    padding: 4,
    borderRadius: 6,
  },
  modalButtonText: {
    color: '#f9fafb',
    fontWeight: '600',
  },  
});
1