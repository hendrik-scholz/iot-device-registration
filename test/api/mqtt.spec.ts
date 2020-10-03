import chai from 'chai';
import chaiExclude from 'chai-exclude';
import mqtt from 'mqtt';
chai.use(chaiExclude);

const expect = chai.expect;

describe('API', () => {
  describe('MQTT', () => {
    const mqttHost = '127.0.0.1';
    const mqttPort = 1883;
    const mqttTopic = 'registration';

    it('should receive an MQTT message', (done) => {
      const message = {
        authorization: {
          name: 'Mike Donovan',
          role: 'Engineer',
          deedOwner: 'U.S. Robots and Mechanical Men',
        },
        geoPosition: {
          type: 'Point',
          coordinates: {
            longitude: -139.43114,
            latitude: 64.065085,
          },
        },
        identification: {
          company: 'U.S. Robots and Mechanical Men',
          device: 'SPD-13',
          schedule: [
            {
              dateTime: '2015-07-07T08:00:00.00Z',
              description: 'mining',
            },
          ],
          version: '13',
        },
        timestamp: '2015-01-01T00:00:00.00Z',
        uuid: '50b56281-1d81-4db1-b739-1ea234d16b1c',
      };

      const mqttClient = mqtt.connect(`mqtt:${mqttHost}:${mqttPort}`);

      mqttClient.on('connect', () => {
        mqttClient.publish(mqttTopic, JSON.stringify(message));
        mqttClient.end();
        done();
      });
    });
  });
});
