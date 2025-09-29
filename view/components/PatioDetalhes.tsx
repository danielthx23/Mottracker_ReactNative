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
import { useEstilos } from '../../hooks/useEstilos';

interface Patio {
  idPatio: number;
  nomePatio: string;
  motosTotaisPatio: number;
  motosDisponiveisPatio: number;
  dataPatio: Date;
  motosPatioAtual?: Moto[];
  camerasPatio?: Camera[];
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
  motoPatioAtualId?: number;
  motoPatioOrigemId?: number;
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
  patioId?: number;
}

interface PatioDetalhesProps {
  patio: Patio;
  patios: Patio[];
  motos: Moto[];
  cameras: Camera[];
  onDelete: (idPatio: number) => void;
  onEdit: () => void;
  onBack: () => void;
  toastRef: React.RefObject<ToastMessageRef | null>;
  onNavigateToMoto: (idMoto: number) => void;
}

// Dados reais serão passados via props

// Dados reais das câmeras serão passados via props

// Cores de estado serão definidas dinamicamente com o tema

// Função para mapear estado numérico para string
const getEstadoString = (estado: any): string => {
  if (typeof estado === 'number') {
    switch (estado) {
      case 1: return 'No pátio';
      case 2: return 'Retirada';
      case 3: return 'No pátio errado';
      case 4: return 'Não devolvida';
      default: return 'Desconhecido';
    }
  }
  return estado;
};

// Função para obter cor baseada no estado (numérico ou string)
const getStatusColor = (estado: any, cores: any): string => {
  if (typeof estado === 'number') {
    switch (estado) {
      case 1: return cores.sucesso; // No pátio - verde
      case 2: return cores.primaria; // Retirada - azul
      case 3: return cores.erro; // No pátio errado - vermelho
      case 4: return cores.aviso; // Não devolvida - amarelo
      default: return cores.textoSecundario; // Desconhecido - cinza
    }
  }
  // Para estados string, usar cores do tema
  switch (estado) {
    case 'No pátio': return cores.sucesso;
    case 'Retirada': return cores.primaria;
    case 'No pátio errado': return cores.erro;
    case 'Não devolvida': return cores.aviso;
    default: return cores.textoSecundario;
  }
};

// Função para obter cor do status da câmera
const getCameraStatusColor = (status: string, cores: any): string => {
  switch (status) {
    case 'Ativa': return cores.sucesso;
    case 'Inativa': return cores.erro;
    case 'Em manutenção': return cores.aviso;
    default: return cores.textoSecundario;
  }
};

const PatioTab = ({ patio, patios, onDelete, onEdit, cores }: { patio: Patio; patios: Patio[]; onDelete: (id: number) => void; onEdit: () => void; cores: any }) => {
  const ocupacao = patio.motosTotaisPatio > 0 
    ? Math.round(((patio.motosTotaisPatio - patio.motosDisponiveisPatio) / patio.motosTotaisPatio) * 100)
    : 0;

  const getOccupancyColor = (ocupacao: number, cores: any) => {
    if (ocupacao >= 80) return cores.erro;
    if (ocupacao >= 60) return cores.aviso;
    if (ocupacao >= 30) return cores.primaria;
    return cores.sucesso;
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

  // Dados reais do histórico serão calculados baseados nos dados reais
  const historicoData = [
    { x: 'Seg', y: patio.motosDisponiveisPatio },
    { x: 'Ter', y: patio.motosDisponiveisPatio },
    { x: 'Qua', y: patio.motosDisponiveisPatio },
    { x: 'Qui', y: patio.motosDisponiveisPatio },
    { x: 'Sex', y: patio.motosDisponiveisPatio },
    { x: 'Sáb', y: patio.motosDisponiveisPatio },
    { x: 'Dom', y: patio.motosDisponiveisPatio }
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);

  const handleDelete = () => {
    setConfirmDeleteVisible(false);
    onDelete(patio.idPatio);
  };

  return (
    <ScrollView style={[styles.tabContainer, { backgroundColor: cores.fundo }]}>
      <View style={{ alignItems: 'flex-end', marginTop: 16 }}>
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={[styles.actionButton, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}
        >
          <Text style={[styles.actionText, { color: cores.texto }]}>Actions</Text>
          <Ionicons name="chevron-down" size={16} color={cores.texto} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainInfo}>
        <Text style={[styles.patioName, { color: cores.texto }]}>{patio.nomePatio}</Text>
        <Text style={[styles.patioId, { color: cores.textoSecundario }]}>ID: #{patio.idPatio}</Text>
        <Text style={[styles.patioDate, { color: cores.textoSecundario }]}>
          Criado em: {patio.dataPatio.toLocaleDateString('pt-BR')}
        </Text>
      </View>

      <View style={styles.statusCards}>
        <View style={[styles.statusCard, { backgroundColor: cores.primaria }]}>
          <Text style={[styles.cardLabel, { color: cores.textoInvertido }]}>Capacidade</Text>
          <Text style={[styles.cardValue, { color: cores.textoInvertido }]}>{patio.motosTotaisPatio}</Text>
          <Ionicons name="business" size={24} color={cores.textoInvertido} />
        </View>

        <View style={[styles.statusCard, { backgroundColor: cores.sucesso }]}>
          <Text style={[styles.cardLabel, { color: cores.textoInvertido }]}>Disponíveis</Text>
          <Text style={[styles.cardValue, { color: cores.textoInvertido }]}>{patio.motosDisponiveisPatio}</Text>
          <Ionicons name="checkmark-circle" size={24} color={cores.textoInvertido} />
        </View>

        <View style={[styles.statusCard, { backgroundColor: getOccupancyColor(ocupacao, cores) }]}>
          <Text style={[styles.cardLabel, { color: cores.textoInvertido }]}>Ocupação</Text>
          <Text style={[styles.cardValue, { color: cores.textoInvertido }]}>{ocupacao}%</Text>
          <Text style={[styles.cardStatus, { color: cores.textoInvertido }]}>{getOccupancyStatus(ocupacao)}</Text>
        </View>
      </View>

      <View style={[styles.chartContainer, { backgroundColor: cores.fundoCard }]}>
        <Text style={[styles.chartTitle, { color: cores.texto }]}>Ocupação - Últimos 7 Dias</Text>
        <VictoryChart theme={VictoryTheme.material} height={200} padding={{ left: 60, top: 20, right: 40, bottom: 40 }}>
          <VictoryAxis
            style={{
              axis: { stroke: cores.texto },
              ticks: { stroke: cores.texto },
              tickLabels: { fontSize: 12, fill: cores.texto },
            }}
          />
          <VictoryAxis
            dependentAxis
            style={{
              axis: { stroke: cores.texto },
              ticks: { stroke: cores.texto },
              tickLabels: { fontSize: 12, fill: cores.texto },
            }}
          />
          <VictoryArea
            data={historicoData}
            style={{
              data: { fill: cores.primaria, fillOpacity: 0.6, stroke: cores.primaria, strokeWidth: 2 }
            }}
          />
        </VictoryChart>
      </View>

      <View style={[styles.statsContainer, { backgroundColor: cores.fundoCard }]}>
        <Text style={[styles.sectionTitle, { color: cores.texto }]}>Comparação com Outros Pátios</Text>
        
        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: cores.textoSecundario }]}>Ranking por Capacidade:</Text>
          <Text style={[styles.statValue, { color: cores.texto }]}>
            #{[...patios].sort((a, b) => b.motosTotaisPatio - a.motosTotaisPatio)
              .findIndex(p => p.idPatio === patio.idPatio) + 1} de {patios.length}
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: cores.textoSecundario }]}>Ranking por Disponibilidade:</Text>
          <Text style={[styles.statValue, { color: cores.texto }]}>
            #{[...patios].sort((a, b) => b.motosDisponiveisPatio - a.motosDisponiveisPatio)
              .findIndex(p => p.idPatio === patio.idPatio) + 1} de {patios.length}
          </Text>
        </View>

        <View style={styles.statRow}>
          <Text style={[styles.statLabel, { color: cores.textoSecundario }]}>Média de ocupação geral:</Text>
          <Text style={[styles.statValue, { color: cores.texto }]}>
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
          <View style={[styles.modalContent, { backgroundColor: cores.fundoCard }]}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                onEdit();
              }}
              style={styles.modalButton}
            >
              <Text style={[styles.modalButtonText, { color: cores.texto }]}>Editar pátio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                setConfirmDeleteVisible(true);
              }}
              style={styles.modalButton}
            >
              <Text style={[styles.modalButtonText, { color: cores.erro }]}>Deletar pátio</Text>
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
          <View style={[styles.modalContent, { backgroundColor: cores.fundoCard }]}>
            <Text style={[styles.modalTitle, { fontSize: 16, color: cores.texto }]}>Deseja realmente deletar este pátio?</Text>
            <TouchableOpacity
              onPress={handleDelete}
              style={styles.modalButton}
            >
              <Text style={[styles.modalButtonText, { color: cores.erro }]}>Confirmar deleção</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setConfirmDeleteVisible(false)} style={styles.modalButton}>
              <Text style={[styles.modalButtonText, { color: cores.textoSecundario }]}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </ScrollView>
  );
};

const MotosTab = ({ motos, patio, toastRef, onNavigateToMoto, cores }: { motos: Moto[], patio: Patio, toastRef: React.RefObject<ToastMessageRef | null>, onNavigateToMoto: (idMoto: number) => void, cores: any }) => {
  // Usar motos que vêm diretamente do pátio
  const motosDoPatio = patio.motosPatioAtual || [];
  
  const renderMotoItem = ({ item }: { item: Moto }) => (
    <View style={[styles.itemCard, { backgroundColor: cores.fundoCard }]}>
      <View style={styles.itemHeader}>
        <Text style={[styles.itemTitle, { color: cores.texto }]}>{item.placaMoto}</Text>
        <View style={styles.statusContainer}>
          <Ionicons name="ellipse" size={12} color={getStatusColor(item.estadoMoto, cores)} />
          <Text style={[styles.statusText, { color: getStatusColor(item.estadoMoto, cores) }]}>
            {getEstadoString(item.estadoMoto)}
          </Text>
        </View>
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={[styles.itemSubtitle, { color: cores.textoSecundario }]}>{item.modeloMoto} - {item.anoMoto}</Text>
        {item.identificadorMoto && (
          <Text style={[styles.itemDetail, { color: cores.textoSecundario }]}>ID: {item.identificadorMoto}</Text>
        )}
        <Text style={[styles.itemDetail, { color: cores.textoSecundario }]}>Quilometragem: {item.quilometragemMoto} km</Text>
        <Text style={[styles.itemDetail, { color: cores.textoSecundario }]}>Último registro: {item.hora}</Text>
        {item.condicoesMoto && (
          <Text style={[styles.itemDetail, { color: cores.textoSecundario }]}>Condições: {item.condicoesMoto}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.viewButton} 
      onPress={() => {
        toastRef.current?.show("TODO", "Os objetos não estão relacionados ainda então não condizem.", "warning");
        onNavigateToMoto(item.idMoto);
      }}>
        <Text style={[styles.viewButtonText, { color: cores.primaria }]}>Ver detalhes</Text>
        <Ionicons name="chevron-forward" size={16} color={cores.primaria} />
      </TouchableOpacity>
    </View>
  );

  const estadosCount = motosDoPatio.reduce((acc: Record<Estados, number>, moto: Moto) => {
    acc[moto.estadoMoto] = (acc[moto.estadoMoto] || 0) + 1;
    return acc;
  }, {} as Record<Estados, number>);

  return (
    <ScrollView style={[styles.tabContainer, { backgroundColor: cores.fundo }]}>
      <View style={styles.summaryContainer}>
        <Text style={[styles.sectionTitle, { color: cores.texto }]}>Resumo por Estado</Text>
        <View style={styles.summaryGrid}>
          {Object.entries(estadosCount).map(([estado, count]: [string, number]) => (
            <View key={estado} style={[styles.summaryCard, { backgroundColor: cores.fundoCard, borderLeftColor: getStatusColor(estado, cores) }]}>
              <Text style={[styles.summaryCount, { color: cores.texto }]}>{count}</Text>
              <Text style={[styles.summaryLabel, { color: cores.textoSecundario }]}>{estado}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.listContainer}>
        <Text style={[styles.sectionTitle, { color: cores.texto }]}>Motos no Pátio ({motosDoPatio.length})</Text>
        {motosDoPatio.length > 0 ? (
        <FlatList
            data={motosDoPatio}
          renderItem={renderMotoItem}
          keyExtractor={(item) => item.idMoto.toString()}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="bicycle" size={48} color={cores.textoSecundario} />
            <Text style={[styles.emptyText, { color: cores.textoSecundario }]}>Nenhuma moto encontrada neste pátio</Text>
            <Text style={[styles.emptySubtext, { color: cores.textoSecundario }]}>
              As motos aparecerão aqui quando estiverem associadas a este pátio
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const CamerasTab = ({ cameras, patio, toastRef, cores }: { cameras: Camera[], patio: Patio, toastRef: React.RefObject<ToastMessageRef | null>, cores: any }) => {
  // Usar câmeras que vêm diretamente do pátio
  const camerasDoPatio = patio.camerasPatio || [];
  
  const renderCameraItem = ({ item }: { item: Camera }) => (
    <View style={[styles.itemCard, { backgroundColor: cores.fundoCard }]}>
      <View style={styles.itemHeader}>
        <Text style={[styles.itemTitle, { color: cores.texto }]}>{item.nomeCamera}</Text>
        <View style={styles.statusContainer}>
          <Ionicons name="ellipse" size={12} color={getCameraStatusColor(item.status, cores)} />
          <Text style={[styles.statusText, { color: getCameraStatusColor(item.status, cores) }]}>
            {item.status}
          </Text>
        </View>
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={[styles.itemDetail, { color: cores.textoSecundario }]}>ID: #{item.idCamera}</Text>
        {item.ipCamera && (
          <Text style={[styles.itemDetail, { color: cores.textoSecundario }]}>IP: {item.ipCamera}</Text>
        )}
        {item.posX !== undefined && item.posY !== undefined && (
          <Text style={[styles.itemDetail, { color: cores.textoSecundario }]}>Posição: X:{item.posX}, Y:{item.posY}</Text>
        )}
      </View>

      <View style={styles.cameraActions}>
        <TouchableOpacity style={[styles.cameraButton, { backgroundColor: item.status === 'Ativa' ? cores.sucesso : cores.textoSecundario }]
      } onPress={() => toastRef.current?.show("TODO", "Funcionalidade de visualizar câmera em progresso.", "warning")}>
          <Ionicons name="videocam" size={16} color={cores.textoInvertido} />
          <Text style={[styles.cameraButtonText, { color: cores.textoInvertido }]}>
            {item.status === 'Ativa' ? 'Visualizar' : 'Indisponível'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.cameraButton, { backgroundColor: cores.primaria }]}
        onPress={() => toastRef.current?.show("TODO", "Funcionalidade de configurar câmera em progresso.", "warning")}>
          <Ionicons name="settings" size={16} color={cores.textoInvertido} />
          <Text style={[styles.cameraButtonText, { color: cores.textoInvertido }]}>Configurar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const statusCount = camerasDoPatio.reduce((acc: Record<CameraStatus, number>, camera: Camera) => {
    acc[camera.status] = (acc[camera.status] || 0) + 1;
    return acc;
  }, {} as Record<CameraStatus, number>);

  return (
    <ScrollView style={[styles.tabContainer, { backgroundColor: cores.fundo }]}>
      <View style={styles.summaryContainer}>
        <Text style={[styles.sectionTitle, { color: cores.texto }]}>Status das Câmeras</Text>
        <View style={styles.summaryGrid}>
          {Object.entries(statusCount).map(([status, count]: [string, number]) => (
            <View key={status} style={[styles.summaryCard, { backgroundColor: cores.fundoCard, borderLeftColor: getCameraStatusColor(status, cores) }]}>
              <Text style={[styles.summaryCount, { color: cores.texto }]}>{count}</Text>
              <Text style={[styles.summaryLabel, { color: cores.textoSecundario }]}>{status}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.listContainer}>
        <Text style={[styles.sectionTitle, { color: cores.texto }]}>Câmeras Instaladas ({camerasDoPatio.length})</Text>
        {camerasDoPatio.length > 0 ? (
        <FlatList
            data={camerasDoPatio}
          renderItem={renderCameraItem}
          keyExtractor={(item) => item.idCamera.toString()}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
        />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="videocam" size={48} color={cores.textoSecundario} />
            <Text style={[styles.emptyText, { color: cores.textoSecundario }]}>Nenhuma câmera encontrada neste pátio</Text>
            <Text style={[styles.emptySubtext, { color: cores.textoSecundario }]}>
              As câmeras aparecerão aqui quando estiverem associadas a este pátio
            </Text>
          </View>
        )}
      </View>

      <View style={styles.globalActions}>
        <TouchableOpacity style={[styles.globalActionButton, { backgroundColor: cores.fundoCard }]}
        onPress={() => toastRef.current?.show("TODO", "Funcionalidade de adicionar nova câmera em progresso.", "warning")}>
          <Ionicons name="add-circle" size={20} color={cores.sucesso} />
          <Text style={[styles.globalActionText, { color: cores.sucesso }]}>Adicionar Nova Câmera</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.globalActionButton, { backgroundColor: cores.fundoCard }]}
        onPress={() => toastRef.current?.show("TODO", "Funcionalidade de visualização em grade em progresso.", "warning")}>
          <Ionicons name="grid" size={20} color={cores.primaria} />
          <Text style={[styles.globalActionText, { color: cores.primaria }]}>Visualização em Grade</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const PatioDetalhes: React.FC<PatioDetalhesProps> = ({ 
  patio, 
  patios, 
  motos,
  cameras,
  onDelete, 
  onEdit, 
  onBack, 
  toastRef, 
  onNavigateToMoto 
}) => {
  const { cores } = useEstilos();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'patio', title: 'Pátio' },
    { key: 'motos', title: 'Motos' },
    { key: 'cameras', title: 'Câmeras' },
  ]);

  const renderScene = SceneMap({
    patio: () => <PatioTab patio={patio} patios={patios} onDelete={onDelete} onEdit={onEdit} cores={cores} />,
    motos: () => <MotosTab motos={motos} patio={patio} toastRef={toastRef} onNavigateToMoto={onNavigateToMoto} cores={cores} />,
    cameras: () => <CamerasTab cameras={cameras} patio={patio} toastRef={toastRef} cores={cores} />,
  });

  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>

      <View style={[styles.header, { backgroundColor: cores.fundoCard }]}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={cores.texto} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: cores.texto }]}>{patio.nomePatio}</Text>
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
            style={[styles.tabBar, { backgroundColor: cores.fundoCard }]} 
            indicatorStyle={[styles.tabIndicator, { backgroundColor: cores.sucesso }]}
            activeColor={cores.sucesso}
            inactiveColor={cores.textoSecundario}
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
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 48,
      paddingHorizontal: 24,
    },
    emptyText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#9ca3af',
      marginTop: 16,
      textAlign: 'center',
    },
    emptySubtext: {
      fontSize: 14,
      color: '#6b7280',
      marginTop: 8,
      textAlign: 'center',
      lineHeight: 20,
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
  