var express = require("express");
var router = express.Router();

const passport = require("passport");
const api = require("./../services/api");

// home page
router.get("/", async (req, res) => {
	if (req.user) {
		if (req.user.twitterId) {
			var tweets = await api.getSomeTweets(req);
		}
		if (req.user.githubUsername) {
			var repos = await api.getRepos(req);
		}
		if (req.user.facebookId) {
			var photos = await api.getFbPhotos(req);
		}
		res.render("home", { user: req.user, tweets: tweets, repos: repos });
	} else {
		res.redirect("/login");
	}
});

router.get("/auth/facebook", passport.authenticate("facebook"));

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

router.get("/auth/github", passport.authenticate("github"));

router.get(
	"/auth/github/callback",
	passport.authenticate("github", {
		successRedirect: "/",
		failureRedirect: "/login"
	})
);

module.exports = router;