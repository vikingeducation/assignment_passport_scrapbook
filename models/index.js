const User = require("./models/User");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/passport-demo");

// 2
// const LocalStrategy = require("passport-local").Strategy;
//
// // 3
// passport.use(
//   new LocalStrategy(function(username, password, done) {
//     User.findOne({ username }, function(err, user) {
//       console.log(user);
//       if (err) return done(err);
//       if (!user || !user.validPassword(password)) {
//         return done(null, false, { message: "Invalid username/password" });
//       }
//       return done(null, user);
//     });
//   })
// );

//4
// passport.serializeUser(function(user, done) {
//   done(null, user.id);
// });
//
// passport.deserializeUser(function(id, done) {
//   User.findById(id, function(err, user) {
//     done(err, user);
//   });
//});
