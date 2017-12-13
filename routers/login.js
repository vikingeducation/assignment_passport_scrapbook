var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
var models = require("./../models");
var User = mongoose.model("User");

const passport = require("passport");

// login view
router.get("/login", (req, res) => {
	res.render("login");
});

// register view
router.get("/register", (req, res) => {
	res.render("register");
});

// logout
router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/");
});

// login as existing user
router.post(
	"/login",
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/login",
		failureFlash: true
	})
);

router.post("/register", (req, res, next) => {
	const { username, password } = req.body;
	const user = new User({ username, password });
	user.save((err, user) => {
		req.login(user, function(err) {
			if (err) {
				return next(err);
			}
			return res.redirect("/");
		});
	});
});

router.post("/profile", (req, res) => {
	const { password, username } = req.body;
	const user = req.user;
	console.log(user);
	if (password) user.password = password;
	if (username) user.username = username;
	user.save((err, user) => {
		if (err) {
			console.log(err);
			req.flash("warning", "fail");
			res.redirect("back");
		} else {
			req.flash("warning", "success");
			res.redirect("back");
		}
	});
});

module.exports = router;