"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const app = express();
const port = 3000;
const storage = multer.memoryStorage();
const upload = multer({ storage });
const CNABController_1 = require("./controllers/CNABController"); //IMPORTAR FUNÇÃO DA CONTROLLER
app.get('/home', (req, res) => {
    res.send('<form action="/upload" method="post" enctype="multipart/form-data"><input type="file" name="txtFile"><input type="submit" value="Enviar"></form>');
});
app.post('/upload', upload.single('txtFile'), (req, res) => {
    if (!req.file)
        return res.status(400).send('Nenhum arquivo foi enviado.');
    const arquivoCNAB = req.file.buffer.toString('utf-8');
    //TRATAMENTO DO ARQUIVO
    let resultado = (0, CNABController_1.tratarArquivoCNAB)(arquivoCNAB);
    res.send(resultado);
});
app.listen(port, () => console.log(`Rodando na porta ${port}`));
