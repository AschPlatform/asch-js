var Buffer = require("buffer/").Buffer;
var crypto_lib = require("crypto-browserify");
var should = require("should");
var asch = require("../index.js");

describe("agent.js", () => {
  var agent = asch.agent;

  it("should be ok", () => {
    (agent).should.be.ok;
  });

  it("should be object", () => {
    (agent).should.be.type("object");
  });

  describe("#registerAsAgent", () => {
    var registerAsAgent;
    var trs;

    beforeEach(() => {
      registerAsAgent = asch.agent.registerAsAgent;
      trs = registerAsAgent("secret");
    });

    afterEach(() => {
      trs = null;
    });

    it("should have property registerAsAgent", () => {
      (agent).should.have.property("registerAsAgent");
    });

    it("should be function", () => {
      (registerAsAgent).should.be.type("function");
    });

    it("should create registerAsAgent transaction", () => {
      (trs).should.be.ok;
      (trs).should.be.type("object");
    });

    describe("returned registerAsAgent transaction", () => {
      it("should have id as string", () => {
        (trs.id).should.be.type("string");
      });

      it("should have type as number and equal 7", () => {
        (trs.type).should.be.type("number").and.equal(7);
      });

      it("should have args as array with 0 items", () => {
        (trs.args).should.be.an.Array().with.a.lengthOf(0);
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
        trs.amount = 12242;
        var result = asch.crypto.verify(trs);
        (result).should.be.not.ok;
      });
    });
  });

  describe("#setAgent", () => {
    var setAgent;
    var trs;

    beforeEach(() => {
      setAgent = asch.agent.setAgent;
      trs = setAgent("sqfasd", "secret");
    });

    afterEach(() => {
      trs = null;
    });

    it("should have property setAgent", () => {
      (agent).should.have.property("setAgent");
    });

    it("should be function", () => {
      (setAgent).should.be.type("function");
    });

    it("should create setAgent transaction", () => {
      (trs).should.be.ok;
      (trs).should.be.type("object");
    });

    describe("returned setAgent transaction", () => {
      it("should have id as string", () => {
        (trs.id).should.be.type("string");
      });

      it("should have type as number and equal 8", () => {
        (trs.type).should.be.type("number").and.equal(8);
      });

      it("should have args as array with 1 item", () => {
        (trs.args).should.be.an.Array().with.a.lengthOf(1);
      });

      it("should have agent nickname as first item", () => {
        should(trs.args[0]).be.type("string").and.equal("sqfasd");
      });

      it("should have fee and equal 0.1 XAS", () => {
        (trs.fee).should.be.type("number").and.equal(0.1 * 1e8);
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
        trs.amount = 99944;
        var result = asch.crypto.verify(trs);
        (result).should.be.not.ok;
      });
    });
  });

  describe("#cancelAgent", () => {
    var cancelAgent;
    var trs;

    beforeEach(() => {
      cancelAgent = asch.agent.cancelAgent;
      trs = cancelAgent("secret");
    });

    afterEach(() => {
      trs = null;
    });

    it("should have property cancelAgent", () => {
      (agent).should.have.property("cancelAgent");
    });

    it("should be function", () => {
      (cancelAgent).should.be.type("function");
    });

    it("should create cancelAgent transaction", () => {
      (trs).should.be.ok;
      (trs).should.be.type("object");
    });

    describe("returned cancelAgent transaction", () => {
      it("should have id as string", () => {
        (trs.id).should.be.type("string");
      });

      it("should have type as number and equal 9", () => {
        (trs.type).should.be.type("number").and.equal(9);
      });

      it("should have args as array with 0 items", () => {
        (trs.args).should.be.an.Array().with.a.lengthOf(0);
      });

      it("should have fee and equal 0 XAS", () => {
        (trs.fee).should.be.type("number").and.equal(0);
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
        trs.amount = 2;
        var result = asch.crypto.verify(trs);
        (result).should.be.not.ok;
      });

    });
  });
});
