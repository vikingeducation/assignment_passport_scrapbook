const mongoose = require("mongoose");
const bluebird = require("bluebird");
const uniqueValidator = require("mongoose-unique-validator");
var FB = require("fb");

mongoose.Promise = bluebird;

const UserSchema = mongoose.Schema({
  username: { type: String },
  facebookId: { type: String, unique: true },
  facebookToken: { type: String },
  twitterId: { type: String, unique: true },
  twitterToken: { type: String },
  twitterTokenSecret: { type: String }
});

UserSchema.plugin(uniqueValidator);

UserSchema.methods.getPhotos = function() {
  if (this.facebookId) {
    return FB.api("me/photos", {
      fields: "picture",
      access_token: this.facebookToken
    });
  }
  return Promise.resolve([]);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
