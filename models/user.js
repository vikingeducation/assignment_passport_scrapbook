const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  displayName: String,
  facebookId: String
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
