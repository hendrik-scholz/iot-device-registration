import Ajv from 'ajv';
const ajv = new Ajv();

import registrationMessageSchema from './schema/registration.json';

function isValidRegistrationMessage(message: any): Promise<any> {
    return new Promise((resolve, reject) => {
        const isValid = ajv.validate(registrationMessageSchema, message);

        if (isValid) {
            resolve(true);
        } else {
            reject(ajv.errorsText());
        }
    });
}

export { isValidRegistrationMessage };
