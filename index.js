const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');

const Promise = require('bluebird');
mongoose.Promise = Promise;

// Requiring middleware
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
const expressSession = require('express-session');
const flash = require('express-flash');
const exphbs = require('express-handlebars');
const index = require('./routes/index');
const auth = require('./routes/auth');

// Mounting middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());
app.use(
	expressSession({
		secret: process.env.secret || 'keyboard cat',
		saveUninitialized: false,
		resave: false
	})
);

const hbs = exphbs.create({
	defaultLayout: 'main'
});
app.engine('handlebars', hbs.engine);

// Change view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'handlebars');

// require Passport and the Local Strategy
const passport = require('passport');
const authStrategies = require('./auth_strategies');
passport.use(authStrategies.github);
passport.use(authStrategies.reddit);
passport.serializeUser(authStrategies.serializeUser);
passport.deserializeUser(authStrategies.deserializeUser);

app.use(passport.initialize());
app.use(passport.session());

const middleWare = require('./middleware');
app.use(middleWare.database.persist);
app.use('/', middleWare.login.authenticatedOnly, index);
app.use('/oauth', auth);

// error handler
app.use(middleWare.error.notFound);
app.use(middleWare.error.handler);

app.use(middleWare.database.exit);

app.listen(3000, () => {
	console.log('Listening...');
});
