const router = require('express').Router();

router.get('/', (req, res) => {
	console.log(req.user);
	console.log(req.session.user);
	res.render('index');
});

module.exports = router;
