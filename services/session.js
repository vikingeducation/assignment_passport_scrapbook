module.exports = {
  loggedIn: (req, res, next) => {
    if (!req.user) {
      res.redirect("/login");
    } else {
      next();
    }
  },

  loggedOut: (req, res, next) => {
    if (!req.user) {
      next();
    } else {
      res.redirect("/passport");
    }
  }
};
