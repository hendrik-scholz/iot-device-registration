import express from 'express';
import { Express, Request, Response } from 'express';
import * as HttpStatus from 'http-status-codes';

import {
  getDevices_,
  getDeviceForUuid_,
  getDevicesInGeofence_,
} from '../services/deviceService';
import { createLogger } from '../services/logService';
import { Geofence } from '../types/geofence';

const logger = createLogger();

function startService(): void {
  const app: Express = express();
  const port = 3000;

  app.use((req: Request, res: Response, next: any) => {
    logger.info(
      `Incoming request: ${req.method}, endpoint: ${
        req.url
      }, headers: ${JSON.stringify(req.headers)}.`
    );
    next();
  });

  app.get('/isalive', (req: Request, res: Response) => {
    res.status(204).send();
  });

  app.get('/devices', (req: Request, res: Response) => {
    getDevices_()
      .then((devices) => {
        res.append('Access-Control-Allow-Origin', '*');
        res.json(devices);
      })
      .catch((error) => res.sendStatus(500));
  });

  app.get('/devices/geofence', (req: Request, res: Response) => {
    if (
      req &&
      req.query &&
      req.query.lat &&
      req.query.lng &&
      req.query.radius
    ) {
      const longitude = parseFloat(req.query.lng as string);
      const latitude = parseFloat(req.query.lat as string);
      const radiusInMeters = parseInt(req.query.radius as string, 10);

      const geofence: Geofence = {
        longitude,
        latitude,
        radiusInMeters,
      };

      getDevicesInGeofence_(geofence)
        .then((devices) => res.json(devices))
        .catch((error) => res.sendStatus(500));
    } else {
      logger.warn('Query params not set.');
      res.status(HttpStatus.BAD_REQUEST).send({ message: 'Bad Request.' });
    }
  });

  app.get('/devices/:id', (req: Request, res: Response) => {
    if (req && req.params && req.params.id) {
      const uuid = req.params.id;

      getDeviceForUuid_(uuid)
        .then((device) => res.json(device))
        .catch((error) => res.sendStatus(500));
    } else {
      logger.warn('Query params not set.');
      res.status(HttpStatus.BAD_REQUEST).send({ message: 'Bad Request.' });
    }
  });

  app.listen(port, () =>
    logger.info(`iot-device-registry app listening on port ${port}!`)
  );
}

export { startService };
