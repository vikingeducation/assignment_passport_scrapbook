const Twitter = require('twitter');

const TwitterService = {
  getTweets: user => {
    const twitter = new Twitter({
      consumer_key: process.env.TWITTER_CLIENT_ID,
      consumer_secret: process.env.TWITTER_CLIENT_SECRET,
      access_token_key: user.twitterAccessToken,
      access_token_secret: user.twitterTokenSecret
    });
    return twitter.get('statuses/home_timeline', { count: 5 });
  }
};

module.exports = TwitterService;
