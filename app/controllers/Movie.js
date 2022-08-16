const Movies = require("../models/movies.model");
const CharacterHasMovie = require("../models/characterHasMovie.model");
const { Op } = require("sequelize");

const Movie = {
	getMovies: async (req, res) => {
		const { query } = req;
		let filters = null;
		if (query.name || query.age || query.idMovie) {
			filters = {
				name: (query.name ??= ""),
				genre: (query.genre ??= ""),
				order: (query.movies ??= "ASC"),
			};
		}
		try {
			const movies = await Movies.findAll({
				attributes: ["id", "image", "tittle", "created_at"],
			});

			if (movies) {
				res.status(200).send(movies);
			} else {
				res
					.status(400)
					.send("No se encuentran peliculas registrados en la base de datos");
			}
		} catch (err) {
			res.status(500).send(err.message);
		}
	},
	createMovie: async (req, res) => {
		const { body } = req;
		if (!body.tittle) {
			console.log("El titulo es requerido");
			return;
		}
		try {
			const isMovie = await Movies.findOne({
				where: { tittle: body.tittle },
			});
			if (isMovie) {
				res.status(400).send("La pelicula ya existe en la base de datos");
				return;
			}
			const create = await Movies.create({
				image: body.image,
				tittle: body.tittle,
				created_at: body.created_at,
				rating: body.rating,
			});

			if (create) {
				if (!body.movies_id) {
					res.status(200).send("La pelicula ha sido creada correctamente");
					return;
				}
				const associated_movie = await CharacterHasMovie.create({
					characters_id: body.characters_id,
					movies_id: create.id,
				});

				if (associated_movie) {
					res
						.status(200)
						.send("La pelicula ha sido creada y asignada correctamente");
				} else {
					res
						.status(400)
						.send(
							"Hubo un error al asignar el personaje a una pelicula, por favor intente nuevamente"
						);
				}
			} else {
				res.status(400).send("Hubo un error, por favor intente nuevamente");
			}
		} catch (err) {
			res.status(500).send(err.message);
		}
	},
	updateMovie: async (req, res) => {
		const { body, params } = req;

		if (!params.id) {
			res.status(400).send("El id es obligatorio");
		}

		const data = {
			image: body.image,
			tittle: body.tittle,
			created_at: body.created_at,
			rating: body.rating,
		};

		try {
			const update = await Movies.update(data, {
				where: {
					id: params.id,
				},
			});
			if (update) {
				if (!body.characters_id) {
					res.status(200).send();
					return;
				}

				const dataAssociated = {
					characters_id: body.characters_id,
					movies_id: parseInt(params.id),
				};

				//  verifica si tiene una pelicula asociada con el id_movie a actualizar
				const isAssociated = await CharacterHasMovie.findOne({
					where: dataAssociated,
				});

				// si no lo tiene lo crea
				if (!isAssociated) {
					const create = await CharacterHasMovie.create(dataAssociated);
					if (create) {
						res
							.status(200)
							.send(
								"Se han actualizado y creado correctamente todos los datos"
							);
					} else {
						res
							.status(400)
							.send("Ha ocurrido al crear la relacion, intente nuevamente");
					}
				}
			} else {
				res.status(400).send("Ha ocurrido un error intente nuevamente");
			}
		} catch (err) {
			res.status(500).send(err.message);
		}
	},
	deleteMovie: async (req, res) => {
		if (!req.params.id) {
			res.status(400).send("El id es obligatorio");
		}

		try {
			const destroy = await Movies.destroy({
				where: {
					id: req.params.id,
				},
			});
			console.log(destroy);
			if (destroy) {
				res.sendStatus(204);
			} else {
				res.status(400).send("Ha ocurrido un error intente nuevamente");
			}
		} catch (error) {
			res.status(500).send(error.message);
		}
	},
	getMovie: async (req, res) => {
		if (!req.params.id) {
			res.status(400).send("El id es requerido");
		}
		try {
			const character = await Movies.findByPk(req.params.id);
			if (character) {
				res.status(200).send(character);
			} else {
				res
					.status(400)
					.send("No se encuentra la pelicula solicitada en la base de datos.");
			}
		} catch (err) {
			res.status(500).send(err.message);
		}
	},
};

module.exports = Movie;
