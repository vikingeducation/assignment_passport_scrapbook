const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({});
const User = mongoose.model("User", UserSchema);

User.plugin(passportLocalMongoose);

module.exports = User;
