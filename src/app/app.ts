import { Component } from '@angular/core';

import { ShareArgs, ScanType, Hybrid, SelectImgParams, SelectImgOptions } from '../libraries/index';

@Component({
    selector: 'my-app',
    templateUrl: './app.html',
    styleUrls: ['./app.scss']
})
export class AppComponent {
    isError: boolean = false;
    log: string = '';

    certificationAppId: string = '';
    authorizationUrl: string = '';
    openLinkUrl: string = '';
    shareArgs: ShareArgs = {
        title: '',
        content: '',
        imageUrl: '',
        targetUrl: ''
    };

    selectImgArgs: SelectImgParams = {
        cancelButton: '取消按扭文字',
        otherButtons: ['拍照', '相册']
    };

    selectImgBtn1: boolean = true;
    selectImgBtn2: boolean = true;

    scanType: ScanType;
    hybrid: Hybrid;

    openLinkParams: Array<any> = [{}];

    constructor() {
        this.hybrid = new Hybrid(data => {
            this.log = JSON.stringify(data, null, 2);
        });
    }

    getUUID() {
        this.hybrid.device.getUUID();
    }

    selectImg() {
        this.hybrid.device.selectImg(this.selectImgArgs);
    }

    setSelectImgBtn() {
        let arr: Array<SelectImgOptions> = [];
        if (this.selectImgBtn1) {
            arr.push('拍照');
        }
        if (this.selectImgBtn2) {
            arr.push('相册');
        }

        this.selectImgArgs.otherButtons = arr;
    }

    getLocation() {
        this.hybrid.location.get();
    }

    navClose() {
        this.hybrid.navigation.close();
    }

    navShow() {
        this.hybrid.navigation.show();
    }

    navHide() {
        this.hybrid.navigation.hide();
    }

    userCertification() {
        this.hybrid.user.certification(this.certificationAppId);
    }

    userAuthorization() {
        this.hybrid.user.authorization(this.authorizationUrl);
    }

    openLink() {
        let params: any = {};

        for (let i = 0; i < this.openLinkParams.length; i++) {
            let item = this.openLinkParams[i];
            params[item.key] = item.value;
        }
        this.hybrid.util.openLink(this.openLinkUrl, params);
    }

    share() {
        this.hybrid.util.share(this.shareArgs);
    }

    scan() {
        this.hybrid.util.scan(this.scanType);
    }
}