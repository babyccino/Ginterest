const	DbConfig = require('./../config/database'),
			Mongoose = require('mongoose'),
			User = require('./user');

let PostSchema = Mongoose.Schema({
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

// schema methods

PostSchema.methods.toJSON = async function() {
  return this.toJSONFor(await User.findById(this.userId).exec());
};

PostSchema.methods.toJSONFor = function(_user) {
	if (!_user) throw new Error("User undefined")

  return {
  	id: this.id,
  	userId: this.userId,
    title: this.title,
    body: this.body,
    url: this.url,
		twitter: {
			username: _user.twitter.username,
			displayUrl: _user.twitter.displayUrl
		},
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// query helpers

PostSchema.query.byUserId = function(id) {
	return this.find({userId: id});
}

// model methods

PostSchema.statics.all = function(count, before) {
	let query = {};
	if (before) {
		if (before instanceof String)
			before = new Date(before);

		query.createdAt = {"$lt": before};
	}

	if (count)
		return this.find(query).sort('-createdAt').limit(count).exec();
	else
		return this.find(query).sort('-createdAt').exec();
}

PostSchema.statics.allJSON = async function(count, before) {
	const posts = await this.all(count, before);
	return Promise.all(posts.map(post => post.toJSON()));
}

// create the model for users and expose it to our app
module.exports = Mongoose.model('Post', PostSchema);