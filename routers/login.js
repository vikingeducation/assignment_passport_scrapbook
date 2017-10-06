var express = require("express");
var router = express.Router();

//mongoose
const mongoose = require("mongoose");
var models = require("./../models");
var User = mongoose.model("User");
const {
  createSignedSessionId,
  loginMiddleware,
  loggedInOnly,
  loggedOutOnly
} = require("../services/sessions");

module.exports = app => {
  router.get("/", loggedOutOnly, (req, res) => {
    res.render("login/start");
  });

  router.post("/login", (req, res) => {
    User.find({ username: req.body.username }).then(user => {
      if (user.length === 0) {
        var newUser = new User({
          username: req.body.username,
          password: req.body.password
        });
        newUser.save(function(err) {
          if (err) {
            console.log("Err");
            res.redirect("back");
          } else {
            console.log("--Saved--");
            res.locals.user = req.body.username;
            const sessionId = createSignedSessionId(req.body.username);
            res.cookie("sessionId", sessionId);
            res.redirect("/");
          }
        });
      } else {
        if (user[0].validatePassword(req.body.password)) {
          res.locals.user = req.body.username;
          const sessionId = createSignedSessionId(req.body.username);
          res.cookie("sessionId", sessionId);
          res.redirect("/");
        } else {
          var error = true;
          res.render("login/start", { error });
        }
      }
    });
  });

  router.get("/login", loggedInOnly, (req, res) => {
    res.redirect("/passport");
  });

  app.get("/logout", (req, res) => {
    res.cookie("sessionId", "");
    res.redirect("/");
  });
  return router;
};
