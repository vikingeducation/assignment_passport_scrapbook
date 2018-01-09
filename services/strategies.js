const models = require('./../models');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const SpotifyStrategy = require('passport-spotify').Strategy;

const User = models.User;

// Facebook
const facebookStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:4000/auth/facebook/callback',
    profileFields: ['id', 'displayName'],
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    const facebookId = profile.id;
    const displayName = profile.displayName;

    User.findOne({ 'facebook.id': facebookId }, function(err, user) {
      if (err) return done(err);

      if (!user && !req.user) {
        user = new User({
          facebook: {
            id: facebookId,
            displayName,
            accessToken
          }
        });
        user.save((err, user) => {
          if (err) return done(err);
          done(null, user);
        });
      } else if (!user && req.user) {
        User.findByIdAndUpdate(
          req.user.id,
          {
            facebook: {
              id: facebookId,
              displayName,
              accessToken
            }
          },
          { new: true }
        )
          .then(user => {
            done(null, user);
          })
          .catch(err => {
            return done(err);
          });
      } else if (user && req.user) {
        User.findByIdAndRemove(user.id)
          .then(() => {
            return User.findByIdAndUpdate(
              req.user.id,
              {
                facebook: {
                  id: facebookId,
                  displayName,
                  accessToken
                }
              },
              { new: true }
            );
          })
          .then(user => {
            done(null, user);
          })
          .catch(err => {
            return done(err);
          });
      } else {
        done(null, user);
      }
    });
  }
);

// Twitter
const twitterStrategy = new TwitterStrategy(
  {
    consumerKey: process.env.TWITTER_CONSUMER_KEY,
    consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
    callbackURL: 'http://localhost:4000/auth/twitter/callback',
    passReqToCallback: true
  },
  function(req, token, tokenSecret, profile, done) {
    const twitterId = profile.id;

    User.findOne({ 'twitter.id': twitterId }, function(err, user) {
      if (err) return done(err);

      if (!user && !req.user) {
        user = new User({
          twitter: {
            id: twitterId,
            token,
            tokenSecret
          }
        });
        user.save((err, user) => {
          if (err) return done(err);
          done(null, user);
        });
      } else if (!user && req.user) {
        User.findByIdAndUpdate(
          req.user.id,
          {
            twitter: {
              id: twitterId,
              token,
              tokenSecret
            }
          },
          { new: true }
        )
          .then(user => {
            done(null, user);
          })
          .catch(err => {
            return done(err);
          });
      } else if (user && req.user) {
        User.findByIdAndRemove(user.id)
          .then(() => {
            return User.findByIdAndUpdate(
              req.user.id,
              {
                twitter: {
                  id: twitterId,
                  token,
                  tokenSecret
                }
              },
              { new: true }
            );
          })
          .then(user => {
            done(null, user);
          })
          .catch(err => {
            return done(err);
          });
      } else {
        done(null, user);
      }
    });
  }
);

// Github
const githubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:4000/auth/github/callback',
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    const githubId = profile.id;
    const username = profile.username;

    User.findOne({ 'github.id': githubId }, function(err, user) {
      if (err) return done(err);

      if (!user && !req.user) {
        user = new User({
          github: {
            id: githubId,
            username,
            accessToken
          }
        });
        user.save((err, user) => {
          if (err) return done(err);
          done(null, user);
        });
      } else if (!user && req.user) {
        User.findByIdAndUpdate(
          req.user.id,
          {
            github: {
              id: githubId,
              username,
              accessToken
            }
          },
          { new: true }
        )
          .then(user => {
            done(null, user);
          })
          .catch(err => {
            return done(err);
          });
      } else if (user && req.user) {
        User.findByIdAndRemove(user.id)
          .then(() => {
            return User.findByIdAndUpdate(
              req.user.id,
              {
                github: {
                  id: githubId,
                  username,
                  accessToken
                }
              },
              { new: true }
            );
          })
          .then(user => {
            done(null, user);
          })
          .catch(err => {
            return done(err);
          });
      } else {
        done(null, user);
      }
    });
  }
);

// Spotify
const spotifyStrategy = new SpotifyStrategy(
  {
    clientID: process.env.SPOTIFY_APP_ID,
    clientSecret: process.env.SPOTIFY_APP_SECRET,
    callbackURL: 'http://localhost:4000/auth/spotify/callback',
    passReqToCallback: true
  },
  function(req, accessToken, refreshToken, profile, done) {
    const spotifyId = profile.id;

    User.findOne({ 'spotify.id': spotifyId }, function(err, user) {
      if (err) return done(err);

      if (!user && !req.user) {
        user = new User({
          spotify: {
            id: spotifyId,
            accessToken
          }
        });
        user.save((err, user) => {
          if (err) return done(err);
          done(null, user);
        });
      } else if (!user && req.user) {
        User.findByIdAndUpdate(
          req.user.id,
          {
            spotify: {
              id: spotifyId,
              accessToken
            }
          },
          { new: true }
        )
          .then(user => {
            done(null, user);
          })
          .catch(err => {
            return done(err);
          });
      } else if (user && req.user) {
        User.findByIdAndRemove(user.id)
          .then(() => {
            return User.findByIdAndUpdate(
              req.user.id,
              {
                spotify: {
                  id: spotifyId,
                  accessToken
                }
              },
              { new: true }
            );
          })
          .then(user => {
            done(null, user);
          })
          .catch(err => {
            return done(err);
          });
      } else {
        done(null, user);
      }
    });
  }
);

module.exports = {
  facebookStrategy,
  twitterStrategy,
  githubStrategy,
  spotifyStrategy
};
