const FacebookStrategy = require("passport-facebook");

module.exports = {
  utilizePassport: (passport, model) => {

    passport.use(new FacebookStrategy({
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "http://localhost:3000/fb/auth/facebook/callback",
      profileFields: [
        "id",
        "displayName",
        "picture.type(large)",
        "email"
      ],
      passReqToCallback: true
    }, function(req, accessToken, refreshToken, profile, done) {
      // const oauthId = profile.id;
      console.log(profile);

      if (req.user) {
        req.user.oauthId = facebookId;
        req.user.save((err, user) => {
          if (err) {
            done(err);
          } else {
            done(null, user);
          }
        });
        return;
      }

      // console.log(profile);
      model.findOne({
        email: profile.email
      }, function(err, user) {
        if (err)
          return done(err);

        if (!user) {
          const { email } = profile._json;
          const { id } = profile;
          console.log(profile._json);
          console.log(id);
          console.log(email)
          console.log(id, "f;lasf;jasd;ljas;jas;ljas;lasf;ljasd;jas;as;jlasdfjl");

          // const [firstName, lastName] = displayName.split(" ");

          // Create a new account if one doesn't exist
          user = new model({ email, serviceIds: [id] });
          user.save((err, user) => {
            if (err)
              return done(err);
            done(null, user);
          });
        } else {
          // Otherwise, return the extant user.
          done(null, user);
        }
      });
    }));
  }
 };
