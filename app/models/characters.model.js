const { Sequelize, DataTypes } = require("sequelize");
const sequelize = new Sequelize("sqlite::memory:");

const Characters = sequelize.define("characters", {
	// Model attributes are defined here
	image: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	age: {
		type: DataTypes.INTEGER,
		allowNull: false,
	},
	weight: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	history: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	associatedMoviesOrSeries: {
		type: DataTypes.STRING,
		allowNull: false,
	},
});

module.exports = Characters;
