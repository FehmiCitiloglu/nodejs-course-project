const fs = require('fs')

const path = require("path")

const p = path.join(path.dirname(process.mainModule.filename), "data", "cart.json")

module.exports = class Cart {

    static addProduct(id, productPrice) {
        // fetch the previous cart
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 }
            if (!err) {
                cart = JSON.parse(fileContent)
            }
            // Analyze the cart => find the existing products
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id)
            const existingProduct = cart.products[existingProductIndex]

            // Add new product / increase quantity
            let updatedProduct
            if (existingProduct) {
                updatedProduct = { ...existingProduct }
                updatedProduct.qty = updatedProduct.qty++
                cart.products = [...cart.products]
                cart.products[existingProductIndex] = updatedProduct
            } else {
                updatedProduct = { id, qty: 1 }
                cart.products = [...cart.products, updatedProduct]
            }
            cart.totalPrice = parseFloat(cart.totalPrice) + parseFloat(productPrice)
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            })
        })
    }
}
