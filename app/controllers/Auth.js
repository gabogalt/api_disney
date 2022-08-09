const express = require("express");
const bcrypt = require("bcrypt");
const expresjwt = require("express-jwt");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

// const validateJwt = expresjwt({
// 	secret: process.env.SECRET,
// 	algorithms: ["HS256"],
// });

const signToken = (id) => jwt.sign({ id }, process.env.SECRET);

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
				let pass = body.password.toString();
				const hashed = await bcrypt.hash(pass, salt);
				const user = await User.create({
					email: body.email,
					password: hashed,
					salt,
				});

				// const signed = signToken(user._id);
				res.send(user);
			}
		} catch (err) {
			res.status(500).send(err.message);
		}
	},
};

module.exports = Auth;
