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
import { useEstilos } from '../../hooks/useEstilos';

interface Patio {
  idPatio: number;
  nomePatio: string;
  motosTotaisPatio: number;
  motosDisponiveisPatio: number;
  dataPatio: Date;
}

interface PatioListProps {
  patios: Patio[];
  onCreatePatio: () => void;
  onPatioDetails: (idPatio: number) => void;
  toastRef: React.RefObject<ToastMessageRef | null>;
}

const PatioListDashboard: React.FC<PatioListProps> = ({ 
  patios, 
  onCreatePatio, 
  onPatioDetails, 
  toastRef 
}) => {
  const { cores } = useEstilos();
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);

  const filteredPatios = patios.filter((patio) =>
    patio.nomePatio.toLowerCase().includes(search.toLowerCase())
  );


  // Cálculos para o dashboard
  const totalPatios = filteredPatios.length;
  const totalMotos = filteredPatios.reduce((sum, patio) => sum + patio.motosTotaisPatio, 0);
  const totalDisponiveis = filteredPatios.reduce((sum, patio) => sum + patio.motosDisponiveisPatio, 0);
  const totalOcupadas = totalMotos - totalDisponiveis;
  const taxaOcupacao = totalMotos > 0 ? Math.round((totalOcupadas / totalMotos) * 100) : 0;

  // Dados para o gráfico - Top 8 pátios únicos (removendo duplicatas)
  const uniquePatios = filteredPatios.filter((patio, index, self) => 
    index === self.findIndex(p => p.idPatio === patio.idPatio)
  );
  
  const topPatios = [...uniquePatios]
    .sort((a, b) => b.motosTotaisPatio - a.motosTotaisPatio)
    .slice(0, Math.min(8, uniquePatios.length));


  const chartData = topPatios.map(patio => ({
    x: patio.nomePatio.length > 5 ? `${patio.nomePatio}` : patio.nomePatio,
    y: patio.motosTotaisPatio,
    disponivel: patio.motosDisponiveisPatio
  }));

  const maxMotos = Math.max(...topPatios.map(p => p.motosTotaisPatio), 5);

  const getOccupancyColor = (patio: Patio) => {
    const ocupacao = patio.motosTotaisPatio > 0 
      ? (patio.motosTotaisPatio - patio.motosDisponiveisPatio) / patio.motosTotaisPatio 
      : 0;
    
    if (ocupacao >= 0.8) return '#ef4444'; // Vermelho - alta ocupação
    if (ocupacao >= 0.6) return '#f59e0b'; // Amarelo - média ocupação
    if (ocupacao >= 0.3) return '#3b82f6'; // Azul - baixa ocupação
    return '#10b981'; // Verde - muito baixa ocupação
  };

  const handleCardPress = (type: string) => {
    if (filteredPatios.length === 0) {
      toastRef.current?.show("Sem pátios", "Nenhum pátio encontrado", "warning");
      return;
    }

    let targetPatio;
    switch (type) {
      case 'ocupacao-alta':
        targetPatio = filteredPatios.find(p => {
          const ocupacao = p.motosTotaisPatio > 0 ? (p.motosTotaisPatio - p.motosDisponiveisPatio) / p.motosTotaisPatio : 0;
          return ocupacao >= 0.8;
        });
        break;
      case 'maior-capacidade':
        targetPatio = [...filteredPatios].sort((a, b) => b.motosTotaisPatio - a.motosTotaisPatio)[0];
        break;
      case 'mais-disponivel':
        targetPatio = [...filteredPatios].sort((a, b) => b.motosDisponiveisPatio - a.motosDisponiveisPatio)[0];
        break;
      default:
        targetPatio = filteredPatios[0];
    }

    if (targetPatio) {
      onPatioDetails(targetPatio.idPatio);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: cores.fundo }]}>
      <Text style={[styles.title, { color: cores.texto }]}>Pátios</Text>

      <View style={styles.dashboardRow}>
        <TouchableOpacity
          style={[styles.card, { backgroundColor: cores.primaria }]}
          onPress={() => handleCardPress('total')}
        >
          <Text style={[styles.cardLabel, { color: cores.textoInvertido }]}>Total Pátios</Text>
          <Text style={[styles.cardValue, { color: cores.textoInvertido }]}>{totalPatios}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: cores.sucesso }]}
          onPress={() => handleCardPress('maior-capacidade')}
        >
          <Text style={[styles.cardLabel, { color: cores.textoInvertido }]}>Total Motos</Text>
          <Text style={[styles.cardValue, { color: cores.textoInvertido }]}>{totalMotos}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: cores.aviso }]}
          onPress={() => handleCardPress('mais-disponivel')}
        >
          <Text style={[styles.cardLabel, { color: cores.textoInvertido }]}>Disponíveis</Text>
          <Text style={[styles.cardValue, { color: cores.textoInvertido }]}>{totalDisponiveis}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, { backgroundColor: cores.erro }]}
          onPress={() => handleCardPress('ocupacao-alta')}
        >
          <Text style={[styles.cardLabel, { color: cores.textoInvertido }]}>Taxa Ocupação</Text>
          <Text style={[styles.cardValue, { color: cores.textoInvertido }]}>{taxaOcupacao}%</Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.chartContainer, { borderTopColor: cores.borda, borderBottomColor: cores.borda }]}>
        <VictoryChart theme={VictoryTheme.material} height={280} padding={{ left: 40, top: 40, right: 40, bottom: 60 }}>
          <VictoryLabel
            text="Top 8 Pátios - Capacidade Total"
            x={200}
            y={20}
            textAnchor="middle"
            style={{ fill: cores.texto, fontSize: 16, fontWeight: "600" }}
          />
          <VictoryAxis
            tickFormat={chartData.map(d => d.x)}
            style={{
              axis: { stroke: cores.texto },
              ticks: { stroke: cores.texto },
              tickLabels: { fontSize: 10, fill: cores.texto, angle: -45 },
            }}
          />
          <VictoryAxis
            dependentAxis
            domain={[0, maxMotos]}
            style={{
              axis: { stroke: cores.texto },
              ticks: { stroke: cores.texto },
              tickLabels: { fontSize: 10, fill: cores.texto },
            }}
          />
          <VictoryBar
            data={chartData}
            style={{ 
              data: { fill: '#3b82f6', fillOpacity: 0.8 } 
            }}
            barRatio={0.8}
          />
          <VictoryBar
            data={chartData.map(d => ({ x: d.x, y: d.disponivel }))}
            style={{ 
              data: { fill: '#10b981', fillOpacity: 0.9 } 
            }}
            barRatio={0.8}
          />
        </VictoryChart>
      </View>

      <TextInput
        style={[styles.searchBar, { backgroundColor: cores.fundoCard, borderBottomColor: cores.borda, color: cores.texto }]}
        placeholder="Buscar por nome do pátio"
        placeholderTextColor={cores.textoSecundario}
        value={search}
        onChangeText={setSearch}
      />

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <TouchableOpacity
          style={[styles.filtrosButton, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}
          onPress={() => {
            toastRef.current?.show("TODO", "Botão de filtros em desenvolvimento.", "warning");
          }}
        >
          <Ionicons name="filter" size={20} color={cores.texto} />
          <Text style={[styles.filtrosText, { color: cores.texto }]}>Filtros</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.createPatioButton, { backgroundColor: cores.sucesso }]}
          onPress={onCreatePatio}
        >
          <Ionicons name="add" size={20} color={cores.textoInvertido} />
          <Text style={[styles.createPatioButtonText, { color: cores.textoInvertido }]}>Novo Pátio</Text>
        </TouchableOpacity>
      </View>

      {filteredPatios.slice(0, visibleCount).map((patio) => {
        const ocupacao = patio.motosTotaisPatio > 0 
          ? Math.round(((patio.motosTotaisPatio - patio.motosDisponiveisPatio) / patio.motosTotaisPatio) * 100)
          : 0;

        return (
          <TouchableOpacity 
            key={patio.idPatio} 
            onPress={() => onPatioDetails(patio.idPatio)} 
            style={[styles.listItem, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.patioName, { color: cores.texto }]}>{patio.nomePatio}</Text>
              <Text style={[styles.patioInfo, { color: cores.textoSecundario }]}>
                Total: {patio.motosTotaisPatio} | Disponíveis: {patio.motosDisponiveisPatio}
              </Text>
              <Text style={[styles.patioDate, { color: cores.textoSecundario }]}>
                {patio.dataPatio.toLocaleDateString('pt-BR')}
              </Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 5 }}>
                <Text style={[styles.ocupacao, { color: getOccupancyColor(patio) }]}>
                  {ocupacao}%
                </Text>
                <Ionicons name="ellipse" size={12} color={getOccupancyColor(patio)} />
              </View>
              <View style={[styles.progressBar, { backgroundColor: '#374151' }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${ocupacao}%`, 
                      backgroundColor: getOccupancyColor(patio) 
                    }
                  ]} 
                />
              </View>
            </View>
          </TouchableOpacity>
        );
      })}

      {visibleCount < filteredPatios.length && (
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

export default PatioListDashboard;

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
  createPatioButton: {
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
  createPatioButtonText: {
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
  patioName: {
    color: '#f3f4f6',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  patioInfo: {
    color: '#9ca3af',
    fontSize: 14,
    marginBottom: 2,
  },
  patioDate: {
    color: '#6b7280',
    fontSize: 12,
  },
  ocupacao: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  progressBar: {
    width: 60,
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
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