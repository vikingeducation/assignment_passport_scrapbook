require("dotenv").config();
const express = require("express");
const app = express();
// ----------------------------------------
// Handlebars
// ----------------------------------------
const expressHbs = require("express-handlebars");
const hbs = expressHbs.create({
  extname: ".hbs",
  partialsDir: "views/",
  defaultLayout: "main"
});
app.set("view engine", "hbs");
app.engine("hbs", hbs.engine);

// ----------------------------------------
// Body Parser
// ----------------------------------------
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));

// ----------------------------------------
// Redis Sessions
// ----------------------------------------
const session = require("express-session");
const RedisStore = require("connect-redis")(session);
app.use(
  session({
    store: new RedisStore(),
    secret: "shhhhiamsosecret",
    saveUninitialized: false,
    resave: false
  })
);

// ----------------------------------------
// Cookie Parser
// ----------------------------------------
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// ----------------------------------------
// Serve Public Folder
// ----------------------------------------
app.use(express.static(__dirname + "/public"));

// ----------------------------------------
// Logging
// ----------------------------------------
var morgan = require("morgan");
app.use(morgan("tiny"));
app.use((req, res, next) => {
  ["query", "params", "body"].forEach(key => {
    if (req[key]) {
      var capKey = key[0].toUpperCase() + key.substr(1);
      var value = JSON.stringify(req[key], null, 2);
      console.log(`${capKey}: ${value}`);
    }
  });
  next();
});

// ----------------------------------------
// Mongoose
// ----------------------------------------
var mongoose = require("mongoose");
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")(req).then(() => next());
  }
});

// ----------------------------------------
// Passport
// ----------------------------------------
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

const User = require("./models/User");
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

const facebookStrategy = require("./strategies/facebook");
passport.use(facebookStrategy);
const twitterStrategy = require("./strategies/twitter");
passport.use(twitterStrategy);
const githubStrategy = require("./strategies/github");
passport.use(githubStrategy);

// ----------------------------------------
// currentUser
// ----------------------------------------
app.use((req, res, next) => {
  if (req.user) res.locals.currentUser = req.user;
  next();
});

// ----------------------------------------
// Connections Cookie
// ----------------------------------------
app.use((req, res, next) => {
  req.connections = req.cookies.connections ? req.cookies.connections : {};
  next();
});

// ----------------------------------------
// Routes
// ----------------------------------------
const indexRouter = require("./routers/indexRouter");
app.use("/", indexRouter);

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
