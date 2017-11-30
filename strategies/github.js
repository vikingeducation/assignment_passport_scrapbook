var GitHubStrategy = require("passport-github").Strategy;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const User = require("./../models");

module.exports = new GitHubStrategy(
	{
		clientID: GITHUB_CLIENT_ID,
		clientSecret: GITHUB_CLIENT_SECRET,
		callbackURL: "http://localhost:3000/auth/github/callback",
		passReqToCallback: true
	},
	function(req, accessToken, refreshToken, profile, done) {
		console.log("profile", JSON.stringify(profile, 0, 2));
		const githubID = profile.id;
		if (req.user) {
			req.user.githubID = githubID;
			req.user.githubToken = accessToken;
			req.user.githubUsername = profile.username;
			req.user.save((err, user) => {
				if (err) {
					done(err);
				} else {
					done(null, user);
				}
			});
		} else {
			User.findOne({ githubID }, function(err, user) {
				if (err) {
					console.log(err);
					return done(err);
				}
				console.log("H", user);
				if (!user) {
					user = new User({
						githubID: githubID,
						githubToken: accessToken,
						githubUsername: profile.username,
						username: profile.displayName
					});
					console.log(user);
					user.save((err, user) => {
						if (err) {
							console.log(err);
						}
						done(null, user);
					});
				} else {
					done(null, user);
				}
			});
		}
	}
);
