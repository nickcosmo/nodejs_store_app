const Product = require('../models/product.js');

exports.getIndex = (req, res, err) => {
    Product.findAll()
        .then(products => {
            const shopFile = 'shop/index.ejs';
            res.render(shopFile, { prods: products, docTitle: 'Index', path: 'index' })
        }).catch(err => console.log(err));
};

exports.getCart = (req, res, err) => {
    req.user.getCart(req.user._id)
        .then((cart) => {
            let totalPrice = 0;
            cart.forEach(product => {
                totalPrice += product.price * product.quantity;
            });
            res.render('shop/cart.ejs', {
                path: 'cart',
                docTitle: 'Cart',
                products: cart,
                totalPrice: totalPrice.toFixed(2)
            })
        }).catch(err => console.log(err));
};

exports.removeFromCart = (req, res, err) => {
    const prodId = req.body.productId;
    req.user.deleteCartItem(prodId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err))
};

exports.postToCart = (req, res, err) => {
    const prodId = req.body.productId;

    Product.findProduct(prodId)
        .then(product => {
            req.user.addToCart(product)
                .then(() => res.redirect('/cart'))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, err) => {
    req.user.getOrders()
        .then(orders => {
            res.render('shop/orders.ejs', {
                path: 'orders',
                docTitle: 'Orders',
                orders: orders
            })
        }).catch(err => console.log(err));
};

exports.postToOrders = (req, res, err) => {
    req.user.addOrder(req.body.totalPrice)
        .then(result => {
            res.redirect('/orders');
        }).catch(err => console.log(err));
};

exports.getProductDetails = (req, res, err) => {
    const prodId = req.params.productId;
    Product.findProduct(prodId)
        .then(product => {
            res.render('shop/product-detail.ejs', {
                path: 'product-detail',
                docTitle: 'Product Details',
                product: product,
            })
        })
        .catch(err => console.log(err));
};