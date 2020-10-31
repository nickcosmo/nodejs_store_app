const Product = require('../models/product.js');

exports.getIndex = (req, res, err) => {
    Product.fetchAll(products => {
        const shopFile = 'shop/index.ejs';
        res.render(shopFile, { prods: products, docTitle: 'Index', path: 'index' });
    });
};

exports.getCart = (req, res, err) => {
    res.render('shop/cart.ejs', {
        path: 'cart',
        docTitle: 'Cart'
    })
};

exports.getCheckout = (req, res, err) => {
    res.render('/shop/checkout', {
        path: 'checkout',
        docTitle: 'Checkout'
    })
};

exports.getOrders = (req, res, err) => {
    res.render('shop/orders.ejs', {
        path: 'orders',
        docTitle: 'Orders'
    })
};