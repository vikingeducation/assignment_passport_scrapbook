const app = require('express')();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const flash = require('express-flash');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());
app.use(
  expressSession({
    secret: process.env.secret || 'kittens',
    saveUninitialized: false,
    resave: false
  })
);

const morgan = require('morgan');
app.use(morgan('tiny'));

const mongoose = require('mongoose');
const models = require('./models');
const User = mongoose.model('User');

app.use((req, res, next) => {
  if (mongoose.connection.readyState) {
    next();
  } else {
    require('./mongo')().then(() => next());
  }
});

const expressHandlebars = require('express-handlebars');

const hbs = expressHandlebars.create({
  partialsDir: 'views/',
  defaultLayout: 'application'
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const passport = require('passport');
const {
  facebookStrategy,
  twitterStrategy,
  githubStrategy,
  spotifyStrategy
} = require('./services/strategies');

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

passport.use(facebookStrategy);
passport.use(twitterStrategy);
passport.use(githubStrategy);
passport.use(spotifyStrategy);

const authRoutes = require('./controllers/auth');
const { getAllData } = require('./services/api');
const accounts = ['facebook', 'twitter', 'github', 'spotify'];

app.use('/auth', authRoutes);
app.get('/', (req, res) => {
  if (req.user) {
    const connectedAccounts = accounts.filter(n =>
      Object.keys(req.user._doc).includes(n)
    );
    getAllData(req.user).then(data => {
      res.render('home', {
        user: req.user,
        data,
        connections: connectedAccounts.length
      });
    });
  } else {
    res.redirect('/auth/login');
  }
});

const port = process.env.PORT || process.argv[2] || 4000;
const host = 'localhost';

let args;
process.env.NODE_ENV === 'production' ? (args = [port]) : (args = [port, host]);

args.push(() => {
  console.log(`Listening: http://${host}:${port}`);
});

app.listen.apply(app, args);

module.exports = app;
