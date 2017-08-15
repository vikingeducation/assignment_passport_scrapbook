const connect = require("../mongo.js")
const {User} = require("../models")
const GitHubStrategy = require("passport-github2").Strategy


//passport-github
const URLS = {
	github: 'http://localhost:3000/oauth/github/callback'
};
console.log(process.env.GITHUB_APP_ID)
module.exports = {
	github: new GitHubStrategy(
		{
			clientID: process.env.GITHUB_APP_ID,
			clientSecret: process.env.GITHUB_APP_SECRET,
			callbackURL: URLS.github
		},
		async function(accessToken, refreshToken, profile, done) {
			console.log(profile);
			// User.findOrCreate({ githubId: profile.id }, function(err, user) {
			// 	return done(err, user);
			// });
		}
	),




	serializeUser: function (user, done){
		done(null, user.id);
	},

	deserializeUser: async function (id, done) {
		try {
		const user = await User.findById(id)
		if (!user) {
			throw newError = new Error("No User found");
			done(undefined, user)
		}
	} catch (err) {
		done(err)
	}
	}
};
