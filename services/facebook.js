const FacebookStrategy = require("passport-facebook").Strategy;
const passport = require("passport");

facebookStrategyInit = (req, res, next) => {
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
        User.findOne({ facebookId }, function(err, user) {
          if (err) return done(err);

          if (!user) {
            user = new User({ facebookId, displayName });
            user.save((err, user) => {
              if (err) return done(err);
              done(null, user);
            });
          } else {
            done(null, user);
          }
        });
      }
    )
  );
};

module.exports = facebookStrategyInit;
