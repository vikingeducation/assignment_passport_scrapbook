var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  facebook: {
    id: { type: String, unique: true },
    token: { type: String, unique: true },
    name: { type: String, unique: true },
    username: { type: String, unique: true }
  },
  twitter: {
    id: { type: String, unique: true },
    token: { type: String, unique: true },
    displayName: { type: String, unique: true },
    username: { type: String, unique: true }
  },
  spotify: {
    id: { type: String, unique: true },
    token: { type: String, unique: true },
    username: { type: String, unique: true }
  },
  github: {
    id: { type: String, unique: true },
    token: { type: String, unique: true },
    username: { type: String, unique: true }
  },
  twitch: {
    id: { type: String, unique: true },
    token: { type: String, unique: true },
    username: { type: String, unique: true }
  }
});

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 8);
});

var User = mongoose.model("User", UserSchema);

module.exports = User;
