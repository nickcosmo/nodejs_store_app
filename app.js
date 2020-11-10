const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const mongoConnect = require('./util/database.js').mongoConnect;
// const User = require('./models/user.js');

const app = express();

app.set('view-engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const notFoundPage = require('./controllers/404.js');

app.use(bodyParser.urlencoded({ extended: false })); // add 3rd party bodyparsing package
app.use(express.static(path.join(__dirname, 'public'))); //serve static files

// app.use((req, res, next) => {
//     User.findUser('5fa8424fc8c107bb643cad6d')
//         .then(user => {
//             req.user = new User(user.name, user.email, user.cart, user._id);
//             next();
//         }).catch(err => console(err));
// });

app.use('/admin', adminData.routes);
app.use(shopRoutes);
app.use(notFoundPage.notFound);

mongoose.connect('mongodb+srv://nicklans:cv9u1mCtx7ctq6k3@cluster0.9g3si.mongodb.net/shop?retryWrites=true&w=majority')
    .then(() => {
        app.listen(3000);
        console.log('connected!');
    }).catch(err => console.log(err));