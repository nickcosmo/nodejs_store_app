const Product = require('../models/product.js');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product.ejs', { docTitle: 'Add Product Page', path: 'add-product', loggedStatus: req.session.loggedStatus });
};

exports.getEditProduct = (req, res, next) => {
    let productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            res.render('admin/edit-product.ejs', { product: product, docTitle: `Edit ${product.title}`, path: 'edit-product', loggedStatus: req.session.loggedStatus });
        })
        .catch(err => { 
            res.redirect('/500');
        });
};

exports.postEditProduct = (req, res, next) => {
    const newTitle = req.body.title;
    const newDescription = req.body.desc;
    const newPrice = req.body.price;
    const newImage = req.body.imageUrl;

    Product.findById(req.body.id)
        .then(product => {
            if(product.userId.toString() !== req.user._id.toString()){
                return res.redirect('/');
            }
            product.title = newTitle;
            product.description = newDescription;
            product.price = newPrice;
            product.imageUrl = newImage;
            return product.save()
                .then(() => {
                    res.redirect('/admin/products');
                })
        })
        .catch(err => { 
            res.redirect('/500');
        });
};

exports.deleteProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByIdAndRemove(prodId)
        .then(product => {
            res.redirect('/admin/products');
        })
        .catch(err => { 
            res.redirect('/500');
        });
};

exports.postProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const desc = req.body.desc;
    const price = req.body.price;

    const product = new Product({ title: title, price: price, description: desc, imageUrl: imageUrl, userId: req.user._id });

    product.save()
        .then(data => res.redirect('/'))
        .catch(err => { 
            res.redirect('/500');
        });
};

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            const shopFile = 'shop/product-list.ejs';
            res.render(shopFile, { prods: products, docTitle: 'Products', path: 'products', loggedStatus: req.session.loggedStatus });
        })
        .catch(err => { 
            res.redirect('/500');
        });
};

exports.getProductsAdmin = (req, res, next) => {
    Product.find({userId: req.user._id})
        .then(products => {
            const shopFile = 'admin/products.ejs';
            res.render(shopFile, { prods: products, docTitle: 'Admin Products', path: 'admin-products', loggedStatus: req.session.loggedStatus });
        })
        .catch(err => { 
            res.redirect('/500');
        });
};