const path = require('path');

const express = require('express');

const adminData = require('./admin');
const productsController = require('../controllers/products.js');
const shopController = require('../controllers/shop.js');
const isAuth = require('../middleware/is-auth.js');



const router = express.Router();

// // / => GET
router.get('/', shopController.getIndex);

// // /product-list => GET
router.get('/products', productsController.getProducts);

// // /cart => GET
router.get('/cart', isAuth, shopController.getCart);

// // /cart => POST
router.post('/cart', isAuth, shopController.postToCart)

// // /remove-item => POST
router.post('/remove-item', isAuth, shopController.removeFromCart)

// // /products/productId => GET
router.get('/products/:productId', shopController.getProductDetails);

// // /orders => GET
router.get('/orders', isAuth, shopController.getOrders);

// // /orders => POST
router.post('/orders', isAuth, shopController.postToOrders);

module.exports = router;
