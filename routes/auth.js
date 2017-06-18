const express = require('express');
const router = express.Router();
const models = require('./../models');
const User = models.User;
const passport = require('passport');
const h = require('./../helpers').registered;

// ----------------------------------------
// Instagram
// ----------------------------------------
router.get("/instagram", passport.authenticate("instagram"));

router.get("/instagram/callback", passport.authenticate("instagram", {
  successRedirect: h.authEmailPath(),
  failureRedirect: h.authLoginPath()
}));

// ----------------------------------------
// GitHub
// ----------------------------------------
router.get("/github", passport.authenticate("github"));

router.get("/github/callback", passport.authenticate("github", {
  successRedirect: h.authEmailPath(),
  failureRedirect: h.authLoginPath()
}));

// ----------------------------------------
// Twitter
// ----------------------------------------
router.get("/twitter", passport.authenticate("twitter"));

router.get("/twitter/callback", passport.authenticate("twitter", {
  successRedirect: h.authEmailPath(),
  failureRedirect: h.authLoginPath()
}));

// ----------------------------------------
// Spotify
// ----------------------------------------
router.get("/spotify", passport.authenticate("spotify", {
  scope: ['user-read-email', 'user-read-private', 'playlist-read-private']
}));

router.get("/spotify/callback", passport.authenticate("spotify", {
  successRedirect: h.authEmailPath(),
  failureRedirect: h.authLoginPath(),
}));

// ----------------------------------------
// Login / Logout / Register Email
// ----------------------------------------
router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

router.get('/email', (req, res) => {
  if (req.user && req.user.email) {
    res.redirect('/');
  } else {
    res.render('auth/email');
  }
});

router.post('/email', (req, res) => {
  let email = req.body.email;

  User.findOne({ email })
    .then(user => {
      if (user) {
        // Looks up user via email. If found, they already have account and are probably trying to log in incorrectly
        req.flash('error', 'Error: That email is already in use. If you already have an account, try logging in with a different social media account instead!');
        res.redirect('/auth/email');
      } else {
        // otherwise, we have a new user
        return User.findByIdAndUpdate(req.user.id, { email });
      }
    })
    .then(user => {
      if (user) {
        req.login(user, (err) => {
          if (err) {
            res.status(500).send(err);
          }
          req.flash('success', 'Email successfully registered!');
          return res.redirect('/');
        });
      }
    })
    .catch(e => {
      if (e.errors) {
        let errors = Object.keys(e.errors);

        errors.forEach(error => {
          req.flash('error', e.errors[error].message);
        });
        res.redirect('back');
      } else {
        res.status(500).send(e.stack);
      }
    });
});

module.exports = router;