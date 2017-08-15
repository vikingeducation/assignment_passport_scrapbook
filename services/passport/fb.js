passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_ID,
      clientSecret: process.env.FB_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      const facebookId = profile.id;
      const displayName = profile.displayName;

      console.log(accessToken);
      // User.findOne({ facebookId }, function(err, user) {
      //   if (err) return done(err);
      //
      //   if (!user) {
      //     // Create a new account if one doesn't exist
      //     user = new User({ facebookId, displayName });
      //     user.save((err, user) => {
      //       if (err) return done(err);
      //       done(null, user);
      //     });
      //   } else {
      //     // Otherwise, return the extant user.
      //     done(null, user);
      //   }
      // });
      /* make the API call */
      // FB.api("/{user-id}/friends", function(response) {
      //   if (response && !response.error) {
      //     /* handle the result */
      //   }
      // });

      userAccessTokenFacebook = accessToken;
      userFacebook = profile;
      done(null);
    }
  )
);
