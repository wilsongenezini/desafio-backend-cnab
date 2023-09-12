/**
 * Importação do módulo Dotenv - permite configurar variáveis de ambiente que podem conter informações sensíveis.
 */
const dotenv = require("dotenv");

/**
 * Importando o módulo que estabelece uma conexção com o banco de dados.
 */
const indexConnectToDatabase = require("./database/connect");

/**
 * Carregue as variáveis de ambiente definidas do arquivo ".env".
 */
dotenv.config();

/**
 * Função que estabele a conexão com o bando de dados (MongoDB).
 */
indexConnectToDatabase();

/**
 * Importação do ponto de entrada do projeto.
 */
require("./app");
