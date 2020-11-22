const path = require('path');
const express = require('express');
const { check, body } = require('express-validator/check');

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
router.post('/login', [
    check('email').isEmail().withMessage('Invalid email'),
    check('password', 'Invalid Password').isLength({ min: 5 }).isAlphanumeric()
], authController.postLogin);

// /admin/logout => POST
router.post('/logout', authController.postLogout);

// /admin/signup => GET
router.get('/signup', authController.getSignup);

// /admin/signup => POST
router.post('/signup', [
    check('email').isEmail().withMessage('Invalid email'),
    check('password', 'Password needs to be at least 5 characters').isLength({ min: 5 }).isAlphanumeric(),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation failed. Make sure the confirmed password is the same');
        }
        return true;
    })
], authController.postSignup);

// /admin/reset-password => GET
router.get('/reset-password', authController.getResetPassword);

// /admin/reset-password => POST
router.post('/reset-password', authController.postResetPassword);

// /admin/update-password => GET
router.get('/update-password/:token', authController.getUpdatePassword);

// /admin/update-password => POST
router.post('/update-password/:token', authController.postUpdatePassword);

exports.routes = router;
