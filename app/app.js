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
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const OperationModel = require("./models/model");
const OperationModelComErros = require("./models/modelWithErrors");
const app = express();
app.use(express.json());
const storage = multer.memoryStorage();
const upload = multer({ storage });
const CNABController_1 = require("./controllers/CNABController"); //IMPORTAR FUNÇÃO DA CONTROLLER
const CNABController_2 = require("./controllers/CNABController");
app.get('/home', (req, res) => {
    res.send('<form action="/upload" method="post" enctype="multipart/form-data"><input type="file" name="txtFile"><input type="submit" value="Enviar"></form>');
});
app.get('/database', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const testeExibicao = yield OperationModel.find({});
        const testeExibicaoErros = yield OperationModelComErros.find({});
        const exibicaoPorLojas = app.locals.sharedData;
        const exibicao = {
            Mensagem: 'Listagem das operações com sucesso.',
            Conteúdo: testeExibicao,
        };
        const exibicaoComErros = {
            Mensagem: 'Listagem das operações com erro.',
            Conteúdo: testeExibicaoErros,
        };
        const exibicaoFinal = {
            Operações: exibicao,
            Operações_com_erros: exibicaoComErros,
            Operações_por_lojas: exibicaoPorLojas,
        };
        res.status(200).json(exibicaoFinal);
    }
    catch (error) {
        console.error('Erro ao exibir dados.', error);
        res.status(500).send('Erro ao exibir dados.');
    }
}));
app.post('/upload', upload.single('txtFile'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file)
        return res.status(400).send('Nenhum arquivo foi enviado.');
    const arquivoCNAB = req.file.buffer.toString('utf-8');
    //TRATAMENTO DO ARQUIVO
    let arqTratadoEmArrays = (0, CNABController_1.tratarArquivoCNAB)(arquivoCNAB);
    console.log("TESTE LOGO ABAIXO: ##########");
    const listaPorLojas = (0, CNABController_2.listarOperacoesPorLoja)(arqTratadoEmArrays.arrayResultado);
    app.locals.sharedData = listaPorLojas;
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
        console.error('Erro ao inserir dados corretos:', error);
        res.status(500).send('Erro ao inserir dados corretos.');
    }
    try {
        console.log("cheguei aqui... (erros)");
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
        console.error('Erro ao inserir dados com erros:', error);
        res.status(500).send('Erro ao inserir dados com erros.');
    }
    res.redirect('/database');
}));
// app.post("/teste", (req: any, res:any) => { //POST PARA TESTAR NO POSTMAN
//   try {
//     const user = OperationModel.create(req.body);
//     res.status(201).json(user); 
//   } catch (error) {
//     res.status(500);
//   }
// });
const port = 3000;
app.listen(port, () => console.log(`Rodando na porta ${port}`));
