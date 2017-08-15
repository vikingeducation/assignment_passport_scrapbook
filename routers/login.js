const express = require("express");
const router = express.Router();
const { loggedOut, loggedIn } = require("../services/session");

router.get("/", loggedOut, (req, res) => {
  res.render("login", { hideNav: true });
});

router.get("/logout", loggedIn, (req, res) => {
  req.logout();
  res.redirect("login");
});

module.exports = router;
