const router = require("express").Router();
const passport = require("passport");
const { User } = require("../models");
const { authTools } = require("../auth");

console.log(authTools);
authTools.utilizePassport(passport, User);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
  done(err, user);
  });
});


router.use(passport.initialize());
router.use(passport.session());


// pass in scopes
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", {
    authType: "rerequest",
    scope: ["public_profile"]
  })
);

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/landing"); // test
  }
);

module.exports = router;
