const path = require('path');

const express = require('express');

const productsController = require('../controllers/products');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth.js');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', isAuth, productsController.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', isAuth, productsController.postProduct);

// /admin/edit-product => GET
router.get('/edit-product/:productId', isAuth, productsController.getEditProduct);

// /admin/edit-product => POST
router.post('/edit-product', isAuth, productsController.postEditProduct);

// /admin/delete-product => GET
router.get('/delete-product/:productId', isAuth, productsController.deleteProduct);

// /admin/products => GET
router.get('/products', isAuth, productsController.getProductsAdmin);

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
