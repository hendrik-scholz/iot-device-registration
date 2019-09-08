import chai from 'chai';

import { EventEmitter } from 'events';

import mqtt from 'mqtt';

const expect = chai.expect;

import { subscribeToRegisterTopic } from '../../src/mqtt/mqtt';

const mqttHost = '127.0.0.1';
const mqttPort = 1883;
const topic = 'registration';

function publishMessageToMqttBroker(message: any) {
    const mqttClient = mqtt.connect(`mqtt:${mqttHost}:${mqttPort}`);

    mqttClient.on('connect', () => {
        mqttClient.publish(topic, JSON.stringify(message));
    });
}

describe('iot-device-registration', () => {
    describe('mqtt', () => {
        it('should check that the subscription to a specific topic works', (done) => {
            const registrationMessage = {"authorization":{"name":"Lawrence Robertson","role":"C.E.O.","deedOwner":"U.S. Robotics Corporation"},"geoposition":{"latitude":-72.080605,"longitude":25.025266},"identification":{"company":"USR","device":"Demolition Robot","schedule":[{"dateTime":"2004-07-07T08:00:00.00Z","description":"demolition"}],"version":"9-4"},"timestamp":"2019-09-01T12:34:43.502Z"};
            const eventEmitter: EventEmitter = new EventEmitter();

            subscribeToRegisterTopic(eventEmitter);
            publishMessageToMqttBroker(registrationMessage);

            eventEmitter.on('registration', (event: any) => {
                expect(event).to.have.all.keys('authorization', 'geoposition', 'identification', 'timestamp');
                done();
            });
        });
    });
});
