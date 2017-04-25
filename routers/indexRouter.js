const express = require("express");
let router = express.Router();
const passport = require("passport");

router.get("/", async (req, res) => {
  if (req.user) {
    if (req.connections.facebook) {
      var photos = (await req.user.getPhotos()).data;
    }
    if (req.connections.twitter) {
      var tweets = await req.user.getTweets();
    }
    if (req.connections.github) {
      var repos = await req.user.getPrivateRepos();
      console.log(repos.data[0].owner);
    }
    res.render("index", { photos, tweets, repos });
  } else {
    res.render("index");
  }
});

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/"
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.connections.facebook = true;
    res.cookie("connections", req.connections);
    res.redirect("/");
  }
);

router.get("/auth/twitter", passport.authenticate("twitter"));

router.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.connections.twitter = true;
    res.cookie("connections", req.connections);
    res.redirect("/");
  }
);

router.get(
  "/auth/github",
  passport.authenticate("github")
);

router.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.connections.github = true;
    res.cookie("connections", req.connections);
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  res.clearCookie("connections");
  req.logout();
  res.redirect("/");
});

module.exports = router;
