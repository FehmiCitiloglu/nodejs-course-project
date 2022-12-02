// const path = require('path');

const express = require("express");
const {
  getProducts,
  getIndex,
  getCart,
  getOrders,
  getProduct,
  postCart,
  postCartDeleteProduct,
  postOrder,
} = require("../controllers/shop");

// const rootDir = require('../util/path');

const adminData = require("./admin");

const router = express.Router();

const isAuth = require("../middleware/is-auth");

router.get("/", getIndex);

router.get("/products", getProducts);
// // router.get("/products/delete",)

router.get("/products/:productId", getProduct);

router.get("/cart", isAuth, getCart);
router.post("/cart", isAuth, postCart);

router.post("/cart-delete-item", isAuth, postCartDeleteProduct);

router.post("/create-order", isAuth, postOrder);

// // router.get("/checkout", getCheckout)
router.get("/orders", isAuth, getOrders);

module.exports = router;
