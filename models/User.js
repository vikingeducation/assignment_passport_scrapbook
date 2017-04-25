const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema({
  displayName: {
    type: String,
    required: true
  },
  facebookId: {
    type: String,
    require: true,
    unique: true
  },
  email: {
    type: String,
    unique: true
  }
});

UserSchema.plugin(uniqueValidator);

UserSchema.statics.findOrCreateFacebook = function(profile) {
  return User.findOne({
    facebookId: profile.id
  }).then(user => {
    console.log("value of user is", user);
    if (user) {
      return user;
    } else {
      console.log("creating new user");
      return new User({
        displayName: profile.displayName,
        facebookId: profile.id,
        email: profile.emails[0].value
      }).save();
    }
  });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
