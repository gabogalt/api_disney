const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

const MoviesOrSeries = sequelize.define("movies_or_Series", {
	// Model attributes are defined here
	image: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	tittle: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	createdAt: {
		type: DataTypes.DATE,
		allowNull: false,
	},
	assessment: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	associatedCharacters: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

module.exports = MoviesOrSeries;
