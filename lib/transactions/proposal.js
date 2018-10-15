var crypto = require("./crypto.js")
var transaction = require('./transaction.js')

function registerGateway(options, secret, secondSecret) {
	// construct content
	let content = {
		name : options.gatewayName,
		desc : options.gatewayDesc,
		minimumMembers: options.minimumMembers || 3,
		updateInterval: options.updateInterval || 8640,
		currency: {
			symbol : options.currencySymbol,
			desc: options.currencyDesc,
			precision : options.currencyPrecision
		}
	}

	return transaction.createTransactionEx({
		type: 300,
		fee: 10 * 1e8,
		secret: secret,
		secondSecret: secondSecret,
		args: [
			options.proposalTitle || 'title for gateway_register',
			options.proposalDesc, 'gateway_register',
			content,
			options.proposalEndHeight
		]
	})
}

function initGateway(options, secret, secondSecret) {
	// construct content
	let content = {
		gateway : options.gatewayName,
		members: options.gatewayMembers
	}

	return transaction.createTransactionEx({
		type: 300,
		fee: 10 * 1e8,
		secret: secret,
		secondSecret: secondSecret,
		args: [
			options.proposalTitle || 'title for gateway_init',
			options.proposalDesc || 'desc for gateway_init',
			'gateway_init',
			content,
			options.proposalEndHeight
		]
	})
}

function updateGatewayMember(options, secret, secondSecret) {
	// construct content
	let content = {
		gateway: options.gatewayName,
		from: options.fromAddress,
		to: options.toAddress
	}

	return transaction.createTransactionEx({
		type: 300,
		fee: 10 * 1e8,
		secret: secret,
		secondSecret: secondSecret,
		args: [
			options.proposalTitle || 'title for gateway_update_member',
			options.proposalDesc || 'desc for gateway_update_member',
			'gateway_update_member',
			content,
			options.proposalEndHeight
		]
	})
}

function revokeGateway(options, secret, secondSecret) {
	// construct content
	let content = {
		gateway: options.gatewayName
	}

	return transaction.createTransactionEx({
		type: 300,
		fee: 10 * 1e8,
		secret: secret,
		secondSecret: secondSecret,
		args: [
			options.proposalTitle || 'title for gateway_revoke',
			options.proposalDesc || 'desc for gateway_revoke',
			'gateway_revoke',
			content,
			options.proposalEndHeight
		]
	})
}

function activateProposal(tid, secret, secondSecret) {
	return transaction.createTransactionEx({
		type: 302,
		fee: 0 * 1e8,
		secret: secret,
		secondSecret: secondSecret,
		args: [tid]
	})
}

function upvoteProposal(tid, secret, secondSecret) {
	return transaction.createTransactionEx({
		type: 301,
		fee: 1e7, // 0.1 * 1e8
		secret: secret,
		secondSecret: secondSecret,
		args: [tid]
	})
}

module.exports = {
	registerGateway: registerGateway,
	initGateway: initGateway,
	updateGatewayMember: updateGatewayMember,
	revokeGateway: revokeGateway,
	activateProposal: activateProposal,
	upvoteProposal: upvoteProposal
}
