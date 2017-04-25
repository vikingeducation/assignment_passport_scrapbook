const mongoose = require("mongoose");
const bluebird = require("bluebird");
const uniqueValidator = require("mongoose-unique-validator");
const FB = require("fb");
const Twitter = require("twitter");

mongoose.Promise = bluebird;

const UserSchema = mongoose.Schema({
  username: { type: String },
  facebookId: { type: String, unique: true },
  facebookToken: { type: String },
  twitterId: { type: String, unique: true },
  twitterToken: { type: String },
  twitterTokenSecret: { type: String },
  githubId: { type: String, unique: true },
  githubToken: { type: String }
});

UserSchema.plugin(uniqueValidator);

UserSchema.methods.getPhotos = function() {
  if (this.facebookId) {
    return FB.api("me/photos", {
      fields: "picture",
      access_token: this.facebookToken
    });
  }
  return Promise.resolve({});
};

UserSchema.methods.getTweets = function() {
  if (this.twitterId) {
    const client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: this.twitterToken,
      access_token_secret: this.twitterTokenSecret
    });
    return new Promise(resolve => {
      client.get("favorites/list", (err, tweets, response) => {
        if (err) throw err;
        resolve(tweets);
      });
    });
  }
  return Promise.resolve([]);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
