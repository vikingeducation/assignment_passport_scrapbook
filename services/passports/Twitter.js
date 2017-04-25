const User = require("../../models").User;

const TwitterStrategy = require("passport-twitter").Strategy;

module.exports = new TwitterStrategy(
  {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: "http://www.example.com/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreateTwitter(profile)
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err);
      });
  }
);
