const router = require("express").Router();
const passport = require("passport")



router.get("/github", authGithub());

router.get("/github/callback", authGithubCallback());


function authGithub (){
  return passport.authenticate('github', {scope: ['user:email']})
}

function authGithubCallback (){
  return passport.authenticate('github', { failureRedirect: '/login' }, (req, res)=>{
    res.redirect('/')
  })
}

module.exports = router