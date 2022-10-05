const Product = require("../models/product");


exports.getProducts = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("shop/product-list", {
            products: products,
            pageTitle: 'All Products',
            path: "/products"
        })
    })
}

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId
    Product.findById(productId, (product) => {
        res.render("shop/product-detail", { product, pageTitle: product.title, path: "/products" })
    })


}


exports.getIndex = (req, res, next) => {
    Product.fetchAll((products) => {
        res.render("shop/index", {
            products: products,
            pageTitle: 'Shop',
            path: "/"
        })
    })
}

exports.getCart = (req, res, next) => {
    res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
    })
}


exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout"
    })
}


exports.getOrders = (req, res, next) => {
    res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
    })
}
