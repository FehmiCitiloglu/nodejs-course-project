const Product = require("../models/product");
const Cart = require("../models/cart")


exports.getProducts = (req, res, next) => {
    Product.fetchAll().then((result) => {
        console.log(result);
        res.render("shop/product-list", {
            products: result.rows,
            pageTitle: 'All Products',
            path: "/products"
        })
    })

}

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId
    Product.findById(productId)
        .then((result) => {
            console.log("result", result);
            res.render("shop/product-detail", { product: result.rows[0], pageTitle: result.rows[0].title, path: "/products" })
        })
        .catch((err) => console.error(err))
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then((result) => {
            console.log(result.fields)
            res.render("shop/index", {
                products: result.rows,
                pageTitle: 'Shop',
                path: "/"
            })
        }
        )
        .catch((err) => console.error(err))

}

exports.getCart = (req, res, next) => {
    Cart.getProducts((cart) => {

        Product.fetchAll((products) => {
            const cartProducts = []
            for (let product of products) {
                const cartProductData = cart.products.find((prod) => prod.id === product.id)
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty++ })
                }
            }
            res.render("shop/cart", {
                path: "/cart",
                pageTitle: "Your Cart",
                products: cartProducts
            })
        })


    })

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
