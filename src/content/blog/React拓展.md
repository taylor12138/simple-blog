---
author: Hello
categories: 前端
pubDate: 2022-03-31
title: React拓展
description: 'React相关知识'
---

## 拓展

## GraphQL

GraphQL是Facebook开发的一种查询语言，并于2015年发布，它是REST API的替代品

它既是一种用于API的查询语言，也是一个满足你数据查询运行时，GraphQL对你的API的数据提供了一套易于理解的完整描述，使得客户端能够准确获取他需要的数据，且没有任何冗余，也让API更容易随着时间推移而演进

中文网https://graphql.cn/

特点：

1. 请求需要的数据，不多不少
2. 获取多个资源，只用一个请求
3. 描述所有可能类型的系统，根据需求平滑推进，添加或隐藏字段

但是需要后端也改造成GreaphQL的方式





## DvaJS

dva 首先是一个基于 [redux](https://github.com/reduxjs/redux) 和 [redux-saga](https://github.com/redux-saga/redux-saga) 的数据流方案，然后为了简化开发体验，dva 还额外内置了 [react-router](https://github.com/ReactTraining/react-router) 和 [fetch](https://github.com/github/fetch)，所以也可以理解为一个轻量级的应用框架。（用起来怎么和React几乎一样，但是里面的部分功能和vue的vuex一样。）

数据流图

![](/simple-blog/React扩展/dvajs.jpg)

（不过现在好像不更新了）

![](/simple-blog/React扩展/dva2.png)



## Umi

[umi](https://v3.umijs.org/zh-CN/docs)

是一个可插拔的react应用框架(集成多个大多数都所需的依赖！)，它以路由为基础，支持类next.js的约定式路由，以及各种进阶的路由功能，并以此进行功能拓展，比如支持路由级的按需加载。umi在约定是路由的功能会更像nuxt.js一点

![](/simple-blog/React扩展/umi.jpg)

let us use:

```shell
mkdir myapp && cd myapp
npx @umijs/create-umi-app
npm i
```

![](/simple-blog/React扩展/umidir.jpg)

mock：放假数据测试用

src：

- umi文件夹：技术内敛，我们不需要关注它
- page文件夹，放我们的功能页面，再不配置路由的情况下（注释掉.umiorc.ts中routes选项），在该文件夹下直接新建xx.tsx文件，将自动成为路由，`index.tsx`文件为首页（对应 `"/"` 路由），`404.tsx`为找不到跳转的页面
  - 嵌套路由则新建文件夹（文件夹名为一级路由名），底下的 `_layout.tsx` 为一级路由组件页面，并且在里面放置 `props.children`用于作为二级路由的插槽位置 ，新建 `nowplay.tsx`，则 nowplay为二级路由名

![](/simple-blog/React扩展/route.jpg)

#### 它的声明式导航

![](/simple-blog/React扩展/route2.jpg)

```tsx
// layouts/index.tsx
import React from 'react';
import {NavLink} from 'umi'
import style from './index.less'
export default function(props:any) {
    if (props.location.pathname.includes('/detail')) {
        return <div>{ props.children }</div>
    }
    return (
        <div>
            <ul>
                <li>
                    <NavLink to="/film" activeClassName={style.active}>film</NavLink>
                </li>
                <li>
                    <NavLink to="/cinema" activeClassName={style.active}>cinema</NavLink>
                </li>
                <li>
                    <NavLink to="/center" activeClassName={style.active}>center</NavLink>
                </li>
            </ul>
            { props.children }
        </div>
    );
}
```



#### 目录结构

- .umirc.ts
  - 配置文件，包含 umi 内置功能和插件的配置。
- `/src` 目录
  - .umi 目录
  - 临时文件目录，比如入口文件、路由等，都会被临时生成到这里。**不要提交 .umi 目录到 git 仓库，他们会在 umi dev 和 umi build 时被删除并重新生成。**



#### 为什么不是？

##### [create-react-app](https://github.com/facebook/create-react-app)

create-react-app 是基于 webpack 的打包层方案，包含 build、dev、lint 等，他在打包层把体验做到了极致，但是不包含路由，不是框架，也不支持配置。所以，如果大家想基于他修改部分配置，或者希望在打包层之外也做技术收敛时，就会遇到困难。

##### [next.js](https://github.com/zeit/next.js)

next.js 是个很好的选择，Umi 很多功能是参考 next.js 做的。要说有哪些地方不如 Umi，我觉得可能是不够贴近业务，不够接地气。比如 antd、dva 的深度整合，比如国际化、权限、数据流、配置式路由、补丁方案、自动化 external 方面等等一线开发者才会遇到的问题。



## Recoil

目前redux存在的问题：

- 陡峭的学习曲线
- 太多的样板代码
- 重新组织你的项目
- 缺乏并发模式支持
- 非反应性方法
- 难以实现代码拆分
- 没有内置的异步支持

此时我们需要一个更加轻巧方便的状态库解决它：Recoil 是 React 的状态管理库

它的底层逻辑还是一个 context 加上各种状态更新

优点就是十分方便，我们可以像使用useState一样使用它，适应现在的简洁式编码风气，而且没有redux那种可能会影响其他相关组件重新渲染问题；缺点是SSR场景的状态共享好像有点问题

```shell
npm install recoil
```

```shell
yarn add recoil
```

导包：

```js
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
```



首先要包裹住最外层的App组件

```js
import React from 'react';

function App() {
  return (
    <RecoilRoot>
      <CharacterCounter />
    </RecoilRoot>
  );
}
```

一个 **atom** 代表一个**状态**。Atom 可在任意组件中进行读写。读取 atom 值的组件隐式订阅了该 atom，因此任何 atom 的更新都将致使使用对应 atom 的组件重新渲染：

```js
const textState = atom({
  key: 'textState', // unique ID (with respect to other atoms/selectors)
  default: '', // default value (aka initial value)
});
```

使用起来和useState一样，很方便，免除了redux写法的烦恼

```js
const [text, setText] = useRecoilState(textState);
```

如果对于atom 状态只读（在组件中直接像状态一样去使用），或者只写，可以使用

```js
const todoList = useRecoilValue(todoListState);
```

```js
const setTodoList = useSetRecoilState(todoListState);

const addItem = () => {
    setTodoList((oldTodoList) => [
        ...oldTodoList,
        {
            id: getId(),
            text: inputValue,
            isComplete: false,
        },
    ]);
    setInputValue('');
};
```



**selector**

在文档中还有一个selector，有点类似于计算属性，它还有依赖项，使用方法可以在官网查看



## react-infinite-scroll-component

react提供的无限滚动方案，[官方文档](https://github.com/ankeetmaini/react-infinite-scroll-component)

usage

```jsx
<InfiniteScroll
  dataLength={items.length} //This is important field to render the next data
  next={fetchData}
  hasMore={true}
  loader={<h4>Loading...</h4>}
  endMessage={
    <p style={{ textAlign: 'center' }}>
      <b>Yay! You have seen it all</b>
    </p>
  }
  // below props only if you need pull down functionality
  refreshFunction={this.refresh}
  pullDownToRefresh
  pullDownToRefreshThreshold={50}
  pullDownToRefreshContent={
    <h3 style={{ textAlign: 'center' }}>&#8595; Pull down to refresh</h3>
  }
  releaseToRefreshContent={
    <h3 style={{ textAlign: 'center' }}>&#8593; Release to refresh</h3>
  }
>
  {items}
</InfiniteScroll>
```



## React SSR

CSR 模式下，我们把水理解为数据，同样适用于 SSR，只是过程稍复杂些：

1. 服务端渲染：在服务端注入数据，构建出组件树
2. 序列化成 HTML：脱水成人干
3. 客户端渲染：到达客户端后泡水，激活水流，变回活人

类比三体人的生存模式，**乱纪元来临时先脱水成人干（SSR 中的服务端渲染部分），恒纪元到来后再泡水复活（SSR 中的客户端 hydrate 部分）**





参考：https://juejin.cn/post/6901089942580150280
