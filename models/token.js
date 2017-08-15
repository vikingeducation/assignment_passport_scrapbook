const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenSchema = mongoose.Schema({
	strategyProvider: { type: String, required: true, unique: true },
	accessToken: { type: String, required: true, unique: true},
	refreshToken: { type: String, required: true, unique: true}
});

module.exports = mongoose.model("Token", TokenSchema);
