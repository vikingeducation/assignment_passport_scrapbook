const Twitter = require("twitter");

const api = {};

// twitter stuff
api.getSomeTweets = async req => {
	var client = new Twitter({
		consumer_key: process.env.TWITTER_CONSUMER_KEY,
		consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
		access_token_key: req.user.twitterToken,
		access_token_secret: req.user.twitterTokenSecret
	});

	var favTweets = await client.get("statuses/user_timeline", {
		user_id: req.user.twitterId
	});

	return favTweets.map(el => ({ name: el.user.screen_name, text: el.text }));
	// console.log("favTweets", JSON.stringify(favTweets, 0, 2));
};

module.exports = api;
