import { format, parse } from 'date-fns';

export function tratarArquivoCNAB(fileTxt: any) {
    let linhas = fileTxt.split("\n");

    const arrayResultado: (string | number)[][] = [];
    const arrayResultadoComErros: (string | number)[][] = [];

    linhas.forEach((linha: any) => {
        const arrayAux: (string | number)[] = [];
        const arrayAuxComErros: (string | number)[] = [];

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

        } catch (error: any) {
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
            } else {
                console.error('Ocorreu um erro desconhecido.');
            }
        }
    });

    return { arrayResultado, arrayResultadoComErros };
};

function obterTipoTransacao(tipo: string) {
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

function formatarData(data: string) {
    const dataAtual = parse(data, "yyyyMMdd", new Date());
  
    if (!verificarDataValida(dataAtual)) {
      throw new Error("Data inválida.");
    }
  
    const dataNova = format(dataAtual, "dd/MM/yyyy");
    return dataNova;
}
  
function verificarDataValida(data: Date) {
    return data instanceof Date && !isNaN(data.getTime());
}

function formatarValor(valor: string) {
    const valorFormatado = parseFloat(valor) / 100;

    return valorFormatado;
}

function formatarCpf(cpf: string) {
    if (!isValidCPF(cpf)) {
        throw new Error("CPF inválido.");
    }

    cpf = cpf.replace(/\D/g, '');
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function isValidCPF(cpf: string): boolean {
    if (typeof cpf !== 'string') return false;
    
    cpf = cpf.replace(/[^\d]+/g, '');
  
    if (cpf.length !== 11 || !!cpf.match(/(\d)\1{10}/)) return false;
  
    const cpfArray: number[] = cpf.split('').map(el => +el);
  
    const rest = (count: number): number => (cpfArray.slice(0, count-12)
      .reduce((soma, el, index) => (soma + el * (count-index)), 0) * 10) % 11 % 10;
  
    return rest(10) === cpfArray[9] && rest(11) === cpfArray[10];
  }