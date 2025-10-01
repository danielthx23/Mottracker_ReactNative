import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Moto, Estados } from '../../model/Moto';
import { Patio } from '../../model/Patio';
import { Contrato } from '../../model/Contrato';
import { useEstilos } from '../../hooks/useEstilos';
import { ContextoPrincipal } from '../../context/ContextoPrincipal';

interface MotoFormularioProps {
  moto?: Moto;
  onSalvar: (moto: Moto) => void;
  onEditar: (moto: Moto) => void;
  onCancelar: () => void;
}

const MotoFormulario: React.FC<MotoFormularioProps> = ({
  moto,
  onSalvar,
  onEditar,
  onCancelar,
}) => {
  const { cores } = useEstilos();
  const [modelo, setModelo] = useState('');
  const [placa, setPlaca] = useState('');
  const [identificador, setIdentificador] = useState('');
  const [ano, setAno] = useState('');
  const [quilometragem, setQuilometragem] = useState('');
  const [condicoes, setCondicoes] = useState('');
  const [estado, setEstado] = useState<Estados>(Estados.NoPatio);
  const [contratoMotoId, setContratoMotoId] = useState('');
  const [motoPatioAtualId, setMotoPatioAtualId] = useState('');
  const [motoPatioOrigemId, setMotoPatioOrigemId] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  // Estados para select de pátio
  const [patioAtualSelecionado, setPatioAtualSelecionado] = useState<Patio | null>(null);
  const [patioOrigemSelecionado, setPatioOrigemSelecionado] = useState<Patio | null>(null);
  const [modalPatioAtual, setModalPatioAtual] = useState(false);
  const [modalPatioOrigem, setModalPatioOrigem] = useState(false);
  const [buscaPatio, setBuscaPatio] = useState('');
  
  // Estados para select de contrato
  const [contratoSelecionado, setContratoSelecionado] = useState<Contrato | null>(null);
  const [modalContrato, setModalContrato] = useState(false);
  const [buscaContrato, setBuscaContrato] = useState('');
  
  // Contexto para acessar dados
  const { patios: listaPatios, contratos: listaContratos } = useContext(ContextoPrincipal);

  const isEditing = !!moto;

  useEffect(() => {
    if (moto) {
      setModelo(moto.modeloMoto || '');
      setPlaca(moto.placaMoto || '');
      setIdentificador(moto.identificadorMoto || '');
      setAno(moto.anoMoto?.toString() || '');
      setQuilometragem(moto.quilometragemMoto?.toString() || '');
      setCondicoes(moto.condicoesMoto || '');
      setEstado(moto.estadoMoto || Estados.NoPatio);
      setContratoMotoId(moto.contratoMotoId?.toString() || '');
      setMotoPatioAtualId(moto.motoPatioAtualId?.toString() || '');
      setMotoPatioOrigemId(moto.motoPatioOrigemId?.toString() || '');
      
      // Carregar pátios selecionados
      if (moto.motoPatioAtualId) {
        const patioAtual = listaPatios.find(p => p.idPatio === moto.motoPatioAtualId);
        setPatioAtualSelecionado(patioAtual || null);
      }
      if (moto.motoPatioOrigemId) {
        const patioOrigem = listaPatios.find(p => p.idPatio === moto.motoPatioOrigemId);
        setPatioOrigemSelecionado(patioOrigem || null);
      }
      
      // Carregar contrato selecionado
      if (moto.contratoMotoId) {
        const contrato = listaContratos.find(c => c.idContrato === moto.contratoMotoId);
        setContratoSelecionado(contrato || null);
      }
    }
  }, [moto, listaPatios]);

  const validarCampos = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!modelo.trim()) newErrors.modelo = 'Modelo é obrigatório';
    if (!placa.trim()) newErrors.placa = 'Placa é obrigatória';
    if (!identificador.trim()) newErrors.identificador = 'Identificador é obrigatório';
    if (!ano || isNaN(Number(ano))) newErrors.ano = 'Ano inválido';
    if (!quilometragem || isNaN(Number(quilometragem))) newErrors.quilometragem = 'Quilometragem inválida';
    // Contrato é opcional - não validar
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = () => {
    if (!validarCampos()) return;
    
    const motoData: Moto = {
      idMoto: moto?.idMoto || 0,
      modeloMoto: modelo.trim(),
      placaMoto: placa.trim(),
      identificadorMoto: identificador.trim(),
      anoMoto: parseInt(ano),
      quilometragemMoto: parseInt(quilometragem),
      condicoesMoto: condicoes.trim(),
      estadoMoto: estado,
      contratoMotoId: contratoSelecionado?.idContrato,
      motoPatioAtualId: patioAtualSelecionado?.idPatio,
      motoPatioOrigemId: patioOrigemSelecionado?.idPatio,
      hora: moto?.hora || new Date().toISOString(),
    };
    
    isEditing ? onEditar(motoData) : onSalvar(motoData);
  };

  const handleCancelar = () => {
    if (modelo || placa || ano || quilometragem) {
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

  // Filtrar pátios por nome
  const pátiosFiltrados = listaPatios.filter(patio =>
    patio.nomePatio.toLowerCase().includes(buscaPatio.toLowerCase())
  );

  // Filtrar contratos por ID ou status
  const contratosFiltrados = listaContratos.filter(contrato =>
    contrato.idContrato.toString().includes(buscaContrato) ||
    (contrato.ativoContrato ? 'Ativo' : 'Inativo').toLowerCase().includes(buscaContrato.toLowerCase())
  );

  // Selecionar pátio atual
  const selecionarPatioAtual = (patio: Patio) => {
    setPatioAtualSelecionado(patio);
    setModalPatioAtual(false);
    setBuscaPatio('');
  };

  // Selecionar pátio origem
  const selecionarPatioOrigem = (patio: Patio) => {
    setPatioOrigemSelecionado(patio);
    setModalPatioOrigem(false);
    setBuscaPatio('');
  };

  // Selecionar contrato
  const selecionarContrato = (contrato: Contrato) => {
    setContratoSelecionado(contrato);
    setModalContrato(false);
    setBuscaContrato('');
  };

  const renderInput = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    key: string,
    keyboardType?: 'default' | 'numeric'
  ) => (
    <View style={styles.inputGroup}>
      <Text style={[styles.label, { color: cores.texto }]}>{label}</Text>
      <TextInput
        style={[styles.input, errors[key] ? styles.inputError : undefined, { backgroundColor: cores.fundoCard, borderColor: cores.borda, color: cores.texto }]}
        value={value}
        onChangeText={onChange}
        placeholder={`Digite o ${label.toLowerCase()}`}
        placeholderTextColor={cores.textoSecundario}
        keyboardType={keyboardType}
      />
      {errors[key] && <Text style={[styles.errorText, { color: cores.erro }]}>{errors[key]}</Text>}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: cores.fundo }]}>
      <ScrollView>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: cores.fundoCard, borderBottomColor: cores.borda }]}>
        <TouchableOpacity onPress={handleCancelar} style={[styles.backButton, { backgroundColor: cores.erro }]}>
          <Ionicons name="close" size={24} color={cores.textoInvertido} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: cores.texto }]}>
          {isEditing ? 'Editar Moto' : 'Nova Moto'}
        </Text>
        <TouchableOpacity onPress={handleSalvar} style={styles.saveButton}>
          <Ionicons name="checkmark" size={24} color={cores.sucesso} />
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {renderInput('Modelo', modelo, setModelo, 'modelo')}
        {renderInput('Placa', placa, setPlaca, 'placa')}
        {renderInput('Identificador', identificador, setIdentificador, 'identificador')}
        {renderInput('Ano', ano, setAno, 'ano', 'numeric')}
        {renderInput('Quilometragem', quilometragem, setQuilometragem, 'quilometragem', 'numeric')}
        {renderInput('Condições', condicoes, setCondicoes, 'condicoes')}
        
        {/* Select Contrato */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: cores.texto }]}>Contrato</Text>
          <TouchableOpacity
            style={[styles.input, styles.selectButton, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}
            onPress={() => setModalContrato(true)}
          >
            <Text style={[styles.selectText, { color: cores.texto }]}>
              {contratoSelecionado ? `Contrato #${contratoSelecionado.idContrato}` : 'Selecione um contrato'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={cores.textoSecundario} />
          </TouchableOpacity>
        </View>
        
        {/* Select Pátio Atual */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: cores.texto }]}>Pátio Atual</Text>
          <TouchableOpacity
            style={[styles.input, styles.selectButton, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}
            onPress={() => setModalPatioAtual(true)}
          >
            <Text style={[styles.selectText, { color: cores.texto }]}>
              {patioAtualSelecionado ? patioAtualSelecionado.nomePatio : 'Selecione um pátio'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={cores.textoSecundario} />
          </TouchableOpacity>
        </View>

        {/* Select Pátio Origem */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: cores.texto }]}>Pátio Origem</Text>
          <TouchableOpacity
            style={[styles.input, styles.selectButton, { backgroundColor: cores.fundoCard, borderColor: cores.borda }]}
            onPress={() => setModalPatioOrigem(true)}
          >
            <Text style={[styles.selectText, { color: cores.texto }]}>
              {patioOrigemSelecionado ? patioOrigemSelecionado.nomePatio : 'Selecione um pátio'}
            </Text>
            <Ionicons name="chevron-down" size={20} color={cores.textoSecundario} />
          </TouchableOpacity>
        </View>

        {/* Estado */}
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: cores.texto }]}>Estado da Moto</Text>
          <View style={styles.estadoContainer}>
            {(Object.values(Estados) as Estados[]).map((e) => {
              const isSelected = estado === e;
              const getEstadoColor = (estado: Estados) => {
                switch (estado) {
                  case Estados.NoPatio: return cores.sucesso;
                  case Estados.Retirada: return cores.primaria;
                  case Estados.NaoDevolvida: return cores.aviso;
                  case Estados.NoPatioErrado: return cores.erro;
                  default: return cores.texto;
                }
              };
              
              return (
                <TouchableOpacity
                  key={e}
                  onPress={() => setEstado(e)}
                  style={[
                    styles.estadoButton, 
                    { 
                      backgroundColor: isSelected ? getEstadoColor(e) : cores.fundoCard, 
                      borderColor: isSelected ? getEstadoColor(e) : cores.borda 
                    }
                  ]}
                >
                  <Text style={[
                    styles.estadoText, 
                    { color: isSelected ? cores.textoInvertido : cores.texto }
                  ]}>{e}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      {/* Bottom Actions */}
      <View style={[styles.bottomActions, { backgroundColor: cores.fundo, borderTopColor: cores.borda }]}>
        <TouchableOpacity onPress={handleCancelar} style={[styles.cancelButton, { backgroundColor: cores.erro }]}>
          <Text style={[styles.cancelButtonText, { color: cores.textoInvertido }]}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSalvar} style={[styles.saveButtonBottom, { backgroundColor: cores.sucesso }]}>
          <Text style={[styles.saveButtonText, { color: cores.textoInvertido }]}>
            {isEditing ? 'Salvar Alterações' : 'Salvar Moto'}
          </Text>
        </TouchableOpacity>
      </View>
      </ScrollView>

    {/* Modal Pátio Atual */}
    <Modal
      visible={modalPatioAtual}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalPatioAtual(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: cores.fundoCard }]}>
          <View style={[styles.modalHeader, { borderBottomColor: cores.borda }]}>
            <Text style={[styles.modalTitle, { color: cores.texto }]}>Selecionar Pátio Atual</Text>
            <TouchableOpacity
              onPress={() => setModalPatioAtual(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color={cores.textoSecundario} />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={[styles.searchInput, { backgroundColor: cores.fundo, borderColor: cores.borda, color: cores.texto }]}
            placeholder="Buscar pátio..."
            placeholderTextColor={cores.textoSecundario}
            value={buscaPatio}
            onChangeText={setBuscaPatio}
          />
          
          <FlatList
            data={pátiosFiltrados}
            keyExtractor={(item) => item.idPatio.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.patioItem, { backgroundColor: cores.fundo, borderColor: cores.borda }]}
                onPress={() => selecionarPatioAtual(item)}
              >
                <Text style={[styles.patioName, { color: cores.texto }]}>{item.nomePatio}</Text>
                <Text style={[styles.patioInfo, { color: cores.textoSecundario }]}>
                  Total: {item.motosTotaisPatio} | Disponível: {item.motosDisponiveisPatio}
                </Text>
              </TouchableOpacity>
            )}
            style={styles.patioList}
          />
        </View>
      </View>
    </Modal>

    {/* Modal Pátio Origem */}
    <Modal
      visible={modalPatioOrigem}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalPatioOrigem(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecionar Pátio Origem</Text>
            <TouchableOpacity
              onPress={() => setModalPatioOrigem(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar pátio..."
            value={buscaPatio}
            onChangeText={setBuscaPatio}
          />
          
          <FlatList
            data={pátiosFiltrados}
            keyExtractor={(item) => item.idPatio.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.patioItem}
                onPress={() => selecionarPatioOrigem(item)}
              >
                <Text style={styles.patioName}>{item.nomePatio}</Text>
                <Text style={styles.patioInfo}>
                  Total: {item.motosTotaisPatio} | Disponível: {item.motosDisponiveisPatio}
                </Text>
              </TouchableOpacity>
            )}
            style={styles.patioList}
          />
        </View>
      </View>
    </Modal>

    {/* Modal Contrato */}
    <Modal
      visible={modalContrato}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalContrato(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Selecionar Contrato</Text>
            <TouchableOpacity
              onPress={() => setModalContrato(false)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar contrato por ID ou status..."
            value={buscaContrato}
            onChangeText={setBuscaContrato}
          />
          
          <FlatList
            data={contratosFiltrados}
            keyExtractor={(item) => item.idContrato.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.patioItem}
                onPress={() => selecionarContrato(item)}
              >
                <Text style={styles.patioName}>Contrato #{item.idContrato}</Text>
                <Text style={styles.patioInfo}>
                  Status: {item.ativoContrato ? 'Ativo' : 'Inativo'} | 
                  Usuário: {item.usuarioId} | 
                  Moto: {item.motoId}
                </Text>
              </TouchableOpacity>
            )}
            style={styles.patioList}
          />
        </View>
      </View>
    </Modal>
  </View>
  );
};

export default MotoFormulario;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#1f1f1f',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    padding: 8,
    backgroundColor: '#374151',
    borderRadius: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f9fafb',
    alignSelf: 'center',
  },
  saveButton: {
    padding: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 8,
  },
  form: {
    padding: 20,
    paddingBottom: 100,
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
  input: {
    backgroundColor: '#1f2937',
    padding: 12,
    borderRadius: 8,
    color: '#fff',
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#f87171',
  },
  errorText: {
    marginTop: 4,
    color: '#f87171',
    fontSize: 12,
  },
  estadoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
  },
  estadoButton: {
    padding: 10,
    borderRadius: 6,
    margin: 4,
    backgroundColor: '#1f1f1f',
  },
  estadoSelecionado: {
    backgroundColor: '#10b981',
  },
  estadoText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderTopWidth: 1,
  },
  cancelButton: {
    padding: 12,
    borderRadius: 6,
    minWidth: 140,
    alignItems: 'center',
  },
  saveButtonBottom: {
    padding: 12,
    borderRadius: 6,
    minWidth: 140,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontWeight: 'bold',
  },
  saveButtonText: {
    fontWeight: 'bold',
  },
  // Estilos para select de pátio
  selectButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectText: {
    color: '#f3f4f6',
    fontSize: 16,
  },
  // Estilos para modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f9fafb',
  },
  closeButton: {
    padding: 4,
  },
  searchInput: {
    backgroundColor: '#374151',
    padding: 12,
    borderRadius: 8,
    color: '#fff',
    marginBottom: 16,
  },
  patioList: {
    maxHeight: 300,
  },
  patioItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  patioName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f9fafb',
    marginBottom: 4,
  },
  patioInfo: {
    fontSize: 14,
    color: '#9ca3af',
  },
});
