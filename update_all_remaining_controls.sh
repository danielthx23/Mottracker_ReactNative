#!/bin/bash

# Script para atualizar todos os controls restantes

echo "Atualizando todos os controls restantes..."

# Lista de controls restantes
controls=(
    "usePermissaoControl"
    "useQrCodePontoControl" 
    "useTelefoneControl"
    "useUsuarioPermissaoControl"
)

# Função para atualizar um control
update_control() {
    local control_name=$1
    local control_file="control/${control_name}.ts"
    
    echo "Atualizando ${control_name}..."
    
    # Verificar se o arquivo existe
    if [ ! -f "$control_file" ]; then
        echo "  Arquivo ${control_file} não encontrado, pulando..."
        return
    fi
    
    echo "  - Arquivo: ${control_file}"
    echo "  - Status: Próximo a atualizar"
}

# Atualizar cada control
for control in "${controls[@]}"; do
    update_control "$control"
done

echo "Todos os controls restantes identificados!"
echo "Próximo passo: Atualizar individualmente cada control"


