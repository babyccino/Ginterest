const	DbConfig = require('./../config/database'),
			Mongoose = require('mongoose'),
			User = require('./user');
Mongoose.connect(DbConfig.database);

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

PostSchema.methods.toJSON = async function() {
  return this.toJSONFor(await User.findById(this.userId).exec());
};

PostSchema.methods.toJSONFor = function(_user) {
	if (!_user) throw new Error("User undefined")

  return {
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

// create the model for users and expose it to our app
module.exports = Mongoose.model('Post', PostSchema);