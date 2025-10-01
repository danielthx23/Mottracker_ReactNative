# **Mottracker** - Sistema de gerenciamento e rastreamento de motocicletas em pátios

## Proposta e Funcionalidades

O Mottracker é um aplicativo mobile desenvolvido em React Native para gerenciamento completo de motocicletas em pátios de estacionamento. O sistema oferece:

### Funcionalidades Principais:
- **Dashboard Inteligente**: Visualização em tempo real do status das motos (retiradas, no pátio, em manutenção)
- **Gerenciamento de Motos**: Cadastro, edição e controle de motocicletas com informações detalhadas
- **Controle de Pátios**: Gerenciamento de pátios com capacidade e disponibilidade de vagas
- **Sistema de Câmeras**: Monitoramento por câmeras com status online/offline
- **Autenticação de Usuários**: Sistema completo de login e registro com validações
- **Contratos**: Gestão de contratos de locação com controle de datas e renovações
- **Endereços**: Cadastro e gerenciamento de endereços dos pátios
- **Permissões**: Sistema de permissões para diferentes tipos de usuários
- **QR Code**: Sistema de pontos com QR Code para identificação
- **Telefones**: Cadastro de telefones de contato
- **Layout de Pátios**: Visualização e gerenciamento do layout dos pátios

### Características Técnicas:
- **Interface Responsiva**: Design moderno com suporte a tema claro/escuro
- **Navegação Intuitiva**: Sistema de navegação com drawer e stack navigation
- **Validação Robusta**: Validação de dados com Yup e tratamento de erros
- **Arquitetura Limpa**: Separação clara entre models, services, controls e views
- **Context API**: Gerenciamento de estado global com React Context
- **Integração Backend**: Comunicação completa com API REST
- **TypeScript**: Tipagem forte em toda a aplicação

## Estrutura de Pastas

```
Mottracker_ReactNative/
├── android/                          # Configurações Android
│   ├── app/
│   │   ├── build.gradle
│   │   └── src/
│   └── gradle/
├── assets/                           # Recursos estáticos
│   ├── icon.png
│   ├── splash-icon.png
│   └── adaptive-icon.png
├── context/                          # Contextos React
│   ├── TemaContext.tsx              # Contexto de tema
│   └── UsuarioContext.tsx           # Contexto de usuário
├── contexto/                         # Contexto principal
│   ├── ContextoPrincipal.tsx        # Contexto global da aplicação
│   └── README.md
├── control/                          # Hooks de controle
│   ├── useCameraControl.ts          # Controle de câmeras
│   ├── useContratoControl.ts        # Controle de contratos
│   ├── useEnderecoControl.ts        # Controle de endereços
│   ├── useLayoutPatioControl.ts     # Controle de layout de pátios
│   ├── useMotoControl.ts            # Controle de motos
│   ├── usePatioControl.ts           # Controle de pátios
│   ├── usePermissaoControl.ts       # Controle de permissões
│   ├── useQrCodePontoControl.ts     # Controle de QR codes
│   ├── useTelefoneControl.ts        # Controle de telefones
│   ├── useUsuarioControl.ts         # Controle de usuários
│   └── useUsuarioPermissaoControl.ts # Controle de permissões de usuário
├── fetcher/                          # Camada de comunicação com API
│   ├── CameraFetcher.ts             # Fetcher de câmeras
│   ├── ContratoFetcher.ts           # Fetcher de contratos
│   ├── EnderecoFetcher.ts           # Fetcher de endereços
│   ├── LayoutPatioFetcher.ts        # Fetcher de layout de pátios
│   ├── MotoFetcher.ts               # Fetcher de motos
│   ├── PatioFetcher.ts              # Fetcher de pátios
│   ├── PermissaoFetcher.ts          # Fetcher de permissões
│   ├── QrCodePontoFetcher.ts        # Fetcher de QR codes
│   ├── TelefoneFetcher.ts           # Fetcher de telefones
│   ├── UsuarioFetcher.ts            # Fetcher de usuários
│   └── UsuarioPermissaoFetcher.ts   # Fetcher de permissões de usuário
├── hooks/                            # Hooks customizados
│   └── useEstilos.ts                # Hook de estilos
├── model/                            # Modelos de dados
│   ├── ApiResponse.ts               # Modelo de resposta da API
│   ├── Camera.ts                    # Modelo de câmera
│   ├── Common.ts                    # Modelos comuns
│   ├── Contrato.ts                  # Modelo de contrato
│   ├── Endereco.ts                  # Modelo de endereço
│   ├── LayoutPatio.ts               # Modelo de layout de pátio
│   ├── Moto.ts                      # Modelo de moto
│   ├── Patio.ts                     # Modelo de pátio
│   ├── Permissao.ts                 # Modelo de permissão
│   ├── QrCodePonto.ts               # Modelo de QR code
│   ├── Telefone.ts                  # Modelo de telefone
│   ├── Usuario.ts                   # Modelo de usuário
│   ├── UsuarioPermissao.ts         # Modelo de permissão de usuário
│   └── index.ts                     # Exportações dos modelos
├── navegacao/                        # Configuração de navegação
│   ├── App.tsx                      # App principal de navegação
│   ├── AppNavigator.tsx             # Navegador principal
│   ├── BottomTabNavigator.tsx       # Navegador de abas
│   ├── CameraNavigator.tsx          # Navegador de câmeras
│   ├── ContratoNavigator.tsx        # Navegador de contratos
│   ├── EnderecoNavigator.tsx        # Navegador de endereços
│   ├── LayoutPatioNavigator.tsx     # Navegador de layout de pátios
│   ├── MainNavigator.tsx            # Navegador principal
│   ├── MotoNavigator.tsx            # Navegador de motos
│   ├── navigationDefinition.ts      # Definições de navegação
│   ├── PatioNavigator.tsx           # Navegador de pátios
│   ├── PermissaoNavigator.tsx       # Navegador de permissões
│   ├── QrCodePontoNavigator.tsx     # Navegador de QR codes
│   ├── TelefoneNavigator.tsx        # Navegador de telefones
│   ├── UsuarioNavigator.tsx         # Navegador de usuários
│   └── UsuarioPermissaoNavigator.tsx # Navegador de permissões de usuário
├── service/                          # Camada de serviços
│   ├── cameraService.ts             # Serviço de câmeras
│   ├── contratoService.ts           # Serviço de contratos
│   ├── enderecoService.ts           # Serviço de endereços
│   ├── layoutPatioService.ts        # Serviço de layout de pátios
│   ├── motoService.ts               # Serviço de motos
│   ├── patioService.ts              # Serviço de pátios
│   ├── permissaoService.ts          # Serviço de permissões
│   ├── qrCodePontoService.ts        # Serviço de QR codes
│   ├── telefoneService.ts           # Serviço de telefones
│   ├── usuarioPermissaoService.ts   # Serviço de permissões de usuário
│   ├── usuarioService.ts            # Serviço de usuários
│   ├── README.md                    # Documentação dos serviços
│   └── EXEMPLO_USO.md               # Exemplos de uso dos serviços
├── view/                            # Camada de apresentação
│   ├── components/                  # Componentes reutilizáveis
│   │   ├── HomeDashboard.tsx       # Dashboard principal
│   │   ├── MotoDetalhes.tsx         # Detalhes da moto
│   │   ├── MotoFormulario.tsx       # Formulário de moto
│   │   ├── MotoListagem.tsx         # Listagem de motos
│   │   ├── PatioDetalhes.tsx        # Detalhes do pátio
│   │   ├── PatioFormulario.tsx      # Formulário de pátio
│   │   ├── PatioFormularioCompleto.tsx # Formulário completo de pátio
│   │   ├── PatioListagem.tsx        # Listagem de pátios
│   │   ├── PingCircle.tsx           # Componente de ping
│   │   ├── TemaToggle.tsx           # Toggle de tema
│   │   ├── Toast.tsx                # Componente de notificação
│   │   ├── UsuarioLoginFormulario.tsx # Formulário de login
│   │   └── UsuarioRegisterFormulario.tsx # Formulário de registro
│   └── screens/                     # Telas da aplicação
│       ├── HomeScreen.tsx           # Tela inicial
│       ├── MotoScreen.tsx           # Tela de motos
│       ├── PatioScreen.tsx          # Tela de pátios
│       └── UsuarioScreen.tsx        # Tela de usuários
├── web/                             # Configurações web
│   └── static/
├── App.tsx                          # Componente principal
├── app.json                         # Configuração do Expo
├── package.json                     # Dependências do projeto
├── tsconfig.json                    # Configuração TypeScript
└── README.md                        # Este arquivo
```

## Integrantes do Projeto

- **Nome**: Daniel Saburo Akiyama
- **RM**: RM558263
- **GitHub**: https://github.com/danielthx23

- **Nome**: Danilo Correia e Silva
- **RM**: RM557540
- **GitHub**: https://github.com/dan25ak1

- **Nome**: João Pedro Rodrigues
- **RM**: RM558199
- **GitHub**: https://github.com/Joao-Pedro-R

---

## Tecnologias Utilizadas

- **React Native**: Framework para desenvolvimento mobile
- **TypeScript**: Linguagem de programação com tipagem estática
- **Expo**: Plataforma para desenvolvimento React Native
- **React Navigation**: Navegação entre telas
- **Context API**: Gerenciamento de estado
- **Yup**: Validação de formulários
- **Axios**: Cliente HTTP para comunicação com API
- **Victory Native**: Biblioteca de gráficos
- **AsyncStorage**: Armazenamento local
- **React Native Reanimated**: Animações
- **React Native Gesture Handler**: Gestos
- **React Native Safe Area Context**: Área segura
- **React Native Screens**: Otimização de telas
- **React Native SVG**: Gráficos vetoriais
- **React Native Tab View**: Visualização em abas
- **React Native UUID**: Geração de UUIDs
- **Lodash**: Utilitários JavaScript

## Como Executar o Projeto

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Executar no Android**:
   ```bash
   npm run android
   ```

3. **Executar no iOS**:
   ```bash
   npm run ios
   ```

4. **Executar no Web**:
   ```bash
   npm run web
   ```

5. **Iniciar servidor de desenvolvimento**:
   ```bash
   npm start
   ```

## Funcionalidades Implementadas

✅ **Sistema de Autenticação**
- Login e registro de usuários
- Validação de dados com Yup
- Gerenciamento de sessão

✅ **Dashboard Inteligente**
- Visualização em tempo real do status das motos
- Gráficos de distribuição por pátio
- Status das câmeras (online/offline)

✅ **Gerenciamento de Motos**
- CRUD completo de motocicletas
- Controle de estado (retirada, no pátio, em manutenção)
- Validação de placa e dados

✅ **Controle de Pátios**
- Gerenciamento de pátios
- Controle de capacidade e disponibilidade
- Layout visual dos pátios

✅ **Sistema de Câmeras**
- Monitoramento por câmeras
- Status online/offline
- Posicionamento no layout

✅ **Arquitetura Limpa**
- Separação de responsabilidades
- Services com validação automática
- Context API para estado global
- TypeScript em toda aplicação

## Próximas Funcionalidades

🔄 **Em Desenvolvimento**:
- Sistema de notificações push
- Relatórios avançados
- Integração com GPS
- Sistema de alertas

📋 **Planejado**:
- Modo offline
- Sincronização automática
- Backup de dados
- Analytics avançados

# Video Demonstração

