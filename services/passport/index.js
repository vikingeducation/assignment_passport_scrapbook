let passport = require("passport");

passport.serializeUser(function(user, done) {
  console.log("serialize");
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log("dedeserialize");
  done(null, obj);
});

module.exports = passport;
