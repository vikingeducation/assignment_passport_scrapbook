const FacebookStrategy = require("passport-facebook").Strategy;
const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

const User = require("./../../models");

module.exports = new FacebookStrategy(
	{
		clientID: FACEBOOK_APP_ID || "hi",
		clientSecret: FACEBOOK_APP_SECRET || "no",
		callbackURL: "http://localhost:4000/auth/facebook/callback",
		profileFields: ["id", "displayName", "photos"],
		passReqToCallback: true
	},
	function(req, accessToken, refreshToken, profile, done) {
		console.log("profile", JSON.stringify(profile, 0, 2));
		const facebookId = profile.id;
		if (req.user) {
			req.user.facebookId = facebookId;
			req.user.facebookToken = accessToken;
			req.user.photos = profile.photos[0].value;
			req.user.save((err, user) => {
				if (err) {
					done(err);
				} else {
					done(null, user);
					req.user.photos = profile.photos[0].value;
				}
			});
		} else {
			User.findOne({ facebookId }, function(err, user) {
				if (err) {
					console.log("Error:", err);
					return done(err);
				}
				if (!user) {
					user = new User({
						facebookId: facebookId,
						facebookToken: accessToken,
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
