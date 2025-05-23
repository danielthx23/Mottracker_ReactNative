import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { VictoryPie } from 'victory-native';
import { Ionicons } from '@expo/vector-icons';
import { ToastMessageRef } from './Toast';

interface Patio {
  nome: string;
  quantidadeMotos: number;
}

interface Camera {
  id: number;
  status: 'online' | 'offline';
}

interface HomeProps {
  motosRetiradas: number;
  motosEmPatio: number;
  motosEmManutencao: number;
  cameras: Camera[];
  patios: Patio[];
  toastRef: React.RefObject<ToastMessageRef | null>;
}

const Home: React.FC<HomeProps> = ({
  motosRetiradas,
  motosEmPatio,
  motosEmManutencao,
  cameras,
  patios,
  toastRef,
}) => {
  const totalCameras = cameras.length;
  const camerasOnline = cameras.filter((c) => c.status === 'online').length;
  const camerasOffline = totalCameras - camerasOnline;
  const totalMotos = motosRetiradas + motosEmPatio + motosEmManutencao;

  const motosData = [
    { label: 'Retiradas', value: motosRetiradas, color: '#3b82f6' },
    { label: 'Pátio', value: motosEmPatio, color: '#10b981' },
    { label: 'Manutenção', value: motosEmManutencao, color: '#f59e0b' },
  ];

  const camerasData = [
    { x: "Online", y: camerasOnline, label: `${camerasOnline}`, color: '#10b981' },
    { x: "Offline", y: camerasOffline, label: `${camerasOffline}`, color: '#ef4444' },
    { x: "", y: totalCameras, label: "", color: 'transparent' },
  ]

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">

        <Text style={styles.title}>
          Dashboard Home <Text style={styles.info}>Info</Text>
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity style={styles.buttonReset} onPress={() => {toastRef.current?.show("TODO", "Botão de resetar layout em progresso.", "warning");}}>
            <Text style={styles.buttonTextReset}>Resetar layout atual</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => {toastRef.current?.show("TODO", "Botão de editar widgets em progresso.", "warning");}}>
            <Ionicons name="ellipsis-vertical" size={20} color="#0c0c0c" />
            <Text style={styles.buttonText}>Editar widgets</Text>
          </TouchableOpacity>
        </View>

      <View style={styles.grid}>
        <View style={[styles.cardTop, styles.card]}>
          <Text style={styles.cardTitle}>
            Motos e Pátios <Text style={styles.info}>Info</Text>
          </Text>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionLabel}>Motos Retiradas</Text>
              <Text style={styles.sectionValue}>{motosRetiradas}</Text>

              <Text style={styles.sectionLabel}>Motos em Pátio</Text>
              <Text style={styles.sectionValue}>{motosEmPatio}</Text>

              <Text style={styles.sectionLabel}>Em Manutenção</Text>
              <Text style={styles.sectionValue}>{motosEmManutencao}</Text>

              <Text style={styles.sectionLabel}>Total</Text>
              <Text style={styles.sectionValue}>{totalMotos}</Text>
              
            </View>

            <View style={styles.chartMotosContainer}>
              <VictoryPie
                data={motosData}
                x="label"
                y="value"
                width={200}
                height={200}
                colorScale={motosData.map((item) => item.color)}
                radius={100}
                innerRadius={30}
                labelRadius={38}
                style={{
                  labels: { fill: 'white', fontSize: 14, fontWeight: 'bold' },
                }}
              />
          </View>

          </View>

          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Ir para gerenciamento de motos</Text>
          </TouchableOpacity>

          <Text style={[styles.cardTitle, { marginTop: 20 }]}>Top Pátios</Text>
          {patios.map((item) => (
            <View key={item.nome} style={styles.listItem}>
              <Text style={styles.listLabel}>{item.nome}</Text>
              <Text style={styles.listValue}>{item.quantidadeMotos} motos</Text>
            </View>
          ))}
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Ir para gerenciamento de pátios</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.cardBottom, styles.card]}>
          <Text style={styles.cardTitle}>
            Saúde das Câmeras <Text style={styles.info}>Info</Text>
          </Text>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.sectionLabel}>Online</Text>
              <Text style={styles.sectionValue}>{camerasOnline}</Text>

              <Text style={styles.sectionLabel}>Offline</Text>
              <Text style={styles.sectionValue}>{camerasOffline}</Text>

              <Text style={styles.sectionLabel}>Total</Text>
              <Text style={styles.sectionValue}>{totalCameras}</Text>
            </View>

            <View style={styles.chartCamerasContainer}>
                <VictoryPie
                  data={camerasData}
                  colorScale={['#10b981', '#ef4444', 'transparent']}
                  startAngle={-90}
                  endAngle={360} 
                  radius={100}
                  innerRadius={50}
                  labelRadius={75}
                  width={200}
                  height={250}
                  labels={({ datum }) => datum.label !== '' ? datum.label : null}
                  style={{
                    data: { fill: ({ datum }) => datum.color },
                    labels: { fill: '#fff', fontSize: 16, fontWeight: 'bold' },
                  }}
                />
            </View>
          </View>

          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Ir para todas as câmeras</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ height: 100, marginBottom: 10 }} >
        <Text style={styles.todo}>TODO: Mais gráficos categorizando regiões, localidades e outras métricas.</Text>
      </View>    
    </ScrollView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0f0f0f',
    padding: 20,
    paddingVertical: 40
  },
  todo: {
    backgroundColor: '#ff9100',
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
    borderRadius: 6,
    padding: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 20,
  },
  info: {
    color: '#3b82f6',
    fontSize: 14,
  },
  button: {
    width: 150,
    marginLeft: 'auto',
    marginBottom: 20,
    backgroundColor: '#41bf4c',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "#013400",
    borderWidth: 1,
  },
  buttonReset: {
    width: 200,
    marginBottom: 20,
    backgroundColor: '#0f0f0f',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "#1f1f1f",
    borderWidth: 1,
  },
  buttonTextReset: {
    fontSize: 14,
    color: '#e5e7eb',
    fontWeight: '800',
    padding: 12,
    textAlign: 'center'
  },
  buttonText: {
    fontSize: 14,
    color: '#0c0c0c',
    fontWeight: '800',
    padding: 12,
  },
  grid: {
    flexDirection: 'column',
    gap: 20,
    paddingBottom: 20
  },
  card: {
    backgroundColor: '#1f1f1f',
    borderRadius: 6,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTop: {
  },
  cardBottom: {
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    color: '#f3f4f6',
    borderBottomWidth: 1,
    borderBottomColor: '#0f0f0f',
    paddingBottom: 10
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#9ca3af',
  },
  sectionValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#f9fafb',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  listLabel: {
    fontSize: 14,
    color: '#d1d5db',
  },
  listValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#34d399',
  },
  link: {
    marginTop: 18,
  },
  linkText: {
    fontSize: 13,
    color: '#3b82f6',
  },
  chartMotosContainer: {
    width: '65%',
    height: 180,
    justifyContent: 'center',
    alignItems: 'flex-end', 
    marginVertical: 12,
    paddingInline: 5,
  },
  chartCamerasContainer: {
    width: '70%',
    height: 140, 
    overflow: 'hidden',
    paddingInline: 10,
    justifyContent: 'flex-start',
    alignItems: 'flex-end', 
  },
  
});
