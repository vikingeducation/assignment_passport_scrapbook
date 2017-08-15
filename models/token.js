const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenSchema = mongoose.Schema({
	strategyProvider: { type: String, required: true, unique: true },
	accessToken: { type: String, required: true, unique: true },
	refreshToken: { type: String, required: true, unique: true }
});

TokenSchema.statics.findOrCreate = function findOrCreate(profile, cb) {
	var userObj = new this();
	this.findOne({ _id: profile.id }, function(err, result) {
		if (!result) {
			userObj.username = profile.displayName;
			//....
			userObj.save(cb);
		} else {
			cb(err, result);
		}
	});
};

module.exports = mongoose.model("Token", TokenSchema);
