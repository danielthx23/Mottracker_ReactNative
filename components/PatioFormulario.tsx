import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Patio {
  idPatio: number;
  nomePatio: string;
  motosTotaisPatio: number;
  motosDisponiveisPatio: number;
  dataPatio: Date;
}

interface PatioFormularioProps {
  patio?: Patio;
  onSalvar: (patio: Patio) => void;
  onCancelar: () => void;
}

const PatioFormulario: React.FC<PatioFormularioProps> = ({
  patio,
  onSalvar,
  onCancelar,
}) => {
  const [nomePatio, setNomePatio] = useState('');
  const [capacidadeTotal, setCapacidadeTotal] = useState('');
  const [vagasDisponiveis, setVagasDisponiveis] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const isEditing = !!patio;

  useEffect(() => {
    if (patio) {
      setNomePatio(patio.nomePatio);
      setCapacidadeTotal(patio.motosTotaisPatio.toString());
      setVagasDisponiveis(patio.motosDisponiveisPatio.toString());
    }
  }, [patio]);

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
    };

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

  const preencherAutomatico = () => {
    const capacidade = parseInt(capacidadeTotal) || 0;
    if (capacidade > 0) {
      const sugestao = Math.floor(capacidade * (0.2 + Math.random() * 0.6));
      setVagasDisponiveis(sugestao.toString());
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancelar} style={styles.backButton}>
          <Ionicons name="close" size={24} color="#f9fafb" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditing ? 'Editar Pátio' : 'Novo Pátio'}
        </Text>
        <TouchableOpacity onPress={handleSalvar} style={styles.saveButton}>
          <Ionicons name="checkmark" size={24} color="#10b981" />
        </TouchableOpacity>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nome do Pátio *</Text>
          <TextInput
            style={[styles.input, errors.nomePatio ? styles.inputError : undefined]}
            value={nomePatio}
            onChangeText={setNomePatio}
            placeholder="Ex: Pátio Central, Estacionamento Norte..."
            placeholderTextColor="#6b7280"
            maxLength={50}
          />
          {errors.nomePatio && (
            <Text style={styles.errorText}>{errors.nomePatio}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Capacidade Total *</Text>
            <Text style={styles.hint}>máx: 1000</Text>
          </View>
          <TextInput
            style={[styles.input, errors.capacidadeTotal ? styles.inputError : undefined]}
            value={capacidadeTotal}
            onChangeText={setCapacidadeTotal}
            placeholder="Ex: 100"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            maxLength={4}
          />
          {errors.capacidadeTotal && (
            <Text style={styles.errorText}>{errors.capacidadeTotal}</Text>
          )}
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Vagas Disponíveis *</Text>
            <TouchableOpacity onPress={preencherAutomatico} style={styles.autoFillButton}>
              <Ionicons name="refresh" size={16} color="#3b82f6" />
              <Text style={styles.autoFillText}>Sugerir</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, errors.vagasDisponiveis ? styles.inputError : undefined]}
            value={vagasDisponiveis}
            onChangeText={setVagasDisponiveis}
            placeholder="Ex: 80"
            placeholderTextColor="#6b7280"
            keyboardType="numeric"
            maxLength={4}
          />
          {errors.vagasDisponiveis && (
            <Text style={styles.errorText}>{errors.vagasDisponiveis}</Text>
          )}
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="information-circle" size={20} color="#3b82f6" />
            <Text style={styles.infoText}>
              As vagas disponíveis representam quantas motos podem ser estacionadas no momento
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Ionicons name="time" size={20} color="#10b981" />
            <Text style={styles.infoText}>
              {isEditing ? 'Última atualização: ' + patio?.dataPatio.toLocaleDateString() : 'Será criado hoje'}
            </Text>
          </View>
        </View>

        {capacidadeTotal && vagasDisponiveis && (
          <View style={styles.previewCard}>
            <Text style={styles.previewTitle}>Prévia do Status</Text>
            <View style={styles.previewStats}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{vagasDisponiveis}</Text>
                <Text style={styles.statLabel}>Disponíveis</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {parseInt(capacidadeTotal) - parseInt(vagasDisponiveis)}
                </Text>
                <Text style={styles.statLabel}>Ocupadas</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{capacidadeTotal}</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
            </View>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${(parseInt(vagasDisponiveis) / parseInt(capacidadeTotal)) * 100}%`,
                    backgroundColor: parseInt(vagasDisponiveis) / parseInt(capacidadeTotal) > 0.5 ? '#10b981' : '#f59e0b'
                  }
                ]} 
              />
            </View>
          </View>
        )}
      </View>

      <View style={styles.bottomActions}>
        <TouchableOpacity onPress={handleCancelar} style={styles.cancelButton}>
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSalvar} style={styles.saveButtonBottom}>
          <Text style={styles.saveButtonText}>
            {isEditing ? 'Salvar Alterações' : 'Criar Pátio'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b0b0b',
    paddingBottom: 100
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1f1f1f',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#374151',
  },
  saveButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#f9fafb',
  },
  form: {
    padding: 20,
    paddingBottom: 100,
  },
  inputGroup: {
    marginBottom: 24,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f3f4f6',
    marginBottom: 8,
  },
  hint: {
    fontSize: 12,
    color: '#9ca3af',
  },
  input: {
    backgroundColor: '#1f1f1f',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#f3f4f6',
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginTop: 6,
    marginLeft: 4,
  },
  autoFillButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  autoFillText: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#374151',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  infoText: {
    color: '#9ca3af',
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  previewCard: {
    backgroundColor: '#1f1f1f',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#374151',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#f3f4f6',
    marginBottom: 16,
  },
  previewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f3f4f6',
  },
  statLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#374151',
    marginHorizontal: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#374151',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
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

export default PatioFormulario;