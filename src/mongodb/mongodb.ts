import { EventEmitter } from 'events';

import { createLogger } from '../logger/logger';

import mongoose from 'mongoose';

const logger = createLogger();
const Schema = mongoose.Schema;

let eventEmitter: EventEmitter;

function isDeviceWithUuidNewDevice(uuid: string) {
    return new Promise((resolve, reject) => {
        RegistrationModel.find({uuid})
        .then((documents) => {
            logger.info(`Found ${documents.length} document(s) matching the uuid ${uuid}.`);

            if (documents.length === 0) {
                resolve(true);
            } else {
                resolve(false);
            }
        })
        .catch((error) => {
            logger.error(error);
            reject(error);
        });
    });
}

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
        const uuid = message.uuid;

        isDeviceWithUuidNewDevice(uuid)
            .then((isNew) => {
                if (isNew) {
                    writeMessageToMongoDB(message);
                } else {
                    logger.info(`Device with uuid ${uuid} already exists.`);
                }
            })
            .catch((error) => {
                logger.error(`Error while trying to retrieve device with uuid: ${error}.`);
            });
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
        uuid: String
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
