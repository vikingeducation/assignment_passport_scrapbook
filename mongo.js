var mongoose = require("mongoose");
var env = process.env.NODE_ENV || "development";
var config = require("./config/mongo")[env];

module.exports = () => {
  return mongoose.connect(`mongodb://${config.host}/${config.database}`);
};
