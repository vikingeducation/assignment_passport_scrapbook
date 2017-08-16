const express = require("express");
const router = express.Router();
const { loggedIn } = require("../services/session");
const fetch = require("node-fetch");

router.get("/", loggedIn, (req, res) => {
  if (req.user.githubReposUrl !== undefined) {
    fetch(req.user.githubReposUrl)
      .then(res => {
        return res.json();
      })
      .then(json => {
        res.render("index", { repos: json });
      });
  } else {
    res.render("index");
  }
});

module.exports = router;
