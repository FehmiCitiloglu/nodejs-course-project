const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.dxkoo.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);


const mongoConnect = (callback) => {

    client.connect()
        .then((client) => {
            console.log("connected");
            callback(client)
        })
        .catch((err) => {
            console.error(err);
            client.close()
        })
}

module.exports = mongoConnect