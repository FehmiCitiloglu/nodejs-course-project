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

    const product = new Product(title, imageUrl, description, price)
    product.save()
    res.redirect('/');
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;

    if (!editMode) {
        res.redirect("/")
    }

    const prodId = req.params.productId
    Product.findById(prodId, (product) => {
        if (!product) {
            return res.redirect("/")
        }
        console.log(product);
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: "/admin/edit-product",
            editing: editMode,
            product
        })
    })
}

exports.postEditProduct = (req, res, next) => {

}

exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("admin/products", {
            products: products,
            pageTitle: 'Admin Products',
            path: "/admin/products"
        })
    })
}