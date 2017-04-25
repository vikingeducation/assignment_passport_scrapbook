const express = require("express");
let router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
  res.render("index");
});

router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["user_likes"] })
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
