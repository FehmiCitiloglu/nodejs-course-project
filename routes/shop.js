// const path = require('path');

const express = require("express");
const {
  getProducts,
  getIndex,
  getCart,
  getCheckout,
  getOrders,
  getProduct,
  postCart,
  postCartDeleteProduct,
  postOrder,
} = require("../controllers/shop");

// const rootDir = require('../util/path');

const adminData = require("./admin");

const router = express.Router();

router.get("/", getIndex);

router.get("/products", getProducts);
// // router.get("/products/delete",)

router.get("/products/:productId", getProduct);

router.get("/cart", getCart);
router.post("/cart", postCart);

// router.post("/cart-delete-item", postCartDeleteProduct);

// router.post("/create-order", postOrder);

// // router.get("/checkout", getCheckout)
// router.get("/orders", getOrders);

module.exports = router;
