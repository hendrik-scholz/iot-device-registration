import { getDevices, getDeviceForUuid, getDevicesInGeofence } from '../db/mongodb';
import { Device } from '../types/device';
import { Geofence } from '../types/geofence';

function getDevices_(): Promise<Device[]> {
    return getDevices();
}

function getDeviceForUuid_(uuid: string): Promise<Device> {
    return getDeviceForUuid(uuid);
}

function getDevicesInGeofence_(geofence: Geofence): Promise<Device[]> {
    return getDevicesInGeofence(geofence);
}

export { getDevices_, getDeviceForUuid_, getDevicesInGeofence_ }
