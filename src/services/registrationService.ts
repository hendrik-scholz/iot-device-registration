import { Device } from '../types/device';
import { saveDevice } from '../db/mongodb';
import { isValidDevice } from '../services/validationService';

function registerDevice(device: Device) {
    return new Promise((resolve, reject) => {
        if(isValidDevice(device)) {
            saveDevice(device)
                .then(() => resolve())
                .catch(() => reject());
        } else {
            reject('Invalid device');
        }
    });
}

export { registerDevice }
