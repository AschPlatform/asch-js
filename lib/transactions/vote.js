var crypto = require("./crypto.js")
var constants = require("../constants.js")
var slots = require("../time/slots.js")
var options = require('../options')
var transaction = require('./transaction')

function createVote(keyList, secret, secondSecret) {
return transaction.createTransactionEx({
		type: 11,
		fee: 0.1 * 1e8,
		args: keyList,
		secret: secret,
		secondSecret: secondSecret
	})
}

function deleteVote(keyList, secret, secondSecret) {
	return transaction.createTransactionEx({
		type: 12,
		fee: 0.1 * 1e8,
		args: keyList,
		secret: secret,
		secondSecret: secondSecret
	})
}

module.exports = {
	createVote: createVote,
	deleteVote: deleteVote
}
