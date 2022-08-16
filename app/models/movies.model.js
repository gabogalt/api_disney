const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../../database/db");

const Movies = sequelize.define("movies", {
	// Model attributes are defined here
	image: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	tittle: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	created_at: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	rating: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});

module.exports = Movies;
