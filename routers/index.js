const express = require('express');
const router = express.Router();
const GoogleService = require('../services/google_service');
const GithubService = require('../services/github_service');
const LinkedinService = require('../services/linkedin_service');
const InstagramService = require('../services/instagram_service');
const TwitterService = require('../services/twitter_service');
const { loggedInOnly, loggedOutOnly} = require('../services/session');

router.get('/', loggedInOnly, async (req, res) => {
  const apiData = {};
  if (req.user.googleId) apiData.calendarEvents = await GoogleService.getCalendarEvents(req.user);
  if (req.user.githubId) apiData.githubRepos = await GithubService.getRepoInfo(req.user.githubUsername);
  if (req.user.linkedinId) apiData.linkedinProfile = await LinkedinService.getProfileInfo(req.user);
  if (req.user.instagramId) apiData.instagramFeed = await InstagramService.getSelfFeed(req.user);
  if (req.user.twitterId) apiData.tweets = await TwitterService.getTweets(req.user);
  res.render('home', { apiData });
});

router.get('/login', loggedOutOnly, (req, res) => {
  res.render('login');
});

router.get("/logout", function(req, res) {
  req.logout();
  res.redirect("/");
});

module.exports = router;
