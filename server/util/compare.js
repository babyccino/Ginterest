const Mongoose = require('mongoose'),
			expect = require('chai').expect;
			
module.exports = function compare(obj1, obj2, keys) {
	function _compare(_obj1, _obj2, _keys) {
		if (_keys === undefined) throw new Error("keys undefined");
		for (let property in _keys) {
	    if (_keys.hasOwnProperty(property)) {
				if (_keys[property] instanceof Object)
					compare(_obj1[property], _obj2[property], _keys[property]);
				else {
					let val1,
							val2,
							equal = _keys[property];
					if (property === "id" || property === "_id") {
						if (_obj1.hasOwnProperty("id"))
							val1 = _obj1["id"];
						else
							val1 = _obj1["_id"];

						if (_obj2.hasOwnProperty("id"))
							val2 = _obj2["id"];
						else
							val2 = _obj2["_id"];

						property = "id";
					} else {
						val1 = _obj1[property];
						val2 = _obj2[property];
					}

					if (property === "id" || property === "userId") {
						val1 = val1.toString();
						val2 = val2.toString();
					}

					if (equal === true) expect(val1).to.equal(val2);
					if (equal === false) expect(val1).to.not.equal(val2);
				}
	    }
		}
	}
	if (obj1 instanceof Array !== obj2 instanceof Array)
		throw new Error("one input is array and other is not");
	else if (obj1 instanceof Array) {
		if (obj1.length === obj2.length) {
			for (let i = 0; i < obj1.length; ++i) {
				_compare(obj1[i], obj2[i], keys);
			}
		} else throw new Error("different length arrays");
	} else return _compare(obj1, obj2, keys);
}
