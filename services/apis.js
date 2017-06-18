const rp = require('request-promise');
const Twitter = require('twitter');

const _getFacebookLikes = user => {
  if (user.facebook.id) {
    let options = {
      uri: `https://graph.facebook.com/v2.9/${ user.facebook.id }/likes`,
      qs: {
          access_token: user.facebook.accessToken
      },
      headers: {
          'User-Agent': 'Request-Promise'
      },
      json: true 
    }
    return rp(options);
  }
};

const _getInstagramPhotos = user => {
  if (user.instagram.id) {
    let options =  {
      uri: 'https://api.instagram.com/v1/users/self/media/recent/',
      qs: {
          access_token: user.instagram.accessToken
      },
      headers: {
          'User-Agent': 'Request-Promise'
      },
      json: true 
    }
    return rp(options);
  }
};

const _getGitHubRepos = user => {
  if (user.github.id) {
    let options =  {
      uri: 'https://api.github.com/user/repos',
      qs: {
          access_token: user.github.accessToken
      },
      headers: {
          'User-Agent': 'Request-Promise'
      },
      json: true 
    }
    return rp(options);
  }
};

const _getTweets = user => {
  if (user.twitter.id) {
    let client = new Twitter({
      access_token_key: user.twitter.token,
      access_token_secret: user.twitter.tokenSecret,
      consumer_key: process.env.TWITTER_APP_ID,
      consumer_secret: process.env.TWITTER_APP_SECRET,
    });
    let params = { user_id: user.twitter.id, count: 5 }
    return client.get('statuses/user_timeline', params);
  }
};

const _getSpotifyPlaylists = user => {
  if (user.spotify.id) {
    let options =  {
      uri: 'https://api.spotify.com/v1/me/playlists',
      qs: {
          access_token: user.spotify.accessToken
      },
      headers: {
          'User-Agent': 'Request-Promise'
      },
      json: true 
    }
    return rp(options);
  }
};

const getUserScrapbook = async (user) => {
  let data = {};
  data.facebook = await _getFacebookLikes(user);
  data.instagram = await _getInstagramPhotos(user);
  data.github = await _getGitHubRepos(user);
  data.twitter = await _getTweets(user);
  data.spotify = await _getSpotifyPlaylists(user);
  return data;
};

module.exports = {
  getUserScrapbook
};