import { Endereco } from './Endereco';
import { LayoutPatio } from './LayoutPatio';
import { Moto } from './Moto';
import { Camera } from './Camera';

export interface Patio {
    idPatio: number;
    nomePatio: string;
    motosTotaisPatio: number;
    motosDisponiveisPatio: number;
    dataPatio: Date;
    // Relacionamentos
    endereco?: Endereco;
    layoutPatios?: LayoutPatio[];
    motosPatioAtual?: Moto[];
    camerasPatio?: Camera[];
}


// DTOs for API communication
export interface PatioDto {
    idPatio: number;
    nomePatio: string;
    motosTotaisPatio: number;
    motosDisponiveisPatio: number;
    dataPatio: string;
}

export interface PatioCreateDto {
    nomePatio: string;
    motosTotaisPatio: number;
    motosDisponiveisPatio: number;
    dataPatio: string;
}

export interface PatioUpdateDto {
    nomePatio?: string;
    motosTotaisPatio?: number;
    motosDisponiveisPatio?: number;
    dataPatio?: string;
}