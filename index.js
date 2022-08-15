const express = require("express");
const dotenv = require("dotenv");
const { sequelize, conecction } = require("./database/db");
const Auth = require("./app/controllers/Auth");
const Character = require("./app/controllers/Character");

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
app.get("/characters", Character.getCharacters);
app.post("/characters/create", Character.createCharacters);
app.post("/auth/register", Auth.register);
app.post("/auth/login", Auth.login);

// undefined routes
app.get("*", (req, res) => {
	res.status(404).send("Esta página no existe :(");
});

//port
app.listen(process.env.PORT, () => {
	console.log("Arrancando la aplicación!");
});
