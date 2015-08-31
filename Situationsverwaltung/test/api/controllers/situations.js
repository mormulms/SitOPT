'use strict';

module.exports = {
 situations: situations
};

function situations(req, res) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	var text = util.format("Hello Matze");
	res.json(text);
}