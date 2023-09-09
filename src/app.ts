const express = require('express');
const multer = require('multer');
const fs = require('fs');

const app = express();
const port = 3000;

const storage = multer.memoryStorage();
const upload = multer({ storage });

import { tratarArquivoCNAB } from "./controllers/CNABController"; //IMPORTAR FUNÇÃO DA CONTROLLER

app.get('/home', (req: any, res: any) => {
  res.send('<form action="/upload" method="post" enctype="multipart/form-data"><input type="file" name="txtFile"><input type="submit" value="Enviar"></form>');
});

app.post('/upload', upload.single('txtFile'), (req: any, res:any) => {
  if (!req.file)
    return res.status(400).send('Nenhum arquivo foi enviado.');

  const arquivoCNAB = req.file.buffer.toString('utf-8');

  //TRATAMENTO DO ARQUIVO

  let resultado = tratarArquivoCNAB(arquivoCNAB);
  
  res.send(resultado);
});

app.listen(port, () => console.log(`Rodando na porta ${port}`));
