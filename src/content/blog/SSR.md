---
author: Hello
pubDate: 2023-04-12 
categories: 前端
title: SSR渲染
description: 'SSR渲染相关'
---
## SSR渲染

#### SSR简介

SSR：server side render

当前端为vue、react这种spa应用时，非常不利于SEO，各种路由的跳转也变得复杂，并且在首屏渲染时间上也花费了大量时间。**在整体架构部署上，还需要利用各种web服务（如ngxin），这点很麻烦**

服务端将我们需要的HTML文本组装好，并返回给浏览器，这个HTML文本被浏览器解析之后，**不需要经过 JavaScript 脚本的执行**，即可直接构建出希望的 DOM 树并展示到页面中。这个服务端组装HTML的过程，叫做服务端渲染。

SSR优势

- 更利于SEO。
- 更利于首屏渲染，即白屏时长更短



SSR劣势

- 相对于仅仅需要提供静态文件的服务器，SSR中使用的渲染程序自然会占用更多的CPU和内存资源。

- 一些常用的浏览器API可能无法正常使用，比如`window`、`docment`和`alert`等，如果使用的话需要对运行的环境加以判断。

- 开发调试会有一些麻烦，因为涉及了浏览器及服务器，对于SPA的一些组件的生命周期的管理会变得复杂。

- 可能会由于某些因素导致服务器端渲染的结果与浏览器端的结果不一致。
- FID性能可能会有问题：[这里](https://keenwon.com/better-react-ssr/)有介绍说明

也可以看这里 https://github.com/reactwg/react-18/discussions/37


所以一般来说为了解决浏览器API交互问题，因此需要在浏览器中执行 CSR 的 JS 脚本，完成事件绑定，让页面拥有交互的能力，这个过程被称作`hydrate`(翻译为`注水`或者`激活`)。同时，像这样服务端渲染 + 客户端 hydrate 的应用也被称为`同构应用`。



#### 遥望历史之重新认识服务端渲染

现在的服务端渲染和过去的服务端渲染完全是两码事

1. **Web1.0**时期，在没有AJAX的时候，也就是web1.0时代，几乎所有应用都是服务端渲染，浏览器接收请求后，到数据库查询数据，将数据丢到后端的组件模板（php、asp、jsp等）中，并渲染成HTML片段，然后浏览器拿到的是一个完整的HTML，然后渲染页面，过程没有任何JavaScript代码的参与。。

   - 这样做的缺点是：每一次更新都要请求后，让服务端查一次数据库，重新组装html返回

   - 代码混杂，难以维护（jsp、php）

     ![](/simple-blog/Nodejs/SSR3.jpg)

2. 前后端分离时代，SPA模式出现，前端团队接管页面渲染，后端团队仅负责数据查询和API

   ![](/simple-blog/Nodejs/SSR4.jpg)

3. 随着SPA的发展，弊端也逐渐暴露：JS脚本的臃肿，SEO的退化

   此时后端渲染再次出现，但不同的是连接口导向 

   浏览器 <-> 前端服务器 <-> 后端服务器 

   其实也可以看作加入了nodejs中间件，这个中间件作为伪“服务端”，由这个前端服务器组装一个携带了具体数据的HTML文本，并且返回给浏览器。

   但是！值得一提的是，**浏览器加载并执行 JavaScript 脚本**，（这个是之前服务端渲染不会的做）给页面上的元素绑定事件，让页面变得可交互，当用户与浏览器页面进行交互，如跳转到下一个页面时，浏览器会执行 JavaScript 脚本，向后端服务器请求数据，获取完数据之后再次执行 JavaScript 代码动态渲染页面。

   ![](/simple-blog/Nodejs/SSR5.jpg)

   

使用了服务端渲染之后，你还要实现同构！即一份代码，既可以客户端渲染，也可以服务端渲染。

因为这时你要用到两种页面渲染：

- 前端服务器通过请求后端服务器获取数据并组装HTML返回给浏览器，浏览器直接解析HTML后渲染页面（首屏渲染）
- 浏览器完成事件绑定，在交互过程中，请求新的数据并动态更新渲染页面（交互渲染）



#### 2大步

此时我们可以分为2大步

1.构建时

- 将代码生成commonjs格式产物，让前端服务器（node）可以正常加载（随着nodejs对esm的支持成熟程度增加，也在不断变得友好）

  ![](/simple-blog/Nodejs/ssr10.png)

- 移除代码样式引入 

- 依赖外部化(external)。对于某些第三方依赖我们并不需要使用构建后的版本，而是直接从 `node_modules` 中读取，比如 `react-dom`，这样在 `SSR 构建`的过程中将不会构建这些依赖，从而极大程度上加速 SSR 的构建。

2.运行时

- 从SSR入口记载模块
- 将数据收屏需要渲染的数据提前请求（内网请求）
- 渲染组件 -> html
- 拼接html 字符串





## SSG

但是一般来说，首屏一般不会对内容产生什么修改，但是数以万计的访客打开网站时候，都要进行数据库查询吗？这无疑会导致数据库后端的重复开销，而解决问题的方法是：

（SSG）将后端渲染的HTML缓存，这份缓存作为静态内容，也更容易被推送至CDN，实现全国甚至全球加速；即使需要修改内容，也可以重新生成静态内容，再更新cdn内容的方式轻松应对

你可以理解为构建时请求数据 + 填入
### SSG 的工作原理

1. **构建时渲染**: 在 `npm run build` 时，框架会执行所有页面的渲染逻辑
2. **数据获取**: 在构建时获取数据（API 调用、文件读取等）
3. **HTML 生成**: 将组件和数据结合生成静态 HTML 文件
4. **静态资源**: 生成的文件可以部署到 CDN 或静态文件服务器


缺点：所有用户看到的都是同一个页面，无法生成用户相关内容，并且对于百万级、千万级、亿级页面的大型网站而言，一旦有数据改动，要进行一次全部页面的渲染，需要的时间可能是按小时甚至按天计的，这是不可接受的。


### SSG vs SSR 的区别

| 特性        | SSG (Static Site Generation)  | SSR (Server-Side Rendering) |
| --------- | ----------------------------- | --------------------------- |
| **渲染时机**  | 构建时 (Build Time) 本地 run build | 请求时 (Request Time) 在用户访问网页  |
| **性能**    | 极快，直接返回静态文件                   | 每次请求都需要服务器渲染                |
| **服务器负载** | 几乎无负载                         | 每个请求都消耗服务器资源                |
| **数据实时性** | 构建时的数据，相对静态                   | 每次请求获取最新数据                  |
| **部署复杂度** | 简单，可部署到 CDN                   | 需要 Node.js 服务器              |
| **适用场景**  | 博客、文档、营销页面                    | 个性化内容、实时数据                  |

### React 的 SSG 使用

 React 18 之前

主要使用 `renderToString`：

```javascript
import { renderToString } from 'react-dom/server';  
  
// SSG 构建时  
const html = renderToString(<App />);
```


 React 18 及之后

引入了流式渲染，使用 `renderToPipeableStream`：
```javascript
import { renderToPipeableStream } from 'react-dom/server';  
  
// 更现代的流式渲染  
const { pipe } = renderToPipeableStream(<App />, {  
  onShellReady() {  
    // 开始流式传输  
  }  
});


```


 在不同框架中的应用

 Next.js 中的实现

Next.js 在底层就是用这些 API：

``` javascript
// Next.js 内部简化逻辑  
function generateStaticHTML(Component, props) {  
  // React 18+  
  if (useStreaming) {  
    return renderToPipeableStream(<Component {...props} />);  
  }  
  // React 17-  
  return renderToString(<Component {...props} />);  
}
```

 Gatsby 中的实现

Gatsby 也类似：

```javascript
// Gatsby 构建时  
const html = renderToString(  
  <StaticRouter location={pathname}>  
    <App />  
  </StaticRouter>  
);
```


 两个 API 的区别

`renderToString`

- **同步渲染**：一次性渲染完整个组件树
- **返回完整 HTML 字符串**
- **适用场景**：简单的 SSG，小型应用

```javascript

const html = renderToString(<App />);  
// 返回: "<div>完整的HTML字符串</div>"
```

 `renderToPipeableStream`

- **流式渲染**：可以分块渲染和传输
- **支持 Suspense**：可以处理异步组件
- **更好的性能**：用户可以更早看到内容

```javascript
const { pipe } = renderToPipeableStream(<App />, {  
  onShellReady() {  
    // 页面框架准备好了，可以开始传输  
    pipe(response);  
  },  
  onAllReady() {  
    // 所有内容都准备好了  
  }  
});
```

### 水合（Hydration）是什么？

水合是指**让静态HTML变成可交互的React应用**的过程(在浏览器内)。

 过程：

1. **服务器**：生成静态HTML（包含完整的DOM结构）
2. **浏览器**：接收并显示静态HTML（用户能看到内容，但不能交互）
3. **JavaScript加载**：React bundle.js 下载完成
4. **水合**：React "接管"现有的DOM，绑定事件处理器

 代码示例：
```javascript
// 服务器端生成的HTML  
<button>点击我</button>  
  
// 浏览器端水合  
import { hydrateRoot } from 'react-dom/client';  
  
// React "水合"现有DOM，让按钮可以响应点击  
hydrateRoot(document.getElementById('root'), <App />);
```

 SSG 需要水合吗？
**需要！** SSG 和 SSR 都需要水合，因为：

 SSG 的完整流程：
构建时: React组件 → 静态HTML文件  
用户访问:   
  1. 加载静态HTML（立即可见）  
  2. 加载JavaScript  
  3. 水合（变成可交互的React应用）

 实际例子：
```javascript
// 构建时生成的HTML  
<div>  
  <h1>欢迎</h1>  
  <button>登录</button>  <!-- 此时不能点击 -->  
</div>  
```

```javascript
// 水合后  
<div>  
  <h1>欢迎</h1>  
  <button onClick={handleLogin}>登录</button>  <!-- 现在可以点击了 -->  
</div>


```

 为什么需要水合？
因为静态HTML只是"外壳"：
- ✅ 有完整的DOM结构
- ✅ 有样式和内容
- ❌ 没有事件处理器
- ❌ 没有状态管理
- ❌ 没有React的响应式更新

水合让静态的"尸体"重新"活"过来，变成完整的React应用。

 水合的好处
1. **首屏快速显示**：用户立即看到内容
2. **SEO友好**：搜索引擎能抓取完整HTML
3. **渐进增强**：即使JS加载失败，用户也能看到基本内容


### SSG demo
src/App.js → 构建工具转换 → {
  服务端版本（用于 renderToString）
  客户端版本（用于 hydrateRoot）
}

```
npm run build 执行时：

1. build.js 运行
   ↓
2. 使用 renderToString 生成静态 HTML
   ↓  
3. 同时生成 client.js 文件
   ↓
4. HTML 文件引用 client.js
   ↓
5. 部署静态文件
```

构建脚本 build.js文件，生成对应静态的html文件
```javascript
const React = require('react');
const { renderToString } = require('react-dom/server');
const fs = require('fs');
const path = require('path');

// 模拟 JSX 转换 - 在真实项目中会用 Babel(App.js babel后的样子)
const App = () => {
  const blogPosts = [
    { id: 1, title: '什么是 SSG？', content: 'SSG 是在构建时生成静态 HTML 的技术...' },
    { id: 2, title: 'React 18 新特性', content: 'React 18 引入了并发渲染...' },
    { id: 3, title: '前端性能优化', content: '性能优化是前端开发的重要话题...' }
  ];

  return React.createElement('div', { 
    style: { padding: '20px', fontFamily: 'Arial, sans-serif' } 
  }, [
    React.createElement('h1', { key: 'title' }, 'SSG Demo - 静态站点生成演示'),
    
    React.createElement('div', {
      key: 'blog-section',
      style: { background: '#f0f0f0', padding: '15px', marginBottom: '20px' }
    }, [
      React.createElement('h2', { key: 'blog-title' }, '博客文章列表（静态内容）'),
      ...blogPosts.map(post => 
        React.createElement('div', {
          key: post.id,
          style: { marginBottom: '10px', cursor: 'pointer' }
        }, [
          React.createElement('h3', {
            key: `title-${post.id}`,
            style: { color: '#0066cc', margin: '5px 0' }
          }, post.title)
        ])
      )
    ]),

    React.createElement('div', {
      key: 'counter-section',
      style: { background: '#e8f4fd', padding: '15px', marginBottom: '20px' }
    }, [
      React.createElement('h2', { key: 'counter-title' }, '交互式计数器（需要水合）'),
      React.createElement('p', { key: 'counter-display' }, [
        '当前计数: ',
        React.createElement('strong', { key: 'count' }, '0')
      ]),
      React.createElement('button', {
        key: 'inc-btn',
        style: { padding: '8px 16px', marginRight: '10px' }
      }, '增加'),
      React.createElement('button', {
        key: 'dec-btn',
        style: { padding: '8px 16px' }
      }, '减少'),
      React.createElement('p', {
        key: 'note',
        style: { fontSize: '12px', color: '#666' }
      }, '注意：如果 JavaScript 未加载，这些按钮不会工作')
    ]),

    React.createElement('footer', {
      key: 'footer',
      style: { marginTop: '40px', fontSize: '12px', color: '#666' }
    }, [
      React.createElement('p', { key: 'footer-title' }, '这个页面演示了 SSG 的工作原理：'),
      React.createElement('ul', { key: 'footer-list' }, [
        React.createElement('li', { key: 'li1' }, '静态内容在构建时就生成到 HTML 中'),
        React.createElement('li', { key: 'li2' }, '交互功能需要 JavaScript 加载后水合才能工作'),
        React.createElement('li', { key: 'li3' }, '用户能立即看到内容，然后页面变得可交互')
      ])
    ])
  ]);
};

// 构建时执行：生成静态 HTML
function buildStaticSite() {
  console.log('🚀 开始构建静态站点...');
  
  // 1. 使用 renderToString 将 React 组件渲染为 HTML 字符串
  const appHTML = renderToString(React.createElement(App));
  
  // 2. 创建完整的 HTML 文档
  const fullHTML = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SSG Demo</title>
  <style>
    body { margin: 0; }
    .loading { display: none; }
  </style>
</head>
<body>
  <div id="root">${appHTML}</div>
  
  <!-- 水合脚本 -->
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="client.js"></script>
  
  <script>
    console.log('📄 静态 HTML 已加载');
    console.log('⏳ 等待 JavaScript 加载和水合...');
  </script>
</body>
</html>`;

  // 3. 确保输出目录存在
  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // 4. 写入静态 HTML 文件
  fs.writeFileSync(path.join(distDir, 'index.html'), fullHTML);
  
  console.log('✅ 静态 HTML 生成完成！');
  console.log('📁 文件位置: dist/index.html');
  console.log('🌐 运行 npm run serve 来查看结果');
}

// 执行构建
buildStaticSite();

```
npm run build 之后 生成一个完整的html文件

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SSG Demo</title>
  <style>
    body { margin: 0; }
    .loading { display: none; }
  </style>
</head>
<body>
  <div id="root"><div style="padding:20px;font-family:Arial, sans-serif"><h1>SSG Demo - 静态站点生成演示</h1><div style="background:#f0f0f0;padding:15px;margin-bottom:20px"><h2>博客文章列表（静态内容）</h2><div style="margin-bottom:10px;cursor:pointer"><h3 style="color:#0066cc;margin:5px 0">什么是 SSG？</h3></div><div style="margin-bottom:10px;cursor:pointer"><h3 style="color:#0066cc;margin:5px 0">React 18 新特性</h3></div><div style="margin-bottom:10px;cursor:pointer"><h3 style="color:#0066cc;margin:5px 0">前端性能优化</h3></div></div><div style="background:#e8f4fd;padding:15px;margin-bottom:20px"><h2>交互式计数器（需要水合）</h2><p>当前计数: <strong>0</strong></p><button style="padding:8px 16px;margin-right:10px">增加</button><button style="padding:8px 16px">减少</button><p style="font-size:12px;color:#666">注意：如果 JavaScript 未加载，这些按钮不会工作</p></div><footer style="margin-top:40px;font-size:12px;color:#666"><p>这个页面演示了 SSG 的工作原理：</p><ul><li>静态内容在构建时就生成到 HTML 中</li><li>交互功能需要 JavaScript 加载后水合才能工作</li><li>用户能立即看到内容，然后页面变得可交互</li></ul></footer></div></div>
  
  <!-- 水合脚本 -->
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="client.js"></script>
  
  <script>
    console.log('📄 静态 HTML 已加载');
    console.log('⏳ 等待 JavaScript 加载和水合...');
  </script>
</body>
</html>

```
然后是最终生成的前端的 app.js 水合代码 client.js
``` js
// 客户端水合代码
(function() {
    console.log('🔄 开始水合过程...');
  
    // 重新创建 App 组件（与服务端相同的逻辑）
    function App() {
      const [count, setCount] = React.useState(0);
      const [selectedPost, setSelectedPost] = React.useState(null);
  
      const blogPosts = [
        { id: 1, title: '什么是 SSG？', content: 'SSG 是在构建时生成静态 HTML 的技术...' },
        { id: 2, title: 'React 18 新特性', content: 'React 18 引入了并发渲染...' },
        { id: 3, title: '前端性能优化', content: '性能优化是前端开发的重要话题...' }
      ];
  
      return React.createElement('div', { 
        style: { padding: '20px', fontFamily: 'Arial, sans-serif' } 
      }, [
        React.createElement('h1', { key: 'title' }, 'SSG Demo - 静态站点生成演示'),
        
        React.createElement('div', {
          key: 'blog-section',
          style: { background: '#f0f0f0', padding: '15px', marginBottom: '20px' }
        }, [
          React.createElement('h2', { key: 'blog-title' }, '博客文章列表（静态内容）'),
          ...blogPosts.map(post => 
            React.createElement('div', {
              key: post.id,
              style: { marginBottom: '10px', cursor: 'pointer' }
            }, [
              React.createElement('h3', {
                key: `title-${post.id}`,
                style: { color: '#0066cc', margin: '5px 0' },
                onClick: () => setSelectedPost(post)
              }, post.title)
            ])
          )
        ]),
  
        React.createElement('div', {
          key: 'counter-section',
          style: { background: '#e8f4fd', padding: '15px', marginBottom: '20px' }
        }, [
          React.createElement('h2', { key: 'counter-title' }, '交互式计数器（需要水合）'),
          React.createElement('p', { key: 'counter-display' }, [
            '当前计数: ',
            React.createElement('strong', { key: 'count' }, count)
          ]),
          React.createElement('button', {
            key: 'inc-btn',
            style: { padding: '8px 16px', marginRight: '10px' },
            onClick: () => setCount(count + 1)
          }, '增加'),
          React.createElement('button', {
            key: 'dec-btn',
            style: { padding: '8px 16px' },
            onClick: () => setCount(count - 1)
          }, '减少'),
          React.createElement('p', {
            key: 'note',
            style: { fontSize: '12px', color: '#666' }
          }, '注意：如果 JavaScript 未加载，这些按钮不会工作')
        ]),
  
        // 动态内容
        selectedPost && React.createElement('div', {
          key: 'selected-post',
          style: { background: '#fff3cd', padding: '15px' }
        }, [
          React.createElement('h2', { key: 'post-title' }, selectedPost.title),
          React.createElement('p', { key: 'post-content' }, selectedPost.content),
          React.createElement('button', {
            key: 'close-btn',
            onClick: () => setSelectedPost(null)
          }, '关闭')
        ]),
  
        React.createElement('footer', {
          key: 'footer',
          style: { marginTop: '40px', fontSize: '12px', color: '#666' }
        }, [
          React.createElement('p', { key: 'footer-title' }, '这个页面演示了 SSG 的工作原理：'),
          React.createElement('ul', { key: 'footer-list' }, [
            React.createElement('li', { key: 'li1' }, '静态内容在构建时就生成到 HTML 中'),
            React.createElement('li', { key: 'li2' }, '交互功能需要 JavaScript 加载后水合才能工作'),
            React.createElement('li', { key: 'li3' }, '用户能立即看到内容，然后页面变得可交互')
          ])
        ])
      ]);
    }
  
    // 等待 React 加载完成后执行水合
    function hydrate() {
      try {
        const rootElement = document.getElementById('root');
        
        // 使用 React 18 的 hydrateRoot API
        if (ReactDOM.hydrateRoot) {
          console.log('🎯 使用 React 18 hydrateRoot 进行水合');
          ReactDOM.hydrateRoot(rootElement, React.createElement(App));
        } else {
          // 兼容 React 17
          console.log('🎯 使用 React 17 hydrate 进行水合');
          ReactDOM.hydrate(React.createElement(App), rootElement);
        }
        
        console.log('✅ 水合完成！页面现在完全可交互');
        
        // 添加水合完成的视觉提示
        setTimeout(() => {
          const indicator = document.createElement('div');
          indicator.style.cssText = `
            position: fixed; top: 10px; right: 10px; 
            background: #4CAF50; color: white; 
            padding: 8px 12px; border-radius: 4px; 
            font-size: 12px; z-index: 1000;
          `;
          indicator.textContent = '✅ 水合完成';
          document.body.appendChild(indicator);
          
          setTimeout(() => {
            document.body.removeChild(indicator);
          }, 3000);
        }, 100);
        
      } catch (error) {
        console.error('❌ 水合失败:', error);
      }
    }
  
    // 确保 React 库已加载
    if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
      hydrate();
    } else {
      // 等待 React 库加载
      let attempts = 0;
      const checkReact = setInterval(() => {
        attempts++;
        if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
          clearInterval(checkReact);
          hydrate();
        } else if (attempts > 50) {
          clearInterval(checkReact);
          console.error('❌ React 库加载超时');
        }
      }, 100);
    }
  })();
  
```



## Island

SSR 的页面会第一时间呈现给用户，但是只有当 js 加载完毕，执行完毕后，功能才是真正可用的：

- 功能方面：用户看到了但是不能操作
- 性能方面：大量 js 在页面加载完成后集中的解析、执行，FID 必然受到影响

这就是 Progressive Hydration 和 Islands Architecture 要解决的问题。但实际上，某些场景下 SSG + CSR 才是更好的选择。

明白了SSR、CSR两者的优势劣势之后，Islands Architecture 框架的概念在于

- 与客户端渲染（CSR）相当的交互性
- 与服务端渲染（SSR）相媲美的 SEO 优势

你可以理解为客户端负责交互JS（降低 后的JS 体积），服务端负责SSR静态相关的进行渲染，二者结合



Island优点：

1. **性能**：降低客户端 JS 代码的体积。加载的代码，仅包含交互式组件所需的 JS，这比为整个页面重新创建 Virtual DOM，并重新 hydrate 页面上的所有元素所需的 JS 要少得多。较小的 JS 会带来更快的页面加载和交互时间 (TTI)。

> Astro 与使用 Next.js 和 Nuxt.js 创建的文档网站[相比](https://docs.astro.build/docs/en/comparing-astro-vs-other-tools)，JS 代码减少了 83%。[其他用户](https://divriots.com/blog/our-experience-with-astro/)也反馈了使用 Astro 的性能改进。
>
> ![img](https://keenwon.com/assets/image/880e03d0.png)
>
> （图片来自 https://divriots.com/blog/our-experience-with-astro/）

1. **SEO**：由于所有静态内容经过服务端渲染，所以页面对 SEO 场景是友好的
2. **关键内容优先**：用户几乎可以立即获得关键内容（尤其是博客、新闻文章和产品类的页面）。在关键内容逐渐可用后，可交互的次要功能也是必须的。
3. **可访问性**：使用标准静态 HTML 链接导航，有助于提高网站的可访问性（Accessibility）。
4. **基于组件**：该架构具有基于组件的架构的所有优点，如：可重用、可维护。



IsLand缺点：

尽管有这些优势，但该概念仍处于初期阶段。“有限的支持”导致了一些缺点：

1. 开发人员实现 Islands 的唯一选择，是使用少数可用的框架之一，或自己实现架构。将现有站点迁移到 Astro 或 Marko 需要额外的工作量。
2. 除了 Jason 最初的文章外，几乎没有更多的信息。
3. 有一些新框架声称支持 Islands Architecture，因此筛选出适合你的架构会更难。
4. 该架构不适合复杂交互页面，例如可能需要数千个 Islands 的社交应用。





参考

[Islands Architecture](https://keenwon.com/islands-architecture-2/#%E5%8A%A8%E6%80%81%E7%BB%84%E4%BB%B6%E7%9A%84-islands)

[Islands Architecture续](https://keenwon.com/islands-architecture-1/)

[更好的 React SSR](https://keenwon.com/better-react-ssr/)

[彻底理解服务端渲染 - SSR原理](https://github.com/yacan8/blog/issues/30)

[Next.js 的三种渲染方式（BSR、SSG、SSR）](https://zhuanlan.zhihu.com/p/341229054)

[深入浅出vite](https://juejin.cn/book/7050063811973218341/section/7066612265536978981?enter_from=course_center&utm_source=course_center)

