const path = require("path");

const express = require("express");

const rootDir = require("../util/path");
const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  postDeleteProduct,
} = require("../controllers/admin");

const router = express.Router();

const isAuth = require("../middleware/is-auth");

// /admin/add-product => GET
router.get("/add-product", isAuth, getAddProduct);

// /admin/add-product => POST
router.post("/add-product", isAuth, postAddProduct);

// /admin/product => GET
router.get("/products", isAuth, getProducts);

router.get("/edit-product/:productId", isAuth, getEditProduct);

router.post("/edit-product", isAuth, postEditProduct);
router.post("/delete-product", isAuth, postDeleteProduct);

module.exports = router;
