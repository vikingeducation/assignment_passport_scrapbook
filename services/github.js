const GitHubStrategy = require("passport-github").Strategy;
const { User } = require("../models");

module.exports = passport => {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_APP_ID,
        clientSecret: process.env.GITHUB_APP_SECRET,
        callbackURL:
          process.env.GITHUB_URI ||
          "http://localhost:3000/auth/github/callback",
        profileFields: ["id", "displayName", "photos", "emails"],
        passReqToCallback: true
      },
      function(req, token, tokenSecret, profile, cb) {
        console.log(profile);
        const githubId = profile.id;
        const displayName = profile.displayName;
        const githubImages = profile.photos;
        const githubReposUrl = profile._json.repos_url;
        const githubUsername = profile.username;
        let _id;
        if (req.user) {
          _id = req.user._id;
          User.findOne({ _id }).then(user => {
            user.githubId = githubId;
            user.githubImages = githubImages;
            user.githubReposUrl = githubReposUrl;
            user.githubUsername = githubUsername;
            user
              .save()
              .then(user => {
                return cb(null, user);
              })
              .catch(e => {
                if (e) throw e;
              });
          });
        } else {
          User.findOne({ githubId }).then(user => {
            if (!user) {
              user = new User({
                githubId,
                displayName,
                githubImages,
                githubReposUrl,
                githubUsername
              });
              user
                .save()
                .then(user => {
                  return cb(null, user);
                })
                .catch(e => {
                  if (e) throw e;
                });
            } else {
              user.githubId = githubId;
              user.githubImages = githubImages;
              user.githubReposUrl = githubReposUrl;
              user.githubUsername = githubUsername;
              user
                .save()
                .then(user => {
                  return cb(null, user);
                })
                .catch(e => {
                  if (e) throw e;
                });
            }
          });
        }
      }
    )
  );

  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });

  passport.deserializeUser(function(id, cb) {
    User.findById(id, function(err, user) {
      cb(err, user);
    });
  });
};
