const bcrypt = require('bcryptjs');
require('dotenv').config();
// const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
const mailTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/user.js');

const transporter = nodemailer.createTransport(mailTransport({
    auth: {
        api_key: process.env.SENDGRID_USERKEY,
    }
}));

exports.getLogin = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message;
    } else {
        message = null;
    }
    res.render('admin/login.ejs', {
        path: 'login',
        docTitle: 'Login',
        loggedStatus: req.session.loggedStatus,
        errorMessage: message
    })
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
    .then(user => {
        if(!user) {
            req.flash('error', 'invalid email or password');
            return res.redirect('/admin/login');
        }

        bcrypt.compare(password, user.password).then(matchResult => {
            if(matchResult === true) {
                req.session.loggedStatus = true;
                req.session.user = user;
                return req.session.save(err => {
                    if(err) {console.log(err)};
                    req.flash('error', 'invalid email or password');
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
    let message = req.flash('error');
    if(message.length > 0) {
        message = message;
    } else {
        message = null;
    }
    res.render('admin/signup.ejs', {
        path: 'signup',
        docTitle: 'Signup',
        loggedStatus: req.session.loggedStatus,
        errorMessage: message
    })
}

exports.postSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email: email})
        .then(user => {
            if(user) {
                req.flash('error', 'user already exists. please use different credentials!');
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
                    return transporter.sendMail({
                        to: email,
                        from: process.env.VERIFIED_SENDER,
                        subject: 'Signup Successful',
                        html: '<h1>Signup was successful!</h1>'
                    });
                }).catch(err => {
                    console.log(err);
                });
            })
            .catch(err => console.log(err));
}

exports.getResetPassword = (req, res, next) => {
    let message = req.flash('error');
    if(message.length > 0) {
        message = message;
    } else {
        message = null;
    }
    
    res.render('admin/reset-password.ejs', {
        path: 'reset-password',
        docTitle: 'Reset Password',
        loggedStatus: req.session.loggedStatus,
        errorMessage: message
    })
}