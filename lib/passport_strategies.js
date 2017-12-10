const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GitHubStrategy = require('passport-github').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const InstagramStrategy = require('passport-instagram').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const models = require('../models');
const { User } = models;

const Strategies = {
  googleStrategy: new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
      const googleId = profile.id;
      const displayName = profile.displayName;
      const params = {
        googleId: googleId,
        googleDisplayName: displayName,
        googleAccessToken: accessToken,
        googleRefreshToken: refreshToken
      };

      if (!req.user) {
        User.findOne({ googleId })
          .then(user => {
            if (!user) {
              return new User(params).save();
            } else {
              user.update(params);
              return user.save();
            }
          })
          .then(user => {
            done(null, user);
          })
          .catch(e =>  done(e));
      } else {
        User.findByIdAndUpdate(req.user.id, params)
          .then(user => {
            done(null, user);
          })
          .catch(e =>  done(e));
      }
    }
  ),

  githubStrategy: new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, cb) {
      const githubId = profile.id;
      const displayName = profile.displayName;
      const username = profile.username;
      const params = {
        githubId: githubId,
        githubDisplayName: displayName,
        githubAccessToken: accessToken,
        githubRefreshToken: refreshToken,
        githubUsername: username
      };

      if (!req.user) {
        User.findOne({ githubId })
          .then(user => {
            if (!user) {
              return new User(params).save();
            } else {
              user.update(params);
              return user.save();
            }
          })
          .then(user => {
            cb(null, user);
          })
          .catch(e =>  cb(e));
      } else {
        User.findByIdAndUpdate(req.user.id, params)
          .then(user => {
            cb(null, user);
          })
          .catch(e =>  cb(e));
      }
    }
  ),

  linkedinStrategy: new LinkedInStrategy(
    {
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/linkedin/callback",
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, cb) {
      const linkedinId = profile.id;
      const displayName = profile.displayName;
      const params = {
        linkedinId: linkedinId,
        linkedinDisplayName: displayName,
        linkedinAccessToken: accessToken,
        linkedinRefreshToken: refreshToken
      };

      if (!req.user) {
        User.findOne({ linkedinId })
          .then(user => {
            if (!user) {
              return new User(params).save();
            } else {
              user.update(params);
              return user.save();
            }
          })
          .then(user => {
            cb(null, user);
          })
          .catch(e =>  cb(e));
      } else {
        User.findByIdAndUpdate(req.user.id, params)
          .then(user => {
            cb(null, user);
          })
          .catch(e =>  cb(e));
      }
    }
  ),

  instagramStartegy: new InstagramStrategy(
    {
      clientID: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/instagram/callback",
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, cb) {
      const instagramId = profile.id;
      const displayName = profile.displayName;
      const params = {
        instagramId: instagramId,
        instagramDisplayName: displayName,
        instagramAccessToken: accessToken,
        instagramRefreshToken: refreshToken
      };

      if (!req.user) {
        User.findOne({ instagramId })
          .then(user => {
            if (!user) {
              return new User(params).save();
            } else {
              user.update(params);
              return user.save();
            }
          })
          .then(user => {
            cb(null, user);
          })
          .catch(e =>  cb(e));
      } else {
        User.findByIdAndUpdate(req.user.id, params)
          .then(user => {
            cb(null, user);
          })
          .catch(e =>  cb(e));
      }
    }
  ),

  twitterStrategy: new TwitterStrategy(
    {
      consumerKey: process.env.TWITTER_CLIENT_ID,
      consumerSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/twitter/callback",
      passReqToCallback: true
    },
    function(req, token, tokenSecret, profile, cb) {
      const twitterId = profile.id;
      const displayName = profile.displayName;
      const params = {
        twitterId: twitterId,
        twitterDisplayName: displayName,
        twitterAccessToken: token,
        twitterTokenSecret: tokenSecret
      };

      if (!req.user) {
        User.findOne({ twitterId })
          .then(user => {
            if (!user) {
              return new User(params).save();
            } else {
              return user.update(params);
            }
          })
          .then(user => {
            cb(null, user);
          })
          .catch(e =>  {
            cb(e);
          });
      } else {
        User.findByIdAndUpdate(req.user.id, params)
          .then(user => {
            cb(null, user);
          })
          .catch(e =>  {
            cb(e);
          });
      }
    }
  )
};

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(Strategies.googleStrategy);
passport.use(Strategies.githubStrategy);
passport.use(Strategies.linkedinStrategy);
passport.use(Strategies.instagramStartegy);
passport.use(Strategies.twitterStrategy);
