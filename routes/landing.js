const router = require("express").Router();

router.get("/", (req, res) => {
	if (!req.user) {
		return res.redirect("/");
	}

	const profile = req.user.profile;
	console.log(req.user, "????");

	return res.render("landing", {
		profile
	});
});

module.exports = router;
