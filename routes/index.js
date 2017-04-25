const express = require("express");
const router = express.Router();
const {
    loggedInOnly,
    loggedOutOnly
} = require("../services/session");

router.get("/", loggedInOnly, function(req, res, next) {
    //search for by facebookId
    req.user.getAccounts()
        .then((accounts) => {
            res.render("home", {
                accounts
            });
        })
        .catch(next);

});

router.get("/login", loggedOutOnly, function(req, res) {
    res.render("login");
});

router.use("/logout", loggedInOnly, function(req, res) {
    res.redirect("/login");
});

module.exports = router;
