require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");
const expressHandlebars = require("express-handlebars");
const morgan = require("morgan");
const morganToolKit = require("morgan-toolkit")(morgan);
const flash = require("express-flash");
const hbs = expressHandlebars.create({
  partialsDir: "views/partials",
  defaultLayout: "application"
});
const mongoose = require("mongoose");
const FacebookStrategyInit = require("./services/facebook");
const loginRouter = require("./routers/login");
const passportRouter = require("./routers/passport");
const passport = require("passport");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(`${__dirname}/public`));
app.use(morgan("tiny"));
app.use(morganToolKit());
app.use(methodOverride(getPostSupport.callback, getPostSupport.options));
app.use(
  expressSession({
    secret: "stephanieiscool",
    resave: false,
    saveUninitialized: true
  })
);

app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require("./mongo")().then(() => next());
  }
});

app.use(passport.initialize());
app.use(passport.session());

FacebookStrategyInit();

app.get("/auth/facebook", passport.authenticate("facebook"));

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login"
  })
);

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.get("/", (req, res) => {
  res.redirect("/login");
});

app.use("/login", loginRouter);
app.use("/passport", passportRouter);

const port = process.env.PORT || process.argv[2] || 3000;
const host = "localhost";
let args;
process.env.NODE_ENV === "production" ? (args = [port]) : (args = [port, host]);
args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});
app.listen.apply(app, args);

module.exports = app;
