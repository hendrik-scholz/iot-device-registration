// subscribe to registration event on MQTT new registration message

import { Device } from "../types/device";
import { EventEmitter } from "events";

const event = "registration";

let emitter;

function registerEventEmitter(
  eventEmitter: EventEmitter,
  onRegistration: (device: Device) => void
) {
  emitter = eventEmitter;

  emitter.on(event, (device: Device) => {
    onRegistration(device);
  });
}

export { registerEventEmitter };
