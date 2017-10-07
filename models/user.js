var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  displayName: { type: String },
  facebookId: { type: String, unique: true },
  twitterId: { type: String, unique: true },
  spotifyId: { type: String, unique: true },
  githubId: { type: String, unique: true },
  twitchId: { type: String, unique: true }
});

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 8);
});

var User = mongoose.model("User", UserSchema);

module.exports = User;
