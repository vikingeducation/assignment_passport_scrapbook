const TwitterStrategy = require("passport-twitter").Strategy;
const passport = require("passport");
const { User } = require("../models");

module.exports = req => {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_APP_ID,
        consumerSecret: process.env.TWITTER_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/twitter/callback"
      },
      function(token, tokenSecret, profile, done, req) {
        const twitterId = profile.id;
        const twitterDisplayName = profile.displayName;
        const twitterImages = profile.photos;
        let id;
        if (req.user) {
          id = req.user.id;
        } else {
          id = null;
        }
        User.findOne({ id }).then(user => {
          if (!user) {
            user = new User({ twitterId, twitterDisplayName, twitterImages });
            user.save().then(user => {
              done(null, user);
            });
          } else if (user && user.facebookId.length) {
            user.twitterDisplayName = twitterDisplayName;
            user.twitterId = twitterId;
            user.twitterImages = twitterImages;
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
