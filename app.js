const app = require("express")();
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const expressHandlebars = require("express-handlebars");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  expressSession({
    secret: process.env.secret || "puppies",
    saveUninitialized: false,
    resave: false
  })
);

var hbs = expressHandlebars.create({
  partialsDir: "views/",
  defaultLayout: "application"
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

const passport = require("passport");
app.use(passport.initalize());
app.use(passport.session());

const FacebookStrategy = require("passport-facebook").Strategy;

passport.serializeUser(function(user, done) {
  done(null, user._id);
});

passport.use(
  new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  }),
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({
      facebookId: profile.id
    })
      .then(user => {
        done(null, user);
      })
      .catch(err => {
        done(err);
      });
  }
);
