import { APIRegister } from './core';
import { Location, LocationInfo } from './apis/location';
import { Navigation } from './apis/navigation';
import { User } from './apis/user';
import { Util, ShareArgs, ScanType } from './apis/util';

export class HybridEngine {
    location: Location;
    navigation: Navigation;
    util: Util;
    user: User;

    constructor(register: APIRegister) {
        this.location = new Location(register);
        this.navigation = new Navigation(register);
        this.util = new Util(register);
        this.user = new User(register);
    }
}

export const hybrid = new HybridEngine(new APIRegister());

export {
    APIRegister,
    Location,
    LocationInfo,
    Navigation,
    User,
    Util,
    ShareArgs,
    ScanType
}