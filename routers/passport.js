const express = require("express");
const router = express.Router();
const { loggedIn } = require("../services/session");

router.get("/", loggedIn, (req, res) => {
  res.render("index");
});

module.exports = router;
