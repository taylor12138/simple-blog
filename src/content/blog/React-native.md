---
author: Hello
categories: 前端
pubDate: 2021-6-25
title: React-native
description: 'React相关知识'
---

## 1.React Native概述

引入关于React Native一些人的评价

优点：

1.完全采用JavaScript

2.跨平台，Write Once, Run anywhere变得可能，尤其是Android和IOS两端

3.社区给力，React Native有着强大的社区，众多开发者提供了各种类型的组件（对比国内阿里系，看起来就是某个人的绩效）

缺点：

1.复杂的状态管理（让我想起里被redux支配的恐惧），即使你会使用React，但也觉得它的页面切换有点绕

2.创建新的原生组件复杂。如果要创建一个之前从未出现过的原生组件，不仅需要懂得Android开发，还得懂得IOS开发



#### 安装依赖

Node、JDK 和 Android Studio。

虽然你可以使用`任何编辑器`来开发应用（编写 js 代码），但你仍然必须安装 Android Studio 来获得编译 Android 应用所需的工具和环境。(记得JDK一定要装1.8版本的（2021年）！！！)

苹果公司目前只允许在 Mac 电脑上开发 iOS 应用。如果你没有 Mac 电脑，那么只能考虑使用`沙盒环境`，或者先开发 Android 应用了。

跟着官网搭建环境   https://reactnative.cn/docs/environment-setup



然后可以在vscode上运行命令创建react-native项目

```shell
npx react-native init AwesomeProject
```

（使用 React Native 内建的命令行工具来创建一个名为"AwesomeProject"的新项目。这个命令行工具不需要安装，可以直接用 node 自带的`npx`命令来使用：）

亦或者通过

```shel
npx create-react-native-app
```

搭建项目



#### 搭建项目的不同

**real diff between "create-react-native-app myproject" and "react-native init myproject"**

overflow上的回答：

( `create-react-native-app`"CRNA") CLI 基于[Expo](https://expo.io/)构建项目模板，Expo是一个第三方工具包，允许您*仅使用 JavaScript*编写跨平台的 React Native 应用程序，并为让应用程序在真实设备上运行提供更流畅的工作流程。此外，Expo 提供对大量[原生 API](https://docs.expo.io/versions/latest/sdk/index.html)的访问，您通常需要库或自定义原生代码。

Expo 很棒，在理想情况下，它是大多数应用程序开发人员可能更喜欢使用的，但 Expo 的架构设置了一个不幸的限制：您无法编写自定义 Native Modules，或集成依赖于自定义 Native 代码的第三方库没有内置到Expo。这意味着你只能访问 React Native 和 Expo 提供的原生功能，而不能轻易扩展它。

相比之下，`react-native`CLI 的`init`命令创建一个简单的 React Native 应用程序模板，您可以修改原生 iOS 和 Android 项目。这种方法的缺点是您需要在您的计算机上设置本机 iOS 和 Android 构建链，并且开始开发和部署您的应用程序要麻烦得多。

幸运的是，Expo 提供了一种[将 CRNA](https://docs.expo.io/versions/latest/guides/detach.html)应用程序与其原生应用程序外壳分离的方法。这会将 CRNA 项目转换为类似于由 创建的普通项目的东西`react-native init`，但可以访问所有 Expo SDK 功能。

**在实践中，对于大多数初学者和新项目来说，最好的方法是从 开始`create-react-native-app`，然后评估您以后是否需要分离。**Expo提供了一个[方便的指南](https://docs.expo.io/versions/latest/guides/detach.html#should-i-detach)来帮助做出这个决定。



而且也推荐装**Yarn**，它是Facebook提供的替代npm的工具，可以加速node模块的下载

```js
npm install yarn -g  // 使用npm全局安装yarn 
```

检查是否安装成功

```js
yarn -v
```



#### 安卓模拟器

不过听说Android studio本身自带的模拟器又卡又慢，附上模拟器推荐的网址

https://blog.csdn.net/huanhuan59/article/details/80281509

比如下载夜神模拟器，然后在目录的bin文件夹下（连接Android studio（夜神的端口号是62001））

```shell
nox_adb.exe connect 127.0.0.1:62001
```

之后连接就可以输入`adb connect 127.0.0.1:62001`命令连接上模拟器

```shell
adb connect 127.0.0.1:62001
```

- 踩坑之路：连接后运行 `npx react-native run-android`，给我报了No connected devices的错误，，而且我在连接adb的时候出现这种情况

![](/React-native/moni_err.png)

这种情况下说明你的模拟器的adb版本太低，被杀死了(无语，研究了好久这个问题)

处理方式：先把你夜神模拟器中的nox_adb.exe删除，然后在你的SDK里面的platform-tools中找到adb.exe,把你的SDK里面的adb复制到夜神模拟器的bin中，记得要改名字（注意要把adb.exe改为nox_adb.exe）

#### 真机

1. 准备一台  Android 手机, 通过数据线 连接 到电脑，设置启用 USB调试

2. 一般的手机在 设置 中可以直接找到 开发者选项 进行开启, 如果 找不到 , 就自行百度查一下

   ![](/React-native/kaifazhe.png)

3. 手机连接电脑成功后运行检测命令  `adb devices` , 如果有输出设备列表与  ID 相关的字符串就证明
   手机和电脑是连接成功了，如果没有显示设备号，则说明连接有问题，一定要保证手机和电脑是正常连接状态

下载投影工具[scrcpy](https://github.com/Genymobile/scrcpy)

解压之后，打开scrpy.exe即可

- 踩坑之路：使用小米手机安装RN的项目会报错：Task :app:installDebug FAILED

解决方法：先检查了一下开发者选项，USB调试、未知源 都是开启的；

然后发现 “启用MIUI优化”这一项是开启的，把它关掉（设置----更多设置----开发者选项----启用MIUI优化 关闭）





确保你先运行了模拟器或者连接了真机，然后在你的项目目录中运行`yarn android`或者`yarn react-native run-android`：

```shell
cd AwesomeProject
yarn android
# 或者
npm run android
# 或者
yarn react-native run-android
# 或者
npx react-native run-android
```

- 踩坑之路：Could not receive a message from the daemon

解决方法：关闭电脑的移动热点，问题即解决。



运行成功

![](/React-native/React-native.jpg)





#### 项目目录介绍

`App.js`：项目根组件

`index.js`：项目入口文件

`_tests_`：测试文件

`app.json`：配置文件

`metro.config.js`：facebook的工程构建工具

`.prettierrc.js`：控制代码格式化的风格



顺便推荐两个VScode常用的RN插件 Prettier - Code formatter（负责格式化）、React-Native snippets（快捷输入） 

jsx**模板生成的快捷键**（类式组件）： `rnc` 

jsx**模板生成的快捷键**（函数式组件）： `rnf` 



## 2.React Native基本语法

#### 三个对象

这里介绍三个对象

- StyleSheet，我们建议使用`StyleSheet.create`来集中定义组件的样式，通过 `create` 另外定义style样式并且导入，里面的属性名要使用驼峰命名法

- View，视图组件,相当于div标签，不能放文本，不能绑定点击事件

  （点击事件必须由 `TouchableOpacity`替代 ）

- Text，文本组件，相当于p标签，**文字一定要放在其中**，支持绑定点击事件
  - `numberOfLines`属性，用于限制文本行数
  - `ellipsizeMode`属性，一行写不完，以 ... 的形式省略

```js
import React from 'react'
import {
  StyleSheet,
  View,
  Text
} from 'react-native'
const App = () => {
  //空标签，它也可以实现fragment的效果
  return (
    <>
      <View style={styles.view}>
        <Text>helloWorld</Text>
      </View>
    </>
  )
}
// 定义对象样式
const styles = StyleSheet.create({
  view: {
    height: 200,
    width: 200,
    backgroundColor: "rgba(200, 255, 0, 0.5)",
    color: 'red'                     //hello world不会变成红色
  }
});
export default App;
```





#### React Native的样式

RN的默认样式：

- flex布局
- 方向 `flex-direction: column`
- 在react-native中没有样式继承，每一个组件都要单独设置样式
- 单位不能加 `'px'`、`'vw'`、`'vh'`，不能使用`fontSize: '100px'`的形式，必须使用 `fontSize: 100`；但是可以加百分比 `'%'`，`width:"100%"`

既然不能加`'vw'`、`'vh'`，如何实现依据屏幕的宽度 / 高度？

```js
import { Dimensions } from 'react-native';
```

```js
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
```

**transfrom的使用**

```jsx
<Text style={{transfrom:[{translateY:300}, {scale:2}]}}></Text>
```

安卓内部单位不是px，是dp。所以需要把px转变为安卓内部的dp。此时可以在src文件下新建一个utils文件夹，然后新建styleKits.js文件

```js
//设计稿宽度 / 元素宽度 = 手机屏幕 / 手机中元素的宽度
//手机中元素的宽度 = 元素宽度 * 手机屏幕 / 设计稿宽度
//设计稿的宽度由美工决定，这里暂定为375
import { Dimensions } from "react-native"
export const screenHeight = Dimensions.get('window').height;
export const screenWidth = Dimensions.get('window').width;
export const pxToDp = (elePx) => screenWidth * elePx / 375;
```

按照以上公式，当使用到样式（px）时，直接套用该方法即可



#### 相对之前学习的React改动

对于属性state、props的使用，和在React里面如出一辙（函数组件的state、ref还是使用Hook）

移动端的点击事件：`onPress`

```js
import React from "react";
import { View, Text } from "react-native";
//类式组件的state
export default class MyComponent extends React.Component {
  state = {
    isHot: true
  }
  change = () => {
    const { isHot } = this.state;
    this.setState({ isHot: !isHot })
  }
  render() {
    const { isHot } = this.state
    return (
      <View>
        <Text onPress={this.change}>today is {isHot ? 'hot' : 'cold'}</Text>
      </View>
    )
  }
}
```

类式组件的props，直接 `this.props.属性名`使用

函数式组件的props

```js
const MyComponent = (props) => {
      const { name, sex, age } = props;
      return (
        <ul>
          <li>性名：{name}</li>
          <li>性别：{sex}</li>
          <li>年龄：{age}</li>
        </ul>
      )
}
```

所以结论：其实没有什么改动，只是多了很多React Native带的移动端组件罢了



## 3.React Native组件

#### TouchableOpacity(点击)

`TouchableOpacity`，点击触摸时会反馈给用户一个透明度的变化，它是一个绑定点击事件的块级标签

- 有 `activeOpacity`属性，用于调节点击时的透明度

```js
import {TouchableOpacity } from "react-native";
```



#### Text-Input(输入框)

`Text-Input`组件时React native的内置组件，不需要额外安装

引入组件

```jsx
import {TextInput } from "react-native";
```

通过 `onChangeText`事件来获取输入框的值

`Text-Input`属性

| 属性名                | 值                                                     | 描述                                                         |
| --------------------- | ------------------------------------------------------ | ------------------------------------------------------------ |
| autoCapitalize        | "none", "sentence", "words", "characters"              | 字母大写模式                                                 |
| autoCorrent           | bool                                                   | 设置拼写自动修正功能，默认为开启(true)                       |
| autoFocus             | bool                                                   | 设置是否默认获取到焦点，默认为关闭(false)                    |
| keyboardType          | "default", "number-pad", "decimal-pad", "phone-pad" 等 | 键盘类型                                                     |
| returnKeyType         | "done", "go", "next", "search", "send"                 | 键盘上返回键类型                                             |
| placeholder           | string                                                 | 占位符                                                       |
| underlineColorAndroid | string                                                 | 下划线颜色                                                   |
| secureTextEntry       | bool                                                   | 设置是否为密码安全输入框                                     |
| onChange              | function                                               | 监听方法,文本框内容发生改变回调方法                          |
| onChangeText          | function                                               | 监听方法，文本框内容发生改变回调方法，该方法会进行传递文本内容（也就是默认传入文本内容作为默认参数） |
| onSubmitEditing       | function                                               | 监听方法，当编辑提交的时候回调方法（提交）。不过如果multiline={true}的时候，该属性就不生效 |

更多 `Text-Input` 属性可以查看这个页面https://blog.csdn.net/u014484863/article/details/51732074 

案例：

```js
import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
export default () => {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [intro, setIntro] = React.useState('')
  // onChangeText默认传入文本内容作为默认参数
  function handleEmail(text) {
    setEmail(text);
  }
  function handlePassword(text) {
    setPassword(text);
  }
  function handleIntro(text) {
    setIntro(text);
  }
  function register() {
    alert('email' + email + '\npassword' + password + '\nintro' + intro);
  }
  return (
    <>
      <View>
        <TextInput
          underlineColorAndroid="transparent"
          placeholder="请输入邮箱"
          placeholderTextColor="#ccc"
          autoCapitalize="none"
          keyboardType="email-address"
          returnKeyType="next"
          onChangeText={handleEmail}
        ></TextInput>
        <TextInput onChangeText={handlePassword} placeholder="请输入密码" secureTextEntry={true}></TextInput>
        <TextInput onChangeText={handleIntro} placeholder="请输入信息"></TextInput>
        {/* 提交按钮 */}
        <TouchableOpacity onPress={register}>
          <Text>注册</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}
```



#### Image(图片)

`Image`组件时React native的内置组件，不需要额外安装

引入组件

```js
import {Image } from "react-native";
```

其实还有2个组件推荐，

- `ScrollView`，用于滑动的操作

  - ```js
    import {ScrollView } from "react-native";
    ```

    它实际上所做的就是将一系列不确定高度的子组件装进一个确定高度的容器（通过滚动操作）

- `ImageBackground`,相当于以前的 `div + 背景图片`，因为在RN当中，是不存在背景图片这个属性的

  - 标签一定要配套商 style属性，不然会报错

  - ```
    （至少配套上）style={{}}
    ```
  
  - ```jsx
    import {ImageBackground } from "react-native";
    
    <ImageBackground source={...} style={{width:100%, height:100%}}>
    </ImageBackground>
    ```
  
    

Image

常用属性

- source 资源定位
  - 使用网络图片要用 uri，且一定要设置宽高
  - 如果配置类别名，直接和正常在js导入中使用别名的形式即可，不需要变成 `~@` 之类的
- 图片显示模式resizeMode
  - contain（整体缩放）,按照正常的比例缩放到可以刚好放进来 
  - cover不会变形(截屏)，放大图片至刚好覆盖住整个内容
  - stretch会变形（局部压缩），直接拉伸至设置的大小
- `blurRadius`(模糊半径)：为图片添加一个指定半径的模糊滤镜。

案例

```js
import React from "react";
import {  Image, ScrollView } from "react-native";
export default () => {
  return (
    <>
      <ScrollView>
        {/* 普通图片设置 */}
        <Image source={require('./assets/1.png')}></Image>
        {/* 网络图片设置,一定要设置宽高，不然不显示 */}
        <Image
          style={{ margin: 10, width: 200, height: 200 }}
          source={{ uri: 'https://img2.baidu.com/it/u=3963436481,1344394108&fm=26&fmt=auto&gp=0.jpg' }}></Image>
        <Image
          style={{ margin: 10, width: 200, height: 200, resizeMode: 'contain' }}
          source={require('./assets/1.png')}
        ></Image>
        <Image
          style={{ margin: 10, width: 200, height: 200, resizeMode: 'cover' }}
          source={require('./assets/1.png')}
        ></Image>
        <Image
          style={{ margin: 10, width: 200, height: 200, resizeMode: 'stretch' }}
          source={require('./assets/1.png')}
        ></Image>
      </ScrollView>
    </>
  )
}
```

在 Android 上支持 GIF 和 WebP 格式图片

默认情况下 Android 是不支持 GIF 和 WebP 格式的。你需要在`android/app/build.gradle`文件中根据需要手动添加以下模块：

```js
dependencies {
  // 如果你需要支持Android4.0(API level 14)之前的版本
  implementation 'com.facebook.fresco:animated-base-support:1.3.0'

  // 如果你需要支持GIF动图
  implementation 'com.facebook.fresco:animated-gif:2.0.0'

  // 如果你需要支持WebP格式，包括WebP动图
  implementation 'com.facebook.fresco:animated-webp:2.1.0'
  implementation 'com.facebook.fresco:webpsupport:2.0.0'

  // 如果只需要支持WebP格式而不需要动图
  implementation 'com.facebook.fresco:webpsupport:2.0.0'
}
```





#### ActivityIndicator(加载)

活动指示器组件，也可以叫它Loading，有一些比较耗时的操作，可能需要用户等待，那么可以使用活动指示器组件 `ActivityIndicator`告诉用户你需要等待（类似于一个圈圈在不停旋转）

`ActivityIndicator`组件时React native的内置组件，不需要额外安装

常用属性

- animating，是否显示转圈加载
- color，滚轮的前景颜色

案例

```js
import React, { Component } from "react";
import {  TouchableOpacity, ActivityIndicator, Button } from "react-native";
export default class App extends Component {
  state = {
    animating: true
  }
  closeActivityIndicator = () => {
    this.setState({ animating: !this.state.animating })
  }
  componentDidMount = () => this.closeActivityIndicator();
  render() {
    const { animating } = this.state
    return (
      <>
        <ActivityIndicator
          animating={animating}
          color="blue"
        />
        <TouchableOpacity>
          <Button onPress={this.closeActivityIndicator} title="切换显示loading"></Button>
        </TouchableOpacity>
      </>
    )
  }
}
```



#### Alert(提示框)

 React的弹窗组件，启动一个提示对话框，包含对应的标题和信息。你还可以指定一系列的按钮，点击对应的按钮会调用对应的 onPress 回调并且关闭提示框。默认情况下，对话框会仅有一个'确定'按钮。

**iOS[#](https://reactnative.cn/docs/alert#ios)**

在 iOS 上你可以指定任意数量的按钮。每个按钮还都可以指定自己的样式，此外还可以指定提示的类别。参阅[AlertButtonStyle](https://reactnative.cn/docs/alert#alertbuttonstyle.md)来了解更多细节。

**Android[#](https://reactnative.cn/docs/alert#android)**

在 Android 上最多能指定三个按钮，这三个按钮分别具有“中间态”、“消极态”和“积极态”的概念：

如果你只指定一个按钮，则它具有“积极态”的属性（比如“确定”）；两个按钮，则分别是“消极态”和“积极态”（比如“取消”和“确定”）；三个按钮则意味着“中间态”、“消极态”和“积极态”（比如“稍候再说”，“取消”，“确定”）。

在 Android 上可以通过点击提示框的外面来取消提示框，但这一行为默认没有启用。你可以在[`Options`](https://reactnative.cn/docs/alert#options)额外参数来启用这一行为：`{ cancelable: true }`。

**方法**

`alert()` ：`static alert(title, message?, buttons?, options?)`

| 名称    | 类型                                                         | 说明                                                         |
| :------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| title   | string Required                                              | The dialog's title. Passing `null` or empty string will hide the title. |
| message | string                                                       | An optional message that appears below the dialog's title.   |
| buttons | [Buttons](https://reactnative.cn/docs/alert#buttons)         | An optional array containg buttons configuration.            |
| options | [Options](https://reactnative.cn/docs/alert#options) Android | An optional Alert configuration for the Android.             |

案例

```js
import React from "react";
import { Alert, TouchableOpacity, View, Text } from "react-native";
export default () => {
  const showAlert1 = () => Alert.alert("发送数据成功")
  const showTip = () => Alert.alert("删除数据成功")
  const showAlert2 = () => {
    // 传入内容，传入的数组对应不同的按钮，引发不同的事件
    Alert.alert("警告", '确认删除?', [
      { text: '确认', onPress: () => showTip() },
      { text: '取消', style: 'cancel' }
    ],
      //不能点击提示框的外面来取消提示框
      { cancelable: false }
    )
  }
  return (
    <>
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity onPress={showAlert1}>
          <Text>发送</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={showAlert2}>
          <Text>删除</Text>
        </TouchableOpacity>
      </View>
    </>
  )
}
```



#### Animating(动画)

`Animated`是一个动画组件，旨在使动画变得流畅，强大并易于构建和维护。`Animated`侧重于输入和输出之间的声明性关系，以及两者之间的可配置变换，此外还提供了简单的 `start/stop`方法来控制基于时间的动画执行。

创建动画最基本的工作流程是先创建一个 `Animated.Value` ，将它连接到动画组件的一个或多个样式属性，然后使用`Animated.timing()`通过动画效果展示数据的变化：

常用属性：

- `Value`

驱动动画运行的一维标量值。一般使用`new Animated.Value(0);`来初始化。

常用方法：

- `timing()`

  推动一个值按照一个缓动曲线而随时间变化。[`Easing`](https://reactnative.cn/docs/easing)模块定义了一大堆曲线，你也可以使用你自己的函数。

  Config 参数有以下这些属性：

  - `duration`: 动画的持续时间（毫秒）。默认值为 500.
  - `easing`: 缓动函数。 默认为`Easing.inOut(Easing.ease)`。
  - `delay`: 开始动画前的延迟时间（毫秒）。默认为 0.
  - `isInteraction`: 指定本动画是否在`InteractionManager`的队列中注册以影响其任务调度。默认值为 true。
  - `useNativeDriver`: 启用原生动画驱动。默认不启用(false)。

- `.start()`方法用于开始一个动画

案例

```js
import React from 'react'
import { Animated, TouchableOpacity, StyleSheet } from 'react-native'
export default () => {
  // 默认宽高
  const animatedWidth = new Animated.Value(50)
  const animatedHeight = new Animated.Value(100)
  function animatedBox() {
    // 点击后，设置动画变化
    Animated.timing(animatedWidth, {
      toValue: 200, //值到200
      duration: 1000,//持续时间
      useNativeDriver: false  //不设置这个会有黄色的warn
    }).start()
    Animated.timing(animatedHeight, {
      toValue: 300,
      duration: 500,
      useNativeDriver: false
    }).start()
  }
  const animatedStyle = {
    width: animatedWidth,
    height: animatedHeight
  }
  return (
    <>
      <TouchableOpacity onPress={animatedBox} style={styles.container}>
        <Animated.View style={[styles.box, animatedStyle]}></Animated.View>
      </TouchableOpacity>
    </>
  )
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  box: {
    backgroundColor: 'blue',
    width: 50,
    height: 100
  }
})
```



#### Switch(开关)

`Switch`是一个开关组件，一个“受控组件”（controlled component）。必须使用`onValueChange`回调来更新`value`属性以响应用户的操作。如果不更新`value`属性，组件只会按一开始给定的`value`值来渲染且保持不变，看上去就像完全点不动。

主要属性：

- `onValueChange`，切换开关回调的事件
- `value`，开关指定的值

案例：

```js
import React, { useState } from 'react'
import { View, Text, Switch } from 'react-native'
export default () => {
  const label = { false: '关', true: '开' };
  const [switchValue, setSwitchValue] = useState(true);
  const toggleSwitch = () => setSwitchValue(preState => !preState);
  return (
    <>
      <View>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={switchValue ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={switchValue}>
        </Switch>
        <View><Text>当前状态是: {label[switchValue]}</Text></View>
      </View>
    </>
  )
}
```



#### StatusBar(状态栏)

`StatusBar`组件是手机屏幕最上方的区域，包含运营商名称、网络情况、手机电池

可以通过它定制白天/夜晚 主题模式

由于`StatusBar`可以在任意视图中加载，可以放置多个且后加载的会覆盖先加载的。因此在配合导航器使用时，请务必考虑清楚`StatusBar`的放置顺序。

常用属性

- `barStyle`，主题颜色，enum('default', 'light-content', 'dark-content')
- `hidden`，隐藏显示
- `backgroundColor`，状态栏的背景色，可以为transparent（透明）。
- `translucent`，设置为true，配合`backgroundColor: transparent`可以把背景图片提上状态栏
- `animated`，指定状态栏的变化是否应以动画形式呈现。目前支持这几种样式：backgroundColor, barStyle 和 hidden。

案例

```js
import React, { useState } from 'react'
import { Text, StatusBar, TouchableOpacity } from 'react-native'
export default () => {
  const [hidden, sethidden] = useState(false)
  const [barStyle, setbarStyle] = useState('default');
  const changeHidden = () => {
    sethidden(preState => !preState);
  }
  const changeBarStyle = () => {
    const temp = barStyle === 'light-content' ? 'dark-content' : 'light-content';
    setbarStyle(temp);
  }
  return (
    <>
      <StatusBar barStyle={barStyle} hidden={hidden}></StatusBar>
      <TouchableOpacity onPress={changeHidden}>
        <Text>显示/隐藏</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={changeBarStyle}>
        <Text>改变主题颜色</Text>
      </TouchableOpacity>
    </>
  )
}
```
