const passport = require("passport");
const { User } = require("../models");

const auth = app => {
  app.use(passport.initialize());
  app.use(passport.session());

  passport.serializeUser(function(user, done) {
    done(null, user._id);
  });

  passport.deserializeUser(function(userId, done) {
    User.findById(userId, (err, user) => done(err, user));
  });

  passport.use("facebook", require("./facebook"));
  passport.use("github", require("./github"));
  passport.use("twitter", require("./twitter"));
};

module.exports = auth;
