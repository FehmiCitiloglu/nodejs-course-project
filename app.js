const path = require("path");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

const MONGODB_URI = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.wh0bd8s.mongodb.net/shop?retryWrites=true&w=majority`;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});

const csrfProtection = csrf({});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
    console.log("\x1b[36m%s\x1b[0m", "fileStorage, cb works");
  },
  filename: (req, file, cb) => {
    console.log("file object", file);
    console.log("\x1b[36m%s\x1b[0m", cb);
    cb(null, new Date().toISOString() + "-" + file.originalname);
    console.log("cb works");
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
    console.log("fileFilter if works");
  } else {
    cb(null, false);
    console.log("fileFilter else works");
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

const User = require("./models/user");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const { get404, get500 } = require("./controllers/error");

app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
console.log("images path", path.join(__dirname, "images"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter }).single("image"));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req?.session?.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  // throw new Error("sync error");
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      // throw new Error("error");
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});

app.use(shopRoutes);
app.use(authRoutes);
app.use("/admin", adminRoutes);

app.use("/500", get500);

app.use(get404);

app.use((error, req, res, next) => {
  // res.status(error.httpStatusCode)
  res.status(500).render("500", {
    pageTitle: "Error!",
    path: "/500",
    isAuthenticated: req?.session?.isLoggedIn,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.info("db connected");
    app.listen(3000);
  })
  .catch((err) => {
    console.log("crashed");
    console.error(err);
  });
