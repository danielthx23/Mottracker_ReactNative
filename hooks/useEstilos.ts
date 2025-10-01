import { StyleSheet } from 'react-native';
import { useTema } from '../context/TemaContext';

export const useEstilos = () => {
  const { cores } = useTema();

  const estilos = StyleSheet.create({
    // Container principal
    container: {
      flex: 1,
      backgroundColor: cores.fundo,
    },
    
    // Cards
    card: {
      backgroundColor: cores.fundoCard,
      borderRadius: 12,
      padding: 16,
      marginVertical: 8,
      marginHorizontal: 16,
      shadowColor: cores.texto,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    
    // Títulos
    titulo: {
      fontSize: 24,
      fontWeight: 'bold',
      color: cores.texto,
      marginBottom: 16,
    },
    
    subtitulo: {
      fontSize: 18,
      fontWeight: '600',
      color: cores.texto,
      marginBottom: 12,
    },
    
    // Textos
    texto: {
      fontSize: 16,
      color: cores.texto,
    },
    
    textoSecundario: {
      fontSize: 14,
      color: cores.textoSecundario,
    },
    
    textoInvertido: {
      fontSize: 16,
      color: cores.textoInvertido,
    },
    
    // Botões
    botaoPrimario: {
      backgroundColor: cores.primaria,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    botaoSecundario: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: cores.primaria,
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    
    botaoTexto: {
      color: cores.textoInvertido,
      fontSize: 16,
      fontWeight: '600',
    },
    
    botaoSecundarioTexto: {
      color: cores.primaria,
      fontSize: 16,
      fontWeight: '600',
    },
    
    // Inputs
    input: {
      backgroundColor: cores.fundoCard,
      borderWidth: 1,
      borderColor: cores.borda,
      borderRadius: 8,
      paddingVertical: 12,
      paddingHorizontal: 16,
      fontSize: 16,
      color: cores.texto,
    },
    
    inputFoco: {
      borderColor: cores.bordaFoco,
    },
    
    // Status
    statusAtivo: {
      backgroundColor: cores.statusAtivo,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 4,
    },
    
    statusInativo: {
      backgroundColor: cores.statusInativo,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 4,
    },
    
    statusPendente: {
      backgroundColor: cores.statusPendente,
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 4,
    },
    
    // Listas
    itemLista: {
      backgroundColor: cores.fundoCard,
      padding: 16,
      marginVertical: 4,
      marginHorizontal: 16,
      borderRadius: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    
    // Modal
    modalOverlay: {
      flex: 1,
      backgroundColor: cores.fundoModal,
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    modalContent: {
      backgroundColor: cores.fundo,
      borderRadius: 12,
      padding: 20,
      margin: 20,
      maxHeight: '80%',
      width: '90%',
    },
    
    // Header
    header: {
      backgroundColor: cores.fundo,
      borderBottomWidth: 1,
      borderBottomColor: cores.borda,
      paddingVertical: 16,
      paddingHorizontal: 20,
    },
    
    // Tabs
    tabContainer: {
      flexDirection: 'row',
      backgroundColor: cores.fundoCard,
      borderRadius: 8,
      margin: 16,
      padding: 4,
    },
    
    tab: {
      flex: 1,
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderRadius: 6,
      alignItems: 'center',
    },
    
    tabAtivo: {
      backgroundColor: cores.primaria,
    },
    
    tabTexto: {
      fontSize: 14,
      fontWeight: '600',
      color: cores.textoSecundario,
    },
    
    tabTextoAtivo: {
      color: cores.textoInvertido,
    },
    
    // Loading
    loading: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: cores.fundo,
    },
    
    // Erro
    erro: {
      backgroundColor: cores.erro,
      padding: 12,
      borderRadius: 8,
      margin: 16,
    },
    
    erroTexto: {
      color: cores.textoInvertido,
      fontSize: 14,
      textAlign: 'center',
    },
    
    // Sucesso
    sucesso: {
      backgroundColor: cores.sucesso,
      padding: 12,
      borderRadius: 8,
      margin: 16,
    },
    
    sucessoTexto: {
      color: cores.textoInvertido,
      fontSize: 14,
      textAlign: 'center',
    },
  });

  return { cores, estilos };
};


