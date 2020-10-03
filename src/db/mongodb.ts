import mongoose, { Mongoose } from "mongoose";

import { Geofence } from "../types/geofence";
import { Device } from "../types/device";
import { DeviceModel } from "./deviceSchema";
import { createLogger } from "../services/logService";

const logger = createLogger();

function connectToMongoDbForConnectionString(
  connectionString: string
): Promise<Mongoose> {
  logger.info("Connecting to MongoDB.");
  return mongoose.connect(connectionString, { useNewUrlParser: true });
}

function disconnectFromMongoDb(): Promise<void> {
  logger.info("Disconnecting from MongoDB.");
  return mongoose.connection.close();
}

function saveDevice(device: Device): Promise<mongoose.Document> {
  const deviceModel = new DeviceModel({
    authorization: {
      name: device.authorization.name,
      role: device.authorization.role,
      owner: device.authorization.deedOwner,
    },
    geoposition: {
      type: device.geoPosition.type,
      coordinates: [
        device.geoPosition.coordinates.longitude,
        device.geoPosition.coordinates.latitude,
      ],
    },
    identification: {
      company: device.identification.company,
      device: device.identification.device,
      version: device.identification.version,
      schedule: device.identification.schedule,
    },
    timestamp: device.timestamp,
    uuid: device.uuid,
  });

  return deviceModel.save();
}

function getDevices(): Promise<Device[]> {
  const pipeline: any[] = [];
  pipeline.push({ $match: {} });
  pipeline.push({
    $project: {
      _id: 0,
      authorization: "$authorization",
      "geoPosition.type": "$geoposition.type",
      "geoPosition.coordinates.longitude": {
        $arrayElemAt: ["$geoposition.coordinates", 0],
      },
      "geoPosition.coordinates.latitude": {
        $arrayElemAt: ["$geoposition.coordinates", 1],
      },
      identification: "$identification",
      timestamp: { $dateToString: { date: "$timestamp" } },
      uuid: "$uuid",
    },
  });

  return DeviceModel.aggregate(pipeline).exec();
}

function getDeviceForUuid(uuid: string): Promise<Device> {
  const pipeline: any[] = [];
  pipeline.push({ $match: { uuid: uuid } });
  pipeline.push({
    $project: {
      _id: 0,
      authorization: "$authorization",
      "geoPosition.type": "$geoposition.type",
      "geoPosition.coordinates.longitude": {
        $arrayElemAt: ["$geoposition.coordinates", 0],
      },
      "geoPosition.coordinates.latitude": {
        $arrayElemAt: ["$geoposition.coordinates", 1],
      },
      identification: "$identification",
      timestamp: { $dateToString: { date: "$timestamp" } },
      uuid: "$uuid",
    },
  });
  pipeline.push({ $limit: 1 });

  return new Promise((resolve, reject) => {
    DeviceModel.aggregate(pipeline)
      .exec()
      .then((document: any) => resolve(document[0]))
      .catch((error: any) => reject(error));
  });
}

// https://docs.mongodb.com/manual/reference/operator/aggregation/geoNear/
function getDevicesInGeofence(geofence: Geofence): Promise<Device[]> {
  console.log(`Geofence: ${JSON.stringify(geofence)}`);

  const pipeline: any[] = [];
  pipeline.push({
    $geoNear: {
      near: {
        type: "Point",
        coordinates: [geofence.longitude, geofence.latitude],
      },
      distanceField: "dist.calculated",
      maxDistance: geofence.radiusInMeters,
    },
  });
  pipeline.push({
    $project: {
      _id: 0,
      authorization: "$authorization",
      "geoPosition.type": "$geoposition.type",
      "geoPosition.coordinates.longitude": {
        $arrayElemAt: ["$geoposition.coordinates", 0],
      },
      "geoPosition.coordinates.latitude": {
        $arrayElemAt: ["$geoposition.coordinates", 1],
      },
      identification: "$identification",
      timestamp: { $dateToString: { date: "$timestamp" } },
      uuid: "$uuid",
    },
  });

  return DeviceModel.aggregate(pipeline).exec();
}

export {
  connectToMongoDbForConnectionString,
  disconnectFromMongoDb,
  saveDevice,
  getDevices,
  getDeviceForUuid,
  getDevicesInGeofence,
};
