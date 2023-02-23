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
  getCheckoutSuccess,
  getInvoice,
  getCheckout,
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

// router.post("/create-order", isAuth, postOrder);

router.get("/checkout", isAuth, getCheckout);
router.get("/checkout/success", getCheckoutSuccess);
router.get("/checkout/cancel", getCheckout);

router.get("/orders", isAuth, getOrders);

router.get("/orders/:orderId", isAuth, getInvoice);

module.exports = router;
