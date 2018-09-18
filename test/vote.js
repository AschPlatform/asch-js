var Buffer = require("buffer/").Buffer;
var crypto_lib = require("crypto-browserify");
var should = require("should");
var asch = require("../index.js");

describe("vote.js", () => {
  var vote = asch.vote;

  it("should be ok", () => {
    (vote).should.be.ok;
  });

  it("should be object", () => {
    (vote).should.be.type("object");
  });

  it("should have createVote property", () => {
    (vote).should.have.property("createVote");
  });

  it("should have deleteVote property", () => {
    (vote).should.have.property("deleteVote");
  })

  describe("#createVote", () => {
    var createVote = vote.createVote,
      vt = null,
      publicKey = asch.crypto.getKeys("secret").publicKey,
      publicKeys = ["+" + publicKey];

    it("should be ok", () => {
      (createVote).should.be.ok;
    });

    it("should be function", () => {
      (createVote).should.be.type("function");
    });

    it("should create vote", () => {
      vt = createVote(publicKeys, "secret", "second secret");
      vt.should.be.ok;
    });

    describe("returned vote", () => {
      it("should be ok", () => {
        (vt).should.be.ok;
      });

      it("should be object", () => {
        (vt).should.be.type("object");
      });

      it("should have type number equal to 11", () => {
        (vt).should.have.property("type").and.be.type("number").and.equal(11);
      });

      it("should have timestamp number", () => {
        (vt).should.have.property("timestamp").and.be.type("number");
      });

      it("should have senderPublicKey hex string equal to sender public key", () => {
        (vt).should.have.property("senderPublicKey").and.be.type("string").and.match(() => {
          try {
            new Buffer(vt.senderPublicKey, "hex");
          } catch (e) {
            return false;
          }

          return true;
        }).and.equal(publicKey);
      });

      it("should have signatures array with hex string", () => {
        (vt).should.have.property("signatures").and.be.an.Array().and.match(() => {
          try {
            new Buffer(vt.signatures[0], "hex");
          } catch (e) {
            return false;
          }

          return true;
        });
      });

      it("should have secondSignature as hex string", () => {
        (vt).should.have.property("secondSignature").and.be.type("string").and.match(() => {
          try {
            new Buffer(vt.secondSignature, "hex");
          } catch (e) {
            return false;
          }

          return true;
        });
      });

      it("should be signed correctly", () => {
        var result = asch.crypto.verify(vt);
        (result).should.be.ok;
      });

      it("should be second signed correctly", () => {
        var result = asch.crypto.verifySecondSignature(vt, asch.crypto.getKeys("second secret").publicKey);
        (result).should.be.ok;
      });

      it("should not be signed correctly now", () => {
        vt.amount = 100;
        var result = asch.crypto.verify(vt);
        (result).should.be.not.ok;
      });

      it("should not be second signed correctly now", () => {
        vt.amount = 100;
        var result = asch.crypto.verifySecondSignature(vt, asch.crypto.getKeys("second secret").publicKey);
        (result).should.be.not.ok;
      });

      it("should have args", () => {
        (vt).should.have.property("args").and.not.empty;
      });

      describe("vote args", () => {
        it("should be ok", () => {
          (vt.args).should.be.ok;
        });

        it("should be array", () => {
          (vt.args).should.be.an.Array();
        });

        it("should be not empty", () => {
          (vt.args).should.be.not.empty;
        });

        it("should contain one element", () => {
          (vt.args.length).should.be.equal(1);
        });

        it("should have public keys in hex", () => {
          vt.args.forEach(function (v) {
            (v).should.be.type("string").startWith("+").and.match(() => {
              try {
                new Buffer(v.substring(1, v.length), "hex");
              } catch (e) {
                return false;
              }

              return true;
            });
          });
        });

        it("should be equal to sender public key", () => {
          var v = vt.args[0];
          (v.substring(1, v.length)).should.be.equal(publicKey);
        });
      })
    });
  });

  describe('#deleteVote', () => {
    var deleteVote = vote.deleteVote,
    vt = null,
    publicKey = asch.crypto.getKeys("secret").publicKey,
    publicKeys = ["-" + publicKey];

    it('should be ok', () => {
      (deleteVote).should.be.ok;
    });

    it('should be function', () => {
      (deleteVote).should.be.type("function");
    });

    it('should delete vote', () => {
      vt = deleteVote(publicKeys, "secret", "second secret");
      vt.should.be.ok;
    });

    describe('returned deleted vote', () => {
      it("should be ok", () => {
        (vt).should.be.ok;
      });

      it("should be object", () => {
        (vt).should.be.type("object");
      });

      it("should have type number equal to 12", () => {
        (vt).should.have.property("type").and.be.type("number").and.equal(12);
      });

      it("should have timestamp number", () => {
        (vt).should.have.property("timestamp").and.be.type("number");
      });

      it("should have senderPublicKey hex string equal to sender public key", () => {
        (vt).should.have.property("senderPublicKey").and.be.type("string").and.match(() => {
          try {
            new Buffer(vt.senderPublicKey, "hex");
          } catch (e) {
            return false;
          }

          return true;
        }).and.equal(publicKey)
      });

      it("should have signatures array with hex string", () => {
        (vt).should.have.property("signatures").and.be.an.Array().and.match(() => {
          try {
            new Buffer(vt.signatures[0], "hex");
          } catch (e) {
            return false;
          }

          return true;
        });
      });

      it("should have secondSignature as hex string", () => {
        (vt).should.have.property("secondSignature").and.be.type("string").and.match(() => {
          try {
            new Buffer(vt.secondSignature, "hex");
          } catch (e) {
            return false;
          }

          return true;
        });
      });

      it("should have args", () => {
        (vt).should.have.property("args").and.not.empty;
      });

      describe("deleted vote args", () => {
        it("should be ok", () => {
          (vt.args).should.be.ok;
        });

        it("should be array", () => {
          (vt.args).should.be.an.Array();
        });

        it("should be not empty", () => {
          (vt.args).should.be.not.empty;
        });

        it("should contain one element", () => {
          (vt.args.length).should.be.equal(1);
        });

        it("should have public keys in hex", () => {
          vt.args.forEach(function (v) {
            (v).should.be.type("string").startWith("-").and.match(() => {
              try {
                new Buffer(v.substring(1, v.length), "hex");
              } catch (e) {
                return false;
              }

              return true;
            });
          });
        });

        it("should be equal to sender public key", () => {
          var v = vt.args[0];
          (v.substring(1, v.length)).should.be.equal(publicKey);
        });

      });

    })
  })
});