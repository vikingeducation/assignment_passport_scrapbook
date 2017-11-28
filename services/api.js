const Twitter = require("twitter");
const Github = require("github");
const github = new Github({ Promise: require("bluebird") });

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

// github stuff
api.getRepos = async req => {
	await github.authenticate({ type: "oauth", token: req.user.githubToken });
	var userrepos = await github.repos.getForUser({
		username: req.user.githubUsername,
		sort: "created",
		per_page: 6
	});
	console.log("userrepos", JSON.stringify(userrepos, 0, 2));

	return userrepos.data.map(el => el.name);
};

module.exports = api;
