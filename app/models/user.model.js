const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../../database/db");

const Users = sequelize.define("users", {
	// Model attributes are defined here
	email: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	salt: {
		type: DataTypes.BLOB,
		allowNull: false,
	},
});

module.exports = Users;
