const router = require('express').Router();
const {github, reddit} = require('../middleware').api;

router.get('/github', github.authenticate);
router.get('/github/callback', github.callback);

router.get('/reddit', reddit.authenticate);
router.get('/reddit/callback', reddit.callback);



module.exports = router;
