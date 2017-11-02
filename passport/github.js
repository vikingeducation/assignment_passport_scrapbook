const GithubStrategy = require("passport-github").Strategy;
const { User } = require("../models");
const Github = require("github");
const github = new Github({ Promise: require("bluebird") });

const githubOpts = {
  clientID: process.env.GITHUB_APP_ID,
  clientSecret: process.env.GITHUB_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/github/callback",
  passReqToCallback: true,
  profileFields: ["id", "name", "login", "photos"]
};

const getData = async (username, token) => {
  github.authenticate({ type: "oauth", token });
  const options = { username, per_page: 10, sort: "updated" };
  const data = await github.repos.getForUser(options);
  return data.data.map(repo => repo.name);
};

const githubHandler = async (req, accessToken, refreshToken, profile, done) => {
  try {
    const github = {
      data: await getData(profile.username, accessToken),
      id: profile.id,
      photo: profile.photos[0].value
    };
    const name = profile.name || profile.displayName;

    let user = req.user;
    if (user) {
      const options = [{ _id: user._id }, { github }, { new: true }];
      user = await User.findOneAndUpdate(...options);
    } else {
      user = await User.findOne({ "github.id": profile.id });
      user = user || (await User.create({ github, name }));
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
};

module.exports = new GithubStrategy(githubOpts, githubHandler);
