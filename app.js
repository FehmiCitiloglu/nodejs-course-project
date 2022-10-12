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


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);


app.use(get404);


Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" })
// User.hasMany(Product)

sequelize
    .sync({ force: true })
    .then(result => {
        // console.log(result)
        app.listen(3000);
    })
    .catch((err) => {
        console.error(err);
    })

