const app = require("express")();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const flash = require("express-flash");
const passport = require("passport");
var userFacebook;
var userAccessTokenFacebook;
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

//FB Strategy

let handlebars = require("express-handlebars");
var hbs = handlebars.create({ defaultLayout: "main" });
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// fb secret id
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

//fb strategy
let { FB_ID, FB_SECRET } = process.env;
const FacebookStrategy = require("passport-facebook").Strategy;

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
app.get("/login", (req, res) => {
  return res.render("index");
});

let port = 3000;
app.listen(port, (res, req) => {
  console.log(`running on ${port}`);
});
