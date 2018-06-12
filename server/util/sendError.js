module.exports = (err, res) => {
	let message = err.message ? err.message : err;
	let status = err.status ? err.status : 500;
	if (err.stack)
		console.log("error stack: ", err.stack);

	return res.status(status).send(err);
}