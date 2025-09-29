import { Telefone } from './Telefone';
import { Contrato } from './Contrato';
import { UsuarioPermissao } from './UsuarioPermissao';

export interface Usuario {
    idUsuario: number;
    nomeUsuario: string;
    cpfUsuario: string;
    senhaUsuario: string;
    cnhUsuario: string;
    emailUsuario: string;
    tokenUsuario?: string;
    dataNascimentoUsuario: Date;
    criadoEmUsuario: Date;
    // Relacionamentos
    telefones?: Telefone[];
    contratos?: Contrato[];
    usuarioPermissoes?: UsuarioPermissao[];
}


// DTOs for API communication
export interface UsuarioDto {
    idUsuario: number;
    nomeUsuario: string;
    cpfUsuario: string;
    senhaUsuario: string;
    cnhUsuario: string;
    emailUsuario: string;
    tokenUsuario?: string;
    dataNascimentoUsuario: string;
    criadoEmUsuario: string;
}

export interface UsuarioCreateDto {
    nomeUsuario: string;
    cpfUsuario: string;
    senhaUsuario: string;
    cnhUsuario: string;
    emailUsuario: string;
    dataNascimentoUsuario: string;
}

export interface UsuarioUpdateDto {
    nomeUsuario?: string;
    cpfUsuario?: string;
    senhaUsuario?: string;
    cnhUsuario?: string;
    emailUsuario?: string;
    dataNascimentoUsuario?: string;
}

// Schema de validação para Usuario
import * as yup from 'yup';

export const usuarioSchema = yup.object().shape({
    nomeUsuario: yup.string().required('Nome é obrigatório').min(2, 'Nome deve ter pelo menos 2 caracteres'),
    cpfUsuario: yup.string().required('CPF é obrigatório').matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00'),
    senhaUsuario: yup.string().required('Senha é obrigatória').min(6, 'Senha deve ter pelo menos 6 caracteres'),
    cnhUsuario: yup.string().required('CNH é obrigatória').matches(/^\d{11}$/, 'CNH deve ter 11 dígitos'),
    emailUsuario: yup.string().required('Email é obrigatório').email('Email deve ser válido'),
    dataNascimentoUsuario: yup.date().required('Data de nascimento é obrigatória').max(new Date(), 'Data de nascimento não pode ser futura')
});

export const usuarioCreateSchema = yup.object().shape({
    nomeUsuario: yup.string().required('Nome é obrigatório').min(2, 'Nome deve ter pelo menos 2 caracteres'),
    cpfUsuario: yup.string().required('CPF é obrigatório').matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00'),
    senhaUsuario: yup.string().required('Senha é obrigatória').min(6, 'Senha deve ter pelo menos 6 caracteres'),
    cnhUsuario: yup.string().required('CNH é obrigatória').matches(/^\d{11}$/, 'CNH deve ter 11 dígitos'),
    emailUsuario: yup.string().required('Email é obrigatório').email('Email deve ser válido'),
    dataNascimentoUsuario: yup.string().required('Data de nascimento é obrigatória')
});

export const usuarioUpdateSchema = yup.object().shape({
    nomeUsuario: yup.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    cpfUsuario: yup.string().matches(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF deve estar no formato 000.000.000-00'),
    senhaUsuario: yup.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    cnhUsuario: yup.string().matches(/^\d{11}$/, 'CNH deve ter 11 dígitos'),
    emailUsuario: yup.string().email('Email deve ser válido'),
    dataNascimentoUsuario: yup.string()
});

export const usuarioLoginSchema = yup.object().shape({
    emailUsuario: yup.string().required('Email é obrigatório').email('Email deve ser válido'),
    senhaUsuario: yup.string().required('Senha é obrigatória')
});

export interface UsuarioLoginDto {
    emailUsuario: string;
    senhaUsuario: string;
}

export interface UsuarioLoginResponseDto {
    usuario: UsuarioDto;
    token: string;
}