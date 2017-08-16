const express = require("express");
const router = express.Router();
const h = require("../helpers");

function authenticate(passport) {
  router.get("/facebook", passport.authenticate("facebook"));

  router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: h.loginPath(),
      scope: ["user_photos"]
    })
  );

  router.get("/github", passport.authenticate("github"));

  router.get(
    "/github/callback",
    passport.authenticate("github", {
      successRedirect: "/",
      failureRedirect: h.loginPath(),
      scope: ["user:email"]
    })
  );

  router.get("/twitter", passport.authenticate("twitter"));

  router.get(
    "/twitter/callback",
    passport.authenticate("twitter", {
      successRedirect: "/",
      failureRedirect: h.loginPath()
    })
  );

  return router;
}

module.exports = authenticate;
