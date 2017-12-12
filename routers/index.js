const express = require("express");
const app = express();
const router = express.Router();
const { User } = require("../models");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

router.get("/", (req, res) => {
  req.flash("Hi!");
  res.render("welcome/home");
});

router.post("/", async (req, res) => {
  try {
    let newUser = new User({
      email: req.body.email,
      password: req.body.password
    });
    newUser.save();
  } catch (e) {}
});

module.exports = router;
