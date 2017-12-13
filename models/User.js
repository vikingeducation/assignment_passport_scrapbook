const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const uniqueValidator = require('mongoose-unique-validator');

const UserSchema = mongoose.Schema({
  email: { type: String, required: false, unique: true },
  passwordHash: { type: String, required: false },
  displayName: { type: String, required: false },
  facebookId: { type: String, required: false },
  photoURL: { type: String, required: false },
  linkedinId: { type: String, required: false },
  summary: { type: String, required: false },
  twitterId: { type: String, required: false },
  followers: { type: String, required: false },
  googleId: { type: String, required: false },
  googlePhotoUrl: { type: String, required: false }
});

UserSchema.plugin(uniqueValidator);

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

UserSchema.virtual('password')
  .get(function() {
    return this._password;
  })
  .set(function(value) {
    this._password = value;
    this.passwordHash = bcrypt.hashSync(value, 8);
  });

const User = mongoose.model('User', UserSchema);

module.exports = User;
