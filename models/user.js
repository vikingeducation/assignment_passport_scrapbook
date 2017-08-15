const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

const UserSchema = mongoose.Schema({
	tokens: [
		{
			type: Schema.Types.ObjectId,
			ref: "Token"
		}
	],
	oauthId: { type: String, required: true, unique: true }
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);
