const express = require("express");
const dotenv = require("dotenv");
const { sequelize, conecction } = require("./database/db");
const Auth = require("./app/controllers/Auth");

//enable environment variables
dotenv.config();

const app = express();

app.use(express.json());

// connection with db

conecction();

// routes
app.get("/", (req, res) => {
	res.status(200).send("Estas en la raiz");
});
app.post("/auth/register", Auth.register);

// undefined routes
app.get("*", (req, res) => {
	res.status(404).send("Esta página no existe :(");
});

//port
app.listen(process.env.PORT, () => {
	console.log("Arrancando la aplicación!");
});
