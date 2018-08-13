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
	return createTransactionEx({
		type: 1,
		fee: 0.1 * 1e8,
		args: [amount, recipientId],
		secret,
		secondSecret: secondSecret,
		message
	})
}

function createLock(height, amount, secret, secondSecret) {
	return createTransactionEx({
		type: 4,
		fee: 0.1 * 1e8,
		args: [height, amount],
		secret: secret,
		secondSecret: secondSecret
	})
}

function unlock(secret, secondSecret) {
	return createTransactionEx({
		type: 5,
		fee: 0,
		args: [],
		secret: secret,
		secondSecret: secondSecret
	})
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
		senderId: crypto.getAddress(keys.publicKey),
		signatures: []
	}
	transaction.signatures.push(crypto.sign(transaction, keys))
	if (params.secondSecret) {
		let secondKeys = crypto.getKeys(params.secondSecret);
		transaction.secondSignature = crypto.secondSign(transaction, secondKeys);
	}
	transaction.id = crypto.getId(transaction)
	return transaction
}

function createMultiSigTransaction(params) {
	var transaction = {
		type: params.type,
		fee: params.fee,
		senderId: params.senderId,
		requestId: params.requestId,
		mode: params.mode,
		timestamp: slots.getTime() - options.get('clientDriftSeconds'),
		args: params.args
	};
	return transaction;
}

function signMultiSigTransaction(transaction, secret) {
	var keys = crypto.getKeys(secret);
	var signature = crypto.sign(transaction, keys);

	return keys.publicKey + signature;
}

module.exports = {
	createTransaction: createTransaction,
	createTransactionEx: createTransactionEx,
	calculateFee: calculateFee,
	createLock: createLock,
	unlock: unlock,
	createMultiSigTransaction: createMultiSigTransaction,
	signMultiSigTransaction: signMultiSigTransaction
}
