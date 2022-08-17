const express = require("express");
const bcrypt = require("bcrypt");
const { expressjwt: jwt } = require("express-jwt");
const jwToken = require("jsonwebtoken");
const User = require("../models/user.model");
const dotenv = require("dotenv");
const Helpers = require("./Helpers");

dotenv.config();

const validateJwt = jwt({
	secret: process.env.SECRET,
	algorithms: ["HS256"],
});
const signToken = (id) => jwToken.sign({ id }, process.env.SECRET);

const findAndAssignerUser = async (req, res, next) => {
	try {
		const user = await User.findByPk(req.auth.id);
		if (!user) {
			return res.status(401).end();
		}
		req.user = user;
		next();
	} catch (e) {
		next(e);
	}
};

const isAuthenticated = express.Router().use(validateJwt, findAndAssignerUser);

const Auth = {
	register: async (req, res) => {
		const { body } = req;
		if (!body.email) {
			console.log("El correo es requerido");
		}
		try {
			const isUser = await User.findOne({ where: { email: body.email } });
			if (isUser) {
				res.send("El usuario ya existe");
			} else {
				const salt = await bcrypt.genSalt();
				// console.log(salt);
				const pass = body.password.toString();
				const hashed = await bcrypt.hash(pass, salt);
				const user = await User.create({
					email: body.email,
					password: hashed,
					salt,
				});
				console.log(user);
				if (user) {
					// enviar correo
					const plantilla = `<!DOCTYPE html>
										<html lang="en">
										<head>
											<meta charset="UTF-8">
											<meta http-equiv="X-UA-Compatible" content="IE=edge">
											<meta name="viewport" content="width=device-width, initial-scale=1.0">
											<title>Registro Api Disney</title>
										</head>
										<body>
											<h1>Felicidades por tu registro ${body.email}</h1>
											<p>Ahora ya puedes empezar nuestra api de disney</p>
										</body>
										</html>`;
					const sendMail = Helpers.sendEmail(
						body.email,
						"Registro Api de Disney",
						plantilla
					);

					if (sendMail != true) {
						console.log("Hubo un error al enviar el correo de registro ");
					}
					const signed = signToken(user.id);
					res.status(200).send(signed);
				} else {
					res
						.status(500)
						.send(
							"Ha ocurrido un error al registrar a el usuario, intenta nuevamente"
						);
				}
			}
		} catch (err) {
			res.status(500).send(err.message);
		}
	},
	login: async (req, res) => {
		const { body } = req;
		if (!body.email) {
			console.log("El correo es requerido");
		}
		try {
			const user = await User.findOne({ where: { email: body.email } });
			if (!user) {
				res.status(401).send("El usuario y/o contrasenia invalidos");
			} else {
				const pass = body.password.toString();
				const isMatch = await bcrypt.compare(pass, user.password);
				if (isMatch) {
					const signed = signToken(user.id);
					res.status(200).send(signed);
				} else {
					res.status(401).send("El usuario y/o contrasenia invalidos");
				}
			}
		} catch (err) {
			res.status(500).send(err.message);
		}
	},
};

module.exports = { Auth, isAuthenticated };
