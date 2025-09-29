import React from 'react';
import { 
    PatioNavigator, 
    PatioStackParamList 
} from './navigationDefinition';
import PatioListagem from '../view/components/PatioListagem';
import PatioDetalhes from '../view/components/PatioDetalhes';
import PatioFormulario from '../view/components/PatioFormulario';

interface PatioNavigatorProps {
    toastRef: React.RefObject<any>;
    patios: any[];
    onDelete: (idPatio: number) => void;
    onSave: (patio: any) => void;
    onEdit: (patio: any) => void;
    onNavigateToMoto: (idMoto: number) => void;
}

const PatioNavigatorComponent: React.FC<PatioNavigatorProps> = ({
    toastRef,
    patios,
    onDelete,
    onSave,
    onEdit,
    onNavigateToMoto
}) => {
    return (
        <PatioNavigator.Navigator 
            initialRouteName="PatioList" 
            screenOptions={{ headerShown: false }}
        >
            <PatioNavigator.Screen name="PatioList">
                {(props) => (
                    <PatioListagem
                        {...props}
                        patios={patios}
                        toastRef={toastRef}
                        onCreatePatio={() => props.navigation.navigate('PatioFormulario')}
                        onPatioDetails={(idPatio) => props.navigation.navigate('PatioDetalhes', { idPatio })}
                    />
                )}
            </PatioNavigator.Screen>
            
            <PatioNavigator.Screen name="PatioDetalhes">
                {(props) => {
                    const patio = patios.find(p => p.idPatio === props.route.params.idPatio);
                    return (
                        <PatioDetalhes
                            {...props}
                            patio={patio}
                            patios={patios}
                            motos={[]}
                            cameras={[]}
                            onDelete={onDelete}
                            toastRef={toastRef}
                            onNavigateToMoto={onNavigateToMoto}
                            onEdit={() => props.navigation.navigate('PatioFormulario', { patio })}
                            onBack={() => props.navigation.goBack()}
                        />
                    );
                }}
            </PatioNavigator.Screen>
            
            <PatioNavigator.Screen name="PatioFormulario">
                {(props) => {
                    const patioParaEditar = props.route.params?.patio;
                    return (
                        <PatioFormulario
                            {...props}
                            patio={patioParaEditar}
                            onSalvar={(patio: any) => {
                                if (patioParaEditar) {
                                    onEdit(patio);
                                } else {
                                    onSave(patio);
                                }
                                props.navigation.goBack();
                            }}
                            onCancelar={() => props.navigation.goBack()}
                        />
                    );
                }}
            </PatioNavigator.Screen>
        </PatioNavigator.Navigator>
    );
};

export default PatioNavigatorComponent;
