var assert = require('assert')
var ByteBuffer = require('bytebuffer')
var crypto = require("./crypto.js")
var constants = require("../constants.js")
var slots = require("../time/slots.js")
var globalOptions = require('../options.js')
var transaction = require('./transaction.js')

function createDApp(options, secret, secondSecret) {
	return transaction.createTransactionEx({
		type: 200,
		fee: 100 * 1e8,
		secret: secret,
		secondSecret: secondSecret,
		args: [
			options.name,
			options.description,
			options.link,
			options.icon,
			options.delegates,
			options.unlockDelegates
		]
	})
}

function getDAppTransactionBytes(trs, skipSignature) {
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

	if (!skipSignature && trs.signature) {
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
		senderPublicKey: keys.publicKey,
		type: options.type,
		args: args
	}
	trs.signature = crypto.signBytes(getDAppTransactionBytes(trs), keys)
	return trs
}

module.exports = {
	createDApp: createDApp,
	createInnerTransaction: createInnerTransaction
}
