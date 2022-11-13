const { getDb } = require("../util/database");
const { ObjectId } = require("mongodb");

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this._id = id;
    this.cart = cart;
  }

  save() {
    const db = getDb();
    let dbObj;
    if (this._id) {
      dbObj = db
        .collection("users")
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbObj = db.collection("users").insertOne(this);
    }
    return dbObj
      .then((result) => {
        console.log("user is added");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId?.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      );
  }

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((i) => {
      return i.productId;
    });
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find((i) => {
              return i.productId.toString() === p._id.toString();
            }).quantity,
          };
        });
      })
      .catch((err) => {
        console.error(err);
      });
  }

  static findById(userId) {
    const db = getDb();

    return db
      .collection("users")
      .find({ _id: new ObjectId(userId) })
      .next()
      .then((user) => {
        return user;
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

module.exports = User;
