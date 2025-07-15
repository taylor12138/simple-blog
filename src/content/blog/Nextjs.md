---
author: Hello
categories: 前端
title: Nextjs
description: '框架相关知识'
---

## 1.Next.js开端

英文官网：https://nextjs.org/

中文官网：https://www.nextjs.cn/docs/getting-started

搭建项目

```shell
yarn create next-app
```

或者

```shell
npx create-next-app@latest
```

使用Nextjs搭建SSR优点：

1. 搭建轻松
2. 自带数据同步 SSR
3. 丰富插件
4. 灵活配置





## 2.路由

next.js是约定式路由直接在pages文件夹下对应的路由页面

比如我要新建一个detail页面（`localhost:3000/detial`）

![](/Nextjs/router.png)

#### 路由跳转

**Link方式**

```jsx
import Link from "next/link";
export default function Home() {
  return (
      <Link href="/detail/1">
        <a>Go to pages/detail/1</a>
      </Link>
    </div>
  );
}
```

连接到动态路径：

```jsx
//方法一
<Link href={`/blog/${encodeURIComponent(post.slug)}`}>
    <a>{post.title}</a>
</Link>
//方法二
<Link
    href={{
        pathname: '/blog/[slug]',
            query: { slug: post.slug },
    }}
    >
    <a>{post.title}</a>
</Link>
```

**客户端导航**

该[`Link`](https://www.nextjs.cn/docs/api-reference/next/link)组件支持在同一个 Next.js 应用程序中的两个页面之间进行**客户端导航。**

客户端导航意味着*使用 JavaScript*进行页面转换，这比浏览器完成的默认导航要快。

这是您可以验证的简单方法：

- 使用浏览器的开发者工具将`background`CSS 属性更改`<html>`为`yellow`。
- 单击链接可在两个页面之间来回切换。
- 您会看到黄色背景在页面转换之间持续存在。





**编程式导航**

使用一个useRouter，和React中的useHistory用起来差不多

要访问 React 组件中的[`router`对象](https://www.nextjs.cn/docs/api-reference/next/router#router-object)，您可以使用[`useRouter`](https://www.nextjs.cn/docs/api-reference/next/router#userouter)或[`withRouter`](https://www.nextjs.cn/docs/api-reference/next/router#withrouter)。

一般来说，我们建议使用[`useRouter`](https://www.nextjs.cn/docs/api-reference/next/router#userouter).

```jsx
import React from "react";
import { useRouter } from "next/router";

export default function Detial() {
  const router = useRouter();
  const linkToHome = () => {
    router.push("/");
  };
  return (
    <div>
      <button onClick={linkToHome}>点击跳转到首页</button>
    </div>
  );
}
```



#### 嵌套路由

对于多级嵌套路由，可以直接在该路由文件夹下

（二级路由）：直接写路由名 + js文件

（嵌套多级路由）：新建文件夹，文件夹名为路由名，再新建`index.js`文件

![](/Nextjs/router-more.jpg)

- `pages/blog/first-post.js`→`/blog/first-post`
- `pages/dashboard/settings/username.js`→`/dashboard/settings/username`



#### 动态路由

要匹配动态段，您可以使用括号语法。这允许您匹配命名参数。

- `pages/blog/[slug].js` → `/blog/:slug` (`/blog/hello-world`)
- `pages/[username]/settings.js` → `/:username/settings` (`/foo/settings`)
- `pages/post/[...all].js` → `/post/*` (`/post/2020/id/title`)



#### 路由传参

nextjs传参方式一共两种：

**动态路由传参**

对于params传参方式，新建文件 `[自定义参数名].js`（可见上图），此时通过url路由地址导向，就可以获取对应的params参数（依然是通过useRouter的hook）

```jsx
const id = 1
// Link as内是参数
import Link from 'next/link';
<Link href={`/details/${id}`><a>跳转</a></Link>

// router
import { useRouter } from 'next/router';
const router = useRouter();
router.push(`/details/${id}`);

// details接收参数ID
import { useRouter } from 'next/router';
export default function details() {
  const router = useRouter();
  const { id }: any = router.query;
  console.log(id);
}
```



**query传参**

```jsx
// Link
import Link from 'next/link';
<Link href={{ pathname: '/b', query: { name: '张三', age: '18', work: '前端开发' } }}><a>跳转</a></Link>

// router
import { useRouter } from 'next/router';
const router = useRouter();
router.push('/first?name=张思学&age=18&work=前端开发');

// 页面接收参数
import { useRouter } from 'next/router';
const router = useRouter();
const { name, age, work }: any = router.query;
console.log(name, age, work);
```



#### 接收后端服务

对于后端数据接收，要在`pages/api`文件夹下进行对后端接口的数据获取（作为node中间件）

官方：`pages/api` 目录下的任何文件都将作为 API 端点映射到 `/api/*`，而不是 `page`。这些文件只会增加服务端文件包的体积，而不会增加客户端文件包的大小。

此时最好设定与pages页面一一对应的文件命名格式进行获取，比如对于 `detail/[id].js`页面对应的就是 api文件夹下 `detail/[id].js`的api

![](/Nextjs/api.jpg)

```js
//api/detail/[id].js
const fn = (req, res) => {
  res.status(200).json({ name: "Allen" });
};
export default fn;
```

```js
//detail/[id].js
import React, { useEffect } from "react";
import { useRouter } from "next/router";

export default function Detial() {
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {
    id &&
      fetch(`/api/detail/${id}`)
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
        });
  }, [id]);

  return <div>Detialid: {id}</div>;
}
```

当然，我们也可以尝试在http://localhost:3000/api/hello访问它。你应该看到`{"text":"Hello"}`。注意：

- `req`是[http.IncomingMessage的一个实例，以及一些您可以](https://nodejs.org/api/http.html#http_class_http_incomingmessage)[在此处](https://www.nextjs.cn/docs/api-routes/api-middlewares)看到的预构建中间件。
- `res`是[http.ServerResponse](https://nodejs.org/api/http.html#http_class_http_serverresponse)的一个实例，以及一些您可以[在此处](https://www.nextjs.cn/docs/api-routes/response-helpers)看到的帮助函数。



#### [捕获所有后端服务API 的路由](https://www.nextjs.cn/docs/api-routes/dynamic-api-routes#捕获所有-api-的路由)

通过在方括号内添加三个英文句点 (`...`) 即可将 API 路由扩展为能够捕获所有路径的路由。例如：

- `pages/api/post/[...slug].js` 匹配 `/api/post/a`，也匹配 `/api/post/a/b`、`/api/post/a/b/c` 等。

> **注意**：`slug` 并不是必须使用的，你也可以使用 `[...param]`



#### 路由捕获顺序和规则

- 预定义的 API 路由优先于动态 API 路由，而动态 API 路由优先于捕获所有 API 的路由。看下面的例子：
  - `pages/api/post/create.js` - 将匹配 `/api/post/create`
  - `pages/api/post/[pid].js` - 将匹配 `/api/post/1`, `/api/post/abc` 等，但不匹配 `/api/post/create`
  - `pages/api/post/[...slug].js` - 将匹配 `/api/post/1/2`, `/api/post/a/b/c` 等，但不匹配 `/api/post/create`、`/api/post/abc`



#### 浅路由

浅路由允许您更改 URL 而无需再次运行数据获取方法，包括[`getServerSideProps`](https://www.nextjs.cn/docs/basic-features/data-fetching#getserversideprops-server-side-rendering)、[`getStaticProps`](https://www.nextjs.cn/docs/basic-features/data-fetching#getstaticprops-static-generation)和[`getInitialProps`](https://www.nextjs.cn/docs/api-reference/data-fetching/getInitialProps).

您将收到更新`pathname`的和`query`通过[`router`对象](https://www.nextjs.cn/docs/api-reference/next/router#router-object)（由[`useRouter`](https://www.nextjs.cn/docs/api-reference/next/router#userouter)or添加[`withRouter`](https://www.nextjs.cn/docs/api-reference/next/router#withrouter)），而不会丢失状态。

要启用浅层路由，请将`shallow`选项设置为`true`。

可以看官方文档，写的够明白了：https://www.nextjs.cn/docs/routing/shallow-routing



#### 路由事件

可以看成vue的路由守卫（路由生命周期函数）

1. `routeChangeStart`    路由开始发生变化
2.  `routeChangeComplete`  路由发生变化之后
3. `beforeHistoryChange`  history模式下路由发生变化
4. `routeChangeError`    路有变化发生错误的时候
5. `hashChangeStart`    hash开始发生变化
6. `hashChangeStart`    hash开始发生变化

> 注意：这里需要把路由事件监听放在useEffect里，每次卸载页面的时候把监听也卸载掉，否则每次页面跳转都会创建新的事件监听，会越来越多

```jsx
import React, { useEffect } from "react";
import { Router } from "next/dist/client/router";
  useEffect(() => {
    Router.events.on("routeChangeStart", (...args) => {
      console.log("routeChangeStart参数", ...args);
    });
  }, []);
  return <div>DEtial</div>;
}
```



## 3.服务端渲染

#### getInitialProps

`getInitialProps`在页面中启用[服务器端渲染](https://www.nextjs.cn/docs/basic-features/pages#server-side-rendering)并允许您进行**初始数据填充**，这意味着发送[页面](https://www.nextjs.cn/docs/basic-features/pages)时已从服务器填充了数据。这对[SEO](https://en.wikipedia.org/wiki/Search_engine_optimization)尤其有用；所以`getInitialProps`用于异步获取一些数据，然后填充`props`.

个人感觉有点react-redux中使用connect方法传入ui组件第一个参数`mapDispatchToProps`的味道在里面

**推荐： [`getStaticProps`](https://www.nextjs.cn/docs/basic-features/data-fetching#getstaticprops-static-generation) 或 [`getServerSideProps`](https://www.nextjs.cn/docs/basic-features/data-fetching#getserversideprops-server-side-rendering)**。

如果你使用的是 Next.js 9.3 或更高版本，我们建议你使用 `getStaticProps` 或 `getServerSideProps` 来替代 `getInitialProps`。

```jsx
function Page({ stars }) {
  return <div>Next stars: {stars}</div>
}

Page.getInitialProps = async (ctx) => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const json = await res.json()
  return { stars: json.stargazers_count }
}

export default Page
```



#### SSG（getStaticProps）

对于每个用户基本一致的静态页面，可以使用SSG（构建build时渲染页面）

优点：这种方式可以解决白屏问题、SEO 问题

缺点：所有用户看到的都是同一个页面，无法生成用户相关内容

效果：如果动态内容与用户无关，那么可以提前静态化，通过 getStaticProps 可以获取数据**静态内容+数据(本地获取)** 就得到了完整的页面，代替了之前的 **静态内容+动态内容(AJAX 获取)**

实际用例：

- 营销页面
- 博客文章和个人简历
- 电商产品列表
- 帮助和文档

实现：通过`getStaticProps` 获取 数据

```js
import {getPosts} from '../../lib/posts';
export default function Home(props) {
  console.log(props);
  return (
    <div className={styles.container} />
  );
}

export const getStaticProps = async (context) => {
  const posts = await getPosts();
  return {
    props: {
      posts: [{ name: "allen" }, { name: "mikasa" }, { name: "armin" }],
    },
  };
};
/*typescript
export const getStaticProps: GetStaticProps = async (context) => {
  // ...
}
*/
```

静态化的时机

环境

1. 在 **开发环境** ，每次请求都会运行一次 getStaticProps 这是为了方便你修改代码重新运行
2. 在 **生产环境**，getStaticProps 只在 build 是运行一次，这样可以提供一份 HTML 给所有的用户下载

**注意**：您不应该使用[`fetch()`](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)在`getStaticProps`. 相反，直接导入 API 路由中使用的逻辑。您可能需要针对这种方法稍微重构您的代码。

从外部 API 获取很好！



#### getStaticPaths

该方法适用于：每个**页面路径**都依赖于外部数据的情况

而且如果页面具有动态路由（比如 `[id].js`）（[文档](https://www.nextjs.cn/docs/routing/dynamic-routes)）并使用`getStaticProps`它，则需要定义必须在构建时呈现为 HTML 的路径列表。

如果您导出从使用动态路由的页面`async`调用的函数`getStaticPaths`，Next.js 将静态预渲染所有由`getStaticPaths`.

```jsx
import Layout from '../../components/layout'

export default function Component() {
  return <Layout>...</Layout>
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { ... } } // 返回的每个paths数组中每一个元素都是一个对象，且必须有params属性
    ],
    fallback: true, false, or 'blocking' // See the "fallback" section below
  };
}

export async function getStaticProps({ params }) {
  // Fetch necessary data for the blog post using params.id
}
```

然后getStaticPaths的返回值将作为参数传递给getStaticProps

详情可以看官网对path、fallback属性（为加载完成时展示fallback pages）的介绍https://www.nextjs.cn/docs/basic-features/data-fetching#getstaticpaths-static-generation



注意：不要在`getStaticProps` 或者 [`getStaticPaths`](https://www.nextjs.cn/docs/basic-features/data-fetching#getstaticpaths-static-generation)对后端路由服务的api（也就是上方提及到的接收后端服务）发请求，你应该把服务端定死的代码直接写到`getStaticProps` 或者 `getStaticPaths`中，毕竟它们俩只能在服务端跑，这意味着我们可以编写诸如直接数据库查询之类的代码



#### SSR（getServerSideProps）

首屏渲染快，但是拿数据的话还是等到用户发送请求后再去后端拿去数据（请求时渲染页面），生成相应html在返回给客户端

实现：通过`getSeverSideProps` 获取 数据

```js
//服务器响应请求后获取浏览器信息，返回给前端展示
export const getServerSideProps: GetServerSideProps = async (context) => {
  const headers:IncomingHttpHeaders = context.req.headers;
  const browser = headers['user-agent'];
  return {
    props: {
      browser
    }
  };
};
```



参考文章https://zhuanlan.zhihu.com/p/341229054



## nextjs优化

### (1)自身优化

#### 图片优化

```js
import Image from "next/image";
```

对图片的优化：

- 将图片转换为 **渐进式图片**（先显示一个极小的背景图，使用css的filter属性模糊化），等到图片加载完成再替换为真正的图片
- 本地图片没设置宽高也不会有布局偏移问题（本身使用一个SVG带有height和width进行占位，使得周边的布局不会当图片加载出来的时候发生位置偏移）
- 默认加上srcset属性来适配不同的 `devicePixelRatio` （像素比）的屏幕，显示和加载1倍图 or 2倍图
- 默认返回压缩后的图片（type：webp）
- 支持懒加载
- 支持给图片设置优先级

具体细节可以看https://github.com/findxc/blog/issues/68



### (2)开发者定义的优化

#### next异步懒加载

使用懒加载方法：同 《PC&移动端网页特效(JS)》中阐述到的，直接import即可

使用懒加载组件：

```jsx
import React, { useState } from "react";
import dynamic from 'next/dynamic'
const More = dynamic(import('./more'))
export default function Detial() {
  return (
    <div>
      <More></More>
    </div>
  );
}
```



#### 自定义head优化SEO

如果我们想要修改网页元数据，我们可以使用 `Head` 组件

title:

一般有两种方法：每个页面都定义一个title，或者全局title

```jsx
import React from "react";
import Head from "next/head";

export default function Header() {
  return (
    <div>
      <Head>
        <title>撒撒给，Allen</title>
        <meta charSet="utf-8"></meta>
      </Head>
    </div>
  );
}
```

全局的话就是自己封装MyHead组件，然后再每个组件内部引用即可