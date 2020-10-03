import chai from "chai";
import chaiExclude from "chai-exclude";

import {
  connectToMongoDbForConnectionString,
  disconnectFromMongoDb,
  saveDevice,
  getDevices,
  getDeviceForUuid,
  getDevicesInGeofence,
} from "../../src/db/mongodb";
import { Device } from "../../src/types/device";
import { Geofence } from "../../src/types/geofence";
import {
  startInMemoryMongoDB,
  stopInMemoryMongoDB,
  connectToMongoDb,
  disconnectFromTestMongoDb,
  getConnectionStringForInMemoryMongoDB,
  getConnectionStringForLocalMongoDB,
  insertDocument,
  removeAllDocuments,
} from "./mongodbUtil";
import mongoose, { Mongoose } from "mongoose";

chai.use(chaiExclude);

const expect = chai.expect;

describe("DB", () => {
  const readyStateDisconnected = 0;

  describe.skip("MongoDB (connect and disconnect)", () => {
    before((done) => {
      startInMemoryMongoDB()
        .then(() => done())
        .catch((error) => done(error));
    });

    after((done) => {
      stopInMemoryMongoDB()
        .then(() => done())
        .catch((error) => done(error));
    });

    it("should connect using a valid connection string", (done) => {
      connectToMongoDbForConnectionString(
        getConnectionStringForInMemoryMongoDB()
      )
        .then(() => {
          expect(mongoose.connection).to.be.an("object");
          return mongoose.connection.close();
        })
        .then(() => {
          expect(mongoose.connection.readyState).to.equal(
            readyStateDisconnected
          );
          done();
        })
        .catch((error: any) => done(error));
    });

    it("should disconnect", (done) => {
      connectToMongoDbForConnectionString(
        getConnectionStringForInMemoryMongoDB()
      )
        .then(() => {
          expect(mongoose.connection).to.be.an("object");
          return disconnectFromMongoDb();
        })
        .then(() => {
          expect(mongoose.connection.readyState).to.equal(
            readyStateDisconnected
          );
          done();
        })
        .catch((error: any) => done(error));
    });
  });

  describe("MongoDB (save and get)", () => {
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

    it("should save a device", (done) => {
      const deviceToSave = {
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

      saveDevice(deviceToSave)
        .then(getDevices)
        .then((devices: Device[]) => {
          expect(devices).to.be.an("array");
          expect(devices.length).to.equal(1);
          expect(devices).to.deep.equal(expectedDevices);
          done();
        })
        .catch((error: any) => done(error));
    });

    it("should return a list of all devices (empty list)", (done) => {
      getDevices()
        .then((devices: Device[]) => {
          expect(devices).to.be.an("array");
          expect(devices.length).to.equal(0);
          expect(devices).to.deep.equal([]);
          done();
        })
        .catch((error: any) => done(error));
    });

    it("should return a list of all devices (one device)", (done) => {
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
        .then(getDevices)
        .then((devices: Device[]) => {
          expect(devices).to.be.an("array");
          expect(devices.length).to.equal(1);
          expect(devices).to.deep.equal(expectedDevices);
          done();
        })
        .catch((error: any) => done(error));
    });

    it("should return a list of all devices (two devices)", (done) => {
      const deviceOneToInsert = {
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
      const deviceTwoToInsert = {
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
        uuid: "50b56281-1d81-4db1-b739-1ea234d16b1d",
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
          uuid: "50b56281-1d81-4db1-b739-1ea234d16b1d",
        },
      ];

      insertDocument(deviceOneToInsert)
        .then(() => insertDocument(deviceTwoToInsert))
        .then(getDevices)
        .then((devices: Device[]) => {
          expect(devices).to.be.an("array");
          expect(devices.length).to.equal(2);
          expect(devices).to.deep.equal(expectedDevices);
          done();
        })
        .catch((error: any) => done(error));
    });

    it("should return a device with a certain UUID (device not found)", (done) => {
      getDeviceForUuid("50b56281-1d81-4db1-b739-1ea234d16b1c")
        .then((device: Device) => {
          expect(device).to.be.undefined;
          done();
        })
        .catch((error: any) => done(error));
    });

    it("should return a device with a certain UUID (one device)", (done) => {
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
        .then(() => getDeviceForUuid("50b56281-1d81-4db1-b739-1ea234d16b1c"))
        .then((device: Device) => {
          expect(device).to.be.an("object");
          expect(device).to.deep.equal(expectedDevice);
          done();
        })
        .catch((error: any) => done(error));
    });

    it("should return a list of all devices within a certain geofence (no device in geofence)", (done) => {
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
      const geofence: Geofence = {
        latitude: 63.819538,
        longitude: -138.66694,
        radiusInMeters: 10000,
      };

      insertDocument(deviceToInsert)
        .then(() => getDevicesInGeofence(geofence))
        .then((devices: Device[]) => {
          expect(devices).to.be.an("array");
          expect(devices).to.deep.equal([]);
          done();
        })
        .catch((error: any) => done(error));
    });

    it("should return a list of all devices within a certain geofence (one of one device in geofence)", (done) => {
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
        .then(() => getDevicesInGeofence(geofence))
        .then((devices: Device[]) => {
          expect(devices).to.be.an("array");
          expect(devices.length).to.equal(1);
          expect(devices).to.deep.equal(expectedDevices);
          done();
        })
        .catch((error: any) => done(error));
    });

    it("should return a list of all devices within a certain geofence (one of two devices in geofence)", (done) => {
      const deviceOneToInsert = {
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
      const deviceTwoToInsert = {
        authorization: {
          name: "Mike Donovan",
          role: "Engineer",
          owner: "U.S. Robots and Mechanical Men",
        },
        geoposition: { type: "Point", coordinates: [-139.439101, 64.05817] },
        identification: {
          company: "U.S. Robots and Mechanical Men",
          device: "SPD-13",
          schedule: [
            { dateTime: "2015-07-07T08:00:00.00Z", description: "mining" },
          ],
          version: "13",
        },
        timestamp: "2015-01-01T00:00:00.00Z",
        uuid: "50b56281-1d81-4db1-b739-1ea234d16b1d",
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
        radiusInMeters: 500,
      };

      insertDocument(deviceOneToInsert)
        .then(() => insertDocument(deviceTwoToInsert))
        .then(() => getDevicesInGeofence(geofence))
        .then((devices: Device[]) => {
          expect(devices).to.be.an("array");
          expect(devices.length).to.equal(1);
          expect(devices).to.deep.equal(expectedDevices);
          done();
        })
        .catch((error: any) => done(error));
    });

    it("should return a list of all devices within a certain geofence (two of two devices in geofence)", (done) => {
      const deviceOneToInsert = {
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
      const deviceTwoToInsert = {
        authorization: {
          name: "Mike Donovan",
          role: "Engineer",
          owner: "U.S. Robots and Mechanical Men",
        },
        geoposition: { type: "Point", coordinates: [-139.439101, 64.05817] },
        identification: {
          company: "U.S. Robots and Mechanical Men",
          device: "SPD-13",
          schedule: [
            { dateTime: "2015-07-07T08:00:00.00Z", description: "mining" },
          ],
          version: "13",
        },
        timestamp: "2015-01-01T00:00:00.00Z",
        uuid: "50b56281-1d81-4db1-b739-1ea234d16b1d",
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
        {
          authorization: {
            name: "Mike Donovan",
            role: "Engineer",
            owner: "U.S. Robots and Mechanical Men",
          },
          geoPosition: {
            type: "Point",
            coordinates: { latitude: 64.05817, longitude: -139.439101 },
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
          uuid: "50b56281-1d81-4db1-b739-1ea234d16b1d",
        },
      ];
      const geofence: Geofence = {
        latitude: 64.065085,
        longitude: -139.43114,
        radiusInMeters: 1000,
      };

      insertDocument(deviceOneToInsert)
        .then(() => insertDocument(deviceTwoToInsert))
        .then(() => getDevicesInGeofence(geofence))
        .then((devices: Device[]) => {
          expect(devices).to.be.an("array");
          expect(devices.length).to.equal(2);
          expect(devices).to.deep.equal(expectedDevices);
          done();
        })
        .catch((error: any) => done(error));
    });
  });
});
