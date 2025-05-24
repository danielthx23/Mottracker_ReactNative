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
import { VictoryChart, VictoryLine, VictoryAxis, VictoryTheme } from 'victory-native';

interface Moto {
  placa: string;
  modelo: string;
  status: 'pátio' | 'retirada' | 'manutenção';
  hora: string;
}

interface MotoListProps {
  motos: Moto[];
  onCreateMoto: () => void; // Função para criar nova moto
  onMotoDetails: (placa: string) => void; // Função para navegar para o detalhe da moto
  toastRef: React.RefObject<ToastMessageRef | null>;
}

const MotoListDashboard: React.FC<MotoListProps> = ({ motos, onCreateMoto, onMotoDetails, toastRef }) => {
  const [search, setSearch] = useState('');

  const filteredMotos = motos.filter((moto) =>
    moto.placa.toLowerCase().includes(search.toLowerCase()) ||
    moto.modelo.toLowerCase().includes(search.toLowerCase())
  );

  const statusColor = {
    pátio: '#10b981',
    retirada: '#3b82f6',
    manutenção: '#f59e0b',
  };

  const countByTimeAndStatus = (status: Moto['status'], time: string) => {
    return motos.filter((m) => m.status === status && m.hora === time).length;
  };

  // Gerar dados para o gráfico
  const hours = Array.from({ length: 11 }, (_, i) => `${8 + i}:00`); // Horários de 08:00 até 18:00

  // Prepara os dados para cada linha (status)
  const dataRetirada = hours.map((time) => ({
    x: time,
    y: countByTimeAndStatus('retirada', time),
  }));

  const dataPatio = hours.map((time) => ({
    x: time,
    y: countByTimeAndStatus('pátio', time),
  }));

  const dataManutencao = hours.map((time) => ({
    x: time,
    y: countByTimeAndStatus('manutenção', time),
  }));

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Motos</Text>

      <View style={styles.dashboardRow}>
        <View style={[styles.card, { backgroundColor: '#3b82f6' }]}>  
          <Text style={styles.cardLabel}>Retiradas</Text>
          <Text style={styles.cardValue}>{filteredMotos.filter(m => m.status === 'retirada').length}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#10b981' }]}>  
          <Text style={styles.cardLabel}>Em Pátio</Text>
          <Text style={styles.cardValue}>{filteredMotos.filter(m => m.status === 'pátio').length}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#f59e0b' }]}>  
          <Text style={styles.cardLabel}>Manutenção</Text>
          <Text style={styles.cardValue}>{filteredMotos.filter(m => m.status === 'manutenção').length}</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <VictoryChart theme={VictoryTheme.material} height={250}>
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
            style={{
              axis: { stroke: '#f9fafb' },
              ticks: { stroke: '#f9fafb' },
              tickLabels: { fontSize: 10, fill: '#f9fafb' },
            }}
          />
          <VictoryLine
            data={dataRetirada}
            style={{
              data: { stroke: '#3b82f6', strokeWidth: 3 },
              labels: { fill: '#f9fafb', fontSize: 8 },
            }}
          />
          <VictoryLine
            data={dataPatio}
            style={{
              data: { stroke: '#10b981', strokeWidth: 3 },
              labels: { fill: '#f9fafb', fontSize: 8 },
            }}
          />
          <VictoryLine
            data={dataManutencao}
            style={{
              data: { stroke: '#f59e0b', strokeWidth: 3 },
              labels: { fill: '#f9fafb', fontSize: 8 },
            }}
          />
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
        <TouchableOpacity style={styles.filtrosButton} onPress={() => {toastRef.current?.show("TODO", "Botão de editar widgets em progresso.", "warning");}}>
          <Ionicons name="ellipsis-vertical" size={20} color="#f9fafb" />
          <Text style={styles.filtrosText}>Filtros</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.createMotoButton} onPress={() => {toastRef.current?.show("TODO", "Botão de editar widgets em progresso.", "warning");}}>
          <Ionicons name="add" size={20} color="#0c0c0c" />
          <Text style={styles.createMotoButtonText}>Lançar moto</Text>
        </TouchableOpacity>
      </View>

      {filteredMotos.length > 0 ? (
        filteredMotos.map((item) => (
          <TouchableOpacity key={item.placa} onPress={() => onMotoDetails(item.placa)} style={styles.listItem}>
            <View>
              <Text style={styles.placa}>{item.placa}</Text>
              <Text style={styles.modelo}>{item.modelo}</Text>
            </View>
            <Text style={[styles.status, { color: statusColor[item.status] }]}> 
              {item.status.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.empty}>Nenhuma moto encontrada.</Text>
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
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
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
    justifyContent: 'center'
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
  empty: {
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 20,
  }
});
