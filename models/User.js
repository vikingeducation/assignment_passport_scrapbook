const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema({
  name: { type: String },
  facebookId: { type: String, unique: true },
  facebookPhoto: String,
  githubId: { type: String, unique: true },
  githubPhoto: String,
  githubData: [{ type: String }]
});

UserSchema.plugin(uniqueValidator);

const User = mongoose.model("User", UserSchema);

module.exports = User;
