---
author: Hello
pubDate: 2023-3-01
categories: 前端
title: Vite
description: '打包工具相关'
pinned: true
---

## Vite概述

Webpack是前端使用最多的构建工具，但是除了webpack还有一些其他的构建工具，比如rollup、parcel、gulp、vite

 *Vite* 是 vue 的作者尤雨溪在开发 vue3.0 的时候开发的一个基于原生 **ES-Module** 的前端构建工具

Vite官方的定位：下一代前端开发和构建工具

他主要由两部分组成

- 一个开发服务器，它基于原生ES模块提供了丰富的内建功能，并且借助 Esbuild 超快的编译速度来做第三方库构建和 TS/JSX 语法编译，这使得HMR速度非常快
- 一套构建指令，它使用rollup打包我们的代码（使用rollup打包功能），并且它是预配置的，输出生成环境优化过的静态资源

所以构建过程中 Vite 中仍然使用 Esbuild 进行编译和压缩，但打包留给 Rollup。所以 esbuild 用于构建过程的一部分。

![](/Vite/engine.png)

图片源自神三元的《深入浅出vite》

Vite初衷就是依赖浏览器本身就识别的依赖关系直接将js解析呈现，而不考虑其他

Vite 所倡导的`no-bundle`理念的真正含义: **利用浏览器原生 ES 模块的支持，实现开发阶段的 Dev Server，进行模块的按需加载**，而不是**先整体打包再进行加载**

优点：

快，构建快、冷启动快、热更新快。快在哪？

开发阶段：

1. 使用esbuild进行了预构建
2. esbuild本身的打包速度快
3. 本身的no-bundle，懒加载
4. 使用[@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc)，在开发阶段，将 Babel 替换为 SWC，冷启动和模块热替换（HMR）将会有显著提升

生产环境：

1. 预构建阶段，编译能力依然用到了esbuild（Transformer），对 TS(X)/JS(X) 进行编译，所以快（但是vite的一些默认React 预设使用 Babel 来转换 React HMR 和 JSX。）
2. 从vite2.6开始，自动启用esbuild对代码压缩（esbuild的压缩速度是要比webpack的terser快的）



但是缺点就是：

- 如果包依赖太多，会发送过多的网络请求（import 语句即代表一个 HTTP 请求）
- 一些兼容性问题，在官网的issue可以看到
- 写自己插件有需要的话，也要同时兼容 `rollup` 和 `esbuild`

Vite将基于原生浏览器的特点，解决以上缺点



还有尤大怼人的相关链接：[尤雨溪：Turbopack 真的比 Vite 快 10 倍吗？](https://juejin.cn/post/7161356191614894088)



#### Esbuild

esbuild 是一个用 Go 语言编写的用于打包，（自带压缩）压缩  Javascript 代码的工具库（类似webpack的构建工具）

优点：编译、构建速度快

为什么这么快？

- 它是用 Go 语言编写的，该语言可以编译为本地代码

- 解析，生成最终打包文件和生成 source maps 的操作全部完全并行化

- 无需昂贵的数据转换，没有使用第三方依赖，只需很少的几步即可完成所有操作

  在 Webpack、Rollup 这类工具中，我们不得不使用很多**额外的第三方插件来解决各种工程需求**，比如：

  - 使用 babel 实现 ES 版本转译
  - 使用 eslint 实现代码检查
  - 使用 TSC 实现 ts 代码转译与代码检查
  - 使用 less、stylus、sass 等 css 预处理工具

  但是Esbuild 完全重写整套编译流程所需要用到的所有工具

- 该库以提高编译速度为编写代码时的第一原则，并尽量避免不必要的内存分配（go的能力）

缺点：

1. babel插件问题

   为了保证 esbuild 的编译效率，esbuild 没有提供 AST 的操作能力。所以一些通过 AST 处理代码的 babel-plugin 没有很好的方法过渡到 esbuild 中（比如 babel-plugin-import）

2. 作为打包工具的话，`代码分割`和 `CSS处理`方面 较差

3. 虽然自带（捆绑）了压缩功能，但是在 esbuild 命令中使用“ [minify](https://esbuild.github.io/api/#minify) ”和“ [bundle](https://esbuild.github.io/api/#bundle) ”选项不会创建与[Rollup](https://rollupjs.org/) / [Terser](https://terser.org/)管道一样小的包。这是因为 esbuild 牺牲了一些包大小优化以尽可能少地通过您的代码。但是，差异可能可以忽略不计，并且对于提高捆绑速度来说是值得的，具体取决于您的项目。

在生产环境下使用 esbuild 是可行的。像 snowpack , vite 等构建工具都已经是用了 esbuild 作为代码处理工具（稳定性已经足够）。如果你一定要使用，可以看看是否符合下面标准

1. 没有使用一些自定义的 babel-plugin (如 babel-plugin-import)
2. 不需要兼容一些低版本浏览器（esbuild 只能将代码转成 es6） 那你就可以大胆使用 esbuild-loader 为你的项目提效了



#### rollup

Rollup 也是前端模块化的一个打包工具，它的开发本意，是打造一款简单易用的 ES 模块打包（和esbuild天然配合）工具，**不必配置，直接使用**

优点：

- ~~不必配置，直接食用，对 tree shaking 有着良好的支持，产物非常干净，支持多种输出格式，适合做库的开发~~

- rollup插件思路很棒，Vite的插件写法就是模仿rollup的，甚至有不少 Rollup 插件可以直接复用到 Vite 。

- 工具库打包后体积更小一点

  ![](/Vite/rollupbundle.png)

  

缺点：

介绍是这么介绍，但是我个人用下来，

- webapck5之后配置项上来看，webpack是比rollup少的，
- 而且webpack5还自带terser各种代码压缩，都不用配置了，但是rollup还需要配置，截止2023.4.14为止，rollup已经更新至3.20版本，部分插件还不兼容rollup3.0（官方文档未更新，比如文档推荐用`rollup-plugin-terser`压缩，但是实际上有兼容问题，要用 原`terser`进行替代）
- 而且rollup官方文档也比webpack逊色（其实很想说，逊色很多..），而且rollup打包还需要更高版本的node支持，webpack5兼容node更好



注意：如果你想用rollup打包commonjs，比如项目中用了lodash，那要走和webpack一样麻烦的配置流程，那还不如用webpack

- 如果你需要 code-splitting，有很多 static assets，需要使用很多 CommonJS 依赖，使用 Webpack
- 如果你的 codebase 是ES Module，写一些给其他人使用的代码或库，那么使用 Rollup

本地安装rollup：

```
npm install rollup --save-dev
```

安装完成后, Rollup 可以在项目的根目录中运行：

```
npx rollup --config
```

安装完成后，通常会在 `package.json` 中添加一个单一的构建脚本，为所有贡献者提供方便的命令。例如：

```
{
	"scripts": {
		"build": "rollup --config"
	}
}
```



#### webpack

优点：

- 兼容性无敌
- 生态强大，插件、loader强大，灵活

所以适合大型项目

缺点：

- 上手麻烦，冷启动，热更新慢



## 性能测试(该数据测试截止于2022.4)

打包工具特性对比总览

![](/Vite/all.png)



#### 打包速度

测试打包 antd + lodash + react + react-dom + three.js 的速度。为了控制变量，统一采用 esbuild 作为 minifier（spack 不支持除外）。

[测试数据来源]( https://github.com/guoyunhe/benchmark-bundlers)

|                  | webpack | rollup  | parcel | esbuild | spack  |
| ---------------- | ------- | ------- | ------ | ------- | ------ |
| ThinkPad T480    | 5.347s  | 14.548s | 6.069s | 0.249s  | 1.082s |
| MacBook 16, 2019 | 4.229s  | 12.790s | 5.225s | 0.227s  | 1.012s |

打包速度上首当其冲的就是esbuild，毋庸置疑，，spack（swcpack）也挺快的，但令人意外的是， webpack 居然比 parcel 和 rollup 更快。尤其是 rollup 的性能，令人意外地差。有可能是因为 lodash 和 react 都是 CJS 模块，rollup 需要将其转化成 ESM 才能使用，这才降低了rollup的速度



#### 包体积

[测试数据来源]( https://github.com/guoyunhe/benchmark-js-minifiers)

|                           | no-minify | terser  | esbuild | swc    |
| ------------------------- | --------- | ------- | ------- | ------ |
| 产物尺寸                  | 4.7MB     | 1.8MB   | 1.9MB   | 1.9MB  |
| 运行时间 ThinkPad T480    | 4.677s    | 17.046s | 5.615s  | 8.997s |
| 运行时间 MacBook 16, 2019 | 3.556s    | 13.834s | 4.052s  | 6.892s |

webpack v5 开箱即带有最新版本的 `terser-webpack-plugin`，这次对比的是 terser、esbuild和swc的压缩能力，terser是用node.js、esbuild使用go、swc使用rust， 对于这类高计算量任务，node.js的性能比原生程序差得多。但是从压缩结果来没什么差距



#### 编译特性对比

|                                 | babel   | esbuild | swc    |
| ------------------------------- | ------- | ------- | ------ |
| ES Next                         | ✅       | ✅       | ✅      |
| ES5, IE11                       | ✅       | ❌       | ✅      |
| JS 修饰器语法                   | ✅       | ❌       | ❌      |
| Flow 语言                       | ✅       | ❌       | ❌      |
| TypeScript 语言                 | ✅       | ✅       | ✅      |
| TS 修饰器语法                   | ✅       | ✅       | ✅      |
| JSX                             | ✅       | ✅       | ✅      |
| 运行时间在ThinkPad T480编译速度 | 10.133s | 0.464s  | 0.549s |

从特性上来看，babel 依旧是最全面的，而esbuild 和 swc 则注重对最新 ES 标准的支持，并且esbuild对旧版本兼容性一般，这也是为什么vite生产环境用rollup的原因吧



小总结： webpack 仍然是最全面的 Bundler 选择，支持特性最丰富，生态最为庞大。而且它的性能并不差，某些打包场景要优于 rollup 和 parcel；而esbuild、SWC等潜力也很大，vite有意在esbuild生态完善后全面使用，而不是参合着rollup，同时也用SWC取代babel的位置



## CRA和Vite

在业界，使用`CRA`已经成为了创建`React应用`约定俗成的惯例。它确实是个好办法，多年来也一直在迭代升级。

```bash
npx create-react-app my-app
cd my-app
npm start
```

然而，`CRA`也有自身的痛点（也是`Vite`力主提升的方向）：当项目体积变大，开发时间和构建时间也会大幅增加。**原因是，无论进行任何更改，`CRA`都会全量的重新构建应用。**

![](/Vite/cra.png)

而vite不同

不同于`CRA`的全量构建，`Vite`是按需构建的。`Vite`将一个应用分为两个部分：依赖和源码。

#### 依赖

依赖在开发过程中，基本不会变动。`Vite`使用[`esbuild`](https://link.juejin.cn?target=https%3A%2F%2Fesbuild.docschina.org%2F)（基于Go语言，比传统JS要快10-100倍）预打包了依赖，而且由于依赖变动极少，所以会被缓存起来以节省大量时间。



#### 源码

源码采用了ESM（ECMAScript modules）作为模块体系。好处是无需打包，按需加载，从图中我们可以看到那种按需的感觉

![](/Vite/cra2.png)



## Vite的预构建

Vite预构建主要是为了

1. **CommonJS 和 UMD 兼容性**：本地开发依赖于esbuild，所以需要代码转换成esm才能正常编译 + 构建，但是目前一些模块并不是esm，比如react、lodash，所以此时预构建起到一个转换的作用
2. **性能：**：由于vite的no-bundle性质，每一个import都对应一个请求，对于像lodash这种依赖层级深、涉及模块数量多的依赖包，直接回引发瀑布流请求，而预构建会帮忙直接把这种依赖层级深的包打包成一个文件，直接引入，这样会减少请求次数



vite默认自动开启，在项目启动成功后，你可以在根目录下的`node_modules`中发现`.vite`目录，这就是预构建产物文件存放的目录



当然，我们也可以自定义预构建配置，通过在vite.config.js里面进行更改optimizeDeps选项，可以自定义添加预构建入口`entries`、以来添加`include`、手动取消`exclude`，详情可查看：[这里](https://cn.vitejs.dev/config/dep-optimization-options.html)



## Vite安装和使用

#### start

Node版本 >= 12版本

安装一个完整的项目(直接上脚手架)

```shell
npm init @vitejs/app
```

相当于

```shell
npm i @vuejs/create-app
create-app
```

或者入门的话老师推荐先安装vite工具

```shell
npm install vite -g
```

or

```shell
npm i vite -D
```



开启vite服务器使用：

```shell
npx vite
```

vite打包

```shell
npx vite build
```



#### 配置

我们可以直接用`vite.config.ts`作为配置文件

1. 为避免类型报错，你需要通过 `pnpm i @types/node -D` 安装类型
2. tsconfig.node.json 中设置 `allowSyntheticDefaultImports: true`，以允许下面的 default 导入方式

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 手动指定项目根目录位置(html的根目录)
  root: path.join(__dirname, 'src'),
  //配置了官方的 react 插件
  plugins: [react()]
})
```



配置别名

```js
// vite.config.ts
import path from 'path';

{
  resolve: {
    // 别名配置
    alias: {
      '@assets': path.join(__dirname, 'src/assets')
    }
  }
}
```



## Vite的拆包策略

为什么要拆包？

传统打包模式下，会直接把整个项目一次性打包，它会

- 无法按需加载，最经典的就是路由组件
- 线上缓存复用率低，改动一行代码替换整个 bundle 产物，导致url改变，接而缓存失效。

所以我们进行拆包之后，加入入口文件有 5个文件，其中一个文件变动了，则变动的chunk只有那一份，此时达到拆包的效果

vite默认拆包策略：

```
├── assets
│   ├── Dynamic.xxx.js    // Async Chunk, 放动态导入的代码
│   ├── Dynamic.xxx.css   // Async CSS Chunk
│   ├── favicon.xxx.svg   // 静态资源
│   ├── index.xxx.css     // Initial CSS Chunk
│   ├── index.xxx.js      // Initial Chunk，放本地代码
│   └── vendor.xxx.js     // 放第三方包产物
└── index.html
```

当然我们可以通过`manualChunks`自定义拆包策略，但是可能会有循环引用的问题，所以还是推荐用一个 `vite-plugin-chunk-split` 插件去做自定义拆包





## 其他

没有像webpack一样的loader，比如要使用less文件，直接

```shell
npm install less -D
```

重新跑vite即可

vite默认支持TS

vite服务器内部Connect会对我们的请求做转发，完成less -> js、ts -> js，然后浏览器得到编译后的js代码

Vite1搭建的服务器为koa，而Vite2搭建的服务器为connect



#### Vite对Vue的支持

Vue3单文件组件支持： @vitejs/plugin-vue

Vue3 JSX支持： @vite/plugin-vue-jsx

Vue 2支持：underfin/vite-plugin-vue2

比如加入vue3的支持(@vue/complier-sfc负责编译vue文件)

```shell
npm i @vitejs/plugin-vue -D
npm i @vue/complier-sfc -D
```

vite的配置

在目录下新建vite.config.js文件，并将配置文件导出

```js
const vue = require('@vitejs/plugin-vue');
module.exports = {
	plugins: [
        vue()
    ]
}
```



#### 用esbuild起一个服务

（类似 webpack-dev-server）

首先在根目录下创建build.js

```js
// build.js
const { build, buildSync, serve } = require("esbuild");

function runBuild() {
  serve(
    {
      port: 8000,
      // 静态资源目录
      servedir: './dist'
    },
    {
      absWorkingDir: process.cwd(),
      entryPoints: ["./src/index.jsx"],
      bundle: true,
      format: "esm",
      splitting: true,
      sourcemap: true,
      ignoreAnnotations: true,
      metafile: true,
    }
  ).then((server) => {
    console.log("HTTP Server starts at port", server.port);
  });
}

runBuild();
```



#### 直接调vite的服务进行启动

 [createServer Api](https://cn.vitejs.dev/guide/api-javascript.html#createserver)，这就意味着无论在什么类型的项目中，只要提供给这个 API 准确的入参，就能启动 vite 服务。





#### vite插件 钩子

**通用钩子**

在开发中，Vite 开发服务器会创建一个插件容器来调用 [Rollup 构建钩子](https://rollupjs.org/plugin-development/#build-hooks)，与 Rollup 如出一辙。

以下钩子在服务器启动时被调用：

- [`options`](https://rollupjs.org/plugin-development/#options)
- [`buildStart`](https://rollupjs.org/plugin-development/#buildstart)

以下钩子会在每个传入模块**请求**时被调用：

- [`resolveId`](https://rollupjs.org/plugin-development/#resolveid)
- [`load`](https://rollupjs.org/plugin-development/#load)
- [`transform`](https://rollupjs.org/plugin-development/#transform)

它们还有一个扩展的 `options` 参数，包含其他特定于 Vite 的属性。你可以在 [SSR 文档](https://cn.vitejs.dev/guide/ssr.html#ssr-specific-plugin-logic) 中查阅更多内容。

以下钩子在服务器关闭时被调用：

- [`buildEnd`](https://rollupjs.org/plugin-development/#buildend)
- [`closeBundle`](https://rollupjs.org/plugin-development/#closebundle)

请注意 [`moduleParsed`](https://rollupjs.org/plugin-development/#moduleparsed) 钩子在开发中是 **不会** 被调用的，因为 Vite 为了性能会避免完整的 AST 解析。

[Output Generation Hooks](https://rollupjs.org/plugin-development/#output-generation-hooks)（除了 `closeBundle`) 在开发中是 **不会** 被调用的。你可以认为 Vite 的开发服务器只调用了 `rollup.rollup()` 而没有调用 `bundle.generate()`。



**特有钩子**

- config

  在读取完`vite.config.ts`后执行该钩子

- configResolved

  使用这个钩子读取和存储最终解析的配置。当插件需要根据运行的命令做一些不同的事情时，它也很有用，但是不建议再修改配置

- configureServer

  是用于配置开发服务器的钩子。最常见的用例是在内部 [connect](https://github.com/senchalabs/connect) 应用程序中添加自定义中间件:

- configurePreviewServer

  与 [`configureServer`](https://cn.vitejs.dev/guide/api-plugin.html#configureserver) 相同但是作为预览服务器。它提供了一个 [connect](https://github.com/senchalabs/connect) 服务器实例及其底层的 [http server](https://nodejs.org/api/http.html)。与 `configureServer` 类似，`configurePreviewServer` 这个钩子也是在其他中间件安装前被调用的。如果你想要在其他中间件 **之后** 安装一个插件，你可以从 `configurePreviewServer` 返回一个函数，它将会在内部中间件被安装之后再调用

  ```js
  const myPlugin = () => ({
    name: 'configure-preview-server',
    configurePreviewServer(server) {
      // 返回一个钩子，会在其他中间件安装完成后调用
      return () => {
        server.middlewares.use((req, res, next) => {
          // 自定义处理请求 ...
        })
      }
    },
  })
  ```

- transformIndexHtml

  这个钩子用来灵活控制 HTML 的内容，你可以拿到原始的 html 内容后进行任意的转换

- handleHotUpdate

  这个钩子会在 Vite 服务端处理热更新时被调用，你可以在这个钩子中拿到热更新相关的上下文信息，进行热更模块的过滤，或者进行自定义的热更处理

**普通用户插件钩子执行顺序**

```js
export default function testHookPlugin () {
    return {
      name: 'test-hooks-plugin', 
      // 独有
      config(config) {
        console.log('config');
      },
      // 独有
      configResolved(resolvedCofnig) {
        console.log('configResolved');
      },
      // 通用钩子
      options(opts) {
        console.log('options');
        return opts;
      },
      // 独有
      configureServer(server) {
        console.log('configureServer');
        setTimeout(() => {
          // 手动退出进程
          process.kill(process.pid, 'SIGTERM');
        }, 3000)
      },
      // 通用钩子
      buildStart() {
        console.log('buildStart');
      },
      // 通用钩子
      buildEnd() {
        console.log('buildEnd');
      },
      // 通用钩子
      closeBundle() {
        console.log('closeBundle');
      }
  }
}
```

下图源自神三元的《深入浅出Vite》

![](/Vite/vite-plugin.png)

**插件顺序**

如果是直接看全部插件种类的顺序则为

![](/Vite/vite-plugin-2.png)



#### Vite多页面配置解决方案

1.https://juejin.cn/post/7128999848564981796

2.https://www.fly63.com/article/detial/12038

这2篇都可以看下，不过vite的html插件没生效，可能是我用的vite4.4的缘故

我才用的是方法2

```ts
import { defineConfig } from 'vite';
import path from 'path'
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';

export default defineConfig({
    //设置根目录地址
    root:'src/pages',
    plugins: [
        solidPlugin(),
    ],
    server: {
        port: 3001,
    },
    build: {
        target: 'esnext',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'src/pages/index.html'),
                demo1: path.resolve(__dirname, 'src/pages/demo1/index.html'),
                demo2: path.resolve(__dirname, 'src/pages/demo2/index.html')
            },
            output: {
                dir: 'public'
            }
        }
    },
    resolve: {
        // 别名配置
        alias: {
        '@assets': path.join(__dirname, 'src/assets')
        }
    },
    css: {
        // 预处理器配置项
        preprocessorOptions: {
          less: {
            math: "always",
          },
        },
    }
});

```



#### Vite的兼容性问题(截止2023.7.26)

兼容更低版本需要用@vitejs/plugin-legacy

```js
// vite.config.js
import legacy from '@vitejs/plugin-legacy'

export default {
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
}
```

![](/Vite/jianrong.png)



#### 代码压缩

```shell
npm add -D terser
```

```ts
export default defineConfig({
    build: {
        target: 'esnext',
        rollupOptions: {
            input: {
                main: path.resolve(__dirname, 'src/pages/index.html'),
                demo1: path.resolve(__dirname, 'src/pages/demo1/index.html'),
                demo2: path.resolve(__dirname, 'src/pages/demo2/index.html')
            },
            output: {
                dir: 'public'
            }
        },
        minify: 'terser'
    }
});

```



#### 环境变量

vite中，我们的代码运行在浏览器环境中，是无法识别node代码的，所以用不了process.env(除非在vite.config文件中)

根据环境变量选择配置

```js
import devConfig from './app.dev';
import onlineConfig from './app.production';
import testConfig from './app.test';

console.log('import.meta', import.meta);
console.log('import.meta.env.DEV', import.meta.env.DEV);

// eslint-disable-next-line no-nested-ternary
const config = {};

export default config;
```

设置某环境的专属环境变量

首先，我们要确定下我们设置.env文件默认地址，默认是root（根目录），如果在vite.config修改了root地址的话，默认地址就是在修改后的地址下

```
.env                # 所有情况下都会加载
.env.local          # 所有情况下都会加载，但会被 git 忽略
.env.[mode]         # 只在指定模式下加载
.env.[mode].local   # 只在指定模式下加载，但会被 git 忽略
```

Vite dev默认mode：**development** 

Vite build默认mode：**production** 

如果想要修改mode，获得指定的专属环境变量

```json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "buildtest": "vite build --test",
  "buildstaging": "vite build --staging"
},
```

此时指定的 `.env.test` / `.env.staging` 就会在对应模式下生效

值得注意的是，对应的环境变量要加上VITE_前缀，目的是：

![](/Vite/vite_env.png)





## 项目本地开发迁移vite模式

#### 初始

安装依赖

```json
"vite": "^4.0.0",
"@vitejs/plugin-react": "^4.2.1"
```



配置 vite.config.js

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react({
        jsxRuntime: 'classic', // 使用经典处理，不会重复加入jsx插件
        babel: {
            configFile: false,
            plugins: [
                '@babel/plugin-transform-react-jsx'
            ],
        },
    })],
});

```



把html文件copy一份，放在根目录，[具体原因](https://cn.vitejs.dev/guide/#index-html-and-project-root)

如果是像umi这种，没有把渲染器js暴露出来的，可以自己新建一个js文件，然后自己渲染

```js
import React from 'react';
import ReactDOM from 'react-dom';
import App from '../client/aaaa.js';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
```



#### jsx识别问题

```json
"@babel/plugin-transform-react-jsx": "^7.23.4"
```

以上包用于解决jsx不能识别问题，并且要配置以下内容

这里除了使用 `@babel/plugin-transform-react-jsx` 还内部在esbuild选项使用了jsx转换是双重保险，因为有部分大型老后台项目，仅用  `@babel/plugin-transform-react-jsx`  还不能完全生效

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    optimizeDeps: {
        include: ['@babel/runtime/helpers/extends'],
        esbuildOptions: {
            loader: {
                '.js': 'jsx'
            }
        },
    },
    plugins: [
        react({
            //该插件使用自动 JSX 运行时，不会重复加入jsx插件
            jsxRuntime: 'classic',
            babel: {
                // Use babel.config.js files
                configFile: false,
                plugins: [
                    '@babel/plugin-transform-react-jsx'
                ],
            },
        })],
});
```



#### 部分包中，直接使用this，全局this指向问题

先搞个esbuild插件

```js
import fs from 'fs';

//针对一些有问题的老包进行匹配
const knownPkg = [/reqwest/, /nos-uploader/];

/**
 * @returns {import("esbuild").Plugin}
 */
function esbuildGlobThis(pkgRegs = []) {
    const globalThisPkg = [...knownPkg, ...pkgRegs];

    // 处理this在module模式下，指向为undefined问题，保证其指向为window
    return {
        name: 'esbuild:glob-this',
        setup(build) {
            build.onLoad({ filter: /.*\.js$/ }, async ({ path }) => {
                if (!globalThisPkg.some((reg) => reg.test(path)) || path.includes('?commonjs')) {
                    return null;
                }

                const content = await fs.promises.readFile(path, 'utf8');
                const code = JSON.stringify(content);

                return {
                    loader: 'js',
                    contents: `// glob-this [${path}]
                    !(new Function("module", "exports", ${code}))(module, module.exports);`
                };
            });
        }
    };
}

export default esbuildGlobThis;

```



#### 别名配置问题

在vite.config.js中配置好对应的别名即可

```js
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
    //...
    resolve: {
        // 别名配置， 从easy copy 过来
        alias: {
            $appConfig: path.resolve(__dirname, './config/app.dev.js'),
            $config: path.resolve(__dirname, './config/'),
            $utils: path.resolve(__dirname, './client/utils/'),
            $styles: path.resolve(__dirname, './client/styles/'),
            $assets: path.resolve(__dirname, './client/assets'),
            $components: path.resolve(__dirname, './client/components/'),
            $types: path.resolve(__dirname, './client/types'),
            $server: path.resolve(__dirname, './client/server')
        }
    }
});

```



#### 本地走vite模式开发

```json
"scripts": {
    "vite": "vite",
 },
```





参考文章：

[【译文】Vite是什么？为何推荐使用Vite代替Create React App？](https://juejin.cn/post/7211909301866348604)

[ESbuild 介绍](https://juejin.cn/post/6918927987056312327)

[深入浅出 Vite](https://juejin.cn/book/7050063811973218341)

[Comparing the New Generation of Build Tools](https://css-tricks.com/comparing-the-new-generation-of-build-tools/)

[前端构建工具测评](https://guoyunhe.me/2022/01/24/front-end-build-tool-benchmark/)
