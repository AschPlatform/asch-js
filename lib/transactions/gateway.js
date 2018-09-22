var crypto = require("./crypto.js")
var transaction = require('./transaction.js')

function registerMember(gateway, memberPublicKey, secret, secondSecret) {
	let keys = crypto.getKeys(secret);
	return transaction.createTransactionEx({
		type: 401,
		fee: 100 * 1e8,
		secret: secret,
		secondSecret, secondSecret,
		args: [gateway, memberPublicKey]
	})
}

module.exports = {
	registerMember: registerMember
}
