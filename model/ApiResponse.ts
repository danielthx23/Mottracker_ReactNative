// Generic API Response types
export interface ApiResponse<T> {
    data: T;
    success: boolean;
    message?: string;
    errors?: string[];
}

export interface PaginatedResponse<T> {
    data: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface ApiError {
    message: string;
    statusCode: number;
    details?: any;
}

// Common query parameters for filtering
export interface BaseQueryParams {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: 'asc' | 'desc';
}

// Specific query parameters for each entity
export interface CameraQueryParams extends BaseQueryParams {
    nome?: string;
    status?: string;
}

export interface MotoQueryParams extends BaseQueryParams {
    placa?: string;
    estado?: string;
    contratoId?: number;
}

export interface PatioQueryParams extends BaseQueryParams {
    nome?: string;
    motosDisponiveisMin?: number;
    dataInicio?: Date;
    dataFim?: Date;
}

export interface UsuarioQueryParams extends BaseQueryParams {
    nome?: string;
    email?: string;
    cpf?: string;
}

export interface ContratoQueryParams extends BaseQueryParams {
    ativo?: boolean;
    usuarioId?: number;
    motoId?: number;
    dataInicio?: Date;
    dataFim?: Date;
    renovacaoAutomatica?: boolean;
}

