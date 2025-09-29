import { ValidationError } from 'yup';
import { 
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdApi, buscarPorAtivoApi, 
    buscarPorUsuarioApi, buscarPorMotoApi, buscarNaoExpiradosApi, buscarRenovacaoAutomaticaApi, buscarPorDataEntradaApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar
} from '../fetcher/ContratoFetcher';
import { Contrato, ContratoCreateDto, ContratoUpdateDto } from '../model';

// Schema de validação para Contrato
const contratoSchema = {
    validate: (contrato: Contrato, options?: any) => {
        return new Promise((resolve, reject) => {
            const errors: string[] = [];
            
            if (contrato.usuarioId <= 0) {
                errors.push('ID do usuário é obrigatório');
            }
            
            if (contrato.motoId <= 0) {
                errors.push('ID da moto é obrigatório');
            }
            
            if (!contrato.dataEntradaContrato) {
                errors.push('Data de entrada é obrigatória');
            }
            
            if (contrato.dataSaidaContrato && contrato.dataSaidaContrato < contrato.dataEntradaContrato) {
                errors.push('Data de saída deve ser posterior à data de entrada');
            }
            
            if (errors.length > 0) {
                const error = new Error(errors.join(', '));
                (error as any).inner = errors.map(msg => ({ path: 'contrato', message: msg }));
                reject(error);
            } else {
                resolve(contrato);
            }
        });
    }
};

const salvarContrato = (contrato: ContratoCreateDto, callback: CallBackSalvar) => {
    contratoSchema.validate(contrato as any, { abortEarly: false })
        .then(() => {
            salvarApi(contrato, callback);
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

const atualizarContrato = (id: number, contrato: ContratoUpdateDto, callback: CallBackAtualizar) => {
    contratoSchema.validate(contrato as any, { abortEarly: false })
        .then(() => {
            atualizarApi(id, contrato, callback);
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

const apagarContrato = (id: number, callback: CallBackApagar) => {
    apagarApi(id, callback);
};

const carregarContratos = (carregarCallBack: CallBackCarregar) => {
    carregarApi(carregarCallBack);
};

const buscarContratoPorId = (id: number, callback: CallBackBuscar) => {
    buscarPorIdApi(id, callback);
};

const buscarContratoPorAtivo = (ativo: boolean, callback: CallBackCarregar) => {
    buscarPorAtivoApi(ativo, callback);
};

const buscarContratoPorUsuario = (usuarioId: number, callback: CallBackCarregar) => {
    buscarPorUsuarioApi(usuarioId, callback);
};

const buscarContratoPorMoto = (motoId: number, callback: CallBackCarregar) => {
    buscarPorMotoApi(motoId, callback);
};

const buscarContratosNaoExpirados = (callback: CallBackCarregar) => {
    buscarNaoExpiradosApi(callback);
};

const buscarContratoPorRenovacaoAutomatica = (renovacao: boolean, callback: CallBackCarregar) => {
    buscarRenovacaoAutomaticaApi(renovacao, callback);
};

const buscarContratoPorDataEntrada = (dataInicio: string, dataFim: string, callback: CallBackCarregar) => {
    buscarPorDataEntradaApi(dataInicio, dataFim, callback);
};

export {
    salvarContrato,
    carregarContratos,
    apagarContrato,
    atualizarContrato,
    buscarContratoPorId,
    buscarContratoPorAtivo,
    buscarContratoPorUsuario,
    buscarContratoPorMoto,
    buscarContratosNaoExpirados,
    buscarContratoPorRenovacaoAutomatica,
    buscarContratoPorDataEntrada
};


