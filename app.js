const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view-engine', 'ejs');
app.set('views', 'views');

const sequelize = require('./util/database.js');
const Product = require('./models/product.js');
const User = require('./models/user.js');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const notFoundPage = require('./controllers/404.js');

app.use(bodyParser.urlencoded({ extended: false })); // add 3rd party bodyparsing package
app.use(express.static(path.join(__dirname, 'public'))); //serve static files

app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        }).catch(err => console(err))
});

app.use('/admin', adminData.routes);
app.use(shopRoutes);
app.use(notFoundPage.notFound);

//define associations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);

sequelize.sync()
    .then(result => {
        return User.findByPk(1);
        
    }).then(user => {
        if(!user) {
            User.create({name: 'Nick', email: 'someemail@email.com'})
        }
        return user;
    }).then(user => {
        app.listen(3000);
    })
    .catch(err => console.log(err));
