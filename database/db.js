const { Sequelize } = require("sequelize");
const connection = async () => {
	// Passing parameters separately (other dialects)
	const sequelize = new Sequelize("api_disney", "root", "gabogalt", {
		host: "127.0.0.1",
		dialect: "mysql" /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */,
	});

	try {
		await sequelize.authenticate();
		console.log("Connection has been established successfully.");
	} catch (error) {
		console.error("Unable to connect to the database:", error);
	}
};

module.exports = connection;
