const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const { getAddProduct, postAddProduct, getProducts, getEditProduct, postEditProduct, postDeleteProduct } = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', getAddProduct);

// /admin/add-product => POST
router.post('/add-product', postAddProduct);

// /admin/product => GET
router.get('/products', getProducts);

router.get("/edit-product/:productId", getEditProduct)
router.post("/edit-product", postEditProduct)
router.post("/delete-product", postDeleteProduct)

module.exports = router
