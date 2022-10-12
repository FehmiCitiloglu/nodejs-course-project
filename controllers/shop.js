const Product = require("../models/product");
const Cart = require("../models/cart")


exports.getProducts = (req, res, next) => {

    Product.findAll()
        .then((products) => {
            res.render("shop/product-list", {
                products,
                pageTitle: 'All Products',
                path: "/products"
            })
        })
        .catch((err) => { console.error(err); })

}

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId

    // Product.findAll({
    //     where: {
    //         id: productId
    //     }
    // })
    //     .then((product) => {
    //         res.render("shop/product-detail",
    //             {
    //                 product: product[0],
    //                 pageTitle: product.title,
    //                 path: "/products"
    //             }
    //         )
    //     })
    //     .catch((err) => {
    //         console.error(err)
    //     })

    Product.findByPk(productId)
        .then((product) => {
            res.render("shop/product-detail",
                {
                    product,
                    pageTitle: product.title,
                    path: "/products"
                }
            )
        })
        .catch((err) => {
            console.error(err)
        })
}

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then((products) => {
            res.render("shop/index", {
                products,
                pageTitle: 'Shop',
                path: "/"
            })
        })
        .catch((err) => { console.error(err); })
}

exports.getCart = (req, res, next) => {

    req.user
        .getCart()
        .then((cart) => {
            return cart.getProducts().then((products) => {
                res.render("shop/cart", {
                    path: "/cart",
                    pageTitle: "Your Cart",
                    products
                })
            }).catch((err) => { console.error(err); })
        })
        .catch((err) => { console.error(err) })
}


exports.getCheckout = (req, res, next) => {
    res.render("shop/checkout", {
        path: "/checkout",
        pageTitle: "Checkout"
    })
}

exports.postCart = (res, req, next) => {
    const { productId } = res.body
    Product.findById(productId, (product) => {
        Cart.addProduct(productId, product.price)
    })

    req.redirect("/cart")
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId
    Product.findById(prodId, (product) => {
        Cart.deleteProduct(prodId, product.price)
        res.redirect("/cart")
    })
}

exports.getOrders = (req, res, next) => {
    res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
    })
}
