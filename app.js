const path = require('path');
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set("views", "views")

const User = require("./models/user")


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { get404 } = require('./controllers/error');

const { mongoConnect } = require("./util/database")


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    User
    .findById("6349dc1e9e95fa4c567428c7")
    .then((user) => { 
        console.log("user", user);
        res.user = new User(user.name, user.email, user.cart, user._id);
        next()
    })
    .catch((err) => { console.error(err); })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);


mongoConnect(() => {

    // new User("fehmi", "test@test.com").save()
    // const user = new User()


    app.listen(3000)
})