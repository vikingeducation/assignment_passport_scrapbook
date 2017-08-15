const router = require('express').Router();
const githubAuth = require('../middleware').api.github;

router.get('/github', githubAuth.authenticate);
router.get('/github/callback', githubAuth.callback);

module.exports = router;
