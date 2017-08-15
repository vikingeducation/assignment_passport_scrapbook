const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/callback"
      },
      function(accessToken, refreshToken, profile, done) {
        const facebookId = profile.id;
        const displayName = profile.displayName;

        console.log(profile);
        User.findOne({ facebookId }).then(user => {
          if (!user) {
            user = new User({ facebookId, displayName });
            user.save().then(user => {
              done(null, user);
            });
          } else {
            done(null, user);
          }
        });
      }
    )
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
