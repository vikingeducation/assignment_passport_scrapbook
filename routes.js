const express = require("express");
const router = express.Router();
const authRouter = express.Router();
const h = require("./helpers");
const passport = require("passport");
const authenticate = passport.authenticate.bind(passport);

// Authentication Middleware
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.redirect(h.loginPath());
};

// Passport Routes
router.use("/auth", authRouter);
const redirectOpts = { successRedirect: "/", failureRedirect: h.loginPath() };

authRouter.get("/facebook", authenticate("facebook"));
authRouter.get(
  "/facebook/callback",
  authenticate("facebook", { ...redirectOpts, scope: ["user_photos"] })
);

authRouter.get("/github", authenticate("github"));
authRouter.get(
  "/github/callback",
  authenticate("github", { ...redirectOpts, scope: ["user:email"] })
);

authRouter.get("/twitter", authenticate("twitter"));
authRouter.get("/twitter/callback", authenticate("twitter", redirectOpts));

// User Routes
router.get("/", ensureAuthenticated, (req, res) => {
  res.render("index", { user: req.user });
});

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) console.error(err);
    res.redirect(h.loginPath());
  });
});

module.exports = router;
