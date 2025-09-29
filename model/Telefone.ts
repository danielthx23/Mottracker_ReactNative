import { Usuario } from './Usuario';

export type TipoTelefone = 'Celular' | 'Residencial' | 'Comercial';

export interface Telefone {
    idTelefone: number;
    numeroTelefone: string;
    tipoTelefone: TipoTelefone;
    usuarioId: number;
    // Relacionamentos
    usuario?: Usuario;
}


// DTOs for API communication
export interface TelefoneDto {
    idTelefone: number;
    numeroTelefone: string;
    tipoTelefone: string;
    usuarioId: number;
}

export interface TelefoneCreateDto {
    numeroTelefone: string;
    tipoTelefone: string;
    usuarioId: number;
}

export interface TelefoneUpdateDto {
    numeroTelefone?: string;
    tipoTelefone?: string;
    usuarioId?: number;
}
