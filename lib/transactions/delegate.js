var crypto = require("./crypto.js")
var constants = require("../constants.js")
var slots = require("../time/slots.js")
var options = require('../options')
var transaction = require('./transaction')

function createDelegate(secret, secondSecret) {
	return transaction.createTransactionEx({
		type: 10,
		fee: 100 * 1e8,
		args: [],
		secret: secret,
		secondSecret: secondSecret
	})
}

module.exports = {
	createDelegate : createDelegate
}
