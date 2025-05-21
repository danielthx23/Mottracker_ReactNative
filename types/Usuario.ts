interface Usuario {
    idUsuario: number;
    nomeUsuario: string;
    cpfUsuario: string;
    senhaUsuario: string;
    cnhUsuario: string;
    emailUsuario: string;
    tokenUsuario?: string;
    dataNascimentoUsuario: Date;
    criadoEmUsuario: Date;
}

export default Usuario;