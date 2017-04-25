const FacebookStrategy = require("passport-facebook").Strategy;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const User = require("../models/User");

module.exports = new FacebookStrategy(
  {
    clientID: FACEBOOK_APP_ID || "hi",
    clientSecret: FACEBOOK_APP_SECRET || "no",
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ["id", "displayName", "email", "likes"],
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    console.log(profile);
    const facebookId = profile.id;
    if (req.user) {
      req.user.facebookId = facebookId;
      req.user.save((err, user) => {
        if (err) {
          done(err);
        } else {
          done(null, user);
        }
      });
    } else {
      User.findOne({ facebookId }, function(err, user) {
        if (err) {
          console.log(err);
          return done(err);
        }
        if (!user) {
          user = new User({
            facebookId,
            username: profile.displayName,
            accessToken
          });
          user.save((err, user) => {
            if (err) {
              console.log(err);
            }
            done(null, user);
          });
        } else {
          done(null, user);
        }
      });
    }
  }
);
