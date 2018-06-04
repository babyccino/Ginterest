const User = require('./../models/user'),
			Post = require('./../models/post');

const urlRegex = new RegExp(
	/[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi
);
String.prototype.isURL = function() {
	return (this.match(urlRegex)).length > 0;
}

module.exports.newPost = async (req, res) => {
	try {
		let post = req.body,
				user = req.user;
		console.log('POST /api/post');
		if (!post.title && post.title != "") {
			// console.log('Post: ', post);
			throw new Error("Bad post title");
		} else if (!post.url && post.url != "" && post.url.isURL()) {
			// console.log('Post: ', post);
			throw new Error("Bad post URL");
		} else if (!user && user._id != post.userId) {
			// console.log('User: ', user);
			throw new Error("Bad session user data");
		} else {
			const foundUser = await User.findById(user._id)
				.select({_id: 1, twitter: 1})
				.exec();
			if (!foundUser) throw Error("user not found");

			let newPost					= new Post();
					newPost.userId	= foundUser._id;
					newPost.title 	= post.title;
					newPost.url 		= post.url;
					newPost.body 		= post.body;

			newPost.save((err, savedPost) => {
				if (err) return sendError(err, res);

				savedPost.twitter = {
					username: foundUser.twitter.username,
					displayUrl: foundUser.twitter.displayUrl
				};
				return res.json(savedPost);
			});
		}
	} catch(err) {
		sendError(err, res);
	}
}
