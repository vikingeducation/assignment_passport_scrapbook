const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = mongoose.Schema({
  facebook: {
    id: { type: String, unique: true },
    displayName: { type: String },
    accessToken: { type: String }
  },
  twitter: {
    id: { type: String, unique: true },
    token: { type: String },
    tokenSecret: { type: String }
  },
  github: {
    id: { type: String, unique: true },
    username: { type: String },
    accessToken: { type: String }
  },
  spotify: {
    id: { type: String, unique: true },
    accessToken: { type: String }
  }
});

UserSchema.plugin(uniqueValidator);

const User = mongoose.model('User', UserSchema);

module.exports = User;
