const Product = require('../models/product.js');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product.ejs', { docTitle: 'Add Product Page', path: 'add-product' });
};

exports.getEditProduct = (req, res, next) => {
    let productId = req.params.productId;
    Product.findItem(productId, product => {
        res.render('admin/edit-product.ejs', { product: product, docTitle: `Edit ${product.title}`, path: 'edit-product' });
    })
};

exports.postEditProduct = (req, res, next) => {
    Product.findItem(req.body.id, product => {
        Product.edit(req.body.id, req.body.title, req.body.desc, req.body.price, req.body.imageUrl);
        res.redirect('/admin/products');
    })
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