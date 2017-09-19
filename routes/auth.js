const express = require("express");
const router = express.Router();

function authenticate(passport) {
  router.get("/facebook", passport.authenticate("facebook"));

  router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
      successRedirect: "/",
      failureRedirect: "/login",
      scope: ["user_photos"]
    })
  );

  router.get("/github", passport.authenticate("github"));

  router.get(
    "/github/callback",
    passport.authenticate("github", {
      successRedirect: "/",
      failureRedirect: "/login",
      scope: ["user:email"]
    })
  );

  router.get("/twitter", passport.authenticate("twitter"));

  router.get(
    "/twitter/callback",
    passport.authenticate("twitter", {
      successRedirect: "/",
      failureRedirect: "/login"
    })
  );

  return router;
}

module.exports = authenticate;
