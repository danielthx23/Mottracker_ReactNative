// Common types and enums used across the application

export enum StatusCode {
    OK = 200,
    CREATED = 201,
    NO_CONTENT = 204,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500,
}

export enum SortDirection {
    ASC = 'asc',
    DESC = 'desc',
}

export interface BaseEntity {
    id: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface Timestamps {
    createdAt: Date;
    updatedAt: Date;
}

// Common validation patterns
export const ValidationPatterns = {
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    CPF: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
    CNH: /^\d{11}$/,
    PLACA: /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/,
    CEP: /^\d{5}-?\d{3}$/,
    TELEFONE: /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
} as const;

// Common error messages
export const ErrorMessages = {
    REQUIRED_FIELD: 'Este campo é obrigatório',
    INVALID_EMAIL: 'Email inválido',
    INVALID_CPF: 'CPF inválido',
    INVALID_CNH: 'CNH inválida',
    INVALID_PLACA: 'Placa inválida',
    INVALID_CEP: 'CEP inválido',
    INVALID_TELEFONE: 'Telefone inválido',
    NOT_FOUND: 'Registro não encontrado',
    UNAUTHORIZED: 'Não autorizado',
    FORBIDDEN: 'Acesso negado',
    INTERNAL_ERROR: 'Erro interno do servidor',
} as const;

