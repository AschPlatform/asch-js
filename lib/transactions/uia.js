var ByteBuffer = require('bytebuffer')
var crypto = require("./crypto.js")
var constants = require("../constants.js")
var slots = require("../time/slots.js")
var options = require('../options')
var transaction = require('./transaction')

function createIssuer (name, desc, secret, secondSecret) {
	return transaction.createTransactionEx({
		type: 100,
		fee: 100 * 1e8,
		args: [ name, desc ],
		secret: secret,
		secondSecret: secondSecret
	})
}

function createAsset(name, desc, maximum, precision, secret, secondSecret) {
	return transaction.createTransactionEx({
		type: 101,
		fee: 500 * 1e8,
		args: [ name, desc, maximum, precision ],
		secret: secret,
		secondSecret: secondSecret
	})
}


function createIssue(currency, amount, secret, secondSecret) {
	return transaction.createTransactionEx({
		type: 102,
		fee: 0.1 * 1e8,
		args: [ currency, amount ],
		secret: secret,
		secondSecret: secondSecret
	})
}

function createTransfer(currency, amount, recipientId, message, secret, secondSecret) {
	return transaction.createTransactionEx({
		type: 103,
		fee: 0.1 * 1e8,
		args: [currency, amount, recipientId],
		secret,
		secondSecret,
		message
	})
}

module.exports = {
	createIssuer: createIssuer,
	createAsset: createAsset,
	createIssue: createIssue,
	createTransfer: createTransfer
}
