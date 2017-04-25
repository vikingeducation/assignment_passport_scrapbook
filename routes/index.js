const express = require("express");
const router = express.Router();
const {
  loggedInOnly,
  loggedOutOnly
} = require("../services/session");

router.get("/", loggedInOnly, function(req, res) {
  //search for by facebookId
  res.render("home");
});

router.get("/login", loggedOutOnly, function(req, res) {
  res.render("login");
});

router.use("/logout", loggedInOnly, function(req, res) {
  res.redirect("/login");
});

module.exports = router;
