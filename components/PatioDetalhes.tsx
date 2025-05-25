import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
  Pressable,
  FlatList
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { VictoryChart, VictoryTheme, VictoryArea, VictoryAxis } from 'victory-native';
import { ToastMessageRef } from './Toast';

interface Patio {
  idPatio: number;
  nomePatio: string;
  motosTotaisPatio: number;
  motosDisponiveisPatio: number;
  dataPatio: Date;
}

export enum Estados {
  Retirada = 'Retirada',
  NoPatio = 'No pátio',
  NoPatioErrado = 'No pátio errado',
  NaoDevolvida = 'Não devolvida',
}

export interface Moto {
  idMoto: number;
  placaMoto: string;
  modeloMoto: string;
  anoMoto: number;
  identificadorMoto?: string;
  quilometragemMoto: number;
  estadoMoto: Estados;
  condicoesMoto?: string;
  hora: string;
}

export type CameraStatus = 'Ativa' | 'Inativa' | 'Em manutenção';

export interface Camera {
  idCamera: number;
  nomeCamera: string;
  ipCamera?: string;
  status: CameraStatus;
  posX?: number;
  posY?: number;
}

interface PatioDetalhesProps {
  patio: Patio;
  patios: Patio[];
  onDelete: (idPatio: number) => void;
  onEdit: () => void;
  onBack: () => void;
  toastRef: React.RefObject<ToastMessageRef | null>;
  onNavigateToMoto: (idMoto: number) => void;
}

// Mock data para motos e câmeras
const mockMotos: Moto[] = [
  {
    idMoto: 1,
    placaMoto: 'ABC-1234',
    modeloMoto: 'Honda CG 160',
    anoMoto: 2022,
    identificadorMoto: 'HND001',
    quilometragemMoto: 15000,
    estadoMoto: Estados.NoPatio,
    condicoesMoto: 'Boa',
    hora: '14:30'
  },
  {
    idMoto: 2,
    placaMoto: 'DEF-5678',
    modeloMoto: 'Yamaha Factor 125',
    anoMoto: 2021,
    quilometragemMoto: 22000,
    estadoMoto: Estados.Retirada,
    hora: '16:45'
  },
  {
    idMoto: 3,
    placaMoto: 'GHI-9012',
    modeloMoto: 'Honda Biz 125',
    anoMoto: 2023,
    identificadorMoto: 'HND002',
    quilometragemMoto: 8000,
    estadoMoto: Estados.NoPatioErrado,
    condicoesMoto: 'Necessita revisão',
    hora: '12:15'
  },
  {
    idMoto: 4,
    placaMoto: 'JKL-3456',
    modeloMoto: 'Suzuki Intruder 125',
    anoMoto: 2020,
    quilometragemMoto: 31000,
    estadoMoto: Estados.NaoDevolvida,
    condicoesMoto: 'Regular',
    hora: '09:20'
  }
];

const mockCameras: Camera[] = [
  {
    idCamera: 1,
    nomeCamera: 'Entrada Principal',
    ipCamera: '192.168.1.101',
    status: 'Ativa',
    posX: 100,
    posY: 50
  },
  {
    idCamera: 2,
    nomeCamera: 'Área Central',
    ipCamera: '192.168.1.102',
    status: 'Ativa',
    posX: 200,
    posY: 150
  },
  {
    idCamera: 3,
    nomeCamera: 'Saída Lateral',
    ipCamera: '192.168.1.103',
    status: 'Em manutenção',
    posX: 300,
    posY: 100
  },
  {
    idCamera: 4,
    nomeCamera: 'Área de Estacionamento',
    status: 'Inativa',
    posX: 250,
    posY: 200
  }
];

const estadoColors = {
  [Estados.Retirada]: '#3b82f6',
  [Estados.NoPatio]: '#10b981',
  [Estados.NoPatioErrado]: '#ef4444',
  [Estados.NaoDevolvida]: '#f59e0b',
};

const cameraStatusColors = {
  'Ativa': '#10b981',
  'Inativa': '#ef4444',
  'Em manutenção': '#f59e0b',
};

const PatioTab = ({ patio, patios, onDelete, onEdit }: { patio: Patio; patios: Patio[]; onDelete: (id: number) => void; onEdit: () => void }) => {
  const ocupacao = patio.motosTotaisPatio > 0 
    ? Math.round(((patio.motosTotaisPatio - patio.motosDisponiveisPatio) / patio.motosTotaisPatio) * 100)
    : 0;

  const getOccupancyColor = (ocupacao: number) => {
    if (ocupacao >= 80) return '#ef4444';
    if (ocupacao >= 60) return '#f59e0b';
    if (ocupacao >= 30) return '#3b82f6';
    return '#10b981';
  };

  const getOccupancyStatus = (ocupacao: number) => {
    if (ocupacao >= 80) return 'CRÍTICA';
    if (ocupacao >= 60) return 'ALTA';
    if (ocupacao >= 30) return 'MÉDIA';
    return 'BAIXA';
  };

  const pieData = [
    { x: 'Ocupadas', y: patio.motosTotaisPatio - patio.motosDisponiveisPatio },
    { x: 'Disponíveis', y: patio.motosDisponiveisPatio }
  ];

  const historicoData = Array.from({ length: 7 }, (_, i) => {
    const dia = new Date();
    dia.setDate(dia.getDate() - (6 - i));
    return {
      x: dia.toLocaleDateString('pt-BR', { weekday: 'short' }),
      y: Math.floor(Math.random() * 40) + ocupacao - 20,
    };
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  const handleDelete = () => {
    setConfirmDeleteVisible(false);
    onDelete(patio.idPatio);
  };

  return (
    <ScrollView style={styles.tabContainer}>
      <View style={{ alignItems: 'flex-end', marginTop: 16 }}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.actionButton}
        >
          <Text style={styles.actionText}>Actions</Text>
          <Ionicons name="chevron-down" size={16} color="#f3f4f6" />
        </TouchableOpacity>
      </View>

      <View style={styles.mainInfo}>
        <Text style={styles.patioName}>{patio.nomePatio}</Text>
        <Text style={styles.patioId}>ID: #{patio.idPatio}</Text>
        <Text style={styles.patioDate}>
          Criado em: {patio.dataPatio.toLocaleDateString('pt-BR')}
        </Text>
      </View>

      <View style={styles.statusCards}>
        <View style={[styles.statusCard, { backgroundColor: '#3b82f6' }]}>
          <Text style={styles.cardLabel}>Capacidade</Text>
          <Text style={styles.cardValue}>{patio.motosTotaisPatio}</Text>
          <Ionicons name="business" size={24} color="#fff" />
        </View>

        <View style={[styles.statusCard, { backgroundColor: '#10b981' }]}>
          <Text style={styles.cardLabel}>Disponíveis</Text>
          <Text style={styles.cardValue}>{patio.motosDisponiveisPatio}</Text>
          <Ionicons name="checkmark-circle" size={24} color="#fff" />
        </View>

        <View style={[styles.statusCard, { backgroundColor: getOccupancyColor(ocupacao) }]}>
          <Text style={styles.cardLabel}>Ocupação</Text>
          <Text style={styles.cardValue}>{ocupacao}%</Text>
          <Text style={styles.cardStatus}>{getOccupancyStatus(ocupacao)}</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Ocupação - Últimos 7 Dias</Text>
        <VictoryChart theme={VictoryTheme.material} height={200} padding={{ left: 60, top: 20, right: 40, bottom: 40 }}>
          <VictoryAxis
            style={{
              axis: { stroke: '#f9fafb' },
              ticks: { stroke: '#f9fafb' },
              tickLabels: { fontSize: 12, fill: '#f9fafb' },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: '#f9fafb' },
              ticks: { stroke: '#f9fafb' },
              tickLabels: { fontSize: 12, fill: '#f9fafb' },
            }}
          />
          <VictoryArea
            data={historicoData}
            style={{
              data: { fill: '#3b82f6', fillOpacity: 0.6, stroke: '#3b82f6', strokeWidth: 2 }
            }}
          />
        </VictoryChart>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Comparação com Outros Pátios</Text>
        
        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Ranking por Capacidade:</Text>
          <Text style={styles.statValue}>
            #{[...patios].sort((a, b) => b.motosTotaisPatio - a.motosTotaisPatio)
              .findIndex(p => p.idPatio === patio.idPatio) + 1} de {patios.length}
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Ranking por Disponibilidade:</Text>
          <Text style={styles.statValue}>
            #{[...patios].sort((a, b) => b.motosDisponiveisPatio - a.motosDisponiveisPatio)
              .findIndex(p => p.idPatio === patio.idPatio) + 1} de {patios.length}
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={styles.statLabel}>Média de ocupação geral:</Text>
          <Text style={styles.statValue}>
            {Math.round(patios.reduce((acc, p) => 
              acc + (p.motosTotaisPatio > 0 ? ((p.motosTotaisPatio - p.motosDisponiveisPatio) / p.motosTotaisPatio) * 100 : 0), 0
            ) / patios.length)}%
          </Text>
        </View>
      </View>

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
                onEdit();
              }}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Editar pátio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setConfirmDeleteVisible(true);
              }}
              style={styles.modalButton}
            >
              <Text style={[styles.modalButtonText, { color: '#ff4d4d' }]}>Deletar pátio</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={confirmDeleteVisible}
        onRequestClose={() => setConfirmDeleteVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setConfirmDeleteVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={[styles.modalTitle, { fontSize: 16 }]}>Deseja realmente deletar este pátio?</Text>
            <TouchableOpacity
              onPress={handleDelete}
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
    </ScrollView>
  );
};

const MotosTab = ({ toastRef, onNavigateToMoto }: { toastRef: React.RefObject<ToastMessageRef | null>, onNavigateToMoto: (idMoto: number) => void; }) => {
  const renderMotoItem = ({ item }: { item: Moto }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{item.placaMoto}</Text>
        <View style={styles.statusContainer}>
          <Ionicons name="ellipse" size={12} color={estadoColors[item.estadoMoto]} />
          <Text style={[styles.statusText, { color: estadoColors[item.estadoMoto] }]}>
            {item.estadoMoto}
          </Text>
        </View>
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemSubtitle}>{item.modeloMoto} - {item.anoMoto}</Text>
        {item.identificadorMoto && (
          <Text style={styles.itemDetail}>ID: {item.identificadorMoto}</Text>
        )}
        <Text style={styles.itemDetail}>Quilometragem: {item.quilometragemMoto} km</Text>
        <Text style={styles.itemDetail}>Último registro: {item.hora}</Text>
        {item.condicoesMoto && (
          <Text style={styles.itemDetail}>Condições: {item.condicoesMoto}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.viewButton} 
      onPress={() => {
        toastRef.current?.show("TODO", "Os objetos não estão relacionados ainda então não condizem.", "warning");
        onNavigateToMoto(item.idMoto);
      }}>
        <Text style={styles.viewButtonText}>Ver detalhes</Text>
        <Ionicons name="chevron-forward" size={16} color="#3b82f6" />
      </TouchableOpacity>
    </View>
  );

  const estadosCount = mockMotos.reduce((acc, moto) => {
    acc[moto.estadoMoto] = (acc[moto.estadoMoto] || 0) + 1;
    return acc;
  }, {} as Record<Estados, number>);

  return (
    <ScrollView style={styles.tabContainer}>
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Resumo por Estado</Text>
        <View style={styles.summaryGrid}>
          {Object.entries(estadosCount).map(([estado, count]) => (
            <View key={estado} style={[styles.summaryCard, { borderLeftColor: estadoColors[estado as Estados] }]}>
              <Text style={styles.summaryCount}>{count}</Text>
              <Text style={styles.summaryLabel}>{estado}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Motos no Pátio ({mockMotos.length})</Text>
        <FlatList
          data={mockMotos}
          renderItem={renderMotoItem}
          keyExtractor={(item) => item.idMoto.toString()}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
};

const CamerasTab = ({ toastRef }: { toastRef: React.RefObject<ToastMessageRef | null> }) => {
  const renderCameraItem = ({ item }: { item: Camera }) => (
    <View style={styles.itemCard}>
      <View style={styles.itemHeader}>
        <Text style={styles.itemTitle}>{item.nomeCamera}</Text>
        <View style={styles.statusContainer}>
          <Ionicons name="ellipse" size={12} color={cameraStatusColors[item.status]} />
          <Text style={[styles.statusText, { color: cameraStatusColors[item.status] }]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemDetail}>ID: #{item.idCamera}</Text>
        {item.ipCamera && (
          <Text style={styles.itemDetail}>IP: {item.ipCamera}</Text>
        )}
        {item.posX !== undefined && item.posY !== undefined && (
          <Text style={styles.itemDetail}>Posição: X:{item.posX}, Y:{item.posY}</Text>
        )}
      </View>

      <View style={styles.cameraActions}>
        <TouchableOpacity style={[styles.cameraButton, { backgroundColor: item.status === 'Ativa' ? '#10b981' : '#6b7280' }]
      } onPress={() => toastRef.current?.show("TODO", "Funcionalidade de visualizar câmera em progresso.", "warning")}>
          <Ionicons name="videocam" size={16} color="#fff" />
          <Text style={styles.cameraButtonText}>
            {item.status === 'Ativa' ? 'Visualizar' : 'Indisponível'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.cameraButton}
        onPress={() => toastRef.current?.show("TODO", "Funcionalidade de configurar câmera em progresso.", "warning")}>
          <Ionicons name="settings" size={16} color="#fff" />
          <Text style={[styles.cameraButtonText, { color: '#fff' }]}>Configurar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const statusCount = mockCameras.reduce((acc, camera) => {
    acc[camera.status] = (acc[camera.status] || 0) + 1;
    return acc;
  }, {} as Record<CameraStatus, number>);

  return (
    <ScrollView style={styles.tabContainer}>
      <View style={styles.summaryContainer}>
        <Text style={styles.sectionTitle}>Status das Câmeras</Text>
        <View style={styles.summaryGrid}>
          {Object.entries(statusCount).map(([status, count]) => (
            <View key={status} style={[styles.summaryCard, { borderLeftColor: cameraStatusColors[status as CameraStatus] }]}>
              <Text style={styles.summaryCount}>{count}</Text>
              <Text style={styles.summaryLabel}>{status}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Câmeras Instaladas ({mockCameras.length})</Text>
        <FlatList
          data={mockCameras}
          renderItem={renderCameraItem}
          keyExtractor={(item) => item.idCamera.toString()}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <View style={styles.globalActions}>
        <TouchableOpacity style={styles.globalActionButton}
        onPress={() => toastRef.current?.show("TODO", "Funcionalidade de adicionar nova câmera em progresso.", "warning")}>
          <Ionicons name="add-circle" size={20} color="#10b981" />
          <Text style={[styles.globalActionText, { color: '#10b981' }]}>Adicionar Nova Câmera</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.globalActionButton}
        onPress={() => toastRef.current?.show("TODO", "Funcionalidade de visualização em grade em progresso.", "warning")}>
          <Ionicons name="grid" size={20} color="#3b82f6" />
          <Text style={[styles.globalActionText, { color: '#3b82f6' }]}>Visualização em Grade</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const PatioDetalhes: React.FC<PatioDetalhesProps> = ({
  patio,
  patios,
  onDelete,
  onEdit,
  onBack,
  toastRef,
  onNavigateToMoto
}) => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'patio', title: 'Pátio' },
    { key: 'motos', title: 'Motos' },
    { key: 'cameras', title: 'Câmeras' },
  ]);

  const renderScene = SceneMap({
    patio: () => <PatioTab patio={patio} patios={patios} onDelete={onDelete} onEdit={onEdit} />,
    motos: () => <MotosTab toastRef={toastRef} onNavigateToMoto={onNavigateToMoto} />,
    cameras: () => <CamerasTab toastRef={toastRef} />,
  });

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#f9fafb" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{patio.nomePatio}</Text>
        <View style={{ width: 40 }} />
      </View>

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={(props) => (
          <TabBar 
            {...props} 
            style={styles.tabBar} 
            indicatorStyle={styles.tabIndicator}
            activeColor="#3bf654"
            inactiveColor="#9ca3af"
          />
        )}
      />
    </View>
  );
};

export default PatioDetalhes;

const styles = StyleSheet.create({
    tabContainer: {
      flex: 1,
      backgroundColor: '#0b0b0b',
      paddingHorizontal: 16,
    },
    actionButton: {
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
    },
    actionText: {
      color: '#f9fafb', fontSize: 14, fontWeight: '800'
    },
    mainInfo: {
      marginBottom: 20,
      paddingHorizontal: 8,
    },
    patioName: {
      color: '#f9fafb',
      fontSize: 20,
      fontWeight: 'bold',
    },
    patioId: {
      color: '#d1d5db',
      fontSize: 14,
    },
    patioDate: {
      color: '#9ca3af',
      fontSize: 12,
    },
    statusCards: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 12,
    },
    statusCard: {
      flex: 1,
      padding: 12,
      borderRadius: 12,
      marginHorizontal: 4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardLabel: {
      color: '#e5e7eb',
      fontSize: 14,
    },
    cardValue: {
      color: '#fff',
      fontSize: 18,
      fontWeight: 'bold',
    },
    cardStatus: {
      color: '#fff',
      fontSize: 12,
      marginTop: 4,
    },
    chartContainer: {
      marginVertical: 16,
      alignItems: 'center',
      backgroundColor: '#1f1f1f',
      borderRadius: 12,
      padding: 16,
    },
    chartTitle: {
      color: '#f9fafb',
      fontSize: 16,
      marginBottom: 8,
    },
    statsContainer: {
      marginVertical: 16,
      padding: 16,
      backgroundColor: '#1f1f1f',
      borderRadius: 12,
    },
    sectionTitle: {
      color: '#f3f4f6',
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    statRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginVertical: 4,
    },
    statLabel: {
      color: '#d1d5db',
    },
    statValue: {
      color: '#f9fafb',
      fontWeight: 'bold',
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
      top: 225, 
      right: 16, 
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
    summaryContainer: {
      marginVertical: 16,
    },
    summaryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
    },
    summaryCard: {
      width: '48%',
      backgroundColor: '#0b0b0b',
      padding: 12,
      borderRadius: 8,
      marginBottom: 12,
      borderLeftWidth: 4,
    },
    summaryCount: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#f3f4f6',
    },
    summaryLabel: {
      fontSize: 14,
      color: '#d1d5db',
    },
    listContainer: {
      marginBottom: 16,
    },
    itemCard: {
      backgroundColor: '#1f1f1f',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
    },
    itemHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    },
    itemTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#f3f4f6',
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    statusText: {
      fontSize: 12,
      marginLeft: 4,
    },
    itemDetails: {
      marginTop: 4,
    },
    itemSubtitle: {
      color: '#d1d5db',
      fontSize: 14,
    },
    itemDetail: {
      fontSize: 12,
      color: '#9ca3af',
    },
    viewButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
    },
    viewButtonText: {
      fontSize: 14,
      color: '#3b82f6',
      marginRight: 4,
    },
    cameraActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 12,
    },
    cameraButton: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      backgroundColor: '#121212',
    },
    cameraButtonText: {
      marginLeft: 6,
      color: '#f9fafb',
      fontSize: 14,
    },
    globalActions: {
      marginTop: 0,
      alignItems: 'center',
      marginBottom: 20,
    },
    globalActionButton: {
      backgroundColor: '#121212',
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderRadius: 8,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },container: {
        flex: 1,
        backgroundColor: '#0b0b0b',
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
      },
      backButton: {
        padding: 8,
      },
      headerTitle: {
        color: '#f9fafb',
        fontSize: 18,
        fontWeight: 'bold',
      },
      tabBar: {
        backgroundColor: '#121212',
      },
      tabIndicator: {
        backgroundColor: '#3bf654',
        height: 3,
      },
      globalActionText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
        color: '#121212',
      },
  });
  