const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const expressHandlebar = require("express-handlebars")

const sequelize = require("./util/database")

const app = express();

// the first parameter depend on us, And it effect even files' extension
// app.engine('handlebars', expressHandlebar())
/*
app.engine('hbs', expressHandlebar({
    layoutsDir: 'views/layouts',
    defaultLayout: 'main-layout',
    extname: 'hbs'
}))
app.set('view engine', 'hbs');
*/

app.set('view engine', 'ejs');
app.set("views", "views")

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const { get404 } = require('./controllers/error');
const Product = require("./models/product")
const User = require("./models/user")
const Cart = require("./models/cart")
const CartItem = require("./models/cart-item")


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findByPk(1)
        .then((user) => {
            // console.log("user in app.js", user)
            req.user = user
            next()
        })
        .catch((err) => {
            console.error(err);
        })
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(get404);

Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" })
User.hasMany(Product)
User.hasOne(Cart)
Cart.belongsTo(User)
Cart.belongsToMany(Product, { through: CartItem })
Product.belongsToMany(Cart, { through: CartItem })

sequelize
    // .sync()
    .sync({ force: true })
    .then(result => {
        return User.findByPk(1)

    }).then((user) => {
        if (!user) {
            return User.create({ name: "Fehmi", email: "test@test.com" })
        }
        return user
    })
    .then((user) => {
        // console.log(user);
        app.listen(3000);
    })
    .catch((err) => {
        console.error(err);
    })

