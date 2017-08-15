const TwitterStrategy = require("passport-twitter").Strategy;
const passport = require("passport");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_APP_ID,
        consumerSecret: process.env.TWITTER_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/twitter/callback"
      },
      function(token, tokenSecret, profile, done) {
        const twitterId = profile.id;
        const displayName = profile.displayName;
        const tweets = profile.photos;
        User.findOne({ twitterId }).then(user => {
          if (!user) {
            user = new User({ twitterId, displayName, images });
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
