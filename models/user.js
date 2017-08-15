const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const UserSchema = mongoose.Schema({
	tokens: [
		{
			type: Schema.Types.ObjectId,
			ref: "Token"
		}
	],
	oauthId: { type: String, required: true, unique: true },
	profile: { type: Schema.Types.Mixed, default: {} }
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);
