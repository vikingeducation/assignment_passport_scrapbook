const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TokenSchema = mongoose.Schema({
  strategyProvider: { type: String, required: true, unique: true },
  token: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("Token", TokenSchema)
