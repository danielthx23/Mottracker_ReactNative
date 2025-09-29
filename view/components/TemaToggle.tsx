import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTema } from '../../context/TemaContext';
import { useEstilos } from '../../hooks/useEstilos';

interface TemaToggleProps {
  style?: any;
}

const TemaToggle: React.FC<TemaToggleProps> = ({ style }) => {
  const { tema, toggleTema } = useTema();
  const { cores, estilos } = useEstilos();

  return (
    <TouchableOpacity
      style={[
        estilos.botaoSecundario,
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingVertical: 8,
          paddingHorizontal: 12,
        },
        style,
      ]}
      onPress={toggleTema}
    >
      <Ionicons
        name={tema === 'claro' ? 'moon' : 'sunny'}
        size={20}
        color={cores.primaria}
        style={{ marginRight: 8 }}
      />
      <Text style={estilos.botaoSecundarioTexto}>
        {tema === 'claro' ? 'Modo Escuro' : 'Modo Claro'}
      </Text>
    </TouchableOpacity>
  );
};

export default TemaToggle;
