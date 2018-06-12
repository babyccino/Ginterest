const User = require('./../models/user'),
			Post = require('./../models/post'),
			isURL = require('./../util/isUrl'),
			sendError = require('./../util/sendError');

module.exports.newPost = async (req, res, next) => {
	try {
		let post = req.body,
				user = req.user;
		// console.log('Post: ', post);
		if (!post.title || (post.title === "")) {
			// console.log('Post: ', post);
			throw {message: "Bad post title", status: 400};
		} else if (!post.url || (post.url === "")) {
			// console.log('Post: ', post);
			throw {message: "Bad post URI", status: 400};
		} else if (!isURL(post.url)) {
			// console.log('Post: ', post);
			throw {message: "Post image URL not URL", status: 400};
		} else if (!user || (user._id.toString() !== post.userId)) {
			// console.log('User: ', user);
			// console.log('Post: ', post);
			throw {message: "Bad session user data", status: 400};
		} else {
			const foundUser = await User.findById(user._id)
				.select({_id: 1, twitter: 1})
				.exec();
			if (!foundUser) throw {message: "user not found", status: 404};

			let newPost					= new Post();
					newPost.userId	= foundUser._id;
					newPost.title 	= post.title;
					newPost.url 		= post.url;
					newPost.body 		= post.body;

			if (post._id) newPost._id = post._id;

			let result = (await newPost.save()).toJSONFor(foundUser);

			return res.status(200).json(result);
		}
	} catch(err) {
		sendError(err, res);
	}
}
