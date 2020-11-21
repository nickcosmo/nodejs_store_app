const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDbStore = require('connect-mongodb-session')(session);
const flash = require('connect-flash');
require('dotenv').config();
// const csrf = require('csurf');

// const mongoConnect = require('./util/database.js').mongoConnect;
const User = require('./models/user.js');

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
const store = new MongoDbStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.set('view-engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const notFoundPage = require('./controllers/404.js');

app.use(bodyParser.urlencoded({ extended: false })); // add 3rd party bodyparsing package
app.use(express.static(path.join(__dirname, 'public'))); //serve static files
app.use(session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store }));
app.use(flash());

app.use((req, res, next) => {
    if(!req.session.user) {
        return next();
    };
    
    User.findById(req.session.user._id)
    .then(user => {
        req.user = user;
        next();
    }).catch(err => console(err));
});

app.use('/admin', adminData.routes);
app.use(shopRoutes);
app.use(notFoundPage.notFound);

mongoose.connect(MONGODB_URI)
    .then(() => {
        app.listen(3000);
        console.log('connected!');
    }).catch(err => console.log(err));