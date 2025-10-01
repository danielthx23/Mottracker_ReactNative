import React, { useState } from 'react';
import MainNavigator from './MainNavigator';

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [usuarioLogado, setUsuarioLogado] = useState<any>(null);

    const handleSetUsuarioLogado = (usuario: any) => {
        setUsuarioLogado(usuario);
        setIsAuthenticated(true);
    };

    const handleLogout = () => {
        setUsuarioLogado(null);
        setIsAuthenticated(false);
    };

    return (
        <MainNavigator
            isAuthenticated={isAuthenticated}
            setUsuarioLogado={handleSetUsuarioLogado}
        />
    );
};

export default App;




