const TwitterStrategy = require("passport-twitter").Strategy;
const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
const User = require("../models/User");

module.exports = new TwitterStrategy(
  {
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://localhost:3000/auth/twitter/callback",
    passReqToCallback: true
  },
  function(req, token, tokenSecret, profile, done) {
    const twitterId = profile.id;
    if (req.user) {
      req.user.twitterId = twitterId;
      req.user.twitterTokenSecret = tokenSecret;
      req.user.twitterToken = token;
      req.user.save((err, user) => {
        if (err) {
          done(err);
        } else {
          done(null, user);
        }
      });
    } else {
      User.findOne({ twitterId }, function(err, user) {
        if (err) {
          console.log(err);
          return done(err);
        }
        if (!user) {
          user = new User({
            twitterId,
            username: profile.displayName,
            twitterToken: token,
            twitterTokenSecret: tokenSecret
          });
          user.save((err, user) => {
            if (err) {
              console.log(err);
            }
            done(null, user);
          });
        } else {
          done(null, user);
        }
      });
    }
  }
);
