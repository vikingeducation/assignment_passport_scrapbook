var express = require("express");
var router = express.Router();

const passport = require("passport");

const FB = require("fb");

// home page
router.get("/", (req, res) => {
	if (req.user) {
		res.render("home", { user: req.user });
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
