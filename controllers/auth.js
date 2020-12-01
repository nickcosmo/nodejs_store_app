const crypto = require("crypto");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const sgMail = require("@sendgrid/mail");
const { validationResult } = require("express-validator");
// const nodemailer = require('nodemailer');
// const mailTransport = require('nodemailer-sendgrid-transport');

const User = require("../models/user.js");

sgMail.setApiKey(process.env.SENDGRID_APIKEY);

// const transporter = nodemailer.createTransport(mailTransport({
//     auth: {
//         api_key: process.env.SENDGRID_APIKEY,
//     }
// }));

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message;
  } else {
    message = null;
  }
  res.render("admin/login.ejs", {
    path: "login",
    docTitle: "Login",
    loggedStatus: req.session.loggedStatus,
    errorMessage: message,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/login.ejs", {
      path: "login",
      docTitle: "Login",
      loggedStatus: req.session.loggedStatus,
      errorMessage: errors.array()[0].msg,
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        req.flash("error", "invalid email or password");
        return res.redirect("/admin/login");
      }

      bcrypt
        .compare(password, user.password)
        .then((matchResult) => {
          if (matchResult === true) {
            req.session.loggedStatus = true;
            req.session.user = user;
            return req.session.save((err) => {
              if (err) {
                console.log(err);
              }
              req.flash("error", "invalid email or password");
              return res.redirect("/");
            });
          }
          res.redirect("/admin/login");
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => {
      res.redirect("/500");
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message;
  } else {
    message = null;
  }
  res.render("admin/signup.ejs", {
    path: "signup",
    docTitle: "Signup",
    loggedStatus: req.session.loggedStatus,
    errorMessage: message,
  });
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/signup.ejs", {
      path: "signup",
      docTitle: "Signup",
      loggedStatus: req.session.loggedStatus,
      errorMessage: errors.array()[0].msg,
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        req.flash(
          "error",
          "user already exists. please use different credentials!"
        );
        return res.redirect("/admin/signup");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashedPassword) => {
          const newUser = new User({
            email: email,
            password: hashedPassword,
            cart: { items: [] },
          });
          return newUser.save();
        })
        .then((result) => {
          res.redirect("/admin/login");
          return sgMail.send({
            to: email,
            from: process.env.VERIFIED_SENDER,
            subject: "Signup Successful",
            text: "your signup was successful!",
            html: "<h1>Signup was successful!</h1>",
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      res.redirect("/500");
    });
};

exports.getResetPassword = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message;
  } else {
    message = null;
  }

  res.render("admin/reset-password.ejs", {
    path: "reset-password",
    docTitle: "Reset Password",
    loggedStatus: req.session.loggedStatus,
    errorMessage: message,
  });
};

exports.postResetPassword = (req, res, next) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect("/reset");
    }
    const token = buffer.toString("hex");
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash("error", "No account found!");
          return res.redirect("/admin/reset-password");
        }
        user.resetToken = token;
        user.resetTokenExp = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        res.redirect("/");
        return sgMail.send({
          to: req.body.email,
          from: process.env.VERIFIED_SENDER,
          subject: "Password Reset",
          text: "You requested a password reset",
          html: `
                    <h1>Password Reset</h1>
                    <p>click <a href="http://localhost:3000/admin/update-password/${token}">here</a> to reset password</p>
                    `,
        });
      })
      .catch((err) => {
        res.redirect("/500");
      });
  });
};

exports.getUpdatePassword = (req, res, next) => {
  const token = req.params.token;
  User.findOne({ resetToken: token, resetTokenExp: { $gt: Date.now() } })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message;
      } else {
        message = null;
      }

      res.render("admin/update-password.ejs", {
        path: "update-password",
        docTitle: "Update Password",
        loggedStatus: req.session.loggedStatus,
        errorMessage: message,
        userId: user._id.toString(),
        token: token,
      });
    })
    .catch((err) => {
      res.redirect("/500");
    });
};

exports.postUpdatePassword = (req, res, next) => {
  const userId = req.body.userId;
  const token = req.params.token;
  const newPassword = req.body.newPassword;

  User.findOne({
    _id: userId,
    resetToken: token,
    resetTokenExp: { $gt: Date.now() },
  })
    .then((user) => {
      bcrypt.hash(newPassword, 12).then((hashedPassword) => {
        user.password = hashedPassword;
        return user.save();
      });
    })
    .then((result) => {
      res.redirect("/admin/login");
    })
    .catch((err) => {
      res.redirect("/500");
    });
};
