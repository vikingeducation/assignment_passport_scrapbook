const FacebookStrategy = require("passport-facebook").Strategy;
const { User } = require("../models");

const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    passReqToCallback: true,
    profileFields: ["id", "displayName", "photos"]
  },
  async function(req, accessToken, refreshToken, profile, done) {
    try {
      const facebookId = profile.id;
      const facebookPhoto = profile.photos[0].value;
      const name = profile.displayName;

      req.session.locals = req.session.locals || {};
      req.session.locals.name = name;
      req.session.locals.facebookPhoto = facebookPhoto;

      if (req.user) {
        req.user.facebookId = facebookId;
        req.user.facebookPhoto = facebookPhoto;
        const user = await req.user.save();
        done(null, user);
      } else {
        let user = await User.findOne({ facebookId });
        user = user || (await User.create({ facebookId, facebookPhoto, name }));
        done(null, user);
      }
    } catch (error) {
      done(error);
    }
  }
);

module.exports = facebookStrategy;
