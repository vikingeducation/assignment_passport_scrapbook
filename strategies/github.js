const GithubStrategy = require("passport-github2").Strategy;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const User = require("../models/User");

module.exports = new GitHubStrategy(
  {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback",
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    const githubId = github.id;
    console.log("profile ", profile);
    if (req.user) {
      req.user.githubId = githubId;
      req.user.githubToken = accessToken;
      req.user.save((err, user) => {
        if (err) {
          done(err);
        } else {
          done(null, user);
        }
      });
    } else {
      User.findOne({ githubId }, function(err, user) {
        if (err) {
          console.log(err);
          return done(err);
        }
        if (!user) {
          user = new User({
            githubId,
            username: profile.displayName,
            githubToken: accessToken
          });
          user.save((err, user) => {
            if (err) {
              console.log(err);
            }
            done(null, user);
          });
        } else {
          done(null, user);
        }
      });
    }
  }
);
