import chai from 'chai';

const expect = chai.expect;

import { EventEmitter } from 'events';
import { createMongoDbConnection } from '../../src/mongodb/mongodb';
import mongoose from 'mongoose';
const Schema = mongoose.Schema;

// https://stackoverflow.com/questions/13607732/in-memory-mongodb-for-test
// https://www.npmjs.com/package/mongodb-memory-server
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer;
let mongoDbConnectionString = '';

function getMongoDbConnectionString(): Promise<string> {
    mongod = new MongoMemoryServer();
    return mongod.getConnectionString();
}

function shutdownMongoDb() {
    mongod.stop();
}

describe('iot-device-registration', () => {
    describe('mongodb', () => {
        before('get mongoDB connection string', (done) => {
            getMongoDbConnectionString()
            .then((connectionString) => {
                mongoDbConnectionString = connectionString;
                done();
            })
            .catch((error) => {
                done(error);
            });
        });

        after('stop mongoDB', () => {
            shutdownMongoDb();
        });

        it('should check that a document is created in the mongoDB', () => {
            const registrationMessage = {"authorization":{"name":"Lawrence Robertson","role":"C.E.O.","deedOwner":"U.S. Robotics Corporation"},"geoposition":{"type":"Point","coordinates":[25.025266,-72.080605]},"identification":{"company":"USR","device":"Demolition Robot","schedule":[{"dateTime":"2004-07-07T08:00:00.00Z","description":"demolition"}],"version":"9-4"},"timestamp":"2019-09-01T12:34:43.502Z"};
            const eventEmitter: EventEmitter = new EventEmitter();

            mongoDbConnectionString = 'mongodb://127.0.0.1:27017/test';
            createMongoDbConnection(mongoDbConnectionString, eventEmitter);

            eventEmitter.emit('registration', registrationMessage);
        });
    });
});
