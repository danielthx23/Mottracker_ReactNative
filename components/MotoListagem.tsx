import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native';

interface Moto {
  placa: string;
  modelo: string;
  status: 'pátio' | 'retirada' | 'manutenção';
}

interface MotoListProps {
  motos: Moto[];
}

const MotoListDashboard: React.FC<MotoListProps> = ({ motos }) => {
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

  const countByStatus = (status: Moto['status']) =>
    motos.filter((m) => m.status === status).length;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard Motos</Text>

      <View style={styles.dashboardRow}>
        <View style={[styles.card, { backgroundColor: '#3b82f6' }]}>  
          <Text style={styles.cardLabel}>Retiradas</Text>
          <Text style={styles.cardValue}>{countByStatus('retirada')}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#10b981' }]}>  
          <Text style={styles.cardLabel}>Em Pátio</Text>
          <Text style={styles.cardValue}>{countByStatus('pátio')}</Text>
        </View>
        <View style={[styles.card, { backgroundColor: '#f59e0b' }]}>  
          <Text style={styles.cardLabel}>Manutenção</Text>
          <Text style={styles.cardValue}>{countByStatus('manutenção')}</Text>
        </View>
      </View>

      <TextInput
        style={styles.searchBar}
        placeholder="Buscar por placa ou modelo"
        placeholderTextColor="#9ca3af"
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredMotos}
        keyExtractor={(item) => item.placa}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <View>
              <Text style={styles.placa}>{item.placa}</Text>
              <Text style={styles.modelo}>{item.modelo}</Text>
            </View>
            <Text style={[styles.status, { color: statusColor[item.status] }]}> 
              {item.status.toUpperCase()}
            </Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>Nenhuma moto encontrada.</Text>}
        style={styles.list}
      />
    </ScrollView>
  );
};

export default MotoListDashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    padding: 16,
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
    marginBottom: 20,
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
    backgroundColor: '#1f2937',
    color: '#fff',
    padding: 10,
    borderRadius: 6,
    marginBottom: 20,
  },
  list: {
    paddingBottom: 100,
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
