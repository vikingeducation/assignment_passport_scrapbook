const mongoose = require("mongoose");
const bluebird = require("bluebird");
const uniqueValidator = require("mongoose-unique-validator");
var FB = require("fb");

mongoose.Promise = bluebird;

const UserSchema = mongoose.Schema({
  username: { type: String, required: true },
  facebookId: { type: String, require: true, unique: true },
  accessToken: { type: String }
});

UserSchema.plugin(uniqueValidator);

UserSchema.methods.getPhotos = function() {
  FB.api(
    "me/photos",
    { fields: "photos", access_token: this.accessToken },
    function(res) {
      console.log(res);
    }
  );
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
