import { Usuario } from './Usuario';
import { Moto } from './Moto';

export interface Contrato {
    idContrato: number;
    ativoContrato: boolean;
    dataEntradaContrato: Date;
    dataSaidaContrato?: Date;
    renovacaoAutomaticaContrato: boolean;
    usuarioId: number;
    motoId: number;
    // Relacionamentos
    usuario?: Usuario;
    moto?: Moto;
}


// DTOs for API communication
export interface ContratoDto {
    idContrato: number;
    ativoContrato: boolean;
    dataEntradaContrato: string;
    dataSaidaContrato?: string;
    renovacaoAutomaticaContrato: boolean;
    usuarioId: number;
    motoId: number;
}

export interface ContratoCreateDto {
    ativoContrato: boolean;
    dataEntradaContrato: string;
    dataSaidaContrato?: string;
    renovacaoAutomaticaContrato: boolean;
    usuarioId: number;
    motoId: number;
}

export interface ContratoUpdateDto {
    ativoContrato?: boolean;
    dataEntradaContrato?: string;
    dataSaidaContrato?: string;
    renovacaoAutomaticaContrato?: boolean;
    usuarioId?: number;
    motoId?: number;
}
