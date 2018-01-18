var mongoose = require("mongoose");
const bcrypt = require("bcrypt");
var Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  facebook: {
    id: { type: String },
    token: { type: String },
    name: { type: String },
    gender: { type: String },
    photos: { type: String }
  },
  twitter: {
    id: { type: String },
    token: { type: String },
    displayName: { type: String },
    username: { type: String },
    photos: [{ value: { type: String } }],
    profileImage: { type: String }
  },
  spotify: {
    id: { type: String },
    token: { type: String },
    username: { type: String },
    profileUrl: { type: String }
  },
  github: {
    id: { type: String },
    token: { type: String },
    username: { type: String },
    avatar: { type: String },
    publicRepos: { type: Number }
  },
  twitch: {
    id: { type: String },
    token: { type: String },
    username: { type: String },
    email: { type: String }
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
