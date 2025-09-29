import { ValidationError } from 'yup';
import { 
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdApi, buscarPorEmailApi, loginApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar, CallBackLogin
} from '../fetcher/UsuarioFetcher';
import { Usuario, UsuarioCreateDto, UsuarioUpdateDto, UsuarioLoginDto, usuarioCreateSchema, usuarioUpdateSchema, usuarioLoginSchema } from '../model';

const salvarUsuario = (usuario: UsuarioCreateDto, callback: CallBackSalvar) => {
    usuarioCreateSchema.validate(usuario, { abortEarly: false })
        .then(() => {
            salvarApi(usuario, callback);
        })
        .catch((error) => {
            const errosFinais: any = {};
            if (error.inner) {
                error.inner.forEach((er: ValidationError) => {
                    errosFinais[er.path as keyof typeof errosFinais] = er.message;
                });
            }
            callback(false, error.message, errosFinais);
        });
};

const atualizarUsuario = (id: number, usuario: UsuarioUpdateDto, callback: CallBackAtualizar) => {
    usuarioUpdateSchema.validate(usuario, { abortEarly: false })
        .then(() => {
            atualizarApi(id, usuario, callback);
        })
        .catch((error) => {
            const errosFinais: any = {};
            if (error.inner) {
                error.inner.forEach((er: ValidationError) => {
                    errosFinais[er.path as keyof typeof errosFinais] = er.message;
                });
            }
            callback(false, error.message, errosFinais);
        });
};

const apagarUsuario = (id: number, callback: CallBackApagar) => {
    apagarApi(id, callback);
};

const carregarUsuarios = (carregarCallBack: CallBackCarregar) => {
    carregarApi(carregarCallBack);
};

const buscarUsuarioPorId = (id: number, callback: CallBackBuscar) => {
    buscarPorIdApi(id, callback);
};

const buscarUsuarioPorEmail = (email: string, callback: CallBackBuscar) => {
    buscarPorEmailApi(email, callback);
};

const loginUsuario = (loginData: UsuarioLoginDto, callback: CallBackLogin) => {
    usuarioLoginSchema.validate(loginData, { abortEarly: false })
        .then(() => {
            loginApi(loginData, callback);
        })
        .catch((error) => {
            const errosFinais: any = {};
            if (error.inner) {
                error.inner.forEach((er: ValidationError) => {
                    errosFinais[er.path as keyof typeof errosFinais] = er.message;
                });
            }
            callback(false, error.message, null, null);
        });
};

export {
    salvarUsuario,
    carregarUsuarios,
    apagarUsuario,
    atualizarUsuario,
    buscarUsuarioPorId,
    buscarUsuarioPorEmail,
    loginUsuario
};
