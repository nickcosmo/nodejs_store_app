const { INTEGER } = require('sequelize');
const Sequelize = require('sequelize');

const sequelize = require('../util/database.js');

const CartItem = sequelize.define('cartItem', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    quantity: {
        type: INTEGER,
    }
});

module.exports = CartItem;