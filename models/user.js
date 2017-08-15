const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema({
  tokens: [{
    type: Schema.Types.ObjectId,
    ref: "Token"
  }]
});

module.exports = mongoose.model("User", UserSchema);
