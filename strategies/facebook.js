const FacebookStrategy = require("passport-facebook").Strategy;
const FB = require("fb");
const { User } = require("../models");

const strategyOpts = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/callback",
  passReqToCallback: true,
  profileFields: ["id", "displayName", "photos"]
};

const getPhotos = async accessToken => {
  const faceOpts = [
    "me/photos",
    { fields: "images", access_token: accessToken }
  ];
  let photos = await FB.api(...faceOpts);
  return photos.data.map(photo => photo.images[0].source);
};

const faceHandler = async (req, accessToken, refreshToken, profile, done) => {
  try {
    const facebook = {
      data: await getPhotos(accessToken),
      id: profile.id,
      photo: profile.photos[0].value
    };
    const name = profile.displayName;

    if (req.user) {
      req.user.facebook = facebook;
      req.user.name = name;
      const user = await req.user.save();
      done(null, user);
    } else {
      let user = await User.findOne({ facebook: { id: profile.id } });
      user = user || (await User.create({ facebook, name }));
      done(null, user);
    }
  } catch (error) {
    done(error);
  }
};

module.exports = new FacebookStrategy(strategyOpts, faceHandler);
