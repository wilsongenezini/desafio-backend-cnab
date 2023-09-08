"use strict";
const dotenv = require("dotenv");
const indexConnectToDatabase = require("./database/connect");
dotenv.config();
indexConnectToDatabase();
//require("./express");
