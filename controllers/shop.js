const Product = require('../models/product.js');
const Order = require('../models/order.js');


exports.getIndex = (req, res, err) => {
    Product.find()
        .then(products => {
            const shopFile = 'shop/index.ejs';
            res.render(shopFile, { prods: products, docTitle: 'Index', path: 'index' })
        }).catch(err => console.log(err));
};

exports.getCart = (req, res, err) => {
    req.user.populate('cart.items.productId').execPopulate()
        .then((user) => {
            let products = user.cart.items;
            let totalPrice = 0;
            products.forEach(product => {
                totalPrice += product.productId.price * product.quantity;
            });
            res.render('shop/cart.ejs', {
                path: 'cart',
                docTitle: 'Cart',
                products: products,
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

    Product.findById(prodId)
        .then(product => {
            req.user.addToCart(product)
                .then(() => res.redirect('/cart'))
                .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, err) => {
    Order.find({ 'userId': req.user._id })
        .then(orders => {
            res.render('shop/orders.ejs', {
                path: 'orders',
                docTitle: 'Orders',
                orders: orders
            })
        }).catch(err => console.log(err));
};

exports.postToOrders = (req, res, err) => {
    req.user.populate('cart.items.productId').execPopulate()
        .then((user) => {
            let totalPrice = 0;
            user.cart.items.forEach(product => {
                totalPrice += product.productId.price * product.quantity;
            });
            let products = user.cart.items.map(item => {
                return { quantity: item.quantity, product: { ...item.productId._doc } };
            });
            const order = new Order({
                products: products,
                totalPrice: totalPrice.toFixed(2),
                userId: req.user,
            })
            return order.save();
        }).then(result => {
            return req.user.clearCart();
        }).then(result => res.redirect('/orders')
        ).catch(err => console.log(err));
};

exports.getProductDetails = (req, res, err) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            res.render('shop/product-detail.ejs', {
                path: 'product-detail',
                docTitle: 'Product Details',
                product: product,
            })
        })
        .catch(err => console.log(err));
};