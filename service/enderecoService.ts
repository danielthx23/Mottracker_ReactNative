import { ValidationError } from 'yup';
import { 
    salvarApi, carregarApi, apagarApi, atualizarApi, buscarPorIdApi, buscarPorCepApi, 
    buscarPorEstadoApi, buscarPorCidadeApi, buscarPorBairroApi, buscarPorPatioApi,
    CallBackSalvar, CallBackCarregar, CallBackApagar, CallBackAtualizar, CallBackBuscar
} from '../fetcher/EnderecoFetcher';
import { Endereco, EnderecoCreateDto, EnderecoUpdateDto } from '../model';

// Schema de validação para Endereco
const enderecoSchema = {
    validate: (endereco: Endereco, options?: any) => {
        return new Promise((resolve, reject) => {
            const errors: string[] = [];
            
            if (!endereco.cepEndereco || endereco.cepEndereco.trim() === '') {
                errors.push('CEP é obrigatório');
            }
            
            if (!endereco.logradouroEndereco || endereco.logradouroEndereco.trim() === '') {
                errors.push('Logradouro é obrigatório');
            }
            
            if (!endereco.numeroEndereco || endereco.numeroEndereco.trim() === '') {
                errors.push('Número é obrigatório');
            }
            
            if (!endereco.bairroEndereco || endereco.bairroEndereco.trim() === '') {
                errors.push('Bairro é obrigatório');
            }
            
            if (!endereco.cidadeEndereco || endereco.cidadeEndereco.trim() === '') {
                errors.push('Cidade é obrigatória');
            }
            
            if (!endereco.estadoEndereco || endereco.estadoEndereco.trim() === '') {
                errors.push('Estado é obrigatório');
            }
            
            if (errors.length > 0) {
                const error = new Error(errors.join(', '));
                (error as any).inner = errors.map(msg => ({ path: 'endereco', message: msg }));
                reject(error);
            } else {
                resolve(endereco);
            }
        });
    }
};

const salvarEndereco = (endereco: EnderecoCreateDto, callback: CallBackSalvar) => {
    enderecoSchema.validate(endereco as any, { abortEarly: false })
        .then(() => {
            salvarApi(endereco, callback);
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

const atualizarEndereco = (id: number, endereco: EnderecoUpdateDto, callback: CallBackAtualizar) => {
    enderecoSchema.validate(endereco as any, { abortEarly: false })
        .then(() => {
            atualizarApi(id, endereco, callback);
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

const apagarEndereco = (id: number, callback: CallBackApagar) => {
    apagarApi(id, callback);
};

const carregarEnderecos = (carregarCallBack: CallBackCarregar) => {
    carregarApi(carregarCallBack);
};

const buscarEnderecoPorId = (id: number, callback: CallBackBuscar) => {
    buscarPorIdApi(id, callback);
};

const buscarEnderecoPorCep = (cep: string, callback: CallBackCarregar) => {
    buscarPorCepApi(cep, callback);
};

const buscarEnderecoPorEstado = (estado: string, callback: CallBackCarregar) => {
    buscarPorEstadoApi(estado, callback);
};

const buscarEnderecoPorCidade = (cidade: string, callback: CallBackCarregar) => {
    buscarPorCidadeApi(cidade, callback);
};

const buscarEnderecoPorBairro = (bairro: string, callback: CallBackCarregar) => {
    buscarPorBairroApi(bairro, callback);
};

const buscarEnderecoPorPatio = (patioId: number, callback: CallBackCarregar) => {
    buscarPorPatioApi(patioId, callback);
};

export {
    salvarEndereco,
    carregarEnderecos,
    apagarEndereco,
    atualizarEndereco,
    buscarEnderecoPorId,
    buscarEnderecoPorCep,
    buscarEnderecoPorEstado,
    buscarEnderecoPorCidade,
    buscarEnderecoPorBairro,
    buscarEnderecoPorPatio
};


