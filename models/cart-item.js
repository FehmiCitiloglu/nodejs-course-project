const Sequelize = require("sequelize")
const sequelize = require("../util/database")

const CartItem = sequelize.define("cart_item", {
    id: {
        type: Sequelize.SMALLINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: { type: Sequelize.INTEGER }
})


module.exports = CartItem
