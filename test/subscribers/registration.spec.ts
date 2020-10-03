import chai from "chai";
import spies from "chai-spies";

import { registerEventEmitter } from "../../src/subscribers/registration";
import { EventEmitter } from "events";

chai.use(spies);

const expect = chai.expect;

describe("Subscribers", () => {
  describe("Registration", () => {
    it("should not receive any registration event", () => {
      const eventEmitter = new EventEmitter();
      const spy = chai.spy();

      registerEventEmitter(eventEmitter, spy);

      expect(spy).to.have.been.called.exactly(0);
    });

    it("should receive one registration event", () => {
      const eventEmitter = new EventEmitter();
      const spy = chai.spy();
      const device = {
        authorization: {
          name: "Mike Donovan",
          role: "Engineer",
          deedOwner: "U.S. Robots and Mechanical Men",
        },
        geoPosition: {
          type: "Point",
          coordinates: { longitude: -139.43114, latitude: 64.065085 },
        },
        identification: {
          company: "U.S. Robots and Mechanical Men",
          device: "SPD-13",
          schedule: [
            { dateTime: "2015-07-07T08:00:00.00Z", description: "mining" },
          ],
          version: "13",
        },
        timestamp: "2015-01-01T00:00:00.00Z",
        uuid: "50b56281-1d81-4db1-b739-1ea234d16b1c",
      };

      registerEventEmitter(eventEmitter, spy);
      eventEmitter.emit("registration", device);

      expect(spy).to.have.been.called.exactly(1);
    });

    it("should receive two registration events", () => {
      const eventEmitter = new EventEmitter();
      const spy = chai.spy();
      const device = {
        authorization: {
          name: "Mike Donovan",
          role: "Engineer",
          deedOwner: "U.S. Robots and Mechanical Men",
        },
        geoPosition: {
          type: "Point",
          coordinates: { longitude: -139.43114, latitude: 64.065085 },
        },
        identification: {
          company: "U.S. Robots and Mechanical Men",
          device: "SPD-13",
          schedule: [
            { dateTime: "2015-07-07T08:00:00.00Z", description: "mining" },
          ],
          version: "13",
        },
        timestamp: "2015-01-01T00:00:00.00Z",
        uuid: "50b56281-1d81-4db1-b739-1ea234d16b1c",
      };

      registerEventEmitter(eventEmitter, spy);
      eventEmitter.emit("registration", device);
      eventEmitter.emit("registration", device);

      expect(spy).to.have.been.called.exactly(2);
    });
  });
});
