#!/bin/bash

# Script para atualizar os controls restantes

echo "Atualizando controls restantes..."

# Lista de controls restantes
controls=(
    "useLayoutPatioControl"
    "usePermissaoControl" 
    "useQrCodePontoControl"
    "useTelefoneControl"
    "useUsuarioPermissaoControl"
)

# Função para atualizar um control
update_control() {
    local control_name=$1
    local control_file="control/${control_name}.ts"
    
    echo "Atualizando ${control_file}..."
    
    # Verificar se o arquivo existe
    if [ ! -f "$control_file" ]; then
        echo "Arquivo ${control_file} não encontrado, pulando..."
        return
    fi
    
    echo "  - Arquivo: ${control_file}"
    echo "  - Status: Próximo a atualizar"
}

# Atualizar cada control
for control in "${controls[@]}"; do
    update_control "$control"
done

echo "Atualização concluída!"


