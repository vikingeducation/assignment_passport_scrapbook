const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema({
  name: { type: String },
  facebook: {
    id: { type: String, unique: true },
    photo: String,
    data: [{ type: String }]
  },
  githubId: { type: String, unique: true },
  githubPhoto: String,
  githubData: [{ type: String }],
  twitterId: { type: String, unique: true },
  twitterPhoto: String,
  twitterData: [{ type: String }]
});

UserSchema.plugin(uniqueValidator);

const User = mongoose.model("User", UserSchema);

module.exports = User;
