const router = require("express").Router();

router.get("/", (req, res) => {
	if (!req.user) {
		return res.redirect("/");
	}

	const profile = req.user.profile;
	console.log(profile, "????");

	return res.render("landing", {
		profile
	});
});

module.exports = router;
