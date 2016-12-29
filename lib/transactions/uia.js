var ByteBuffer = require('bytebuffer')
var crypto = require("./crypto.js")
var constants = require("../constants.js")
var slots = require("../time/slots.js")

function getClientFixedTime() {
  return slots.getTime() - constants.clientDriftSeconds
}

function createTransaction(asset, bytes, fee, type, recipientId, secret, secondSecret) {
  var keys = crypto.getKeys(secret)

  var transaction = {
    type: type,
    amount: 0,
    fee: fee,
    recipientId: recipientId,
    senderPublicKey: keys.publicKey,
    timestamp: getClientFixedTime(),
    asset: asset,
    __assetBytes__: bytes
  }

  crypto.sign(transaction, keys)

  if (secondSecret) {
    var secondKeys = crypto.getKeys(secondSecret)
    crypto.secondSign(transaction, secondKeys)
  }

  transaction.id = crypto.getId(transaction)
  delete transaction.__assetBytes__

  return transaction
}

module.exports = {
  createIssuer: function (name, desc, secret, secondSecret) {
    var asset = {
      uiaIssuer: {
        name: name,
        desc: desc
      }
    }
    var bb = new ByteBuffer()
    bb.writeString(name)
    bb.writeString(desc)
    bb.flip()
    var bytes = bb.toBuffer()
    var fee = (Math.floor(bytes.length / 200) + 1) * 0.1 * constants.coin
    return createTransaction(asset, bytes, fee, 9, null, secret, secondSecret)
  },

  createAsset: function (name, desc, maximum, precision, strategy, secret, secondSecret) {
    var asset = {
      uiaAsset: {
        name: name,
        desc: desc,
        maximum: maximum,
        precision: precision,
        strategy: strategy
      }
    }
    var bb = new ByteBuffer()
    bb.writeString(name)
    bb.writeString(desc)
    bb.writeString(maximum)
    bb.writeByte(precision)
    if (typeof strategy === 'string' && strategy.length > 0) {
      bb.writeString(strategy)
    }
    bb.flip()
    var bytes = bb.toBuffer()
    var fee = (Math.floor(bytes.length / 200) + 1) * 0.1 * constants.coin
    return createTransaction(asset, bytes, fee, 10, null, secret, secondSecret)
  },

  createFlags: function (currency, flagType, flag, secret, secondSecret) {
    var asset = {
      uiaFlags: {
        currency: currency,
        flagType: flagType,
        flag: flag
      }
    }
    var bb = new ByteBuffer()
    bb.writeString(currency)
    bb.writeByte(flagType)
    bb.writeByte(flag)
    bb.flip()
    var bytes = bb.toBuffer()
    var fee = 0.1 * constants.coin
    return createTransaction(asset, bytes, fee, 11, null, secret, secondSecret)
  },

  createAcl: function (currency, operator, flag, list, secret, secondSecret) {
    var asset = {
      uiaAcl: {
        currency: currency,
        operator: operator,
        flag: flag,
        list: list
      }
    }
    var bb = new ByteBuffer()
    bb.writeString(currency)
    bb.writeString(operator)
    bb.writeByte(flag)
    for (var i = 0; i < list.length; ++i) {
      bb.writeString(list[i])
    }
    bb.flip()
    var bytes = bb.toBuffer()
    var fee = 0.2 * constants.coin
    return createTransaction(asset, bytes, fee, 12, null, secret, secondSecret)
  },

  createIssue: function (currency, amount, secret, secondSecret) {
    var asset = {
      uiaIssue: {
        currency: currency,
        amount: amount
      }
    }
    var bb = new ByteBuffer()
    bb.writeString(currency)
    bb.writeString(amount)
    bb.flip()
    var bytes = bb.toBuffer()
    var fee = 0.1 * constants.coin
    return createTransaction(asset, bytes, fee, 13, null, secret, secondSecret)
  },

  createTransfer: function (currency, amount, recipientId, secret, secondSecret) {
    var asset = {
      uiaTransfer: {
        currency: currency,
        amount: amount
      }
    }
    var bb = new ByteBuffer()
    bb.writeString(currency)
    bb.writeString(amount)
    bb.flip()
    var bytes = bb.toBuffer()
    var fee = 0.1 * constants.coin
    return createTransaction(asset, bytes, fee, 14, recipientId, secret, secondSecret)
  },
}
