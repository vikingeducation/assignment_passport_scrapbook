var express = require("express");
var router = express.Router();

const passport = require("passport");

// home page
router.get("/", (req, res) => {
	if (req.user) {
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
