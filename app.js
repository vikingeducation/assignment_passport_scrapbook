const app = require("express")();
const request = require("request");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const flash = require("express-flash");
//storage
var userFacebook;
var userAccessTokenFacebook;
var userTumblr;
var ourTumblr = require("./services/passport/tumblr");
var newLikes;
var userAccessTokenTumblr;

const passport = require("./services/passport");
app.use(passport.initialize());
app.use(passport.session());

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(
  expressSession({
    secret: process.env.secret || "keyboard cat",
    saveUninitialized: false,
    resave: false
  })
);

let handlebars = require("express-handlebars");
var hbs = handlebars.create({ defaultLayout: "main" });
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
var ourTumblr = require("./services/passport/tumblr");
///suggested strat for tumblr

// fb secret id
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//fb strategy
let { FB_ID, FB_SECRET, TUMBLR_ID, TUMBLR_SECRET } = process.env;
const FacebookStrategy = require("passport-facebook").Strategy;
// const TumblrStrategy = require("passport-Tumblr").Strategy;
// passport.use(
//   new TumblrStrategy(
//     {
//       consumerKey: TUMBLR_ID,
//       consumerSecret: TUMBLR_SECRET,
//       callbackURL: "http://localhost:3000/auth/tumblr/callback"
//     },
//     function(token, tokenSecret, profile, done) {
//       userAccessTokenTumblr = TUMBLR_ID;
//       userTumblr = profile;
//       console.log(profile);
//       console.log(userAccessTokenTumblr);
//       let newUrl =
//         "https://api.tumblr.com/v2/blog/" +
//         profile.username +
//         ".tumblr.com/likes?api_key=" +
//         userAccessTokenTumblr;
//
//       tumblrLikes = new Promise(function(resolve) {
//         request.get(newUrl, (req, res) => {
//           return resolve(JSON.parse(res.body).response.liked_posts);
//         });
//       }).then(returnedData => {
//         newLikes = returnedData.map(i => i.blog_name);
//         console.log(newLikes);
//         return done(null);
//       });
//     }
//   )
// );
// passport.serializeUser(function(user, done) {
//   done(null, user);
// });
//
// passport.deserializeUser(function(obj, done) {
//   done(null, obj);
// });

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_ID,
      clientSecret: process.env.FB_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/callback"
    },
    function(accessToken, refreshToken, profile, done) {
      const facebookId = profile.id;
      const displayName = profile.displayName;

      console.log(accessToken);
      // User.findOne({ facebookId }, function(err, user) {
      //   if (err) return done(err);
      //
      //   if (!user) {
      //     // Create a new account if one doesn't exist
      //     user = new User({ facebookId, displayName });
      //     user.save((err, user) => {
      //       if (err) return done(err);
      //       done(null, user);
      //     });
      //   } else {
      //     // Otherwise, return the extant user.
      //     done(null, user);
      //   }
      // });
      /* make the API call */
      // FB.api("/{user-id}/friends", function(response) {
      //   if (response && !response.error) {
      //     /* handle the result */
      //   }
      // });

      userAccessTokenFacebook = accessToken;
      userFacebook = profile;
      done(null);
    }
  )
);
app.get("/auth/tumblr", passport.authenticate("tumblr"));
app.get(
  "/auth/tumblr/callback",
  passport.authenticate("tumblr", {
    successRedirect: "/tumblrLikes",
    failureRedirect: "/tumblrLikes"
  })
);
app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);
// app.post(
//   "/login",
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//     failureFlash: true
//   })
// );

//
app.get("/", (req, res) => {
  return res.render("index");
});
app.get("/tumblrlikes", (req, res) => {
  console.log(req.session.passport.user);
  let tumblrlikes = req.session.passport.user;
  //this is calling tumblr likes
  return res.render("tumblrlikes", { tumblrlikes });
});
app.get("/login", (req, res) => {
  return res.render("index");
});

let port = 3000;
app.listen(port, (res, req) => {
  console.log(`running on ${port}`);
});
