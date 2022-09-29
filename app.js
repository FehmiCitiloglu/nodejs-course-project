const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const expressHandlebar = require("express-handlebars")

const app = express();

// the first parameter depend on us, And it effect even files' extension
// app.engine('handlebars', expressHandlebar())
app.engine('hbs', expressHandlebar())

app.set('view engine', 'hbs');
app.set("views", "views")

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);


app.use((req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(404).render('404', { pageTitle: 'Page not found!' })
});

app.listen(3000);
