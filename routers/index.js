const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  let user = "Aaron";
  res.render('home', { user });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
