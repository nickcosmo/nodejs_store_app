const User = require('../models/user.js');

exports.getLogin = (req, res, next) => {
    res.render('admin/login.ejs', {
        path: 'login',
        docTitle: 'Login',
        loggedStatus: req.session.loggedStatus
    })
}

exports.postLogin = (req, res, next) => {
    req.session.loggedStatus = true;
    User.findById('5fabbad6bc342925d8a084bb')
    .then(user => {
        req.session.user = user;
        res.redirect('/');
    }).catch(err => console(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {res.redirect('/')});
}