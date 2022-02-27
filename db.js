const path = require("path");
const config = require(path.resolve("utils", "config.js"));
const pgp = require("pg-promise")({});
const { Pool } = require("pg");
const chalk = require("chalk");

const db = new Pool({
    user: config.database_user,
    host: config.database_host,
    database: config.database,
    password: config.database_password,
    port: config.database_port,
});

db.on("error", (err, client) => {
    console.error("Error:", err);
});


const checkConnection = async() => {
    const text = `SELECT 1 + 1`
    const query = await db.query(text).then(data => {
        console.log(chalk.green('Connected to DB Pool'))

    }).catch(err => {
        console.log(chalk.red('Database Disconnected'+ err))
    })

};


checkConnection();

module.exports = db;