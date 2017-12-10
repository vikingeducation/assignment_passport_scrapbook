const setCurrentUser = (req, res, next) => {
  if (req.user) {
    res.locals.currentUser = req.user;
    next();
  } else {
    next();
  }
};

const loggedInOnly = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    res.redirect("/login");
  }
};

const loggedOutOnly = (req, res, next) => {
  if (!req.user) {
    next();
  } else {
    res.redirect("/home");
  }
};

module.exports = {
  setCurrentUser,
  loggedOutOnly,
  loggedInOnly
};
