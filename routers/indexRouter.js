const express = require("express");
let router = express.Router();
const passport = require("passport");

router.get("/", async (req, res) => {
  if (req.user) {
    if (req.cookies.connections.facebook) {
      var photos = (await req.user.getPhotos()).data;
    }
    if (req.cookies.connections.twitter) {
      var tweets = await req.user.getTweets();
    }
    res.render("index", { photos, tweets });
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
    let cookie = req.cookies.connections || {};
    console.log("cookie", res.cookie.connections);
    cookie.facebook = true;
    res.cookie("connections", cookie);
    res.redirect("/");
  }
);

router.get("/auth/twitter", passport.authenticate("twitter"));

router.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect home.
    let cookie = req.cookies.connections || {};
    cookie.twitter = true;
    res.cookie("connections", cookie);
    res.redirect("/");
  }
);

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

router.get("/logout", (req, res) => {
  res.clearCookie("connections");
  req.logout();
  res.redirect("/");
});

module.exports = router;
