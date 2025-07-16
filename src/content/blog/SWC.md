---
author: Hello
categories: 前端
title: SWC
description: '框架相关'
---

## SWC

SWC 是一个可扩展的基于 Rust 的平台，用于下一代快速开发工具

SWC 可用于编译和捆绑。对于编译，它使用现代 JavaScript 功能获取 JavaScript / TypeScript 文件，并输出所有主要浏览器都支持的有效代码，类似于 babel。

虽然目前SWC 也提供了 Bundle 能力，但是其生态和稳定性上来说稍微逊色

> 官方：SWC在单线程上**比 Babel 快 20 倍，在四核上****快 70 倍**。

快的原因网上看了大概是因为支持并行的特性

SWC 的[编译](https://swc.rs/docs/configuration/compilation)旨在支持所有 ECMAScript 特性。SWC CLI 旨在成为 Babel 的直接替代品：

```shell
$ npx babel # old
$ npx swc # new
```

SWC 支持**所有 stage 3 proposals**和 preset-env，包括 bugfix 转换。





#### 特性

- Compilation （编译）
- Bundling (`swcpack`, under development) （打包，正在开发中）
- Minification （压缩）
- Transforming with WebAssembly （使用WebAssembly进行转换）
- Usage inside webpack (`swc-loader`) （在webpack中使用）
- Improving Jest performance (`@swc/jest`) （提高jest单测性能）
- Custom Plugins （个性化插件定制）



## 使用

```shell
pnpm i -D @swc/cli @swc/core
```

或者

```shell
npm i -D @swc/cli @swc/core
```

或者

```shell
yarn add -D @swc/cli @swc/core
```



然后

```shell
npx swc ./file.js
```





## 参考文章

[SWC官网](https://swc.rs/docs/getting-started)

[swc-node, 最快的 TypeScript/JavaScript compiler](https://zhuanlan.zhihu.com/p/165485522)