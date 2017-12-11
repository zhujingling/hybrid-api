import { APIRegister } from '../core';

export interface UUIDInfo {
    uuid: string;
}

export type SelectImgOptions = '拍照' | '相册';

export interface SelectImgParams {
    cancelButton: string;
    otherButtons: Array<SelectImgOptions>;
}

export interface SelectImgInfo {
    imgPath: string;
}

export class Device {
    private register: APIRegister;

    constructor(register: APIRegister) {
        this.register = register;
    }

    // 获取设备UUID
    getUUID(): Promise<UUIDInfo> {
        return this.register.callHandler('device.base.getUUID');
    }

    // 通过相册或拍照，获取一张图片
    selectImg(args: SelectImgParams): Promise<SelectImgInfo> {
        return this.register.callHandler('device.notification.selectImg', args);
    }
}