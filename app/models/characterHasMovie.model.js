const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../../database/db");

const CharacterHasMovie = sequelize.define(`characters_has_movies`, {
	// Model attributes are defined here
	characters_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	movies_id: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
});

module.exports = CharacterHasMovie;
