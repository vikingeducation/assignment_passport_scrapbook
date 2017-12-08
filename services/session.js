const setCurrentUser = (req, res, next) => {
  if (req.user) {
    res.locals.currentUser = req.user;
    next();
  } else {
    next();
  }
};

const redirectNotLoggedIn = (req, res, next) => {
  if (!req.user && req.url !== '/login' && !req.url.startsWith('/auth')) {
    res.redirect("/login");
  } else if (req.user && (req.url === '/login' || req.url.startsWith('/auth'))) {
    res.redirect("/home");
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
  redirectNotLoggedIn,
  setCurrentUser,
  loggedOutOnly,
  loggedInOnly
};
