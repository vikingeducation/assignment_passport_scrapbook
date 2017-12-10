//GET /users/:username/repos
const GitHubApi = require('github');

const github = new GitHubApi({
  headers: {
    'user-agent': 'something custom'
  }
});

github.authenticate({
  type: 'oauth',
  key: process.env.GITHUB_CLIENT_ID,
  secret: process.env.GITHUB_CLIENT_SECRET
});

const GithubService = {
  getRepoInfo: username => {
    return github.repos.getForUser({
      username: username,
      sort: 'updated',
      per_page: 5
    });
  }
};

module.exports = GithubService;
