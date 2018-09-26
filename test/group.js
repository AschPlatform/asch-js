var Buffer = require("buffer/").Buffer;
var crypto_lib = require("crypto-browserify");
var should = require("should");
var asch = require("../index.js");

var options = {
  "groupName": "Firstgroup",
  "members": [
    {"address":"AEGeVrVAMrwQNv6MmTxdLvh4F5JywFLCcV","name":"member1","weight":1},
    {"address":"ABP7wcfxjcKAf1TbiPfsfUrW1rEqJg2xRJ","name":"member2","weight":2},
    {"address":"A4eFzojmdZKZq9eq1J8xQUEUyUmkkoGiWJ","name":"member3","weight":3}
  ],
  "min": 3,
  "max": 5,
  "m": 3,
  "updateInterval": "http://o7dyh3w0x.bkt.clouddn.com/hello.png",
};

describe("group.js", () => {
  var group = asch.group;
  var registerGroup = group.registerGroup;

  it("should be ok", () => {
    (group).should.be.ok;
  });

  it("should be object", () => {
    (group).should.be.type("object");
  });
  
  it("should have registerGroup property", () => {
    (group).should.have.property("registerGroup");
  });

  it("should have voteTransaction property", () => {
    (group).should.have.property("voteTransaction");
  })

  it("should have activateTransaction property", () => {
    (group).should.have.property("activateTransaction");
  })

  it("should have addMember property", () => {
    (group).should.have.property("addMember");
  })

  it("should have removeMember property", () => {
    (group).should.have.property("removeMember");
  })

  describe("#registerGroup", () => {
    it("should be a function", () => {
      (registerGroup).should.be.type("function");
    });

    it("should create dapp without second signature", () => {
      trs = registerGroup(options, "secret", null);
      (trs).should.be.ok;
    });

    it("should create dapp with second signature", () => {
      trs = registerGroup(options, "secret", "secret 2");
      (trs).should.be.ok;
    });
  });    

  describe("#voteGroup", () => {

  });

  describe("#activateGroup", () => {

  });

  describe("#addMember", () => {

  });

  describe("#removeMember", () => {

  });
});