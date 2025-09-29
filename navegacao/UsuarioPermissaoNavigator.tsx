import React from 'react';
import { 
    UsuarioPermissaoNavigator, 
    UsuarioPermissaoStackParamList 
} from './navigationDefinition';

interface UsuarioPermissaoNavigatorProps {
    toastRef: React.RefObject<any>;
    usuarioPermissoes: any[];
    onDelete: (usuarioId: number, permissaoId: number) => void;
    onSave: (usuarioPermissao: any) => void;
    onEdit: (usuarioPermissao: any) => void;
}

const UsuarioPermissaoNavigatorComponent: React.FC<UsuarioPermissaoNavigatorProps> = ({
    toastRef,
    usuarioPermissoes,
    onDelete,
    onSave,
    onEdit
}) => {
    return (
        <UsuarioPermissaoNavigator.Navigator 
            initialRouteName="UsuarioPermissaoList" 
            screenOptions={{ headerShown: false }}
        >
            <UsuarioPermissaoNavigator.Screen name="UsuarioPermissaoList">
                {(props) => (
                    <div>
                        {/* Implementar UsuarioPermissaoListagem component */}
                        <p>UsuarioPermissao List - Implementar component</p>
                    </div>
                )}
            </UsuarioPermissaoNavigator.Screen>
            
            <UsuarioPermissaoNavigator.Screen name="UsuarioPermissaoDetalhes">
                {(props) => (
                    <div>
                        {/* Implementar UsuarioPermissaoDetalhes component */}
                        <p>UsuarioPermissao Detalhes - Implementar component</p>
                    </div>
                )}
            </UsuarioPermissaoNavigator.Screen>
            
            <UsuarioPermissaoNavigator.Screen name="UsuarioPermissaoFormulario">
                {(props) => (
                    <div>
                        {/* Implementar UsuarioPermissaoFormulario component */}
                        <p>UsuarioPermissao Formulario - Implementar component</p>
                    </div>
                )}
            </UsuarioPermissaoNavigator.Screen>
        </UsuarioPermissaoNavigator.Navigator>
    );
};

export default UsuarioPermissaoNavigatorComponent;


