const mongooseToDatabaseComErros = require("mongoose");

const operationSchemaComErros = new mongooseToDatabaseComErros.Schema({
    Tipo: {
      type: String,
      required: true,
    },
    Data: {
      type: String,
      required: true,
    },
    Valor: {
      type: String,
      required: true,
    },
    CPF: {
      type: String,
      required: true,
    },
    Cartão: {
      type: String,
      required: true,
    },
    Dono_Loja: {
      type: String,
      required: true,
    },
    Nome_Loja: {
      type: String,
      required: true,
    },
    Motivo_Erro: {
        type: String,
        required: true,
      },
  });
  
  const OperationModelComErros = mongooseToDatabaseComErros.model("OperationWithErrors", operationSchemaComErros);
  
  module.exports = OperationModelComErros;