const Product = require('../models/product.js');
const Cart = require('../models/cart.js');

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

exports.postToCart = (req, res, err) => {
    const prodId = req.body.productId;
    Product.findItem(prodId, (product) => {
        Cart.addProduct(prodId, product.price);
    });
    res.redirect('/cart');
}

exports.getCheckout = (req, res, err) => {
    res.render('shop/checkout', {
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

exports.getProductDetails = (req, res, err) => {
    const prodId = req.params.productId;
    Product.findItem(prodId, product => {
        res.render('shop/product-detail.ejs', {
            path: 'product-detail',
            docTitle: 'Product Details',
            product: product,
        })
    });

};