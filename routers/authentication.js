const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/google',
  passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/calendar.readonly'],
    approval_prompt: "force",
    access_type: 'offline'
  }));

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', approval_prompt: "force", access_type: 'offline' }),
  (req, res) => {
    res.redirect('/');
  });

router.get('/github',
  passport.authenticate('github', {failureRedirect: '/login'}));

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/login'}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/linkedin',
  passport.authenticate('linkedin', { scope: ['r_basicprofile', 'r_emailaddress'] }));

router.get('/linkedin/callback',
  passport.authenticate('linkedin', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/instagram',
  passport.authenticate('instagram'));

router.get('/instagram/callback',
  passport.authenticate('instagram', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

router.get('/twitter',
  passport.authenticate('twitter'));

router.get('/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

module.exports = router;
