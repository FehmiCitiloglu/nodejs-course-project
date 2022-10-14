const { getDb } = require("../util/database")
const mongodb = require("mongodb")

class Product {

    constructor(title, price, imageUrl, description, id) {
        this.title = title
        this.price = price
        this.imageUrl = imageUrl
        this.description = description
        this._id = id
    }

    save() {
        const db = getDb()
        let dbOp;
        if (this._id) {
            dbOp = db
                .collection("products")
                .updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this })
        } else {
            dbOp = db
                .collection("products")
                .insertOne(this)
        }

        return dbOp
            .then((result) => {
                console.log("product is added", result);
            })
            .catch((err) => {
                console.error(err);
            })
    }

    static fetchAll() {
        const db = getDb()

        return db
            .collection("products")
            .find()
            .toArray()
            .then((products) => {
                console.log(products);
                return products
            })
            .catch((err) => {
                console.error(err);
            })
    }
    static findById(prodId) {
        const db = getDb()
        return db
            .collection("products")
            .find({ _id: new mongodb.ObjectId(prodId) })
            .next()
            .then((product) => {
                console.log(product);
                return product
            })
            .catch((err) => { console.error(err); })
    }


}


module.exports = Product