const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

// Passing parameters separately (other dialects)
const sequelize = new Sequelize("api_disney", "root", process.env.PASSDB, {
	host: "127.0.0.1",
	dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
	define: {
		timestamps: false,
	},
});

const conecction = async () => {
	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
};

module.exports = { sequelize, conecction };
