var transaction = require('./transaction.js')

function register(options, secret, secondSecret) {
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

function vote(targetId){
  return transaction.createTransactionEx({
		type: 500,
		fee: 0,
		secret: secret,
		secondSecret: secondSecret,
    args: [targetId]
  })  
}

function activate(targetId, secret, secondSecret){
  return transaction.createTransactionEx({
		type: 501,
		fee: 0,
		secret: secret,
		secondSecret: secondSecret,
    args: [targetId]
  })  
}

function addMember(address, weight, m, secret, secondSecret){
  return transaction.createMultiSigTransaction({
		type: 502,
		fee: 1 * 1e8,
    args: [address, weight, m]
  })  
}

function removeMember(address, m, secret, secondSecret){
  return transaction.createTransactionEx({
		type: 503,
		fee: 1 * 1e8,
		secret: secret,
		secondSecret: secondSecret,
    args: [address, m]
  })  
}

/*function replaceMember(oldMember,newMember){
  return transaction.createTransactionEx({
		type: 504,
		fee: 1 * 1e8,
		secret: secret,
		secondSecret: secondSecret,
    args: [oldMember,newMember]
  })  
}*/

module.exports = {
  register: register,
  vote: vote,
  activate: activate,
  addMember: addMember,
  removeMember: removeMember//,
  //replaceMember: replaceMember
}