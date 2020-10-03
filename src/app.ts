import { registerEventEmitter } from './subscribers/registration';
import { EventEmitter } from 'events';
import { subscribeToRegisterTopic } from './api/mqtt';

import {
  connectToMongoDbForConnectionString,
  disconnectFromMongoDb,
} from './db/mongodb';
import { Device } from './types/device';
import { registerDevice } from './services/registrationService';
import { startService } from './api/http';

const eventEmitter = new EventEmitter();

connectToMongoDbForConnectionString('mongodb://127.0.0.1:27017/test');

registerEventEmitter(eventEmitter, (device: Device) => {
  registerDevice(device);
  // additional action on registration
});

subscribeToRegisterTopic(eventEmitter);

startService();

// https://nodejs.org/api/process.html
// Listener functions must only perform synchronous operations.
process.on('exit', async () => {
  await disconnectFromMongoDb();
});
