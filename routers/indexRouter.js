const express = require("express");
let router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
  if (req.user) {
    req.user.getPhotos()
    .then(photos => {
      res.render("index", { photos });
    });
  } else {
    res.render('index');
  }
});

router.get(
  "/auth/facebook",
  passport.authenticate("facebook")
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
