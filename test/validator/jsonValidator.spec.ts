import chai from 'chai';

const expect = chai.expect;

import { isValidRegistrationMessage } from '../../src/validator/jsonValidator';

describe('iot-device-registration', () => {
    describe('jsonValidator', () => {
        it('should validate a valid registration message', (done) => {
            const registrationMessage = {"authorization":{"name":"Lawrence Robertson","role":"C.E.O.","deedOwner":"U.S. Robotics Corporation"},"geoposition":{"latitude":-72.080605,"longitude":25.025266},"identification":{"company":"USR","device":"Demolition Robot","schedule":[{"dateTime":"2004-07-07T08:00:00.00Z","description":"demolition"}],"version":"9-4"},"timestamp":"2019-09-01T12:34:43.502Z"};
            isValidRegistrationMessage(registrationMessage)
                .then((validationResult) => {
                    expect(validationResult).to.equal(true);
                    done();
                })
                .catch((error) => {
                    done(error);
                });
        });

        it('should validate an invalid registration message - missing authorization', (done) => {
            const registrationMessage = {"geoposition":{"latitude":-72.080605,"longitude":25.025266},"identification":{"company":"USR","device":"Demolition Robot","schedule":[{"dateTime":"2004-07-07T08:00:00.00Z","description":"demolition"}],"version":"9-4"},"timestamp":"2019-09-01T12:34:43.502Z"};
            isValidRegistrationMessage(registrationMessage)
                .then((validationResult) => {
                    done(`An invalid registrationMessage is regarded as valid. Result: ${validationResult}`);
                })
                .catch((error) => {
                    expect(error).to.equal('data should have required property \'authorization\'');
                    done();
                });
        });

        it('should validate an invalid registration message - missing geoposition', (done) => {
            const registrationMessage = {"authorization":{"name":"Lawrence Robertson","role":"C.E.O.","deedOwner":"U.S. Robotics Corporation"},"identification":{"company":"USR","device":"Demolition Robot","schedule":[{"dateTime":"2004-07-07T08:00:00.00Z","description":"demolition"}],"version":"9-4"},"timestamp":"2019-09-01T12:34:43.502Z"};
            isValidRegistrationMessage(registrationMessage)
                .then((validationResult) => {
                    done(`An invalid registrationMessage is regarded as valid. Result: ${validationResult}`);
                })
                .catch((error) => {
                    expect(error).to.equal('data should have required property \'geoposition\'');
                    done();
                });
        });

        it('should validate an invalid registration message - invalid latitude (min) in geoposition', (done) => {
            const registrationMessage = {"authorization":{"name":"Lawrence Robertson","role":"C.E.O.","deedOwner":"U.S. Robotics Corporation"},"geoposition":{"latitude":-100,"longitude":25.025266},"identification":{"company":"USR","device":"Demolition Robot","schedule":[{"dateTime":"2004-07-07T08:00:00.00Z","description":"demolition"}],"version":"9-4"},"timestamp":"2019-09-01T12:34:43.502Z"};
            isValidRegistrationMessage(registrationMessage)
                .then((validationResult) => {
                    done(`An invalid registrationMessage is regarded as valid. Result: ${validationResult}`);
                })
                .catch((error) => {
                    expect(error).to.equal('data.geoposition.latitude should be >= -90');
                    done();
                });
        });

        it('should validate an invalid registration message - invalid latitude (max) in geoposition', (done) => {
            const registrationMessage = {"authorization":{"name":"Lawrence Robertson","role":"C.E.O.","deedOwner":"U.S. Robotics Corporation"},"geoposition":{"latitude":100,"longitude":25.025266},"identification":{"company":"USR","device":"Demolition Robot","schedule":[{"dateTime":"2004-07-07T08:00:00.00Z","description":"demolition"}],"version":"9-4"},"timestamp":"2019-09-01T12:34:43.502Z"};
            isValidRegistrationMessage(registrationMessage)
                .then((validationResult) => {
                    done(`An invalid registrationMessage is regarded as valid. Result: ${validationResult}`);
                })
                .catch((error) => {
                    expect(error).to.equal('data.geoposition.latitude should be <= 90');
                    done();
                });
        });

        it('should validate an invalid registration message - invalid longitude (min) in geoposition', (done) => {
            const registrationMessage = {"authorization":{"name":"Lawrence Robertson","role":"C.E.O.","deedOwner":"U.S. Robotics Corporation"},"geoposition":{"latitude":-72.080605,"longitude":-190},"identification":{"company":"USR","device":"Demolition Robot","schedule":[{"dateTime":"2004-07-07T08:00:00.00Z","description":"demolition"}],"version":"9-4"},"timestamp":"2019-09-01T12:34:43.502Z"};
            isValidRegistrationMessage(registrationMessage)
                .then((validationResult) => {
                    done(`An invalid registrationMessage is regarded as valid. Result: ${validationResult}`);
                })
                .catch((error) => {
                    expect(error).to.equal('data.geoposition.longitude should be >= -180');
                    done();
                });
        });

        it('should validate an invalid registration message - invalid longitude (max) in geoposition', (done) => {
            const registrationMessage = {"authorization":{"name":"Lawrence Robertson","role":"C.E.O.","deedOwner":"U.S. Robotics Corporation"},"geoposition":{"latitude":-72.080605,"longitude":190},"identification":{"company":"USR","device":"Demolition Robot","schedule":[{"dateTime":"2004-07-07T08:00:00.00Z","description":"demolition"}],"version":"9-4"},"timestamp":"2019-09-01T12:34:43.502Z"};
            isValidRegistrationMessage(registrationMessage)
                .then((validationResult) => {
                    done(`An invalid registrationMessage is regarded as valid. Result: ${validationResult}`);
                })
                .catch((error) => {
                    expect(error).to.equal('data.geoposition.longitude should be <= 180');
                    done();
                });
        });

        it('should validate an invalid registration message - missing identification', (done) => {
            const registrationMessage = {"authorization":{"name":"Lawrence Robertson","role":"C.E.O.","deedOwner":"U.S. Robotics Corporation"},"geoposition":{"latitude":-72.080605,"longitude":25.025266},"timestamp":"2019-09-01T12:34:43.502Z"};
            isValidRegistrationMessage(registrationMessage)
                .then((validationResult) => {
                    done(`An invalid registrationMessage is regarded as valid. Result: ${validationResult}`);
                })
                .catch((error) => {
                    expect(error).to.equal('data should have required property \'identification\'');
                    done();
                });
        });

        it('should validate an invalid registration message - missing timestamp', (done) => {
            const registrationMessage = {"authorization":{"name":"Lawrence Robertson","role":"C.E.O.","deedOwner":"U.S. Robotics Corporation"},"geoposition":{"latitude":-72.080605,"longitude":25.025266},"identification":{"company":"USR","device":"Demolition Robot","schedule":[{"dateTime":"2004-07-07T08:00:00.00Z","description":"demolition"}],"version":"9-4"}};
            isValidRegistrationMessage(registrationMessage)
                .then((validationResult) => {
                    done(`An invalid registrationMessage is regarded as valid. Result: ${validationResult}`);
                })
                .catch((error) => {
                    expect(error).to.equal('data should have required property \'timestamp\'');
                    done();
                });
        });

        it('should validate an invalid registration message - empty message', (done) => {
            const registrationMessage = '';
            isValidRegistrationMessage(registrationMessage)
                .then((validationResult) => {
                    done(`An invalid registrationMessage is regarded as valid. Result: ${validationResult}`);
                })
                .catch((error) => {
                    expect(error).to.equal('data should be object');
                    done();
                });
        });

        it('should validate an invalid registration message - additional property malice on top level', (done) => {
            const registrationMessage = {"malice":true,"authorization":{"name":"Lawrence Robertson","role":"C.E.O.","deedOwner":"U.S. Robotics Corporation"},"geoposition":{"latitude":-72.080605,"longitude":25.025266},"identification":{"company":"USR","device":"Demolition Robot","schedule":[{"dateTime":"2004-07-07T08:00:00.00Z","description":"demolition"}],"version":"9-4"},"timestamp":"2019-09-01T12:34:43.502Z"};
            isValidRegistrationMessage(registrationMessage)
                .then((validationResult) => {
                    done(`An invalid registrationMessage is regarded as valid. Result: ${validationResult}`);
                })
                .catch((error) => {
                    expect(error).to.equal('data should NOT have additional properties');
                    done();
                });
        });

        it('should validate an invalid registration message - additional property malice in authorization', (done) => {
            const registrationMessage = {"authorization":{"malice":true,"name":"Lawrence Robertson","role":"C.E.O.","deedOwner":"U.S. Robotics Corporation"},"geoposition":{"latitude":-72.080605,"longitude":25.025266},"identification":{"company":"USR","device":"Demolition Robot","schedule":[{"dateTime":"2004-07-07T08:00:00.00Z","description":"demolition"}],"version":"9-4"},"timestamp":"2019-09-01T12:34:43.502Z"};
            isValidRegistrationMessage(registrationMessage)
                .then((validationResult) => {
                    done(`An invalid registrationMessage is regarded as valid. Result: ${validationResult}`);
                })
                .catch((error) => {
                    expect(error).to.equal('data.authorization should NOT have additional properties');
                    done();
                });
        });

        it('should validate an invalid registration message - additional property malice in geoposition', (done) => {
            const registrationMessage = {"authorization":{"name":"Lawrence Robertson","role":"C.E.O.","deedOwner":"U.S. Robotics Corporation"},"geoposition":{"malice":true,"latitude":-72.080605,"longitude":25.025266},"identification":{"company":"USR","device":"Demolition Robot","schedule":[{"dateTime":"2004-07-07T08:00:00.00Z","description":"demolition"}],"version":"9-4"},"timestamp":"2019-09-01T12:34:43.502Z"};
            isValidRegistrationMessage(registrationMessage)
                .then((validationResult) => {
                    done(`An invalid registrationMessage is regarded as valid. Result: ${validationResult}`);
                })
                .catch((error) => {
                    expect(error).to.equal('data.geoposition should NOT have additional properties');
                    done();
                });
        });

        it('should validate an invalid registration message - additional property malice in identification', (done) => {
            const registrationMessage = {"authorization":{"name":"Lawrence Robertson","role":"C.E.O.","deedOwner":"U.S. Robotics Corporation"},"geoposition":{"latitude":-72.080605,"longitude":25.025266},"identification":{"malice":true,"company":"USR","device":"Demolition Robot","schedule":[{"dateTime":"2004-07-07T08:00:00.00Z","description":"demolition"}],"version":"9-4"},"timestamp":"2019-09-01T12:34:43.502Z"};
            isValidRegistrationMessage(registrationMessage)
                .then((validationResult) => {
                    done(`An invalid registrationMessage is regarded as valid. Result: ${validationResult}`);
                })
                .catch((error) => {
                    expect(error).to.equal('data.identification should NOT have additional properties');
                    done();
                });
        });
    });
});
