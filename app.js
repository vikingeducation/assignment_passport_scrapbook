const app = require("express")();
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const expressHandlebars = require("express-handlebars");

app.use(bodyParser.urlencoded({
    extended: false
}));
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

const passport = require("passport");
app.use(passport.initialize());
app.use(passport.session());

const FacebookStrategy = require("passport-facebook").Strategy;
const User = require("./models").User;
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id)
        .then((user) => {
            done(null, user);
        })
        .catch((err) => {
            done(err);
        });
});

passport.use(
    new FacebookStrategy({
            clientID: process.env.FACEBOOK_APP_ID,
            clientSecret: process.env.FACEBOOK_APP_SECRET,
            callbackURL: process.env.FACEBOOK_CALLBACK_URL || "http://localhost:3000/auth/facebook/callback"
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOrCreate({
                    facebookId: profile.id
                })
                .then(user => {
                    done(null, user);
                })
                .catch(err => {
                    done(err);
                });
        })
);



app.get('/auth/facebook', passport.authenticate("facebook"));

app.get("/auth/facebook/callback", passport.authenticate("facebook", {
    successRedirect: "/",
    failureRedirect: "/login"
}));

app.get('/', function(req, res) {
    res.render("home");
});

app.get('/login', function(req, res) {
    res.render("login");
});


app.listen(process.env.PORT || 3000, () => {
    console.log("taking calls");
});
