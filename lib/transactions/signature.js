var crypto = require("./crypto.js")
var constants = require("../constants.js")
var slots = require("../time/slots.js")
var options = require('../options')
var transaction = require('./transaction')

function newSignature(secondSecret) {
	var keys = crypto.getKeys(secondSecret);

	var signature = {
		publicKey: keys.publicKey
	};

	return signature;
}

function createSignature(secret, secondSecret) {
	var secondSignature = newSignature(secondSecret);
	return transaction.createTransactionEx({
		type: 3,
		fee: 5 * 1e8,
		args: [secondSignature.publicKey],
		secret: secret
	})
}

module.exports = {
	createSignature: createSignature
}
