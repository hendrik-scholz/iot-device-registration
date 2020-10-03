import { EventEmitter } from "events";
import mqtt from "mqtt";

import { createLogger } from "../services/logService";

const logger = createLogger();
const event = "registration";

function subscribeToRegisterTopic(eventEmitter: EventEmitter) {
  const mqttHost = "127.0.0.1";
  const mqttPort = 1883;
  const mqttTopic = "registration";

  if (mqttHost && mqttPort && mqttTopic) {
    logger.info("Connecting to MQTT broker.");
    const mqttClient = mqtt.connect(`mqtt:${mqttHost}:${mqttPort}`);

    mqttClient.on("connect", () => {
      logger.info("Successfully connected to MQTT broker.");
      logger.info(`Subscribing to topic '${mqttTopic}'.`);
      mqttClient.subscribe(mqttTopic, (error) => {
        if (error) {
          logger.error(error);
        } else {
          logger.info(`Successfully subscribed to topic '${mqttTopic}'.`);
        }
      });
    });

    mqttClient.on("message", (topic, messageAsBuffer) => {
      logger.info(`Received message: ${messageAsBuffer.toString()}.`);

      const message = JSON.parse(messageAsBuffer.toString());
      eventEmitter.emit(event, message);
    });

    mqttClient.on("error", (error) => {
      logger.error(JSON.stringify(error));
    });
  }
}

export { subscribeToRegisterTopic };
