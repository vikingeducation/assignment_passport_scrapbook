const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema({
  displayName: { type: String, required: true },
  facebookId: { type: String, require: true, unique: true }
});

UserSchema.plugin(uniqueValidator);

const User = mongoose.model("User", UserSchema);

module.exports = User;
