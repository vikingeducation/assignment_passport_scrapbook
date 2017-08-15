const { User } = require('../models');
const GitHubStrategy = require('passport-github2').Strategy;
const RedditStrategy = require('passport-reddit').Strategy;

//passport-github
const URLS = {
	github: 'http://localhost:3000/oauth/github/callback',
	reddit: "http://localhost:3000/oauth/reddit/callback"
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
				let user = await User.findOne({ github: {profileId: profile.id} });
				if (!user) {
					// Create a new user.
					user = await User.create({
						displayName: profile.displayName,
						github: {
							profileId: profile.id,
							accessToken: accessToken,
							refreshToken: refreshToken
						}
					});
				} else {
					if (user.github===undefined || !user.github.accessToken) {
						user.github = {
							profileId: profile.id,
							accessToken: accessToken,
							refreshToken: refreshToken
						}
						await user.save()
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
				let user = await User.findOne({ reddit: {profileId: profile.id} });
				if (!user) {
					// Create a new user.
					user = await User.create({
						displayName: profile.displayName,
						reddit: {
							profileId: profile.id,
							accessToken: accessToken,
							refreshToken: refreshToken
						}
					});
				} else {
					if (user.reddit===undefined || !user.reddit.accessToken) {
						user.reddit = {
							profileId: profile.id,
							accessToken: accessToken,
							refreshToken: refreshToken
						}
						await user.save()
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
