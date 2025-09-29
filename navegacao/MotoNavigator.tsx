import React from 'react';
import { 
    MotoNavigator, 
    MotoStackParamList 
} from './navigationDefinition';
import MotoListagem from '../view/components/MotoListagem';
import MotoDetalhes from '../view/components/MotoDetalhes';
import MotoFormulario from '../view/components/MotoFormulario';

interface MotoNavigatorProps {
    toastRef: React.RefObject<any>;
    motos: any[];
    onDelete: (idMoto: number) => void;
    onSave: (moto: any) => void;
    onEdit: (moto: any) => void;
}

const MotoNavigatorComponent: React.FC<MotoNavigatorProps> = ({
    toastRef,
    motos,
    onDelete,
    onSave,
    onEdit
}) => {
    return (
        <MotoNavigator.Navigator 
            initialRouteName="MotoList" 
            screenOptions={{ headerShown: false }}
        >
            <MotoNavigator.Screen name="MotoList">
                {(props) => (
                    <MotoListagem
                        {...props}
                        motos={motos}
                        toastRef={toastRef}
                        onCreateMoto={() => props.navigation.navigate('MotoFormulario')}
                        onMotoDetails={(idMoto) => props.navigation.navigate('MotoDetalhes', { idMoto })}
                    />
                )}
            </MotoNavigator.Screen>
            
            <MotoNavigator.Screen name="MotoDetalhes">
                {(props) => (
                    <MotoDetalhes
                        {...props}
                        motos={motos}
                        onDelete={onDelete}
                        patioVertices={[]}
                        motoPosition={{ x: 0, y: 0 }}
                        userPosition={{ x: 0, y: 0 }}
                    />
                )}
            </MotoNavigator.Screen>
            
            <MotoNavigator.Screen name="MotoFormulario">
                {(props) => {
                    const motoParaEditar = props.route.params?.moto;
                    return (
                        <MotoFormulario
                            {...props}
                            moto={motoParaEditar}
                            onSalvar={(moto: any) => {
                                onSave(moto);
                                props.navigation.goBack();
                            }}
                            onEditar={(moto: any) => {
                                onEdit(moto);
                                props.navigation.goBack();
                            }}
                            onCancelar={() => props.navigation.goBack()}
                        />
                    );
                }}
            </MotoNavigator.Screen>
        </MotoNavigator.Navigator>
    );
};

export default MotoNavigatorComponent;
