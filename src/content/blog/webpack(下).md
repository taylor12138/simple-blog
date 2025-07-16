---
title: webapck(下)
author: Hello
pubDate: 2021-2-7 
categories: 前端
description: wepack解析
---



## 5.关于webpack

#### Webpack缩小体积原理

将多个模块依赖，转变成单个静态资源（js、css、jpg、png）

![](/simple-blog/webpack/webpack2.jpg)

打包，是指处理某些文件并将其输出为其他文件的能力。

- entry: 编译入口
- module: 模块，在 webpack 中，一切皆为模块，一个模块对应一个文件
- Chunk: 代码块，一个 chunk 由多个模块组合而成，用于代码的合并与分割
- Loader: 模块转换器，将非js模块转化为webpack能识别的js模块
- Plugin: 扩展插件，在webpack运行的各个阶段，都会广播出去相对应的事件，插件可以监听到这些事件的发生，在特定的时机做相对应的事情

项目中使用的每个文件都是一个模块，在打包过程中，模块（module）会被合并成 chunk，chunk 合并成 chunk 组，并形成一个通过模块互相连接的图(`ModuleGraph`)。 那么如何通过以上来描述一个入口起点：在其内部，会创建一个只有一个 chunk 的 chunk 组。

所以chunk有两种形式

- `initial(初始化)` 是入口起点的 main chunk。此 chunk 包含为入口起点指定的所有模块及其依赖项。
- `non-initial` 是可以延迟加载的块。可能会出现在使用 [动态导入(dynamic imports)](https://webpack.docschina.org/guides/code-splitting/#dynamic-imports) 或者 [SplitChunksPlugin](https://webpack.docschina.org/plugins/split-chunks-plugin/) 时。

然后loader是文件转换器（将webpack不能处理的模块转换成能处理的模块，也就是js模块）、plugin是功能拓展

我们也可以安装一个插件帮我们查看依赖图

```shell
npm i webpack-bundle-analyzer -D
```

```js
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
module.exports = (env) => {
  return {
    plugins: [
      new BundleAnalyzerPlugin(),
    ],
};
```

```shell
npx webpack serve
```

然后你就可以看到

![](/simple-blog/webpack/graph.jpg)



#### Webpack构建流程

1. 初始化参数：通过 `yargs` 解析 `config` 与 `shell` 中的配置项，从配置文件和 Shell 语句中读取与合并参数，得出最终的参数；

   

2. 开始编译：用上一步得到的参数（options）初始化 Compiler 对象（实例化），加载所有配置的插件

   `compiler` 可以理解为 `webpack` 编译的调度中心，它记录了完整的 `webpack` 环境信息

   初始化时定义了很多钩子

   ```js
   class Compiler extends Tapable {
       constructor(context) {
           super();
           this.hooks = {
               beforeCompile: new AsyncSeriesHook(["params"]),
               compile: new SyncHook(["params"]),
               afterCompile: new AsyncSeriesHook(["compilation"]),
               make: new AsyncParallelHook(["compilation"]),
               entryOption: new SyncBailHook(["context", "entry"])
               // 定义了很多不同类型的钩子
           };
           // ...
       }
   }
   ```

   

3. 调用`compiler.run(callback);`，开始构建，进入compile函数

   ```js
   run(callback) {
       const onCompiled = (err, compilation) => {
       	this.hooks.done.callAsync(stats, err => {
       		return finalCallback(null, stats);
       	});
       };
       
       // 执行订阅了compiler.beforeRun钩子插件的回调
       this.hooks.beforeRun.callAsync(this, err => {
           // 执行订阅了compiler.run钩子插件的回调
       	this.hooks.run.callAsync(this, err => {
       		this.compile(onCompiled);
       	});
       });
   }
   ```

   `compiler.compile`函数

   ```js
   compile(callback) {
       // 实例化核心工厂对象
       const params = this.newCompilationParams();
       // 执行订阅了compiler.beforeCompile钩子插件的回调
       this.hooks.beforeCompile.callAsync(params, err => {
           // 执行订阅了compiler.compile钩子插件的回调
           this.hooks.compile.call(params);
           // 创建此次编译的Compilation对象
           const compilation = this.newCompilation(params);
           
           // 执行订阅了compiler.make钩子插件的回调
           this.hooks.make.callAsync(compilation, err => {
               
               compilation.finish(err => {
                   compilation.seal(err => {
                       this.hooks.afterCompile.callAsync(compilation, err => {
                   		return callback(null, compilation);
                   	});
                   })
               })
           })
       })
   }
   ```

   然后在创建Compilation对象实例，`Compilation` 对象是后续构建流程中最核心最重要的对象，它包含了一次构建过程中所有的数据。也就是说一次构建过程对应一个 `Compilation` 实例。在创建 `Compilation` 实例时会触发钩子 `compilaiion` 和 `thisCompilation`。

   在Compilation对象中：

   - modules 记录了所有解析后的模块
   - chunks 记录了所有chunk
   - assets记录了所有要生成的文件

   

4. 确定入口：根据配置中的 entry 找出所有的入口文件；

   

5. 编译模块：开始 `modules` 的生成阶段，进入**`make` 钩子，执行真正的编译构建过程**，从入口文件开始，构建模块，直到所有模块创建结束从入口文件出发

   - `modules`：一个依赖对象（Dependency）经过对应的工厂对象（Factory）创建之后，就能够生成对应的模块实例（Module）。

   调用所有配置的 Loader 对模块进行翻译（在`doBuild` 调用了相应的 `loaders`，转换了部分的原本不可识别的语言）

   调用`Parser.parse`方法，将JS解析为AST。解析成AST最大作用就是收集模块依赖关系

   再找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经过了本步骤的处理（对每个模块所依赖的对象进行收集。）

   

6. 完成模块编译：在经过第4步使用 Loader 翻译完所有模块后，得到了每个模块被翻译后的最终内容以及它们之间的依赖关系；

   

7. 输出资源：触发`compilation.seal`方法，进入下一个阶段。（chunk生成阶段）

   根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表，这步是可以修改输出内容的最后机会

   `chunk`内部的主要属性是`_modules`，用来记录包含的所有模块对象。所以要生成一个`chunk`，就先要找到它包含的所有`modules`。下面简述一下chunk的生成过程：

   - 先把 `entry` 中对应的每个 `module` 都生成一个新的 `chunk`
   - 遍历`module.dependencies`，将其依赖的模块也加入到上一步生成的chunk中
   - 若某个module是动态引入的，为其创建一个新的chunk，接着遍历依赖

   

8. 调用`createChunkAssets`，遍历chunk，来渲染每一个chunk生成代码

   每个chunk的源码生成之后，会调用 `emitAsset` 将其存在 `compilation.assets` 中。当所有的 chunk 都渲染完成之后，assets 就是最终更要生成的文件列表。至此，`compilation` 的 `seal` 方法结束，也代表着 `compilation` 实例的所有工作到此也全部结束，意味着一次构建过程已经结束，接下来只有文件生成的步骤了。

   在 `Compiler` 开始生成文件前，钩子 `emit` 会被执行，这是我们修改最终文件的最后一个机会，生成的在此之后，我们的文件就不能改动了。

   webpack 会直接遍历 compilation.assets 生成所有文件，然后触发钩子done，结束构建流程。

流程参考：https://juejin.cn/post/6844904000169607175



#### webpack管理模块之manifest

一旦你的应用在浏览器中以 `index.html` 文件的形式被打开，一些 bundle 和应用需要的各种资源都需要用某种方式被加载与链接起来。在经过打包、压缩、为延迟加载而拆分为细小的 chunk 这些 webpack [`优化`](https://webpack.docschina.org/configuration/optimization/) 之后，你精心安排的 `/src` 目录的文件结构都已经不再存在。所以 webpack 如何管理所有所需模块之间的交互呢？这就是 manifest 数据用途的由来

当 compiler 开始执行、解析和映射应用程序时，它会保留所有模块的详细要点。这个数据集合称为 "manifest"，当完成打包并发送到浏览器时，runtime 会通过 manifest 来解析和加载模块。无论你选择哪种 [模块语法](https://webpack.docschina.org/api/module-methods)，那些 `import` 或 `require` 语句现在都已经转换为 `__webpack_require__` 方法，此方法指向模块标识符(module identifier)。通过使用 manifest 中的数据，runtime 将能够检索这些标识符，找出每个标识符背后对应的模块。

##### 问题

所以，现在你应该对 webpack 在幕后工作有一点了解。“但是，这对我有什么影响呢？”，你可能会问。答案是大多数情况下没有。runtime 做完成这些工作：一旦你的应用程序加载到浏览器中，使用 manifest，然后所有内容将展现出魔幻般运行结果。然而，如果你决定通过使用浏览器缓存来改善项目的性能，理解这一过程将突然变得极为重要。

通过使用内容散列(content hash)作为 bundle 文件的名称，这样在文件内容修改时，会计算出新的 hash，浏览器会使用新的名称加载文件，从而使缓存无效。一旦你开始这样做，你会立即注意到一些有趣的行为。即使某些内容明显没有修改，某些 hash 还是会改变。这是因为，注入的 runtime 和 manifest 在每次构建后都会发生变化。

查看 *管理输出* 指南的 [manifest 部分](https://webpack.docschina.org/guides/output-management/#the-manifest)，了解如何提取 manifest，并阅读下面的指南，以了解更多长效缓存错综复杂之处。

Further Reading

- [分离 manifest](https://survivejs.com/webpack/optimizing/separating-manifest/)
- [使用 webpack 提供可预测的长效缓存](https://medium.com/webpack/predictable-long-term-caching-with-webpack-d3eee1d3fa31)
- [缓存](https://webpack.docschina.org/guides/caching/)



#### Webpack对前端性能的优化

- 压缩代码，比如丑化JS代码，使得文件体积更小（`UglifyJsPlugin`、 `ParallelUglifyPlugin`）
- 利用CDN加速，修改资源路径
- 删除死代码
- 提取公共代码



#### Tree-shaking

在webpack中开启tree-shaking，只要是“我”认为没有使用的代码，我就删掉

```js
module.exports = (env) => {
  return {
    //...
    optimization: {
      //在生产环境下开启，会开启tree-shaking
      usedExports: true,
    },
  };
};
```

webpack4默认没有直接进行tree-shaking，怕部分有副作用的文件会被忽略（比如全局样式引入），可以通古配置`sideEffects`进行更改，但是webpack5默认会进行 tree-shaking（智能tree-shaking，在不确定的情况下将导入的模块列为有副作用的）

> "side effect(副作用)" 的定义是，在导入时会执行特殊行为的代码，而不是仅仅暴露一个 export 或多个 export。举例说明，例如 polyfill，它影响全局作用域，并且通常不提供 export。

以下是个人根据情况修改副作用文件

```json
//package.json
{
	"sideEffects": false, //都没有副作用，可以删除任何你觉得不满的代码
}
```

```json
//package.json
{
	"sideEffects": ["*.css"], //css文件的不能乱删，有副作用
}
```



##### 不同环境下使用

1. 开发环境下的配置

```jsx
// webpack.config.js
module.exports = {
  // ...
  mode: 'development',
  optimization: {
    usedExports: true,
  }
};
复制代码
```

2. 生产环境下的配置

```jsx
// webpack.config.js
module.exports = {
  // ...
  mode: 'production',
};
复制代码
```

在生产环境下，Webpack 默认会添加 Tree Shaking 的配置，因此只需写一行 **mode: 'production'** 即可。



##### 小总结

通过sideEffects修改tree-shaking的方式

- 使用 ES2015 模块语法（即 `import` 和 `export`）。
- 确保没有编译器将您的 ES2015 模块语法转换为 CommonJS 的（顺带一提，这是现在常用的 @babel/preset-env 的默认行为，详细信息请参阅[文档](https://babeljs.io/docs/en/babel-preset-env#modules)）。
- 在项目的 `package.json` 文件中，添加 `"sideEffects"` 属性。
- 使用 `mode` 为 `"production"` 的配置项以启用[更多优化项](https://webpack.docschina.org/concepts/mode/#usage)，包括压缩代码与 tree shaking。



## 6.webpack热更新原理

#### webpack模块热更新

也就是HMR，Hot Module Replacement，它是指应用程序运行过程中，替换、添加、删除模块，而**无需刷新整个页面**

这里要注意的是热更新的时候，并没有自动刷新浏览器

- 不需要重新加载整个页面，可以保证某些应用程序的状态不丢失。
- 只更新需要变化的内容，节省开发时间
- 修改了css、js的源代码，便会立即在浏览器更新，相当于在浏览器开发者模式devtools中直接更改样式

使用：默认情况下 `webpack-dev-server`（也就是上方安装的搭建服务）已经支持了HMR，我们只需要开启即可。不开启则为live reloading，整个页面进行刷新

```js
module.exports = {
  //...
  target: "web",  //给web打包，或者值为node，则为node打包
  devServer: {
    hot: true
  }
};
```

但是需要告诉webpack，哪些模块用到热更新，在webpack中需要配合`module.hot`进行使用.

但是像Vue、React等框架，他们有vue-loader、react-refresh等，可以做到开箱即用

还有一个热加载，也就是文件更新时，自动刷新我们的服务和页面

```js
module.exports = {
  //...
  devServer: {
    liveReload: true //默认为true
  }
};
```



HMR实际上是使用了一个插件：HotModuleReplacementPlugin,但是我们webpack5已经开箱即用了

HMR原理是webpack-dev-server会创建两个服务，提供静态资源服务的express、和Socket服务（net.Socket）

HMR Socket Server是一个socket长连接：

- 使用`express`启动本地服务，当浏览器访问资源时对此做响应。
- 服务端和客户端使用`websocket`实现长连接
- `webpack`监听源文件的变化，即当开发者保存文件时触发`webpack`的重新编译。
  - 每次编译都会生成`hash值`、`已改动模块的json文件`、`已改动模块代码的js文件`
  - 编译完成后通过`socket`向客户端推送当前编译的`hash戳`
- 客户端的`websocket`监听到有文件改动推送过来的`hash戳`，会和上一次对比
  - 一致则走缓存
  - 不一致则通过`ajax`和`jsonp`向服务端获取最新资源
- 使用`内存文件系统`去替换有修改的内容实现局部刷新

也可以理解为本地服务器和浏览器端形成一个完成的通信双方，进行socket通信

#### 实现热更新

![](/simple-blog/webpack/hotloading.jpg)

图片来自饿了么前端@知乎专栏

- 上图底部红色框内是服务端，而上面的橙色框是浏览器端。
- 绿色的方框是 webpack 代码控制的区域。蓝色方框是 webpack-dev-server 代码控制的区域，洋红色的方框是文件系统，文件修改后的变化就发生在这，而青色的方框是应用本身。



第一步，在 webpack 的 watch 模式下，文件系统中某一个文件发生修改，webpack 监听到文件变化，根据配置文件对模块重新编译打包，并将打包后的代码通过简单的 JavaScript 对象保存在**内存**中，并且生成了一个 **Hash**值。

第二步，webpack-dev-server 和 webpack 之间的接口交互，而在这一步，主要是 dev-server 的中间件 webpack-dev-middleware 和 webpack 之间的交互，webpack-dev-middleware 调用 webpack 暴露的 API （ `compiler.watch()` ）对代码变化进行监控，并且告诉 webpack，将代码打包到内存中（使用 webpack-dev-middleware 一个依赖库 memory-fs ）。

第三步是 webpack-dev-server 对文件变化的一个监控，这一步不同于第一步，并不是监控代码变化重新打包。当我们在配置文件中配置了devServer.watchContentBase 为 true 的时候，Server 会监听这些配置文件夹中静态文件的变化，变化后会通知浏览器端对应用进行 live reload。注意，这儿是浏览器刷新，和 HMR 是两个概念。

第四步也是 webpack-dev-server 代码的工作，该步骤主要是通过 sockjs（webpack-dev-server 的依赖）在浏览器端和服务端之间建立一个 websocket 长连接，将 webpack 编译打包的各个阶段的状态信息告知浏览器端，同时也包括第三步中 Server 监听静态文件变化的信息。浏览器端根据这些 socket 消息进行不同的操作。当然服务端传递的最主要信息还是新模块的 **Hash** 值，后面的步骤根据这一  **Hash** 值来进行模块热替换。其中关于websocket的消息接收，是因为webpack-dev-server 修改了webpack 配置中的 entry 属性，在里面添加了 webpack-dev-client 的代码，这样在最后的 bundle.js 文件中就会有接收 websocket 消息的代码了。

第五、六步，webpack-dev-server/client 端并不能够请求更新的代码，也不会执行热更模块操作，而把这些工作又交回给了 webpack，webpack/hot/dev-server 的工作就是根据 webpack-dev-server/client 传给它的信息以及 dev-server 的配置决定是刷新浏览器呢还是进行模块热更新。当然如果仅仅是刷新浏览器，也就没有后面那些步骤了。

第七、八、九步，HotModuleReplacement.runtime 是客户端 HMR 的中枢，它接收到上一步传递给他的新模块的 **Hash** 值，它通过 JsonpMainTemplate.runtime 向 server 端发送 Ajax 请求，服务端返回一个 json，该 json 包含了所有要更新的模块的 hash 值，以查看是否需要更新，获取到更新列表后，该模块再次通过 **jsonp 请求**，获取到最新的模块代码（主要是因为`JSONP`获取的代码可以直接执行）。

而第 十 步是决定 HMR 成功与否的关键步骤，在该步骤中，HotModulePlugin 将会对新旧模块进行对比，决定是否更新模块，在决定更新模块后，检查模块之间的依赖关系，更新模块的同时更新模块间的依赖引用。

最后一步，当 HMR 失败后，回退到 livereload 操作，也就是进行浏览器刷新来获取最新打包代码。

https://zhuanlan.zhihu.com/p/30669007



## 7.webpack打包库

如果想要编写自己的库，供其他人使用，需要在webpack中配置

```js
//webpack.config.js
const path = require("path");
module.exports = {
  mode: "production",
  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.js", //打包后的文件名
    library: "littleLib",
  },
};
```

当然，作为库的作者，希望自己的库能通过commonjs、script标签、amd、esmodule等形式进行引用

```js
const path = require("path");
module.exports = {
    //...
    experiments: {
        outputModule: true, //如果以es module的形式导出，则需要配置experiments.outputModule项,因为还是实验性的
    },
    output: {
        //...
        library: {
            type: "module",    //以es module形式导出，不能设置名字
        },
    },
};
```

```js
module.exports = {
//...
  output: {
    //...
    library: {
      name: "littleLib",
      type: "umd",    //支持运行在 CommonJS、AMD、Node.js 等环境中。
    },
  },
};
```



## 中间插播小笑话

![](/simple-blog/webpack/webpack.jpg)

部分资料参考地址https://juejin.cn/post/6844903877771264013



## 8.webpack5模块联邦

共享模块的方式：

1. NPM 方式共享模块

对于项目 Home 与 Search，需要共享一个模块时，最常见的办法就是将其抽成通用依赖并分别安装在各自项目中。缺点是要走本地编译（需要更新npm包， `npm install`，再构建 + 发布，而且产物体积可能会偏大）

虽然 Monorepo 可以一定程度解决重复安装和修改困难的问题（依赖复用），但依然需要走本地编译，并且还要求**所有的应用代码必须放到同一个仓库**。

![](/simple-blog/webpack/fed2.png)

2. umd共享模块

将模块用 Webpack UMD 模式打包，并输出到其他项目中。这是非常普遍的模块共享方式

![](/simple-blog/webpack/fed3.png)

像这种

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/src/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="root"></div>
    <!-- 从 CDN 上引入第三方依赖的代码 -->
    <script src="https://cdn.jsdelivr.net/npm/react@17.0.2/index.min.js"><script>
    <script src="https://cdn.jsdelivr.net/npm/react-dom@17.0.2/index.min.js"><script>
  </body>
</html>
```

但这种技术方案问题也很明显，就是包体积无法达到本地编译时的优化效果(全量引用)，且库之间容易冲突（库引入顺序）。



3. 微前端共享模块

但是微前端会出现以下问题

1）子应用独立打包，模块更解耦，但无法抽取公共依赖等。

2）整体应用一起打包，很好解决上面的问题，但打包速度实在是太慢了，不具备水平扩展能力。

![](/simple-blog/webpack/fed4.png)



4. webpack5的模块联邦，是直接将原来的应用依赖的包（模块），直接引用于另外一个项目/应用，在模块联邦中，更注重项目与项目之间的引用（A用了B的xx模块，B用了C的xx模块），相对来说是mf 是去中心化的(其实也挺像npm包的感觉)，当然这种引用关系也可以运用到微前端这种突出主和子应用的关系中去

![](/simple-blog/webpack/federation.png)

#### 底层概念

我们区分本地模块和远程模块。本地模块即为普通模块，是当前构建的一部分。远程模块不属于当前构建，并在运行时从所谓的容器加载。

加载远程模块被认为是异步操作。当使用远程模块时，这些异步操作将被放置在远程模块和入口之间的下一个 chunk 的加载操作中。如果没有 chunk 加载操作，就不能使用远程模块。

容器是由容器入口创建的，该入口暴露了对特定模块的异步访问。暴露的访问分为两个步骤：

1. 加载模块（异步的）
2. 执行模块（同步的）



**微前端**

让应用具备模块化输出能力，其实开辟了一种新的应用形态，即 “中心应用”，（其实也就是微前端）这个中心应用用于在线动态分发 Runtime 子模块，并不直接提供给用户使用

而在微前端领域，这个主应用就是应用中心，所有子应用都可以利用 Runtime 方式复用主应用的 Npm 包和模块，更好的集成到主应用中。



#### 评论

看到网上的一条评论：

```
这不就是一个包
构建一个全量umd
+单独声明entry的umd
+单独umd的entry/shared集合
嘛。。。
至于shared，和external没什么区别，只是可以构建时生成罢了。
其中shared部分也不能做构建优化，只能全量打包。

意义就是以前一个包一个入口引入所有内容，现在可以按需打包了。
比如antd可以在发布的时候每个组件打一个umd，再加上一个整体的runtime。
于是就形成了
1.umd引入
2.umd引入runtime+单独entry动态引入
但是要想选出来需要用的包组合成一个文件，只能重新打包。
而且使用2引入方式，必须用import()，否则网络延迟会阻塞渲染，相当于是requirejs的机制。
```



```
微前端彼此间的依赖版本估计都是大相径庭的，很难直接去 share libaray 。
Service 的 share 可能更合适一些，比如从前将通用业务抽成 npm 包的方式，可以用这种方式代替了。
相较于整体打包，子项目单独发布叫“水平扩展”，不太合适吧。
```



#### 实践

模块联邦本身是一个普通的 Webpack 插件 `ModuleFederationPlugin`，插件有几个重要参数：

1. `name` 当前应用名称，需要全局唯一。
2. `remotes` 可以将其他项目的 `name` 映射到当前项目中（remote译为远程的）
3. `exposes` 表示导出的模块，类似于export，只有在此申明的模块才可以作为远程依赖被使用，需要注意的key需要加上 `./`。
4. `shared` 是非常重要的参数，制定了这个参数，可以让远程加载的模块对应依赖改为使用本地项目的 React 或 ReactDOM。

模块联邦的使用方式如下：

一共有三个微应用:`lib-app`、`component-app`、`main-app`，角色分别是：

- `lib-app`as remote,暴露了两个模块`react`和`react-dom`（公共react和react-dom）
- `component-app` as remote and host,依赖`lib-app`暴露的 `react`和`react-dom`  ，暴露了一些组件供`main-app`消费
- `main-app` as host,依赖`lib-app`和`component-app`



##### 暴露lib-app模块

```js
//webpack.config.js
module.exports = {
    //...省略
    plugins: [
        new ModuleFederationPlugin({
            name: "lib_app",
            filename: "remoteEntry.js",
            exposes: {
                "./react":"react",
                "./react-dom":"react-dom"
            }
        })
    ],
    //...省略
}
```

编译后的结果：

![](/simple-blog/webpack/fed1.png)

除去生成的map文件，有四个文件：`main.js`、`remoteEntry.js`、`...react_index.js`、`...react-dom_index.js`；

- 第一个是本项目的入口文件（该项目只是暴露接口，所以该文件为空）
- 第二个是远程入口文件，其他webpack构建使用、访问本项目暴露的模块时，须通过它来加载
- 第三个和第四个是暴露的模块，供其他项目消费(使用)



##### component-app的配置

依赖`lib-app`,暴露三个模块组件`Button`、`Dialog`、`Logo`

```js
//webpack.config.js
module.exports = {
    //...省略
    plugins:[
        new ModuleFederationPlugin({
            name: "component_app",
            filename: "remoteEntry.js",
            exposes: {
              "./Button":"./src/Button.jsx",
              "./Dialog":"./src/Dialog.jsx",
              "./Logo":"./src/Logo.jsx"
            },
            remotes:{
                "lib-app":"lib_app@http://localhost:3000/remoteEntry.js"
            }
        }),
    ]
}
```

然后在三个组件内使用引入的remote（`lib-app`）

```js
//Dialog.jsx
import React from 'lib-app/react';
export default class Dialog extends React.Component {
	//...
}
export default class Button extends React.Component {
	//...
}
export default class Logo extends React.Component {
	//...
}
```



##### main-app配置

main-app依赖两个项目`lib-app`、`component-app`。

```js
///webpack.config.js
module.exports = {
    //省略...
    plugins: [
        new ModuleFederationPlugin({
            name: "main_app",
            remotes:{
                "lib-app":"lib_app@http://localhost:3000/remoteEntry.js",
                "component-app":"component_app@http://localhost:3001/remoteEntry.js"
            },
        }),
        new HtmlWebpackPlugin({
          template: "./public/index.html",
        })
    ]
    //省略...
};
```

由于需要等待基础模块加载完毕，所以需要配置懒加载入口bootstrap.js.

- webpack打包入口文件

```js
import("./bootstrap.js")
```

- bootstrap.js

```js
import App from './App.jsx'
import ReactDOM from 'lib-app/react-dom';
import React from 'lib-app/react'
ReactDOM.render(<App />, document.getElementById("app"));
```

- 根组件App.jsx

```js
import React from 'lib-app/react';
import Button from 'component-app/Button'
import Dialog from 'component-app/Dialog'
import Logo from 'component-app/Logo'
export default class App extends React.Component{
	//...
}
```



##### 下载脚本

网上扒过源码，下载脚本本质也是通过jsonp的形式下载

通过` webpack_require.l(url, errorHandler, chunkName) `下载脚本：

```js
/* webpack/runtime/load script */
(() => {
  var inProgress = {};
  var dataWebpackPrefix = 'webpack5-demo:';
  // loadScript function to load a script via script tag
  __webpack_require__.l = (url, done, key) => {
    if (inProgress[url]) {
      inProgress[url].push(done);
      return;
    }
    var script, needAttach;
    if (key !== undefined) {
      var scripts = document.getElementsByTagName('script');
      for (var i = 0; i < scripts.length; i++) {
        var s = scripts[i];
        if (
          s.getAttribute('src') == url ||
          s.getAttribute('data-webpack') == dataWebpackPrefix + key
        ) {
          script = s;
          break;
        }
      }
    }
    if (!script) {
      needAttach = true;
      // 创建 script 标签
      script = document.createElement('script');

      script.charset = 'utf-8';
      script.timeout = 120;
      if (__webpack_require__.nc) {
        script.setAttribute('nonce', __webpack_require__.nc);
      }
      script.setAttribute('data-webpack', dataWebpackPrefix + key);
      // 设置 src = 'http://127.0.0.1:2001/examples_app1_say_js.bundle.js'
      script.src = url;
      // 到这远程脚本 examples_app1_say_js.bundle.js 应该就开始下载了
    }
    inProgress[url] = [done];
    var onScriptComplete = (prev, event) => {
      // avoid mem leaks in IE.
      script.onerror = script.onload = null;
      clearTimeout(timeout);
      var doneFns = inProgress[url];
      delete inProgress[url];
      script.parentNode && script.parentNode.removeChild(script);
      doneFns && doneFns.forEach((fn) => fn(event));
      if (prev) return prev(event);
    };
    var timeout = setTimeout(
      onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }),
      120000
    );
    script.onerror = onScriptComplete.bind(null, script.onerror);
    script.onload = onScriptComplete.bind(null, script.onload);
    needAttach && document.head.appendChild(script);
  };
})();
```

开始感觉有点类似以前通过 cdn 引入第三方js库的感觉



##### 一些其他问题

shared版本问题：

![](/simple-blog/webpack/fed5.png)

正确做法

```js
const { dependencies } = require("./package.json");
...
shared: {
  ...dependencies,
  react: {
    singleton: true,
    requiredVersion: dependencies["react"],
  },
  "react-dom": {
    singleton: true,
    requiredVersion: dependencies["react-dom"],
  },
},
```



参考：

[微前端实践--webpack5模块联邦](https://juejin.cn/post/6963326546606030856)

[精读《Webpack5 新特性 - 模块联邦》](https://zhuanlan.zhihu.com/p/115403616)