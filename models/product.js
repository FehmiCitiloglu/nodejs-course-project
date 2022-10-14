const { getDb } = require("../util/database")

class Product {

    constructor(title, price, imageUrl, description) {
        this.title = title
        this.price = price
        this.imageUrl = imageUrl
        this.description = description
    }

    save() {
        const db = getDb()
        return db.collection("products")
            .insertOne(this)
            .then((result) => {
                console.log("product is added", result);
            })
            .catch((err) => {
                console.error(err);
            })
    }
}


module.exports = Product