import { Authorization } from './authorization';
import { GeoPosition } from './geoPosition';
import { Identification } from './identification';

export interface Device {
    authorization: Authorization;
    geoPosition: GeoPosition;
    identification: Identification;
    timestamp: String;
    uuid: string;
}
