const TwitterStrategy = require("passport-twitter").Strategy;
const { User } = require("../models");

module.exports = passport => {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_APP_ID,
        consumerSecret: process.env.TWITTER_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/twitter/callback",
        profileFields: ["id", "displayName", "photos", "emails"]
      },
      function(token, tokenSecret, profile, done) {
        console.log(profile);
        const twitterId = profile.id;
        const displayName = profile.displayName;
        const twitterImages = profile.photos;
        User.findOne({ displayName }).then(user => {
          if (!user) {
            user = new User({
              twitterId,
              displayName,
              twitterImages
            });
            user
              .save()
              .then(user => {
                return done(null, user);
              })
              .catch(e => {
                if (e) throw e;
              });
          } else {
            user.twitterId = twitterId;
            user.twitterImages = twitterImages;
            user
              .save()
              .then(user => {
                return done(null, user);
              })
              .catch(e => {
                if (e) throw e;
              });
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
