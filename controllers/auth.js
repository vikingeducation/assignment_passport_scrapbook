const express = require('express');
const models = require('./../models');
const passport = require('passport');

const router = express.Router();
const User = models.User;

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Facebook
router.get('/facebook', passport.authenticate('facebook'));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  })
);

// Twitter
router.get('/twitter', passport.authenticate('twitter'));

router.get(
  '/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  })
);

// GitHub
router.get('/github', passport.authenticate('github'));

router.get(
  '/github/callback',
  passport.authenticate('github', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  })
);

// Spotify
router.get(
  '/spotify',
  passport.authenticate('spotify', {
    scope: ['playlist-read-private', 'user-read-email', 'user-read-private']
  })
);

router.get(
  '/spotify/callback',
  passport.authenticate('spotify', {
    successRedirect: '/',
    failureRedirect: '/auth/login'
  })
);

module.exports = router;
