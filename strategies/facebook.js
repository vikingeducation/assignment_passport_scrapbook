const FacebookStrategy = require("passport-facebook").Strategy;
const FACEBOOK_APP_ID = process.env.ACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;

module.exports = new FacebookStrategy(
	{
		clientID: FACEBOOK_APP_ID || "no",
		clientSecret: FACEBOOK_APP_SECRET || "no",
		callbackURL: "http://localhost:3000/auth/facebook/callback",
		passReqToCallback: true
	},
	function(req, accessToken, refreshToken, profile, done) {
		const facebookId = profile.id;
		if (req.user) {
			req.user.facebookId = facebookId;
			req.user.facebookToken = accessToken;
			req.user.save((err, user) => {
				if (err) {
					done(err);
				} else {
					done(null, user);
				}
			});
		} else {
			User.findOne({ facebookId }, function(err, user) {
				if (err) {
					console.log(err);
					return done(err);
				}
				console.log("H", user);
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
