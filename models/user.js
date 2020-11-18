const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cart: {
        items: [{ productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, quantity: { type: Number, required: true } }],
    },
});

userSchema.methods.addToCart = function (newCartProduct) {
    let foundIndex = -1;
    let updatedCart;

    if (this.cart.items.length > 0) {
        foundIndex = this.cart.items.findIndex(product => {
            return product.productId.toString() === newCartProduct._id.toString();
        });
    }

    if (foundIndex >= 0) {
        updatedCart = this.cart.items;
        updatedCart[foundIndex].quantity = updatedCart[foundIndex].quantity + 1;
    } else {
        updatedCart = [...this.cart.items, { productId: newCartProduct._id, quantity: 1 }];
    }
    this.cart.items = updatedCart;
    return this.save();
};

userSchema.methods.deleteCartItem = function (productId) {
    const updatedCart = this.cart.items.filter(product => {
        return product.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCart;
    return this.save();
};

userSchema.methods.clearCart = function () {
    this.cart = {};
    return this.save();
}

module.exports = mongoose.model('User', userSchema);

// const getDb = require('../util/database').getDb;
// const mongodb = require('mongodb');
// const Product = require('./product');
// class User {
//     constructor(username, email, cart, id) {
//         this.username = username;
//         this.email = email;
//         this.cart = cart;
//         this._id = id;
//     }

//     save() {
//         const db = getDb();
//         return db.collection('users').insertOne(this)
//             .then()
//             .catch(err => console.log(err));
//     }

//     addToCart(newCartProduct) {
//         const db = getDb();

//         let foundIndex = -1;
//         let updatedCart;

//         if (this.cart.length > 0) {
//             foundIndex = this.cart.findIndex(product => product._id.toString() === newCartProduct._id.toString());
//         } else {
//             updatedCart = [{ _id: new mongodb.ObjectId(newCartProduct._id), quantity: 1 }];
//             return db.collection('users').updateOne(
//                 { _id: new mongodb.ObjectId(this._id) },
//                 { $set: { cart: updatedCart } }
//             )
//         }

//         if (foundIndex >= 0) {
//             this.cart[foundIndex].quantity = this.cart[foundIndex].quantity + 1;
//             return db.collection('users').updateOne(
//                 { _id: new mongodb.ObjectId(this._id) },
//                 { $set: { cart: this.cart } }
//             )
//                 .then()
//                 .catch(err => console.log(err));
//         } else {
//             updatedCart = [...this.cart, { _id: new mongodb.ObjectId(newCartProduct._id), quantity: 1 }];
//             return db.collection('users').updateOne(
//                 { _id: new mongodb.ObjectId(this._id) },
//                 { $set: { cart: updatedCart } }
//             )
//         }
//     }

//     static findUser(userId) {
//         const db = getDb();
//         return db.collection('users').findOne({ _id: new mongodb.ObjectId(userId) })
//             .then(user => {
//                 return user;
//             })
//             .catch(err => console.log(err));
//     }

//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.map(i => {
//             return i._id;
//         });

//         return db.collection('products').find({ _id: { $in: productIds } }).toArray()
//             .then(products => {
//                 return products.map(p => {
//                     return {
//                         ...p, quantity: this.cart.find(j => {
//                             return j._id.toString() === p._id.toString();
//                         }).quantity
//                     };
//                 });
//             }).catch(err => console.log(err));
//     }

//     deleteCartItem(productId) {
//         const db = getDb();
//         const updatedCart = this.cart.filter(product => {
//             return product._id.toString() !== productId.toString();
//         });

//         return db.collection('users').updateOne(
//             { _id: new mongodb.ObjectId(this._id) },
//             { $set: { cart: updatedCart } })
//             .then()
//             .catch(err => console.log(err));
//     }

//     addOrder(price) {
//         const db = getDb();
//         return this.getCart().then(products => {
//             const cart = {
//                 items: products,
//                 price: price,
//                 user: {
//                     name: this.name,
//                     _id: new mongodb.ObjectId(this._id),
//                 }
//             };
//             return db.collection('orders').insertOne(cart)
//                 .then(result => {
//                     this.cart = [];
//                     return db.collection('users').updateOne(
//                         { _id: new mongodb.ObjectId(this._id) },
//                         { $set: { cart: this.cart, userId: this._id } })
//                 }).catch(err => console.log(err));
//         });


//     }

//     getOrders() {
//         const db = getDb();
//         return db.collection('orders').find({ 'user._id': new mongodb.ObjectId(this._id) }).toArray()
//             .then(orders => {
//                 return orders;
//             }).catch(err => console.log(err));
//     }
// };

// module.exports = User;