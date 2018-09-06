var Buffer = require("buffer/").Buffer;
var crypto_lib = require("crypto-browserify");
var should = require("should");
var asch = require("../index.js");

describe("transaction.js", () => {
  var transaction = asch.transaction;

  it("should be object", () => {
    (transaction).should.be.type("object");
  });

  it("should have properties", () => {
    (transaction).should.have.property("createTransaction");
  })

  describe("#createTransaction", () => {
    var createTransaction = transaction.createTransaction;
    var trs;

    beforeEach(() => {
      trs = createTransaction("AHMCKebuL2nRYDgszf9J2KjVZzAw95WUyB", 1000, "", "secret");
    })

    afterEach(() => {
      trs = null;
    });


    it("should be a function", () => {
      (createTransaction).should.be.type("function");
    });

    it("should create transaction without second signature", () => {
      trs = createTransaction("AHMCKebuL2nRYDgszf9J2KjVZzAw95WUyB", 1000, "", "secret");
      (trs).should.be.ok;
    });

    describe("returned transaction", () => {
      it("should be object", () => {
        (trs).should.be.type("object");
      });

      it("should have id as string", () => {
        (trs.id).should.be.type("string");
      });

      it("should have type as number and eqaul 1", () => {
        (trs.type).should.be.type("number").and.equal(1);
      });

      it("should have timestamp as number", () => {
        (trs.timestamp).should.be.type("number").and.not.NaN;
      });

      it("should have senderPublicKey as hex string", () => {
        (trs.senderPublicKey).should.be.type("string").and.match(() => {
          try {
            new Buffer(trs.senderPublicKey, "hex")
          } catch (e) {
            return false;
          }

          return true;
        })
      });

      it("should have args array and amount of 1000 at first position", () => {
        (trs.args[0]).should.be.type("number").and.equal(1000)
      });

      it("should have args array and recipient AHMCKebuL2nRYDgszf9J2KjVZzAw95WUyB at second position", () => {
        (trs.args[1]).should.be.type("string").and.equal("AHMCKebuL2nRYDgszf9J2KjVZzAw95WUyB");
      });

      it("should does not have second signature", () => {
        (trs).should.not.have.property("signSignature");
      });

      it("should have signature as hex string", () => {
        (trs.signatures[0]).should.be.type("string").and.match(() => {
          try {
            new Buffer(trs.signatures[0], "hex")
          } catch (e) {
            return false;
          }

          return true;
        })
      });

      it.skip("should be signed correctly", () => {
        var result = asch.crypto.verify(trs);
        (result).should.be.ok;
      });

      it.skip("should not be signed correctly now", () => {
        trs.amount = 10000;
        var result = asch.crypto.verify(trs);
        (result).should.be.not.ok;
      });
    });
  });

  describe("#createTransaction with second secret", () => {
    var createTransaction = transaction.createTransaction;
    var trs;
    var secondSecret = "second secret";
    var keys = asch.crypto.getKeys(secondSecret);

    beforeEach(() => {
      trs = createTransaction("AHMCKebuL2nRYDgszf9J2KjVZzAw95WUyB", 1000, "", "secret", "second secret");
    });

    afterEach(() => {
      trs = null;
    })



    it("should be a function", () => {
      (createTransaction).should.be.type("function");
    });

    describe("returned transaction", () => {
      it("should be object", () => {
        (trs).should.be.type("object");
      });

      it("should have id as string", () => {
        (trs.id).should.be.type("string");
      });

      it("should have type as number and eqaul 1", () => {
        (trs.type).should.be.type("number").and.equal(1);
      });

      it("should have timestamp as number", () => {
        (trs.timestamp).should.be.type("number").and.not.NaN;
      });

      it("should have senderPublicKey as hex string", () => {
        (trs.senderPublicKey).should.be.type("string").and.match(() => {
          try {
            new Buffer(trs.senderPublicKey, "hex")
          } catch (e) {
            return false;
          }

          return true;
        })
      });

      it("should have args array and amount of 1000 at first position", () => {
        (trs.args[0]).should.be.type("number").and.equal(1000)
      });

      it("should have args array and recipient AHMCKebuL2nRYDgszf9J2KjVZzAw95WUyB at second position", () => {
        (trs.args[1]).should.be.type("string").and.equal("AHMCKebuL2nRYDgszf9J2KjVZzAw95WUyB");
      });

      it("should have second signature", () => {
        (trs).should.have.property("secondSignature");
      });

      it("should have signature as hex string", () => {
        (trs.signatures[0]).should.be.type("string").and.match(() => {
          try {
            new Buffer(trs.signatures[0], "hex")
          } catch (e) {
            return false;
          }

          return true;
        })
      });

      it("should have secondSignature as hex string", () => {
        (trs.secondSignature).should.be.type("string").and.match(() => {
          try {
            new Buffer(trs.secondSignature, "hex");
          } catch (e) {
            return false;
          }

          return true;
        });
      });

      it.skip("should be signed correctly", () => {
        var result = asch.crypto.verify(trs);
        (result).should.be.ok;
      });

      it.skip("should be second signed correctly", () => {
        var result = asch.crypto.verifySecondSignature(trs, keys.publicKey);
        (result).should.be.ok;
      });

      it.skip("should not be signed correctly now", () => {
        trs.amount = 10000;
        var result = asch.crypto.verify(trs);
        (result).should.be.not.ok;
      });

      it.skip("should not be second signed correctly now", () => {
        trs.amount = 10000;
        var result = asch.crypto.verifySecondSignature(trs, keys.publicKey);
        (result).should.be.not.ok;
      });
    });
  });
});