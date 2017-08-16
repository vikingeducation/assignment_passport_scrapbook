const FacebookStrategy = require("passport-facebook").Strategy;
const FB = require("fb");
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
      const faceOpts = [
        "me/photos",
        { fields: "images", access_token: accessToken }
      ];
      let facebookData = await FB.api(...faceOpts);
      facebookData = facebookData.data.map(photo => photo.images[0].source);
      const facebookId = profile.id;
      const facebookPhoto = profile.photos[0].value;
      const name = profile.displayName;

      if (req.user) {
        req.user.facebookId = facebookId;
        req.user.facebookPhoto = facebookPhoto;
        req.user.facebookData = facebookData;
        const user = await req.user.save();
        done(null, user);
      } else {
        let user = await User.findOne({ facebookId });
        const userOpts = { facebookId, facebookPhoto, facebookData, name };
        user = user || (await User.create(userOpts));
        done(null, user);
      }
    } catch (error) {
      done(error);
    }
  }
);

module.exports = facebookStrategy;
