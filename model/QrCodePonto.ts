export interface QrCodePonto {
    idQrCodePonto: number;
    identificadorQrCodePonto: string;
    posXQrCodePonto: number;
    posYQrCodePonto: number;
    layoutPatioId: number;
    // Relacionamentos
    layoutPatio?: import('./LayoutPatio').LayoutPatio;
}


// DTOs for API communication
export interface QrCodePontoDto {
    idQrCodePonto: number;
    identificadorQrCodePonto: string;
    posXQrCodePonto: number;
    posYQrCodePonto: number;
    layoutPatioId: number;
}

export interface QrCodePontoCreateDto {
    identificadorQrCodePonto: string;
    posXQrCodePonto: number;
    posYQrCodePonto: number;
    layoutPatioId: number;
}

export interface QrCodePontoUpdateDto {
    identificadorQrCodePonto?: string;
    posXQrCodePonto?: number;
    posYQrCodePonto?: number;
    layoutPatioId?: number;
}
