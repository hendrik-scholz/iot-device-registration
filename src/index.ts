import { createMongoDbConnection } from './mongodb/mongodb';
import { subscribeToRegisterTopic } from './mqtt/mqtt';

import { EventEmitter } from 'events';

const eventEmitter: EventEmitter = new EventEmitter();

const mongoDbConnectionString = 'mongodb://127.0.0.1:27017/test';

createMongoDbConnection(mongoDbConnectionString, eventEmitter);
subscribeToRegisterTopic(eventEmitter);
