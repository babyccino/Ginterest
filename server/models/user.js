const DbConfig = require('./../config/database'),
			Mongoose = require('mongoose');
Mongoose.connect(DbConfig.database);

let userSchema = Mongoose.Schema({
	twitter: {
		id: {
			type: String,
			required: true
		},
		token: {
			type: String,
			required: true
		},
		displayName: {
			type: String,
			required: true
		},
		username: {
			type: String,
			required: true
		},
		displayUrl: {
			type: String,
			required: true
		}
	}
});

// create the model for users and expose it to our app
module.exports = Mongoose.model('User', userSchema);