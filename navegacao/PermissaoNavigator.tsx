import React from 'react';
import { 
    PermissaoNavigator, 
    PermissaoStackParamList 
} from './navigationDefinition';

interface PermissaoNavigatorProps {
    toastRef: React.RefObject<any>;
    permissoes: any[];
    onDelete: (idPermissao: number) => void;
    onSave: (permissao: any) => void;
    onEdit: (permissao: any) => void;
}

const PermissaoNavigatorComponent: React.FC<PermissaoNavigatorProps> = ({
    toastRef,
    permissoes,
    onDelete,
    onSave,
    onEdit
}) => {
    return (
        <PermissaoNavigator.Navigator 
            initialRouteName="PermissaoList" 
            screenOptions={{ headerShown: false }}
        >
            <PermissaoNavigator.Screen name="PermissaoList">
                {(props) => (
                    <div>
                        {/* Implementar PermissaoListagem component */}
                        <p>Permissao List - Implementar component</p>
                    </div>
                )}
            </PermissaoNavigator.Screen>
            
            <PermissaoNavigator.Screen name="PermissaoDetalhes">
                {(props) => (
                    <div>
                        {/* Implementar PermissaoDetalhes component */}
                        <p>Permissao Detalhes - Implementar component</p>
                    </div>
                )}
            </PermissaoNavigator.Screen>
            
            <PermissaoNavigator.Screen name="PermissaoFormulario">
                {(props) => (
                    <div>
                        {/* Implementar PermissaoFormulario component */}
                        <p>Permissao Formulario - Implementar component</p>
                    </div>
                )}
            </PermissaoNavigator.Screen>
        </PermissaoNavigator.Navigator>
    );
};

export default PermissaoNavigatorComponent;




