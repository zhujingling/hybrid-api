import { APIRegister } from '../core';

export interface LocationInfo {
    longitude: string; // 经度
    latitude: string; // 纬度
    detailAddress: string; // 详细地址
    cityName: string; // 城市
    region: string; // 区域名称
}

export class Location {
    private register: APIRegister;

    constructor(register: APIRegister) {
        this.register = register;
    }

    // 获最当前定位信息
    get(): Promise<LocationInfo> {
        return this.register.callHandler('device.location.get').then(result => {
            return JSON.parse(result);
        });
    }
}