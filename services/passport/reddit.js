//REDDIT STUFF
const passport = require("./index");
const request = require("request");

var redditComments;
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//REDDIT strategy
let { REDDIT_SECRET, REDDIT_ID } = process.env;
const RedditStrategy = require("passport-reddit").Strategy;

passport.use(
  new RedditStrategy(
    {
      clientID: "M_CjzCy_nwHgAA",
      clientSecret: REDDIT_SECRET,
      callbackURL: "http://localhost:3000/auth/reddit/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      // User.findOrCreate({ redditId: profile.id }, function(err, user) {
      //   return done(err, user);
      // });
      console.log(profile);
      console.log(profile.comments);
      let newUrl =
        "https://www.reddit.com/user/" + profile.name + "/comments.json";
      console.log(newUrl);
      let comments = new Promise(function(resolve) {
        request.get(newUrl, (req, res) => {
          console.log(JSON.parse(res.body));

          return resolve(JSON.parse(res.body));
        });
      }).then(returnedData => {
        redditComments = returnedData.data.map(i => i.children);

        console.log(redditComments);
        return done(null, redditComments);
      });
      //done(null);
    }
  )
);
