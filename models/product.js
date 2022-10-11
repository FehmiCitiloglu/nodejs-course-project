const db = require("../util/database")
const Cart = require("./cart")

module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.title = title
        this.id = id
        this.imageUrl = imageUrl
        this.description = description
        this.price = price
    }

    save() {


    }

    static deleteById(id) {

    }

    static fetchAll() {
        return db.query("SELECT * FROM products")
    }

    static findById(id) {

    }
} 
