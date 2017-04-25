const mongoose = require("mongoose");
const bluebird = require("bluebird");
const uniqueValidator = require("mongoose-unique-validator");

mongoose.Promise = bluebird;

const UserSchema = mongoose.Schema({
  username: { type: String, required: true },
  facebookId: { type: String, require: true, unique: true }
});

UserSchema.plugin(uniqueValidator);

const User = mongoose.model("User", UserSchema);

module.exports = User;
