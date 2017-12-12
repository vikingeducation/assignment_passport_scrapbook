var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
const expressSession = require("express-session");
const models = require("./models/");
const User = models.User;

var index = require("./routes/index");
var users = require("./routes/users");
const facebook = require("./routes/facebook.js");
const login = require("./routes/login");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

app.use(
  expressSession({
    secret: process.env.secret || "keyboard cat",
    saveUninitialized: false,
    resave: false
  })
);
// require Passport and the Local Strategy
const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

var mongoose = require("mongoose");
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")().then(() => next());
  }
});

app.use((req, res, next) => {
  console.log(req.session.passport, req.path);
  next();
});

app.use((req, res, next) => {
  if (req.session.passport) {
    if (req.session.passport.user) {
      next();
    } else {
      console.log("this should never go");
    }
  } else if (req.path === "/login" || /^auth/.test(req.path.substring(1))) {
    next();
  } else {
    res.redirect("/login");
  }
  // console.log(req.session.passport, req.path);
  // if (
  //   req.session.passport.user ||
  //   req.path === "/login" ||
  //   req.path === "/auth/facebook"
  // ) {
  //   next();
  // } else {
  //   res.redirect("/login");
  // }
});
app.use("/", index);
app.use("/users", users);
app.use("/auth/facebook", facebook);
app.use("/login", login);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
