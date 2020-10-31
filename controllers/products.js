const Product = require('../models/product.js');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product.ejs', {docTitle: 'Add Product Page', path: 'product'});
};

exports.postProduct = (req, res, next) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        const shopFile = 'shop/product-list.ejs';
        res.render(shopFile, { prods: products, docTitle: 'My Shop', path: 'shop' });
    });
};