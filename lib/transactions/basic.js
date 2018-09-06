var crypto = require("./crypto.js")
var transaction = require('./transaction.js')

function calculateFee(username){
    let len = username.length
    if (len === 2) {
      return 200
    } else if (len === 3) {
      return 100
    } else if (len === 4) {
      return 80
    } else if (len === 5) {
      return 40
    } else if (len <= 10) {
      return 10
    }
    return 1
}

function setName(username, secret, secondSecret) {
	return transaction.createTransactionEx({
		type: 2,
		fee: calculateFee(username) * 1e8,
		secret: secret,
		secondSecret: secondSecret,
		args: [username]
	})
}

function newSignature(secondSecret) {
	var keys = crypto.getKeys(secondSecret);
	var signature = {
		publicKey: keys.publicKey
	};
	return signature;
}

function setSecondSecret(secret, secondSecret) {
	var secondSignature = newSignature(secondSecret);
	return transaction.createTransactionEx({
		type: 3,
		fee: 5 * 1e8,
		args: [secondSignature.publicKey],
		secret: secret
	})
}

module.exports = {
	setName: setName,
	setSecondSecret: setSecondSecret
}
