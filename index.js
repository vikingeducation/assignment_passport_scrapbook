const express = require('express');
const app = express();

// ----------------------------------------
// Dot Env
// ----------------------------------------
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// ----------------------------------------
// Body Parser
// ----------------------------------------
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

// ----------------------------------------
// Flash Messages
// ----------------------------------------
const flash = require('express-flash-messages');
app.use(flash());

// ----------------------------------------
// Method Override
// ----------------------------------------
app.use((req, res, next) => {
  let method;
  if (req.query._method) {
    method = req.query._method;
    delete req.query._method;
  } else if (typeof req.body === 'object' && req.body._method) {
    method = req.body._method;
    delete req.body._method;
  }

  if (method) {
    method = method.toUpperCase();
    req.method = method;
  }

  next();
});

// ----------------------------------------
// Sessions/Cookies
// ----------------------------------------
const cookieSession = require('cookie-session');
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET || 'asdf1234567890qwer']
}));

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// ----------------------------------------
// Static Public Files
// ----------------------------------------
app.use(express.static(`${__dirname}/public`));

// ----------------------------------------
// ----------------------------------------
const morgan = require('morgan');
app.use(morgan('tiny'));
app.use((req, res, next) => {
  ['query', 'params', 'body'].forEach((key) => {
    if (req[key]) {
      let capKey = key[0].toUpperCase() + key.substr(1);
      let value = JSON.stringify(req[key], null, 2);
    }
  });
  next();
});

// ----------------------------------------
// Mongoose
// ----------------------------------------
const mongoose = require('mongoose');
const models = require('./models');
const User = models.User;

app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require('./mongo')().then(() => next());
  }
});


// ----------------------------------------
// Template Engine
// ----------------------------------------
const expressHandlebars = require('express-handlebars');
const h = require('./helpers').registered;

const hbs = expressHandlebars.create({
  helpers: h,
  partialsDir: 'views/',
  defaultLayout: 'application'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// ----------------------------------------
// Passport
// ----------------------------------------
const passport = require("passport");
const {
  fbStrategy,
  igStrategy,
  ghStrategy,
  twitterStrategy,
  spotStrategy } = require('./services/strategies');
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(fbStrategy);
passport.use(igStrategy);
passport.use(ghStrategy);
passport.use(twitterStrategy);
passport.use(spotStrategy);

// ----------------------------------------
// Routes
// ----------------------------------------
const auth = require('./routes/auth');
const { getUserScrapbook } = require('./services/apis');
app.use('/auth', auth);
app.get("/", (req, res) => {
  if (req.user && req.user.email) {
    getUserScrapbook(req.user)
      .then(data => {
        res.render("home", { user: req.user, data });
      });
  } else {
  }
});

// ----------------------------------------
// Server
// ----------------------------------------
const port = process.env.PORT ||
             process.argv[2] ||
             4000;
const host = 'localhost';

let args;
process.env.NODE_ENV === 'production' ?
                          args = [port] :
                          args = [port, host];

args.push(() => {
});

app.listen.apply(app, args);

module.exports = app;