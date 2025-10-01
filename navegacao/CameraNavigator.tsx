import React from 'react';
import { 
    CameraNavigator, 
    CameraStackParamList 
} from './navigationDefinition';

interface CameraNavigatorProps {
    toastRef: React.RefObject<any>;
    cameras: any[];
    onDelete: (idCamera: number) => void;
    onSave: (camera: any) => void;
    onEdit: (camera: any) => void;
}

const CameraNavigatorComponent: React.FC<CameraNavigatorProps> = ({
    toastRef,
    cameras,
    onDelete,
    onSave,
    onEdit
}) => {
    return (
        <CameraNavigator.Navigator 
            initialRouteName="CameraList" 
            screenOptions={{ headerShown: false }}
        >
            <CameraNavigator.Screen name="CameraList">
                {(props) => (
                    <div>
                        {/* Implementar CameraListagem component */}
                        <p>Camera List - Implementar component</p>
                    </div>
                )}
            </CameraNavigator.Screen>
            
            <CameraNavigator.Screen name="CameraDetalhes">
                {(props) => (
                    <div>
                        {/* Implementar CameraDetalhes component */}
                        <p>Camera Detalhes - Implementar component</p>
                    </div>
                )}
            </CameraNavigator.Screen>
            
            <CameraNavigator.Screen name="CameraFormulario">
                {(props) => (
                    <div>
                        {/* Implementar CameraFormulario component */}
                        <p>Camera Formulario - Implementar component</p>
                    </div>
                )}
            </CameraNavigator.Screen>
        </CameraNavigator.Navigator>
    );
};

export default CameraNavigatorComponent;




