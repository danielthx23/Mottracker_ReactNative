import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ToastMessageRef } from './Toast';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryLabel, VictoryBar } from 'victory-native';
import { Estados, Moto } from '../../model/Moto';
import { useEstilos } from '../../hooks/useEstilos';

interface MotoListProps {
  motos: Moto[];
  onCreateMoto: () => void;
  onMotoDetails: (idMoto: number) => void;
  toastRef: React.RefObject<ToastMessageRef | null>;
}

const MotoListDashboard: React.FC<MotoListProps> = ({ motos, onCreateMoto, onMotoDetails, toastRef }) => {
  const { cores } = useEstilos();
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);


  const filteredMotos = motos.filter((moto) =>
    moto.placaMoto.toLowerCase().includes(search.toLowerCase()) ||
    moto.modeloMoto.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (estado: Estados) => {
    switch (estado) {
      case Estados.NoPatio:
        return '#10b981'; // Verde vibrante
      case Estados.Retirada:
        return '#3b82f6'; // Azul vibrante
      case Estados.NaoDevolvida:
        return '#f59e0b'; // Amarelo vibrante
      case Estados.NoPatioErrado:
        return '#ef4444'; // Vermelho vibrante
      default:
        return cores.texto;
    }
  };

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

  // Dados para o gráfico - distribuição por status
  const statusData = [
    { x: 'Retirada', y: motos.filter(m => {
      const estadoMoto = typeof m.estadoMoto === 'number' ? getEstadoString(m.estadoMoto) : m.estadoMoto;
      return estadoMoto === Estados.Retirada;
    }).length },
    { x: 'No pátio', y: motos.filter(m => {
      const estadoMoto = typeof m.estadoMoto === 'number' ? getEstadoString(m.estadoMoto) : m.estadoMoto;
      return estadoMoto === Estados.NoPatio;
    }).length },
    { x: 'No pátio errado', y: motos.filter(m => {
      const estadoMoto = typeof m.estadoMoto === 'number' ? getEstadoString(m.estadoMoto) : m.estadoMoto;
      return estadoMoto === Estados.NoPatioErrado;
    }).length },
    { x: 'Não devolvida', y: motos.filter(m => {
      const estadoMoto = typeof m.estadoMoto === 'number' ? getEstadoString(m.estadoMoto) : m.estadoMoto;
      return estadoMoto === Estados.NaoDevolvida;
    }).length }
  ];

  const maxTotal = Math.max(...statusData.map((d) => d.y), 1);

  const handleCardPress = (estado: Estados) => {
    const firstMoto = filteredMotos.find((m) => m.estadoMoto === estado);
    if (firstMoto) {
      onMotoDetails(firstMoto.idMoto);
    } else {
      toastRef.current?.show("Sem motos", `Nenhuma moto com status ${estado}`, "warning");
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: cores.fundo }]}>
      <Text style={[styles.title, { color: cores.texto }]}>Motos</Text>

      <View style={styles.dashboardRow}>
        {(Object.values(Estados) as Estados[]).map((estado) => (
          <TouchableOpacity
            key={estado}
            style={[styles.card, { backgroundColor: getStatusColor(estado) }]}
            onPress={() => handleCardPress(estado)}
          >
            <Text style={[styles.cardLabel, { color: cores.textoInvertido }]}>{estado}</Text>
            <Text style={[styles.cardValue, { color: cores.textoInvertido }]}>{filteredMotos.filter(m => {
              const estadoMoto = typeof m.estadoMoto === 'number' ? getEstadoString(m.estadoMoto) : m.estadoMoto;
              return estadoMoto === estado;
            }).length}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[styles.chartContainer, { borderTopColor: cores.borda, borderBottomColor: cores.borda }]}>
        <VictoryChart theme={VictoryTheme.material} height={250}>
          <VictoryLabel
            text="Distribuição por Status"
            x={200}
            y={25}
            textAnchor="middle"
            style={{ fill: cores.texto, fontSize: 16, fontWeight: "600" }}
          />
          <VictoryAxis
            style={{
              axis: { stroke: cores.texto },
              ticks: { stroke: cores.texto },
              tickLabels: { fontSize: 10, fill: cores.texto },
            }}
          />
          <VictoryAxis
            dependentAxis
            domain={[0, maxTotal]}
            style={{
              axis: { stroke: cores.texto },
              ticks: { stroke: cores.texto },
              tickLabels: { fontSize: 10, fill: cores.texto },
            }}
          />
          {statusData.map((status, index) => (
            <VictoryBar
              key={status.x}
              data={[status]}
              style={{
                data: { 
                  fill: (() => {
                    switch(status.x) {
                      case 'Retirada': return '#3b82f6'; // Azul
                      case 'No pátio': return '#10b981'; // Verde
                      case 'No pátio errado': return '#ef4444'; // Vermelho
                      case 'Não devolvida': return '#f59e0b'; // Amarelo
                      default: return cores.texto;
                    }
                  })()
                }
              }}
              barRatio={0.8}
            />
          ))}
        </VictoryChart>
      </View>

      <TextInput
        style={[styles.searchBar, { backgroundColor: cores.fundoCard, borderBottomColor: cores.borda, color: cores.texto }]}
        placeholder="Buscar por placa ou modelo"
        placeholderTextColor={cores.textoSecundario}
        value={search}
        onChangeText={setSearch}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity
          style={[styles.filtrosButton, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}
          onPress={() => {
            toastRef.current?.show("TODO", "Botão de editar widgets em progresso.", "warning");
          }}
        >
          <Ionicons name="filter" size={20} color={cores.texto} />
          <Text style={[styles.filtrosText, { color: cores.texto }]}>Filtros</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.createMotoButton, { backgroundColor: cores.sucesso }]}
          onPress={onCreateMoto}
        >
          <Ionicons name="add" size={20} color={cores.textoInvertido} />
          <Text style={[styles.createMotoButtonText, { color: cores.textoInvertido }]}>Lançar moto</Text>
        </TouchableOpacity>
      </View>

      {filteredMotos.slice(0, visibleCount).map((item, index) => (
        <TouchableOpacity key={`${item.idMoto}-${index}`} onPress={() => onMotoDetails(item.idMoto)} style={[styles.listItem, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}>
          <View>
            <Text style={[styles.placa, { color: cores.texto }]}>{item.placaMoto}</Text>
            <Text style={[styles.modelo, { color: cores.textoSecundario }]}>{item.modeloMoto}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Text style={[styles.status, { color: getStatusColor(getEstadoString(item.estadoMoto) as Estados) }]}>
              {getEstadoString(item.estadoMoto).toUpperCase()}
            </Text>
            <Ionicons name="ellipse" size={10} color={getStatusColor(getEstadoString(item.estadoMoto) as Estados)} />
          </View>
        </TouchableOpacity>
      ))}

      {visibleCount < filteredMotos.length && (
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
          <Ionicons name="ellipsis-horizontal" size={20} color={cores.texto} />
          <TouchableOpacity
            onPress={() => setVisibleCount((prev) => prev + 10)}
            style={[styles.loadMoreButton, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}
          >
            <Text style={[styles.loadMoreText, { color: cores.texto }]}>Carregar mais</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};

export default MotoListDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#e5e7eb',
    marginBottom: 20,
  },
  dashboardRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    flexBasis: '48%',
    padding: 12,
    marginVertical: 6,
    borderRadius: 6,
  },
  cardLabel: {
    color: '#f9fafb',
    fontSize: 14,
    marginBottom: 4,
  },
  cardValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchBar: {
    borderBottomColor: '#1f2937',
    borderBottomWidth: 1,
    color: '#fff',
    padding: 10,
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#1f1f1f',
    borderBottomWidth: 2,
    borderTopWidth: 2,
    marginBottom: 10,
    marginTop: 20,
  },
  filtrosButton: {
    width: 100,
    backgroundColor: '#1f1f1f',
    paddingVertical: 12,
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderColor: "#1f1f1f",
    borderWidth: 2,
  },
  filtrosText: {
    color: '#f9fafb',
    fontSize: 16,
    fontWeight: '800',
  },
  createMotoButton: {
    width: 150,
    marginLeft: 'auto',
    backgroundColor: '#41bf4c',
    paddingVertical: 12,
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderColor: "#013400",
    borderWidth: 1,
  },
  createMotoButtonText: {
    color: '#0c0c0c',
    fontSize: 16,
    fontWeight: '800',
  },
  listItem: {
    backgroundColor: '#1f1f1f',
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  placa: {
    color: '#f3f4f6',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modelo: {
    color: '#9ca3af',
    fontSize: 14,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  loadMoreButton: {
    width: '100%',
    backgroundColor: '#1f1f1f',
    paddingVertical: 12,
    gap: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 50,
    borderColor: "#1f1f1f",
    borderWidth: 2,
  },
  loadMoreText: {
    color: '#f9fafb',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
