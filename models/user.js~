var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const uniqueValidator = require("mongoose-unique-validator");

var UserSchema = new Schema(
  {
    fname: String,
    lname: String,
    username: {
      type: String,
      required: true,
      unique: true
    },
    email: String,
    passwordHash: { 
      type: String, 
      required: true 
    },
    secrets: [
      {
        type: Schema.Types.ObjectId,
        ref: "Secret"
      }
    ]
  },
  {
    timestamps: true
  }
);

UserSchema.plugin(uniqueValidator);

UserSchema.virtual("password").set(function(value) {
  this.passwordHash = bcrypt.hashSync(value, 8); // the 8 here is the "cost factor"
});

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

var User = mongoose.model("User", UserSchema);

module.exports = User;
