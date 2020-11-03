const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view-engine', 'ejs');
app.set('views', 'views');

const sequelize = require('./util/database.js');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const notFoundPage = require('./controllers/404.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public'))); //serve static files

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use(notFoundPage.notFound);

sequelize.sync()
    .then(result => {
        app.listen(3000);
    })
    .catch(err => console.log(err));
