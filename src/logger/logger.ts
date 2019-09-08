import { configure, getLogger, Logger } from 'log4js';

function createLogger(): Logger {
    const logger = getLogger('iot-device-information');
    logger.level = 'info';

    configure({
        appenders: {
            console: {
                type: 'console',
            },
            file: {
                filename: 'app.log',
                type: 'file'
            }
        },
        categories: {
            default: {
                appenders: ['console', 'file'],
                level: 'info'
            }
        }
    });

    return logger;
}

export { createLogger };
