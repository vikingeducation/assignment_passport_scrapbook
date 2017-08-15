const FacebookStrategy = require("passport-facebook").Strategy;
const { User } = require("../models");

module.exports = passport => {
  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL:
          process.env.FACEBOOK_URI ||
          "http://localhost:3000/auth/facebook/callback",
        profileFields: ["id", "displayName", "photos", "emails"]
      },
      function(accessToken, refreshToken, profile, done) {
        console.log(profile);
        console.log(profile.emails);
        const facebookId = profile.id;
        const displayName = profile.displayName;
        const images = profile.photos;
        User.findOne({ displayName }).then(user => {
          if (!user) {
            user = new User({ facebookId, displayName, images });
            user
              .save()
              .then(user => {
                return done(null, user);
              })
              .catch(e => {
                if (e) {
                  throw e;
                }
              });
          } else {
            user.facebookId = facebookId;
            user.images = images;
            user
              .save()
              .then(user => {
                return done(null, user);
              })
              .catch(e => {
                if (e) {
                  throw e;
                }
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
