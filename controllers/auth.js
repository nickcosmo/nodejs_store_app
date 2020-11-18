const bcrypt = require('bcryptjs');

const User = require('../models/user.js');

exports.getLogin = (req, res, next) => {
    res.render('admin/login.ejs', {
        path: 'login',
        docTitle: 'Login',
        loggedStatus: req.session.loggedStatus
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
    .then(user => {
        if(!user) {
            return res.redirect('admin/login');
        }

        bcrypt.compare(password, user.password).then(matchResult => {
            if(matchResult === true) {
                req.session.loggedStatus = true;
                req.session.user = user;
                return req.session.save(err => {
                    console.log(err);
                    return res.redirect('/');
                });
            }
            res.redirect('/admin/login');
        }).catch(err => console.log(err));

    }).catch(err => console(err));
}

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {res.redirect('/')});
}

exports.getSignup = (req, res, next) => {
    res.render('admin/signup.ejs', {
        path: 'signup',
        docTitle: 'Signup',
        loggedStatus: req.session.loggedStatus
    })
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    User.findOne({email: email})
        .then(user => {
            if(user) {
                return res.redirect('/admin/signup');
            }
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const newUser = new User({
                        email: email,
                        password: hashedPassword,
                        cart: { items: [] } 
                    });
                    return newUser.save();
                }).then(result => {
                    res.redirect('/admin/login');
                });
            })
            .catch(err => console.log(err));
}