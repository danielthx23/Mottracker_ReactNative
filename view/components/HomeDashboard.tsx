import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { VictoryPie } from 'victory-native';
import { Ionicons } from '@expo/vector-icons';
import { ToastMessageRef } from './Toast';
import { useNavigation } from '@react-navigation/native';
import { useEstilos } from '../../hooks/useEstilos';

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
  navigation: any;
  // onCreateSampleData removido - botão de criar dados de exemplo removido
}

const Home: React.FC<HomeProps> = ({
  motosRetiradas,
  motosEmPatio,
  motosEmManutencao,
  cameras,
  patios,
  toastRef,
  navigation,
  // onCreateSampleData removido
}) => {
  const { cores, estilos } = useEstilos();
  const totalCameras = cameras.length;
  const camerasOnline = cameras.filter((c) => c.status === 'online').length;
  const camerasOffline = totalCameras - camerasOnline;
  const totalMotos = motosRetiradas + motosEmPatio + motosEmManutencao;

  const motosData = [
    { label: 'Retiradas', value: motosRetiradas, color: cores.primaria },
    { label: 'Pátio', value: motosEmPatio, color: cores.sucesso },
    { label: 'Manutenção', value: motosEmManutencao, color: cores.aviso },
  ];

  const camerasData = [
    { x: "Online", y: camerasOnline, label: `${camerasOnline}`, color: cores.sucesso },
    { x: "Offline", y: camerasOffline, label: `${camerasOffline}`, color: cores.erro },
    { x: "", y: totalCameras, label: "", color: 'transparent' },
  ];

  const showInfo = (message: string) => {
    toastRef.current?.show("Informação", message, "info");
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: cores.fundo }]} keyboardShouldPersistTaps="handled">
      <Text style={[styles.title, { color: cores.texto }]}>
        Dashboard Home{' '}
        <Text style={[styles.info, { color: cores.textoSecundario }]} onPress={() => showInfo('Painel inicial com resumos de motos, pátios e câmeras.')}>
          Info
        </Text>
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
        <TouchableOpacity style={[styles.buttonReset, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]} onPress={() => {
          toastRef.current?.show("TODO", "Botão de resetar layout em progresso.", "warning");
        }}>
          <Text style={[styles.buttonTextReset, { color: cores.texto }]}>Resetar layout atual</Text>
        </TouchableOpacity>
        
        {/* Botão de criar dados de exemplo removido */}
        
        <TouchableOpacity style={[styles.button, { backgroundColor: cores.primaria, borderColor: cores.primaria }]} onPress={() => {
          toastRef.current?.show("TODO", "Botão de editar widgets em progresso.", "warning");
        }}>
          <Ionicons name="ellipsis-vertical" size={20} color={cores.textoInvertido} />
          <Text style={[styles.buttonText, { color: cores.textoInvertido }]}>Editar widgets</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.grid}>
        <View style={[styles.cardTop, styles.card, { backgroundColor: cores.fundoCard }]}>
          <Text style={[styles.cardTitle, { color: cores.texto }]}>
            Motos e Pátios{' '}
            <Text style={[styles.info, { color: cores.textoSecundario }]} onPress={() => showInfo('Resumo da situação das motos e dos principais pátios.')}>
              Info
            </Text>
          </Text>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionLabel, { color: cores.textoSecundario }]}>Motos Retiradas</Text>
              <Text style={[styles.sectionValue, { color: cores.texto }]}>{motosRetiradas}</Text>

              <Text style={[styles.sectionLabel, { color: cores.textoSecundario }]}>Motos em Pátio</Text>
              <Text style={[styles.sectionValue, { color: cores.texto }]}>{motosEmPatio}</Text>

              <Text style={[styles.sectionLabel, { color: cores.textoSecundario }]}>Em Manutenção</Text>
              <Text style={[styles.sectionValue, { color: cores.texto }]}>{motosEmManutencao}</Text>

              <Text style={[styles.sectionLabel, { color: cores.textoSecundario }]}>Total</Text>
              <Text style={[styles.sectionValue, { color: cores.texto }]}>{totalMotos}</Text>
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
                  labels: { fill: cores.texto, fontSize: 14, fontWeight: 'bold' },
                }}
              />
            </View>
          </View>

          <TouchableOpacity style={[styles.link, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]} onPress={() => navigation.navigate('Motos' as never)}>
            <Text style={[styles.linkText, { color: cores.primaria }]}>Ir para gerenciamento de motos</Text>
          </TouchableOpacity>

          <Text style={[styles.cardTitle, { marginTop: 20, color: cores.texto }]}>Top 10 Pátios</Text>
          {patios
            .sort((a, b) => b.quantidadeMotos - a.quantidadeMotos) // Ordenar por quantidade (maior primeiro)
            .slice(0, 10) // Pegar apenas os top 10
            .map((item, index) => (
              <View key={`patio-${index}-${item.nome}`} style={[styles.listItem, { backgroundColor: cores.fundoCard }]}>
                <Text style={[styles.listLabel, { color: cores.texto }]}>
                  #{index + 1} {item.nome}
                </Text>
                <Text style={[styles.listValue, { color: cores.textoSecundario }]}>{item.quantidadeMotos} motos</Text>
              </View>
            ))}
          <TouchableOpacity style={[styles.link, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]} onPress={() => navigation.navigate('Patios' as never)}>
            <Text style={[styles.linkText, { color: cores.primaria }]}>Ir para gerenciamento de pátios</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.cardBottom, styles.card, { backgroundColor: cores.fundoCard }]}>
          <Text style={[styles.cardTitle, { color: cores.texto }]}>
            Saúde das Câmeras{' '}
            <Text style={[styles.info, { color: cores.textoSecundario }]} onPress={() => showInfo('Exibe o status das câmeras de monitoramento.')}>
              Info
            </Text>
          </Text>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={[styles.sectionLabel, { color: cores.textoSecundario }]}>Online</Text>
              <Text style={[styles.sectionValue, { color: cores.texto }]}>{camerasOnline}</Text>

              <Text style={[styles.sectionLabel, { color: cores.textoSecundario }]}>Offline</Text>
              <Text style={[styles.sectionValue, { color: cores.texto }]}>{camerasOffline}</Text>

              <Text style={[styles.sectionLabel, { color: cores.textoSecundario }]}>Total</Text>
              <Text style={[styles.sectionValue, { color: cores.texto }]}>{totalCameras}</Text>
            </View>

            <View style={styles.chartCamerasContainer}>
              <VictoryPie
                data={camerasData}
                colorScale={[cores.sucesso, cores.erro, 'transparent']}
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

          <TouchableOpacity style={[styles.link, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]} onPress={() => {
            toastRef.current?.show("TODO", "Funcionalidade de listar câmeras em progresso.", "warning");
          }}>
            <Text style={[styles.linkText, { color: cores.primaria }]}>Ir para todas as câmeras</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ height: 100, marginBottom: 10 }}>
        <Text style={[styles.todo, { backgroundColor: cores.aviso, color: cores.textoInvertido }]}>TODO: Mais gráficos categorizando regiões, localidades e outras métricas.</Text>
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
  buttonSample: {
    width: 180,
    marginBottom: 20,
    backgroundColor: '#3b82f6',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: "#1e40af",
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
