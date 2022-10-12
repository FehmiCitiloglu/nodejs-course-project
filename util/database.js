// const { Pool, Client } = require("pg");


// const credentials = {
//     user: "postgres",
//     host: "localhost",
//     database: "node-complete",
//     password: "postgrespw",
//     port: 55000,
// };


const Sequelize = require("sequelize")

const sequelize = new Sequelize("node-complete", 'postgres', 'postgrespw',
    {
        dialect: 'postgres',
        host: 'localhost',
        port: 55000,
    }
)

try {
    sequelize.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

module.exports = sequelize
