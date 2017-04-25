const app = require("express")();
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const expressHandlebars = require("express-handlebars");

const mongoose = require("mongoose");
app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    mongoose.connect("mongodb://localhost/test").then(() => {
      // cleanDb().then(() => {
      next();
      // })
    });
  }
});

app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(
  expressSession({
    secret: process.env.secret || "puppies",
    saveUninitialized: false,
    resave: false
  })
);

var hbs = expressHandlebars.create({
  partialsDir: "views/",
  defaultLayout: "main"
});
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

let passport = require("./services/passports")(app);

const authenticateRouter = require("./routes/authenticate")(passport);
const indexRouter = require("./routes/index");
app.use("/auth/", authenticateRouter);
app.use("/", indexRouter);

app.listen(process.env.PORT || 3000, () => {
  console.log("taking calls");
});
