var crypto = require("./crypto.js")
var constants = require("../constants.js")
var slots = require("../time/slots.js")
var options = require('../options')

function calculateFee(amount) {
    var min = constants.fees.send;
    var fee = parseFloat((amount * 0.0001).toFixed(0));
    return fee < min ? min : fee;
}

function createTransaction(recipientId, amount, message, secret, secondSecret) {
	var transaction = {
		type: 0,
		amount: amount,
		fee: constants.fees.send,
		recipientId: recipientId,
		message: message,
		timestamp: slots.getTime() - options.get('clientDriftSeconds'),
		asset: {}
	};

	var keys = crypto.getKeys(secret);
	transaction.senderPublicKey = keys.publicKey;

	crypto.sign(transaction, keys);

	if (secondSecret) {
		var secondKeys = crypto.getKeys(secondSecret);
		crypto.secondSign(transaction, secondKeys);
	}

	transaction.id = crypto.getId(transaction);
	return transaction;
}

function createLock(height, secret, secondSecret) {
	var transaction = {
		type: 100,
		amount: 0,
		fee: 10000000,
		recipientId: null,
		args: [ String(height) ],
		timestamp: slots.getTime() - options.get('clientDriftSeconds'),
		asset: {}
	};

	var keys = crypto.getKeys(secret);
	transaction.senderPublicKey = keys.publicKey;

	crypto.sign(transaction, keys);

	if (secondSecret) {
		var secondKeys = crypto.getKeys(secondSecret);
		crypto.secondSign(transaction, secondKeys);
	}

	transaction.id = crypto.getId(transaction);
	return transaction;
}

function createTransactionEx(params) {
	if (!params.secret) throw new Error('Secret needed')
	let keys = crypto.getKeys(params.secret)
	let transaction = {
		type: params.type,
		timestamp: slots.getTime() - options.get('clientDriftSeconds'),
		fee: params.fee,
		message: params.message,
		args: params.args,
		senderPublicKey: keys.publicKey,
	}
	crypto.sign(transaction, keys)
	if (params.secondSecret) {
		let secondKeys = crypto.getKeys(params.secondSecret);
		crypto.secondSign(transaction, secondKeys);
	}
	transaction.id = crypto.getId(transaction)
	return transaction
}

module.exports = {
	createTransaction: createTransaction,
	createTransactionEx: createTransactionEx,
	calculateFee: calculateFee,
	createLock: createLock
}