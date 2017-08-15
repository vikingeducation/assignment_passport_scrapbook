const mongoose = require('mongoose');
const { User } = require('../models');
const connect = require('../mongo');

(async () => {
	try {
		await connect();

		if (!mongoose.connection.readyState)
			throw Error('Error, no connection made.');
		console.log('Connection successful');

		User.collection.drop();

		const promises = [];
		for (let i = 0; i < 5; i++) {
			promises.push(
				User.create({
					displayName: `Awesome User #${i + 1}`
				})
			);
			console.log('Saving user');
		}

		await Promise.all(promises);
		//console.log(users, 'foo');
		mongoose.disconnect();
	} catch (err) {
		console.error(err.stack);
	}
})();
