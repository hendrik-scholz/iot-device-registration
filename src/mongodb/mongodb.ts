import { EventEmitter } from 'events';

import { createLogger } from '../logger/logger';

import mongoose from 'mongoose';

const logger = createLogger();
const Schema = mongoose.Schema;

let eventEmitter: EventEmitter;

function writeMessageToMongoDB(message: any) {
    const registration = new RegistrationModel(message);
    registration.save()
        .then(() => logger.info('Message has been successfully saved.'))
        .catch((error: any) => logger.info('Error while saving message: ' + JSON.stringify(error)));
}

function registerEventEmitter(eventEmitterToRegister: EventEmitter) {
    logger.info('Registering event emitter ...');

    eventEmitter = eventEmitterToRegister;

    eventEmitter.on('registration', (message: any) => {
        writeMessageToMongoDB(message);
    });

    logger.info('Registered event emitter.');
}

function getSchema() {
    const schema = new Schema({
        authorization: {
            name: String,
            role: String,
            deedOwner: String
        },
        geoposition: {
            type: String,
            coordinates: [Number]
        },
        identification: {
            company: String,
            device: String,
            version: String
        },
        timestamp: String,
    },
    { typeKey: '$type' }); // https://stackoverflow.com/questions/33846939/mongoose-schema-error-cast-to-string-failed-for-value-when-pushing-object-to

    return schema;
}

const schema = getSchema();
const RegistrationModel = mongoose.model('registration', schema);

function connectToMongoDb(connectionString: string): void {
    logger.info('Connecting to database ...');

    mongoose.connect(connectionString, { useNewUrlParser: true });

    logger.info('Connected to database.');
}

function createMongoDbConnection(connectionString: string, eventEmitterToRegister: EventEmitter): void {
    connectToMongoDb(connectionString);
    registerEventEmitter(eventEmitterToRegister);
}

export { createMongoDbConnection };
