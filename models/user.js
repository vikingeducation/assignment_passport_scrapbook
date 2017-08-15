const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

// email, firstname, lastname, ids for each service

const UserSchema = mongoose.Schema({
	email: { type: String, required: true, unique: true },
	serviceIds: [{ type: String, required: true, unique: true }]
});

UserSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", UserSchema);
