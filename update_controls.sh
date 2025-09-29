#!/bin/bash

# Script para atualizar todos os controls para usar services ao invés de fetchers

echo "Atualizando controls para usar services..."

# Lista de controls para atualizar
controls=(
    "usePatioControl"
    "useCameraControl" 
    "useContratoControl"
    "useEnderecoControl"
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
    
    # Extrair o nome da entidade (remover 'use' e 'Control')
    local entity_name=$(echo "$control_name" | sed 's/use//' | sed 's/Control//')
    
    # Converter primeira letra para minúscula
    local entity_lower=$(echo "$entity_name" | sed 's/^./\L&/')
    
    echo "  - Entidade: ${entity_name}"
    echo "  - Service: ${entity_lower}Service"
    echo "  - Arquivo: ${control_file}"
}

# Atualizar cada control
for control in "${controls[@]}"; do
    update_control "$control"
done

echo "Atualização concluída!"


