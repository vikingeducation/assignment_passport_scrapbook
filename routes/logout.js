const router = require("express").Router();

router.get("/", (req, res) => {
	req.session.destroy(err => {
		if (err) return next(err);

		req.logout();

		res.redirect("/");
	});
});

module.exports = router;
