const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  name: { type: String },
  facebook: {
    id: { type: String },
    photo: String,
    data: [{ type: String }]
  },
  github: {
    id: { type: String },
    photo: String,
    data: [{ type: String }]
  },
  twitter: {
    id: { type: String },
    photo: String,
    data: [{ type: String }]
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
