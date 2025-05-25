export type CameraStatus = 'Ativa' | 'Inativa' | 'Em manutenção';

export default interface Camera {
    idCamera: number;
    nomeCamera: string;
    ipCamera?: string;
    status: CameraStatus;
    posX?: number;
    posY?: number;
}
