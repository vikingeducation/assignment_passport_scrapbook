const app = require("express")();
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const flash = require("express-flash");

// User and Mongoose code

const mongoose = require("mongoose");
var models = require("./models");
var User = mongoose.model("User");

// Connect to our mongo server
app.use((req, res, next) => {
	if (mongoose.connection.readyState) {
		next();
	} else {
		require("./mongo")().then(() => next());
	}
});

// cookie and parser
app.use(cookieParser());
app.use(flash());
app.use(bodyParser.urlencoded({ extended: false }));
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

// Local Strategy Set Up
const LocalStrategy = require("passport-local").Strategy;

passport.use(
	new LocalStrategy(function(username, password, done) {
		User.findOne({ username }, function(err, user) {
			console.log(user);
			if (err) return done(err);
			if (!user || !user.validPassword(password))
				return done(null, false, { message: "Invalid username/password" });
			return done(null, user);
		});
	})
);

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, user) {
		done(err, user);
	});
});

// Method Override
const methodOverride = require("method-override");
const getPostSupport = require("express-method-override-get-post-support");
app.use(
	methodOverride(
		getPostSupport.callback,
		getPostSupport.options // { methods: ['POST', 'GET'] }
	)
);

// Logging
var morgan = require("morgan");
var morganToolkit = require("morgan-toolkit")(morgan);
app.use(morganToolkit());

// Set up express-handlebars
const exhbs = require("express-handlebars");
app.engine("handlebars", exhbs({ defaultLayout: "layout" }));
app.set("view engine", "handlebars");

// routes
var loginRouter = require("./routers/login");
app.use("/", loginRouter);

// Start our app
app.listen(3000, () => console.log("listening"));
