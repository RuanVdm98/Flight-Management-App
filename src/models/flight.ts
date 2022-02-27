export interface Flight {
    // telling ide that objects that inherits this interface must have these properties
    icoa24: string;
    latitude: number;
    longitude: number;
    date: number;
    country: string;
    callSign: string;
    velocity: number;
    altitude: number;

}