import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Moto, Estados } from '../types/Moto';

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
  const [modelo, setModelo] = useState('');
  const [placa, setPlaca] = useState('');
  const [ano, setAno] = useState('');
  const [quilometragem, setQuilometragem] = useState('');
  const [estado, setEstado] = useState<Estados>(Estados.NoPatio);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isEditing = !!moto;

  useEffect(() => {
    if (moto) {
      setModelo(moto.modeloMoto || '');
      setPlaca(moto.placaMoto || '');
      setAno(moto.anoMoto?.toString() || '');
      setQuilometragem(moto.quilometragemMoto?.toString() || '');
      setEstado(moto.estadoMoto || Estados.NoPatio);
    }
  }, [moto]);

  const validarCampos = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!modelo.trim()) newErrors.modelo = 'Modelo é obrigatório';
    if (!placa.trim()) newErrors.placa = 'Placa é obrigatória';
    if (!ano || isNaN(Number(ano))) newErrors.ano = 'Ano inválido';
    if (!quilometragem || isNaN(Number(quilometragem))) newErrors.quilometragem = 'Quilometragem inválida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSalvar = () => {
    if (!validarCampos()) return;
    const motoData: Moto = {
      idMoto: moto?.idMoto || 0,
      modeloMoto: modelo.trim(),
      placaMoto: placa.trim(),
      anoMoto: parseInt(ano),
      quilometragemMoto: parseInt(quilometragem),
      estadoMoto: estado,
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

  const renderInput = (
    label: string,
    value: string,
    onChange: (v: string) => void,
    key: string,
    keyboardType?: 'default' | 'numeric'
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, errors[key] ? styles.inputError : undefined]}
        value={value}
        onChangeText={onChange}
        placeholder={`Digite o ${label.toLowerCase()}`}
        placeholderTextColor="#6b7280"
        keyboardType={keyboardType}
      />
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancelar} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#f9fafb" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Editar Moto' : 'Nova Moto'}
        </Text>
        <TouchableOpacity onPress={handleSalvar} style={styles.saveButton}>
          <Ionicons name="checkmark" size={24} color="#10b981" />
        </TouchableOpacity>
      </View>

      {/* Form */}
      <View style={styles.form}>
        {renderInput('Modelo', modelo, setModelo, 'modelo')}
        {renderInput('Placa', placa, setPlaca, 'placa')}
        {renderInput('Ano', ano, setAno, 'ano', 'numeric')}
        {renderInput('Quilometragem', quilometragem, setQuilometragem, 'quilometragem', 'numeric')}

        {/* Estado */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Estado da Moto</Text>
          <View style={styles.estadoContainer}>
            {(Object.values(Estados) as Estados[]).map((e) => (
              <TouchableOpacity
                key={e}
                onPress={() => setEstado(e)}
                style={[styles.estadoButton, estado === e && styles.estadoSelecionado]}
              >
                <Text style={styles.estadoText}>{e}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity onPress={handleCancelar} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSalvar} style={styles.saveButtonBottom}>
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Salvar Alterações' : 'Salvar Moto'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    borderTopColor: '#1f2937',
    backgroundColor: '#111827',
  },
  cancelButton: {
    backgroundColor: '#ef4444',
    padding: 12,
    borderRadius: 6,
    minWidth: 140,
    alignItems: 'center',
  },
  saveButtonBottom: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 6,
    minWidth: 140,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  saveButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
