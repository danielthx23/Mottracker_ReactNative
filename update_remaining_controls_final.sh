#!/bin/bash

echo "Atualizando controls restantes para usar services..."

# Atualizar useQrCodePontoControl
echo "Atualizando useQrCodePontoControl..."

# Remover callbacks antigos
sed -i '/const callback.*: CallBack.*= (success: boolean, texto: string.*) => {/,/};/d' control/useQrCodePontoControl.ts

# Atualizar carregarLista
sed -i 's/carregarApi(callbackCarregar);/carregarQrCodePontos((success, message, qrCodePontos) => {\n            if (success) {\n                setListaQrCodePontos(qrCodePontos);\n                setQrCodePontos(qrCodePontos);\n                setMensagem("QR Code de pontos carregados com sucesso");\n                setStatus("sucesso");\n            } else {\n                setMensagem(message);\n                setStatus("erro");\n                toastRef.current?.show('\''Erro'\'', message, '\''danger'\'');\n            }\n            setLoading(false);\n        });/' control/useQrCodePontoControl.ts

# Atualizar apagar
sed -i 's/apagarApi(id, callbackApagar);/apagarQrCodePonto(id, (success, message) => {\n            if (success) {\n                setMensagem("QR Code de ponto removido com sucesso");\n                setStatus("sucesso");\n                toastRef.current?.show('\''Sucesso'\'', '\''QR Code de ponto removido com sucesso!'\'', '\''success'\'');\n                carregarLista();\n            } else {\n                setMensagem(message);\n                setStatus("erro");\n                toastRef.current?.show('\''Erro'\'', message, '\''danger'\'');\n            }\n            setLoading(false);\n        });/' control/useQrCodePontoControl.ts

# Atualizar atualizar
sed -i 's/atualizarApi(id, qrCodePontoUpdate, callbackAtualizar);/atualizarQrCodePonto(id, qrCodePontoUpdate, (success, message, errors) => {\n            if (success) {\n                setMensagem("QR Code de ponto atualizado com sucesso");\n                setStatus("sucesso");\n                toastRef.current?.show('\''Sucesso'\'', '\''QR Code de ponto atualizado com sucesso!'\'', '\''success'\'');\n                carregarLista();\n            } else {\n                setMensagem(message);\n                setStatus("erro");\n                toastRef.current?.show('\''Erro'\'', message, '\''danger'\'');\n                if (errors) {\n                    console.log('\''Erros de validação:'\'', errors);\n                }\n            }\n            setLoading(false);\n        });/' control/useQrCodePontoControl.ts

echo "useQrCodePontoControl atualizado!"

# Atualizar useUsuarioPermissaoControl
echo "Atualizando useUsuarioPermissaoControl..."

# Remover callbacks antigos
sed -i '/const callback.*: CallBack.*= (success: boolean, texto: string.*) => {/,/};/d' control/useUsuarioPermissaoControl.ts

echo "useUsuarioPermissaoControl atualizado!"

echo "Todos os controls foram atualizados para usar services!"


