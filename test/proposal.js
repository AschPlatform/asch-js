var Buffer = require("buffer/").Buffer;
var should = require("should");
var asch = require("../index.js");

function cloneObject(obj) {
  var clone = JSON.parse(JSON.stringify(obj));
  return clone;
}

describe("proposal.js", () => {
  var proposal = asch.proposal;

  it("should be ok", () => {
    (proposal).should.be.ok;
  });

  it("should be object", () => {
    (proposal).should.be.type("object");
  });

  describe("#registerGateway", () => {
    var registerGateway;
    var options;
    var trs;

    beforeEach(() => {
      registerGateway = proposal.registerGateway;
      options = {
        gatewayName: "name",
        gatewayDesc: "desc",
        currencySymbol: "BTC",
        currencyDesc: "Bitcoin currency",
        currencyPrecision: 8,
        proposalEndHeight: 20000
      };
      trs = registerGateway(options, "secret");
    });

    afterEach(() => {
      trs = null;
    });

    it("should have property registerGateway", () => {
      (proposal).should.have.property("registerGateway");
    });

    it("should be function", () => {
      (registerGateway).should.be.type("function");
    });

    it("should create registerGateway transaction", () => {
      (trs).should.be.ok;
      (trs).should.be.type("object");
    });

    describe("returned registerGateway transaction", () => {
      it("should have id as string", () => {
        (trs.id).should.be.type("string");
      });

      it("should have type as number and equal 300", () => {
        (trs.type).should.be.type("number").and.equal(300);
      });

      it("should have args as array with 5 items", () => {
        (trs.args).should.be.an.Array().with.a.lengthOf(5);
      });

      it("should have fee and equal 10 XAS", () => {
        (trs.fee).should.be.type("number").and.equal(10 * 1e8);
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
        trs.amount = 2424;
        var result = asch.crypto.verify(trs);
        (result).should.be.not.ok;
      });

      describe("args", () => {

        it("should overwrite proposal title", () => {
          let newOptions = cloneObject(options);

          let proposalTitle = "overwritten title";
          newOptions.proposalTitle = proposalTitle;

          let trs = registerGateway(newOptions, "secret");
          should(trs.args[0]).be.type("string").and.equal("overwritten title");
        });

        it("should overwrite proposal description", () => {
          let newOptions = cloneObject(options);

          let proposalDesc = "overwritten description";
          newOptions.proposalDesc = proposalDesc;

          let trs = registerGateway(newOptions, "secret");
          should(trs.args[1]).be.type("string").and.equal("overwritten description");
        });

        it("should have proposal type gateway_register as 3rd item", () => {
          should(trs.args[2]).equal("gateway_register");
        });

        it("should set content.name", () => {
          should(trs.args[3]).have.property("name").and.equal("name");
        });

        it("should set content.desc", () => {
          should(trs.args[3]).have.property("desc").and.equal("desc");
        });

        it("should have default content.minimumMembers of 3", () => {
          let newOptions = cloneObject(options);

          let trs = registerGateway(newOptions, "secret");
          should(trs.args[3]).have.property("minimumMembers").and.equal(3);
        });

        it("should overwrite content.minimumMembers", () => {
          let newOptions = cloneObject(options);

          let newMinimumMembers = 5;
          newOptions.minimumMembers = newMinimumMembers;

          let trs = registerGateway(newOptions, "secret");
          should(trs.args[3]).have.property("minimumMembers").and.equal(5);
        });

        it("should have default content.updateInterval of 8640", () => {
          let newOptions = {
            gatewayName: "name",
            gatewayDesc: "desc",
            currencySymbol: "BTC",
            currencyDesc: "Bitcoin currency",
            currencyPrecision: 8,
            proposalEndHeight: 20000,
            updateInterval: undefined
          };

          let trs = registerGateway(newOptions, "secret");
          should(trs.args[3]).have.property("updateInterval").and.equal(8640);
        });

        it("should overwrite content.updateInterval", () => {
          let newOptions = cloneObject(options);

          let newUpdateInterval = 10000;
          newOptions.updateInterval = newUpdateInterval;

          let trs = registerGateway(newOptions, "secret");

          should(trs.args[3]).have.property("updateInterval").and.equal(10000);
        });

        it("should args have currency property of type object", () => {
          should(trs.args[3]).have.property("currency").and.be.type("object");
        });

        it("should set content.currency.symbol", () => {
          should(trs.args[3].currency).have.property("symbol").and.be.type("string").and.equal("BTC");
        });

        it("should set content.currency.desc", () => {
          should(trs.args[3].currency).have.property("desc").and.be.type("string").and.equal("Bitcoin currency");
        });

        it("should set content.currency.precision", () => {
          should(trs.args[3].currency).have.property("precision").and.be.type("number").and.equal(8);
        });

        it("should set proposalEndheight", () => {
          should(trs.args[4]).be.type("number").and.equal(20000);
        });
      });
    });
  });

  describe("#initGateway", () => {
    var initGateway;
    var options;
    var trs;

    beforeEach(() => {
      initGateway = proposal.initGateway;
      options = {
        gatewayName: 'name',
        gatewayMembers: [
          "address1",
          "address2",
          "address3"
        ],
        proposalEndHeight: 25000
      }
      trs = initGateway(options, "secret");
    });

    afterEach(() => {
      trs = null;
    });

    it("should have property initGateway", () => {
      (proposal).should.have.property("initGateway");
    });

    it("should be function", () => {
      (initGateway).should.be.type("function");
    });

    it("should create initGateway transaction", () => {
      (trs).should.be.ok;
      (trs).should.be.type("object");
    });

    describe("returned initGateway transaction", () => {
      it("should have id as string", () => {
        (trs.id).should.be.type("string");
      });

      it("should have type as number and equal 300", () => {
        (trs.type).should.be.type("number").and.equal(300);
      });

      it("should have args as array with 5 items", () => {
        (trs.args).should.be.an.Array().with.a.lengthOf(5);
      });

      it("should have fee and equal 10 XAS", () => {
        (trs.fee).should.be.type("number").and.equal(10 * 1e8);
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
        trs.amount = 2525;
        var result = asch.crypto.verify(trs);
        (result).should.be.not.ok;
      });

      describe("args", () => {
        it("should overwrite proposal title", () => {
          let newOptions = cloneObject(options);

          let proposalTitle = "overwritten title";
          newOptions.proposalTitle = proposalTitle;

          let trs = initGateway(newOptions, "secret");
          should(trs.args[0]).be.type("string").and.equal("overwritten title");
        });

        it("should overwrite proposal description", () => {
          let newOptions = cloneObject(options);

          let proposalDesc = "overwritten description";
          newOptions.proposalDesc = proposalDesc;

          let trs = initGateway(newOptions, "secret");
          should(trs.args[1]).be.type("string").and.equal("overwritten description");
        });

        it("should have proposal type gateway_init as 3rd item", () => {
          should(trs.args[2]).equal("gateway_init");
        });

        it("should set content.gateway", () => {
          should(trs.args[3]).have.property("gateway").and.equal("name");
        });

        it("should set content.members", () => {
          should(trs.args[3]).have.property("members").and.eql(["address1", "address2", "address3"]);
        });

        it("should set proposalEndheight", () => {
          should(trs.args[4]).be.type("number").and.equal(25000);
        });
      });
    });
  });

  describe("#updateGatewayMember", () => {
    var updateGatewayMember;
    var options;
    var trs;

    beforeEach(() => {
      updateGatewayMember = proposal.updateGatewayMember;
      options = {
        gatewayName: 'name',
        fromAddress: "fromAddress",
        toAddress: "toAddress",
        proposalEndHeight: 30000
      }
      trs = updateGatewayMember(options, "secret");
    });

    afterEach(() => {
      trs = null;
    });

    it("should have property updateGatewayMember", () => {
      (proposal).should.have.property("updateGatewayMember");
    });

    it("should be function", () => {
      (updateGatewayMember).should.be.type("function");
    });

    it("should create updateGatewayMember transaction", () => {
      (trs).should.be.ok;
      (trs).should.be.type("object");
    });

    describe("returned updateGatewayMember transaction", () => {
      it("should have id as string", () => {
        (trs.id).should.be.type("string");
      });

      it("should have type as number and equal 300", () => {
        (trs.type).should.be.type("number").and.equal(300);
      });

      it("should have args as array with 5 items", () => {
        (trs.args).should.be.an.Array().with.a.lengthOf(5);
      });

      it("should have fee and equal 10 XAS", () => {
        (trs.fee).should.be.type("number").and.equal(10 * 1e8);
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
        trs.amount = 2626;
        var result = asch.crypto.verify(trs);
        (result).should.be.not.ok;
      });

      describe("args", () => {
        it("should overwrite proposal title", () => {
          let newOptions = cloneObject(options);

          let proposalTitle = "overwritten title";
          newOptions.proposalTitle = proposalTitle;

          let trs = updateGatewayMember(newOptions, "secret");
          should(trs.args[0]).be.type("string").and.equal("overwritten title");
        });

        it("should overwrite proposal description", () => {
          let newOptions = cloneObject(options);

          let proposalDesc = "overwritten description";
          newOptions.proposalDesc = proposalDesc;

          let trs = updateGatewayMember(newOptions, "secret");
          should(trs.args[1]).be.type("string").and.equal("overwritten description");
        });

        it("should have proposal type gateway_update_member as 3rd item", () => {
          should(trs.args[2]).equal("gateway_update_member");
        });

        it("should set content.gateway", () => {
          should(trs.args[3]).have.property("gateway").and.equal("name");
        });

        it("should set content.from", () => {
          should(trs.args[3]).have.property("from").and.equal("fromAddress");
        });

        it("should set content.to", () => {
          should(trs.args[3]).have.property("to").and.equal("toAddress");
        });

        it("should set proposalEndheight", () => {
          should(trs.args[4]).be.type("number").and.equal(30000);
        });
      });
    });
  });

  describe("#revokeGateway", () => {
    var revokeGateway;
    var options;
    var trs;

    beforeEach(() => {
      revokeGateway = proposal.revokeGateway;
      options = {
        gatewayName: 'name',
        proposalEndHeight: 40000
      };
      trs = revokeGateway(options, "secret");
    });

    afterEach(() => {
      trs = null;
    });

    it("should have property revokeGateway", () => {
      (proposal).should.have.property("revokeGateway");
    });

    it("should be function", () => {
      (revokeGateway).should.be.type("function");
    });

    it("should create revokeGateway transaction", () => {
      (trs).should.be.ok;
      (trs).should.be.type("object");
    });

    describe("returned revokeGateway transaction", () => {
      it("should have id as string", () => {
        (trs.id).should.be.type("string");
      });

      it("should have type as number and equal 300", () => {
        (trs.type).should.be.type("number").and.equal(300);
      });

      it("should have args as array with 5 items", () => {
        (trs.args).should.be.an.Array().with.a.lengthOf(5);
      });

      it("should have fee and equal 10 XAS", () => {
        (trs.fee).should.be.type("number").and.equal(10 * 1e8);
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
        trs.amount = 2727;
        var result = asch.crypto.verify(trs);
        (result).should.be.not.ok;
      });

      describe("args", () => {
        it("should overwrite proposal title", () => {
          let newOptions = cloneObject(options);

          let proposalTitle = "overwritten title";
          newOptions.proposalTitle = proposalTitle;

          let trs = revokeGateway(newOptions, "secret");
          should(trs.args[0]).be.type("string").and.equal("overwritten title");
        });

        it("should overwrite proposal description", () => {
          let newOptions = cloneObject(options);

          let proposalDesc = "overwritten description";
          newOptions.proposalDesc = proposalDesc;

          let trs = revokeGateway(newOptions, "secret");
          should(trs.args[1]).be.type("string").and.equal("overwritten description");
        });

        it("should have proposal type gateway_revoke as 3rd item", () => {
          should(trs.args[2]).equal("gateway_revoke");
        });

        it("should set content.gateway", () => {
          should(trs.args[3]).have.property("gateway").and.equal("name");
        });

        it("should set proposalEndheight", () => {
          should(trs.args[4]).be.type("number").and.equal(40000);
        });
      });
    });
  });

  describe("#activateProposal", () => {
    var activateProposal;
    var trs;

    beforeEach(() => {
      activateProposal = proposal.activateProposal;
      let tid = "agey510fjyihfeijf"
      trs = activateProposal(tid, "secret");
    });

    afterEach(() => {
      trs = null;
    });

    it("should have property activateProposal", () => {
      (proposal).should.have.property("activateProposal");
    });

    it("should be function", () => {
      (activateProposal).should.be.type("function");
    });

    it("should create activateProposal transaction", () => {
      (trs).should.be.ok;
      (trs).should.be.type("object");
    });

    describe("returned activateProposal transaction", () => {
      it("should have id as string", () => {
        (trs.id).should.be.type("string");
      });

      it("should have type as number and equal 302", () => {
        (trs.type).should.be.type("number").and.equal(302);
      });

      it("should have args as array with 1 item", () => {
        (trs.args).should.be.an.Array().with.a.lengthOf(1);
      });

      it("should have fee and equal 0 XAS", () => {
        (trs.fee).should.be.type("number").and.equal(0 * 1e8);
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
        trs.amount = 2828;
        var result = asch.crypto.verify(trs);
        (result).should.be.not.ok;
      });

      describe("args", () => {
        it("should have transactionId to activate as only args item", () => {
          should(trs.args[0]).be.type("string").and.equal("agey510fjyihfeijf");
        });
      })
    });
  });


  describe("#upvoteProposal", () => {
    var upvoteProposal;
    var trs;

    beforeEach(() => {
      upvoteProposal = proposal.upvoteProposal;
      let tid = "92fygeohqncorfhFwgef"
      trs = upvoteProposal(tid, "secret");
    });

    afterEach(() => {
      trs = null;
    });

    it("should have property upvoteProposal", () => {
      (proposal).should.have.property("upvoteProposal");
    });

    it("should be function", () => {
      (upvoteProposal).should.be.type("function");
    });

    it("should create upvoteProposal transaction", () => {
      (trs).should.be.ok;
      (trs).should.be.type("object");
    });

    describe("returned upvoteProposal transaction", () => {
      it("should have id as string", () => {
        (trs.id).should.be.type("string");
      });

      it("should have type as number and equal 301", () => {
        (trs.type).should.be.type("number").and.equal(301);
      });

      it("should have args as array with 1 item", () => {
        (trs.args).should.be.an.Array().with.a.lengthOf(1);
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
        trs.amount = 2929;
        var result = asch.crypto.verify(trs);
        (result).should.be.not.ok;
      });

      describe("args", () => {
        it("should have upvoted transactionId as only args item", () => {
          should(trs.args[0]).be.type("string").and.equal("92fygeohqncorfhFwgef");
        });
      });
    });
  });
});
