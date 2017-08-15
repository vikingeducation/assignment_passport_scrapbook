const router = require("express").Router();
const passport = require("passport");
const { User, Token } = require("../models");

passport.use(
  new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"]
    },
    async function(accessToken, refreshToken, profile) {
      try {
        let token = await Token.findOrCreate({ strategyProvider: "fb" });
        let user = await User.findOrCreate({
          oauthId: profile.id
        });

        user.tokens.push(token.strategyProvider);

        return user;
      } catch {

      }



      // User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
    }
  )
);

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

module.exports = router;
