//passport-github
const URLS = {
	github: 'http://localhost:3000/oauth/github/callback'
};

module.exports = {
	github: new GitHubStrategy(
		{
			clientID: process.env.GITHUB_APP_ID,
			clientSecret: process.env.GITHUB_APP_SECRET,
			callbackURL: URLS.github
		},
		function(accessToken, refreshToken, profile, done) {
			User.findOrCreate({ githubId: profile.id }, function(err, user) {
				return done(err, user);
			});
		}
	)
};
