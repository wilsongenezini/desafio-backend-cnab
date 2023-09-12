"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listarOperacoesPorLoja = exports.tratarArquivoCNAB = void 0;
/**
 * Importação do Módulo "date-fns" - usadas para formatar datas e analisar strings de data em objetos de data.
 */
const date_fns_1 = require("date-fns");
/**
 * Recebe o arquivo de texto e separa os dados tratados em índices de um array de operações.
 * @param arquivoTxt - Arquivo de texto upado para ser tratado.
 * @returns - Dois arrays com os dados tratados: operações de sucesso e operações com algum valor inválido.
 */
function tratarArquivoCNAB(arquivoTxt) {
    let linhas = arquivoTxt.split("\n");
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
                console.error(`Ocorreu um erro: ${error.message} Salvo no banco de dados de operações com erros.`);
            }
            else {
                console.error("Ocorreu um erro desconhecido.");
            }
        }
    });
    return { arrayResultado, arrayResultadoComErros };
}
exports.tratarArquivoCNAB = tratarArquivoCNAB;
;
/**
 * Separa as operações de um banco de dados por loja, com seu saldo total.
 * @param listagem - Operações de sucesso armazenadas no banco de dados.
 * @returns - Um novo JSON formatado, onde as operações estão filtradas por loja.
 */
function listarOperacoesPorLoja(listagem) {
    const resultado = {};
    let operacoesDestaLoja = {};
    for (const item of listagem) {
        const nomeLoja = item.Nome_Loja;
        const valor = item.Valor;
        if (!resultado[nomeLoja]) {
            resultado[nomeLoja] = 0;
        }
        resultado[nomeLoja] += valor;
        if (!operacoesDestaLoja[nomeLoja]) {
            operacoesDestaLoja[nomeLoja] = [];
        }
        const operacao = {
            Tipo: item.Tipo,
            Data: item.Data,
            CPF: item.CPF,
            Cartão: item.Cartão,
            Dono_Loja: item.Dono_Loja
        };
        operacoesDestaLoja[nomeLoja].push(operacao);
    }
    const exibicaoPorLojas = {};
    for (const loja in resultado) {
        exibicaoPorLojas[loja] = resultado[loja];
        exibicaoPorLojas[`${loja}_Operações`] = operacoesDestaLoja[loja];
    }
    return exibicaoPorLojas;
}
exports.listarOperacoesPorLoja = listarOperacoesPorLoja;
/**
 * Verifica qual o tipo da transação realizada na operação.
 * @param tipo - Dígito do arquivo de texto que define a operação.
 * @returns - O tipo da operação.
 */
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
/**
 * Verifica se uma data é válida e depois a formata.
 * @param data - Parte do arquivo de texto que define a data da operação.
 * @returns - A data em formato "dd/MM/yyyy".
 */
function formatarData(data) {
    const dataAtual = (0, date_fns_1.parse)(data, "yyyyMMdd", new Date());
    if (!verificarDataValida(dataAtual)) {
        throw new Error("Data inválida.");
    }
    const dataNova = (0, date_fns_1.format)(dataAtual, "dd/MM/yyyy");
    return dataNova;
}
/**
 * Verifica se uma data é válida.
 * @param data - Parte do arquivo de texto que define a data da operação.
 * @returns - Retorna true para uma data válida e false para uma data inválida.
 */
function verificarDataValida(data) {
    return data instanceof Date && !isNaN(data.getTime());
}
/**
 * Converte um conteúdo de números em string para um número decimal.
 * @param valor - Conteúdo em string para ser formatado.
 * @returns - Conteúdo formato em número decimal.
 */
function formatarValor(valor) {
    const valorFormatado = parseFloat(valor) / 100;
    return valorFormatado;
}
/**
 * Verifica se um CPF é válido e depois o formata.
 * @param cpf - Parte do arquivo de texto que define o CPF da operação.
 * @returns - O CPF em formato "000.000.000-00".
 */
function formatarCpf(cpf) {
    if (!isValidCPF(cpf)) {
        throw new Error("CPF inválido.");
    }
    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
/**
 * Verifica se um CPF é válido.
 * @param cpf - Parte do arquivo de texto que define o CPF da operação.
 * @returns - Retorna true para um CPF válido e false para um CPF inválido.
 */
function isValidCPF(cpf) {
    if (typeof cpf !== "string")
        return false;
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/))
        return false;
    const cpfArray = cpf.split('').map(el => +el);
    const rest = (count) => (cpfArray.slice(0, count - 12)
        .reduce((soma, el, index) => (soma + el * (count - index)), 0) * 10) % 11 % 10;
    return rest(10) === cpfArray[9] && rest(11) === cpfArray[10];
}
