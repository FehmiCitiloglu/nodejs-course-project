const path = require('path');

const express = require('express');

const rootDir = require('../util/path');
const { getAddProduct, postAddProduct, getProducts, getEditProduct } = require('../controllers/admin');

const router = express.Router();



// /admin/add-product => GET
router.get('/add-product', getAddProduct);

// /admin/add-product => POST
router.post('/add-product', postAddProduct);

// /admin/product => GET
router.get('/products', getProducts);

router.get("/edit-product/:productId", getEditProduct)

module.exports = router
