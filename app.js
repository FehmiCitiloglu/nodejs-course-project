const path = require('path');
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set("views", "views")

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');
const { get404 } = require('./controllers/error');

const mongoConnect = require("./util/database")


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(get404);


mongoConnect((client) => {
    console.log(client);
    app.listen(3000)
})