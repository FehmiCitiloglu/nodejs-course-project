
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
        return db.query(
            {
                text: "INSERT INTO products(title, price, image_url, description) VALUES ($1, $2, $3, $4) RETURNING *",
                values: [this.title, this.price, this.imageUrl, this.description]
            }
        )
    }

    static deleteById(id) {

    }

    static fetchAll() {
        return db.query("SELECT * FROM products")
    }

    static findById(id) {
        return db.query("SELECT * FROM products WHERE id=$1", [id])
    }
} 
