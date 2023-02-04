const mongodb = require("mongodb");
const Product = require("../models/product");
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: [],
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: true,
      hasError: true,
      product: {
        title,
        imageUrl,
        price,
        description,
      },
      errorMessage: errors.array()?.[0]?.msg,
      validationErrors: errors.array(),
    });
  }

  const product = new Product({
    _id: new mongoose.Types.ObjectId("63dce980431c7193deed1558"),
    title,
    price,
    description,
    imageUrl,
    userId: req.user._id,
  });

  product
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      //   return res.status(500).render("admin/edit-product", {
      //     pageTitle: "Add Product",
      //     path: "/admin/add-product",
      //     editing: true,
      //     hasError: true,
      //     product: {
      //       title,
      //       imageUrl,
      //       price,
      //       description,
      //     },
      //     errorMessage: "Database operation failed, please try again.",
      //     validationErrors: [],
      //   });
      res.redirect("/500");
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;

  if (!editMode) {
    res.redirect("/");
  }

  const prodId = req.params.productId;

  // req.user.getProducts({ where: { id: prodId } })
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }

      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product,
        hasError: false,
        errorMessage: null,
        validationErrors: [],
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      editing: false,
      hasError: true,
      product: {
        title,
        imageUrl,
        price,
        description,
        _id: productId,
      },
      errorMessage: errors.array()?.[0]?.msg,
      validationErrors: errors.array(),
    });
  }
  Product.findById({ _id: productId })
    .then((product) => {
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/");
      }
      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      return product.save().then((result) => {
        res.redirect("/admin/products");
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getProducts = (req, res, next) => {
  console.log("req.user", req.user);
  Product.find({ userId: req.user._id })
    .select("title price _id")
    .populate("userId", "name")
    .then((products) => {
      console.log("products", products);
      res.render("admin/products", {
        products,
        pageTitle: "Admin Products",
        path: "/admin/products",
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then(() => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.error(err);
    });
};
