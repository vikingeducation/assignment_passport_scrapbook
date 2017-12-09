const express = require('express');
const router = express.Router();
const GoogleService = require('../services/google_service');

router.get('/', (req, res) => {
  const apiData = {};
  GoogleService.getCalendarEvents(res.locals.currentUser)
    .then(events => {
      apiData.calendarEvents = events;
      res.render('home', { apiData });
    })
    .catch(e => res.status(500).send(e.stack));
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
