const fs = require("fs");
const Product = require("../models/product");
const Order = require("../models/order");
const path = require("path");
const PDFDocument = require("pdfkit");

const ITEMS_PER_PAGE = 1;

// const Order = require("../models/order")

exports.getProducts = (req, res, next) => {
  const { page: queryPage } = req.query;
  const page = Number(queryPage) || 1;
  let totalItems;
  Product.find()
    .countDocuments()
    .then((numberProducts) => {
      totalItems = numberProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/product-list", {
        products,
        pageTitle: "Shop",
        path: "/products",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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
  const { page: queryPage } = req.query;
  const page = Number(queryPage) || 1;
  let totalItems;
  Product.find()
    .countDocuments()
    .then((numberProducts) => {
      totalItems = numberProducts;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render("shop/index", {
        products,
        pageTitle: "Shop",
        path: "/",
        currentPage: page,
        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        previousPage: page - 1,
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
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
      console.log("user", user);
      const products = user.cart.items.map((i) => ({
        quantity: i.quantity,
        product: { ...i.productId._doc },
      }));
      console.log("products", products, user);
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products,
      });
      console.log("order", order);
      return order.save();
    })
    .then(() => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => {
      console.log(err);
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

exports.getInvoice = (req, res, next) => {
  const { orderId } = req.params;

  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return next(new Error("No Order Found."));
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return next(new Error("Unauthorized"));
      }
      const invoiceName = `invoice-${orderId}.pdf`;
      const invoicePath = path.join("data", "invoices", invoiceName);
      const pdfDoc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `inline; filename="${invoiceName}"`);
      pdfDoc.pipe(fs.createWriteStream(invoicePath));
      pdfDoc.pipe(res);
      pdfDoc.fontSize(26).text("invoice", {
        underline: true,
      });
      pdfDoc.text("-------------------------");
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.quantity * prod.product.price;
        pdfDoc
          .fontSize(16)
          .text(
            prod.product.title +
              " - " +
              prod.quantity +
              " x " +
              "$ " +
              prod.product.price
          );
      });
      pdfDoc.text("----");
      pdfDoc.fontSize(22).text(`total price: ${totalPrice}$`);
      pdfDoc.end();
      //   if (err) {
      //     return next(err);
      //   }
      //   res.setHeader("Content-Type", "application/pdf");
      //   res.setHeader(
      //     "Content-Disposition",
      //     `inline; filename="${invoiceName}"`
      //   );
      //   res.send(data);
      // });
      // const file = fs.createReadStream(invoicePath);
      // file.pipe(res);
    })
    .catch((err) => next(new Error(err)));
};
