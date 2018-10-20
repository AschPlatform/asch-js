var Buffer = require("buffer/").Buffer;
var crypto_lib = require("crypto-browserify");
var should = require("should");
var asch = require("../index.js");

var options = {
  "name": "asch-chain-cctime",
  "link": "https://github.com/AschPlatform/asch-chain-cctime/archive/master.zip",
  "desc": "Decentralized news channel",
  "icon": "http://o7dyh3w0x.bkt.clouddn.com/hello.png",
  "delegates": [
    "8b1c24a0b9ba9b9ccf5e35d0c848d582a2a22cca54d42de8ac7b2412e7dc63d4",
    "aa7dcc3afd151a549e826753b0547c90e61b022adb26938177904a73fc4fee36",
    "e29c75979ac834b871ce58dc52a6f604f8f565dea2b8925705883b8c001fe8ce",
    "55ad778a8ff0ce4c25cb7a45735c9e55cf1daca110cfddee30e789cb07c8c9f3",
    "982076258caab20f06feddc94b95ace89a2862f36fea73fa007916ab97e5946a"
  ],
  "unlockDelegates": 3
};



describe("chain.js", () => {
  var chain = asch.chain;

  var createChain = chain.createChain;
  var trs;
  var keys;
  var secondKeys;


  beforeEach(() => {
    trs = createChain(options, "secret", null);
    keys = asch.crypto.getKeys("secret");
    secondKeys = asch.crypto.getKeys("secret 2");
  })

  afterEach(() => {
    trs = null;
  })

  it("should be object", () => {
    (chain).should.be.type("object");
  });

  it("should have properties", () => {
    (chain).should.have.property("createChain");
  })

  describe("#createChain", () => {
    it("should be a function", () => {
      (createChain).should.be.type("function");
    });

    it("should create chain without second signature", () => {
      trs = createChain(options, "secret", null);
      (trs).should.be.ok;
    });

    it("should create chain with second signature", () => {
      trs = createChain(options, "secret", "secret 2");
      (trs).should.be.ok;
    });

    describe("returned chain", () => {
      it("should be object", () => {
        (trs).should.be.type("object");
      });

      it("should have id as string", () => {
        (trs.id).should.be.type("string");
      });

      it("should have type as number and equal 200", () => {
        (trs.type).should.be.type("number").and.equal(200);
      });

      it("should have fee as number and equal 10000000000", () => {
        (trs.fee).should.be.type("number").and.equal(10000000000);
      });

      it("should have senderPublicKey as hex string", () => {
        (trs.senderPublicKey).should.be.type("string").and.match(function (given) {
          try {
            new Buffer("hex");
          } catch (e) {
            return false;
          }

          return true;
        })
      });

      it("should have timestamp as number", () => {
        (trs.timestamp).should.be.type("number").and.not.NaN;
      });

      it("should have args as array", () => {
        (trs.args).should.be.an.Array();
      });

      describe("chain args", () => {
        it("should be ok", () => {
          (trs.args).should.be.ok;
        })

        it("should be an array", () => {
          (trs.args).should.be.an.Array()
        });

        it("should have name item", () => {
          should(trs.args[0]).be.type("string").and.equal(options.name);
        });

        it("should have description item", () => {
          should(trs.args[1]).be.type("string").and.equal(options.desc);
        });

        it("should have link item", () => {
          (trs.args[2]).should.be.type("string").and.equal(options.link);
        });

        it("should have icon item", () => {
          (trs.args[3]).should.be.type("string").and.equal(options.icon);
        });

        it("should have delegates item", () => {
          (trs.args[4]).should.be.an.Array().and.equal(options.delegates)
        })

        it("should have unlockDelegates item", () => {
          (trs.args[5]).should.be.type("number").and.equal(options.unlockDelegates);
        });
      });

      it("should have signature as hex string in signatures array", () => {
        (trs.signatures[0]).should.be.type("string").and.match(() => {
          try {
            new Buffer(trs.signatures[0], "hex")
          } catch (e) {
            return false;
          }
          return true;
        })
      });

      it("should have second signature in hex", () => {
        trs = createChain(options, "secret", "secret 2");
        (trs).should.have.property("secondSignature").and.type("string").and.match(() => {
          try {
            new Buffer(trs.secondSignature, "hex");
          } catch (e) {
            return false;
          }
          return true;
        });
      });

      it("should be signed correctly", () => {
        var result = asch.crypto.verify(trs);
        
        (result).should.be.ok;
      });

      it("should not be signed correctly now", () => {
        trs.amount = 10000;
        var result = asch.crypto.verify(trs);
        (result).should.be.not.ok;
      });

      it("should be second signed correctly", () => {
        trs = createChain(options, "secret", "secret 2");

        trs.amount = 0;
        var result = asch.crypto.verifySecondSignature(trs, secondKeys.publicKey);
        (result).should.be.ok;
      });

      it("should not be second signed correctly now", () => {
        trs = createChain(options, "secret", "secret 2");

        trs.amount = 10000;
        var result = asch.crypto.verifySecondSignature(trs, secondKeys.publicKey);
        (result).should.be.not.ok;
      });

      it("should be ok to verify bytes", () => {
        var data1 = 'a1b2c3d4';
        var secret = 'secret1';
        var keys = asch.crypto.getKeys(secret);
        var signature = asch.crypto.signBytes(data1, keys);
        var result = asch.crypto.verifyBytes(data1, signature, keys.publicKey);
        (result).should.be.ok;

        var data2 = new Buffer('a1b2c3d4', 'hex');
        signature = asch.crypto.signBytes(data2, keys);
        result = asch.crypto.verifyBytes(data2, signature, keys.publicKey);
        (result).should.be.ok;
      })
    });
  });
});