"use strict";
const mongooseToDatabase = require("mongoose");
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
