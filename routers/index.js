const express = require("express");
const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  req.flash("Hi!");
  res.render("welcome/home");
});

module.exports = router;
