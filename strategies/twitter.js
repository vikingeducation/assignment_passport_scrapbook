const TwitterStrategy = require("passport-twitter").Strategy;
const { User } = require("../models");
const Twitter = require("twitter");

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

      const params = { screen_name: profile.username };
      let twitterData = await client.get("statuses/user_timeline", params);
      twitterData = twitterData.map(tweet => {
        return tweet.text;
      });
      console.log(twitterData);
      const twitterId = profile.id;
      const twitterPhoto = profile.photos[0].value;
      const name = profile.displayName;

      if (req.user) {
        req.user.twitterId = twitterId;
        req.user.twitterPhoto = twitterPhoto;
        req.user.twitterData = twitterData;
        const user = await req.user.save();
        done(null, user);
      } else {
        let user = await User.findOne({ twitterId });
        const userOpts = { twitterId, twitterPhoto, twitterData, name };
        user = user || (await User.create(userOpts));
        done(null, user);
      }
    } catch (error) {
      done(error);
    }
  }
);

module.exports = twitterStrategy;
