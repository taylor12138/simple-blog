---
title: 'Astro'
author: Hello
categories: 前端
description: 'Astro 是一个前端框架，它可以帮助你构建一个内容驱动的网站。'
pubDate: 'Jan 15 2025'
pinned: true
---

## 简介

**Astro** 是最适合构建像博客、营销网站、电子商务网站这样的**以内容驱动的网站**的 Web 框架。

Astro 以开创了一种新的[前端架构](https://docs.astro.build/zh-cn/concepts/islands/)而闻名，与其他框架相比它减少了 JavaScript 的开销和复杂性。如果你需要一个加载速度快、具有良好 SEO 的网站，那么 Astro 就是你的选择。



## Astro的群岛架构

Astro 帮助开创并推广了一种新的前端架构模式，称为 **群岛架构**。

群岛架构的工作原理是将大部分页面渲染为快速且静态的 HTML，并在页面上需要交互或者是个性化的区域（例如，轮播图），添加上更小的 JavaScript “群岛”。这种方式避免了单体 JavaScript 负载对于许多其他现代的 JavaScript Web 框架响应速度的影响。

”Etsy” 的前端架构师 [Katie Sylor-Miller](https://sylormiller.com/) 在 2019 年首次创造了 “组件群岛” 这个术语。随后，Preact 的创造者 Jason Miller 在 2020 年 8 月 11 日扩展了这个概念，并在 [这篇文章](https://jasonformat.com/islands-architecture/) 中进行了记录。



#### 客户端群岛

默认情况下，Astro 会自动将每个 UI 组件渲染成仅包含 HTML 和 CSS 的形式，**并自动剥离掉所有客户端 JavaScript。**

src/pages/index.astro

```
<MyReactComponent />
```

这听起来可能很严格，但正是这种做法使得 Astro 网站默认保持快速，并且避免开发者不小心发送不必要或不想要的 JavaScript，而拖慢他们的网站速度。

只需使用一个 `client:*` 指令，就可以将任何静态 UI 组件转变为交互式岛屿。然后 Astro 会自动构建并打包你的客户端 JavaScript，以优化性能。

src/pages/index.astro

```
<!-- 现在这个组件在页面上是可交互的了！

  而网站的其他部分仍然是静态。 -->

<MyReactComponent client:load />
```

在使用群岛时，客户端的 JavaScript 只会加载你所使用 `client:*` 指令明确标记的交互组件。

并且由于交互是在组件层面配置的，所以你可以根据每个组件的使用情况来处理不同的加载优先级。例如，`client:idle` 告诉一个组件在浏览器变为空闲时加载，而 `client:visible` 告诉一个组件只有在进入视口后才加载。



#### 客户端群岛好处

Astro 群岛的最明显的好处就是性能：你网站的大部分区域都被转换为了快速、静态的 HTML，JavaScript 只有在需要的时候才会加载到各个组件中。JavaScript 是一个加载得最慢的资源。每一个字节都影响着阅读者的体验！

另一个好处是并行加载。在上面的一些假想例子中，重要性更低的图像轮播不应该阻挡更重要的页头部分的加载。它俩并行加载但独自激活（hydrate），这表明阅读者并不需要等着更沉重的图像轮播加载完毕就可以与页头交互了。

更棒的地方在于：你可以准确地告诉 Astro 如何以及何时渲染每个组件。如果该图像轮播的加载成本真的很高，你可以附加一个特殊的客户端指令，告诉 Astro 仅在轮播在页面上可见时才加载它。如果用户从未看到它，它永远不会被加载。





#### 服务器群岛

服务器群岛是一种将昂贵或缓慢的服务器端代码移出主渲染进程的方法，通过这种方法可以轻松地将高性能静态 HTML 和动态服务器生成的组件结合起来。

将 [`server:defer` 指令](https://docs.astro.build/zh-cn/reference/directives-reference/#服务器端指令) 添加到页面上的任何 Astro 组件，来将其变成自己的服务器岛屿：

src/pages/index.astro

```
---

import Avatar from '../components/Avatar.astro';

---

<Avatar server:defer />
```

该指令会将你的页面分解为较小的服务器渲染内容区域，每个区域并行加载。

你的页面的主要内容可以使用占位符内容（例如通用头像）立即完成渲染，直到岛屿自己的内容可用。对于服务器群岛，拥有个性化内容的小组件不会延迟静态页面的渲染。

这种渲染模式是为了便于移植而构建的。它不依赖于服务器的任何基础架构，因此它可以与任何主机配合使用，从 Docker 容器中的 Node.js 服务器到你所选择的无服务器供应商。



#### 服务器群岛的优势

- 服务器群岛的优势之一是能够动态渲染页面的高度动态部分。它允许更积极地缓存外壳和主要内容，从而提供更快的性能。
- 另一个优势是提供出色的访客体验。服务器群岛经过了优化且加载速度快

受益于 Astro 服务器群岛的一个很好的例子是电子商务店面的网站。尽管产品页面的主要内容很少更改，但这些页面通常包含一些动态部分：

- 标题中的用户头像。
- 商品的特惠、特价信息。
- 用户评价。



## 开始

选择模版创建项目

```shell
# 使用官方示例创建一个新项目
npm create astro@latest -- --template <example-name>

# 基于 GitHub 仓库的 main 分支创建一个新项目
npm create astro@latest -- --template <github-username>/<github-repo>
```





## 使用多个框架

当你在同一个项目中使用多个 JSX 框架（React、Preact、Solid）时，Astro 需要确定每个组件应该使用哪个 JSX 框架的转换器（transformation）。如果你只向你的项目中添加了一个 JSX 框架集成，那么就不需要额外的配置。

使用 `include`（必填）和 `exclude`（可选）配置选项来指定哪些文件属于哪个框架。为你使用的每个框架提供一个文件或/和文件夹数组。通配符可用于包含多个文件路径。

我们建议将每个框架的组件放在同一个文件夹中（例如 `/components/react/` 和 `/components/solid/`），以便更容易地指定你的包含内容，但这不是必需的：

astro.config.mjs

```js
import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import react from '@astrojs/react';
import svelte from '@astrojs/svelte';
import vue from '@astrojs/vue';
import solid from '@astrojs/solid-js';

export default defineConfig({
  // 启用多个框架来支持所有不同类型的组件。
  // 如果你只使用一个 JSX 框架，则不需要 `include`！
  integrations: [
    preact({
      include: ['**/preact/*'],
    }),
    react({
      include: ['**/react/*'],
    }),
    solid({
      include: ['**/solid/*', '**/node_modules/@suid/material/**'],
    }),
  ],

});
```

注意：如果直接在astro文件里使用到的框架组件，也需要包含在include中，比如：

```jsx
import {SiGithub} from 'solid-icons/si';

<SiGithub size={32} />
```

```js
import { defineConfig, passthroughImageService } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import solidJs from "@astrojs/solid-js";
import react from "@astrojs/react";

// https://astro.build/config
export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [
        rehypeKatex,
        {
          // Katex plugin options
        },
      ],
    ],
  },

  image: {
    service: passthroughImageService(),
  },
  vite: {
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  },
  site: "https://blog.plr.moe",
  integrations: [
    mdx(),
    sitemap(),
    solidJs({
        include: ['**/solid/*', '**/node_modules/solid-icons/**'],
    }),
    react({
        include: ['**/react/*'],
    }),
  ],
});
```



然后我们在astro里使用这些ui组件

在 Astro 页面、布局和组件中就像 Astro 组件一样使用你的 JavaScript 框架组件。所有组件都可放在 `/src/components` 目录中，或者你也可以放在任何你喜欢的地方。

要使用框架组件，你需要在 Astro 组件脚本中使用相对路径导入它们。然后在其他组件、HTML 元素和类 JSX 表达式中使用它们。

src/pages/static-components.astro

```jsx
import MyReactComponent from '../components/MyReactComponent.jsx';

<html>
  <body>
    <h1>Use React components directly in Astro!</h1>
    <MyReactComponent />
  </body>
</html>
```

默认情况下，你的框架组件将渲染为静态 HTML。这对于模板组件而言非常有用，它不需要交互和避免分发没用的 JavaScript 给用户。



#### 多框架带来的ts问题

[解决方法](https://docs.astro.build/zh-cn/guides/typescript/#%E5%90%8C%E6%97%B6%E4%BD%BF%E7%94%A8%E5%A4%9A%E4%B8%AA-jsx-%E6%A1%86%E6%9E%B6%E6%89%80%E5%B8%A6%E6%9D%A5%E7%9A%84%E7%B1%BB%E5%9E%8B%E9%94%99%E8%AF%AF)



#### 激活组件

针对可交互的组件，需要靠指令来激活

### `client:only`

[段落标题 client:only](https://docs.astro.build/zh-cn/reference/directives-reference/#clientonly)

`client:only={string}` **跳过** HTML 服务端渲染，只在客户端进行渲染。它的作用类似于 `client:load`，它在页面加载时立即加载、渲染和润色组件。

**你必须正确传递组件所用框架！** 因为 Astro 不会在构建过程中/在服务器上运行该组件，Astro 不知道你的组件使用什么框架，除非你明确告诉它。

```jsx
<SomeReactComponent client:only="react" />
<SomePreactComponent client:only="preact" />
<SomeSvelteComponent client:only="svelte" />
<SomeVueComponent client:only="vue" />
<SomeSolidComponent client:only="solid-js" />
```
