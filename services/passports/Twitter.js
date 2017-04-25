const User = require("../../models").User;

const TwitterStrategy = require("passport-twitter").Strategy;

module.exports = new TwitterStrategy(
  {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "http://localhost:3000/auth/twitter/callback",
    profileFields: ["id", "displayName", "emails"],
    passReqToCallback: true
  },
  function(req, token, tokenSecret, profile, done) {
    console.log(req.user);
    User.findOrCreateTwitter(profile)
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err);
      });
  }
);
