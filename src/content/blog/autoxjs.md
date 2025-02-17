---
author: Hello
categories: 前端
title: autoxjs
description: '手机自动化脚本'
---
## 开始

安装分为两个部分：手机端安装APK ，电脑端安装开发调试插件。

先去官网下载：https://github.com/kkevsekk1/AutoX/releases

#### 手机

给手机安装脚本

```shell
MacBook ~ % cd Desktop 
MacBook Desktop % cd 自动化脚本/
MacBook 自动化脚本 % adb devices   
List of devices attached
Z91QGEWK2223N	device

MacBook 自动化脚本 % adb install ./Autox-v7-arm64-v8a-release-7.0.5.apk
Performing Streamed Install
Success
MacBook 自动化脚本 % 
```

安装好后，在左侧边栏（从左侧往中间滑）打开无障碍服务



#### vscode

vscode上安装插件：Auto.js-Autox.js-VSCodeExt

请确保手机 + 电脑连接同一局域网

1. ipconfig/ifconfig 查看自己本机ip
2. 在手机侧配置服务器地址



连接设备

###### 1. 无线连接：

将手机连*接到电脑启用的Wifi或者同一*局域网中。在[Autox.js](https://github.com/kkevsekk1/AutoX)的侧拉菜单中启用调试服务，并输入VS Code右下角显示的IP地址，等待连接成功。你也可以点击VS Code右下角"Auto.js server running..."通知的下方按钮 *"Show QR code"* 或按 `Ctrl+Shift+P` 搜索执行`Show qr code`命令，然后用[Autox.js](https://github.com/kkevsekk1/AutoX)扫码连接。

###### 2. 通过数据线连接(ADB)：

如要在通过 USB 连接的设备上使用 adb，您必须在设备的系统设置中启用 USB 调试（位于开发者选项下）。

在搭载 Android 4.2 及更高版本的设备上，“开发者选项”屏幕默认情况下处于隐藏状态。如需将其显示出来，请依次转到设置 > 关于手机，然后点按版本号七次。返回上一屏幕，在底部可以找到开发者选项。

在某些设备上，“开发者选项”屏幕所在的位置或名称可能有所不同。

在确保手机已经在开发者选项中打开USB调试后，在[Autox.js](https://github.com/kkevsekk1/AutoX)的侧拉菜单中启用ADB调试，再使用数据线连接电脑，插件会自动识别设备。

###### 3.手动填写ip连接

如果还不行的话直接通过电脑ip连接

手机打开Auto.js侧边选项卡--->连接电脑---->输入ip地址。





之后就可以在电脑上编辑JavaScript文件并通过命令`Run`或者按键`F5`在手机上运行了。



## demo

自动刷抖音

```js
// 导入 AutoJS 的相关模块
var packageName = "com.ss.android.ugc.aweme"; // 视频App的包名

// 打开视频App
launch(packageName);

// 等待视频App加载完成
waitForPackage(packageName);

// 自动刷视频
autoSwipe();

// 自动刷视频函数
function autoSwipe() {
  while (true) {
    // 模拟向下滑动操作
    swipe(
      device.width / 2,
      device.height * 0.8,
      device.width / 2,
      device.height * 0.2,
      1000
    );

    // 等待一段时间，模拟观看视频
    sleep(5000); // 可以根据实际情况调整等待时间
  }
}
```



## 元素查看工具 

确保建立adb连接，可以用命令测试是否连接上

```shell
adb devices
```

#### autoxjs

悬浮窗 -> 布局分析 -> 布局范围分析



#### Android Studio

对于安卓机，可以使用android studio，创建项目后，使用Layout Inspector查看元素分布，但是对于部分安卓机型（比如魅族 17pro），无法使用



#### airtest

airtest是一款网易游戏的自动化脚本工具，一般用于自动化测试脚本的创建，可以用于iOS、Android、游戏

连接方式：https://airtest.readthedocs.io/zh-cn/latest/README_MORE.html#connect-android-device

下载地址：https://airtest.netease.com/



## 相关条链

[技术交流](http://www.autoxjs.com/category/1/%E6%8A%80%E6%9C%AF%E4%BA%A4%E6%B5%81)

[相关教程](https://www.cnblogs.com/ghj1976/p/autoxjs.html)