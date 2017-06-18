const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema({
  email: {
    type: String
  },
  facebook: {
    id: {
      type: String,
      unique: true
    },
    accessToken: String
  },
  instagram: {
    id: {
      type: String,
      unique: true
    },
    accessToken: String
  },
  github: {
    id: {
      type: String,
      unique: true
    },
    accessToken: String
  },
  twitter: {
    id: {
      type: String,
      unique: true
    },
    token: String,
    tokenSecret: String
  },
  spotify: {
    id: {
      type: String,
      unique: true
    },
    accessToken: String
  }
});

UserSchema.plugin(uniqueValidator);

const User = mongoose.model("User", UserSchema);

module.exports = User;