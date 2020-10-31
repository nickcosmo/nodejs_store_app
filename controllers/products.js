const Product = require('../models/product.js');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product.ejs', {docTitle: 'Add Product Page', path: 'add-product'});
};

exports.postProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const desc = req.body.desc;
    const price = req.body.price;
    
    const product = new Product(title, imageUrl, desc, price);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        const shopFile = 'shop/product-list.ejs';
        res.render(shopFile, { prods: products, docTitle: 'Products', path: 'products' });
    });
};

exports.getProductsAdmin = (req, res, next) => {
    Product.fetchAll(products => {
        const shopFile = 'admin/products.ejs';
        res.render(shopFile, { prods: products, docTitle: 'Admin Products', path: 'admin-products' });
    });
};