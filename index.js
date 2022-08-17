const express = require("express");
const dotenv = require("dotenv");
const { sequelize, conecction } = require("./database/db");
const { Auth, isAuthenticated } = require("./app/controllers/Auth");
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
app.get("/characters", isAuthenticated, Character.getCharacters);
app.post("/characters/create", isAuthenticated, Character.createCharacter);
app.put("/characters/update/:id", isAuthenticated, Character.updateCharacter);
app.delete(
	"/characters/delete/:id",
	isAuthenticated,
	Character.deleteCharacter
);
app.get("/characters/:id", isAuthenticated, Character.getCharacter);

// movies
app.get("/movies", isAuthenticated, Movie.getMovies);
app.post("/movies/create", isAuthenticated, Movie.createMovie);
app.put("/movies/update/:id", isAuthenticated, Movie.updateMovie);
app.delete("/movies/delete/:id", isAuthenticated, Movie.deleteMovie);
app.get("/movies/:id", isAuthenticated, Movie.getMovie);

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
