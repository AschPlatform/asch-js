var crypto = require("./crypto.js")
var transaction = require('./transaction.js')

function registerMember(options, secret, secondSecret) {
	let keys = crypto.getKeys(secret);
	return transaction.createTransactionEx({
		type: 401,
		fee: 100 * 1e8,
		secret: secret,
		secondSecret, secondSecret,
		args: [options.gateway, keys.publicKey]
	})
}

module.exports = {
	registerMember: registerMember
}
