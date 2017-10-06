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
  router.get("/", (req, res) => {
    res.render("passport/start");
  });
  return router;
};
