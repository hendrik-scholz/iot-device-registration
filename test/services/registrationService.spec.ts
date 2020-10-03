import chai from 'chai';
import chaiExclude from 'chai-exclude';

import { getDevices } from '../../src/db/mongodb';
import { registerDevice } from '../../src/services/registrationService';
import { Device } from '../../src/types/device';

chai.use(chaiExclude);

const expect = chai.expect;

describe('Services', () => {
  describe('Registration Service', () => {
    it('should save a registration message', (done) => {
      const deviceToSave = {
        authorization: {
          name: 'Mike Donovan',
          role: 'Engineer',
          deedOwner: 'U.S. Robots and Mechanical Men',
        },
        geoPosition: {
          type: 'Point',
          coordinates: { longitude: -139.43114, latitude: 64.065085 },
        },
        identification: {
          company: 'U.S. Robots and Mechanical Men',
          device: 'SPD-13',
          schedule: [
            { dateTime: '2015-07-07T08:00:00.00Z', description: 'mining' },
          ],
          version: '13',
        },
        timestamp: '2015-01-01T00:00:00.00Z',
        uuid: '50b56281-1d81-4db1-b739-1ea234d16b1c',
      };
      const expectedDevices = [
        {
          authorization: {
            name: 'Mike Donovan',
            role: 'Engineer',
            owner: 'U.S. Robots and Mechanical Men',
          },
          geoPosition: {
            type: 'Point',
            coordinates: { latitude: 64.065085, longitude: -139.43114 },
          },
          identification: {
            company: 'U.S. Robots and Mechanical Men',
            device: 'SPD-13',
            schedule: [
              { dateTime: '2015-07-07T08:00:00.00Z', description: 'mining' },
            ],
            version: '13',
          },
          timestamp: '2015-01-01T00:00:00.000Z',
          uuid: '50b56281-1d81-4db1-b739-1ea234d16b1c',
        },
      ];

      registerDevice(deviceToSave)
        .then(getDevices)
        .then((devices: Device[]) => {
          expect(devices).to.be.an('array');
          expect(devices.length).to.equal(1);
          expect(devices).to.deep.equal(expectedDevices);
          done();
        })
        .catch((error: any) => done(error));
    });
  });
});
