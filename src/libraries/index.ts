import { APIRegister } from './core';

import { Device, UUIDInfo } from './apis/device';
import { Location, LocationInfo } from './apis/location';
import { Navigation } from './apis/navigation';
import { User } from './apis/user';
import { Util, ShareArgs, ScanType } from './apis/util';

export class HybridEngine {
    device: Device;
    location: Location;
    navigation: Navigation;
    util: Util;
    user: User;

    constructor(rawValueCallback?: (data: any) => any) {
        const register = new APIRegister(rawValueCallback);
        this.device = new Device(register);
        this.location = new Location(register);
        this.navigation = new Navigation(register);
        this.util = new Util(register);
        this.user = new User(register);
    }
}

export const hybrid = new HybridEngine();

export {
    APIRegister,
    Device,
    UUIDInfo,
    Location,
    LocationInfo,
    Navigation,
    User,
    Util,
    ShareArgs,
    ScanType
}