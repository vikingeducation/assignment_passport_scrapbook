const Linkedin = require('node-linkedin')(
  process.env.LINKEDIN_CLIENT_ID,
  process.env.LINKEDIN_CLIENT_SECRET,
  'http://localhost:3000/login/auth/linkedin/callback'
);

const GithubService = {
  getProfileInfo: user => {
    const linkedin = Linkedin.init(user.linkedinAccessToken);
    return new Promise((resolve, reject) => {
      linkedin.people.me(function(err, $in) {
        if (err) reject(err);
        resolve($in);
      });
    });
  }
};

module.exports = GithubService;
