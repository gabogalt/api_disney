const express = require("express");
const dotenv = require("dotenv");
const { sequelize, conecction } = require("./database/db");
const Auth = require("./app/controllers/Auth");
const Character = require("./app/controllers/Character");
const Movie = require("./app/controllers/Movie");

//variables de entorno
dotenv.config();

const app = express();

// middelware para p[oder user body
app.use(express.json());

// connection with db

conecction();

// routes
app.get("/", (req, res) => {
	res.status(200).send("Estas en la raiz");
});
// Characters
app.get("/characters", Character.getCharacters);
app.post("/characters/create", Character.createCharacter);
app.put("/characters/update/:id", Character.updateCharacter);
app.delete("/characters/delete/:id", Character.deleteCharacter);
app.get("/characters/:id", Character.getCharacter);

// movies
app.get("/movies", Movie.getMovies);
app.post("/movies/create", Movie.createMovie);
app.put("/movies/update/:id", Movie.updateMovie);
app.delete("/movies/delete/:id", Movie.deleteMovie);
app.get("/movies/:id", Movie.getMovie);

// Auth
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
