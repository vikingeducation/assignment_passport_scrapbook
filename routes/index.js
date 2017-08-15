const router = require("express").Router();

router.get("/", (req, res) => {
	if (req.user) {
		console.log(req.user);
		console.log("Redirecting to landing");
		return res.redirect("/landing");
	}

	return res.render("index");
});

module.exports = router;
