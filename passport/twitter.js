const TwitterStrategy = require("passport-twitter").Strategy;
const { User } = require("../models");
const Twitter = require("twitter");

const twitterOpts = {
  consumerKey: process.env.TWITTER_APP_ID,
  consumerSecret: process.env.TWITTER_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/twitter/callback",
  passReqToCallback: true,
  profileFields: ["id", "displayName", "photos"]
};

const getData = async (username, key, secret) => {
  const client = new Twitter({
    consumer_key: process.env.TWITTER_APP_ID,
    consumer_secret: process.env.TWITTER_APP_SECRET,
    access_token_key: key,
    access_token_secret: secret
  });

  const params = { screen_name: username };
  let twitterData = await client.get("statuses/user_timeline", params);
  return twitterData.map(tweet => tweet.text);
};

const twitterHandler = async (req, tokenKey, tokenSecret, profile, done) => {
  try {
    const twitter = {
      data: await getData(profile.username, tokenKey, tokenSecret),
      id: profile.id,
      photo: profile.photos[0].value
    };
    const name = profile.displayName;

    let user = req.user;

    if (user) {
      const options = [{ _id: user._id }, { twitter }, { new: true }];
      user = await User.findOneAndUpdate(...options);
    } else {
      user = await User.findOne({ "twitter.id": profile.id });
      user = user || (await User.create({ twitter, name }));
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
};

module.exports = new TwitterStrategy(twitterOpts, twitterHandler);
