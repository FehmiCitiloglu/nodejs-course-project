// const path = require('path');

const express = require('express');
const { getProducts } = require('../controllers/products');

// const rootDir = require('../util/path');

const adminData = require('./admin');

const router = express.Router();

router.get('/', getProducts);

module.exports = router;
