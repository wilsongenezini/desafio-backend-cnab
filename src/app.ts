const express = require("express");
const multer = require("multer");
const OperationModel = require("./models/model");
const OperationModelComErros = require("./models/modelWithErrors");

const app = express();
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage });

import { tratarArquivoCNAB } from "./controllers/CNABController"; //IMPORTAR FUNÇÃO DA CONTROLLER
import { listarOperacoesPorLoja } from "./controllers/CNABController";

app.get("/home", (req: any, res: any) => {
  res.send('<form action="/upload" method="post" enctype="multipart/form-data"><input type="file" name="txtFile"><input type="submit" value="Enviar"></form>');
});

app.get("/database", async (req: any, res:any) => { 
  try {
    const exibicao = await OperationModel.find({}, { _id: 0, __v: 0 });
    const exibicaoErros = await OperationModelComErros.find({}, { _id: 0, __v: 0 });
    const exibicaoPorLojas = await listarOperacoesPorLoja(exibicao);

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
    }

    res.status(200).json(exibicaoFinal);

  } catch (error) {
    console.error("Erro ao exibir dados: ", error);
    res.status(500).send("Erro ao exibir dados.");
  }
});  

app.post("/upload", upload.single("txtFile"), async (req: any, res:any) => {
  if (!req.file) {
    res.status(400).send("Nenhum arquivo foi enviado.");
  }

  const arquivoCNAB = req.file.buffer.toString("utf-8");

  const arqTratadoEmArrays = tratarArquivoCNAB(arquivoCNAB);
  
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

      await documento.save();
    }

    res.status(201);

  } catch (error) {
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

      await documentoComErros.save();
    }

    res.status(201);

  } catch (error) {
    console.error("Erro ao inserir dados com erros: ", error);
    res.status(500).send("Erro ao inserir dados com erros.");
  }

  res.redirect("/database");
});

//----------------------------------------------------------//
// MÉTODO POST PARA TESTAR NO POSTMAN

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
