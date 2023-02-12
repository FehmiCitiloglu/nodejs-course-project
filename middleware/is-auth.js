module.exports = (req, res, next) => {
  console.log("isLoggedIn", req.session.isLoggedIn);
  if (!req.session.isLoggedIn) {
    console.log("not logged in");
    return res.redirect("/login");
  }
  next();
};
