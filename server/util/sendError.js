module.exports = (err, res) => {
	let message = typeof(err) == 'object' ? err.message: err;
	if (err.stack)
		console.log("error stack: ", err.stack);

	return res.status(500).send(err);
}