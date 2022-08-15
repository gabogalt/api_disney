const Characters = require("../models/characters.model");
const Character = {
	getCharacters: async (req, res) => {
		try {
			const characters = await Characters.findAll({
				attributes: ["image", "name"],
			});
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
	createCharacters: async (req, res) => {
		const { body } = req;
		if (!body.name) {
			console.log("El correo es requerido");
			return;
		}
		try {
			const isCharacter = await Characters.findOne({
				where: { name: body.name },
			});
			if (isCharacter) {
				res.send("El personaje ya existe en la base de datos");
				return;
			}
			const create = await Characters.create({
				image: body.image,
				name: body.name,
				age: body.age,
				weight: body.weight,
				history: body.history,
				associated_content: body.associated_content,
			});

			if (create) {
				res.status(200).send("El personaje ha sido creado correctamente");
			} else {
				res.status(400).send("Hubo un error, por favor intente nuevamente");
			}
		} catch (err) {
			res.status(500).send(err.message);
		}
	},
};

module.exports = Character;
