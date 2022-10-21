const { getDb } = require("../util/database")
const mongodb = require("mongodb")

class User {
    constructor(username, email, id) {
        this.username = username
        this.email = email
        this._id = id ? new mongodb.ObjectId(id) : null
    }


    save() {
        const db = getDb()
        let dbObj
        if (this._id) {
            dbObj = db
                .collection("users")
                .updateOne({ _id: this._id }, { $set: this })
        } else {
            dbObj = db
                .collection("users")
                .insertOne(this)
        }
        return dbObj
            .then((result) => {
                console.log("user is added");
            })
            .catch(err => { console.error(err); })
    }

    static findById(userId) {
        const db = getDb()

        return db
            .collection("users")
            .find({ _id: new mongodb.ObjectId(userId) })
            .next()
            .then((user) => {
                return user
            })
            .catch((err) => {
                console.error(err);
            })
    }
}


module.exports = User