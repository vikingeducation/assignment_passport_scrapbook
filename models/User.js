const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let structureObj = {
	displayName: String,
	profileId: String,
	accessToken: String,
	refreshToken: String
};

const UserSchema = mongoose.Schema({
	name: { type: String, unique: true },
	email: { type: String, unique: true },
	reddit: structureObj,
	// spotify: structureObj,
	// stack: structureObj,
	// slack: structureObj,
	github: structureObj
});

UserSchema.plugin(uniqueValidator);

const User = mongoose.model('User', UserSchema);

module.exports = User;
