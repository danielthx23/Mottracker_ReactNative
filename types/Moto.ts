enum Estados {
    Retirada = 'Retirada',
    NoPatio = 'No pátio',
    NoPatioErrado = 'No pátio errado',
    NaoDevolvida = 'Não devolvida',
}
  
interface Moto {
    idMoto: number;
    placaMoto: string;
    modeloMoto: string;
    anoMoto: number;
    identificadorMoto?: string;
    quilometragemMoto: number;
    estadoMoto: Estados;
    condicoesMoto?: string;
    hora: string;
}

export default Moto;