var Buffer = require("buffer/").Buffer;
var crypto_lib = require("crypto-browserify");
var should = require("should");
var asch = require("../index.js");

describe("delegate.js", () => {
  var delegate = asch.delegate;
  var createDelegate;

  var keys;
  var secondKeys;
  var trs;

  beforeEach(() => {
    createDelegate = delegate.createDelegate;
    keys = asch.crypto.getKeys("secret");
    secondKeys = asch.crypto.getKeys("secret 2");
    trs = createDelegate("secret", "secret 2");
  });

  afterEach(() => {
    trs = null;
  });



  it("should be ok", () => {
    (delegate).should.be.ok;
  });

  it("should be function", () => {
    (delegate).should.be.type("object");
  });

  it("should have property createDelegate", () => {
    (delegate).should.have.property("createDelegate");
  });

  describe("#createDelegate", () => {
    it("should be ok", () => {
      (createDelegate).should.be.ok;
    });

    it("should be function", () => {
      (createDelegate).should.be.type("function");
    });

    it("should create delegate", () => {
      trs = createDelegate("secret", "secret 2");
    });

    describe("returned delegate", () => {
      it("should be ok", () => {
        (trs).should.be.ok;
      });

      it("should be object", () => {
        (trs).should.be.type("object");
      });

      it("should have type equal 10", () => {
        (trs).should.have.property("type").and.type("number").and.equal(10);
      });

      it("should have timestamp number", () => {
        (trs).should.have.property("timestamp").and.type("number");
      });

      it("should have senderPublicKey in hex", () => {
        (trs).should.have.property("senderPublicKey").and.type("string").and.match(() => {
          try {
            new Buffer(trs.senderPublicKey, "hex");
          } catch (e) {
            return false;
          }

          return true;
        }).and.equal(keys.publicKey);
      });

      it("should have signature in hex in signatures array", () => {
        (trs).should.have.property("signatures").and.be.an.Array().and.match(() => {
          try {
            new Buffer(trs.signatures[0], "hex");
          } catch (e) {
            return false;
          }

          return true;
        });
      });

      it("should have second signature in hex", () => {
        (trs).should.have.property("secondSignature").and.match(() => {
          try {
            new Buffer(trs.secondSignature, "hex");
          } catch (e) {
            return false;
          }

          return true;
        });
      });

      it("should have args array", () => {
        (trs).should.have.property("args").and.be.an.Array();
        (trs.args.length).should.equal(0);
      })

      it("should be signed correctly", () => {
        var result = asch.crypto.verify(trs, keys.publicKey);
        (result).should.be.ok;
      });

      it("should be second signed correctly", () => {
        var result = asch.crypto.verifySecondSignature(trs, secondKeys.publicKey);
        (result).should.be.ok;
      });

      it("should not be signed correctly now", () => {
        trs.amount = 100;
        var result = asch.crypto.verify(trs, keys.publicKey);
        (result).should.be.not.ok;
      });

      it("should not be second signed correctly now", () => {
        trs.amount = 100;
        var result = asch.crypto.verify(trs, secondKeys.publicKey);
        (result).should.be.not.ok;
      });
    });
  });
});