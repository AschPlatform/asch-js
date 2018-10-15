var basic = require('./basic.js')

/**
	* @deprecated use instead basic.setSecondSecret(secret, secondSecret)
	*/
function createSignature (secret, secondSecret) {
	return basic.setSecondSecret(secret, secondSecret)
}

module.exports = {
	createSignature: createSignature
}