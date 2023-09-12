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
/**
 * Importação do módulo Mongoose - biblioteca usada para interagir com bancos de dados MongoDB a partir de aplicativos Node.js.
 */
const mongoose = require("mongoose");
/**
 * Método que se conecta com o bando de dados (MongoDB) com o "USERNAME" E "PASSWORD" protegidos pelo Dotenv.
 */
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield mongoose.connect(`mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@databaseprojeto.ppnjnvt.mongodb.net/database?retryWrites=true&w=majority`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Conexão ao banco de dados realizada com sucesso!");
    }
    catch (error) {
        console.error("Ocorreu um erro ao se conectar com o banco de dados: ", error);
    }
});
module.exports = connectToDatabase;
