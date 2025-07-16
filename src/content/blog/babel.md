---
author: Hello
categories: 前端
pubDate: 2021-2-7 
title: babel
description: 'babel相关'
---

## 1.babel介绍

#### 小概

- polyfill：polyfill主要抚平不同浏览器之间对js实现的差异，比如一些es6的语法，通过polyfill注入代码，使得es5也能正常运行api

- Core-js：它是**JavaScript 标准库中最流行也最常用的polyfill**
  - core-js：包含所有polyfill（当然也可以仅引入部分特性的polyfill，比如：
  
    ```js
    import 'core-js/features/array/from'; // <- at the top of your entry point
    import 'core-js/features/array/flat'; // <- at the top of your entry point
    import 'core-js/features/set';        // <- at the top of your entry point
    import 'core-js/features/promise';    // <- at the top of your entry point
    
    Array.from(new Set([1, 2, 3, 2, 1]));          // => [1, 2, 3]
    [1, [2, 3], [4, [5]]].flat(2);                 // => [1, 2, 3, 4, 5]
    Promise.resolve(32).then(x => console.log(x)); // => 32
    ```
  
    但是即使在这里部分引入的polyfill，依然会直接扩展到全局环境中
  
  - core-js-pure：不会把polyfill注入全局环境，但是在使用时需要单独引入polyfill的module
  
  - core-js-bundle：编译打包好的版本，包含全部的polyfill特性，适合在浏览器里面通过script直接加载，前2个版本适合放构建工具
  
- regenerator-runtime：用来转换 `generator` 和 `async` 函数，也是一个polyfill

- babel：

  - 内部借助了corejs对代码添加polyfill

  - 并且支持ES6的代码转换为ES5代码（class、箭头函数、properties）
  - 支持jsx等编译转换

在babel7之前，babel专门提供了一个库叫babel/polyfill来做polyfill，在babel7之后，这个库被废弃了

babel的每一种转换处理都对应一个babel插件，但是plugin太多了，所以babel推出了presets，包含若干个plugin



#### 自定义preset

安装完对应plugin之后，新建一个`my-preset.js`

```js
module.exports = () => ({
  plugins: [
    ['@babel/plugin-transform-arrow-functions'],
    ['@babel/plugin-transform-classes', {spec: false}],
    ['@babel/plugin-transform-computed-properties'],
    ['@babel/plugin-proposal-object-rest-spread', {loose: true, useBuiltIns: true}]
  ]
});
```

然后在babel配置文件中导入

```js
//babel.config.js
const presets = [
    './my-preset.js'
];
const plugins = [
];

module.exports = {presets, plugins}
```



#### webpack and babel

如果希望将ES6语法转化成ES5语法，我们可以使用babel对应的loader，配置打包得到新的js文件

```shell
npm install -D babel-loader @babel/core @babel/preset-env
```

- @babel/core
  - babel的核心工具
- @babel/preset-env
  - babel的预定义环境，包含大量实用babel plugin，还能根据browserslist进行配置，满足运行环境最低版本要求
  - 融入了corejs，并且有对应的配置项进行适配，抛弃了传统的 `@babel/polyfill` 直接全量引入
- @babel-loader
  - babel在webpack中的加载器

其实还可以配置一个`core-js`，`core-js`用来使老版本的浏览器支持新版ES语法（比如老版本没有Promise，它会给你引进去coreJs库里的Promise函数），然后按需加载可以使用到的 `core-js` 部分

> 如果 `@babel/core` or `@babel/plugin-transform-regenerator` 版本 小于 `7.18.0`，你需要加载  [`regenerator runtime`](https://github.com/facebook/regenerator/tree/main/packages/runtime) 来加载 core-js/stable， 如果 你用了 `@babel/preset-env`'s `useBuiltIns: "usage"` option or `@babel/plugin-transform-runtime`. 则会自动加载  core-js/stable





## 2.配置

在`webpack.config.js`中的配置

```js
const path = require('path')

module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    // 指定加载规则
    rules: [
      {
        //这里使用TypeScript
        test: /\.ts$/,// test指定规则生效的文件,以ts结尾的图片
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: [
                [
                  '@babel/preset-env',
                  {
                    // 要兼容的目标浏览器
                    targets: {
                      "chrome": "58",
                      "ie": "8"
                    },
                    // corejs版本
                    "corejs": "3",
                    // 使用corejs的方式，按需加载
                    "useBuiltIns": "usage"
                  }
                ]
              ]
            }
          },
          // 如果使用typescript的loader，要把ts-lodaer放下方，babel-loader放上方
          // webpack从后往前执行，所以必须要先执行ts -> Js转换，再执行js兼容性的转换
          'ts-loader'
        ],
      }
    ]
  },
}
```

- @babel/preset-env：

  - useBuiltIns

    - 默认false，不会有任何 polyfill 被添加进来
  
    - entry，需要我们手动针对项目入口文件处全局注入的`core-js`进行优化转换，但是只针对`core-js@3`版本
  
      ```js
      import "core-js";
      //...
      ```
  
    - usage，按需导入，效果比 entry 好（体积小，可以看 [这里](https://icodex.me/docs/engineer/webpack%E4%BC%98%E5%8C%96/webpack%E4%BC%98%E5%8C%96%EF%BC%882%EF%BC%89/)）
  
  - corejs
  
    - 安装完`core-js`后还需要在`@babel-preset-env`中指定其版本，如果开启`useBuiltIns`，默认为`2.0`版本，这里肯定要改成`3.0+`的，因为`3.0`的`core-js`改进很大。



当然，我们也可以在根目录下，创建一个`babel.config.js` / `babel.config.json` / `.babelrc`  将babel配置信息放在一个独立的文件中

```js
//babel.config.js
module.exports = {
    preset: {
        "@babel/preset-env"
    }
}
```

然后在webpack.config.js里的rules里直接use `babel-loader`即可



你甚至可以在package.json里面写

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "babel": {
    "presets": [  ],
    "plugins": [  ]
  }
}
```



## 3.transform-runtime

#### **(1)Babel 插入了辅助代码**

1. **Babel 在每个文件都插入了辅助代码，使代码体积过大！**

   Babel 对一些公共方法使用了非常小的辅助代码，比如 `_extend`，默认情况下会被添加到每一个需要它的文件中。

   而`transform-runtime`插件可以把这些重复的辅助代码，转换成公共的函数进行引入

2. 我们正常给应用全局环境注入polyfill，是没啥问题的，但是如果在开发一个独立的工具库项目，不确定它将会被其它人用到什么运行环境里面，那么前面那种扩展全局环境的polyfill就不是一个很好的方式，而transform-runtime会为你创造一个沙盒环境来运行当前代码

下面的配置禁用了 Babel 自动对每个文件的 runtime 注入，而是引入 `@babel/plugin-transform-runtime` 并且使所有辅助代码从这里引用。

更多信息请查看 [文档](https://babel.docschina.org/docs/en/babel-plugin-transform-runtime/)。

```shell
npm install --save-dev @babel/plugin-transform-runtime
npm install --save @babel/runtime
```

```javascript
rules: [
  // 'transform-runtime' 插件告诉 Babel
  // 要引用 runtime 来代替注入。
  {
    test: /\.m?js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
        plugins: ['@babel/plugin-transform-runtime']
      }
    }
  }
]
```

注意：如果同时开启plugin-transform-runtime和preset-env的polyfill，则会

```js
rules: [
  {
    test: /\.m?js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: [
          '@babel/preset-env',
          {
              "targets": {
                  ios: 8,
                  android: 4.1
              },
              useBuiltIns: 'usage'
          }
        ],
        plugins: ['@babel/plugin-transform-runtime', {
        	corejs: 3
        }]
      }
    }
  }
]
```

然后对以下进行转换

```js
Promise.resolve().finally();
```

会出现

```js
"use strict";

var _interopRequireDefault = require("@babel/runtime-corejs3/helpers/interopRequireDefault");

var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));

require("core-js/modules/es6.promise");

require("core-js/modules/es6.object.to-string");

require("core-js/modules/es7.promise.finally");

_promise.default.resolve().finally();
```

`require("core-js/modules/es6.promise");` 和 `var _promise = _interopRequireDefault(require("@babel/runtime-corejs3/core-js-stable/promise"));` 这种重复的polyfill的存在，所以我们在开发时要关闭其中之一

```js
options: {
  	presets: ['@babel/preset-env'],
    plugins: ['@babel/plugin-transform-runtime']
}
```

或者

```js
[
    "@babel/plugin-transform-runtime", {
        corejs: false,
        regenerator: false
    }
]
```

最后注意：

1. 它跟preset-env提供的polyfill适用的场景是完全不同，runtime适合开发库，preset-env适合开发application
2. runtime与preset-env的polyfill不能同时启用
3. runtime的polyfill不判断目标运行环境（并不支持 targets 的配置）





#### (2)箭头函数

babel后部分浏览器仍然不支持箭头函数，是因为webpack5打包文件默认输出形式就是箭头函数，用以下配置解决即可

```js
output: {
        filename: 'js/bundle.js',
        path: path.resolve(__dirname, 'dist'),
        environment: {
            arrowFunction: false
        }
},
```



#### (3)babel优化

影响打包效率的loader首当其冲必属 Babel 了

我们可以控制babel文件搜索范围，只转换指定文件夹下的代码，去除没必要转换的部分，比如node_modules

```js
module.exports = {
  module: {
    rules: [
      {
        // js 文件才使用 babel
        test: /\.js$/,
        loader: 'babel-loader',
        // 只在 src 文件夹下查找
        include: [resolve('src')],
        // 不会去查找的路径
        exclude: /node_modules/
      }
    ]
  }
}
```



#### **(4)babel**原理

babel就是从一种源代码转换为另外一种源代码，或者把babel看成一种编译器

https://juejin.cn/post/7078482623387402271#comment



参考文章：

[webpack官网](https://webpack.js.org/)

[babel官网](https://www.babeljs.cn/docs/)

[babel详解](https://blog.liuyunzhuge.com/categories/Javascript/babel/)
