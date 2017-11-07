import { Component } from '@angular/core';

import { ShareArgs, ScanType, Hybrid } from '../libraries/index';

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

    scanType: ScanType;
    hybrid: Hybrid;

    constructor() {
        this.hybrid = new Hybrid(data => {
            this.log = JSON.stringify(data, null, 2);
        });
    }

    getUUID() {
        this.hybrid.device.getUUID();
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
        this.hybrid.util.openLink(this.openLinkUrl);
    }

    share() {
        this.hybrid.util.share(this.shareArgs);
    }

    scan() {
        this.hybrid.util.scan(this.scanType);
    }
}