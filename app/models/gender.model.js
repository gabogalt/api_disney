const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

const Gender = sequelize.define("gender", {
	// Model attributes are defined here
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	imagen: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	associatedMoviesOrSeries: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

module.exports = Gender;
