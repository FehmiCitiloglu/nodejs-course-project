const Product = require("../models/product");
const Order = require("../models/order");

// const Order = require("../models/order")

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        products,
        pageTitle: "All Products",
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProduct = (req, res, next) => {
  const productId = req.params.productId;

  Product.findById(productId)
    .then((product) => {
      res.render("shop/product-detail", {
        product,
        pageTitle: product.title,
        path: "/products",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        products,
        pageTitle: "Shop",
        path: "/",
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: user.cart.items,
      });
    })

    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
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
  Product.findById(productId)
    .then((product) => {
      return res.user.addToCart(product);
    })
    .then((result) => {
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
    .removeFromCart(prodId)
    .then(() => {
      res.redirect("/cart");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
  // Product.findById(prodId, (product) => {
  //     Cart.deleteProduct(prodId, product.price)
  // })
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate("cart.items.productId")
    .then((user) => {
      const products = user.cart.items.map((i) => ({
        quantity: i.quantity,
        product: { ...i.productId._doc },
      }));
      const order = new Order({
        user: {
          email: res.user.email,
          userId: res.user,
        },
        products,
      });
      return order.save();
    })
    .then(() => {
      return res.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": req.session.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};
