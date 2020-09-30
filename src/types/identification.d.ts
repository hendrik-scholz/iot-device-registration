import { Schedule } from "./schedule";

export interface Identification {
    company: string;
    device: string;
    version: string;
    schedule: Schedule[];
}
