const Product = require('../models/product.js');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product.ejs', { docTitle: 'Add Product Page', path: 'add-product' });
};

exports.getEditProduct = (req, res, next) => {
    let productId = req.params.productId;
    Product.findByPk(productId)
        .then(product => {
            res.render('admin/edit-product.ejs', { product: product, docTitle: `Edit ${product.title}`, path: 'edit-product' });
        }).catch(err => console.log(err));
};

exports.postEditProduct = (req, res, next) => {
    Product.findByPk(req.body.id)
        .then(product => {
            product.title = req.body.title;
            product.description = req.body.desc;
            product.price = req.body.price;
            product.imageUrl = req.body.imageUrl;
            return product.save();
        })
        .then(result => {
            res.redirect('/admin/products');
        }).catch(err => console.log(err))
};

exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
    .then(product => {
        return product.destroy();
    })
    .then(result => {
        res.redirect('/admin/products');
    }).catch(err => console.log(err))
};

exports.postProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const desc = req.body.desc;
    const price = req.body.price;
    const user = req.user.id;

    Product.create({
        title: title,
        imageUrl: imageUrl,
        price: price,
        description: desc,
        userId: user,
    }).then(data => res.redirect('/')).catch(err => console.log(err));   
};

exports.getProducts = (req, res, next) => {
    Product.findAll()
    .then(products => {
        const shopFile = 'shop/product-list.ejs';
        res.render(shopFile, { prods: products, docTitle: 'Products', path: 'products' });
    }).catch(err => console.log(err));
};

exports.getProductsAdmin = (req, res, next) => {
    Product.findAll()
    .then(products => {
        const shopFile = 'admin/products.ejs';
        res.render(shopFile, { prods: products, docTitle: 'Admin Products', path: 'admin-products' });
    }).catch(err => console.log(err));
};