const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('Product', productSchema);


// const getDb = require('../util/database').getDb;
// const mongodb = require('mongodb');
// class Product {
//     constructor(title, price, description, imageUrl, userId) {
//         this.title = title;
//         this.price = price;
//         this.description = description;
//         this.imageUrl = imageUrl;
//         this.userId = userId;
//         // this.id = id ? id : null;
//     }

//     save() {
//         const db = getDb();
//         return db.collection('products').insertOne(this)
//             .then()
//             .catch(err => console.log(err));
//     }

//     static findAll() {
//         const db = getDb();
//         return db.collection('products').find().toArray()
//             .then(data => {
//                 return data;
//             })
//             .catch(err => console.log(err));
//     }

//     static findProduct(id) {
//         const db = getDb();
//         return db.collection('products').find({ _id: new mongodb.ObjectId(id) }).next()
//             .then(product => {
//                 return product;
//             })
//             .catch(err => console.log(err));
//     }

//     static deleteProduct(id) {
//         const db = getDb();
//         return db.collection('products').deleteOne({ _id: new mongodb.ObjectId(id) })
//             .then(product => {
//                 console.log('deleted');
//             })
//             .catch(err => console.log(err));
//     }

//     static editProduct(id, data) {
//         const db = getDb();
//         const filter = { _id: new mongodb.ObjectId(id) };
//         const updateDoc = {
//             $set: {
//                 title: data.title,
//                 price: data.price,
//                 description: data.description,
//                 imageUrl: data.imageUrl
//             }
//         }

//         return db.collection('products').updateOne(filter, updateDoc)
//             .then()
//             .catch(err => console.log(err));
//     }
// }
