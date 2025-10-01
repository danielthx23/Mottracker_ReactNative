import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Patio } from '../../model/Patio';
import { Moto } from '../../model/Moto';
import { Camera } from '../../model/Camera';
import { ContextoPrincipal } from '../../context/ContextoPrincipal';
import { useEstilos } from '../../hooks/useEstilos';

interface PatioFormularioCompletoProps {
  patio?: Patio;
  onSalvar: (patio: Patio) => void;
  onCancelar: () => void;
  onAtualizarMotosCameras?: (idPatio: number, motosIds: number[], camerasIds: number[]) => void;
}

const PatioFormularioCompleto: React.FC<PatioFormularioCompletoProps> = ({
  patio,
  onSalvar,
  onCancelar,
  onAtualizarMotosCameras,
}) => {
  const { cores } = useEstilos();
  const [nomePatio, setNomePatio] = useState('');
  const [capacidadeTotal, setCapacidadeTotal] = useState('');
  const [vagasDisponiveis, setVagasDisponiveis] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Estados para gestão de motos
  const [motosSelecionadas, setMotosSelecionadas] = useState<Moto[]>([]);
  const [modalMotos, setModalMotos] = useState(false);
  const [buscaMotos, setBuscaMotos] = useState('');
  
  // Estados para gestão de câmeras
  const [camerasSelecionadas, setCamerasSelecionadas] = useState<Camera[]>([]);
  const [modalCameras, setModalCameras] = useState(false);
  const [buscaCameras, setBuscaCameras] = useState('');
  
  // Contexto para acessar dados
  const { 
    motos: listaMotos, 
    cameras: listaCameras 
  } = useContext(ContextoPrincipal);


  const isEditing = !!patio;

  useEffect(() => {
    if (patio) {
      setNomePatio(patio.nomePatio);
      setCapacidadeTotal(patio.motosTotaisPatio.toString());
      setVagasDisponiveis(patio.motosDisponiveisPatio.toString());
      
      // Usar motos e câmeras que vêm diretamente do pátio
      const motosDoPatio = patio.motosPatioAtual || [];
      const camerasDoPatio = patio.camerasPatio || [];
      
      setMotosSelecionadas(motosDoPatio);
      setCamerasSelecionadas(camerasDoPatio);
    }
  }, [patio, listaMotos, listaCameras]);

  const validarCampos = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!nomePatio.trim()) {
      newErrors.nomePatio = 'Nome do pátio é obrigatório';
    } else if (nomePatio.trim().length < 3) {
      newErrors.nomePatio = 'Nome deve ter pelo menos 3 caracteres';
    }

    const capacidadeNum = parseInt(capacidadeTotal);
    if (!capacidadeTotal || isNaN(capacidadeNum)) {
      newErrors.capacidadeTotal = 'Capacidade total é obrigatória';
    } else if (capacidadeNum <= 0) {
      newErrors.capacidadeTotal = 'Capacidade deve ser maior que zero';
    } else if (capacidadeNum > 1000) {
      newErrors.capacidadeTotal = 'Capacidade muito alta (máx: 1000)';
    }

    const disponiveisNum = parseInt(vagasDisponiveis);
    if (!vagasDisponiveis || isNaN(disponiveisNum)) {
      newErrors.vagasDisponiveis = 'Vagas disponíveis é obrigatório';
    } else if (disponiveisNum < 0) {
      newErrors.vagasDisponiveis = 'Vagas disponíveis não pode ser negativo';
    } else if (disponiveisNum > capacidadeNum) {
      newErrors.vagasDisponiveis = 'Vagas disponíveis não pode ser maior que a capacidade total';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = () => {
    if (!validarCampos()) {
      return;
    }

    const patioData: Patio = {
      idPatio: patio?.idPatio || 0,
      nomePatio: nomePatio.trim(),
      motosTotaisPatio: parseInt(capacidadeTotal),
      motosDisponiveisPatio: parseInt(vagasDisponiveis),
      dataPatio: patio?.dataPatio || new Date(),
      motosPatioAtual: motosSelecionadas,
      camerasPatio: camerasSelecionadas,
    };

    // Se estiver editando, atualizar motos e câmeras
    if (isEditing && patio?.idPatio && onAtualizarMotosCameras) {
      const motosIds = motosSelecionadas.map(m => m.idMoto);
      const camerasIds = camerasSelecionadas.map(c => c.idCamera);
      
      onAtualizarMotosCameras(patio.idPatio, motosIds, camerasIds);
    }

    onSalvar(patioData);
  };

  const handleCancelar = () => {
    if (nomePatio || capacidadeTotal || vagasDisponiveis) {
      Alert.alert(
        'Descartar alterações?',
        'Você tem alterações não salvas. Deseja descartar?',
        [
          { text: 'Continuar editando', style: 'cancel' },
          { text: 'Descartar', onPress: onCancelar, style: 'destructive' },
        ]
      );
    } else {
      onCancelar();
    }
  };

  // Filtros para busca
  const motosFiltradas = listaMotos?.filter(moto => 
    moto.placaMoto.toLowerCase().includes(buscaMotos.toLowerCase()) ||
    moto.modeloMoto.toLowerCase().includes(buscaMotos.toLowerCase())
  ) || [];

  const camerasFiltradas = listaCameras?.filter(camera => 
    camera.nomeCamera.toLowerCase().includes(buscaCameras.toLowerCase())
  ) || [];

  // Funções para gestão de motos
  const selecionarMoto = (moto: Moto) => {
    const jaSelecionada = motosSelecionadas.find(m => m.idMoto === moto.idMoto);
    if (jaSelecionada) {
      setMotosSelecionadas(motosSelecionadas.filter(m => m.idMoto !== moto.idMoto));
    } else {
      setMotosSelecionadas([...motosSelecionadas, moto]);
    }
  };

  const removerMoto = (moto: Moto) => {
    setMotosSelecionadas(motosSelecionadas.filter(m => m.idMoto !== moto.idMoto));
  };

  // Funções para gestão de câmeras
  const selecionarCamera = (camera: Camera) => {
    const jaSelecionada = camerasSelecionadas.find(c => c.idCamera === camera.idCamera);
    if (jaSelecionada) {
      setCamerasSelecionadas(camerasSelecionadas.filter(c => c.idCamera !== camera.idCamera));
    } else {
      setCamerasSelecionadas([...camerasSelecionadas, camera]);
    }
  };

  const removerCamera = (camera: Camera) => {
    setCamerasSelecionadas(camerasSelecionadas.filter(c => c.idCamera !== camera.idCamera));
  };

  const preencherAutomatico = () => {
    const capacidade = parseInt(capacidadeTotal) || 0;
    if (capacidade > 0) {
      const sugestao = Math.floor(capacidade * 0.4);
      setVagasDisponiveis(sugestao.toString());
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>
      <ScrollView style={[styles.scrollView, { backgroundColor: cores.fundo }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: cores.fundoCard, borderBottomColor: cores.borda }]}>
          <TouchableOpacity onPress={handleCancelar} style={[styles.backButton, { backgroundColor: cores.erro }]}>
            <Ionicons name="close" size={24} color={cores.textoInvertido} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: cores.texto }]}>
            {isEditing ? 'Editar Pátio' : 'Novo Pátio'}
          </Text>
          <TouchableOpacity onPress={handleSalvar} style={styles.saveButton}>
            <Ionicons name="checkmark" size={24} color={cores.sucesso} />
          </TouchableOpacity>
        </View>

        {/* Formulário Básico */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: cores.texto }]}>Nome do Pátio *</Text>
            <TextInput
              style={[styles.input, errors.nomePatio ? styles.inputError : undefined, { backgroundColor: cores.fundoCard, borderColor: cores.borda, color: cores.texto }]}
              value={nomePatio}
              onChangeText={setNomePatio}
              placeholder="Ex: Pátio Central, Estacionamento Norte..."
              placeholderTextColor={cores.textoSecundario}
              maxLength={50}
            />
            {errors.nomePatio && (
              <Text style={[styles.errorText, { color: cores.erro }]}>{errors.nomePatio}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={[styles.label, { color: cores.texto }]}>Capacidade Total *</Text>
              <TouchableOpacity onPress={preencherAutomatico} style={[styles.autoFillButton, { backgroundColor: cores.primaria }]}>
                <Ionicons name="refresh" size={16} color={cores.textoInvertido} />
                <Text style={[styles.autoFillText, { color: cores.textoInvertido }]}>Auto-preenchimento</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              style={[styles.input, errors.capacidadeTotal ? styles.inputError : undefined, { backgroundColor: cores.fundoCard, borderColor: cores.borda, color: cores.texto }]}
              value={capacidadeTotal}
              onChangeText={setCapacidadeTotal}
              placeholder="Ex: 100"
              placeholderTextColor={cores.textoSecundario}
              keyboardType="numeric"
              maxLength={4}
            />
            {errors.capacidadeTotal && (
              <Text style={[styles.errorText, { color: cores.erro }]}>{errors.capacidadeTotal}</Text>
            )}
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: cores.texto }]}>Vagas Disponíveis *</Text>
            <TextInput
              style={[styles.input, errors.vagasDisponiveis ? styles.inputError : undefined, { backgroundColor: cores.fundoCard, borderColor: cores.borda, color: cores.texto }]}
              value={vagasDisponiveis}
              onChangeText={setVagasDisponiveis}
              placeholder="Ex: 75"
              placeholderTextColor={cores.textoSecundario}
              keyboardType="numeric"
              maxLength={4}
            />
            {errors.vagasDisponiveis && (
              <Text style={[styles.errorText, { color: cores.erro }]}>{errors.vagasDisponiveis}</Text>
            )}
          </View>
        </View>

        {/* Gestão de Motos */}
        <View style={[styles.section, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}>
          <View style={[styles.sectionHeader, { borderBottomColor: cores.borda }]}>
            <Text style={[styles.sectionTitle, { color: cores.texto }]}>Motos no Pátio</Text>
            <TouchableOpacity 
              onPress={() => setModalMotos(true)} 
              style={[styles.addButton, { backgroundColor: cores.sucesso }]}
            >
              <Ionicons name="add" size={20} color={cores.textoInvertido} />
              <Text style={[styles.addButtonText, { color: cores.textoInvertido }]}>Gerenciar Motos</Text>
            </TouchableOpacity>
          </View>
          
          {motosSelecionadas.length > 0 ? (
            <View style={styles.selectedItems}>
              {motosSelecionadas.map((moto) => (
                <View key={moto.idMoto} style={[styles.selectedItem, { backgroundColor: cores.fundo, borderColor: cores.borda }]}>
                  <View style={styles.selectedItemInfo}>
                    <Text style={[styles.selectedItemTitle, { color: cores.texto }]}>{moto.placaMoto}</Text>
                    <Text style={[styles.selectedItemSubtitle, { color: cores.textoSecundario }]}>{moto.modeloMoto}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => removerMoto(moto)}
                    style={[styles.removeButton, { backgroundColor: cores.erro }]}
                  >
                    <Ionicons name="close" size={16} color={cores.textoInvertido} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="bicycle" size={32} color={cores.textoSecundario} />
              <Text style={[styles.emptyText, { color: cores.textoSecundario }]}>Nenhuma moto selecionada</Text>
            </View>
          )}
        </View>

        {/* Gestão de Câmeras */}
        <View style={[styles.section, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}>
          <View style={[styles.sectionHeader, { borderBottomColor: cores.borda }]}>
            <Text style={[styles.sectionTitle, { color: cores.texto }]}>Câmeras do Pátio</Text>
            <TouchableOpacity 
              onPress={() => setModalCameras(true)} 
              style={[styles.addButton, { backgroundColor: cores.sucesso }]}
            >
              <Ionicons name="add" size={20} color={cores.textoInvertido} />
              <Text style={[styles.addButtonText, { color: cores.textoInvertido }]}>Gerenciar Câmeras</Text>
            </TouchableOpacity>
          </View>
          
          {camerasSelecionadas.length > 0 ? (
            <View style={styles.selectedItems}>
              {camerasSelecionadas.map((camera) => (
                <View key={camera.idCamera} style={[styles.selectedItem, { backgroundColor: cores.fundo, borderColor: cores.borda }]}>
                  <View style={styles.selectedItemInfo}>
                    <Text style={[styles.selectedItemTitle, { color: cores.texto }]}>{camera.nomeCamera}</Text>
                    <Text style={[styles.selectedItemSubtitle, { color: cores.textoSecundario }]}>{camera.status}</Text>
                  </View>
                  <TouchableOpacity 
                    onPress={() => removerCamera(camera)}
                    style={[styles.removeButton, { backgroundColor: cores.erro }]}
                  >
                    <Ionicons name="close" size={16} color={cores.textoInvertido} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="videocam" size={32} color={cores.textoSecundario} />
              <Text style={[styles.emptyText, { color: cores.textoSecundario }]}>Nenhuma câmera selecionada</Text>
            </View>
          )}
        </View>

        {/* Bottom Actions */}
        <View style={[styles.bottomActions, { backgroundColor: cores.fundo, borderTopColor: cores.borda }]}>
          <TouchableOpacity onPress={handleCancelar} style={[styles.cancelButton, { backgroundColor: cores.erro }]}>
            <Text style={[styles.cancelButtonText, { color: cores.textoInvertido }]}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSalvar} style={[styles.saveButtonBottom, { backgroundColor: cores.sucesso }]}>
            <Text style={[styles.saveButtonText, { color: cores.textoInvertido }]}>
              {isEditing ? 'Salvar Alterações' : 'Salvar Pátio'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal Motos */}
      <Modal
        visible={modalMotos}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalMotos(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: cores.fundoCard }]}>
            <View style={[styles.modalHeader, { borderBottomColor: cores.borda }]}>
              <Text style={[styles.modalTitle, { color: cores.texto }]}>Gerenciar Motos</Text>
              <TouchableOpacity
                onPress={() => setModalMotos(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={cores.textoSecundario} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[styles.searchInput, { backgroundColor: cores.fundo, borderColor: cores.borda, color: cores.texto }]}
              placeholder="Buscar motos..."
              placeholderTextColor={cores.textoSecundario}
              value={buscaMotos}
              onChangeText={setBuscaMotos}
            />
            
            <FlatList
              data={motosFiltradas}
              keyExtractor={(item) => item.idMoto.toString()}
              renderItem={({ item }) => {
                const isSelected = motosSelecionadas.find(m => m.idMoto === item.idMoto);
                return (
                  <TouchableOpacity
                    style={[styles.item, isSelected && styles.selectedItem, { backgroundColor: cores.fundo, borderColor: cores.borda }]}
                    onPress={() => selecionarMoto(item)}
                  >
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemTitle, { color: cores.texto }]}>{item.placaMoto}</Text>
                      <Text style={[styles.itemSubtitle, { color: cores.textoSecundario }]}>{item.modeloMoto}</Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color={cores.sucesso} />
                    )}
                  </TouchableOpacity>
                );
              }}
              style={styles.itemList}
            />
          </View>
        </View>
      </Modal>

      {/* Modal Câmeras */}
      <Modal
        visible={modalCameras}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalCameras(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: cores.fundoCard }]}>
            <View style={[styles.modalHeader, { borderBottomColor: cores.borda }]}>
              <Text style={[styles.modalTitle, { color: cores.texto }]}>Gerenciar Câmeras</Text>
              <TouchableOpacity
                onPress={() => setModalCameras(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={cores.textoSecundario} />
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={[styles.searchInput, { backgroundColor: cores.fundo, borderColor: cores.borda, color: cores.texto }]}
              placeholder="Buscar câmeras..."
              placeholderTextColor={cores.textoSecundario}
              value={buscaCameras}
              onChangeText={setBuscaCameras}
            />
            
            <FlatList
              data={camerasFiltradas}
              keyExtractor={(item) => item.idCamera.toString()}
              renderItem={({ item }) => {
                const isSelected = camerasSelecionadas.find(c => c.idCamera === item.idCamera);
                return (
                  <TouchableOpacity
                    style={[styles.item, isSelected && styles.selectedItem, { backgroundColor: cores.fundo, borderColor: cores.borda }]}
                    onPress={() => selecionarCamera(item)}
                  >
                    <View style={styles.itemInfo}>
                      <Text style={[styles.itemTitle, { color: cores.texto }]}>{item.nomeCamera}</Text>
                      <Text style={[styles.itemSubtitle, { color: cores.textoSecundario }]}>{item.status}</Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color={cores.sucesso} />
                    )}
                  </TouchableOpacity>
                );
              }}
              style={styles.itemList}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1f2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f9fafb',
  },
  saveButton: {
    padding: 8,
  },
  form: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f3f4f6',
    marginBottom: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1f2937',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#f9fafb',
  },
  inputError: {
    borderColor: '#ef4444',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 4,
  },
  autoFillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#1e40af',
    borderRadius: 6,
  },
  autoFillText: {
    color: '#3b82f6',
    fontSize: 12,
    marginLeft: 4,
  },
  section: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f9fafb',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  selectedItems: {
    gap: 8,
  },
  selectedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  selectedItemInfo: {
    flex: 1,
  },
  selectedItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f9fafb',
  },
  selectedItemSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 2,
  },
  removeButton: {
    padding: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  emptyText: {
    color: '#9ca3af',
    fontSize: 14,
    marginTop: 8,
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1f2937',
    borderTopWidth: 1,
    borderTopColor: '#374151',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#374151',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#f9fafb',
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonBottom: {
    flex: 1,
    backgroundColor: '#10b981',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f9fafb',
  },
  closeButton: {
    padding: 4,
  },
  searchInput: {
    backgroundColor: '#374151',
    borderWidth: 1,
    borderColor: '#4b5563',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#f9fafb',
    marginBottom: 16,
  },
  itemList: {
    maxHeight: 400,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: '#374151',
    borderRadius: 8,
    marginBottom: 8,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f9fafb',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 2,
  },
});

export default PatioFormularioCompleto;
