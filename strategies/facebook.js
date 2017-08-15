const FacebookStrategy = require("passport-facebook").Strategy;
const { User } = require("../models");

const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    passReqToCallback: true,
    profileFields: ["id", "displayName", "user_photos"]
  },
  async function(req, accessToken, refreshToken, profile, done) {
    console.log(profile);
    const facebook = {
      id: profile.id,
      name: profile.displayName
    };
    try {
      if (req.user) {
        req.user.facebook = facebook;
        const user = await req.user.save();
        done(null, user);
      } else {
        let user = await User.findOne({ "facebook.id": profile.id });
        user = user || (await User.create({ facebook }));
        done(null, user);
      }
    } catch (error) {
      done(error);
    }
  }
);

module.exports = facebookStrategy;
