const path = require('path');

const express = require('express');

const productsController = require('../controllers/products');
const authController = require('../controllers/auth');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', productsController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', productsController.postProduct);

// /admin/edit-product => GET
router.get('/edit-product/:productId', productsController.getEditProduct);

// /admin/edit-product => POST
router.post('/edit-product', productsController.postEditProduct);

// /admin/delete-product => GET
router.get('/delete-product/:productId', productsController.deleteProduct);

// /admin/products => GET
router.get('/products', productsController.getProductsAdmin);

// /admin/login => GET
router.get('/login', authController.getLogin);

// /admin/login => POST
router.post('/login', authController.postLogin);

// /admin/logout => POST
router.post('/logout', authController.postLogout);

// /admin/signup => GET
router.get('/signup', authController.getSignup);

// /admin/signup => POST
router.post('/signup', authController.postSignup);


exports.routes = router;
