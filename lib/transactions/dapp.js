var chain = require('./chain.js')

/**
	* @deprecated use instead chain.createChain(options, secret, secondSecret)
	*/
function createDApp(options, secret, secondSecret) {
	return chain.createChain(options, secret, secondSecret)
}

/**
	* @deprecated use instead chain.createInnerTransaction(options, secret)
	*/
function createInnerTransaction(options, secret) {
	return chain.createInnerTransaction(options, secret)
}

module.exports = {
	createDApp: createDApp,
	createInnerTransaction: createInnerTransaction
}
