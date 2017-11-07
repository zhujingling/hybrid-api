import { APIRegister } from '../core';

export interface UUIDInfo {
    uuid: string;
}

export class Device {
    private register: APIRegister;

    constructor(register: APIRegister) {
        this.register = register;
    }

    // 获最当前定位信息
    getUUID(): Promise<UUIDInfo> {
        return this.register.callHandler('device.base.getUUID');
    }
}