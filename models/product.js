const Sequelize = require("sequelize")

const sequelize = require("../util/database")


const Product = sequelize.define('product',
    {
        id: {
            type: Sequelize.SMALLINT,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        price: {
            type: Sequelize.DOUBLE,
            allowNull: false,
        },
        image_url: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
        }
    }
);


module.exports = Product
