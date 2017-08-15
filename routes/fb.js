const router = require("express").Router();
const passport = require("passport");
const {User, Token} = require("../models");

const FacebookStrategy = require("passport-facebook");

passport.use(
  new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"]
    },
    fb
))


  // )
// )

// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_APP_ID,
//   clientSecret: process.env.FACEBOOK_APP_SECRET,
//   callbackURL: "http://localhost:3000/auth/facebook/callback"
// }, function(accessToken, refreshToken, profile, cb) {
//   User.findOrCreate({
//     facebookId: profile.id
//   }, function(err, user) {
//     return cb(err, user);
//   });
// }));

// let asyncfb = async (accessToken, refreshToken, profile) => {
//   try {
//     let token = await Token.findOrCreate({
//       strategyProvider: "fb",
//       accessToken,
//       refreshToken
//      });
//
//     let user = await User.findOrCreate({
//       oauthId: profile.id
//     });
//
//     user.tokens.push(token.strategyProvider);
//
//     return user;
//   } catch(e) {
//     console.log(e.stack);
//     return;
//   }
//
//   User.findOrCreate({ facebookId: profile.id }, function (err, user) {
//     return cb(err, user);
//   });
// }

function fb(accessToken, refreshToken, profile) {
    let token = Token.findOrCreate({
      strategyProvider: "fb",
      accessToken,
      refreshToken
     });

    let user = User.findOrCreate({
      oauthId: profile.id
    });

    user.tokens.push(token.strategyProvider);

    return user;
    console.log(e.stack);
    return;

  User.findOrCreate({ facebookId: profile.id }, function (err, user) {
    return cb(err, user);
  });
}

router.get("/auth/facebook", passport.authenticate("facebook"));

router.get("/auth/facebook/callback", passport.authenticate("facebook", {failureRedirect: "/login"}), function(req, res) {
  // Successful authentication, redirect home.
  res.redirect("/");
});

module.exports = router;
