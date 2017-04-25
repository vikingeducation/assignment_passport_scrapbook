const User = require("../../models").User;

const TwitterStrategy = require("passport-twitter").Strategy;

module.exports = new TwitterStrategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: process.env.TWITTER_CALLBACK_URL || "http://localhost:3000/auth/twitter/callback",
        profileFields: ["id", "displayName", "emails"],
        passReqToCallback: true
    },
    function(req, token, tokenSecret, profile, done) {
        User.findOrCreateTwitter(profile, req.user, token, tokenSecret)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err);
            });
    }
);
