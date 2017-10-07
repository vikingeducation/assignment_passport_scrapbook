if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

var express = require("express");
var app = express();

// ----------------------------------------
// Body Parser
// ----------------------------------------
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// ----------------------------------------
// Sessions/Cookies
// ----------------------------------------
var cookieParser = require("cookie-parser");

app.use(cookieParser());

var expressSession = require("express-session");
app.use(expressSession({ secret: process.env.SECRET }));

// require Passport and the Local Strategy
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
// ----------------------------------------
// Logging
// ----------------------------------------
var morgan = require("morgan");
var morganToolkit = require("morgan-toolkit")(morgan);

app.use(morganToolkit());

// ----------------------------------------
// Mongoose
// ----------------------------------------
const mongoose = require("mongoose");
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")().then(() => next());
  }
});

// ----------------------------------------
// Template Engine
// ----------------------------------------
var expressHandlebars = require("express-handlebars");

var hbs = expressHandlebars.create({
  partialsDir: "views/",
  defaultLayout: "application"
});

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Require our User model and Session helpers
var User = require("./models/user");
const {
  createSignedSessionId,
  loginMiddleware,
  loggedInOnly,
  loggedOutOnly
} = require("./services/sessions");

// Mount our custom loginMiddleware
app.use(loginMiddleware);

//–––––––––––––––––––––––––
//-Facebook----
//–––––––––––––––––––––––––

const FacebookStrategy = require("passport-facebook").Strategy;
const FACEBOOK_APP_ID = process.env.FB_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FB_APP_SECRET;

passport.use(
  new FacebookStrategy(
    {
      clientID: FACEBOOK_APP_ID || "hi",
      clientSecret: FACEBOOK_APP_SECRET || "no",
      callbackURL: "http://localhost:4000/auth/facebook/callback",
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, done) {
      const facebookId = profile.id;
      if (req.user) {
        req.user.facebookId = facebookId;
        req.user.save((err, user) => {
          if (err) {
            done(err);
          } else {
            console.log("good");
            done(null, user);
          }
        });
      } else {
        User.findOne({ facebookId }, function(err, user) {
          if (err) {
            console.log(err);
            return done(err);
          }
          console.log("H", user);
          if (!user) {
            user = new User({ facebookId, username: profile.displayName });
            console.log(user);
            user.save((err, user) => {
              if (err) {
                console.log(err);
              }
              done(null, user);
            });
          } else {
            done(null, user);
          }
        });
      }
    }
  )
);

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/passport",
    failureRedirect: "/"
  })
);

//–––––––––––––––––––––––––
//-Twitter----
//–––––––––––––––––––––––––
const TwitterStrategy = require("passport-twitter").Strategy;
const TWITTER_CONSUMER_KEY = process.env.TW_CN_KEY;
const TWITTER_CONSUMER_SECRET = process.env.TW_CN_SECRET;

passport.use(
  new TwitterStrategy(
    {
      consumerKey: TWITTER_CONSUMER_KEY,
      consumerSecret: TWITTER_CONSUMER_SECRET,
      callbackURL: "http://localhost:4000/auth/twitter/callback",
      passReqToCallback: true
    },
    function(req, token, tokenSecret, profile, cb) {
      const twitterId = profile.id;
      if (req.user) {
        req.user.twitterId = twitterId;
        req.user.save((err, user) => {
          if (err) {
            cb(err);
          } else {
            console.log("***SAVED***");
            cb(null, user);
          }
        });
      } else {
        User.findOne({ twitterId }, function(err, user) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          console.log("T", user);
          if (!user) {
            user = new User({ twitterId, username: profile.displayName });
            console.log(user);
            user.save((err, user) => {
              if (err) {
                console.log(err);
              }
              cb(null, user);
            });
          } else {
            cb(null, user);
          }
        });
      }
    }
  )
);

app.get("/auth/twitter", passport.authenticate("twitter"));

app.get(
  "/auth/twitter/callback",
  passport.authenticate("twitter", { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/passport");
  }
);

//–––––––––––––––––––––––––
//-Spotify----
//–––––––––––––––––––––––––
const SpotifyStrategy = require("passport-spotify").Strategy;
const SPOTIFY_CLIENT_ID = process.env.SP_CL_KEY;
const SPOTIFY_CLIENT_SECRET = process.env.SP_CL_SECRET;

passport.use(
  new SpotifyStrategy(
    {
      clientID: SPOTIFY_CLIENT_ID,
      clientSecret: SPOTIFY_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/spotify/callback",
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, cb) {
      const spotifyId = profile.id;
      if (req.user) {
        req.user.spotifyId = spotifyId;
        req.user.save((err, user) => {
          if (err) {
            cb(err);
          } else {
            console.log("***SAVED***");
            cb(null, user);
          }
        });
      } else {
        User.findOne({ spotifyId }, function(err, user) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          console.log("T", user);
          if (!user) {
            user = new User({ spotifyId, username: profile.displayName });
            console.log(user);
            user.save((err, user) => {
              if (err) {
                console.log(err);
              }
              cb(null, user);
            });
          } else {
            cb(null, user);
          }
        });
      }
    }
  )
);

app.get("/auth/spotify", passport.authenticate("spotify"), function(req, res) {
  // The request will be redirected to spotify for authentication, so this
  // function will not be called.
});

app.get(
  "/auth/spotify/callback",
  passport.authenticate("spotify", { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

//––––––––––––––––––––
//-Github––––––––
//––––––––––––––––––––
const GitHubStrategy = require("passport-github").Strategy;
const GITHUB_CLIENT_ID = process.env.GH_CL_ID;
const GITHUB_CLIENT_SECRET = process.env.GH_CL_SECRET;

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/github/callback",
      passReqToCallback: true
    },
    function(req, accessToken, refreshToken, profile, cb) {
      const githubId = profile.id;
      if (req.user) {
        req.user.githubId = githubId;
        req.user.save((err, user) => {
          if (err) {
            cb(err);
          } else {
            console.log("***SAVED***");
            cb(null, user);
          }
        });
      } else {
        User.findOne({ githubId }, function(err, user) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          console.log("T", user);
          if (!user) {
            user = new User({ spotifyId, username: profile.displayName });
            console.log(user);
            user.save((err, user) => {
              if (err) {
                console.log(err);
              }
              cb(null, user);
            });
          } else {
            cb(null, user);
          }
        });
      }
    }
  )
);

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

//––––––––––––––––
//-Twitch–––––––
//–––––––––––––––
const TwitchStrategy = require("passport-twitch").Strategy;
const TWITCH_CLIENT_ID = process.env.TWITCH_CL_ID;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CL_SECRET;

passport.use(
  new TwitchStrategy(
    {
      clientID: TWITCH_CLIENT_ID,
      clientSecret: TWITCH_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/twitch/callback",
      passReqToCallback: true,
      scope: "user_read"
    },
    function(req, accessToken, refreshToken, profile, cb) {
      const twitchId = profile.id;
      console.log("$$$$$$$", twitchId);
      if (req.user) {
        req.user.twitchId = twitchId;
        req.user.save((err, user) => {
          if (err) {
            cb(err);
          } else {
            console.log("***SAVED***");
            cb(null, user);
          }
        });
      } else {
        User.findOne({ twitchId }, function(err, user) {
          if (err) {
            console.log(err);
            return cb(err);
          }
          console.log("T", user);
          if (!user) {
            user = new User({ spotifyId, username: profile.displayName });
            console.log(user);
            user.save((err, user) => {
              if (err) {
                console.log(err);
              }
              cb(null, user);
            });
          } else {
            cb(null, user);
          }
        });
      }
    }
  )
);

app.get("/auth/twitch", passport.authenticate("twitch"));
app.get(
  "/auth/twitch/callback",
  passport.authenticate("twitch", { failureRedirect: "/" }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("/");
  }
);

// ----------------------------------------
// Routes
// ----------------------------------------

var loginRouter = require("./routers/login")(app);
app.use("/", loginRouter);
var passportRouter = require("./routers/passport")(app);
app.use("/passport", loggedInOnly, passportRouter);

// ----------------------------------------
// Server
// ----------------------------------------
// var port = process.env.PORT || process.argv[2] || 3000;
// var host = "localhost";
//
// var args;
// process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);
//
// args.push(() => {
//   console.log(`Listening: http://${host}:${port}`);
// });
//
// app.listen.apply(app, args);
app.listen(4000, console.log("Listening to port 4000"));

module.exports = app;
