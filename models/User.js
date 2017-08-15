const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema({
	facebook: {
		name: { type: String, required: true },
  	id: { type: String, required: true, unique: true },
  	accessToken: {type: String, required: true},
  	refreshToken: {type: String, required: true}
	}
});

UserSchema.plugin(uniqueValidator);

const User = mongoose.model("User", UserSchema);

module.exports = User;
