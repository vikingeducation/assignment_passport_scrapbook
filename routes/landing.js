const router = require("express").Router();

router.get("/", (req, res) => {
	if (!req.user) {


		return res.redirect("/");
	}

	// console.log("fdlasdf;asdf;lasf;jlkd");
	console.log("req_user", req.user);
	console.log("req_profile", req.locals.profile);

	const profile = req.locals.profile;
	const user = req.user;
	const profileInfo = {};
	profileInfo.email = profile.email;
	profileInfo.displayName = profile.displayName;
	profileInfo.photos = profile.photos;

	return res.render("landing", {
		profileInfo
	});
});

module.exports = router;
