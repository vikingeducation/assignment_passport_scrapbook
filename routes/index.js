const express = require("express");
const router = express.Router();
const {
  loggedInOnly,
  loggedOutOnly
} = require("../services/session");

router.get("/", loggedInOnly, function(req, res, next) {
  //search for by facebookId
  let accounts;
  req.user
    .getAccounts()
    .then(acc => {
      accounts = acc;
      return req.user.getTweets();
    })
    .then(tweets => {
      res.render("home", {
        accounts,
        tweets
      });
    })
    .catch(next);
});

router.get("/login", loggedOutOnly, function(req, res) {
  res.render("login");
});

router.use("/logout", loggedInOnly, function(req, res) {
  res.redirect("/login");
});

module.exports = router;
