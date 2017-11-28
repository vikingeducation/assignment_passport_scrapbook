var express = require("express");
var router = express.Router();

const passport = require("passport");

const FB = require("fb");

const api = require("./../services/api");

// home page
router.get("/", async (req, res) => {
	if (req.user) {
		if (req.user.twitterId) {
			var tweets = await api.getSomeTweets(req);
		}
		res.render("home", { user: req.user, tweets: tweets });
	} else {
		res.redirect("/login");
	}
});

router.get("/auth/facebook", passport.authenticate("facebook"));

// http://localhost:3000/auth/facebook/callback
router.get(
	"/auth/facebook/callback",
	passport.authenticate("facebook", {
		successRedirect: "/",
		failureRedirect: "/login"
	})
);

router.get("/auth/twitter", passport.authenticate("twitter"));

router.get(
	"/auth/twitter/callback",
	passport.authenticate("twitter", {
		successRedirect: "/",
		failureRedirect: "/login"
	})
);

// router.get("/auth/facebook/callback", (req, res, next) => {
// 	passport.authenticate(
// 		"facebook",
// 		{
// 			successRedirect: "/",
// 			failureRedirect: "/login"
// 		},
// 		(err, user, info) => {
// 			if (err) {
// 				console.error(err);
// 				res.redirect("/login");
// 			} else {
// 				next();
// 			}
// 		}
// 	)(req, res, next);
// });

module.exports = router;
