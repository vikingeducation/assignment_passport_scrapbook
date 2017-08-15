const app = require("express")();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const flash = require("express-flash");

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

// fb secret id
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
let { FB_ID, FB_SECRET } = process.env;

// Local Strat for later
// const passport = require("passport");
// app.use(passport.initialize());
// app.use(passport.session());

//FB Strategy

let handlebars = require("express-handlebars");
var hbs = handlebars.create({ defaultLayout: "main" });
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

let port = 3000;
app.listen(port, (res, req) => {
  console.log(`running on ${port}`);
});
