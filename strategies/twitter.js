const TwitterStrategy = require("passport-twitter").Strategy;
const { User } = require("../models");
const Twitter = require('twitter');

const twitterStrategy = new TwitterStrategy(
  {
    consumerKey: process.env.TWITTER_APP_ID,
    consumerSecret: process.env.TWITTER_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/twitter/callback",
    passReqToCallback: true,
    profileFields: ["id", "displayName", "photos"]
  },
  async function(req, tokenKey, tokenSecret, profile, done) {
    try {
      const client = new Twitter({
        consumer_key: process.env.TWITTER_APP_ID,
        consumer_secret: process.env.TWITTER_APP_SECRET,
        access_token_key: tokenKey,
        access_token_secret: tokenSecret
      });

      var params = {screen_name: profile.username};

      const tweets = await client.get("statuses/user_timeline", params);
      console.log(tweets + "????");
      const twitterId = profile.id;
      const twitterPhoto = profile.photos[0].value;
      const name = profile.displayName;

      req.session.locals = req.session.locals || {};
      req.session.locals.name = name;
      req.session.locals.twitterPhoto = twitterPhoto;

      if (req.user) {
        req.user.twitterId = twitterId;
        req.user.twitterPhoto = twitterPhoto;
        const user = await req.user.save();
        done(null, user);
      } else {
        let user = await User.findOne({ twitterId });
        user = user || (await User.create({ twitterId, twitterPhoto, name }));
        done(null, user);
      }
    } catch (error) {
      done(error);
    }
  }
);

module.exports = twitterStrategy;