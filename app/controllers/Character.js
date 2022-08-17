const Characters = require("../models/characters.model");
const CharacterHasMovie = require("../models/characterHasMovie.model");
const { Op } = require("sequelize");

const Character = {
	getCharacters: async (req, res) => {
		const { query } = req;
		let filters = null;
		// verifico si viene algfuna variable por query string
		if (query.name || query.age) {
			filters = {
				name: (query.name ??= ""),
				age: (query.age ??= 0),
			};
		}
		try {
			let characters;
			if (filters != null) {
				characters = await Characters.findAll({
					attributes: ["id", "image", "name"],
					where: {
						[Op.or]: [{ name: filters.name }, { age: filters.age }],
					},
				});
			} else {
				characters = await Characters.findAll({
					attributes: ["id", "image", "name"],
				});
			}

			if (characters) {
				res.status(200).send(characters);
			} else {
				res
					.status(400)
					.send("No se encuentran personajes registrados en la base de datos");
			}
		} catch (err) {
			res.status(500).send(err.message);
		}
	},
	createCharacter: async (req, res) => {
		const { body } = req;
		if (!body.name) {
			res.send("El nombre es requerido");
			return;
		}
		try {
			// varifico si existe el character en bd
			const isCharacter = await Characters.findOne({
				where: { name: body.name },
			});

			if (isCharacter) {
				res.send("El personaje ya existe en la base de datos");
				return;
			}
			// si no exisate lo crea
			const create = await Characters.create({
				image: body.image,
				name: body.name,
				age: body.age,
				weight: body.weight,
				history: body.history,
			});
			if (create) {
				// verifica si tiene una pelicula asociada
				if (!body.movies_id) {
					res.status(200).send("El personaje ha sido creado correctamente");
					return;
				}
				const associated_movie = await CharacterHasMovie.create({
					characters_id: create.id,
					movies_id: body.movies_id,
				});

				if (associated_movie) {
					res.status(200).send("El personaje ha sido asignado correctamente");
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
	updateCharacter: async (req, res) => {
		const { body, params } = req;

		if (!params.id) {
			res.status(400).send("El id es obligatorio");
		}

		const data = {
			image: body.image,
			name: body.name,
			age: body.age,
			weight: body.weight,
			history: body.history,
		};

		try {
			const update = await Characters.update(data, {
				where: {
					id: params.id,
				},
			});
			if (update) {
				if (!body.id_movie) {
					res.sendStatus(204);
					return;
				}

				const dataAssociated = {
					characters_id: parseInt(params.id),
					movies_id: body.id_movie,
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
	deleteCharacter: async (req, res) => {
		if (!req.params.id) {
			res.status(400).send("El id es obligatorio");
		}

		try {
			const destroy = await Characters.destroy({
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
	getCharacter: async (req, res) => {
		if (!req.params.id) {
			res.status(400).send("El id es requerido");
		}
		try {
			const character = await Characters.findByPk(req.params.id);
			if (character) {
				res.status(200).send(character);
			} else {
				res
					.status(400)
					.send(
						"No se encuentra el personaje solicitados en la base de datos."
					);
			}
		} catch (err) {
			res.status(500).send(err.message);
		}
	},
};

module.exports = Character;
