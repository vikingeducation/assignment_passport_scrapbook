const TwitterStrategy = require("passport-twitter").Strategy;
const { User } = require("../models");

module.exports = passport => {
  passport.use(
    new TwitterStrategy(
      {
        consumerKey: process.env.TWITTER_APP_ID,
        consumerSecret: process.env.TWITTER_APP_SECRET,
        callbackURL:
          process.env.TWITTER_URI ||
          "http://localhost:3000/auth/twitter/callback",
        profileFields: ["id", "displayName", "photos", "emails"],
        passReqToCallback: true
      },
      function(req, token, tokenSecret, profile, done) {
        console.log(profile);
        const twitterId = profile.id;
        const displayName = profile.displayName;
        const twitterImages = profile.photos;
        const twitterLocation = profile._json.location;
        const twitterDescription = profile._json.description;
        const twitterFriendsCount = profile._json.friends_count;
        const twitterStatusesCount = profile._json.statuses_count;
        let _id;
        if (req.user) {
          _id = req.user._id;
          User.findOne({ _id }).then(user => {
            user.twitterId = twitterId;
            user.twitterImages = twitterImages;
            user.twitterLocation = twitterLocation;
            user.twitterDescription = twitterDescription;
            user.twitterFriendsCount = twitterFriendsCount;
            user.twitterStatusesCount = twitterStatusesCount;
            user
              .save()
              .then(user => {
                return done(null, user);
              })
              .catch(e => {
                if (e) throw e;
              });
          });
        } else {
          User.findOne({ twitterId }).then(user => {
            if (!user) {
              user = new User({
                twitterId,
                displayName,
                twitterImages,
                twitterLocation,
                twitterDescription,
                twitterFriendsCount,
                twitterStatusesCount
              });
              user
                .save()
                .then(user => {
                  return done(null, user);
                })
                .catch(e => {
                  if (e) throw e;
                });
            } else {
              user.twitterId = twitterId;
              user.twitterImages = twitterImages;
              user.twitterLocation = twitterLocation;
              user.twitterDescription = twitterDescription;
              user.twitterFriendsCount = twitterFriendsCount;
              user.twitterStatusesCount = twitterStatusesCount;
              user
                .save()
                .then(user => {
                  return done(null, user);
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

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
