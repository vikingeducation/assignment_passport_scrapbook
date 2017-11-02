const express = require("express");
const app = express();

// .env
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Templates
const expressHandlebars = require("express-handlebars");
const hbs = expressHandlebars.create({
  partialsDir: "views/",
  defaultLayout: "application",
  helpers: require("./helpers")
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Static Files
app.use(express.static(`${__dirname}/public`));

// Post Data
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Session
const expressSession = require("express-session");
app.use(
  expressSession({
    resave: false,
    saveUninitialized: true,
    secret: "asdf;werxcklj;jxcvui3qksf;"
  })
);

// Flash
const flash = require("express-flash-messages");
app.use(flash());

// Log Request Info
const morgan = require("morgan");
const morganToolkit = require("morgan-toolkit")(morgan);
app.use(morganToolkit());

// Method Overriding
const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");
app.use(methodOverride(getPostSupport.callback, getPostSupport.options));

// Connect to the Database
const mongoose = require("mongoose");
app.use(async (req, res, next) => {
  try {
    if (!mongoose.connection.readyState) await require("./mongo")();
    next();
  } catch (error) {
    next(error);
  }
});

// Authentication Middleware
require("./passport")(app);

// Routes
app.use("/", require("./routes"));

// Error Handler
app.use((err, req, res, next) => {
  console.error("Error: ", err);
  res.status(500).render("error");
});

// Set up port/host
const port = process.env.PORT || process.argv[2] || 3000;
const host = "localhost";
const hi = () => console.log(`Listening: http://${host}:${port}`);
let args = process.env.NODE_ENV === "production" ? [port] : [port, host, hi];

// Fire it up!
app.listen(...args);
