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
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme, VictoryLabel } from 'victory-native';
import { Estados, Moto } from '../types/Moto';

interface MotoListProps {
  motos: Moto[];
  onCreateMoto: () => void;
  onMotoDetails: (idMoto: number) => void;
  toastRef: React.RefObject<ToastMessageRef | null>;
}

const MotoListDashboard: React.FC<MotoListProps> = ({ motos, onCreateMoto, onMotoDetails, toastRef }) => {
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);

  const filteredMotos = motos.filter((moto) =>
    moto.placaMoto.toLowerCase().includes(search.toLowerCase()) ||
    moto.modeloMoto.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor: Record<Estados, string> = {
    [Estados.NoPatio]: '#10b981',
    [Estados.Retirada]: '#3b82f6',
    [Estados.NaoDevolvida]: '#f59e0b',
    [Estados.NoPatioErrado]: '#ef4444',
  };

  const hours = Array.from({ length: 11 }, (_, i) => `${8 + i}:00`);

  const countByTimeAndStatus = (estado: Estados, time: string) => {
    return motos.filter((m) => m.estadoMoto === estado && m.hora === time).length;
  };

  const dataSeries = {
    [Estados.Retirada]: hours.map((time) => ({ x: time, y: countByTimeAndStatus(Estados.Retirada, time) })),
    [Estados.NoPatio]: hours.map((time) => ({ x: time, y: countByTimeAndStatus(Estados.NoPatio, time) })),
    [Estados.NoPatioErrado]: hours.map((time) => ({ x: time, y: countByTimeAndStatus(Estados.NoPatioErrado, time) })),
    [Estados.NaoDevolvida]: hours.map((time) => ({ x: time, y: countByTimeAndStatus(Estados.NaoDevolvida, time) })),
  };

  const dataTotal = hours.map((time) => ({
    x: time,
    y: motos.filter((m) => m.hora === time).length,
  }));
  const maxTotal = Math.max(...dataTotal.map((d) => d.y), 5);

  const handleCardPress = (estado: Estados) => {
    const firstMoto = filteredMotos.find((m) => m.estadoMoto === estado);
    if (firstMoto) {
      onMotoDetails(firstMoto.idMoto);
    } else {
      toastRef.current?.show("Sem motos", `Nenhuma moto com status ${estado}`, "warning");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Motos</Text>

      <View style={styles.dashboardRow}>
        {(Object.values(Estados) as Estados[]).map((estado) => (
          <TouchableOpacity
            key={estado}
            style={[styles.card, { backgroundColor: statusColor[estado] }]}
            onPress={() => handleCardPress(estado)}
          >
            <Text style={styles.cardLabel}>{estado}</Text>
            <Text style={styles.cardValue}>{filteredMotos.filter(m => m.estadoMoto === estado).length}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.chartContainer}>
        <VictoryChart theme={VictoryTheme.material} height={250}>
          <VictoryLabel
            text="Status por Horário Comercial"
            x={200}
            y={25}
            textAnchor="middle"
            style={{ fill: "#f3f4f6", fontSize: 16, fontWeight: "600" }}
          />
          <VictoryAxis
            tickValues={hours}
            tickFormat={hours}
            style={{
              axis: { stroke: '#f9fafb' },
              ticks: { stroke: '#f9fafb' },
              tickLabels: { fontSize: 10, fill: '#f9fafb' },
            }}
          />
          <VictoryAxis
            dependentAxis
            domain={[0, maxTotal]}
            style={{
              axis: { stroke: '#f9fafb' },
              ticks: { stroke: '#f9fafb' },
              tickLabels: { fontSize: 10, fill: '#f9fafb' },
            }}
          />
          {Object.entries(dataSeries).map(([key, data]) => (
            <VictoryLine
              key={key}
              data={data}
              style={{ data: { stroke: statusColor[key as Estados], strokeWidth: 3 } }}
            />
          ))}
        </VictoryChart>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Buscar por placa ou modelo"
        placeholderTextColor="#9ca3af"
        value={search}
        onChangeText={setSearch}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity
          style={styles.filtrosButton}
          onPress={() => {
            toastRef.current?.show("TODO", "Botão de editar widgets em progresso.", "warning");
          }}
        >
          <Ionicons name="filter" size={20} color="#f9fafb" />
          <Text style={styles.filtrosText}>Filtros</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createMotoButton}
          onPress={onCreateMoto}
        >
          <Ionicons name="add" size={20} color="#0c0c0c" />
          <Text style={styles.createMotoButtonText}>Lançar moto</Text>
        </TouchableOpacity>
      </View>

      {filteredMotos.slice(0, visibleCount).map((item) => (
        <TouchableOpacity key={item.placaMoto} onPress={() => onMotoDetails(item.idMoto)} style={styles.listItem}>
          <View>
            <Text style={styles.placa}>{item.placaMoto}</Text>
            <Text style={styles.modelo}>{item.modeloMoto}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Text style={[styles.status, { color: statusColor[item.estadoMoto] }]}>
              {item.estadoMoto.toUpperCase()}
            </Text>
            <Ionicons name="ellipse" size={10} color={statusColor[item.estadoMoto]} />
          </View>
        </TouchableOpacity>
      ))}

      {visibleCount < filteredMotos.length && (
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
          <Ionicons name="ellipsis-horizontal" size={20} color="#f9fafb" />
          <TouchableOpacity
            onPress={() => setVisibleCount((prev) => prev + 10)}
            style={styles.loadMoreButton}
          >
            <Text style={styles.loadMoreText}>Carregar mais</Text>
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
