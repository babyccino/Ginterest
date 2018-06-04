const User = require('./../models/user'),
			Post = require('./../models/post');
			sendError = require('./../util/sendError');

module.exports.posts = async (req, res) => {
	try {
		if (req.query.id || req.query.username) {
			let query = {};
			if (req.query.id) query._id = req.query.id;
			else query['twitter.username'] = req.query.username;
			// console.log('req.query: ', req.query);
			// console.log('query: ', query);
	
			const user = await User.findOne(query)
				.select({id: 1, twitter: 1})
				.exec();
			if (!user) throw new Error("User not found");
	
			const posts = await Post.find()
				.byUserId(user.id)
				.sort('-createdAt')
				.exec();
			if (!posts)	throw new Error("Error finding posts");
	
			const result = posts.map(post => post.toJSONFor(user))
			// console.log(result);
			return res.json(result)
	
		}	else {
			res.json(await Post.allJSON());
		}
	} catch(err) {
		sendError(err, res);
	}
}
