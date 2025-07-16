---
author: Hello
categories: 前端
pubDate: 2022-9-22
title: qiankun实战
description: '框架相关'
---

## 1.qiankun快速上手

快速上手：https://qiankun.umijs.org/zh/guide/getting-started

### 主应用

in 主应用，要完成对微应用的注册：

```shell
yarn add qiankun # 或者 npm i qiankun -S
```

```js
import { registerMicroApps, start } from 'qiankun';

registerMicroApps([
  {
    name: 'react app', // app name registered
    entry: '//localhost:7100',
    container: '#yourContainer',
    activeRule: '/yourActiveRule',
  },
  {
    name: 'vue app',
    entry: { scripts: ['//localhost:7100/main.js'] },
    container: '#yourContainer2',
    activeRule: '/yourActiveRule2',
  },
]);

start();
```

当微应用信息注册完之后，一旦浏览器的 url 发生变化，便会自动触发 qiankun 的匹配逻辑，所有 activeRule 规则匹配上的微应用就会被插入到指定的 container 中，同时依次调用微应用暴露出的生命周期钩子。



`registerMicroApps(apps, lifeCycles?)`：https://qiankun.umijs.org/zh/api#registermicroappsapps-lifecycles



如果不想要用url控制子应用的加载，可以选择手动加载完毕

```js
import { loadMicroApp } from 'qiankun';

loadMicroApp({
  name: 'app',
  entry: '//localhost:7100',
  container: '#yourContainer',
});
```



### 子应用

in 子应用，不需要npm装啥东西，但是需要做两个配置

#### 配置一

微应用需要在自己的入口 js (通常就是你配置的 webpack 的 entry js) 导出 `bootstrap`、`mount`、`unmount` 三个生命周期钩子，以供主应用在适当的时机调用。

- bootstrap：类似于special mount，仅在第一次
- mount： 每次挂载子应用就会调用
- unmount： 每次卸载子应用调用
- update：可选，仅使用 loadMicroApp 方式加载微应用时生效

```jsx
/**
 * bootstrap 只会在微应用初始化的时候调用一次，下次微应用重新进入时会直接调用 mount 钩子，不会再重复触发 bootstrap。
 * 通常我们可以在这里做一些全局变量的初始化，比如不会在 unmount 阶段被销毁的应用级别的缓存等。
 */
export async function bootstrap() {
  console.log('react app bootstraped');
}


/**
 * 应用每次进入都会调用 mount 方法，通常我们在这里触发应用的渲染方法
 */
export async function mount(props) {
  ReactDOM.render(<App />, props.container ? props.container.querySelector('#root') : document.getElementById('root'));
}


/**
 * 应用每次 切出/卸载 会调用的方法，通常在这里我们会卸载微应用的应用实例
 */
export async function unmount(props) {
  ReactDOM.unmountComponentAtNode(
    props.container ? props.container.querySelector('#root') : document.getElementById('root'),
  );
}


/**
 * 可选生命周期钩子，仅使用 loadMicroApp 方式加载微应用时生效
 */
export async function update(props) {
  console.log('update props', props);
}
```

#### 配置二

配置微应用的打包工具

除了代码中暴露出相应的生命周期钩子之外，为了让主应用能正确识别微应用暴露出来的一些信息，微应用的打包工具需要增加如下配置：

webpack:

```js
const packageName = require('./package.json').name;


module.exports = {
  output: {
    library: `${packageName}-[name]`,
    libraryTarget: 'umd',
    jsonpFunction: `webpackJsonp_${packageName}`, //webpack5不用配置
  },
};
```

- `jsonpFunction`： 在 webpack 4 中，多个 webpack 运行时可能在同一个 HTML 页面上发生冲突，因为它们使用相同的全局变量来加载块。要解决此问题，需要为`output.jsonpFunction`配置提供自定义名称。

  Webpack 5 会自动推断构建的唯一名称，`package.json` `name`并将其用作`output.uniqueName`.



## 2.qiankun基本项目上手

对于主应用，一般来说和快速上手主应用的配置一样即可

对于子应用，微应用分为有 `webpack` 构建和无 `webpack` 构建项目，有 `webpack` 的微应用（主要是指 Vue、React、Angular）需要做的事情有：

1. 新增 `public-path.js` 文件，用于修改运行时的 `publicPath`。

> 注意：运行时的 publicPath 和构建时的 publicPath 是不同的，两者不能等价替代。

1. 微应用建议使用 `history` 模式的路由，需要设置路由 `base`，值和它的 `activeRule` 是一样的。（路由不带 # 号）
2. 在入口文件最顶部引入 `public-path.js`，修改并导出三个生命周期函数。
3. 修改 `webpack` 打包，允许开发环境跨域和 `umd` 打包。





对于1，我们先来了解一个概念：webpack的公共路径

- [`publicPath`](https://webpack.docschina.org/configuration/output/#outputpublicpath) 配置选项在各种场景中都非常有用。你可以通过它来指定应用程序中所有资源的基础路径。
  - 你可以理解为我们常用的在脚手架中config配置的全局路径前缀"@"、"$"等

但是在微前端中，这个公共路径可能会随着主应用改变，需要一个子应用运行时的公共路径配置（运行时改变）

webpack 暴露了一个名为 `__webpack_public_path__` 的全局变量。所以在应用程序的 entry point 中，可以直接如下设置：

```js
__webpack_public_path__ = process.env.ASSET_PATH;
```



对于无 `webpack` 构建的子应用项目，直接将 `lifecycles` 挂载到 `window` 上即可。



#### `window.__POWERED_BY_QIANKUN__`

在qiankun环境中，我们可以得到 `window.__POWERED_BY_QIANKUN__)`这个值，为true，通常用来判断子应用是否为乾坤环境



#### 展开说说

React微应用项目

以 `create react app` 生成的 `react 16` 项目为例，搭配 `react-router-dom` 5.x。

1. 在 `src` 目录新增 `public-path.js`：

   ```js
   if (window.__POWERED_BY_QIANKUN__) {
     __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__;
   }
   ```

2. 设置 `history` 模式路由的 `base`：

   ```html
   <BrowserRouter basename={window.__POWERED_BY_QIANKUN__ ? '/app-react' : '/'}>
   ```

3. 入口文件 `index.js` 修改，为了避免根 id `#root` 与其他的 DOM 冲突，需要限制查找范围。

   并且在入口文件导出生命周期函数

   ```js
   import './public-path';
   import React from 'react';
   import ReactDOM from 'react-dom';
   import App from './App';
   
   
   function render(props) {
     const { container } = props;
     ReactDOM.render(<App />, container ? container.querySelector('#root') : document.querySelector('#root'));
   }
   
   
   if (!window.__POWERED_BY_QIANKUN__) {
     render({});
   }
   
   
   export async function bootstrap() {
     console.log('[react16] react app bootstraped');
   }
   
   
   export async function mount(props) {
     console.log('[react16] props from main framework', props);
     render(props);
   }
   
   
   export async function unmount(props) {
     const { container } = props;
     ReactDOM.unmountComponentAtNode(container ? container.querySelector('#root') : document.querySelector('#root'));
   }
   ```

4. 修改 `webpack` 配置

   安装插件 `@rescripts/cli`，当然也可以选择其他的插件，例如 `react-app-rewired`。

   ```dash
   npm i -D @rescripts/cli
   ```

   根目录新增 `.rescriptsrc.js`：

   ```js
   const { name } = require('./package');
   
   
   module.exports = {
     webpack: (config) => {
       config.output.library = `${name}-[name]`;
       config.output.libraryTarget = 'umd';
       config.output.jsonpFunction = `webpackJsonp_${name}`;
       config.output.globalObject = 'window';
   
   
       return config;
     },
   
   
     devServer: (_) => {
       const config = _;
   
   
       config.headers = {
         'Access-Control-Allow-Origin': '*',
       };
       config.historyApiFallback = true;
       config.hot = false;
       config.watchContentBase = false;
       config.liveReload = false;
   
   
       return config;
     },
   };
   ```

   修改 `package.json`：

   ```diff
   -   "start": "react-scripts start",
   +   "start": "rescripts start",
   -   "build": "react-scripts build",
   +   "build": "rescripts build",
   -   "test": "react-scripts test",
   +   "test": "rescripts test",
   -   "eject": "react-scripts eject"
   ```





其他项目（vue、angular）也可查看qiankun官网的项目实践：[qiankun官网项目实践](https://qiankun.umijs.org/zh/guide/tutorial)



## 3.全局状态

主应用：

```javascript
// main/src/main.js
import { initGlobalState } from 'qiankun';
// 初始化 state
const initialState = {
  user: {} // 用户信息
};
const actions = initGlobalState(initialState);
actions.onGlobalStateChange((state, prev) => {
  // state: 变更后的状态; prev 变更前的状态
  console.log(state, prev);
});
actions.setGlobalState(state);
actions.offGlobalStateChange();
```

子应用：

```javascript
// 从生命周期 mount 中获取通信方法，props默认会有onGlobalStateChange和setGlobalState两个api
export function mount(props) {
  props.onGlobalStateChange((state, prev) => {
    // state: 变更后的状态; prev 变更前的状态
    console.log(state, prev);
  });
  props.setGlobalState(state);
```

形成了一个父子应用的发布订阅模式



## 4.注册子应用

我从qiankun源代码直接看到的流程为：`registerMicroApps` -> `loadApp` -> 

```js
const { template, execScripts, assetPublicPath } = await importEntry(entry, importEntryOpts);
```

然后初始化html模版（加上各种qiankun-head）

```js
 const appContent = getDefaultTplWrapper(appInstanceId)(template);
```

```js
let initialAppWrapperElement: HTMLElement | null = createElement(
  appContent,
  strictStyleIsolation,
  scopedCSS,
  appInstanceId,
);
```

其实 `createElement` 也就是在做一些

 ` document.createElement('div');` 

 `containerElement.innerHTML = appContent;`

`shadow = appElement.attachShadow({ mode: 'open' });`

的一些操作

在加载script的时候执行子应用生命周期

```js
  const scriptExports: any = await execScripts(global, sandbox && !useLooseSandbox);
  const { bootstrap, mount, unmount, update } = getLifecyclesFromExports(
    scriptExports,
    appName,
    global,
    sandboxContainer?.instance?.latestSetProp,
  );
```





## 5.import-html-entry

import-html-entry 是 qiankun 中一个举足轻重的依赖，用于获取子应用的 HTML 和 JS，它允许以html文件为应用入口，然后通过一个html解析器从文件中提取js和css依赖，并通过fetch下载依赖，同时对 HTML 和 JS 进行了各自的处理，以便于子应用在父应用中加载

该方案的主要思路是允许以html文件为应用入口，然后通过一个html解析器从文件中提取js和css依赖，并通过fetch下载依赖

```js
export default function importHTML(url, opts = {}) {
	// 1. 通过 fetch 获取到 url 对应的 html
	return embedHTMLCache[url] || (embedHTMLCache[url] = fetch(url)
		.then(html => {
  // 2. 从返回的结果中解析出以下内容a.经过初步处理后的 html, b.由所有 "script" 组成的数组, c.由所有 "style" 组成的数组
			const { template, scripts, entry, styles } = processTpl(getTemplate(html), assetPublicPath, postProcessTemplate);
	// 3. 将所有的 css 嵌入到上述经过初步处理后的 html 中
			return getEmbedHTML(template, styles, { fetch }).then(embedHTML => (...));
		}));
}
```

于是在qiankun中你可以这样配置入口：

```js
const MicroApps = [{
  name: 'app1',
  entry: 'http://localhost:8080',
  container: '#app',
  activeRule: '/app1'
}]
```

qiankun会通过import-html-entry请求http://localhost:8080，得到对应的html文件，解析内部的所有script和style标签，依次下载和执行它们，这使得应用加载变得更易用。



#### 三个api

`import-html-entry`，有

1. `importHTML`：将索引 html 视为清单并加载资产（css，js），从入口脚本获取导出。

   - 导出

   - ```js
     //解析模板的核心函数_processTpl2
     var _processTpl = (0, _processTpl2["default"])(getTemplate(html), assetPublicPath, postProcessTemplate),
         template = _processTpl.template,
         scripts = _processTpl.scripts,
         entry = _processTpl.entry,
         styles = _processTpl.styles;
     return getEmbedHTML(template, styles, {
       fetch: fetch
     }).then(function (embedHTML) {
       return {
         template: embedHTML,
         assetPublicPath: assetPublicPath,
         getExternalScripts: function getExternalScripts() {
           return _getExternalScripts(scripts, fetch);
         },
         getExternalStyleSheets: function getExternalStyleSheets() {
           return _getExternalStyleSheets(styles, fetch);
         },
         execScripts: function execScripts(proxy, strictGlobal) {
           var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
           if (!scripts.length) {
             return Promise.resolve();
           }
           return _execScripts(entry, scripts, proxy, _objectSpread({
             fetch: fetch,
             strictGlobal: strictGlobal
           }, opts));
         }
       };
     });
     ```

     

2. `importEntry`：加载资产（css，js）并嵌入到 HTML 模板中，从入口脚本获取导出。（实际上如果 `type of 参数 === string`，就会返回`importHTML`）

   为对象的时候，传入的是脚本和样式的资源列表。

   ```json
   {
     html:"http://xxx.com/static/tpl.html",
     scripts:[
       {
         src:"http://xxx.com/static/xx.js",
         async:true
       },
       ...
     ],
       styles:[
       { 
       href:"http://xxx.com/static/style.css"
       },
   ...
   ]
   } 
   ```

3. `execScripts`：在自定义沙箱上通过 URL 加载脚本，从入口脚本获取导出。

暴露出的核心接口是`importHTML`，而 `importHTML` 的具体流程：

1. 检查是否有缓存，如果有，直接从缓存中返回
2. 如果没有，则通过fetch下载，并字符串化
3. 基于正则表达式对模板字符串基于正则表达式对模板字符串 进行一次模板解析，主要任务是扫描出外联脚本和外联样式，保存在scripts和styles中
4. 调用getEmbedHTML，将外联样式下载下来，并替换到模板内，使其变成内部样式
5. 返回一个对象，该对象包含处理后的模板，以及getExternalScripts、getExternalStyleSheets、execScripts等几个核心方法。

![](/simple-blog/微服务/qiankun3.png)



- `getExternalStyleSheets`：prefetch下载styles样式表，isInlineCode判断是否为内联代码，返回css的代码

  ```js
  function _getExternalStyleSheets(styles) {
    var fetch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultFetch;
    return Promise.all(styles.map(function (styleLink) {
      if (isInlineCode(styleLink)) {
        // if it is inline style
        return (0, _utils.getInlineCode)(styleLink);
      } else {
        // external styles
        return styleCache[styleLink] || (styleCache[styleLink] = fetch(styleLink).then(function (response) {
          return response.text();
        }));
      }
    }));
  }
  ```

  

- `getExternalScripts`：prefetch下载script表，isInlineCode判断是否为内联代码，是的话直接截取script里面的代码，返回js的代码

  ```js
  // for prefetch
  function _getExternalScripts(scripts) {
    var fetch = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : defaultFetch;
    var errorCallback = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {};
    var fetchScript = function fetchScript(scriptUrl) {
      return scriptCache[scriptUrl] || (scriptCache[scriptUrl] = fetch(scriptUrl).then(function (response) {
        // usually browser treats 4xx and 5xx response of script loading as an error and will fire a script error event
        // https://stackoverflow.com/questions/5625420/what-http-headers-responses-trigger-the-onerror-handler-on-a-script-tag/5625603
        if (response.status >= 400) {
          errorCallback();
          throw new Error("".concat(scriptUrl, " load failed with status ").concat(response.status));
        }
        return response.text();
      })["catch"](function (e) {
        errorCallback();
        throw e;
      }));
    };
    return Promise.all(scripts.map(function (script) {
      if (typeof script === 'string') {
        if (isInlineCode(script)) {
          // if it is inline script
          return (0, _utils.getInlineCode)(script);
        } else {
          // external script
          return fetchScript(script);
        }
      } else {
        // use idle time to load async script
        var src = script.src,
          async = script.async;
        if (async) {
          return {
            src: src,
            async: true,
            content: new Promise(function (resolve, reject) {
              return (0, _utils.requestIdleCallback)(function () {
                return fetchScript(src).then(resolve, reject);
              });
            })
          };
        }
        return fetchScript(src);
      }
    }));
  }
  ```

  

- `execScripts`：执行脚本，返回`_getExternalScripts.then()` + 获取代码（`getExecutableScript`,改变脚本执行时候的`window`/`self`/`this` 的指向。） + `schedule` 函数调度中按序执行 `exec`

  ```js
  function getExecutableScript(scriptSrc, scriptText) {
    var opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var proxy = opts.proxy,
        strictGlobal = opts.strictGlobal,
        _opts$scopedGlobalVar = opts.scopedGlobalVariables,
        scopedGlobalVariables = _opts$scopedGlobalVar === void 0 ? [] : _opts$scopedGlobalVar;
    var sourceUrl = isInlineCode(scriptSrc) ? '' : "//# sourceURL=".concat(scriptSrc, "\n");
  
    // 将 scopedGlobalVariables 拼接成函数声明，用于缓存全局变量，避免每次使用时都走一遍代理
    var scopedGlobalVariableFnParameters = scopedGlobalVariables.length ? scopedGlobalVariables.join(',') : '';
  
    // 通过这种方式获取全局 window，因为 script 也是在全局作用域下运行的，所以我们通过 window.proxy 绑定时也必须确保绑定到全局 window 上
    // 否则在嵌套场景下， window.proxy 设置的是内层应用的 window，而代码其实是在全局作用域运行的，会导致闭包里的 window.proxy 取的是最外层的微应用的 proxy
    var globalWindow = (0, eval)('window');
    globalWindow.proxy = proxy;
    // TODO 通过 strictGlobal 方式切换 with 闭包，待 with 方式坑趟平后再合并
    return strictGlobal ? scopedGlobalVariableFnParameters ? ";(function(){with(window.proxy){(function(".concat(scopedGlobalVariableFnParameters, "){;").concat(scriptText, "\n").concat(sourceUrl, "}).bind(window.proxy)(").concat(scopedGlobalVariableFnParameters, ")}})();") : ";(function(window, self, globalThis){with(window){;".concat(scriptText, "\n").concat(sourceUrl, "}}).bind(window.proxy)(window.proxy, window.proxy, window.proxy);") : ";(function(window, self, globalThis){;".concat(scriptText, "\n").concat(sourceUrl, "}).bind(window.proxy)(window.proxy, window.proxy, window.proxy);");
  }
  ```

  

参考：

[qiankun官网项目实践](https://qiankun.umijs.org/zh/guide/tutorial)