const fs = require('fs');
const path = require('path');

const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');

let getFileData = (cb) => {
    fs.readFile(p, (err, data) => {
        if (err) {
            cb([]);
        } else {
            if(data) {
                cb(JSON.parse(data)); // need to parse data so it returns as an array!
            }
        }
    })
};

module.exports = class Product {
    constructor(title, imageUrl, desc, price) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.desc = desc;
        this.price = price;
    }

    save() {
        // const p = path.join(path.dirname(process.mainModule.filename));
        this.id = Date.now().toString();
        getFileData(products => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                if(err) {console.log(err)};
            });
        });
    }

    static edit(id, title, desc, price, imageUrl) {
        Product.fetchAll(products => {
            const product = products.find(p => p.id === id );
            product.id = id;
            product.title = title;
            product.desc = desc;
            product.price = price;
            product.imageUrl = imageUrl;
            fs.writeFile(p, JSON.stringify(products), (err) => {
                if(err) {console.log(err)};
            });
        });
    }

    static fetchAll(cb) {
        getFileData(cb);
    }

    static findItem(id, cb) {
        getFileData(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        });
    }
};