var Buffer = require("buffer/").Buffer;
var crypto_lib = require("crypto-browserify");
var should = require("should");
var asch = require("../index.js");

describe("crypto.js", () => {
  var crypto = asch.crypto;

  var bytes;
  var getBytes;
  var getHash;
  var getId;
  var getFee;
  var fixedPoint;
  var sign;
  var secondSign;
  var getKeys;
  var getAddress;
  var verify;
  var verifySecondSignature;

  beforeEach(() => {
    bytes = null;
    getBytes = crypto.getBytes;
    getHash = crypto.getHash;
    getId = crypto.getId;
    getFee = crypto.getFee;
    fixedPoint = crypto.fixedPoint;
    sign = crypto.sign;
    secondSign = crypto.secondSign;
    getKeys = crypto.getKeys;
    getAddress = crypto.getAddress;
    verify = crypto.verify;
    verifySecondSignature = crypto.verifySecondSignature;
  });

  afterEach(() => {
    bytes = null;
  });

  it("should be ok", () => {
    (crypto).should.be.ok;
  });

  it("should be object", () => {
    (crypto).should.be.type("object");
  });

  it("should has properties", () => {
    var properties = ["getBytes", "getHash", "getId", "getFee", "sign", "secondSign", "getKeys", "getAddress", "verify", "verifySecondSignature", "fixedPoint"];
    properties.forEach(function (property) {
      (crypto).should.have.property(property);
    });
  });

  describe("#getBytes", () => {
    it("should be ok", () => {
      (getBytes).should.be.ok;
    });

    it("should be a function", () => {
      (getBytes).should.be.type("function");
    });

    it("should return Buffer of simply transaction and buffer most be 165 length", () => {
      let transaction = {
        "type": 1,
        "timestamp": 68365026,
        "fee": 10000000,
        "args": [
          200000000000,
          "AHMCKebuL2nRYDgszf9J2KjVZzAw95WUyB"
        ],
        "senderPublicKey": "116025d5664ce153b02c69349798ab66144edd2a395e822b13587780ac9c9c09",
        "senderId": "ABuH9VHV3cFi9UKzcHXGMPGnSC4QqT2cZ5",
        "signatures": [
          "6b9a02208c0c36a0adf527d117cc3840f4b6c0a6eeac8cd212635f120592a101b68aeae0efe43ee28b0fd2add6fdb14f6b51b5ebff467b02909f4cdd66276603"
        ],
        "id": "43a9ed49665d7e905b717e54f39b1d9976e3332608bacf6083a3e130a0d12eed"
      }

      bytes = getBytes(transaction);
      should(bytes).be.ok;
      should(bytes).be.type("object");
      should(bytes.length).be.equal(165);
    });

    it("should return Buffer of transaction with second signature and buffer most be 229 length", () => {
      let transaction = {
        "type": 1,
        "timestamp": 68365928,
        "fee": 10000000,
        "args": [
          200000000000,
          "AHMCKebuL2nRYDgszf9J2KjVZzAw95WUyB"
        ],
        "senderPublicKey": "116025d5664ce153b02c69349798ab66144edd2a395e822b13587780ac9c9c09",
        "senderId": "ABuH9VHV3cFi9UKzcHXGMPGnSC4QqT2cZ5",
        "signatures": [
          "e1da25b8278d9cf4dcb32d8be73681ce701f0f01518b3d68e80c235a0f9d7d3fcfae7d454976f82535bc181fccd0f7cefc2fe3f1f158e76789a775bdce1d2906"
        ],
        "secondSignature": "067ec26a4bc1cb84926b49bb85e5701bebb2a8d4d4aef2c7fe075e2b6ca7e8a4c3ca77e709262d58760f4f3f3d00bdfc3f32c2be6c92856b29366e4d4ef77703",
        "id": "7608330225429661920fbdad67abc7c8b220c212a112bd76a1e33134cc082473"
      };

      bytes = getBytes(transaction);
      should(bytes).be.ok;
      should(bytes).be.type("object");
      should(bytes.length).be.equal(229);
    });
  });

  describe("#getHash", () => {
    it("should be ok", () => {
      (getHash).should.be.ok;
    });

    it("should be a function", () => {
      (getHash).should.be.type("function");
    })

    it("should return Buffer and Buffer must be 32 bytes length", () => {
      var transaction = {
        "type": 1,
        "timestamp": 68365026,
        "fee": 10000000,
        "args": [
          200000000000,
          "AHMCKebuL2nRYDgszf9J2KjVZzAw95WUyB"
        ],
        "senderPublicKey": "116025d5664ce153b02c69349798ab66144edd2a395e822b13587780ac9c9c09",
        "senderId": "ABuH9VHV3cFi9UKzcHXGMPGnSC4QqT2cZ5",
        "signatures": [
          "6b9a02208c0c36a0adf527d117cc3840f4b6c0a6eeac8cd212635f120592a101b68aeae0efe43ee28b0fd2add6fdb14f6b51b5ebff467b02909f4cdd66276603"
        ]
      };

      var result = getHash(transaction);
      should(result).be.ok;
      should(result).be.type("object");
      should(result.length).be.equal(32);
    });
  });

  describe("#getId", () => {
    it("should be ok", () => {
      (getId).should.be.ok;
    });

    it("should be a function", () => {
      (getId).should.be.type("function");
    });

    it("should return string id and be equal to 43a9ed49665d7e905b717...", () => {
      var transaction = {
        "type": 1,
        "timestamp": 68365026,
        "fee": 10000000,
        "args": [
          200000000000,
          "AHMCKebuL2nRYDgszf9J2KjVZzAw95WUyB"
        ],
        "senderPublicKey": "116025d5664ce153b02c69349798ab66144edd2a395e822b13587780ac9c9c09",
        "senderId": "ABuH9VHV3cFi9UKzcHXGMPGnSC4QqT2cZ5",
        "signatures": [
          "6b9a02208c0c36a0adf527d117cc3840f4b6c0a6eeac8cd212635f120592a101b68aeae0efe43ee28b0fd2add6fdb14f6b51b5ebff467b02909f4cdd66276603"
        ]
      };

      var id = getId(transaction);
      (id).should.be.type("string").and.equal("43a9ed49665d7e905b717e54f39b1d9976e3332608bacf6083a3e130a0d12eed");
    });
  });

  describe("#getFee", () => {
    it("should be ok", () => {
      (getFee).should.be.ok;
    });

    it("should be a function", () => {
      (getFee).should.be.type("function");
    });

    it("should return number", () => {
      var fee = getFee({ amount: 100000, type: 0 });
      (fee).should.be.type("number");
      (fee).should.be.not.NaN;
    });

    it("should return 10000000", () => {
      var fee = getFee({ amount: 100000, type: 0 });
      (fee).should.be.type("number").and.equal(10000000);
    });

    it("should return 10000000000", () => {
      var fee = getFee({ type: 1 });
      (fee).should.be.type("number").and.equal(10000000000);
    });

    it("should be equal 1000000000000", () => {
      var fee = getFee({ type: 2 });
      (fee).should.be.type("number").and.equal(1000000000000);
    });

    it("should be equal 100000000", () => {
      var fee = getFee({ type: 3 });
      (fee).should.be.type("number").and.equal(100000000);
    });
  });

  describe("fixedPoint", () => {
    it("should be ok", () => {
      (fixedPoint).should.be.ok;
    })

    it("should be number", () => {
      (fixedPoint).should.be.type("number").and.not.NaN;
    });

    it("should be equal 100000000", () => {
      (fixedPoint).should.be.equal(100000000);
    });
  });

  describe("#sign", () => {
    it("should be ok", () => {
      (sign).should.be.ok;
    });

    it("should be a function", () => {
      (sign).should.be.type("function");
    });
  });

  describe("#secondSign", () => {
    it("should be ok", () => {
      (secondSign).should.be.ok;
    });

    it("should be a function", () => {
      (secondSign).should.be.type("function");
    });
  });

  describe("#getKeys", () => {
    it("should be ok", () => {
      (getKeys).should.be.ok;
    });

    it("should be a function", () => {
      (getKeys).should.be.type("function");
    });

    it("should return two keys in hex", () => {
      let keys = getKeys("secret");

      (keys).should.be.ok;
      (keys).should.be.type("object");
      (keys).should.have.property("publicKey");
      (keys).should.have.property("privateKey");
      (keys.publicKey).should.be.type("string").and.match(() => {
        try {
          new Buffer(keys.publicKey, "hex");
        } catch (e) {
          return false;
        }

        return true;
      });
      (keys.privateKey).should.be.type("string").and.match(() => {
        try {
          new Buffer(keys.privateKey, "hex");
        } catch (e) {
          return false;
        }

        return true;
      });
    });
  });

  describe("#getAddress", () => {
    it("should be ok", () => {
      (getAddress).should.be.ok;
    })

    it("should be a function", () => {
      (getAddress).should.be.type("function");
    });

    it("should generate address by publicKey", () => {
      let keys = crypto.getKeys("secret");
      let address = getAddress(keys.publicKey);

      (address).should.be.ok;
      (address).should.be.type("string");
      (address).should.be.equal("AFkctfgZFkaATGRhGbj72wzJqACvMyzQ1U");
    });
  });

  describe("#verify", () => {
    it("should be ok", () => {
      (verify).should.be.ok;
    })

    it("should be function", () => {
      (verify).should.be.type("function");
    });
  });

  describe("#verifySecondSignature", () => {
    it("should be ok", () => {
      (verifySecondSignature).should.be.ok;
    });

    it("should be function", () => {
      (verifySecondSignature).should.be.type("function");
    });
  });
});