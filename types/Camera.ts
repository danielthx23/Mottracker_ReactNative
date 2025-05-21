type CameraStatus = 'Ativa' | 'Inativa' | 'Em manutenção';

interface Camera {
    idCamera: number;
    nomeCamera: string;
    ipCamera?: string;
    status: CameraStatus;
    posX?: number;
    posY?: number;
}

export default Camera;