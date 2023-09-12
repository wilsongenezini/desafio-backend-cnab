"use strict";
/**
 * Importação do módulo Mongoose - biblioteca usada para interagir com bancos de dados MongoDB a partir de aplicativos Node.js.
 */
const mongooseToDatabase = require("mongoose");
/**
 * Entidades das operações realizadas com dados válidos.
 */
const operationSchema = new mongooseToDatabase.Schema({
    Tipo: {
        type: String,
        required: true,
    },
    Data: {
        type: String,
        required: true,
    },
    Valor: {
        type: Number,
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
});
const OperationModel = mongooseToDatabase.model("Operation", operationSchema);
module.exports = OperationModel;
