var transaction = require('./transaction.js')
var address = require('../address.js')
var crypto = require('./crypto.js')

function registerGroup(options, secret, secondSecret) {
	return transaction.createTransactionEx({
		type: 6,
		fee: 5 * 1e8,
		secret: secret,
		secondSecret: secondSecret,
		args: [
			options.groupName,
			options.members,
			options.min,
			options.max,
			options.m,
			options.updateInterval
		]
	})
}

function voteTransaction(targetId, secret, secondSecret) {
	return transaction.createTransactionEx({
		type: 500,
		fee: 0,
		secret: secret,
		secondSecret: secondSecret,
		args: [targetId]
	})
}

function activateTransaction(targetId, secret, secondSecret) {
	return transaction.createTransactionEx({
		type: 501,
		fee: 0,
		secret: secret,
		secondSecret: secondSecret,
		args: [targetId]
	})
}

function addMember(address, weight, m, secret, secondSecret) {
	return transaction.createMultiSigTransaction({
		type: 502,
		fee: 1 * 1e8,
		secret: secret,
		secondSecret: secondSecret,
		args: [address, weight, m]
	})
}

function removeMember(address, m, secret, secondSecret) {
	return transaction.createTransactionEx({
		type: 503,
		fee: 1 * 1e8,
		secret: secret,
		secondSecret: secondSecret,
		args: [address, m]
	})
}

function transformIntoGroupTransaction(normalTransaction, groupName, secret, secondSecret) {
	if (!normalTransaction) throw new Error('normalTransaction needed')
	if (!groupName) throw new Error('groupName needed')
	if (!secret) throw new Error('secret needed')

	let groupAddress = address.generateGroupAddress(groupName)
	// sender is the group
	normalTransaction.senderId = groupAddress

	// requestor is the group member
	normalTransaction.senderPublicKey = crypto.getKeys(secret).publicKey
	normalTransaction.requestorId = crypto.getAddress(crypto.getKeys(secret).publicKey)

	// change to request mode
	normalTransaction.mode = 1

	// sign transaction again
	let keys = crypto.getKeys(secret)
	normalTransaction.signatures = []
	normalTransaction.signatures.push(crypto.sign(normalTransaction, keys))

	// second sign
	if (secondSecret) {
		let secondKeys = crypto.getKeys(secondSecret)
		normalTransaction.secondSignature = crypto.secondSign(normalTransaction, secondKeys)
	}

	// create id
	normalTransaction.id = crypto.getId(normalTransaction)

	return normalTransaction
}

module.exports = {
	registerGroup: registerGroup,
	voteTransaction: voteTransaction,
	activateTransaction: activateTransaction,
	addMember: addMember,
	removeMember: removeMember,
	transformIntoGroupTransaction: transformIntoGroupTransaction
}
