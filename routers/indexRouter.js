const express = require("express");
let router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/"
  })
);

module.exports = router;
