const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema({
  displayName: { type: String, required: true },
  redditId: { type: String, unique: true },
  spotifyId: { type: String, unique: true },
  stackId: { type: String, unique: true },
  slackId: { type: String, unique: true },
  githubId: { type: String, unique: true }
});

UserSchema.plugin(uniqueValidator);

const User = mongoose.model("User", UserSchema);

module.exports = User;
