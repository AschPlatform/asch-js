var crypto = require("./crypto.js")
var constants = require("../constants.js")
var slots = require("../time/slots.js")
var options = require('../options')
var transaction = require('./transaction')

function createInTransfer(dappName, currency, amount, secret, secondSecret) {
	return transaction.createTransactionEx({
		type: 204,
		fee: 0.1 * 1e8,
		args: [dappName, currency, amount],
		secret,
		secondSecret: secondSecret
	})
}

function createOutTransfer(address, chain, recipient, currency, amount, wid, seq) {
	var transaction = {
		type: 205,
		fee: 10000000,
		senderId: address,
		timestamp: slots.getTime() - options.get('clientDriftSeconds'),
		args: [
			chain,
			recipient,
			currency,
			amount,
			wid,
			seq
		]
	};
	return transaction;
}

function signOutTransfer(transaction, secret) {
	var keys = crypto.getKeys(secret);
	var signature = crypto.sign(transaction, keys);

	return keys.publicKey + signature;
}

module.exports = {
	createInTransfer: createInTransfer,
	createOutTransfer: createOutTransfer,
	signOutTransfer: signOutTransfer
}