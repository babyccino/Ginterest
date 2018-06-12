const User = require('./../models/user'),
			Post = require('./../models/post'),
			sendError = require('./../util/sendError');

module.exports.posts = async (req, res) => {
	try {
		const limit = req.query.limit ? parseInt(req.query.limit) : null;
		if (req.query.id || req.query.username) {
			let userQuery = {};
			if (req.query.id) userQuery._id = req.query.id;
			else userQuery['twitter.username'] = req.query.username;
			// console.log('req.query: ', req.query);
			// console.log('query: ', query);

			const user = await User.findOne(userQuery)
				.select({id: 1, twitter: 1})
				.exec();
			if (!user) throw {message: "User not found", status: 404};
	
			let postQuery = {},
					posts;
			if (req.query.before) postQuery.createdAt = {"$lt": req.query.before};
			if (limit)
				posts = await Post.find(postQuery)
					.byUserId(user.id)
					.sort('-createdAt')
					.limit(limit)
					.exec();
			else
				posts = await Post.find(postQuery)
					.byUserId(user.id)
					.sort('-createdAt')
					.exec();
			
			if (!posts)	throw {message: "Error finding posts", status: 404};
	
			const result = posts.map(post => post.toJSONFor(user))
			// console.log(result);
			return res.status(200).json(result)
	
		}	else {
			return res.status(200).json(await Post.allJSON(limit, req.query.before));
		}
	} catch(err) {
		sendError(err, res);
	}
}
