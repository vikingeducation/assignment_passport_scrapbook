const LinkedinStrategy = require("passport-linkedin");

module.exports = {
  utilizePassport: (passport, model) => {
    passport.use(
      new LinkedinStrategy(
        {
          consumerKey: process.env.LINKEDIN_APP_ID,
          consumerSecret: process.env.LINKEDIN_APP_SECRET,
          callbackURL: "http://localhost:3000/auth/linkedin/callback",
          profileFields: ['id', 'first-name', 'last-name', 'email-address', 'headline'],
          passReqToCallback: true
        },
        function(req, accessToken, refreshToken, profile, done) {
          if (req.user) {
            req.user.save((err, user) => {
              if (err) {
                done(err);
              } else {
                req.user.profile = profile;
                done(null, user);
              }
            });
            return;
          }

          model.findOne(
            {
              email: profile._json.emailAddress
            },
            function(err, user) {
              if (err) return done(err);

              if (!user) {
                const { emailAddress } = profile._json;
                const { id } = profile;

                // Create a new account if one doesn't exist
                user = new model({ email: emailAddress, linkedinId: id });
                user.save((err, user) => {
                  if (err) return done(err);
                  done(null, user);
                });
              } else {
                // Otherwise, return the extant user.
                done(null, user);
              }
            }
          );
        }
      )
    );
  }
};
