const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema({
  displayName: {
    type: String,
    required: true
  },
  facebookId: {
    type: String,
    unique: true
  },
  twitterId: {
    type: String,
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
    if (user) {
      return user;
    } else {
      return new User({
        displayName: profile.displayName,
        facebookId: profile.id,
        email: profile.emails[0].value
      }).save();
    }
  });
};

UserSchema.statics.findOrCreateTwitter = function(profile) {
  return User.findOne(
    {
      email: {
        $in: [
          profile.emails.map(email => {
            return email.value;
          })
        ]
      }
    },
    { twitterId: profile.id },
    { returnNewDocument: true }
  ).then(user => {
    if (user) {
      return user;
    } else {
      return new User({
        displayName: profile.displayName,
        twitterId: profile.id,
        email: profile.emails[0].value
      }).save();
    }
  });
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
