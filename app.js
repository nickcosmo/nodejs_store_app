const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const mongoConnect = require('./util/database.js').mongoConnect;

const app = express();

app.set('view-engine', 'ejs');
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const notFoundPage = require('./controllers/404.js');

app.use(bodyParser.urlencoded({ extended: false })); // add 3rd party bodyparsing package
app.use(express.static(path.join(__dirname, 'public'))); //serve static files

app.use((req, res, next) => {
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;
            next();
    //     }).catch(err => console(err))
});

app.use('/admin', adminData.routes);
app.use(shopRoutes);
app.use(notFoundPage.notFound);


mongoConnect(()=> {
    app.listen(3000);
});