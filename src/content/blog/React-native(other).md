---
author: Hello
categories: 前端
pubDate: 2021-6-25
title: React-native(other)
description: '框架相关'
---

## 4.移动端服务器部署&注意事项

安卓访问本地服务器地址为 `10.0.2.2:端口号`，我们平时浏览器访问服务器都是 `localhost:端口号`



#### 关于React Native的调试

1.使用谷歌浏览器来调试

1. 使用谷歌浏览器即可
2. 不能查看标签结构
3. 不能**查看**网络请求

2.使用rn推荐的工具 [react-native-debugger](https://github.com/jhen0409./React-native-debugger)来调试 (**老师推荐使用这种方式**)

1. 可以查看标签结构
2. 不能查看网络请求

3.想要查看网络请求

1. 找到项目的入口文件 `index.js`

2. 加入以下代码即可

   ```js
   GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest
   ```

   



移动端路由导航、导航栏可以用以下的`react-navigation`框架

`react-native`从开源至今，一直存在几个无法解决的毛病，偶尔就会复发让人隐隐作痛，提醒你用的不是原生，其中包括列表的复用问题，导航跳转不流畅的问题等等。
 终于facebook坐不住了，在前一段时间开始推荐使用`react-navigation`，并且在0.44发布的时将之前一直存在的`Navigator`废弃了。
 `react-navigation`是致力于解决导航卡顿，数据传递，Tabbar和navigator布局，支持`redux`。虽然现在功能还不完善，但基本是可以在项目中推荐使用的。

```js
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'
```



#### React navigation的部分使用规范

> 页面跳转和转场动画

1. 安装（在项目中使用）

   ```shell
   yarn add @react-navigation/native
   ```

   ```shell
   yarn add react-native-screens react-native-safe-area-context
   ```

   

   如果您在 Mac 上为 iOS 开发，则需要安装 pod（通过[Cocoapods](https://cocoapods.org/)）以完成链接。

   ```sh
   npx pod-install ios
   ```

   `react-native-screens`包需要一个额外的配置步骤才能在 Android 设备上正常工作。编辑`MainActivity.java`位于`android/app/src/main/java/<your package name>/MainActivity.java`.

   将以下代码添加到`MainActivity`类的主体中：

   ```java
   @Override
   protected void onCreate(Bundle savedInstanceState) {
     super.onCreate(null);
   }
   ```

   并确保在此文件顶部添加导入语句：

   ```java
   import android.os.Bundle;
   ```

   安装 native stack、navigator library

   ```shell
   yarn add @react-navigation/native-stack
   ```

   

2. 代码

   ```jsx
   import * as React from 'react';
   import { Button, View, Text } from 'react-native';
   import { NavigationContainer } from '@react-navigation/native';
   import { createStackNavigator } from '@react-navigation/stack';
   
   function HomeScreen({ navigation }) {
     return (
       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
         <Text>Home Screen</Text>
         <Button
           title="Go to Details"
           onPress={() => navigation.navigate('Details')}
         />
       </View>
     );
   }
   
   function DetailsScreen() {
     return (
       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
         <Text>Details Screen</Text>
       </View>
     );
   }
   
   const Stack = createStackNavigator();
   
   function App() {
     return (
       <NavigationContainer>
         <Stack.Navigator
           initialRouteName="Home"
           screenOptions={{
             headerShown: false,
           }}>
           <Stack.Screen name="Home" component={HomeScreen} />
           <Stack.Screen name="Details" component={DetailsScreen} />
         </Stack.Navigator>
       </NavigationContainer>
     );
   }
   
   export default App;
   ```

- 路由要在 Stack.Navigator 中以`Stack.Screen`组件的格式进行存放

- Screen的属性`component`属性直接放入路由组件

- Navigator的属性`headerMode="none"`隐藏页面路由的标题

  - 后面属性改成 以下才能使用了，以上的 `headerMode="none"` 不管用了（2022年）

  - ```js
    screenOptions={{
    	headerShown: false,
    }}
    ```

    

当然，可以和Vue脚手架一样，在src下新建一个 nav.js文件，专门用于存放路由，此时我们将上图代码放入这个nav.js文件（App改问Nav）

然后再App.js文件写入Nav组件即可

```jsx
import React from 'react'
import { View, Text } from 'react-native'
import Nav from './src/nav'

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <Nav></Nav>
    </View>
  )
}
```





可以在 `createStackNavigator`里一一放置组件，有点类似路由的作用；

官方解释：一次渲染一个屏幕并提供屏幕之间的转换。当一个新屏幕打开时，它被放置在堆栈的顶部

格式为

- 传入的第一个参数为组件 （以对象的形式）

  `路由名: {screen: 组件名, navigationOptions: 配置选择（也可以自定义title、tabBarLabel等）}`
  
- 主页面使用了`createStackNavigator`，子组件就会默认传入`this.props.navigation`。

  `navigation`用于跳转页面和获取导航信息
  
- 然后，我们就可以在组件内进行路由跳转

  - `this.props.navigation.navigate('路由名')`可进行跳转
  
  - (跳转到 Brief 页面 + 传入名为 ‘book’ 的参数 )，接收的 Brief页面可以通过 `this.props.navigation.state.params.book`进行获取
  - `this.props.navigation.goBack()` 返回
  
  ```jsx
  const {navigation} = this.props
  reutrn(
      <TouchableOpacity onPress={() => { navigation.navigate('Brief', { book: item }) }}>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => { navigation.goBack()}>
      </TouchableOpacity>
  )
  ```
  
  

```js
//app.js
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack'
//这里分别引入了4个页面组件
import BottomNavigator from './page/root/rootPage'
import BriefPage from './page/brief/briefPage'
import ImgPage from './page/brief/ImgPage'
import ListPage from './page/cate/ListPage'

const AppStack = createStackNavigator(
  {
    // 首页组件设置：从rootPage引入的并且命名为BottomNavigator
    BottomNavigator: {
      screen: BottomNavigator,
      navigationOptions: {
        headerShown: false,
      }
    },
    Login: { screen: Login },
    Register: { screen: Register },
    Brief: { screen: BriefPage },
    ImgPage: { screen: ImgPage },
    ListPage: { screen: ListPage }
  },
  {
    mode: 'modal',
    headerMode: 'none',
  }
);

export default createAppContainer(AppStack);
```



#### UI框架

框架推荐 react-native-elements

1. 下载

   需要使用到图标 因此也需要安装 `react-native-vector-icons`

   ```shell
   yarn add react-native-elements react-native-vector-icons
   ```

   或者

   ```shell
   npm i react-native-elements react-native-vector-icons
   ```

2. 引入和使用

   ```jsx
   import { Icon } from 'react-native-elements'
   
   <Icon
     name='rowing' />
   ```

3. [react-native-vector-icons](https://github.com/oblador./React-native-vector-icons) 的其他使用（使用UI库的icon时需要进行配置）

   - 编辑 `android/app/build.gradle` 

   - 添加以下配置

   ```jsx
   project.ext.vectoricons = [
       iconFontNames: [ 'MaterialIcons.ttf', 'EvilIcons.ttf' ] // Name of the font files you want to copy
   ] //这个时自定义添加字体时才配置
   
   apply from: "../../node_modules./React-native-vector-icons/fonts.gradle"  //这个是一定要配置的
   ```

   - 重启项目

   - 添加代码 如

   ```jsx
   import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
   
   const icon = <FontAwesome5 name={'comments'} />;
   ```



#### 关闭黄色警告

粘贴到index.js文件下

```jsx
console.ignoredYellowBox = ['Warning: BackAndroid is deprecated. Please use BackHandler instead.','source.uri should not be an empty string','Invalid props.style key'];
 
console.disableYellowBox = true // 关闭全部黄色警告
```



#### 渐变色容器

[react-native-linear-gradient](https://www.npmjs.com/package./React-native-linear-gradient)

下载

```shell
yarn add react-native-linear-gradient
```

```shell
npm i react-native-linear-gradient
```

简单使用

```js
import LinearGradient from 'react-native-linear-gradient';
 
<LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.linearGradient}>
  <Text style={styles.buttonText}>
    Sign in with Facebook
  </Text>
</LinearGradient>
var styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 5
  },
  buttonText: {
    fontSize: 18,
    fontFamily: 'Gill Sans',
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
    backgroundColor: 'transparent',
  },
});
```



#### 验证码输入框

[react-native-confirmation-code-field](https://www.npmjs.com/package./React-native-confirmation-code-field)

1. 下载

   ```js
   yarn add react-native-confirmation-code-field
   ```

   ```shell
   npm i react-native-confirmation-code-field
   ```

2. 代码

   ```jsx
   import React, {useState} from 'react';
   import {SafeAreaView, Text, StyleSheet} from 'react-native';
    
   import {
     CodeField,
     Cursor,
     useBlurOnFulfill,
     useClearByFocusCell,
   } from 'react-native-confirmation-code-field';
    
   const styles = StyleSheet.create({
     root: {flex: 1, padding: 20},
     title: {textAlign: 'center', fontSize: 30},
     codeFiledRoot: {marginTop: 20},
     cell: {
       width: 40,
       height: 40,
       lineHeight: 38,
       fontSize: 24,
       borderWidth: 2,
       borderColor: '#00000030',
       textAlign: 'center',
     },
     focusCell: {
       borderColor: '#000',
     },
   });
   //验证码格子个数
   const CELL_COUNT = 6;
    
   const App = () => {
     const [value, setValue] = useState('');
     const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
     const [props, getCellOnLayoutHandler] = useClearByFocusCell({
       value,
       setValue,
     });
    
     return (
       <SafeAreaView style={styles.root}>
         <Text style={styles.title}>Verification</Text>
         <CodeField
           ref={ref}
           {...props}
           value={value}
           onChangeText={setValue}
           cellCount={CELL_COUNT}
           rootStyle={styles.codeFiledRoot}
           keyboardType="number-pad"//弹窗显示数组键盘
           textContentType="oneTimeCode"
           renderCell={({index, symbol, isFocused}) => (
             <Text
               key={index}
               style={[styles.cell, isFocused && styles.focusCell]}
               onLayout={getCellOnLayoutHandler(index)}>
               {symbol || (isFocused ? <Cursor /> : null)}
             </Text>
           )}
         />
       </SafeAreaView>
     );
   };
    
   export default App;
   ```



#### react-native SVG推荐

(就是我们常用的阿里巴巴矢量图标)

```shell
yarn add react-native-svg react-native-svg-uri
```



#### 日期组件推荐

`react-native-datepiker`

用于日期填写

```shell
yarn add react-native-datepicker
```

基本使用（放出基本使用的代码居然使得hexo本身命令startprocessing卡死。。。）



#### 定位组件推荐

使用 [`react-native-amap-geolocation`](https://github.com/qiuxiang./React-native-amap-geolocation)

使用高德地图进行定位

> 高德地图组件
>
> 分别使用了两个功能，一个是AndroidSDK和一个web服务

1. [申请 高度地图的key](https://lbs.amap.com/api/android-location-sdk/guide/create-project/get-key)（可以在b站https://www.bilibili.com/video/BV1e5411L7VV?p=49  ）
   - （这里我个人设置密钥库口令为`taylor`）
   - 踩坑之路：
   - 其中关于PackageName, 如果配置了 build.gradle 文件，PackageName 应该以 applicaionId 为准，防止 build.gradle 中的 applicationId 与 AndroidMainfest.xml 中的 PackageName 不同，导致 key 鉴权不过。
   - 调试版本使用 debug.keystore，命令为：keytool -list -v -keystore debug.keystore
   - 发布版本使用 apk 对应的 keystore，命令为：keytool -list -v -keystore 项目下的debug.keystore
2. 手机端打开GPS，不然会没有权限
3. 

手动配置：

1. 下载依赖

   ```shell
   yarn add  react-native-amap-geolocation
   ```

2. 配置文件

   1. 编辑 `android/settings.gradle`，设置项目路径：

      （+ 号表示要新增）

      ```diff
      + include ':react-native-amap-geolocation'
      + project(':react-native-amap-geolocation').projectDir = new File(rootProject.projectDir, '../node_modules./React-native-amap-geolocation/lib/android')
      ```

   2. 编辑 `android/app/build.gradle`，新增依赖：

      ```diff
      dependencies {
      +   implementation project(':react-native-amap-geolocation')
      }
      ```

   3. 编辑 `MainApplication.java`：（注意rn0.61之后的版本里面，我们不再需要配置这个，也就是0.61版本以上的不用配置）

      ```diff
      + import cn.qiuxiang.react.geolocation.AMapGeolocationPackage;
      
      public class MainApplication extends Application implements ReactApplication {
        @Override
              protected List<ReactPackage> getPackages() {
                @SuppressWarnings("UnnecessaryLocalVariable")
                List<ReactPackage> packages = new PackageList(this).getPackages();
                // Packages that cannot be autolinked yet can be added manually here, for example:
      +         packages.add(new AMapGeolocationPackage());
                return packages;
              }
      }
      ```

自动配置（舒服，懂的都懂，一般情况下 react-native link 即可完成配置，如果因特殊原因无法使用 react-native link 或 link 失败，则可参照以下步骤检查并进行手动配置。）

```shell
react-native link react-native-amap-geolocation
```



基本使用

```js
import { PermissionsAndroid, Platform } from "react-native";
import { init, Geolocation } from "react-native-amap-geolocation";
import axios from "axios";
class Geo {
    //初始化
  async initGeo() {
    if (Platform.OS === "android") {
      await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION);
    }
    //这里要放置在高德地图上，放置的服务平台位android的key，初始化
    await init({
      ios: "891d0cf9dfba7fd2e99b509640f46644",
      android: "891d0cf9dfba7fd2e99b509640f46644"
    });
    return Promise.resolve();
  }
    //获取经纬度
  async getCurrentPosition() {
    return new Promise((resolve, reject) => {
      console.log("开始定位");
      Geolocation.getCurrentPosition(({ coords }) => {
        resolve(coords);
      }, reject);
    })
  }
    //获取地区信息
  async getCityByLocation() {
    const { longitude, latitude } = await this.getCurrentPosition();
    const res = await axios.get("https://restapi.amap.com/v3/geocode/regeo", {
      // 这里的key对应的是高德地图上web端的key
      params: { location: `${longitude},${latitude}`, key: "b63b60478b9fe5e0498c9a6913097056", }
    });
    return Promise.resolve(res.data);
  }
}
export default new Geo();
```



此外，我们还可以配合`react-native-picker`方便在项目中使用

(给Input标签添加点击事件的效果，点击后可以弹出选择地点具体方位的事件，不过这里我还在项目中添加了citys.json文件才能进行选择)

[react-native-picker](https://www.npmjs.com/package./React-native-picker)

> 自定义picker

1. 安装

   ```shell
   yarn add react-native-picker
   ```

   或者

   ```shell
   npm i react-native-picker --save
   ```

2. 代码

   ```react
   import Picker from 'react-native-picker';
   import CityJson from '../../../res/citys.json'//添加了citys.json文件
   Picker.init({
       pickerData: CityJson,  //显示哪些城市的数据
       selectedValue: ["北京", "北京"],//默认选择的数据
       wheelFlex: [1, 1, 0], // 显示省和市
       pickerConfirmBtnText: "确定",
       pickerCancelBtnText: "取消",
       pickerTitleText: "选择城市",
       onPickerConfirm: data => {
           // data =  [广东，广州，天河]
           this.setState(
               {
                   city: data[1]
               }
           );
       }
   });
   Picker.show();
   ```

   效果图：![](/simple-blog/React-native(other)/reactpicker.jpg)





## 5.Mobx

mobx是react中的全局数据管理库，可以简单实现数据的跨组件共享，有点类似于vue中的vuex或者是react的redux，更像vuex，也有利用getter、setter收集组件的数据依赖

可以用在RN或者React网页开发等

Mobx VS redux

- 写法上更偏向于OOP
- 直接对复杂数据修改
- 并非单一store，而是多store
- redux默认以JavaScript原生对象形式存储，而Mobx用可观察对象

优缺点

- 学习成本呢小，面向对象，多TS友好（优）
- 过于自由，提供的约定比较少，容易导致团队开发风格不一统一（缺）
- 相关中间件少，逻辑层业务整合是个问题（缺）

#### 使用步骤

1. 安装依赖

   - `mobx` 核心库
   - `mobx-react` 方便在react中使用mobx技术的库
   - `@babel/plugin-proposal-decorators` 让 `rn` 项目支持 `es7` 的装饰器语法的库

   ```shell
   yarn add mobx mobx-react @babel/plugin-proposal-decorators
   ```

2. 在 `babel.config.js`添加以下配置

   ```js
     plugins: [
       ['@babel/plugin-proposal-decorators', { 'legacy': true }]
     ]
   ```

3. 新建文件 `mobx\index.js` 用来存放 全局数据 

   `@observable`是es7装饰器的语法（使用到了Object.defineproperty）

   ```js
   import { observable, action } from "mobx";
   
   class RootStore {
     // observable 表示数据可监控 表示是全局数据
     @observable name = "hello";
     // action行为 表示 changeName是个可以修改全局共享数据的方法
     @action changeName(name) {
       this.name = name;
     }
   }
   
   export default new RootStore();
   ```

4. 在根组件中挂载

   > 通过 `Provider` 来挂载和传递，包裹在其中的组件可以拿到全局数据

   ```jsx
   import React, { Component } from 'react';
   import { View} from 'react-native';
   import rootStore from "./mobx";
   import { Provider} from "mobx-react";
   class Index extends Component {
     // 正常
     render() {
       return (
         <View  >
           <Provider rootStore={rootStore} >
             <Sub1></Sub1>
           </Provider>
         </View>
       );
     }
   }
   ```

5. 组件中使用

   ```jsx
   import React, { Component } from 'react';
   import { View, Text } from 'react-native';
   import {inject,observer } from "mobx-react";
   
   @inject("rootStore") // 注入传入的属性用来获取 全局数据的
   @observer //  当全局发生改变了  组件的重新渲染 从而显示最新的数据，有点类似setState
   class Sub1 extends Component {
     changeName = () => {
      // 修改全局数据   
       this.props.rootStore.changeName(Date.now());
     }
     render() {
       console.log(this);
       return (
         <View><Text onPress={this.changeName}>{this.props.rootStore.name}</Text></View>
       );
     }
   }
   
   export default Index;
   ```



#### **react中使用mobx**

```shell
npm i mobx@5
```

```js
import React from 'react'
import {observable, autorun} from 'mobx'

// 对数据进行监听
const obNumber = observable.box(0)
const obObject = observable({name: "allen"})
const obArr = observable([])

// 获取数据
console.log(obNumber.get())
console.log(obObject.name)


//修改数据
obNumber.set(20)
obObject.name = "Mikasa"

// 第一次会自动执行，每次监听的数据（这里是obNumber）
//发生改变都会回调该函数，有点像vue3的watchEffect
autorun(() => {
  console.log(obNumber.get());
})

export default function test() {
  return (
    <div>test</div>
  )
}
```



**项目中使用**

在src下新建一个mobx目录

- 新建 store.js

```js
//store.js
import {observable} from 'mobx'

const store = observable({
  isShow: true,
  list: [],
  cityName: 'beijing'
})
export default store;
```

使用中通过useEffect绑定好 `autorun` 和 store某个值的改变即可，十分fast

如果开启了严格模式，在外面通过 `store.fn()`调用action来更改store中的状态即可

```js
import { observable, configure, action } from 'mobx'
//设置严格模式，必须通过actions的方式修改数据
configure({
  enforceActions: 'always'
})
const store = observable({
  isShow: true,
  list: [],
  cityName: 'beijing',
  Show() {
    this.isShow = true
  },
  Hide() {
    this.isShow = false
  }
}, {
  // 标记两个方法是action，专门用来修改
  Show: action,
  Hide: action
})
export default store;
```



##### create-react-app中支持ES7

但是官方的写法仍然是按照上面RN用的哪那种方法一样的，所以我们可以自己定夺使用哪种方法

```js
@observable name = "hello";
// action行为 表示 changeName是个可以修改全局共享数据的方法
@action changeName(name) {
    this.name = name;
}
```

不过目前vscode和react项目并不支持这种@的es7语法，需要我们去进行设置：

vscode的设置中勾中 `experimentalDecorators` 选项

然后安装依赖

```shell
npm i @babel/core @babel/plugin-proposal-decorators @babel/preset-env
```

根目录下创建 `.babelrc`文件

```json
//.babelrc
{
  "presets": [
    "@babel/preset-env"
  ],
  "plugins": [
    [
      "@babel/plugin-proposal-decorators",
      {
        "legacy": true
      }
    ]
  ]
}
```

根目录下创建config-override.js

```js
const path = require('path')
const { override, addDecoratorsLegacy } = require('customize-cra')
function resolve(dir) {
    return path.join(__dirname, dir)
}
const customize = () => (config, env) => {
    config.resolve.alias['@'] = resolve('src')
    if (env === 'production') {
        config.externals = {
            'react': 'React',
            'react-dom': 'ReactDOM'
        }
    }
    return config
};
module.exports = override(addDecoratorsLegacy(), customize())
```

安装依赖

```shell
npm i customize-cra react-app-rewired
```

修改package.json

```json
...
"scripts": {
    "start": "react-app-rewired start",
    "build": "react-app-rewired build",
    "test": "react-app-rewired test",
    "eject": "react-app-rewired eject"
},
...
```




## 6.RN & Flutter

RN

优点：

- RN的效率由于是将View编译成了原生View,所以效率上要比基于Cordova的HTML5高很多。
- **程序组件看起来就像原生组件**（例如，[iOS](https://www.thedroidsonroids.com/services/ios-mobile-app-development)设备上的按钮看起来就像原生 iOS 按钮，[Android 上也是如此](https://www.thedroidsonroids.com/services/android-mobile-app-development)）
- 以JS为编程语言
- 稳定性（上市 5 年以上）

缺点：

- 但是如果我们碰上了复杂的组件渲染结构比如我们渲染一个复杂的ListView,每一个小的控件,都是一个native的view,然后相互组合叠加.想想此时如果我们的list再需要滑动刷新,会有多少个对象需要渲染.所以也就有了前面所说的RN的**列表方案**不友好
- React Native 使用桥接和原生元素，因此可能需要针对每个平台单独优化，它可能会使使用 React Native的[应用程序开发](https://www.thedroidsonroids.com/services)时间更长。

Flutter

优点：

-  吸收了前两者的教训之后,在渲染技术上,选择了自己实现(GDI),由于有更好的可控性，所以在性能方面比RN更高一筹
-  共享域更广，我们可以使用相同的代码库将本机应用程序传送到五个操作系统：iOS、Android、Windows、macOS 和 Linux；以及针对 Firefox、Chrome、Safari 或 Edge 等浏览器的网络体验。Flutter 甚至可以嵌入到汽车、电视和智能家电中（谷歌官方说的）

缺点：

- 但是Dart是AOT编译的，Dart语言受众小，且Flutter的第三方库相对较少


