const { MongoClient, ServerApiVersion } = require('mongodb');

let _db;

const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.dxkoo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);


const mongoConnect = (callback) => {

    client.connect()
        .then((client) => {
            console.log("connected");
            _db = client.db()
            callback(client)
        })
        .catch((err) => {
            console.error(err);
            client.close()
            throw err
        })
}


const getDb = () => {
    if (_db) {
        return _db
    }
    throw "No database found!"
}


exports.mongoConnect = mongoConnect
exports.getDb = getDb