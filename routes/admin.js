const { body } = require("express-validator");
const express = require("express");
const {
  getAddProduct,
  postAddProduct,
  getProducts,
  getEditProduct,
  postEditProduct,
  deleteProduct,
} = require("../controllers/admin");

const router = express.Router();

const isAuth = require("../middleware/is-auth");

// /admin/add-product => GET
router.get("/add-product", isAuth, getAddProduct);

// /admin/add-product => POST
router.post(
  "/add-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    // body("imageUrl").isURL(),
    body("price").isFloat().trim(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  postAddProduct
);

// /admin/product => GET
router.get("/products", isAuth, getProducts);

router.get("/edit-product/:productId", isAuth, getEditProduct);

router.post(
  "/edit-product",
  [
    body("title").isString().isLength({ min: 3 }).trim(),
    body("price").isFloat().trim(),
    body("description").isLength({ min: 5, max: 400 }).trim(),
  ],
  isAuth,
  postEditProduct
);
router.delete("/product/:productId", isAuth, deleteProduct);

module.exports = router;
