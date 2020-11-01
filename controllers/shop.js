const Product = require('../models/product.js');
const Cart = require('../models/cart.js');

exports.getIndex = (req, res, err) => {
    Product.fetchAll(products => {
        const shopFile = 'shop/index.ejs';
        res.render(shopFile, { prods: products, docTitle: 'Index', path: 'index' });
    });
};

exports.getCart = (req, res, err) => {
    Cart.fetchCart(cart => {
        const cartProducts = cart.products;
        const totalPrice = cart.totalPrice;
        Product.fetchAll(products => {
            cartProducts.forEach(product => {
                const found = products.find(p => p.id === product.id);
                product.title = found.title;
                product.imageUrl = found.imageUrl;
                product.desc = found.desc;
                product.price = found.price;
            });

            res.render('shop/cart.ejs', {
                path: 'cart',
                docTitle: 'Cart',
                products: cartProducts,
                totalPrice: totalPrice.toFixed(2)
            });
        });
    })
};

exports.removeFromCart = (req, res, err) => {
    Cart.deleteProduct(req.body.productId, req.body.productPrice);
    res.redirect('/cart');
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