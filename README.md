# Hybrid 混合开发API @^2.0.0

为了更好的可维护性和可扩展性。本项目用 Typescript 实现，并已发布在 npm，要使用，请通过 npm 安装。
```bash
npm install hybrid-api --save
```
## 更新日志

[CHANGELOG.md](CHANGELOG.md)

## 调用方法

hybrid 所有方法均返回一个 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 实例，通过 then 方法，获取调用结果。

### 传统开发模式

如果使用的是传统模式，请通过标签导入，并通过 YBB 的命名空间调用实际方法
```html
<script src="https://nnapp.cloudbae.cn:38080/storage/api/v1/file/hybridapi/hybridapi-2.2.0.js"></script>
<!-- 如果你是通过 npm 安装，也可以这样 -->
<!-- <script src="node_modules/hybrid-api/bundles/hybrid-api.js"></script> -->
<script>
// 获取当前定位信息
YBB.hybrid.location.get().then(function(location) {
    console.log(location);
});
</script>
```
### 模块化开发模式

```typescript
import { hybrid } from 'hybrid-api';
```

## 方法
**以下代码示例均为 Typescript**

### Device

#### 获取设备UUID

```typescript
hybrid.device.getUUID().then((info: UUIDInfo) => {
   console.log(info.uuid); 
});
```
#### 通过拍照或相册获取一张图片
```typescript
/**
* interface SelectImgParams {
*     cancelButton: string;
*     otherButtons: Array<SelectImgOptions>;
* }
*/

const params: SelectImgParams = {
    cancelButton: '取消',
    otherButtons: ['拍照', '相册']
};

hybrid.device.selectImg(params).then((info: SelectImgInfo) => {
    console.log(info.imgPath);
});
```

### Location

#### 获取当前定位信息
```typescript
/**
* interface LocationInfo {
*   longitude: string; // 经度
*   latitude: string; // 纬度
*   detailAddress: string; // 详细地址
*   cityName: string; // 城市
*   region: string; // 区域名称
* }
*/
hybrid.location.get().then((location: LocationInfo) => {
    console.log(location);
});
```

### Navigation


#### 关闭 webview
```typescript
hybrid.navigation.close();
```
#### 隐藏导航条
```typescript
hybrid.navigation.hide();
```
#### 显示导航条
```typescript
hybrid.navigation.show();
```

### User

#### 用户认证
```typescript
/**
* interface CertificationInfo {
*   username: string; // 用户名
*   idCardNo: string; // 身份证号码
*   mobile: string; // 手机号码
* }
*/
const appId: string = 'appId';
hybrid.user.certification(appId).then((data: CertificationInfo) => {
    console.log(data); 
});
```

#### 用户授权
```typescript
/**
* interface AuthorizationInfo {
*   state: string;
*   code: string;
* }
*/

const targetUrl: string = 'http://user.test.com';
hybrid.user.authorization(targetUrl).then((data: AuthorizationInfo) => {
    console.log(data);
});
```

#### 用户登录
```typescript
hybrid.user.login().then((isLogin: boolean) => {
    if (isLogin) {
        console.log('登录成功');
    }
});
```

### Util

#### 打开新的 webview
```typescript
const url: string = 'http://user.test.com';
hybrid.util.openLink(url);
```

#### 分享
```typescript
/**
* interface ShareArgs {
*   title: string; // 标题
*   content: string; // 分享内容
*   imageUrl: string; // 分享图片地址
*   targetUrl: string; // 分享跳转的目标地址
* }
*/
const args: ShareArgs = {
    title: '标题',
    content: '分享内容',
    imageUrl: 'http://test.user.com/a.jpg',
    targetUrl: 'http://test.user.com/target'
};
hybrid.util.share(args).then(() => {
    console.log('分享成功！');
}).cache(error => {
    console.log('分享失败！');
})
```

#### 扫描二维码
```typescript
/**
* enum ScanType {
*    QrCode = 'qrCode'
* }
*/
const scanType = ScanType.QrCode;
hybrid.util.scan(scanType).then(result => {
    console.log(result);
});
```

### 支付
```typescript
/**
* interface PaymentInfo {
*    errorCode: string;
*    stateCode: string;
*    resultDes: string;
* }
*/

const params: string = '{key: value}'; // 由后台提供的字符串
hybrid.util.pay(params).then((response: PaymentInfo) => {
   console.log(response); 
});
```


