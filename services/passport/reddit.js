//REDDIT STUFF
const passport = require("./index");
const request = require("request");

var userAccessTokenTumblr;
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//REDDIT strategy
let { REDDIT_SECRET, REDDIT_ID } = process.env;
const RedditStrategy = require("passport-reddit").Strategy;

passport.use(
  new RedditStrategy(
    {
      clientID: REDDIT_ID,
      clientSecret: REDDIT_SECRET,
      callbackURL: "http://localhost:3000/auth/reddit/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ redditId: profile.id }, function(err, user) {
      //   return done(err, user);
      // });
      console.log("profile = ", profile);
      done(null);
    }
  )
);
