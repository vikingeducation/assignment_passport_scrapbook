const router = require('express').Router();

router.get('/', (req, res) => {
	console.log("req.user: ", req.user);
  console.log("req.user.reddit is ", req.user && req.user.reddit ? req.user.reddit: "not there")
	res.render('index', {user:req.user});
});

module.exports = router;
