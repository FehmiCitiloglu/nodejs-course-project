const Sequelize = require("sequelize")
const sequelize = require("../util/database")

const OrderItem = sequelize.define("order_item", {
    id: {
        type: Sequelize.SMALLINT,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: { type: Sequelize.INTEGER }
})


module.exports = OrderItem
