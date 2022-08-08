const express = require("express");
const dotenv = require("dotenv");
const connection = require("./database/db");

//enable environment variables
dotenv.config();

const app = express();

// connection with db
connection();

// undefined routes
app.get("*", (req, res) => {
	res.status(404).send("Esta página no existe :(");
});

//port
app.listen(process.env.PORT, () => {
	console.log("Arrancando la aplicación!");
});
