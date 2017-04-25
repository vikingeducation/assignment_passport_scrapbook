const express = require("express");
let router = express.Router();
const passport = require("passport");

router.get("/", async (req, res) => {
  try {
    if (req.user) {
      let photos = (await req.user.getPhotos()).data;
      let tweets = await req.user.getTweets();
      res.render("index", { photos, tweets });
    } else {
      res.render("index");
    }
  } catch (err) {
    console.log(err);
  }
});

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

router.get("/auth/twitter", passport.authenticate("twitter"));

router.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/" }),
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
