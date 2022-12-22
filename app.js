const path = require("path");
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const MONGODB_URI = `mongodb+srv://${process.env.USERNAME}:${process.env.PASSWORD}@cluster0.wh0bd8s.mongodb.net/shop?retryWrites=true&w=majority`;

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions",
});
console.log(store);

const csrfProtection = csrf({});
console.log("process.env.USERNAME", process.env.USERNAME);

app.set("view engine", "ejs");
app.set("views", "views");

const User = require("./models/user");
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const { get404 } = require("./controllers/error");

app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.urlencoded({ extended: false }));

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
  console.log("req.session.user yok");
  if (!req.session.user) {
    console.log("req.session.user yok");
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.error(err);
    });
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  console.log("res.locals.csrfToken", res.locals.csrfToken);
  next();
});

app.use(shopRoutes);
app.use(authRoutes);
app.use("/admin", adminRoutes);

app.use(get404);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    console.info("db connected");
    console.info("http://localhost:3000");
    app.listen(3000);
  })
  .catch((err) => {
    console.log("patladi");
    console.error(err);
  });
