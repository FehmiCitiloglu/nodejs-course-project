const mongodb = require("mongodb");
const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const { title, imageUrl, description, price } = req.body;
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: res.user,
  });

  product
    .save()
    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.error(err);
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
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const { productId, title, price, imageUrl, description } = req.body;

  // const product = new Product(title, price, imageUrl, description, productId);
  Product.findById(productId)
    .then((product) => {
      console.log("product inside postEditProduct", product);

      product.title = title;
      product.price = price;
      product.description = description;
      product.imageUrl = imageUrl;
      return product.save();
    })

    .then((result) => {
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .select("title price _id")
    .populate("userId", "name")
    .then((products) => {
      console.log(products);
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
  Product.findByIdAndRemove(prodId)
    .then(() => {
      console.log("DESTROYED PRODUCT");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.error(err);
    });
};
