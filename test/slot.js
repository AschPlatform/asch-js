var Buffer = require("buffer/").Buffer;
var crypto_lib = require("crypto-browserify");
var should = require("should");
var asch = require("../index.js");


describe("slots.js", () => {
  var slots = require("../lib/time/slots.js");

  it("should be ok", () => {
    (slots).should.be.ok;
  });

  it("should be object", () => {
    (slots).should.be.type("object");
  });

  it("should have properties", () => {
    var properties = ["interval", "delegates", "getTime", "getRealTime", "getSlotNumber", "getSlotTime", "getNextSlot", "getLastSlot"];
    properties.forEach(function (property) {
      (slots).should.have.property(property);
    });
  });

  describe(".interval", () => {
    var interval = slots.interval;

    it("should be ok", () => {
      (interval).should.be.ok;
    });

    it("should be number and not NaN", () => {
      (interval).should.be.type("number").and.not.NaN;
    });
  });

  describe(".delegates", () => {
    var delegates = slots.delegates;

    it("should be ok", () => {
      (delegates).should.be.ok;
    });

    it("should be number and not NaN", () => {
      (delegates).should.be.type("number").and.not.NaN;
    });
  });

  describe("#getTime", () => {
    var getTime = slots.getTime;

    it("should be ok", () => {
      (getTime).should.be.ok;
    });

    it("should be a function", () => {
      (getTime).should.be.type("function");
    });

    it("should return epoch time as number, equal to 2764800", () => {
      var d = 1469822400000;
      var time = getTime(d);
      (time).should.be.ok;
      (time).should.be.type("number").and.equal(2764800);
    });
  });

  describe("#getRealTime", () => {
    var getRealTime = slots.getRealTime;

    it("should be ok", () => {
      (getRealTime).should.be.ok;
    });

    it("should be a function", () => {
      (getRealTime).should.be.type("function");
    });

    it("should return return real time, convert 196144 to 1467253744000", () => {
      var d = 196144;
      var real = getRealTime(d);
      (real).should.be.ok;
      (real).should.be.type("number").and.equal(1467253744000);
    });
  });

  describe("#getSlotNumber", () => {
    var getSlotNumber = slots.getSlotNumber;

    it("should be ok", () => {
      (getSlotNumber).should.be.ok;
    });

    it("should be a function", () => {
      (getSlotNumber).should.be.type("function");
    });

    it("should return slot number, equal to 19614", () => {
      var d = 196144;
      var slot = getSlotNumber(d);
      (slot).should.be.ok;
      (slot).should.be.type("number").and.equal(19614);
    });
  });

  describe("#getSlotTime", () => {
    var getSlotTime = slots.getSlotTime;

    it("should be ok", () => {
      (getSlotTime).should.be.ok;
    });

    it("should be function", () => {
      (getSlotTime).should.be.type("function");
    });

    it("should return slot time number, equal to ", () => {
      var slot = 19614;
      var slotTime = getSlotTime(19614);
      (slotTime).should.be.ok;
      (slotTime).should.be.type("number").and.equal(196140);
    });
  });

  describe("#getNextSlot", () => {
    var getNextSlot = slots.getNextSlot;

    it("should be ok", () => {
      (getNextSlot).should.be.ok;
    });

    it("should be function", () => {
      (getNextSlot).should.be.type("function");
    });

    it("should return next slot number", () => {
      var nextSlot = getNextSlot();
      (nextSlot).should.be.ok;
      (nextSlot).should.be.type("number").and.not.NaN;
    });
  });

  describe("#getLastSlot", () => {
    var getLastSlot = slots.getLastSlot;

    it("should be ok", () => {
      (getLastSlot).should.be.ok;
    });

    it("should be function", () => {
      (getLastSlot).should.be.type("function");
    });

    it("should return last slot number", () => {
      var lastSlot = getLastSlot(slots.getNextSlot());
      (lastSlot).should.be.ok;
      (lastSlot).should.be.type("number").and.not.NaN;
    });
  });
});