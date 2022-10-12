const Product = require("../models/product")

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: "/admin/add-product",
        editing: false
    })
}

exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, description, price } = req.body
    // Product
    //     .create({
    console.log("req.user", req.usera)
    req.user.createProduct({
        title,
        image_url: imageUrl,
        price,
        description,
    })
        .then((result) => {
            console.log(result);
            res.redirect("/admin/products")
        })
        .catch((err) => {
            console.error(err);
        })
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;

    if (!editMode) {
        res.redirect("/")
    }

    const prodId = req.params.productId


    Product.findByPk(prodId)
        .then((product) => {
            if (!product) {
                return res.redirect("/")
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: "/admin/edit-product",
                editing: editMode,
                product
            })
        })
        .catch((err) => { console.error(err); })
}

exports.postEditProduct = (req, res, next) => {
    const { productId, title, price, imageUrl, description } = req.body

    Product.findByPk(productId)
        .then((product) => {

            product.title = title
            product.price = price
            product.image_url = imageUrl
            product.description = description

            return product.save()
        }).then((result) => {
            console.log(result);
            res.redirect("/admin/products")
        })
        .catch((err) => {
            console.error(err)
        })

}

exports.getProducts = (req, res, next) => {

    Product.findAll()
        .then((products) => {
            res.render("admin/products", {
                products,
                pageTitle: 'Admin Products',
                path: "/admin/products"
            })
        }
        )
        .catch((err) => {
            console.error(err);
        })
}



exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    Product.destroy({
        where: {
            id: prodId
        }
    })
    res.redirect("/admin/products")
}
