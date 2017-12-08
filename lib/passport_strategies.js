const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const models = require('../models');
const { User } = models;

const Strategies = {
  googleStrategy: new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      const googleId = profile.id;
      const displayName = profile.displayName;

      User.findOne({ googleId })
        .then(user => {
          if (!user) {
            user = new User({ googleId: googleId, googleDisplayName: displayName });
            return user.save();
          } else {
            return user;
          }
        })
        .then(user => {
          done(null, user);
        })
        .catch(e => done(e));
    }
  )
};

passport.use(Strategies.googleStrategy);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
