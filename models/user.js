const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  displayName: String,
  twitterDisplayName: String,
  facebookId: String,
  twitterId: String,
  twitterImages: [],
  images: []
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
