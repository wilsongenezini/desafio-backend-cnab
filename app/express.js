"use strict";
const express = require("express");
const app = express();
app.get("/home", (req, res) => {
    res.contentType("application/html");
    res.status(200).send("<h1>te amo estela</h1>");
});
app.get("/user", (req, res) => {
    const user = [
        { name: "wilson", idade: 28 },
        { name: "estela", idade: 23 },
    ];
    res.status(200).json(user);
});
const port = 8080;
app.listen(port, () => console.log(`Rodando na porta ${port}`));