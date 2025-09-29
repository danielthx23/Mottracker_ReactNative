export type CameraStatus = 'Ativa' | 'Inativa' | 'Em manutenção';

export interface Camera {
    idCamera: number;
    nomeCamera: string;
    ipCamera?: string;
    status: CameraStatus;
    posX?: number;
    posY?: number;
    patioId?: number;
}


// DTOs for API communication
export interface CameraDto {
    idCamera: number;
    nomeCamera: string;
    ipCamera?: string;
    status: string;
    posX?: number;
    posY?: number;
    patioId?: number;
}

export interface CameraCreateDto {
    nomeCamera: string;
    ipCamera?: string;
    status: string;
    posX?: number;
    posY?: number;
    patioId?: number;
}

export interface CameraUpdateDto {
    nomeCamera?: string;
    ipCamera?: string;
    status?: string;
    posX?: number;
    posY?: number;
    patioId?: number;
}
