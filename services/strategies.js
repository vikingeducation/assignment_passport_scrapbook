const models = require('./../models');
const User = models.User;
const passport = require('passport');
const InstagramStrategy = require("passport-instagram").Strategy;
const GithubStrategy = require("passport-github").Strategy;
const TwitterStrategy = require("passport-twitter").Strategy;
const SpotifyStrategy = require("passport-spotify").Strategy;

// ----------------------------------------
// Instagram Strategy
// ----------------------------------------
let igStrategy = new InstagramStrategy({
  clientID: process.env.INSTAGRAM_APP_ID,
  clientSecret: process.env.INSTAGRAM_APP_SECRET,
  callbackURL: "http://localhost:4000/auth/instagram/callback",
  passReqToCallback: true
},
function(req, accessToken, refreshToken, profile, done) {
  const instagramId = profile.id;

  User.findOne({ 'instagram.id': instagramId }, function(err, user) {
    if (err) return done(err);
    
    if (!user && !req.user) {
      user = new User({ 
        'instagram': {
          id: instagramId,
          accessToken
        }
      });
      user.save((err, user) => {
        if (err) return done(err);
        done(null, user);
      });
    } else if (!user && req.user && !req.user.email) {
      req.flash('warning', 'Looks like you previously started to sign up, please finish first before connecting another account');
      done(null, req.user);
    } else if (!user && req.user && req.user.email) {
      User.findByIdAndUpdate(req.user.id, {
        'instagram': {
          id: instagramId,
          accessToken
        }
      }, { new: true})
        .then(user => {
          req.flash('success', 'Instagram account successfully connected');
          done(null, user);
        })
        .catch(e => { done(e); });
    } else if (user && req.user && req.user.email) {
      User.findByIdAndRemove(user.id)
        .then(() => {
          return User.findByIdAndUpdate(req.user.id, {
            'instagram': {
              id: instagramId,
              accessToken
            }
          }, {new: true});
        })
        .then(user => {
          req.flash('success', 'Instagram account successfully connected');
          done(null, user);
        });
    } else if (user) {
      done(null, user);
    }
  });
});

// ----------------------------------------
// GitHub Strategy
// ----------------------------------------
let ghStrategy = new GithubStrategy({
  clientID: process.env.GITHUB_APP_ID,
  clientSecret: process.env.GITHUB_APP_SECRET,
  callbackURL: "http://localhost:4000/auth/github/callback",
  passReqToCallback: true
},
function(req, accessToken, refreshToken, profile, done) {
  const githubId = profile.id;

  User.findOne({ 'github.id': githubId }, function(err, user) {
    if (err) return done(err);
    
    if (!user && !req.user) {
      user = new User({ 
        'github': {
          id: githubId,
          accessToken
        }
      });
      user.save((err, user) => {
        if (err) return done(err);
        done(null, user);
      });
    } else if (!user && req.user && !req.user.email) {
      req.flash('warning', 'Looks like you previously started to sign up, please finish first before connecting another account');
      done(null, req.user);
    } else if (!user && req.user && req.user.email) {
      User.findByIdAndUpdate(req.user.id, {
        'github': {
          id: githubId,
          accessToken
        }
      }, { new: true})
        .then(user => {
          req.flash('success', 'GitHub account successfully connected');
          done(null, user);
        })
        .catch(e => { done(e); });
    } else if (user && req.user && req.user.email) {
      User.findByIdAndRemove(user.id)
        .then(() => {
          return User.findByIdAndUpdate(req.user.id, {
            'github': {
              id: githubId,
              accessToken
            }
          }, {new: true});
        })
        .then(user => {
          req.flash('success', 'GitHub account successfully connected');
          done(null, user);
        });
    } else if (user) {
      done(null, user);
    }
  });
});

// ----------------------------------------
// Twitter Strategy
// ----------------------------------------
let twitterStrategy = new TwitterStrategy({
  consumerKey: process.env.TWITTER_APP_ID,
  consumerSecret: process.env.TWITTER_APP_SECRET,
  callbackURL: "http://localhost:4000/auth/twitter/callback",
  passReqToCallback: true
},
function(req, token, tokenSecret, profile, done) {
  const twitterId = profile.id;
    console.log('&%&^&^&$%&^$&%^$&%^&$%^')
    console.log(profile);
    console.log('&%&^&^&$%&^$&%^$&%^&$%^')

  User.findOne({ 'twitter.id': twitterId }, function(err, user) {
    if (err) return done(err);

    if (!user && !req.user) {
      user = new User({ 
        'twitter': {
          id: twitterId,
          token,
          tokenSecret
        }
      });
      user.save((err, user) => {
        if (err) return done(err);
        done(null, user);
      });
    } else if (!user && req.user && !req.user.email) {
      req.flash('warning', 'Looks like you previously started to sign up, please finish first before connecting another account');
      done(null, req.user);
    } else if (!user && req.user && req.user.email) {
      User.findByIdAndUpdate(req.user.id, {
        'twitter': {
          id: twitterId,
          token,
          tokenSecret
        }
      }, { new: true})
        .then(user => {
          req.flash('success', 'Twitter account successfully connected');
          done(null, user);
        })
        .catch(e => { done(e); });
    } else if (user && req.user && req.user.email) {
      User.findByIdAndRemove(user.id)
        .then(() => {
          return User.findByIdAndUpdate(req.user.id, {
            'twitter': {
              id: twitterId,
              token,
              tokenSecret
            }
          }, {new: true});
        })
        .then(user => {
          req.flash('success', 'Twitter account successfully connected');
          done(null, user);
        });
    } else if (user) {
      done(null, user);
    }
  });
});

// ----------------------------------------
// Spotify Strategy
// ----------------------------------------
let spotStrategy = new SpotifyStrategy({
  clientID: process.env.SPOTIFY_APP_ID,
  clientSecret: process.env.SPOTIFY_APP_SECRET,
  callbackURL: "http://localhost:4000/auth/spotify/callback",
  passReqToCallback: true
},
function(req, accessToken, refreshToken, profile, done) {
  const spotifyId = profile.id;

  User.findOne({ 'spotify.id': spotifyId }, function(err, user) {
    if (err) return done(err);

    if (!user && !req.user) {
      user = new User({ 
        'spotify': {
          id: spotifyId,
          accessToken
        }
      });
      user.save((err, user) => {
        if (err) return done(err);
        done(null, user);
      });
    } else if (!user && req.user && !req.user.email) {
      req.flash('warning', 'Looks like you previously started to sign up, please finish first before connecting another account');
      done(null, req.user);
    } else if (!user && req.user && req.user.email) {
      User.findByIdAndUpdate(req.user.id, {
        'spotify': {
          id: spotifyId,
          accessToken
        }
      }, { new: true})
        .then(user => {
          req.flash('success', 'Spotify account successfully connected');
          done(null, user);
        })
        .catch(e => { done(e); });
    } else if (user && req.user && req.user.email) {
      User.findByIdAndRemove(user.id)
        .then(() => {
          return User.findByIdAndUpdate(req.user.id, {
            'spotify': {
              id: spotifyId,
              accessToken
            }
          }, {new: true});
        })
        .then(user => {
          req.flash('success', 'Spotify account successfully connected');
          done(null, user);
        });
    } else if (user) {
      done(null, user);
    }
  });
});

module.exports = {
  igStrategy,
  ghStrategy,
  twitterStrategy,
  spotStrategy
};