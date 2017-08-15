const { User } = require('../models');
const GitHubStrategy = require('passport-github2').Strategy;

//passport-github
const URLS = {
	github: 'http://localhost:3000/oauth/github/callback'
};
const mongoose = require('mongoose');
module.exports = {
	github: new GitHubStrategy(
		{
			clientID: process.env.GITHUB_APP_ID,
			clientSecret: process.env.GITHUB_APP_SECRET,
			callbackURL: URLS.github
		},
		async function(accessToken, refreshToken, profile, done) {
			try {
				let user = await User.findOne({ githubId: profile.id });
				if (!user) {
					// Create a new user.
					user = await User.create({
						displayName: profile.displayName,
						githubId: profile.id
					});
				}
				done(null, user);
			} catch (err) {
				done(err);
			}
		}
	),

	serializeUser: function(user, done) {
		done(null, user.id);
	},

	deserializeUser: async function(id, done) {
		try {
			const user = await User.findById(id);
			if (!user) {
				throw (newError = new Error('No User found'));
			}
			done(undefined, user);
		} catch (err) {
			done(err);
		}
	}
};
