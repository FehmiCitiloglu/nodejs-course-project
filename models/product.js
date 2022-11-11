const { getDb } = require("../util/database")
const mongodb = require("mongodb")

class Product {

    constructor(title, price, imageUrl, description, id, userId) {
        this.title = title
        this.price = price
        this.imageUrl = imageUrl
        this.description = description
        this._id = id ? new mongodb.ObjectId(id) : null
        this.userId = userId
    }

    save() {
        const db = getDb()
        let dbOp;
        if (this._id) {
            dbOp = db
                .collection("products")
                .updateOne({ _id: this._id }, { $set: this })
        } else {
            console.log("this", this);
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

    static deleteById(prodId) {
        const db = getDb()
        return db
            .collection("products")
            .deleteOne({ _id: new mongodb.ObjectId(prodId) })
            .then((result) => {
                console.log("%c DELETED!", "color: red; font-size: 48px");
            })
            .catch((err) => { console.error(err); })
    }

}


module.exports = Product