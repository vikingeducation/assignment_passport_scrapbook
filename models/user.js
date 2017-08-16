const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  displayName: String,
  facebookId: String,
  twitterId: String,
  githubId: String,
  githubReposUrl: String,
  twitterImages: [],
  githubImages: [],
  githubUsername: String,
  twitterLocation: String,
  twitterDescription: String,
  twitterFriendsCount: String,
  twitterStatusesCount: String,
  images: []
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
