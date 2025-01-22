---
title: 'webapck(上)'
author: Hello
pubDate: 2021-2-7 
categories: 前端
description: 'wepack解析'
---

## 1.Webpack概述

Bundler 是能够通过 import/export 将很多 JavaScript 文件，打包成一个/几个文件的工具

webpack是一个现代的JavaScript应用的静态模块打包工具（依赖于node环境），是目前最流行的bundler

它可以帮你把AMD、CMD、CommonJS、ES6的一些模块化编写方式，转化为--- > 浏览器可以识别的模块化方案

而且不仅仅JS文件，CSS文件、图片文件等在Webpack也会被当成模块来使用

打包后生成一个文件夹，在服务器进行部署即可



#### 历史

在打包工具未出现之前，我们引入第三方库，要在html下面的script一一引入

然后我们自己项目的业务代码也得在script中一一引入（在第三方库script下方引入，毕竟js是从上到下一一加载的）

浏览器加载一个大脚本，要比加载多个小脚本，性能更好。

除了麻烦之外，还有其他问题：作用域问题、文件大小问题（可以使用nodejs模块方案解决）、文件引用顺序问题（webpack帮你解决！）、可读性差、维护性弱等





**出现grunt和gule**

往后先出现了grunt和gule这两个打包工具

grunt、gule使用IIFE的形式解决作用域问题（立即执行函数）

```js
var res = (function(){
	return {
		name:'allen'
	}
}())
console.loh(res.name)
```

三者都是前端构建工具，grunt和gulp在早期比较流行，而webpack是现在的主流。

[grunt](https://link.juejin.cn/?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%3A%2F%2Fwww.gruntjs.net%2F)和[gulp](https://link.juejin.cn/?target=https%3A%2F%2Flink.zhihu.com%2F%3Ftarget%3Dhttps%3A%2F%2Fwww.gulpjs.com.cn%2F)是基于任务和流（Task、Stream）的。类似jQuery，找到一个（或一类）文件，对其做一系列链式操作，更新流上的数据， 整条链式操作构成了一个任务，多个任务就构成了整个web的构建流程。

webpack基于入口，webpack会自动地**递归**解析入口所需要加载的所有资源文件，然后用不同的Loader来处理不同的文件，用Plugin来扩展webpack功能。

**模块拓展**

出现了nodejs，模块方案得以解决，但是浏览器上并不能运行node，在早期我们使用的是requirejs库，调用库的方法，让浏览器可以使用nodejs（webpack）

后面ES6之后，支持了浏览器端的模块加载，多了一种实现模块加载的方案（vite使用）



#### 起步

安装

```shell
npm i webpack webpack-cli -g
```

https://webpack.docschina.org/guides/getting-started/     <-  看这里

> 注意：全局安装webpack在多人开发模式下会有版本风险，建议本地安装即可

若只想执行本目录下node_modules的webpack版本可以使用

```shell
npx webpack
```

这种在package.json的script里（脚本），设置 

```json
"script": {
	"build": "webpack"
}
```

执行 `npm run build`即可



入口、打包文件的存放：

新建两个文件夹，src放置开发的源码，dist放置之后打包的文件

方法一：（全局安装webpack）webpack在打包的时候，会查看你有没有依赖其他文件，所以给一个入口文件(`main.js`或者`index.js`)就好了 

```powershell
webpack ./src/入口文件.js ./dist/打包后文件名.js
```

这时在html文件内用script引用打包后的js文件即可



方法二：指定option

执行以下代码可以帮助查看webapck一些相关命令

```shell
npx webpack --help
```

模式为生产模式，入口为 `./src/index.js`

```
npx webpack --entry ./src/index.js --mode production
```

此时会自动在目录下生产dist文件存放打包好的js文件



方法三：新建一个 `webpack.config.js`，配置入口 `entry`和出口 `output`，output推荐用对象的形式来写

```js
const path = require('path');
module.exports = {
    entry: './src/main.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'        //打包后的文件名
    }
}
```

由于要依赖node的核心模块path以动态获得output的绝对路径，这里先进行npm初始化，得到`package.json`包，

这时在命令窗口直接输入

```shell
npx webpack
```

或者用映射来运行：（更推荐，因为它会优先在本地找依赖包，而不是全局找依赖包，全局依赖包可能因为版本原因导致代码报错）

在package.json文件中的 `script` 配置

```json
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "npx webpack"
},
```

然后再命令窗口输入

```shell
npm run build
```



#### 一些webpack设置

```js
module.exports = {
    /*设置模式，可以去官网查看，其实这个模式代表webpack帮你调了很多配置
    1.development，开发阶段
    2.production，打包上线阶段
    */
		mode: "development",
    //设置source-map，简历js映射文件（类似于我们在vue3中调试源码的行为），帮助我们在错误时直接定位代码位置，并且显示的是babel前的代码
    devtool: "source-map",
    entry: './src/main.js',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'        //打包后的文件名
        clean: true,                 // 在生成文件之前清空 output 目录
    },
    library: 'myLib',                //如果要打包的是自己创建的方法库，请配置上library
}
```



##### 打包成库

打包成库记得要配置上library

```js
module.exports = {
  //...
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'webpack-numbers.js',
    library: "webpackNumbers",
  },
}
```

但是此时只能作为esm模块被使用，只能通过被 script 标签引用而发挥作用，它不能运行在 CommonJS、AMD、Node.js 等环境中。

作为一个库作者，我们希望它能够兼容不同的环境

我们更新 `output.library` 配置项，将其 `type` 设置为 [`'umd'`](https://webpack.docschina.org/configuration/output/#type-umd)：

```diff
 const path = require('path');

 module.exports = {
   entry: './src/index.js',
   output: {
     path: path.resolve(__dirname, 'dist'),
     filename: 'webpack-numbers.js',
-    library: 'webpackNumbers',
+    library: {
+      name: 'webpackNumbers',
+      type: 'umd',
+    },
   },
 };
```

type类型：

` "var" | "module" | "assign" | "assign-properties" | "this" | "window" | "self" | "global" | "commonjs" | "commonjs2" | "commonjs-module" | "commonjs-static" | "amd" | "amd-require" | "umd" | "umd2" | "jsonp" | "system" | string`

> 输出 ES 模块(module)。请确保事先启用 [experiments.outputModule](https://webpack.docschina.org/configuration/experiments/)。



##### source-map

关于webpack.config.js配置中devtool的设置，默认值为 eval（最好性能）

| 模式                    | 详情                                                         |
| ----------------------- | ------------------------------------------------------------ |
| eval                    | 每个module会封装到eval，包裹起来执行，并在末尾追加注释 //@sourceURL |
| source-map              | 生成一个SourceMap文件                                        |
| hidden-source-map       | 同source-map，但是不会在bundle末尾追加注释（即无法锁定源文件发生错误的行数） |
| inline-source-map       | 生成一个DataURL形式的SourceMap文件                           |
| eval-source-map         | 每个module都会通过eval执行，并生成一个DataURL形式的SourceMap文件 |
| cheap-source-map        | 生成一个没有列信息（column-mapping）的SourceMap文件，但是有行信息，不包含loader的sourcemap（比如babel后无法显示真正对应的行数），可以减少source-map文件大小 |
| cheap-module-source-map | 生成一个没有列信息（column-mapping）的SourceMap文件，但是有行信息，同时loader的sourcemap也被简化为只包含对应行 |

但是要注意的是，生产环境我们一般不会开启source-map

- 通过bundle和sourcemap文件，可以反编译出源码，也就是说线上产物yousourcemap文件的话，就意味着又暴露代码的风险
- source-map文件体积相对比较大，而我们生产环境当然更加追求更轻量级更小的包



#### Loader和Plugin

loader类似于一个转换器，plugin相对webpack本身的拓展，类似于一个拓展器

**不同的作用**

- **Loader**可以实现让Webpack加载和解析除了JavaScript以外的能力。
- **Plugin**直译为"插件"。Plugin可以扩展webpack的功能，让webpack具有更多的灵活性。 在 Webpack 运行的生命周期中会广播出许多事件，Plugin 可以监听这些事件，在合适的时机通过 Webpack 提供的 API 改变输出结果。

**不同的用法**

- **Loader**在`module.rules`中配置，也就是说他作为模块的解析规则而存在。 类型为数组，每一项都是一个`Object`，里面描述了对于什么类型的文件（`test`），使用什么加载(`loader`)和使用的参数（`options`）
- **Plugin**在`plugins`中单独配置。 类型为数组，每一项是一个`plugin`的实例，参数都通过构造函数传入。



## 2.Loader

(前言：你已经是一个成熟的webpack了，应该学会自己安装loader！！！)

webpack主要用来处理我们js代码，进行模块化开发，并且自动处理js之间的依赖关系

但是在开发中，我们不仅仅有基本的js代码需要处理，也需要加载css、图片，包括一些高级的将ES6转化为ES5代码，或者TypeScript转化为ES5代码，将scss、less转化为css，css兼容低版本的等等

对于webpack本身能力来说，对于这些转化是不支持的，这时我们需要用到loader。

> 注意：在use选项中，loader的放置顺序需要注意下，是从下往上的，比如style-loader一定要比css-loader后执行，所以style-loader放上面，css-loader放下面
>

1.通过npm安装需要使用的loader

2.在webpack.config.js的module关键字下进行配置（根据官网给的配置信息填充就可以了）

#### **处理CSS文件**

这里举一个CSS文件打包的例子，需要配置 `style-loader` （负责将导出的样式添加到DOM（用于生效））和 `css-loader`（负责加载并解析import的CSS文件（用于加载））

```shell
npm install --save-dev style-loader css-loader
```

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```



#### **处理图片**

（在webpack5里面，url-loader和file-loader不再使用）

当CSS要使用 `background-image`的url导入图片时，可以安装 `file-loader`并且在webpack.config.js中配置，用于加载图片

若想要在html中设置某元素的src，我们不应该直接根据当前图片距离我们的路径进行字符串设置，而是应该由打包的思想，引入模块来连接它们之间的关系

```js
 module: {
    // 指定加载规则
    rules: [
      {
        test: /\.(jpe?g|png|gif|svg)/
        use: "file-loader"
       }
     ]
 }
```

```js
import Image from '../img/xx.jpg'
imgEl.src = Image;
```



在使用到图片的场景时，也可以使用对应的图片`url-loader`

关于url的loader中配置的`option`选项有一个`limit`      可以进行设置： ` limit: 8192,`

当加载的图片小于这个`limit`时，会将图片编译成base64字符串形式

若大于limit，则还需要安装一个loader，即`file-loader`模块进行加载，从入口js文件打包会得到一张随机命名（32位的哈希值）的图片于dist文件夹中。（安装后并不需要配置`file-loader`）

（如果没有安装HtmlWebpackPlugin插件，我们index.html（想要加载到的页面）在dist文件外面，这时就还需要在webpack的配置文件里的`output`中，添加`publicPath:'dist/'`，这样以后涉及到url的路径，都会自动添加上 `'dist/'`）

但是真实开发中对打包的图片命名有一定要求，我们可以在`url-loader`的配置option里面，增加其他属性

命名规范：https://v4.webpack.js.org/loaders/file-loader/#n

```js
options: {
    limit: 8192,
    name: 'img/[name].[hash:8].[ext]',  // 按照这个规范进行命名，ext是拓展名，打包的时候放到
    //output: "img"                     上方没有“img/”的时候可以写，输出到打包文件夹下img文件里
},
```



#### 资源模块 （替代以往部分loader）

上述说道webpack5开始，我们可以直接使用资源模块类型（asset module type）来替代以上处理图片、其他资源的loader

注意！不用下载loader了！！也就是说是内置的

##### 基本介绍

- asset/resource，发送一个文件并导出url（替代file-loader），直接一个图片（png、jpg）的url去使用，打包后会出现在dist文件夹下

  ```js
  import imgSrc from "../asset/1.jpg";
  const img = document.createElement("img");
  img.src = imgSrc;
  ```

- asset/inline，导出一个资源URI（替代url-loader，通过[`Rule.parser.dataUrlCondition.maxSize`](https://webpack.docschina.org/configuration/module/#ruleparserdataurlcondition) 选项来修改此limit），比如svg之类的，在打包之后不会出现在dist文件夹中

  ```js
  import mySvg from "../asset/1.svg";
  const img = document.createElement("img");
  img.src = mySvg;
  ```

- asset/source，导出资源的源代码（替代raw-loader），比如txt文件，通过import导入时可以txt文本内容

  ```js
  import Txt from "../asset/1.txt";
  const div = document.createElement("div");
  div.textContent = Txt
  ```

- asset，在导出data URI和发送一个单独的文件之间自动选择，可以当成是asset/resource、asset/inline之间进行自动选择，之前通过url-loader，并且通过配置资源体积限制实现。

  实际上是根据图片大小进行选择，小则inline、大则resource

  还可以自己设置这个大小

  ```js
  rules: [
      {
          test: /\.jpg/,
          type: "asset",
          parser: {
              dataUrlCondition: {
                  maxSize: 4 * 1024 * 1024 //大于4M时才使用resource
              }
          }
      }
  ]
  ```

  

##### 具体配置方法

```js
//webpack.config.js
module.exports = {
    module: {
        // 指定加载规则
        rules: [
            {
                test: /\.(jpe?g|png|gif|svg)/,
                type: "asset/resource"
            }
        ]
    }
};
```

但是经过打包处理之后，资源都是直接放在dist里面，看起来比较杂乱

方法一：在webpack配置文件的output option中定义 `assetModuleFilename`

```js
output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js", //打包后的文件名，
    clean: true,
    assetModuleFilename: "imges/[contenthash][ext]", //根据文件内容，生成一个哈希字符串，然后拓展名使用[ext]来生成原来文件的拓展名
  },
```

方法二（高于方法一优先级）：在使用资源模块中配置rules时，顺便配置generator

```js
rules: [
    {
        test: /\.(jpe?g|png|gif|svg)/,
        type: "asset/resource",
        generator: {
            filename: "images/test.png",
        },
    },
],
```



##### 加载icon字体

```js
rules: [
    {
        test: /\.(woff|woff2|eot|ttf|otf)/,
        type: "asset/resource",
		
    },
],
```



#### 处理Vue

引入Vue.js 首先在项目中使用Vue.js，需要先通过npm安装Vue

```shell
npm install vue --save
```

但是，vue在最终构建发布版本时，会构建两类版本，分别是 

- `runtime-only` 代码中不能有任何的template
- `runtime-compiler` 代码中可以有template。（此版本需要在webpack.config.js中配置信息，此时在module配置项的下方添加：）

```js
resolve: {
    // 别名,让vue结尾的指向一个具体的文件夹的文件
    // 默认指向'vue/dist/vue.runtime.js'
    alias: {
        'vue$': 'vue/dist/vue.esm.js'
    }
}
```



如果想要通过vue文件分离组件和主要的main.js文件时，会是使用到vue文件

这时需要安装 `vue-loader`（负责加载，如果是Vue3则安装 `vue-loader@next` ） 和 `@vue/complier-sfc-D`（负责编译）

老样子在`module`的 `rules` 添加配置信息（这里没use@vue/complier-sfc-D是因为vue-loader内部已经use了）

```js
test: /\.vue$/,
use: ['vue-loader']
```

但是Vue Loader v15 现在需要配合一个 webpack 插件才能正确使用：

```js
// webpack.config.js
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
  // ...
  plugins: [
    new VueLoaderPlugin()
  ]
}
```



#### PostCSS工具

PostCSS是一个通过JavaScript转换样式的工具，这个工具可以帮助我们进行一些CSS的适配，比如添加浏览器前缀、css样式重置等。

使用：

- 查找PostCSS在构建工具中的拓展、入webpack的postcss-loader
- 选择并添加你需要的PostCSS相关插件
- 使用webpack.config.js 亦或者 新建一个postcss.config.js进行配置都可

比如比较好用的插件

autoprefixer，自动获取浏览器的流行度和能支持的属性，并且根据这些数据帮我们自动为CSS添加前缀处理，使用[Can I Use](http://www.caniuse.com/)的数据来决定哪些前缀是需要的，将最新的css语法转化为大多数浏览器都能理解的语法；

并且在postcss的基础上加`autoprefixer`，可以自动为不同的目标浏览器添加样式前缀，解决的是浏览器兼容性的问题

```shell
npm install --save-dev autoprefixer
```

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  [
                    'autoprefixer',
                    {
                      // 选项
                    },
                  ],
                ],
              },
            },
          },
        ],
      },
    ],
  },
};
```



postcss-preset-env，它可以帮助我们将一些现代的CSS特型转化大多浏览器都认识的CSS，并且根据目标浏览器或运行时的环境添加所需polyfill，也包括会自动帮我们添加autoprefixer

```shell
npm i -D postcss postcss-loader postcss-preset-env
```



Autoprefixer 使用[Browserslist](https://github.com/browserslist/browserslist)，因此您可以使用类似的查询指定您想要在项目中定位的浏览器`> 5%` （请参阅[最佳实践](https://github.com/browserslist/browserslist#best-practices)）。

提供浏览器的最佳方式是`.browserslistrc`在您的项目根目录中添加一个文件，或者通过`browserslist`向您的`package.json`.

我们建议使用这些选项而不是将选项传递给 Autoprefixer，以便配置可以与其他工具共享，例如[babel-preset-env](https://github.com/babel/babel/tree/master/packages/babel-preset-env)和 [Stylelint](https://stylelint.io/)。

有关查询、浏览器名称、配置格式和默认值，请参阅[Browserslist 文档。](https://github.com/browserslist/browserslist#queries)



#### 优化的Loader

**HappyPack**：受限于 Node 是单线程运行的，所以 Webpack 在打包的过程中也是单线程的，特别是在执行 Loader 的时候，长时间编译的任务很多，这样就会导致等待的情况，然而HappyLoader可以将Loader单行转换为并行

**eslint-loader**：通过 ESLint 检查 JavaScript 代码（This loader has been deprecated. Please use eslint-webpack-plugin）

**EslintWebpackPlugin**：应用于webpack5的eslint



#### 打开 webpack 文件缓存调试日志的方法

```js
tools: {
    webpackChain: (chain) => {
        chain.merge({
            infrastructureLogging: {
                level: 'verbose',
                colors: true,
                debug: /webpack\.cache/,
            }
        });
    }
}
```



## 3.plugin

plugin是插件的意思，通常用于对某个现有架构进行扩展

使用：

- 1.通过npm安装需要的插件（但是有些插件webpack已经内置了）
- 2.然后在webpack.config.js中的plugins进行配置

下面举一个加入版权的插件的例子

```js
// webpack.config.js
const webpack = require('webpack');

module.exports = {
  // ...
  plugins: [
    new webpack.BannerPlugin('最终版权归Hello所有')
  ]
}
```



#### HtmlWebpackPlugin

真是发布项目时，发布的是dist文件夹中的内容，但是打包的时候并没有将html文件也打包进dist文件夹中，

此时我们需要用到`HtmlWebpackPlugin`插件，它会自动生成一个index.html文件（可以按照指定模板来生成），并且将打包后的js文件，自动通过script标签插入到body中

1.安装插件 

```shell
npm install html-webpack-plugin --save-dev
```

2.使用插件，在webpack.config.js中使配置信息

```js
// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // ...
  plugins: [
    new HtmlWebpackPlugin()
  ]
}
```

此时生成的html文件的`body`内还没有根元素绑定Vue，我们可以给个模板，模板里有我们理想的存放好的标签，让它根据模板生成该 `div`元素

```js
new HtmlWebpackPlugin({
    // 寻找当前目录下的index.html, 根据这个生成模板（定义title之类的），可以参考Vue的脚手架搭建时下面放置的模板html
    template: './index.html',
    //默认将打包文件放在head，可以设置放在html的body里面
    inject:'body',
    //如果打包多个html文件来引入不同的script包，则定义filename来区分打包输入html
    filename: 'index.html'
})
```



##### 多入口entry

通过不同的entry文件打包多个html文件

1. 一个项目中保存了多个 HTML 模版，不同的模版有不同的入口，并且有各自的 router、store 等；
2. 不仅可以打包出不同 HTML，而且开发的时候也可以顺利进行调试；
3. 不同入口的文件可以引用同一份组件、图片等资源，也可以引用不同的资源；

综上所述，你可以理解为要写多个页面，但是页面之间要复用组件、函数等

```js
plugins:[
    new HtmlWebpackPlugin({
        //如果打包多个html文件来引入不同的script包，则定义filename来区分打包输入html
        filename: 'index.html',
        chunks:['main']
    }),
    new HtmlWebpackPlugin({
        template: './index.html',
        filename: 'index2.html',
        chunks:['main2', 'lodash']
    })
],
entry: {
    main: {
      import: "./src/index.js",
      dependOn: "lodash",
    },
    main2: {
      import: "./src/another-bundle.js",
      dependOn: "lodash",
    },
    lodash: "lodash",
},
```



#### DefinePlugin全局变量

webpack内部有一个DefinePlugin，可以直接通过以下方式进行获取，然后在webpack.config.js里面获取设置全局变量

```js
const { DefinePlugin } = require("webpack")
```





#### js压缩的plugin

webpack v5 开箱即带有最新版本的 `terser-webpack-plugin`。如果你使用的是 webpack v5 或更高版本，同时希望自定义配置，那么仍需要安装 `terser-webpack-plugin`。如果使用 webpack v4，则必须安装 `terser-webpack-plugin` v4 的版本。

首先，你需要安装 `terser-webpack-plugin`：

```console
$ npm install terser-webpack-plugin --save-dev
```

然后将插件添加到你的 `webpack` 配置文件中。例如：

**webpack.config.js**

```js
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
};
```



除此之外，还有其他比较有用的压缩插件

- extract-text-webpack-plugin 用于将 CSS 从主应用程序中分离
- optimize-css-assets-webpack-plugin 压缩提取出的css，解决extract-text-webpack-plugin CSS重复问题
- CommonsChunkPlugin 将公共模块拆出来，最终合成的文件能够在最开始的时候加载一次，便存到缓存中供后续使用





#### MiniCssExtractPlugin

> 注意⚠️：仅支持webpack5以上

**抽出style代码**

使用`style-loader` 和 `css-loader`进行转换得到的代码，是直接放置在html中的，要想放置在另外一个文件，然后让打包后的html进行link引用，需要安装： `mini-css-extract-plugin`（需要webpack5以上版本）

```shell
npm i mini-css-extract-plugin -D
```

因为style-loader是将导出的样式添加到DOM，此时假如我们使用了style-loader，需要我们

**手动删除掉**

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
  plugins: [new MiniCssExtractPlugin({
  	filename:'styles/[contenthash].css' //打包时自动生成styles文件夹，并且根据文件内容，生成一个hash名称的css文件存放其中
  })],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
    ],
  },
};
```



#### css压缩的plugin

我们还需要先把mode改为production，并且安装了MiniCssExtractPlugin

```js
module.exports = {
	mode: "production",
}
```

安装

```shell
npm i css-minimizer-webpack-plugin -D
```

```js
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  module: {
    rules: [
      {
        test: /.s?css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  optimization: {
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      // `...`,
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};
```

> 注意，如果在optimization中配置了css的压缩，则js默认的webpack自带terser插件压缩效果失效，需要同样在optimization中重新配置

首先下载terser

```shell
npm i terser-webpack-plugin -D
```

在webpack配置项中使用

```js
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
//...
  optimization: {
    minimizer: [
      // 在 webpack@5 中，你可以使用 `...` 语法来扩展现有的 minimizer（即 `terser-webpack-plugin`），将下一行取消注释
      // `...`,
      new CssMinimizerPlugin(),
      new TerserPlugin(),
    ],
  },
};
```

此时通过修改mode，即可看到测试环境development没压缩代码、production下代码压缩了
