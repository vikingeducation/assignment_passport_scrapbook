const FacebookStrategy = require("passport-facebook").Strategy;
const { User } = require("../models");

const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    const id = profile.id;
    const name = profile.displayName;
    User.findOne({ facebook: { id } }, function(err, user) {
      if (err) return done(err);

      if (!user) {
        // Create a new account if one doesn't exist
        user = new User({ facebook: { id, name, accessToken, refreshToken } });
        user.save((err, user) => {
          err ? done(err) : done(null, user);
        });
      } else {
        // Otherwise, return the extant user.
        done(null, user);
      }
    });
  }
);

module.exports = facebookStrategy;
