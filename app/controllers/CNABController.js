"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarOperacoesPorLoja = exports.tratarArquivoCNAB = void 0;
const date_fns_1 = require("date-fns");
function tratarArquivoCNAB(fileTxt) {
    let linhas = fileTxt.split("\n");
    const arrayResultado = [];
    const arrayResultadoComErros = [];
    linhas.forEach((linha) => {
        const arrayAux = [];
        const arrayAuxComErros = [];
        try {
            let tipo = obterTipoTransacao(linha.substring(0, 1));
            let data = formatarData(linha.substring(1, 9));
            let valor = formatarValor(linha.substring(9, 19));
            let cpf = formatarCpf(linha.substring(19, 30));
            let cartao = linha.substring(30, 42);
            let donoLoja = linha.substring(42, 56);
            let nomeLoja = linha.substring(56, 74);
            arrayAux.push(tipo, data, valor, cpf, cartao, donoLoja, nomeLoja);
            arrayResultado.push(arrayAux);
        }
        catch (error) {
            let tipo = linha.substring(0, 1);
            let data = linha.substring(1, 9);
            let valor = formatarValor(linha.substring(9, 19)).toFixed(2);
            let cpf = linha.substring(19, 30);
            let cartao = linha.substring(30, 42);
            let donoLoja = linha.substring(42, 56);
            let nomeLoja = linha.substring(56, 74);
            let motivoErro = error.message;
            arrayAuxComErros.push(tipo, data, valor, cpf, cartao, donoLoja, nomeLoja, motivoErro);
            arrayResultadoComErros.push(arrayAuxComErros);
            if (error instanceof Error) {
                console.error(`Ocorreu um erro: ${error.message}`);
            }
            else {
                console.error('Ocorreu um erro desconhecido.');
            }
        }
    });
    return { arrayResultado, arrayResultadoComErros };
}
exports.tratarArquivoCNAB = tratarArquivoCNAB;
;
// class Operacoes {
//     constructor(
//         public Tipo: string,
//         public Data: string,
//         public Valor: number,
//         public CPF: string,
//         public Cartao: string,
//         public Dono_Loja: string,
//         public Nome_Loja: string
//     ) {}
// };
// function listarOperacoesPorLoja(operacoes: Operacoes[]) {
//     let arrayAux: (string | number)[][] = operacoes.map(operacao => [
//         operacao.Tipo,
//         operacao.Data,
//         operacao.Valor,
//         operacao.CPF,
//         operacao.Cartao,
//         operacao.Dono_Loja,
//         operacao.Nome_Loja,
//     ]);
//     let arrayAuxCopia: (string | number)[][] = arrayAux;
//     const arrayResultado: (string | number)[][] = [];
//     for (const operacao of operacoes) {
//         const arrayFiltradoPorLoja: (string | number)[] = [];
//         arrayAux = arrayAuxCopia;
//         for (const operacaoAux of arrayAux) {
//             if (operacaoAux === operacao || operacaoAux === operacao.valueOf()) {
//                 arrayFiltradoPorLoja.push()
//             }
//         }
//     }
// };
function listarOperacoesPorLoja(listagem) {
    const resultado = {};
    let operacoesDestaLoja = {};
    for (const i of listagem) {
        const nomeLoja = i[6];
        const valor = Number(i[2]);
        if (!resultado[nomeLoja]) {
            resultado[nomeLoja] = 0;
        }
        resultado[nomeLoja] += valor;
        if (!operacoesDestaLoja[nomeLoja]) {
            operacoesDestaLoja[nomeLoja] = [];
        }
        const operacao = {
            Tipo: i[0],
            Data: i[1],
            CPF: i[3],
            Cartao: i[4],
            Dono_Loja: i[5]
        };
        operacoesDestaLoja[nomeLoja].push(operacao);
    }
    const exibicaoPorLojas = {};
    for (const loja in resultado) {
        exibicaoPorLojas[loja] = resultado[loja];
        exibicaoPorLojas[`${loja}_Operacoes`] = operacoesDestaLoja[loja];
    }
    return exibicaoPorLojas;
}
exports.listarOperacoesPorLoja = listarOperacoesPorLoja;
function obterTipoTransacao(tipo) {
    switch (tipo) {
        case "1":
            return "Débito";
        case "2":
            return "Crédito";
        case "3":
            return "PIX";
        case "4":
            return "Financiamento";
        default:
            throw new Error("Tipo de transação inválido.");
    }
}
function formatarData(data) {
    const dataAtual = (0, date_fns_1.parse)(data, "yyyyMMdd", new Date());
    if (!verificarDataValida(dataAtual)) {
        throw new Error("Data inválida.");
    }
    const dataNova = (0, date_fns_1.format)(dataAtual, "dd/MM/yyyy");
    return dataNova;
}
function verificarDataValida(data) {
    return data instanceof Date && !isNaN(data.getTime());
}
function formatarValor(valor) {
    const valorFormatado = parseFloat(valor) / 100;
    return valorFormatado;
}
function formatarCpf(cpf) {
    if (!isValidCPF(cpf)) {
        throw new Error("CPF inválido.");
    }
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
function isValidCPF(cpf) {
    if (typeof cpf !== 'string')
        return false;
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/))
        return false;
    const cpfArray = cpf.split('').map(el => +el);
    const rest = (count) => (cpfArray.slice(0, count - 12)
        .reduce((soma, el, index) => (soma + el * (count - index)), 0) * 10) % 11 % 10;
    return rest(10) === cpfArray[9] && rest(11) === cpfArray[10];
}
