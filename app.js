const express = require("express");
const expressHbs = require("express-handlebars");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();

const hbs = expressHbs.create({
  extname: ".hbs",
  partialsDir: "views/",
  defaultLayout: "main"
});
app.set("view engine", "hbs");
app.engine("hbs", hbs.engine);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.secret || "imasecretshhhhhhh",
    resave: false,
    saveUninitialized: false
  })
);

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

// passport
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

// set currentUser
app.use((req, res, next) => {
  if (req.user) res.locals.currentUser = req.user;
  next();
});

const facebookStrategy = require("./strategies/facebook");
passport.use(facebookStrategy);

// routes
const indexRouter = require("./routers/indexRouter");
app.use("/", indexRouter);

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
