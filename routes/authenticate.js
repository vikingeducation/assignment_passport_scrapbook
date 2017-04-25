const express = require("express");
const router = express.Router();

module.exports = passport => {
    router.get(
        "/facebook",
        passport.authenticate("facebook", {
            scope: "email"
        })
    );

    router.get(
        "/facebook/callback",
        passport.authenticate("facebook", {
            successRedirect: "/",
            failureRedirect: "/login"
        })
    );

    router.get(
        "/twitter",
        passport.authenticate("twitter", {
            scope: "email"
        })
    );

    router.get(
        "/twitter/callback",
        passport.authenticate("twitter", {
            successRedirect: "/",
            failureRedirect: "/login"
        })
    );
    return router;
};
