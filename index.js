const express = require('express');
const app = express();
const path = require('path');

// Requiring middleware
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
const expressSession = require('express-session');
const flash = require('express-flash');
const exphbs = require('express-handlebars');
const index = require('./routes/index');

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
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);

app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

app.listen(3000, () => {
	console.log('Listening...');
});
