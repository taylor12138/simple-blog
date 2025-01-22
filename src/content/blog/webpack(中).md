---
author: Hello
pubDate: 2021-2-7 
categories: 前端
title: 'webapck(中)'
description: 'wepack解析'
---

## 4.其他

#### webpack开发环境的开发模式

##### 1. watch模式

该模式下，webpack会实时侦测我们的js文件变化，在webpack依赖图的所有文件，只要有一个发生了更新，那么代码将被重新编译

但如果使用下方搭建服务，则没必要开启这个watch模式，因为服务内置了热更新

开启方法：

```json
   "scripts": {
     "test": "echo \"Error: no test specified\" && exit 1",
    "watch": "webpack --watch",
     "build": "webpack"
   },
```

但是需要我们人工刷新一下浏览器



##### 2.dev-server模式

为了让webpack提供开发时服务，可以装载`webpack-dev-server`搭建本地服务器，它内部使用了express框架

实际上Vue、React脚手架搭建完毕后，呈现的页面都用到了这个本地服务器

```shell
npm install webpack-dev-server -D
```

在webpack.config.js里配置（这里有多个入口）

```json
module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    print: './src/print.js',
  },
  devtool: 'inline-source-map',
+ devServer: {
+   static: './dist',
+ },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
+ optimization: {
+   runtimeChunk: 'single',
+ },
};
```

> 因为在这个示例中单个 HTML 页面有多个入口，所以添加了 `optimization.runtimeChunk: 'single'` 配置。没有这个配置的话，我们可能会遇到 [这个问题](https://bundlers.tooling.report/code-splitting/multi-entry/)。 查看 [代码分割](https://webpack.docschina.org/guides/code-splitting/) 章节获取更多细节。

从那个问题的官网中也可以看到公共依赖的实例对象，可能会被实例化多次，接而失去状态的同步，为了保持实例的共享（状态同步），需要配置[`optimization.runtimeChunk`](https://webpack.js.org/configuration/optimization/#optimizationruntimechunk)为`"single"`，默认情况下它是禁用的，但记录在[Webpack 的代码拆分指南](https://webpack.js.org/guides/code-splitting/)中。



当然你也可以配详细一点

再推荐一个`copyWebpackPlugin`，帮助你把资源在webpack打包的时候，也放进去

```js
var path = require('path');

module.exports = {
    //...
    devServer: {
        static: path.resolve(__dirname, './dist'),//指向当前服务的物理路径
        /*
        contentBase为：在webpack给我们打包的资源中找不到时，再去查找的地址，是一个额外的文件地址
        一般用于在开发时段不想使用copyWebpackPlugin，避免打包的时候速度太慢
        开发阶段：contentBase
        打包阶段：copyWebpackPlugin，然后放到服务器中
        */
        contentBase: path.resolve(__dirname, './dist'),
        // inline是否实时监听
        inline:true,
        host: 0.0.0.0,  //设置地址，默认localhost
        compress: true, //是否开启gzip压缩资源,默认true
        port: 9000, //端口号设置
        open: true, //自动打开浏览器
        proxy: {    //和React配置代理的原理相同,仅限测试环境下跨域解决方案
            '/api': {
                target: 'http://localhost:3000',
                pathRewrite: { '^/api': '' },
             },
    		'/api2': 'http://localhost:3000',
    	},
    	headers: {
            'X-Access-Token': 'abc123' //设置
        },
        https: true, //将服务器设置为https，但是需要配置一些证书
        historyApiFallback: true, //一般vue、react脚手架都会配置，用于SPA时如果输入未配置的路由，可以用某个页面替代任何404的静态资源请求
        devMiddleware:{
            writeToDisk: true   //每次启动服务的同时，也会进行打包
        }
    }
};
```

此时还可以和起步配置 `npm run build` 一样顺便在package.json文件的script中增加

 `"dev":"webpack-dev-server"` / `"serve": "webpack serve"`

或者是 

 `"dev":"npx webpack-dev-server"` / `"serve": "npx webpack serve"`

这时候运行起来就直接  `npm run dev`即可

模块热更新原理：

实际上webpack是有进行打包的，但所有的产物文件都默认不会写到磁盘，而是放到内存中，所以没做文件输出，此时我们就算删除掉dist文件，服务还是照常进行，毕竟放进了内存



##### 3.middleware模式

webpack-dev-middleware

`webpack-dev-middleware` 是一个封装器(wrapper)，它可以把 webpack 处理过的文件发送到一个 server。`webpack-dev-server` 在内部使用了它，然而它也可以作为一个单独的 package 来使用，以便根据需求进行更多自定义设置。下面是一个 webpack-dev-middleware 配合 express server 的示例。

在[官网](https://webpack.docschina.org/guides/development/#using-webpack-dev-middleware)上可以继续查看使用方法，可以理解为webpack的中间件node运行模式，直接运行node



#### webpack的resolve配置（模块解析相关）

在webpack.config.js中配置，用于解析

```js
module.exports = {
    //...
    resolve: {
        //默认配置好的后缀名处理,导包的时候不同添加以下后缀名，可以自动识别，当然你也可以自己添加
        extensions: [".js", ".json", ".mjs"],
        //配置别名 alias
        alias: {
            "js": path.resolve(__dirname, "./src/js");
        }
    }
};
```



#### 生产/开发时配置文件分离

开发时依赖的配置文件和发布时依赖的配置文件进行分离

新建一个config文件夹 -> 新建一个 base.config.js文件 (公共的配置放在base里) 、prod.config.js文件（放置生产时的配置）和dev.config.js（放置开发时的配置）

这里还需要安装merge，用于合并公共配置和生产/开发配置 

```shell
npm i webpack-merge@4.1.5 --save-dev
```

然后**分别**在prod.config.js文件 和dev.config.js 写好各自的配置

```js
const {merge} = require('webpack-merge');
const baseConfig = require('./base.config');
// 合并导出
module.exports = merge(baseConfig, {
    //各自配置
});
```

最后在package.json配置文件中，修改 原来运行webpack 和 运行webpack服务器的 键位 改为 ：

```json
"build": "webpack --config ./config/prod.config.js",
"dev": "webpack-dev-server --config ./config/dev.config.js"
```

`--config` 缩写为 `-c`

这里如果打包后文件出现不是在原来的目录，可以检查一下base.config.js文件的 `output`出口，进行修改



#### 代码分离方式（代码分块）

方式一：在entry配置多入口

注意：在导入多个入口文件之后，输出文件的filename则不能固定死，毕竟是生成了多个打包文件

```js
module.exports = {
  entry: {
    index: "./src/index.js",
    another: "./src/another-bundle.js",
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js",,        //让输出的文件根据自己本身entry的key命名
  },
}
```

打包之后我们可以看到有 `index.bundle.js`、`another-bundle.bundle.js`两个打包文件出来

缺点：通用的包如果使用了之后，都会分别打到chunk里面，造成代码重复+大量(重复打包问题)



方式二：防止重复

仍需要在entry进行配置，但是相对于第一种可以把公共代码抽离成chunk

```js
module.exports = {
  entry: {
    index: {
      import: "./src/index.js",
      dependOn: "shared",
    },
    another: {
      import: "./src/another-bundle.js",
      dependOn: "shared",
    },
    shared: "lodash", //当两个模块中有lodash时，就会自动抽离出来，并且取名shared这个chunk
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  optimization: {
    runtimeChunk: 'single',
  },
}
```

此时会多打包一个 `shared.bundle.js`文件放置公共代码

其他关于 `optimization: {runtimeChunk: 'single'}`的好处 可以在 **dev-server模式** 、**runtimeChunk优化**中查看



其实还有一个webpack的**内置**插件，也是类似的防止重复功能

`split-chunks-Plugin`

这个插件也可以将我们模块依赖的公共代码抽离成单独的chunks（自动抽离公共代码，good！）

```js
module.exports = {
    entry: {
        index: "./src/index.js",
        another: "./src/another-bundle.js",
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].bundle.js",        //让输出的文件根据自己本身entry的key命名
    },
    optimization: {
        splitChunks: {
            chunks: "all",
        },
    },
}
```

此方法对于有动态导入需求，也同样适用防止重复地进行代码抽离，然后打包（动态导入即下方的懒加载导入）



#### 懒加载

```js
export const add = (x, y) => {
  return x + y;
};
export const minus = (x, y) => {
  return x - y;
};
```

```js
const button = document.createElement("button");
button.textContent = "点击执行加法运算";
button.addEventListener("click", () => {
  import("./async-math").then(({ add }) => {
    console.log(add(4, 5));
  });
});
document.body.appendChild(button)
```



以上是在技术概念上“懒加载”它。问题是加载这个包并不需要用户的交互 - 意思是每次加载页面的时候都会请求它。这样做并没有对我们有很多帮助，还会对性能产生负面影响。

我们试试不同的做法。我们增加一个交互，当用户点击按钮的时候用 console 打印一些文字。但是会等到第一次交互的时候再加载那个代码块（`print.js`）

**project**

```diff
webpack-demo
|- package.json
|- package-lock.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
+ |- print.js
|- /node_modules
```

**src/print.js**

```js
console.log(
  'The print.js module has loaded! See the network tab in dev tools...'
);

export default () => {
  console.log('Button Clicked: Here\'s "some text"!');
};
```

**src/index.js**

```diff
+ import _ from 'lodash';
+
- async function getComponent() {
+ function component() {
    const element = document.createElement('div');
-   const _ = await import(/* webpackChunkName: "lodash" */ 'lodash');
+   const button = document.createElement('button');
+   const br = document.createElement('br');

+   button.innerHTML = 'Click me and look at the console!';
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   element.appendChild(br);
+   element.appendChild(button);
+
+   // Note that because a network request is involved, some indication
+   // of loading would need to be shown in a production-level site/app.
+   button.onclick = e => import(/* webpackChunkName: "print" */ './print').then(module => {
+     const print = module.default;
+
+     print();
+   });

    return element;
  }

- getComponent().then(component => {
-   document.body.appendChild(component);
- });
+ document.body.appendChild(component());
```

###### Warning

注意当调用 ES6 模块的 `import()` 方法（引入模块）时，必须指向模块的 `.default` 值，因为它才是 promise 被处理后返回的实际的 `module` 对象。



异步加载的原理：

`import(chunkId) => __webpack_require__.e(chunkId)` 将相关的请求回调存入 `installedChunks`。

```js
// import(chunkId) => __webpack_require__.e(chunkId)
__webpack_require__.e = function(chunkId) {
  return new Promise((resolve, reject) => {
    var script = document.createElement('script');
    script.src = jsonpScriptSrc(chunkId);
    var onScriptComplete = function(event) {
      // ...
    };
    var timeout = setTimeout(function() {
      onScriptComplete({ type: 'timeout', target: script });
    }, 120000);
    script.onerror = script.onload = onScriptComplete;
    document.head.appendChild(script);
  });
};
```



#### 预获取

使用预获取导入js文件时，会在html地head上多一个新的link，叫做rel prefetch

他对比懒加载的意义在于

懒加载是：用到 -> 加载 
预获取是：网络空闲 - > 加载

在webpack中使用：（使用上方的一个button例子进行示范, `webpackChunkName`用于自定义webpack动态导入的包名）

```js
const button = document.createElement("button");
button.textContent = "点击执行加法运算";
button.addEventListener("click", () => {
  import(/*webpackChunkName: 'math', webpackPrefetch: true*/ "./async-math").then(({ add }) => {
    console.log(add(4, 5));
  });
});
document.body.appendChild(button)
```



#### 外部扩展(Externals)

`externals` 配置选项提供了「从输出的 bundle 中排除依赖」的方法

**防止**将某些 `import` 的包(package)**打包**到 bundle 中，而是在运行时(runtime)再去从外部获取这些*扩展依赖(external dependencies)*。

例如，从 CDN 引入 [jQuery](https://jquery.com/)，而不是把它打包：

**index.html**（打包的模板html要进行配置）

```html
<script
  src="https://code.jquery.com/jquery-3.1.0.js"
  integrity="sha256-slogkvB1K3VOkzAI8QITxV3VzpOnkeNVsKvtkYLMjfk="
  crossorigin="anonymous"
></script>
```

**webpack.config.js**

```javascript
module.exports = {
  //...
  //key的名字要和包名一致
  externals: {
    jquery: 'jQuery',
  },
};
```

这样就剥离了那些不需要改动的依赖模块，换句话，下面展示的代码还可以正常运行：

```javascript
import $ from 'jquery';

$('.my-element').animate(/* ... */);
```



亦或者这样配置

```js
module.exports = {
  //...
  externalsType: 'script',
  externals: {
    jquery: [
      'https://code.jquery.com/jquery-3.1.0.js',
      'jQuery'
    ],
  },
};
```



#### 缓存产生的问题

##### 问题所在

如果我们在部署新版本时不更改资源的文件名，浏览器可能会认为它没有被更新，就会使用它的缓存版本。由于缓存的存在，当你需要获取新的代码时，就会显得很棘手。

我们可以通过替换 `output.filename` 中的 [substitutions](https://webpack.docschina.org/configuration/output/#outputfilename) 设置，来定义输出文件的名称。webpack 提供了一种使用称为 **substitution(可替换模板字符串)** 的方式，通过带括号字符串来模板化文件名。其中，`[contenthash]` substitution 将根据资源内容创建出唯一 hash。当资源内容发生变化时，`[contenthash]` 也会发生变化。

```js
//webpack.config.js  
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Caching',
    }),
  ],
  output: {
 -- filename: 'bundle.js',
 ++ filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};
```

使用此配置，然后运行我们的 build script `npm run build`，产生以下输出：

```bash
...
                       Asset       Size  Chunks                    Chunk Names
main.7e2c49a622975ebd9b7e.js     544 kB       0  [emitted]  [big]  main
                  index.html  197 bytes          [emitted]
...
```

可以看到，bundle 的名称是它内容（通过 hash）的映射。如果我们不做修改，然后再次运行构建，我们以为文件名会保持不变。

**然而**!!!!!!!，如果我们真的运行，可能会发现情况并非如此：

```bash
...
                       Asset       Size  Chunks                    Chunk Names
main.205199ab45963f6a62ec.js     544 kB       0  [emitted]  [big]  main
                  index.html  197 bytes          [emitted]
...
```

这也是因为 webpack 在入口 chunk 中，包含了某些 boilerplate(引导模板)，特别是 runtime 和 manifest。



##### runtimeChunk优化

正如我们在 [代码分离](https://webpack.docschina.org/guides/code-splitting) 中所学到的，[`SplitChunksPlugin`](https://webpack.docschina.org/plugins/split-chunks-plugin/) 可以用于将模块分离到单独的 bundle 中。webpack 还提供了一个优化功能，可使用 [`optimization.runtimeChunk`](https://webpack.docschina.org/configuration/optimization/#optimizationruntimechunk) 选项

将 runtime 代码拆分为一个单独的 chunk。将其设置为 `single` 来为所有 chunk 创建一个 runtime bundle：

**webpack.config.js**

```diff
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: './src/index.js',
    plugins: [
      new HtmlWebpackPlugin({
      title: 'Caching',
      }),
    ],
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
+   optimization: {
+     runtimeChunk: 'single',
+   },
  };
```

再次构建，然后查看提取出来的 `runtime` bundle：

```bash
Hash: 82c9c385607b2150fab2
Version: webpack 4.12.0
Time: 3027ms
                          Asset       Size  Chunks             Chunk Names
runtime.cc17ae2a94ec771e9221.js   1.42 KiB       0  [emitted]  runtime
   main.e81de2cf758ada72f306.js   69.5 KiB       1  [emitted]  main
                     index.html  275 bytes          [emitted]
[1] (webpack)/buildin/module.js 497 bytes {1} [built]
[2] (webpack)/buildin/global.js 489 bytes {1} [built]
[3] ./src/index.js 309 bytes {1} [built]
    + 1 hidden module
```

将第三方库(library)（例如 `lodash` 或 `react`）提取到单独的 `vendor` chunk 文件中，是比较推荐的做法，这是因为，它们很少像本地的源代码那样频繁修改。因此通过实现以上步骤，利用 client 的长效缓存机制，命中缓存来消除请求，并减少向 server 获取资源，同时还能保证 client 代码和 server 代码版本一致。 这可以通过使用 [SplitChunksPlugin 示例 2](https://webpack.docschina.org/plugins/split-chunks-plugin/#split-chunks-example-2) 中演示的 [`SplitChunksPlugin`](https://webpack.docschina.org/plugins/split-chunks-plugin/) 插件的 [`cacheGroups`](https://webpack.docschina.org/plugins/split-chunks-plugin/#splitchunkscachegroups) 选项来实现。我们在 `optimization.splitChunks` 添加如下 `cacheGroups` 参数并构建：

**webpack.config.js**

```diff
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: './src/index.js',
    plugins: [
      new HtmlWebpackPlugin({
      title: 'Caching',
      }),
    ],
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    optimization: {
      runtimeChunk: 'single',
+     splitChunks: {
+       cacheGroups: {
+         vendor: {
+           test: /[\\/]node_modules[\\/]/,
+           name: 'vendors',
+           chunks: 'all',
+         },
+       },
+     },
    },
  };
```

再次构建，然后查看新的 `vendor` bundle：

```bash
...
                          Asset       Size  Chunks             Chunk Names
runtime.cc17ae2a94ec771e9221.js   1.42 KiB       0  [emitted]  runtime
vendors.a42c3ca0d742766d7a28.js   69.4 KiB       1  [emitted]  vendors
   main.abf44fedb7d11d4312d7.js  240 bytes       2  [emitted]  main
                     index.html  353 bytes          [emitted]
...
```

现在，我们可以看到 `main` 不再含有来自 `node_modules` 目录的 `vendor` 代码，并且体积减少到 `240 bytes`！



##### 模块标识符(module identifier)

在项目中再添加一个模块 `print.js`：

**project**

```diff
webpack-demo
|- package.json
|- package-lock.json
|- webpack.config.js
|- /dist
|- /src
  |- index.js
+ |- print.js
|- /node_modules
```

**print.js**

```diff
+ export default function print(text) {
+   console.log(text);
+ };
```

**src/index.js**

```diff
  import _ from 'lodash';
+ import Print from './print';

  function component() {
    const element = document.createElement('div');

    // lodash 是由当前 script 脚本 import 进来的
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
+   element.onclick = Print.bind(null, 'Hello webpack!');

    return element;
  }

  document.body.appendChild(component());
```

再次运行构建，然后我们期望的是，只有 `main` bundle 的 hash 发生变化，然而……

```bash
...
                           Asset       Size  Chunks                    Chunk Names
  runtime.1400d5af64fc1b7b3a45.js    5.85 kB      0  [emitted]         runtime
  vendor.a7561fb0e9a071baadb9.js     541 kB       1  [emitted]  [big]  vendor
    main.b746e3eb72875af2caa9.js    1.22 kB       2  [emitted]         main
                      index.html  352 bytes          [emitted]
...
```

……我们可以看到这三个文件的 hash 都变化了。这是因为每个 [`module.id`](https://webpack.docschina.org/api/module-variables/#moduleid-commonjs) 会默认地基于解析顺序(resolve order)进行增量。也就是说，当解析顺序发生变化，ID 也会随之改变。简要概括：

- `main` bundle 会随着自身的新增内容的修改，而发生变化。
- `vendor` bundle 会随着自身的 `module.id` 的变化，而发生变化。
- `manifest` runtime 会因为现在包含一个新模块的引用，而发生变化。

第一个和最后一个都是符合预期的行为，`vendor` hash 发生变化是我们要修复的。我们将 [`optimization.moduleIds`](https://webpack.docschina.org/configuration/optimization/#optimizationmoduleids) 设置为 `'deterministic'`：

**webpack.config.js**

```js
  const path = require('path');
  const HtmlWebpackPlugin = require('html-webpack-plugin');

  module.exports = {
    entry: './src/index.js',
    plugins: [
      new HtmlWebpackPlugin({
        title: 'Caching',
      }),
    ],
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    optimization: {
+     moduleIds: 'deterministic',
      runtimeChunk: 'single',
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  };
```

现在，不论是否添加任何新的本地依赖，对于前后两次构建，`vendor` hash 都应该保持一致：

```bash
...
                          Asset       Size  Chunks             Chunk Names
   main.216e852f60c8829c2289.js  340 bytes       0  [emitted]  main
vendors.55e79e5927a639d21a1b.js   69.5 KiB       1  [emitted]  vendors
runtime.725a1a51ede5ae0cfde0.js   1.42 KiB       2  [emitted]  runtime
                     index.html  353 bytes          [emitted]
Entrypoint main = runtime.725a1a51ede5ae0cfde0.js vendors.55e79e5927a639d21a1b.js main.216e852f60c8829c2289.js
...
```

然后，修改 `src/index.js`，临时移除额外的依赖：

**src/index.js**

```diff
  import _ from 'lodash';
- import Print from './print';
+ // import Print from './print';

  function component() {
    const element = document.createElement('div');

    // lodash 是由当前 script 脚本 import 进来的
    element.innerHTML = _.join(['Hello', 'webpack'], ' ');
-   element.onclick = Print.bind(null, 'Hello webpack!');
+   // element.onclick = Print.bind(null, 'Hello webpack!');

    return element;
  }

  document.body.appendChild(component());
```

最后，再次运行我们的构建：

```bash
...
                          Asset       Size  Chunks             Chunk Names
   main.ad717f2466ce655fff5c.js  274 bytes       0  [emitted]  main
vendors.55e79e5927a639d21a1b.js   69.5 KiB       1  [emitted]  vendors
runtime.725a1a51ede5ae0cfde0.js   1.42 KiB       2  [emitted]  runtime
                     index.html  353 bytes          [emitted]
Entrypoint main = runtime.725a1a51ede5ae0cfde0.js vendors.55e79e5927a639d21a1b.js main.ad717f2466ce655fff5c.js
...
```

我们可以看到，这两次构建中，`vendor` bundle 文件名称，都是 `55e79e5927a639d21a1b`。



#### 提高解析速度

解析

以下步骤可以提高解析速度：

- 减少 `resolve.modules`, `resolve.extensions`, `resolve.mainFiles`, `resolve.descriptionFiles` 中条目数量，因为他们会增加文件系统调用的次数。
- 如果你不使用 symlinks（例如 `npm link` 或者 `yarn link`），可以设置 `resolve.symlinks: false`。
- 如果你使用自定义 resolve plugin 规则，并且没有指定 context 上下文，可以设置 `resolve.cacheWithContext: false`。
