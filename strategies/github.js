const GithubStrategy = require("passport-github").Strategy;
const { User } = require("../models");

const githubStrategy = new GithubStrategy(
  {
    clientID: process.env.GITHUB_APP_ID,
    clientSecret: process.env.GITHUB_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback",
    passReqToCallback: true,
    profileFields: ["id", "displayName", "photos"]
  },
  async function(req, accessToken, refreshToken, profile, done) {
    try {
      console.log(profile);
      const githubId = profile.id;
      const githubPhoto = profile.photos[0].value;
      const name = profile.displayName;

      req.session.locals = req.session.locals || {};
      req.session.locals.name = name;
      req.session.locals.githubPhoto = githubPhoto;

      if (req.user) {
        req.user.githubId = githubId;
        const user = await req.user.save();
        done(null, user);
      } else {
        let user = await User.findOne({ githubId });
        user = user || (await User.create({ githubId, githubPhoto, name }));
        done(null, user);
      }
    } catch (error) {
      done(error);
    }
  }
);

module.exports = githubStrategy;
