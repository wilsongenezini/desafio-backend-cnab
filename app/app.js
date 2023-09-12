"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Importação da biblioteca Express - estrutura de aplicativo da web para Node.js
 */
const express = require("express");
/**
 * Importação da biblioteca Multer - middleware para Node.js usado para lidar com upload de arquivos.
 */
const multer = require("multer");
/**
 * Importação das Models - models diferentes para operações com e sem erros.
 */
const OperationModel = require("./models/model");
const OperationModelComErros = require("./models/modelWithErrors");
/**
 * Criação de uma instância do aplicativo Express - usada para configurar e criar um servidor HTTP.
 */
const app = express();
/**
 * Configuração do middleware - Express analisa o corpo das solicitações HTTP com dados JSON.
 */
app.use(express.json());
/**
 * Criação de uma instância de armazenamento - arquivos enviados serão armazenados temporariamente na memória RAM.
 */
const storage = multer.memoryStorage();
/**
 * Criação de uma instância do middleware Multer - usada posteriormente para manipular o upload de arquivos.
 */
const upload = multer({ storage });
/**
 * Importação das funções da controller, onde uma é utilizada para tratar o arquivo upado e a outra para listar as operações do banco de dados por loja.
 */
const CNABController_1 = require("./controllers/CNABController");
const CNABController_2 = require("./controllers/CNABController");
/**
 * Método GET do Express onde cria uma rota que renderiza um formulário HTML para fazer upload de um arquivo.
 */
app.get("/home", (req, res) => {
    res.send('<form action="/upload" method="post" enctype="multipart/form-data"><input type="file" name="txtFile"><input type="submit" value="Enviar"></form>');
});
/**
 * Método GET do Express onde é exibido os dados salvos no banco, a listagem de operações com erros e a listagem filtrada por loja. Remoção do "_id" e "__v" na exibição.
 */
app.get("/database", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exibicao = yield OperationModel.find({}, { _id: 0, __v: 0 });
        const exibicaoErros = yield OperationModelComErros.find({}, { _id: 0, __v: 0 });
        const exibicaoPorLojas = yield (0, CNABController_2.listarOperacoesPorLoja)(exibicao);
        const exibicaoOperacoes = {
            Mensagem: "Listagem das operações com sucesso.",
            Conteúdo: exibicao,
        };
        const exibicaoComErros = {
            Mensagem: "Listagem das operações com erro.",
            Conteúdo: exibicaoErros,
        };
        const exibicaoFinal = {
            Operações: exibicaoOperacoes,
            Operações_com_erros: exibicaoComErros,
            Operações_por_lojas: exibicaoPorLojas,
        };
        res.status(200).json(exibicaoFinal);
    }
    catch (error) {
        console.error("Erro ao exibir dados: ", error);
        res.status(500).send("Erro ao exibir dados.");
    }
}));
/**
 * Método POST do Express que trata o arquivo de texto upado, salvando cada operação em sua coleção no banco de dados.
 */
app.post("/upload", upload.single("txtFile"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        res.status(400).send("Nenhum arquivo foi enviado.");
    }
    const arquivoCNAB = req.file.buffer.toString("utf-8");
    const arqTratadoEmArrays = (0, CNABController_1.tratarArquivoCNAB)(arquivoCNAB);
    try {
        for (const entidade of arqTratadoEmArrays.arrayResultado) {
            const [Tipo, Data, Valor, CPF, Cartão, Dono_Loja, Nome_Loja] = entidade;
            const documento = new OperationModel({
                Tipo,
                Data,
                Valor,
                CPF,
                Cartão,
                Dono_Loja,
                Nome_Loja,
            });
            yield documento.save();
        }
        res.status(201);
    }
    catch (error) {
        console.error("Erro ao inserir dados corretos: ", error);
        res.status(500).send("Erro ao inserir dados corretos.");
    }
    try {
        for (const entidadeComErros of arqTratadoEmArrays.arrayResultadoComErros) {
            const [Tipo, Data, Valor, CPF, Cartão, Dono_Loja, Nome_Loja, Motivo_Erro] = entidadeComErros;
            const documentoComErros = new OperationModelComErros({
                Tipo,
                Data,
                Valor,
                CPF,
                Cartão,
                Dono_Loja,
                Nome_Loja,
                Motivo_Erro,
            });
            yield documentoComErros.save();
        }
        res.status(201);
    }
    catch (error) {
        console.error("Erro ao inserir dados com erros: ", error);
        res.status(500).send("Erro ao inserir dados com erros.");
    }
    res.redirect("/database");
}));
//----------------------------------------------------------//
/**
 * Método POST para testar o Postman.
 */
// app.post("/teste", (req: any, res:any) => { 
//   try {
//     const user = OperationModel.create(req.body);
//     res.status(201).json(user); 
//   } catch (error) {
//     res.status(500);
//   }
// });
//----------------------------------------------------------//
const port = 3000;
app.listen(port, () => console.log(`Projeto rodando em: http://localhost:${port}/home`));
