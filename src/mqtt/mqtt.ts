import { EventEmitter } from 'events';
import mqtt from 'mqtt';

import { createLogger } from '../logger/logger';

import { isValidRegistrationMessage } from '../validator/jsonValidator';

const logger = createLogger();

function getMappedCoordinates(geoposition: any) {
    const coordinates = [];

    if (geoposition) {
        coordinates.push(geoposition.longitude);
        coordinates.push(geoposition.latitude);
    }

    const mappedGeoPosition = {
        type: 'Point',
        coordinates: coordinates
    };

    return mappedGeoPosition;
}

function subscribeToRegisterTopic(eventEmitter: EventEmitter) {
    const mqttHost = '127.0.0.1';
    const mqttPort = 1883;
    const mqttTopic = 'registration';

    if (mqttHost && mqttPort && mqttTopic) {
        logger.info('Connecting to MQTT broker.');
        const mqttClient = mqtt.connect(`mqtt:${mqttHost}:${mqttPort}`);

        mqttClient.on('connect', () => {
            logger.info('Successfully connected to MQTT broker.');
            logger.info(`Subscribing to topic '${mqttTopic}'.`);
            mqttClient.subscribe(mqttTopic, (error) => {
                if (error) {
                    logger.error(error);
                } else {
                    logger.info(`Successfully subscribed to topic '${mqttTopic}'.`);
                }
            });
        });

        mqttClient.on('message', (topic, messageAsBuffer) => {
            logger.info(`Received message: ${messageAsBuffer.toString()}.`);

            const message = JSON.parse(messageAsBuffer.toString());

            isValidRegistrationMessage(message)
                .then(() => {
                    message.geoposition = getMappedCoordinates(message.geoposition);

                    eventEmitter.emit('registration', message);
                })
                .catch((error) => {
                    logger.warn(`Invalid registration message: ${error}`);
                });
        });

        mqttClient.on('error', (error) => {
            logger.error(JSON.stringify(error));
        });
    }
}

export { subscribeToRegisterTopic };
