const FacebookStrategy = require("passport-facebook").Strategy;
const FB = require("fb");
const { User } = require("../models");

const facebookOpts = {
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/callback",
  passReqToCallback: true,
  profileFields: ["id", "displayName", "photos"]
};

const getData = async access_token => {
  const faceOpts = ["me/photos", { fields: "images", access_token }];
  let photos = await FB.api(...faceOpts);
  return photos.data.map(photo => photo.images[0].source);
};

const faceHandler = async (req, accessToken, refreshToken, profile, done) => {
  try {
    const facebook = {
      data: await getData(accessToken),
      id: profile.id,
      photo: profile.photos[0].value
    };
    const name = profile.displayName;

    let user = req.user;
    if (user) {
      const options = [{ _id: user._id }, { facebook }, { new: true }];
      user = await User.findOneAndUpdate(...options);
    } else {
      user = await User.findOne({ "facebook.id": profile.id });
      user = user || (await User.create({ facebook, name }));
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
};

module.exports = new FacebookStrategy(facebookOpts, faceHandler);
