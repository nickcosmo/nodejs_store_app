const path = require('path');

const express = require('express');

const productsController = require('../controllers/products');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', productsController.postProduct);

// /admin/edit-product => GET
router.get('/edit-product/:productId', productsController.getEditProduct);

// /admin/edit-product => POST
router.post('/edit-product/:productId', productsController.postEditProduct);

// /admin/products => GET
router.get('/products', productsController.getProductsAdmin);

exports.routes = router;
