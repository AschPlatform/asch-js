var sha256 = require("fast-sha256");
var addressHelper = require('../address.js')

if (typeof Buffer === "undefined") {
	Buffer = require("buffer/").Buffer;
}

var ByteBuffer = require("bytebuffer");
var bignum = require("browserify-bignum");
var nacl = require('tweetnacl')

var fixedPoint = Math.pow(10, 8);

function getSignatureBytes(signature) {
	var bb = new ByteBuffer(32, true);
	var publicKeyBuffer = new Buffer(signature.publicKey, "hex");

	for (var i = 0; i < publicKeyBuffer.length; i++) {
		bb.writeByte(publicKeyBuffer[i]);
	}

	bb.flip();
	return new Uint8Array(bb.toArrayBuffer());
}

function toLocalBuffer(buf) {
  if (typeof window !== 'undefined') {
    return new Uint8Array(buf.toArrayBuffer())
  } else {
    return buf.toBuffer()
  }
}

function sha256Bytes(data) {
	return sha256.hash(data)
}

function sha256Hex(data) {
	return Buffer.from(sha256.hash(data)).toString('hex')
}

function getDAppBytes(dapp) {
	try {
		var buf = new Buffer([]);
		var nameBuf = new Buffer(dapp.name, "utf8");
		buf = Buffer.concat([buf, nameBuf]);

		if (dapp.description) {
			var descriptionBuf = new Buffer(dapp.description, "utf8");
			buf = Buffer.concat([buf, descriptionBuf]);
		}

		if (dapp.tags) {
			var tagsBuf = new Buffer(dapp.tags, "utf8");
			buf = Buffer.concat([buf, tagsBuf]);
		}

		if (dapp.link) {
			buf = Buffer.concat([buf, new Buffer(dapp.link, "utf8")]);
		}

		if (dapp.icon) {
			buf = Buffer.concat([buf, new Buffer(dapp.icon, "utf8")]);
		}

		var bb = new ByteBuffer(1, true);
		bb.writeInt(dapp.type);
		bb.writeInt(dapp.category);
		bb.writeString(dapp.delegates.join(','));
		bb.writeInt(dapp.unlockDelegates);
		bb.flip();

		buf = Buffer.concat([buf, bb.toBuffer()]);
	} catch (e) {
		throw Error(e.toString());
	}

	return buf;
}

function getInTransferBytes(inTransfer) {
	try {
		var buf = new Buffer([]);
		var dappId = new Buffer(inTransfer.dappId, "utf8");
		var currency = new Buffer(inTransfer.currency, "utf8")
		buf = Buffer.concat([buf, dappId, currency]);
		if (inTransfer.currency !== 'XAS') {
			var amount = new Buffer(inTransfer.amount, "utf8")
			buf = Buffer.concat([buf, amount])
		}
	} catch (e) {
		throw Error(e.toString());
	}

	return buf;
}

function getOutTransferBytes(outTransfer) {
	try {
		var buf = new Buffer([]);
		var dappIdBuf = new Buffer(outTransfer.dappId, 'utf8');
		var transactionIdBuff = new Buffer(outTransfer.transactionId, 'utf8');
		var currencyBuff = new Buffer(outTransfer.currency, 'utf8')
		var amountBuff = new Buffer(outTransfer.amount, 'utf8')
		buf = Buffer.concat([buf, dappIdBuf, transactionIdBuff, currencyBuff, amountBuff]);
	} catch (e) {
		throw Error(e.toString());
	}

	return buf;
}

function getBytes(trs, skipSignature, skipSecondSignature) {
	var bb = new ByteBuffer(1, true);
	bb.writeInt(trs.type);
	bb.writeInt(trs.timestamp);
	bb.writeLong(trs.fee);
	bb.writeString(trs.senderId)
	if (trs.requestorId) {
		bb.writeString(trs.requestorId)
	}
	if (trs.mode) {
		bb.writeInt(trs.mode)
	}

	if (trs.message) bb.writeString(trs.message);
	if (trs.args) {
		let args
		if (typeof trs.args === 'string') {
			args = trs.args
		} else if (Array.isArray(trs.args)) {
			args = JSON.stringify(trs.args)
		}
		bb.writeString(args)
	}

	if (!skipSignature && trs.signatures) {
		for (let signature of trs.signatures) {
		  var signatureBuffer = new Buffer(signature, 'hex');
		  for (var i = 0; i < signatureBuffer.length; i++) {
		  	bb.writeByte(signatureBuffer[i]);
		  }
		}
	}

	if (!skipSecondSignature && trs.secondSignature) {
		var signSignatureBuffer = new Buffer(trs.secondSignature, 'hex');
		for (var i = 0; i < signSignatureBuffer.length; i++) {
			bb.writeByte(signSignatureBuffer[i]);
		}
	}

	bb.flip();
	return toLocalBuffer(bb);
}

function getId(transaction) {
	return sha256Hex(getBytes(transaction))
}
function getHash(transaction, skipSignature, skipSecondSignature) {
	return sha256Bytes(getBytes(transaction, skipSignature, skipSecondSignature))
}

function getFee(transaction) {
	switch (transaction.type) {
		case 0: // Normal
			return 0.1 * fixedPoint;
			break;

		case 1: // Signature
			return 100 * fixedPoint;
			break;

		case 2: // Delegate
			return 10000 * fixedPoint;
			break;

		case 3: // Vote
			return 1 * fixedPoint;
			break;
	}
}

function sign(transaction, keys) {
	var hash = getHash(transaction, true, true);
	var signature = nacl.sign.detached(hash, keys.keypair.secretKey);

	return new Buffer(signature).toString("hex");
}

function secondSign(transaction, keys) {
	var hash = getHash(transaction, true, true);
	var signature = nacl.sign.detached(hash, keys.keypair.secretKey);
	return new Buffer(signature).toString("hex")
}

function signBytes(bytes, keys) {
	var hash = sha256Bytes(new Buffer(bytes, 'hex'))
	var signature = nacl.sign.detached(hash, keys.keypair.secretKey);
	return new Buffer(signature).toString("hex");
}

function verify(transaction) {
	var remove = 64;

	if (transaction.signSignature) {
		remove = 128;
	}

	var bytes = getBytes(transaction);
	var data2 = new Buffer(bytes.length - remove);

	for (var i = 0; i < data2.length; i++) {
		data2[i] = bytes[i];
	}

	var hash = sha256Bytes(data2)

	var signatureBuffer = new Buffer(transaction.signature, "hex");
	var senderPublicKeyBuffer = new Buffer(transaction.senderPublicKey, "hex");
	var res = nacl.sign.detached.verify(hash, signatureBuffer, senderPublicKeyBuffer);

	return res;
}

function verifySecondSignature(transaction, publicKey) {
	var bytes = getBytes(transaction);
	var data2 = new Buffer(bytes.length - 64);

	for (var i = 0; i < data2.length; i++) {
		data2[i] = bytes[i];
	}

	var hash = sha256Bytes(data2)

	var signSignatureBuffer = new Buffer(transaction.signSignature, "hex");
	var publicKeyBuffer = new Buffer(publicKey, "hex");
	var res = nacl.sign.detached.verify(hash, signSignatureBuffer, publicKeyBuffer);

	return res;
}

function verifyBytes(bytes, signature, publicKey) {
	var hash = sha256Bytes(new Buffer(bytes, 'hex'))
	var signatureBuffer = new Buffer(signature, "hex");
	var publicKeyBuffer = new Buffer(publicKey, "hex");
	var res = nacl.sign.detached.verify(hash, signatureBuffer, publicKeyBuffer);
	return res
}

function getKeys(secret) {
	var hash = sha256Bytes(new Buffer(secret))
	var keypair = nacl.sign.keyPair.fromSeed(hash);

	return {
		keypair,
		publicKey: new Buffer(keypair.publicKey).toString("hex"),
		privateKey: new Buffer(keypair.secretKey).toString("hex")
	}
}

function getAddress(publicKey) {
	return addressHelper.generateBase58CheckAddress(publicKey)
}

module.exports = {
	getBytes: getBytes,
	getHash: getHash,
	getId: getId,
	getFee: getFee,
	sign: sign,
	secondSign: secondSign,
	getKeys: getKeys,
	getAddress: getAddress,
	verify: verify,
	verifySecondSignature: verifySecondSignature,
	fixedPoint: fixedPoint,
	signBytes: signBytes,
	toLocalBuffer: toLocalBuffer,
	verifyBytes: verifyBytes,
	isAddress: addressHelper.isAddress,
	isBase58CheckAddress: addressHelper.isBase58CheckAddress
}
