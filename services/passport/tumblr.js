// fb secret id
const passport = require("./index");
const request = require("request");

var userTumblr;
var tumblrLikes;
var newLikes;
var userAccessTokenTumblr;
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//fb strategy
let { FB_ID, FB_SECRET, TUMBLR_ID, TUMBLR_SECRET } = process.env;
const TumblrStrategy = require("passport-Tumblr").Strategy;

passport.use(
  new TumblrStrategy(
    {
      consumerKey: TUMBLR_ID,
      consumerSecret: TUMBLR_SECRET,
      callbackURL: "http://localhost:3000/auth/tumblr/callback"
    },
    function(token, tokenSecret, profile, done) {
      userAccessTokenTumblr = TUMBLR_ID;
      userTumblr = profile;
      console.log(profile);
      console.log(userAccessTokenTumblr);
      let newUrl =
        "https://api.tumblr.com/v2/blog/" +
        profile.username +
        ".tumblr.com/likes?api_key=" +
        userAccessTokenTumblr;

      tumblrLikes = new Promise(function(resolve) {
        request.get(newUrl, (req, res) => {
          return resolve(JSON.parse(res.body).response.liked_posts);
        });
      }).then(returnedData => {
        newLikes = returnedData.map(i => i.blog_name);
        console.log(newLikes);
        return done(null, newLikes);
      });
    }
  )
);
module.exports = { newLikes };
