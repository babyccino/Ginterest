const User = require('./../models/user'),
			Mongoose = require('mongoose'),
			Post = require('./../models/post');

const testUsers = [
				{
					_id : "5b0ab85fcfe0e825a6cc33d0",
					twitter : {
						id : "845180875704692737",
						token : "845180875704692737-9OWnm60RtkLD9rnGEprKAc5VHrP3oih",
						username : "babyccino1",
						displayName : "Gus Ryan",
						displayUrl : "https://pbs.twimg.com/profile_images/942947061225340928/z3yRZv3i_normal.jpg"
					}
				},
				{
					_id : "5b0ab85fcfe0e825a6cc33d1",
					twitter : {
						id : "845180875704692738",
						token : "845180875704692737-9OWnm60RtkLD9rnGEprKAc5VHrP3oii",
						username : "babyccino2",
						displayName : "Sug Ryan",
						displayUrl : "https://pbs.twimg.com/profile_images/942947061225340928/z3yRZv3a_normal.jpg"
					}
				}
			],
			testPosts = [
				{
					_id : "5b0ab85fcfe0e825a6cc33d2",
					userId : "5b0ab85fcfe0e825a6cc33d0",
					title : "hi",
					url : "https://i.redditmedia.com/lM1GpuB5WhuKzk8twat0AuGxJMSE3tjGnKa5XBHs1e4.jpg?fit=crop&crop=faces%2Centropy&arh=2&w=640&s=3baf4018b19dfc74657fd7129c5f5809",
					body : "",
					twitter : {
						username : "babyccino1",
						displayUrl : "https://pbs.twimg.com/profile_images/942947061225340928/z3yRZv3i_normal.jpg"
					}
				},
				{
					_id : "5b0ab85fcfe0e825a6cc33d4",
					userId : "5b0ab85fcfe0e825a6cc33d0",
					title : "hi",
					url : "https://i.redditmedia.com/lM1GpuB5WhuKzk8twat0AuGxJMSE3tjGnKa5XBHs1e4.jpg?fit=crop&crop=faces%2Centropy&arh=2&w=640&s=3baf4018b19dfc74657fd7129c5f5809",
					body : "",
					twitter : {
						username : "babyccino1",
						displayUrl : "https://pbs.twimg.com/profile_images/942947061225340928/z3yRZv3i_normal.jpg"
					}
				},
				{
					_id : "5b0ab85fcfe0e825a6cc33d5",
					userId : "5b0ab85fcfe0e825a6cc33d0",
					title : "hi",
					url : "https://i.redditmedia.com/lM1GpuB5WhuKzk8twat0AuGxJMSE3tjGnKa5XBHs1e4.jpg?fit=crop&crop=faces%2Centropy&arh=2&w=640&s=3baf4018b19dfc74657fd7129c5f5809",
					body : "",
					twitter : {
						username : "babyccino1",
						displayUrl : "https://pbs.twimg.com/profile_images/942947061225340928/z3yRZv3i_normal.jpg"
					}
				},
				{
					_id : "5b0ab85fcfe0e825a6cc33d6",
					userId : "5b0ab85fcfe0e825a6cc33d1",
					title : "hi",
					url : "https://i.redditmedia.com/lM1GpuB5WhuKzk8twat0AuGxJMSE3tjGnKa5XBHs1e4.jpg?fit=crop&crop=faces%2Centropy&arh=2&w=640&s=3baf4018b19dfc74657fd7129c5f5809",
					body : "",
					twitter : {
						username : "babyccino2",
						displayUrl : "https://pbs.twimg.com/profile_images/942947061225340928/z3yRZv3a_normal.jpg"
					}
				},
				{
					_id : "5b0ab85fcfe0e825a6cc33d7",
					userId : "5b0ab85fcfe0e825a6cc33d1",
					title : "hi",
					url : "https://i.redditmedia.com/lM1GpuB5WhuKzk8twat0AuGxJMSE3tjGnKa5XBHs1e4.jpg?fit=crop&crop=faces%2Centropy&arh=2&w=640&s=3baf4018b19dfc74657fd7129c5f5809",
					body : "",
					twitter : {
						username : "babyccino2",
						displayUrl : "https://pbs.twimg.com/profile_images/942947061225340928/z3yRZv3a_normal.jpg"
					}
				},
				{
					_id : "5b0ab85fcfe0e825a6cc33d8",
					userId : "5b0ab85fcfe0e825a6cc33d1",
					title : "hi",
					url : "https://i.redditmedia.com/lM1GpuB5WhuKzk8twat0AuGxJMSE3tjGnKa5XBHs1e4.jpg?fit=crop&crop=faces%2Centropy&arh=2&w=640&s=3baf4018b19dfc74657fd7129c5f5809",
					body : "",
					twitter : {
						username : "babyccino2",
						displayUrl : "https://pbs.twimg.com/profile_images/942947061225340928/z3yRZv3a_normal.jpg"
					}
				}
			];

module.exports.testNewPost = {
	_id : "5b0ab85fcfaaa825a6cc33d9",
	userId : "5b0ab85fcfe0e825a6cc33d1",
	title : "hi",
	url : "https://i.redditmedia.com/lM1GpuB5WhuKzk8twat0AuGxJMSE3tjGnKa5XBHs1e4.jpg?fit=crop&crop=faces%2Centropy&arh=2&w=640&s=3baf4018b19dfc74657fd7129c5f5809",
	body : "",
	twitter : {
		username : "babyccino2",
		displayUrl : "https://pbs.twimg.com/profile_images/942947061225340928/z3yRZv3a_normal.jpg"
	}
};
module.exports.invalidPostId = "5b0ab85fcfe0e825a6cc33a1";
module.exports.invalidUserId = "5b0ab85fcfe0e825a6cc33a2";
module.exports.invalidUsername = "wadup";

module.exports.init = function(done) {
	User.insertMany(testUsers, (err, users) => {
		Post.insertMany(testPosts, (err, post) => {
			Promise.all([
				User.find({}).sort("-createdAt").exec(),
				Post.find({}).sort("-createdAt").exec()
			]).then(res => {
				const users = res[0],
							posts = res[1],
							user1Id = "5b0ab85fcfe0e825a6cc33d0";

				module.exports.allUsers = users;
				module.exports.user1 = users[0].id.toString() === user1Id?users[0]:users[1];
				module.exports.user2 = users[0].id.toString() === user1Id?users[1]:users[0];
				module.exports.postsByUser1 = [];
				module.exports.postsByUser2 = [];

				for (post of posts) {
					if (post.userId.toString() === user1Id) {
						post["twitter"] = {
							username : "babyccino1",
							displayUrl : "https://pbs.twimg.com/profile_images/942947061225340928/z3yRZv3i_normal.jpg"
						}
						module.exports.postsByUser1.push(post);
					} else {
						post["twitter"] = {
							username : "babyccino2",
							displayUrl : "https://pbs.twimg.com/profile_images/942947061225340928/z3yRZv3a_normal.jpg"
						}
						module.exports.postsByUser2.push(post);
					}
				}

				module.exports.allPosts = posts;
				done();
			}).catch(done);
		});
	});
};

module.exports.reInit = (done) => {
	Mongoose.connection.db.dropCollection('Post', () => {
		Mongoose.connection.db.dropCollection('User', () => {
			module.exports.init(done);
		});
	});
};

module.exports.userSelect = {
	id: true,
	twitter : {
		id : true,
		username : true,
		displayName : true,
	}
};
module.exports.userNotSelect = {
	id: false,
	twitter : {
		id : false,
		username : false,
		displayName : false,
	}
};
module.exports.postSelect = {
	id : true,
	userId : true,
};
module.exports.postNotSelect = {
	id : false
};
module.exports.postJSONSelect = {
	id : true,
	userId : true,
	twitter: {
		username: true
	}
};