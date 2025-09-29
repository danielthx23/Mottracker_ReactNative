import { Usuario } from './Usuario';
import { Permissao } from './Permissao';

export interface UsuarioPermissao {
    usuarioId: number;
    permissaoId: number;
    dataAtribuicao: Date;
    // Relacionamentos
    usuario?: Usuario;
    permissao?: Permissao;
}


// DTOs for API communication
export interface UsuarioPermissaoDto {
    usuarioId: number;
    permissaoId: number;
    dataAtribuicao: string;
}

export interface UsuarioPermissaoCreateDto {
    usuarioId: number;
    permissaoId: number;
    dataAtribuicao: string;
}

export interface UsuarioPermissaoUpdateDto {
    dataAtribuicao?: string;
}
