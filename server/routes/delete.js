const User = require('./../models/user'),
			Post = require('./../models/post'),
			sendError = require('./../util/sendError');

module.exports.post = async (req, res) => {
	try {
		if (req.query.id) {
			let query = {_id: req.query.id};

			let deleteResult = await Post.deleteOne(query)
				.exec();

			if (!deleteResult) return res.json(false);

			let result = true;
			result = result && deleteResult.n === 1;
			result = result && deleteResult.ok === 1;

			return res.status(200).json(result);
	
		}	else {
			return sendError({message: "Illformed query", status: 400}, res);
		}
	} catch(err) {
		return sendError(err, res);
	}
}
