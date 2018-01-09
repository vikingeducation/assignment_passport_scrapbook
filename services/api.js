const rp = require('request-promise');
const Twitter = require('twitter');

function _getFacebookData(user) {
  if (user.facebook.id) {
    const options = {
      uri: `https://graph.facebook.com/${user.facebook.id}/likes`,
      qs: {
        access_token: user.facebook.accessToken
      },
      headers: {
        'User-Agent': 'Request-Promise'
      },
      json: true
    };

    return rp(options);
  }
}

function _getTwitterData(user) {
  if (user.twitter.id) {
    const client = new Twitter({
      consumer_key: process.env.TWITTER_CONSUMER_KEY,
      consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
      access_token_key: user.twitter.token,
      access_token_secret: user.twitter.tokenSecret
    });
    const params = { user_id: user.twitter.id, count: 5 };

    return client.get('/statuses/home_timeline', params);
  }
}

function _getGitHubData(user) {
  if (user.github.id) {
    const options = {
      uri: `https://api.github.com/users/${
        user.github.username
      }/repos?sort=created&per_page=5`,
      qs: {
        access_token: user.github.accessToken
      },
      headers: { 'User-Agent': 'Request-Promise' },
      json: true
    };

    return rp(options);
  }
}

function _getSpotifyData(user) {
  if (user.spotify.id) {
    const options = {
      uri: 'https://api.spotify.com/v1/me/playlists',
      qs: {
        access_token: user.spotify.accessToken
      },
      headers: { 'User-Agent': 'Request-Promise' },
      json: true
    };

    return rp(options);
  }
}

async function getAllData(user) {
  let data = {};

  data.facebook = await _getFacebookData(user);
  data.twitter = await _getTwitterData(user);
  data.github = await _getGitHubData(user);
  data.spotify = await _getSpotifyData(user);

  return data;
}

module.exports = { getAllData };
