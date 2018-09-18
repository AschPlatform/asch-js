var crypto = require("./crypto.js")
var transaction = require('./transaction.js')

/*function propose(options, secret, secondSecret) {
	var keys = crypto.getKeys(secret);
	return transaction.createTransactionEx({
	type: 300,
	fee: 10 * 1e8,
	secret: secret,
	secondSecret, secondSecret,
	args: [options.title, options.desc, null, null, options.endHeight]
	})
}*/

function registergateway(options, secret, secondSecret) {
		
	let keys = crypto.getKeys(secret);
	let currency = {
		symbol : options.symbol,
		desc: options.currencyDesc,
		precision : options.precision
	}
	// construct this content
	let content = {
		name : options.name,
		desc : options.desc,
		minimumMembers: options.minimumMembers,
		updateInterval: options.updateInterval,
		currency: currency
	}
	return transaction.createTransactionEx({
		type: 300,
		fee: 10 * 1e8,
		secret: secret,
		secondSecret, secondSecret,
		args: [options.title, options.desc, 'gateway_register', content, options.endHeight]
	})
}

function initgateway(options, secret, secondSecret) {

	let keys = crypto.getKeys(secret);
	// construct this content
	let content = {
		gateway : options.name,
		members: options.members
	}

	return transaction.createTransactionEx({
		type: 300,
		fee: 10 * 1e8,
		secret: secret,
		secondSecret, secondSecret,
		args: ['xxxxxxxxxx', '', 'gateway_init', content, 500000]
	})
}

function activate(options, secret, secondSecret) {

	let keys = crypto.getKeys(secret);
	return transaction.createTransactionEx({
		type: 302,
		fee: 0 * 1e8,
		secret: secret,
		secondSecret, secondSecret,
		args: [options.tid]
	})
}

function upvote(options, secret, secondSecret) {

	let keys = crypto.getKeys(secret);
	return transaction.createTransactionEx({
		type: 301,
		fee: 1e7, // 0.1 * 1e8
		secret: secret,
		secondSecret, secondSecret,
		args: [options.tid]
	})
}

module.exports = {
	//propose: propose
	registergateway: registergateway,
	initgateway: initgateway,
	activate: activate,
	upvote: upvote
}
