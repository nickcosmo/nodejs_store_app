const path = require('path');

const express = require('express');

const adminData = require('./admin');
const productsController = require('../controllers/products.js');
const shopController = require('../controllers/shop.js');


const router = express.Router();

// / => GET
router.get('/', shopController.getIndex);

// /product-list => GET
router.get('/products', productsController.getProducts);

// /cart => GET
router.get('/cart', shopController.getCart);

// /checkout => GET
router.get('/checkout', shopController.getCheckout);

// /orders => GET
router.get('/orders', shopController.getOrders);

module.exports = router;
