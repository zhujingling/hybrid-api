import { APIRegister } from './core';

import { Device, UUIDInfo, SelectImgInfo, ChooseImgInfo, SelectImgParams, SelectImgOptions } from './apis/device';
import { Location, LocationInfo } from './apis/location';
import { Navigation } from './apis/navigation';
import { User, AuthorizationInfo, CertificationInfo } from './apis/user';
import { Util, ShareArgs, ScanType, PaymentInfo } from './apis/util';

export class Hybrid {
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

export const hybrid = new Hybrid();

export const version: string = process.env.version;

export {
    APIRegister,
    Device,
    SelectImgInfo,
    ChooseImgInfo,
    SelectImgParams,
    SelectImgOptions,
    UUIDInfo,
    Location,
    LocationInfo,
    Navigation,
    User,
    AuthorizationInfo,
    CertificationInfo,
    Util,
    ShareArgs,
    ScanType,
    PaymentInfo
}