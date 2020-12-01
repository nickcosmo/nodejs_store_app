const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
require("dotenv").config();
// const csrf = require('csurf');

// const mongoConnect = require('./util/database.js').mongoConnect;
const User = require("./models/user.js");

const MONGODB_URI = process.env.MONGODB_URI;

const app = express();
const store = new MongoDbStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

app.set("view-engine", "ejs");
app.set("views", "views");

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errorPage = require("./controllers/error.js");

//multer functions
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}--${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg' ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
//end multer functions

app.use(bodyParser.urlencoded({ extended: false })); // 3rd party bodyparsing package
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")); // 3rd party file parsing package
app.use(express.static(path.join(__dirname, "public"))); // serve static files
app.use("/images", express.static(path.join(__dirname, "images"))); // serve static files
app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

app.use("/admin", adminData.routes);
app.use(shopRoutes);
app.get("/500", errorPage.systemIssue);
app.use(errorPage.notFound);

const opt = {
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(MONGODB_URI, opt)
  .then(() => {
    app.listen(3000);
    console.log("connected!");
  })
  .catch((err) => console.log(err));
