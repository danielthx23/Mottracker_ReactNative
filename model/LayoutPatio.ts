import { Patio } from './Patio';
import { QrCodePonto } from './QrCodePonto';

export interface LayoutPatio {
    idLayoutPatio: number;
    nomeLayoutPatio: string;
    descricaoLayoutPatio?: string;
    dataCriacaoLayoutPatio: Date;
    patioId: number;
    // Relacionamentos
    patio?: Patio;
    qrCodePontos?: QrCodePonto[];
}


// DTOs for API communication
export interface LayoutPatioDto {
    idLayoutPatio: number;
    nomeLayoutPatio: string;
    descricaoLayoutPatio?: string;
    dataCriacaoLayoutPatio: string;
    patioId: number;
}

export interface LayoutPatioCreateDto {
    nomeLayoutPatio: string;
    descricaoLayoutPatio?: string;
    dataCriacaoLayoutPatio: string;
    patioId: number;
}

export interface LayoutPatioUpdateDto {
    nomeLayoutPatio?: string;
    descricaoLayoutPatio?: string;
    dataCriacaoLayoutPatio?: string;
    patioId?: number;
}
