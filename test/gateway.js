var Buffer = require("buffer/").Buffer;
var should = require("should");
var asch = require("../index.js");

describe("gateway.js", () => {
  var gateway = asch.gateway;

  it("should be ok", () => {
    (gateway).should.be.ok;
  });

  it("should be object", () => {
    (gateway).should.be.type("object");
  });

  describe("#registerMember", () => {
    var registerMember;
    var trs;

    beforeEach(() => {
      registerMember = asch.gateway.registerMember;
      let publicKey = asch.crypto.getKeys("secret").publicKey;
      trs = registerMember("name", publicKey, "secret");
    });

    afterEach(() => {
      trs = null;
    });

    it("should have property registerMember", () => {
      (gateway).should.have.property("registerMember");
    });

    it("should be function", () => {
      (registerMember).should.be.type("function");
    });

    it("should create registerMember transaction", () => {
      (trs).should.be.ok;
      (trs).should.be.type("object");
    });

    describe("returned registerMember transaction", () => {
      it("should have id as string", () => {
        (trs.id).should.be.type("string");
      });

      it("should have type as number and equal 401", () => {
        (trs.type).should.be.type("number").and.equal(401);
      });

      it("should have args as array with 2 items", () => {
        (trs.args).should.be.an.Array().with.a.lengthOf(2);
      });

      it("should have gateway-name as first item", () => {
        should(trs.args[0]).be.type("string").and.equal("name");
      });

      it("should have publicKey from new member as second item", () => {
        should(trs.args[1]).be.type("string").and.equal("5d036a858ce89f844491762eb89e2bfbd50a4a0a0da658e4b2628b25b117ae09");
      });

      it("should have fee and equal 100 XAS", () => {
        (trs.fee).should.be.type("number").and.equal(100 * 1e8);
      });

      it("should have senderPublicKey as hex string", () => {
        (trs.senderPublicKey).should.be.type("string").and.match(function (given) {
          try {
            new Buffer(trs.senderPublicKey, "hex");
          } catch (e) {
            return false;
          }

          return true;
        });
      });

      it("should have one signature as hex string in signatures array", () => {
        (trs.signatures[0]).should.be.type("string").and.match(() => {
          try {
            new Buffer(trs.signatures[0], "hex")
          } catch (e) {
            return false;
          }
          return true;
        })
      });

      it("should be signed correctly", () => {
        var result = asch.crypto.verify(trs);

        (result).should.be.ok;
      });

      it("should not be signed correctly now", () => {
        trs.amount = 24242424;
        var result = asch.crypto.verify(trs);
        (result).should.be.not.ok;
      });
    });
  });
});
