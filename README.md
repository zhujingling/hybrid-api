# 云宝宝 Hybrid 混合开发 api 测试版

为了更好的可维护性和可扩展性。本项目用 Typescript 实现，并已发布在 npm，要使用，请通过 npm 安装。
```bash
npm install hybrid-api --save
```

## 调用方法

安装好`hybrid-api`后，在项目文件中导入 HybridEngine 的实例：
```typescript
import { hybrid } from 'hybrid-api';
```

hybrid 所有方法均返回一个 [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise) 实例，通过 then 方法，获取调用结果。

## 方法
**以下代码示例均为 Typescript**
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

#### 打开新的 webview
```typescript
hybrid.util.openLink(url: string);
```

#### 分享
```typescript
export interface ShareArgs {
    
    content: string;
    imageUrl: string;
    targetUrl: string;
}
/**
* interface ShareArgs {
*   title: string; // 标题
*   content: string; // 分享内容
*   imageUrl: string; // 分享图片地址
*   targetUrl: string; // 分享跳转的目标地址
* }
*/
hybrid.util.share(args: ShareArgs).then(() => {
    console.log('分享成功！');
}).cache(error => {
    console.log('分享失败！');
})
```


