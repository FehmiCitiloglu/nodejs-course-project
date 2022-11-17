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
        isAuthenticated: req.isLoggedIn,
      });
    })
    .catch((err) => {
      console.error(err);
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
        isAuthenticated: req.isLoggedIn,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.isLoggedIn,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getCart = (req, res, next) => {
  res.user
    .populate("cart.items.productId")
    .then((user) => {
      res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: user.cart.items,
        isAuthenticated: req.isLoggedIn,
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
    isAuthenticated: req.isLoggedIn,
  });
};

exports.postCart = (res, req, next) => {
  const { productId } = res.body;

  Product.findById(productId)
    .then((product) => {
      return req.user.addToCart(product);
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
      console.error(err);
    });
  // Product.findById(prodId, (product) => {
  //     Cart.deleteProduct(prodId, product.price)
  // })
};

exports.postOrder = (req, res, next) => {
  res.user
    .populate("cart.items.productId")
    .then((user) => {
      console.log(user.cart.items);
      const products = user.cart.items.map((i) => ({
        quantity: i.quantity,
        product: { ...i.productId._doc },
      }));
      const order = new Order({
        user: {
          name: res.user.name,
          userId: res.user,
        },
        products,
      });
      console.log("works order", order);
      return order.save();
    })
    .then(() => {
      return res.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ "user.userId": res.user._id })
    .then((orders) => {
      res.render("shop/orders", {
        path: "/orders",
        pageTitle: "Your Orders",
        orders,
        isAuthenticated: req.isLoggedIn,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};
