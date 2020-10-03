import chai from "chai";
import chaiExclude from "chai-exclude";

import {
  getDevices_,
  getDeviceForUuid_,
  getDevicesInGeofence_,
} from "../../src/services/deviceService";
import {
  startInMemoryMongoDB,
  stopInMemoryMongoDB,
  connectToMongoDb,
  disconnectFromTestMongoDb,
  getConnectionStringForInMemoryMongoDB,
  getConnectionStringForLocalMongoDB,
  insertDocument,
  removeAllDocuments,
} from "../db/mongodbUtil";
import { Device } from "../../src/types/device";
import { Geofence } from "../../src/types/geofence";

chai.use(chaiExclude);

const expect = chai.expect;

describe("Services", () => {
  describe("Device Service", () => {
    before((done) => {
      startInMemoryMongoDB()
        .then(getConnectionStringForInMemoryMongoDB)
        .then(connectToMongoDb)
        .then(done)
        .catch((error: any) => done(error));
    });

    after((done) => {
      disconnectFromTestMongoDb();
      stopInMemoryMongoDB()
        .then(() => done())
        .catch((error) => done(error));
    });

    afterEach((done) => {
      removeAllDocuments();
      done();
    });

    it("should return a list of all devices", (done) => {
      const deviceToInsert = {
        authorization: {
          name: "Mike Donovan",
          role: "Engineer",
          owner: "U.S. Robots and Mechanical Men",
        },
        geoposition: { type: "Point", coordinates: [-139.43114, 64.065085] },
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
      const expectedDevices = [
        {
          authorization: {
            name: "Mike Donovan",
            role: "Engineer",
            owner: "U.S. Robots and Mechanical Men",
          },
          geoPosition: {
            type: "Point",
            coordinates: { latitude: 64.065085, longitude: -139.43114 },
          },
          identification: {
            company: "U.S. Robots and Mechanical Men",
            device: "SPD-13",
            schedule: [
              { dateTime: "2015-07-07T08:00:00.00Z", description: "mining" },
            ],
            version: "13",
          },
          timestamp: "2015-01-01T00:00:00.000Z",
          uuid: "50b56281-1d81-4db1-b739-1ea234d16b1c",
        },
      ];

      insertDocument(deviceToInsert)
        .then(getDevices_)
        .then((devices: Device[]) => {
          expect(devices).to.be.an("array");
          expect(devices.length).to.equal(1);
          expect(devices).to.deep.equal(expectedDevices);
          done();
        })
        .catch((error: any) => done(error));
    });

    it("should return a device with a certain UUID", (done) => {
      const deviceToInsert = {
        authorization: {
          name: "Mike Donovan",
          role: "Engineer",
          owner: "U.S. Robots and Mechanical Men",
        },
        geoposition: { type: "Point", coordinates: [-139.43114, 64.065085] },
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
      const expectedDevice = {
        authorization: {
          name: "Mike Donovan",
          role: "Engineer",
          owner: "U.S. Robots and Mechanical Men",
        },
        geoPosition: {
          type: "Point",
          coordinates: { latitude: 64.065085, longitude: -139.43114 },
        },
        identification: {
          company: "U.S. Robots and Mechanical Men",
          device: "SPD-13",
          schedule: [
            { dateTime: "2015-07-07T08:00:00.00Z", description: "mining" },
          ],
          version: "13",
        },
        timestamp: "2015-01-01T00:00:00.000Z",
        uuid: "50b56281-1d81-4db1-b739-1ea234d16b1c",
      };

      insertDocument(deviceToInsert)
        .then(() => getDeviceForUuid_("50b56281-1d81-4db1-b739-1ea234d16b1c"))
        .then((device: Device) => {
          expect(device).to.be.an("object");
          expect(device).to.deep.equal(expectedDevice);
          done();
        })
        .catch((error: any) => done(error));
    });

    it("should return a list of all devices within a certain geofence", (done) => {
      const deviceToInsert = {
        authorization: {
          name: "Mike Donovan",
          role: "Engineer",
          owner: "U.S. Robots and Mechanical Men",
        },
        geoposition: { type: "Point", coordinates: [-139.43114, 64.065085] },
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
      const expectedDevices = [
        {
          authorization: {
            name: "Mike Donovan",
            role: "Engineer",
            owner: "U.S. Robots and Mechanical Men",
          },
          geoPosition: {
            type: "Point",
            coordinates: { latitude: 64.065085, longitude: -139.43114 },
          },
          identification: {
            company: "U.S. Robots and Mechanical Men",
            device: "SPD-13",
            schedule: [
              { dateTime: "2015-07-07T08:00:00.00Z", description: "mining" },
            ],
            version: "13",
          },
          timestamp: "2015-01-01T00:00:00.000Z",
          uuid: "50b56281-1d81-4db1-b739-1ea234d16b1c",
        },
      ];
      const geofence: Geofence = {
        latitude: 64.065085,
        longitude: -139.43114,
        radiusInMeters: 1000,
      };

      insertDocument(deviceToInsert)
        .then(() => getDevicesInGeofence_(geofence))
        .then((devices: Device[]) => {
          expect(devices).to.be.an("array");
          expect(devices.length).to.equal(1);
          expect(devices).to.deep.equal(expectedDevices);
          done();
        })
        .catch((error: any) => done(error));
    });
  });
});
