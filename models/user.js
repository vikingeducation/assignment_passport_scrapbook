const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  displayName: String,
  facebookId: String,
  twitterId: String,
  tweets: [],
  images: []
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
