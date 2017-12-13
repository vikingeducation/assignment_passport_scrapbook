var express = require("express");
var router = express.Router();

const passport = require("passport");

const FB = require("fb");

const api = require("./../services/api");

// home page
router.get("/", async (req, res) => {
	if (req.user) {
		if (req.user.facebookId) {
			var photos = await api.getFbPhotos(req);
		}
		res.render("home", { user: req.user });
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

module.exports = router;