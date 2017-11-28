const TwitterStrategy = require("passport-twitter").Strategy;
const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;

const User = require("./../models");

module.exports = new TwitterStrategy(
	{
		consumerKey: TWITTER_CONSUMER_KEY,
		consumerSecret: TWITTER_CONSUMER_SECRET,
		callbackURL: "http://localhost:3000/auth/twitter/callback",
		passReqToCallback: true
	},
	function(req, token, tokenSecret, profile, done) {
		// console.log("profile", JSON.stringify(profile, 0, 2));
		const twitterId = profile.id;
		if (req.user) {
			req.user.twitterId = twitterId;
			req.user.twitterToken = token;
			req.user.twitterTokenSecret = tokenSecret;
			req.user.save((err, user) => {
				if (err) {
					done(err);
				} else {
					done(null, user);
				}
			});
		} else {
			User.findOne({ twitterId }, function(err, user) {
				if (err) {
					console.log(err);
					return done(err);
				}
				console.log("H", user);
				if (!user) {
					user = new User({
						twitterId: twitterId,
						twitterToken: token,
						twitterTokenSecret: tokenSecret,
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
