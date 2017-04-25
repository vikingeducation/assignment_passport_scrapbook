const passport = require("passport");
const User = require('../models').User;

module.exports = (app) => {

    app.use(passport.initialize());
    app.use(passport.session());

    const FacebookStrategy = require("passport-facebook").Strategy;

    passport.use(
        new FacebookStrategy({
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
                callbackURL: process.env.FACEBOOK_CALLBACK_URL ||
                    "http://localhost:3000/auth/facebook/callback",
                profileFields: ["id", "displayName", "emails"],
                passReqToCallback: true
            },
            function(req, accessToken, refreshToken, profile, done) {
                req.user.name = "facebookAuth";
                User.findOrCreateFacebook(profile)
                    .then(user => {
                        done(null, user);
                    })
                    .catch(err => {
                        done(err);
                    });
            }
        )
    );

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id)
            .then(user => {
                done(null, user);
            })
            .catch(err => {
                done(err);
            });
    });
    return passport;
};
