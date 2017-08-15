const router = require('express').Router();

router.get('/', (req, res) => {
	console.log(req.user);
	res.render('index', {user:req.user});
});

module.exports = router;
