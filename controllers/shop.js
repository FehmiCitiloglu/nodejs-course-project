const Product = require("../models/product");

// const Order = require("../models/order")

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/product-list", {
        products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

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

  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((products) => {
      res.render("shop/index", {
        products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getCart = (req, res, next) => {
  res.user
    .getCart()
    .then((products) => {
      console.log("products", products);
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products,
      });
    })

    .catch((err) => {
      console.error(err);
    });
};

exports.getCheckout = (req, res, next) => {
  res.render("shop/checkout", {
    path: "/checkout",
    pageTitle: "Checkout",
  });
};

exports.postCart = (res, req, next) => {
  const { productId } = res.body;
  console.log("productId", productId);
  Product.findById(productId)
    .then((product) => {
      console.log("postCart product", product);
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log("result", result);
      req.redirect("/cart");
    });
  // let fetchedCart
  // let newQuantity = 1
  // res.user
  //     .getCart()
  //     .then((cart) => {
  //         fetchedCart = cart
  //         return cart.getProducts({ where: { id: productId } })
  //     }).then((products) => {
  //         let product
  //         if (products.length > 0) {
  //             product = products[0]
  //         }
  //         if (product) {
  //             const oldQuantity = product.cart_item.quantity
  //             newQuantity = oldQuantity + 1
  //             return product
  //         }
  //         return Product.findByPk(productId)
  //     })
  //     .then((product) => {
  //         return fetchedCart.addProduct(product, {
  //             through: { quantity: newQuantity }
  //         })
  //     })
  //     .then(() => {
  //         req.redirect("/cart")
  //     })
  //     .catch((err) => {
  //         console.error(err);
  //     })
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;

  res.user
    .deleteItemFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      console.error(err);
    });
  // Product.findById(prodId, (product) => {
  //     Cart.deleteProduct(prodId, product.price)
  // })
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((product) => {
              product.order_item = { quantity: product.cart_item.quantity };
              return product;
            })
          );
        })
        .then((result) => {
          return fetchedCart.setProducts(null);
        })
        .then(() => {
          res.redirect("/orders");
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({ include: ["products"] })
    .then((orders) => {
      console.log("orders", orders);
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};
