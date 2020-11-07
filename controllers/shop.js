const Product = require('../models/product.js');

exports.getIndex = (req, res, err) => {
    Product.findAll()
        .then(products => {
            const shopFile = 'shop/index.ejs';
            res.render(shopFile, { prods: products, docTitle: 'Index', path: 'index' })
        }).catch(err => console.log(err));
};

exports.getCart = (req, res, err) => {
    req.user.getCart()
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    let totalPrice = 0;
                    products.forEach(product => {
                        totalPrice += product.price * product.cartItem.quantity;
                    });
                    res.render('shop/cart.ejs', {
                        path: 'cart',
                        docTitle: 'Cart',
                        products: products,
                        totalPrice: totalPrice.toFixed(2)
                    })
                })
                .catch(err => console.log(err))
        })
        .catch(err => console.log(err))
};

exports.removeFromCart = (req, res, err) => {
    const prodId = req.body.productId;
    req.user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: prodId } })
        }).then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        }).then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err))
};

exports.postToCart = (req, res, err) => {
    const prodId = req.body.productId;
    let foundCart;
    let newQuantity = 1;
    req.user.getCart()
        .then(cart => {
            foundCart = cart;
            return cart.getProducts({ where: { id: prodId } });
        })
        .then(products => {
            let product;

            if (products.length > 0) {
                product = products[0];
            }
            if (product) {
                let oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(prodId);
        }).then(product => {
            return foundCart.addProduct(product, { through: { quantity: newQuantity } })
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err))
}

exports.getCheckout = (req, res, err) => {
    res.render('shop/checkout', {
        path: 'checkout',
        docTitle: 'Checkout'
    })
};

exports.getOrders = (req, res, err) => {
    req.user.getOrders({ include: ['products'] })
        .then(orders => {
            res.render('shop/orders.ejs', {
                path: 'orders',
                docTitle: 'Orders',
                orders: orders
            })
        }).catch(err => console.log(err));
};

exports.postToOrders = (req, res, err) => {
    let myCart;
    req.user.getCart()
        .then(cart => {
            myCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user.createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = { quantity: product.cartItem.quantity };
                        return product;
                    })).then().catch(err => console.log(err));
                }).catch(err => console.log(err));
        }).then(result => {
            return myCart.setProducts(null);
        }).then(result => {
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