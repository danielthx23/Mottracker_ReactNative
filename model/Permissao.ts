export interface Permissao {
    idPermissao: number;
    nomePermissao: string;
    descricaoPermissao?: string;
    // Relacionamentos
    usuarioPermissoes?: import('./UsuarioPermissao').UsuarioPermissao[];
}


// DTOs for API communication
export interface PermissaoDto {
    idPermissao: number;
    nomePermissao: string;
    descricaoPermissao?: string;
}

export interface PermissaoCreateDto {
    nomePermissao: string;
    descricaoPermissao?: string;
}

export interface PermissaoUpdateDto {
    nomePermissao?: string;
    descricaoPermissao?: string;
}
