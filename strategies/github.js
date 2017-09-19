const GithubStrategy = require("passport-github").Strategy;
const { User } = require("../models");
const Github = require("github");

const github = new Github({ Promise: require("bluebird") });

const githubStrategy = new GithubStrategy(
  {
    clientID: process.env.GITHUB_APP_ID,
    clientSecret: process.env.GITHUB_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback",
    passReqToCallback: true,
    profileFields: ["id", "name", "login", "photos"]
  },
  async function(req, accessToken, refreshToken, profile, done) {
    try {
      github.authenticate({ type: "oauth", token: accessToken });
      const githubOpts = {
        username: profile.username,
        per_page: 5,
        sort: "updated"
      };
      let githubData = await github.repos.getForUser(githubOpts);
      githubData = githubData.data.map(repo => repo.name);
      const githubId = profile.id;
      const githubPhoto = profile.photos[0].value;
      const name = profile.name || profile.displayName;

      req.session.locals = req.session.locals || {};
      req.session.locals.name = name;
      req.session.locals.githubPhoto = githubPhoto;
      req.session.locals.githubData = githubData;

      if (req.user) {
        req.user.githubId = githubId;
        req.user.githubPhoto = githubPhoto;
        req.user.githubData = githubData;
        const user = await req.user.save();
        done(null, user);
      } else {
        let user = await User.findOne({ githubId });
        const userOpts = { githubId, githubPhoto, name, githubData };
        user = user || (await User.create(userOpts));
        done(null, user);
      }
    } catch (error) {
      done(error);
    }
  }
);

module.exports = githubStrategy;
