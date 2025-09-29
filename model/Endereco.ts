import { Patio } from './Patio';

export interface Endereco {
    idEndereco: number;
    cepEndereco: string;
    logradouroEndereco: string;
    numeroEndereco: string;
    bairroEndereco: string;
    cidadeEndereco: string;
    estadoEndereco: string;
    complementoEndereco?: string;
    patioId?: number;
    // Relacionamentos
    patio?: Patio;
}


// DTOs for API communication
export interface EnderecoDto {
    idEndereco: number;
    cepEndereco: string;
    logradouroEndereco: string;
    numeroEndereco: string;
    bairroEndereco: string;
    cidadeEndereco: string;
    estadoEndereco: string;
    complementoEndereco?: string;
    patioId?: number;
}

export interface EnderecoCreateDto {
    cepEndereco: string;
    logradouroEndereco: string;
    numeroEndereco: string;
    bairroEndereco: string;
    cidadeEndereco: string;
    estadoEndereco: string;
    complementoEndereco?: string;
    patioId?: number;
}

export interface EnderecoUpdateDto {
    cepEndereco?: string;
    logradouroEndereco?: string;
    numeroEndereco?: string;
    bairroEndereco?: string;
    cidadeEndereco?: string;
    estadoEndereco?: string;
    complementoEndereco?: string;
    patioId?: number;
}
