const router = require("express").Router();

router.get("/", (req, res) => {
	if (!req.user) {
		return res.redirect("/");
	}

	const user = req.user;
	console.log(req.user, "????");

	return res.render("landing", {
		user
	});
});

module.exports = router;
