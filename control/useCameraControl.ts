import { useContext, useState } from 'react';
import { 
    salvarCamera, carregarCameras, apagarCamera, atualizarCamera, buscarCameraPorId, buscarCameraPorNome, buscarCameraPorStatus
} from '../service/cameraService';
import { Camera, CameraCreateDto, CameraUpdateDto, CameraStatus } from '../model';
import { ContextoPrincipal } from '../context/ContextoPrincipal';

const cameraLimpa: Camera = {
    idCamera: 0,
    nomeCamera: "",
    ipCamera: "",
    status: "Ativa" as CameraStatus,
    posX: 0,
    posY: 0
};

const useCameraControl = () => {
    const { 
        cameras, setCameras, cameraSelecionada, setCameraSelecionada,
        loading, setLoading, mensagem, setMensagem, status, setStatus,
        toastRef
    } = useContext(ContextoPrincipal);
    
    const [camera, setCamera] = useState<Camera>(cameraLimpa);
    const [listaCameras, setListaCameras] = useState<Camera[]>([]);

    const salvar = () => {
        setLoading(true);
        const cameraCreate: CameraCreateDto = {
            nomeCamera: camera.nomeCamera,
            ipCamera: camera.ipCamera,
            status: camera.status,
            posX: camera.posX,
            posY: camera.posY
        };
        salvarCamera(cameraCreate, (success, message, errors) => {
            if (success) {
                setMensagem("Câmera salva com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Câmera salva com sucesso!', 'success');
                carregarLista();
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const carregarLista = () => {
        setLoading(true);
        carregarCameras((success, message, cameras) => {
            if (success) {
                setListaCameras(cameras);
                setCameras(cameras);
                setMensagem("Câmeras carregadas com sucesso");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const apagar = (id: number) => {
        setLoading(true);
        apagarCamera(id, (success, message) => {
            if (success) {
                setMensagem("Câmera removida com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Câmera removida com sucesso!', 'success');
                carregarLista();
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const atualizar = (id: number) => {
        setLoading(true);
        const cameraUpdate: CameraUpdateDto = {
            nomeCamera: camera.nomeCamera,
            ipCamera: camera.ipCamera,
            status: camera.status,
            posX: camera.posX,
            posY: camera.posY
        };
        atualizarCamera(id, cameraUpdate, (success, message, errors) => {
            if (success) {
                setMensagem("Câmera atualizada com sucesso");
                setStatus("sucesso");
                toastRef.current?.show('Sucesso', 'Câmera atualizada com sucesso!', 'success');
                carregarLista();
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorId = (id: number) => {
        setLoading(true);
        buscarCameraPorId(id, (success, message, camera) => {
            if (success && camera) {
                setCameraSelecionada(camera);
                setMensagem("Câmera encontrada");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorNome = (nome: string) => {
        setLoading(true);
        buscarCameraPorNome(nome, (success, message, cameras) => {
            if (success) {
                setListaCameras(cameras);
                setCameras(cameras);
                setMensagem("Câmeras encontradas");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const buscarPorStatus = (status: string) => {
        setLoading(true);
        buscarCameraPorStatus(status, (success, message, cameras) => {
            if (success) {
                setListaCameras(cameras);
                setCameras(cameras);
                setMensagem("Câmeras encontradas");
                setStatus("sucesso");
            } else {
                setMensagem(message);
                setStatus("erro");
                toastRef.current?.show('Erro', message, 'danger');
            }
            setLoading(false);
        });
    };

    const handlerInput = (texto: string, nomeCampo: string) => {
        const novaCamera = { ...camera };
        if (nomeCampo === 'posX' || nomeCampo === 'posY') {
            (novaCamera as any)[nomeCampo] = parseFloat(texto);
        } else if (nomeCampo === 'status') {
            (novaCamera as any)[nomeCampo] = texto as CameraStatus;
        } else {
            (novaCamera as any)[nomeCampo] = texto;
        }
        setCamera(novaCamera);
    };

    const limparCamera = () => {
        setCamera(cameraLimpa);
    };

    const selecionarCamera = (camera: Camera) => {
        setCameraSelecionada(camera);
        setCamera(camera);
    };

    return {
        camera,
        listaCameras,
        cameraSelecionada,
        loading,
        mensagem,
        status,
        handlerInput,
        salvar,
        carregarLista,
        apagar,
        atualizar,
        buscarPorId,
        buscarPorNome,
        buscarPorStatus,
        limparCamera,
        selecionarCamera
    };
};

export { useCameraControl };
