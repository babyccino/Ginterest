const urlRegex = new RegExp(
	/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi
);

module.exports = function(arg) {
	let length = arg.length;
	let res = arg.match(urlRegex);
	return res ? res[0].length == length : false;
}