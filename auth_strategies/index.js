


//passport-github
module.exports = {

  github: new GitHubStrategy({
      clientID: process.env.GITHUB_APP_ID,
      clientSecret: process.env.GITHUB_APP_SECRET,
      callbackURL: "http://localhost:3000/oauth/github/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOrCreate({ githubId: profile.id }, function (err, user) {
        return done(err, user);
      });
    }
  ),

  



}