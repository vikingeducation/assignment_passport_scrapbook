var express = require("express");
var router = express.Router();
var FB = require('fb');

/* GET home page. */
router.get("/", async (req, res, next) => {
  const user = await User.findById(req.session.passport.user);

  FB.api(
    "/{user-id}/photos",
    function (response) {
      if (response && !response.error) {

      }
    }
  );


  res.render("index", { title: "Express" });
});

module.exports = router;
