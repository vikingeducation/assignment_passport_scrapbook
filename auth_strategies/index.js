const { User } = require('../models');
const GitHubStrategy = require('passport-github2').Strategy;
const RedditStrategy = require('passport-reddit').Strategy;

//passport-github
const URLS = {
	github: 'http://localhost:3000/oauth/github/callback',
	reddit: 'http://localhost:3000/oauth/reddit/callback'
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
				//console.log(profile);
				let user = await User.findOne({
					$or: [{ name: profile.name || 'Andrew Senner'}, { email: profile.email || 'andrewsenner@gmail.col'}]
				});
				if (!user) {
					console.log("no user")
					// Create a new user.
					user = await User.create({
						name: profile.name || 'Andrew Senner',
						email: profile.email || 'andrewsenner@gmail.col',
						github: {
							displayName: profile.displayName,
							profileId: profile.id,
							accessToken: accessToken,
							refreshToken: refreshToken
						}
					});
				} else {

					if (user.github === undefined || !user.github.accessToken) {
						user.github = {
							profileId: profile.id,
							accessToken: accessToken,
							refreshToken: refreshToken
						};
						console.log(user)
						await user.save(user);
					}
				}

				done(null, user);
			} catch (err) {
				done(err);
			}
		}
	),
	reddit: new RedditStrategy(
		{
			clientID: process.env.REDDIT_APP_ID,
			clientSecret: process.env.REDDIT_APP_SECRET,
			callbackURL: URLS.reddit
		},
		async function(accessToken, refreshToken, profile, done) {
			try {
			//	console.log(profile);
				let user = await User.findOne({
					$or: [{ name: profile.name || 'Andrew Senner'}, { email: profile.email || 'andrewsenner@gmail.col'}]
				});
				if (!user) {
					// Create a new user.
					user = await User.create({
						name: profile.name || 'Andrew Senner',
						email: profile.email || 'andrewsenner@gmail.col',
						reddit: {
							displayName: profile.name,
							profileId: profile.id,
							accessToken: accessToken,
							refreshToken: refreshToken
						}
					});
				} else {
					if (user.reddit === undefined || !user.reddit.accessToken) {
						user.reddit = {
							profileId: profile.id,
							accessToken: accessToken,
							refreshToken: refreshToken
						};
						await user.save(user);
					}
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
