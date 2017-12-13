const FB = require("fb");

const api = {};

// Facebook Stuff
api.getFbPhotos = async req => {
	var photos = await FB.api("me/photos", {
		fields: "picture",
		access_token: req.user.facebookToken
	});
	console.log("photos", JSON.stringify(photos, 0, 2));
};

module.exports = api;
