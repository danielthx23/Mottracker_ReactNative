import React, { useEffect, useState, useContext } from 'react';
import { View, Text } from 'react-native';
import HomeDashboard from '../components/HomeDashboard';
import { useEstilos } from '../../hooks/useEstilos';
import { ToastMessageRef } from '../components/Toast';
import { useMotoControl } from '../../control/useMotoControl';
import { usePatioControl } from '../../control/usePatioControl';
import { useCameraControl } from '../../control/useCameraControl';
import { useUsuarioControl } from '../../control/useUsuarioControl';
import { useContratoControl } from '../../control/useContratoControl';
import { useEnderecoControl } from '../../control/useEnderecoControl';
import { useLayoutPatioControl } from '../../control/useLayoutPatioControl';
import { usePermissaoControl } from '../../control/usePermissaoControl';
import { useQrCodePontoControl } from '../../control/useQrCodePontoControl';
import { useTelefoneControl } from '../../control/useTelefoneControl';
import { useUsuarioPermissaoControl } from '../../control/useUsuarioPermissaoControl';
import { salvarMoto } from '../../service/motoService';
import { salvarCamera } from '../../service/cameraService';
import { salvarPatio } from '../../service/patioService';
import { Moto } from '../../model/Moto';
import { Patio } from '../../model/Patio';
import { Camera } from '../../model/Camera';
import { ContextoPrincipal } from '../../context/ContextoPrincipal';

const HomeScreen = ({ toastRef, navigation }: {toastRef: React.RefObject<ToastMessageRef | null>, navigation: any}) => {
  const { cores } = useEstilos();
  // Acessar dados do contexto
  const { 
    motos: listaMotos, 
    patios: listaPatios, 
    cameras: listaCameras,
    usuarios: listaUsuarios,
    contratos: listaContratos,
    loading: contextoLoading
  } = useContext(ContextoPrincipal);
  
  const [dadosCarregados, setDadosCarregados] = useState(false);
  
  // Controls principais
  const { carregarLista: carregarMotos } = useMotoControl();
  const { carregarLista: carregarPatios } = usePatioControl();
  const { carregarLista: carregarCameras } = useCameraControl();
  
  // Controls adicionais para dashboard completo
  const { carregarLista: carregarUsuarios } = useUsuarioControl();
  const { carregarLista: carregarContratos } = useContratoControl();
  const { carregarLista: carregarEnderecos } = useEnderecoControl();
  const { listaLayoutPatios, carregarLista: carregarLayoutPatios } = useLayoutPatioControl();
  const { listaPermissoes, carregarLista: carregarPermissoes } = usePermissaoControl();
  const { listaQrCodePontos, carregarLista: carregarQrCodePontos } = useQrCodePontoControl();
  const { listaTelefones, carregarLista: carregarTelefones } = useTelefoneControl();
  const { listaUsuarioPermissoes, carregarLista: carregarUsuarioPermissoes } = useUsuarioPermissaoControl();


  useEffect(() => {
    // Carregar dados principais primeiro
    carregarMotos();
    
    // Aguardar um pouco antes de carregar pátios
    setTimeout(() => {
      carregarPatios();
    }, 100);
    
    // Aguardar um pouco antes de carregar câmeras
    setTimeout(() => {
      carregarCameras();
    }, 1000);
    
    // Carregar dados secundários com mais delay
    setTimeout(() => {
      carregarContratos();
      carregarEnderecos();
      carregarLayoutPatios();
      carregarPermissoes();
      carregarQrCodePontos();
      carregarTelefones();
    }, 1500);
  }, []);

  // Aguardar dados serem carregados
  useEffect(() => {
    if (listaMotos.length > 0 || listaPatios.length > 0 || listaCameras.length > 0) {
      setDadosCarregados(true);
    }
  }, [listaMotos, listaPatios, listaCameras, contextoLoading]);


  // Calcular dados das motos
  
  
  
  // Mapear estados numéricos para strings para compatibilidade
  const motosRetiradas = listaMotos.filter(moto => {
    if (typeof moto.estadoMoto === 'number') {
      return moto.estadoMoto === 2; // 2 = Retirada
    }
    return moto.estadoMoto === 'Retirada';
  }).length;
  
  const motosEmPatio = listaMotos.filter(moto => {
    if (typeof moto.estadoMoto === 'number') {
      return moto.estadoMoto === 1; // 1 = No pátio
    }
    return moto.estadoMoto === 'No pátio';
  }).length;
  
  const motosEmManutencao = listaMotos.filter(moto => {
    if (typeof moto.estadoMoto === 'number') {
      return moto.estadoMoto === 3; // 3 = No pátio errado
    }
    return moto.estadoMoto === 'No pátio errado';
  }).length;
  

  // Processar dados das câmeras
  const cameras = listaCameras.map(camera => ({
    id: camera.idCamera,
    status: (camera.status === 'Ativa' ? 'online' : 'offline') as 'online' | 'offline'
  }));

  // Processar dados dos pátios
  const patios = listaPatios.map(patio => ({
    nome: patio.nomePatio,
    quantidadeMotos: patio.motosDisponiveisPatio
  }));

  // Função criarDadosExemplo removida - não é mais necessária
  const criarDadosExemplo_removida = async () => {
    toastRef.current?.show('Info', 'Criando dados de exemplo no backend...', 'info');
    
    try {
      // Criar motos de exemplo no backend
      
      // Criar horários diferentes para o gráfico
      const now = new Date();
      const horarios = [
        new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
        new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(), // 1 hora atrás
        new Date(now.getTime() - 30 * 60 * 1000).toISOString(), // 30 minutos atrás
        new Date(now.getTime() - 15 * 60 * 1000).toISOString(), // 15 minutos atrás
        new Date(now.getTime() - 5 * 60 * 1000).toISOString(), // 5 minutos atrás
        new Date(now.getTime()).toISOString() // agora
      ];

      const motosExemplo = [
        {
          placaMoto: 'ABC1234',
          modeloMoto: 'Honda CB 600F Hornet',
          anoMoto: 2020,
          identificadorMoto: 'MOTO001',
          quilometragemMoto: 15000,
          estadoMoto: 1, // 1 = No pátio (numeric conforme backend)
          condicoesMoto: 'Bom estado, sem avarias',
          hora: horarios[0] // 2 horas atrás
        },
        {
          placaMoto: 'DEF5678',
          modeloMoto: 'Yamaha FZ-07',
          anoMoto: 2021,
          identificadorMoto: 'MOTO002',
          quilometragemMoto: 8000,
          estadoMoto: 2, // 2 = Retirada (numeric conforme backend)
          condicoesMoto: 'Excelente estado',
          hora: horarios[1] // 1 hora atrás
        },
        {
          placaMoto: 'GHI9012',
          modeloMoto: 'Kawasaki Ninja 650',
          anoMoto: 2019,
          identificadorMoto: 'MOTO003',
          quilometragemMoto: 25000,
          estadoMoto: 3, // 3 = No pátio errado (numeric conforme backend)
          condicoesMoto: 'Estado regular',
          hora: horarios[2] // 30 minutos atrás
        },
        {
          placaMoto: 'JKL3456',
          modeloMoto: 'Suzuki GSX-R 600',
          anoMoto: 2022,
          identificadorMoto: 'MOTO004',
          quilometragemMoto: 5000,
          estadoMoto: 1, // 1 = No pátio
          condicoesMoto: 'Nova, sem uso',
          hora: horarios[3] // 15 minutos atrás
        },
        {
          placaMoto: 'MNO7890',
          modeloMoto: 'Ducati Monster 696',
          anoMoto: 2018,
          identificadorMoto: 'MOTO005',
          quilometragemMoto: 32000,
          estadoMoto: 2, // 2 = Retirada
          condicoesMoto: 'Necessita revisão',
          hora: horarios[4] // 5 minutos atrás
        },
        {
          placaMoto: 'PQR2468',
          modeloMoto: 'BMW F 800 GS',
          anoMoto: 2020,
          identificadorMoto: 'MOTO006',
          quilometragemMoto: 18000,
          estadoMoto: 1, // 1 = No pátio
          condicoesMoto: 'Bom estado geral',
          hora: horarios[5] // agora
        }
      ];
      
      // Criar cada moto usando a API
      for (const moto of motosExemplo) {
        try {
          await new Promise((resolve, reject) => {
            salvarMoto(moto, (success, message, errors) => {
              if (success) {
                resolve(true);
              } else {
                console.error('❌ Erro ao criar moto:', moto.placaMoto, message);
                // Continuar mesmo com erro
                resolve(false);
              }
            });
          });
          // Delay para evitar rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error('❌ Erro na criação da moto:', moto.placaMoto, error);
          // Continuar mesmo com erro
        }
      }
      
      // Criar pátios de exemplo
      
      const patiosExemplo = [
        {
          nomePatio: 'Pátio Central - Shopping Plaza',
          motosDisponiveisPatio: 8,
          motosTotaisPatio: 12,
          dataPatio: new Date().toISOString()
        },
        {
          nomePatio: 'Pátio Norte - Terminal Rodoviário',
          motosDisponiveisPatio: 5,
          motosTotaisPatio: 8,
          dataPatio: new Date().toISOString()
        },
        {
          nomePatio: 'Pátio Sul - Aeroporto',
          motosDisponiveisPatio: 3,
          motosTotaisPatio: 6,
          dataPatio: new Date().toISOString()
        },
        {
          nomePatio: 'Pátio Leste - Centro Comercial',
          motosDisponiveisPatio: 4,
          motosTotaisPatio: 7,
          dataPatio: new Date().toISOString()
        }
      ];
      
      for (const patio of patiosExemplo) {
        try {
          await new Promise((resolve, reject) => {
            salvarPatio(patio, (success, message, errors) => {
              if (success) {
                resolve(true);
              } else {
                console.error('❌ Erro ao criar pátio:', patio.nomePatio, message);
                resolve(false);
              }
            });
          });
          // Delay para evitar rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error('❌ Erro na criação do pátio:', patio.nomePatio, error);
        }
      }
      
      // Criar câmeras de exemplo
      
      const camerasExemplo = [
        {
          nomeCamera: 'Câmera Principal - Entrada Principal',
          ipCamera: '192.168.1.100',
          status: 'Ativa', // 0 = Ativa (numeric conforme backend)
          posX: 100,
          posY: 200,
          patioId: 1
        },
        {
          nomeCamera: 'Câmera Entrada - Portão Norte',
          ipCamera: '192.168.1.101',
          status: 'Ativa', // 0 = Ativa (numeric conforme backend)
          posX: 150,
          posY: 250,
          patioId: 1
        },
        {
          nomeCamera: 'Câmera Saída - Portão Sul',
          ipCamera: '192.168.1.102',
          status: 'Inativa', // 1 = Inativa (numeric conforme backend)
          posX: 200,
          posY: 300,
          patioId: 2
        },
        {
          nomeCamera: 'Câmera Estacionamento - Área A',
          ipCamera: '192.168.1.103',
          status: 'Ativa', // 0 = Ativa
          posX: 80,
          posY: 180,
          patioId: 1
        },
        {
          nomeCamera: 'Câmera Segurança - Torre Central',
          ipCamera: '192.168.1.104',
          status: 'Ativa', // 0 = Ativa
          posX: 300,
          posY: 150,
          patioId: 2
        },
        {
          nomeCamera: 'Câmera Monitoramento - Zona Oeste',
          ipCamera: '192.168.1.105',
          status: 'Inativa', // 1 = Inativa
          posX: 250,
          posY: 400,
          patioId: 3
        }
      ];
      
      for (const camera of camerasExemplo) {
        try {
          await new Promise((resolve, reject) => {
            salvarCamera(camera, (success, message, errors) => {
              if (success) {
                resolve(true);
              } else {
                console.error('❌ Erro ao criar câmera:', camera.nomeCamera, message);
                resolve(false);
              }
            });
          });
          // Delay para evitar rate limiting
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.error('❌ Erro na criação da câmera:', camera.nomeCamera, error);
        }
      }
      
      toastRef.current?.show('Sucesso', 'Dados de exemplo criados no backend!', 'success');
      
      // Aguardar um pouco para o backend processar
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Recarregar todos os dados para mostrar os novos dados
      carregarMotos();
      carregarPatios();
      carregarCameras();
      carregarUsuarios();
      carregarContratos();
      carregarEnderecos();
      carregarLayoutPatios();
      carregarPermissoes();
      carregarQrCodePontos();
      carregarTelefones();
      carregarUsuarioPermissoes();
      
      // Aguardar mais um pouco e recarregar novamente
      setTimeout(() => {
        carregarMotos();
        carregarPatios();
        carregarCameras();
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao criar dados de exemplo:', error);
      toastRef.current?.show('Erro', 'Erro ao criar dados de exemplo', 'danger');
    }
  };

  // Mostrar loading enquanto dados não são carregados
  if (!dadosCarregados && listaMotos.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: cores.fundo }}>
        <Text style={{ color: cores.texto, fontSize: 18 }}>Carregando dados...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: cores.fundo }}>
      <HomeDashboard
        motosRetiradas={motosRetiradas}
        motosEmPatio={motosEmPatio}
        motosEmManutencao={motosEmManutencao}
        cameras={cameras}
        patios={patios}
        toastRef={toastRef}
        navigation={navigation}
        // onCreateSampleData removido - botão de criar dados de exemplo removido
      />
    </View>
  );
};

export default HomeScreen;
