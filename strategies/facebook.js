const FacebookStrategy = require("passport-facebook").Strategy;
const { User } = require("../models");
const fetch = require("isomorphic-fetch");

const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    passReqToCallback: true,
    profileFields: ["id", "displayName", "photos"]
  },
  async function(req, accessToken, refreshToken, profile, done) {
    console.log(profile);
    const facebookId = profile.id;
    const name = profile.displayName;

    // fetch pictures

    // create session user
    req.session.facebook = {};

    try {
      if (req.user) {
        req.user.facebookId = facebookId;
        const user = await req.user.save();
        done(null, user);
      } else {
        let user = await User.findOne({ facebookId });
        user = user || (await User.create({ facebookId, name }));
        done(null, user);
      }
    } catch (error) {
      done(error);
    }
  }
);

module.exports = facebookStrategy;
