const express = require("express");
const bcrypt = require("bcrypt");
const { expressjwt: jwt } = require("express-jwt");
const jwToken = require("jsonwebtoken");
const User = require("../models/user.model");
const dotenv = require("dotenv");

dotenv.config();

const validateJwt = jwt({
	secret: process.env.SECRET,
	algorithms: ["HS256"],
});
const signToken = (id) => jwToken.sign({ id }, process.env.SECRET);

const findAndAssignerUser = async (req, res, next) => {
	try {
		const user = await User.findByPk(req.user.id);
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

				const signed = signToken(user.id);
				res.status(200).send(signed);
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

module.exports = Auth;
