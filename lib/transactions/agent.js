var transaction = require('./transaction')

function registerAsAgent (secret, secondSecret) {
	return transaction.createTransactionEx({
		type: 7,
		fee: 100 * 1e8,
		secret: secret,
		secondSecret: secondSecret,
		args: []
	})
}

function setAgent (nickname, secret, secondSecret) {
	return transaction.createTransactionEx({
		type: 8,
		fee: 0.1 * 1e8,
		secret: secret,
		secondSecret: secondSecret,
		args: [nickname]
	})
}

function cancelAgent (secret, secondSecret) {
	return transaction.createTransactionEx({
		type: 9,
		fee: 0 * 1e8,
		secret: secret,
		secondSecret: secondSecret,
		args: []
	})
}

module.exports = {
	registerAsAgent: registerAsAgent,
	setAgent: setAgent,
	cancelAgent: cancelAgent
}
