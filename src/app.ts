const express = require('express');
const multer = require('multer');
const fs = require('fs');
const OperationModel = require("./models/model");

const app = express();
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

import { tratarArquivoCNAB } from "./controllers/CNABController"; //IMPORTAR FUNÇÃO DA CONTROLLER

app.get('/home', (req: any, res: any) => {
  res.send('<form action="/upload" method="post" enctype="multipart/form-data"><input type="file" name="txtFile"><input type="submit" value="Enviar"></form>');
});

app.post('/upload', upload.single('txtFile'), async (req: any, res:any) => {
  if (!req.file)
    return res.status(400).send('Nenhum arquivo foi enviado.');

  const arquivoCNAB = req.file.buffer.toString('utf-8');

  //TRATAMENTO DO ARQUIVO

  let arqTratadoEmArrays = tratarArquivoCNAB(arquivoCNAB);
  
  //res.send(resultado); //VISUALIZAÇÃO TEMPORÁRIA

  try {
    for (const entidade of arqTratadoEmArrays) {
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

      await documento.save();
    }

    console.log('Dados inseridos com sucesso ao banco de dados.');
    res.status(200).send('Dados inseridos com sucesso.');
  } catch (error) {
    console.error('Erro ao inserir dados:', error);
    res.status(500).send('Erro ao inserir dados.');
  }
});



app.post("/teste", (req: any, res:any) => { //POST PARA TESTAR NO POSTMAN
  try {
    const user = OperationModel.create(req.body);

    res.status(201).json(user); 
  } catch (error) {
    res.status(500);
  }
});


const port = 3000;
app.listen(port, () => console.log(`Rodando na porta ${port}`));
