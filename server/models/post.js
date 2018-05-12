const DbConfig = require('./../config/database'),
			Mongoose = require('mongoose');
Mongoose.connect(DbConfig.database);

let postSchema = Mongoose.Schema({
	userId: {
		type: Mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},
	title: {
		type: String,
		required: true
	},
	body: {
		type: String,
		required: false
	},
	url: {
		type: String,
		required: true
	}
}, {
	timestamps: true,
	versionkey: false
});

// create the model for users and expose it to our app
module.exports = Mongoose.model('Post', postSchema);