import { Contrato } from './Contrato';

export enum Estados {
    Retirada = 'Retirada',
    NoPatio = 'No pátio',
    NoPatioErrado = 'No pátio errado',
    NaoDevolvida = 'Não devolvida',
}

export interface Moto {
    idMoto: number;
    placaMoto: string;
    modeloMoto: string;
    anoMoto: number;
    identificadorMoto: string;
    quilometragemMoto: number;
    estadoMoto: Estados;
    condicoesMoto?: string;
    contratoMotoId?: number;
    motoPatioAtualId?: number;
    motoPatioOrigemId?: number;
    hora: string;
    // Relacionamentos
    contratos?: Contrato[];
}


// DTOs for API communication
export interface MotoDto {
    idMoto: number;
    placaMoto: string;
    modeloMoto: string;
    anoMoto: number;
    identificadorMoto: string;
    quilometragemMoto: number;
    estadoMoto: string;
    condicoesMoto?: string;
    hora: string;
}

export interface MotoCreateDto {
    placaMoto: string;
    modeloMoto: string;
    anoMoto: number;
    identificadorMoto: string;
    quilometragemMoto: number;
    estadoMoto: number;
    condicoesMoto?: string;
    contratoMotoId?: number;
    motoPatioAtualId?: number;
    motoPatioOrigemId?: number;
    hora?: string;
}

export interface MotoUpdateDto {
    placaMoto?: string;
    modeloMoto?: string;
    anoMoto?: number;
    identificadorMoto?: string;
    quilometragemMoto?: number;
    estadoMoto?: number;
    condicoesMoto?: string;
    hora?: string;
}

// Schema de validação para Moto
import * as yup from 'yup';

export const motoSchema = yup.object().shape({
    placaMoto: yup.string().required('Placa é obrigatória').matches(/^[A-Z]{3}\d{4}$/, 'Placa deve estar no formato ABC1234'),
    modeloMoto: yup.string().required('Modelo é obrigatório').min(2, 'Modelo deve ter pelo menos 2 caracteres'),
    anoMoto: yup.number().required('Ano é obrigatório').min(1900, 'Ano deve ser maior que 1900').max(new Date().getFullYear() + 1, 'Ano não pode ser futuro'),
    identificadorMoto: yup.string().min(3, 'Identificador deve ter pelo menos 3 caracteres'),
    quilometragemMoto: yup.number().required('Quilometragem é obrigatória').min(0, 'Quilometragem deve ser positiva'),
    estadoMoto: yup.string().required('Estado é obrigatório').oneOf(['Retirada', 'No pátio', 'No pátio errado', 'Não devolvida'], 'Estado deve ser válido'),
    condicoesMoto: yup.string(),
    hora: yup.string().required('Hora é obrigatória')
});

export const motoCreateSchema = yup.object().shape({
    placaMoto: yup.string().required('Placa é obrigatória').matches(/^[A-Z]{3}\d{4}$/, 'Placa deve estar no formato ABC1234'),
    modeloMoto: yup.string().required('Modelo é obrigatório').min(2, 'Modelo deve ter pelo menos 2 caracteres'),
    anoMoto: yup.number().required('Ano é obrigatório').min(1900, 'Ano deve ser maior que 1900').max(new Date().getFullYear() + 1, 'Ano não pode ser futuro'),
    identificadorMoto: yup.string().min(3, 'Identificador deve ter pelo menos 3 caracteres'),
    quilometragemMoto: yup.number().required('Quilometragem é obrigatória').min(0, 'Quilometragem deve ser positiva'),
    estadoMoto: yup.string().required('Estado é obrigatório').oneOf(['Retirada', 'No pátio', 'No pátio errado', 'Não devolvida'], 'Estado deve ser válido'),
    condicoesMoto: yup.string(),
    hora: yup.string().required('Hora é obrigatória')
});

export const motoUpdateSchema = yup.object().shape({
    placaMoto: yup.string().matches(/^[A-Z]{3}\d{4}$/, 'Placa deve estar no formato ABC1234'),
    modeloMoto: yup.string().min(2, 'Modelo deve ter pelo menos 2 caracteres'),
    anoMoto: yup.number().min(1900, 'Ano deve ser maior que 1900').max(new Date().getFullYear() + 1, 'Ano não pode ser futuro'),
    identificadorMoto: yup.string().min(3, 'Identificador deve ter pelo menos 3 caracteres'),
    quilometragemMoto: yup.number().min(0, 'Quilometragem deve ser positiva'),
    estadoMoto: yup.string().oneOf(['Retirada', 'No pátio', 'No pátio errado', 'Não devolvida'], 'Estado deve ser válido'),
    condicoesMoto: yup.string(),
    hora: yup.string()
});
  