var Buffer = require("buffer/").Buffer;
var crypto_lib = require("crypto-browserify");
var should = require("should");
var asch = require("../index.js");

describe.skip("signature.js", () => {
  var signature = asch.signature;
  it("should be ok", () => {
    (signature).should.be.ok;
  });

  it("should be object", () => {
    (signature).should.be.type("object");
  });

  it("should have properties", () => {
    (signature).should.have.property("createSignature");
  });

  describe("#createSignature", () => {
    var createSignature = signature.createSignature;
    var sgn = null;

    it("should be function", () => {
      (createSignature).should.be.type("function");
    });

    it("should create signature transaction", () => {
      sgn = createSignature("secret", "second secret");
      (sgn).should.be.ok;
      (sgn).should.be.type("object");
    });

    describe("returned signature transaction", () => {
      it("should have empty recipientId", () => {
        (sgn).should.have.property("recipientId").equal(null);
      });

      it("should have amount equal 0", () => {
        (sgn.amount).should.be.type("number").equal(0);
      });

      it("should have asset", () => {
        (sgn.asset).should.be.type("object");
        (sgn.asset).should.be.not.empty;
      });

      it("should have signature inside asset", () => {
        (sgn.asset).should.have.property("signature");
      });

      describe("signature asset", () => {
        it("should be ok", () => {
          (sgn.asset.signature).should.be.ok;
        })

        it("should be object", () => {
          (sgn.asset.signature).should.be.type("object");
        });

        it("should have publicKey property", () => {
          (sgn.asset.signature).should.have.property("publicKey");
        });

        it("should have publicKey in hex", () => {
          (sgn.asset.signature.publicKey).should.be.type("string").and.match(() => {
            try {
              new Buffer(sgn.asset.signature.publicKey);
            } catch (e) {
              return false;
            }

            return true;
          });
        });

        it("should have publicKey in 32 bytes", () => {
          var publicKey = new Buffer(sgn.asset.signature.publicKey, "hex");
          (publicKey.length).should.be.equal(32);
        });
      });
    });
  });
});