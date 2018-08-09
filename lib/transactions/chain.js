var assert = require('assert')
var ByteBuffer = require('bytebuffer')
var crypto = require("./crypto.js")
var constants = require("../constants.js")
var slots = require("../time/slots.js")
var globalOptions = require('../options.js')

function createChain(options, secret, secondSecret) {
	var keys = crypto.getKeys(secret);

	var transaction = {
		secret: secret,
                type: 200,
		amount: 0,
		fee: constants.fees.Chain,
		recipientId: null,
		senderId: crypto.getAddress(keys.publicKey),
		timestamp: slots.getTime() - globalOptions.get('clientDriftSeconds'),
                args: [options.name, options.description, options.link, options.icon, options.delegates, options.unlockDelegates], 
                signatures: []
	};

	transaction.signatures.push(crypto.sign(transaction, keys));

	if (secondSecret) {
		var secondKeys = crypto.getKeys(secondSecret);
		transaction.signatures.push(crypto.secondSign(transaction, secondKeys));
	}

	transaction.id = crypto.getId(transaction);
	return transaction;
}

function getChainTransactionBytes(trs, skipSignature) {
	var bb = new ByteBuffer(1, true);
	bb.writeInt(trs.timestamp);
	bb.writeString(trs.fee)

	var senderPublicKeyBuffer = new Buffer(trs.senderPublicKey, 'hex');
	for (var i = 0; i < senderPublicKeyBuffer.length; i++) {
		bb.writeByte(senderPublicKeyBuffer[i]);
	}

	bb.writeInt(trs.type)

	assert(Array.isArray(trs.args))
	bb.writeString(JSON.stringify(trs.args))

	if (!skipSignature && trs.signatures[0]) {
		var signatureBuffer = new Buffer(trs.signature, 'hex');
		for (var i = 0; i < signatureBuffer.length; i++) {
			bb.writeByte(signatureBuffer[i]);
		}
	}
	bb.flip();
	return bb.toBuffer()
}

function createInnerTransaction(options, secret) {
	var keys = crypto.getKeys(secret)
	var args = options.args
	if (typeof args === 'string') args = JSON.parse(args)
	var trs = {
		fee: options.fee,
		timestamp: slots.getTime() - globalOptions.get('clientDriftSeconds'),
		senderId: crypto.getAddress(keys.publicKey),
		type: options.type,
		args: args,
                signatures: []
	}
	trs.signatures.push(crypto.signBytes(getChainTransactionBytes(trs), keys))
	return trs
}

module.exports = {
	createChain: createChain,
	createInnerTransaction: createInnerTransaction
}
