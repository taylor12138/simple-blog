---
author: Hello
categories: 前端
pubDate: 2023-06-13
title: React-Router
description: '框架相关'
---

## React路由

React和Vue一样，都是采取单页面富应用的方式配置网页（SPA），即单个页面通过路由的切换，展示不同的数据信息，

而且改变url，依然是页面不发生整体刷新（只做页面的局部刷新），对于if else、switch不同的地方在于，他们只转变组件，但是url路径没发生变化，而且他们无法定位到上一次浏览的页面，要重新在首页新打开

React-router有三种实现方式，分别对应三种平台 

1.web 

2.native 

3.anwhere

分别对应

1. react-router-dom : 具体实现浏览器相关的路由监听和跳转
2. react-router-native : 具体实现RN相关的路由监听和跳转
3. react-router : 核心逻辑处理，提供一些公用的基类

在实际使用时，我们一般不需要引用react-router，而是直接用react-router-dom就行，因为它自已会去引用react-router。下面我们在项目里面引入react-router-dom。



## 针对Web的路由

针对Web，我们使用的是**`react-router-dom`**，当前讲述的是react-router-dom@5，6.x版本截止到2022年2月份为止仍可以在issue上看到许多bug

- react的一个插件库
- 专门用来实现一个SPA应用
- 基于react的项目基本会用到这个库

脚手架并没有自动帮你下载 `react-router-dom`

```shell
npm i react-router-dom@5
```

首先需要包裹路由，让单页面的所有组件使用统一路由，老师推荐的方式是直接在包裹在渲染APP组件那一块



#### 路由类型

在 v6.4 中，引入了支持新数据 API 的新路由器：

- [`createBrowserRouter`](https://reactrouter.com/en/main/routers/create-browser-router)
- [`createMemoryRouter`](https://reactrouter.com/en/main/routers/create-memory-router)
- [`createHashRouter`](https://reactrouter.com/en/main/routers/create-hash-router)
- [`createStaticRouter`](https://reactrouter.com/en/main/routers/create-static-router)

The following routers do not support the data APIs:
除此之外的路由器，都不支持数据 API：



**`BrowserRouter` & `HashRouter`**

- `BrowserRouter`
  - 使用H5的history API，不兼容IE9以下版本；`HashRouter`使用URL的哈希值
  - 刷新后state参数能得以保存



- `HashRouter` ：

  - 路径带 #

  - `HashRouter`可以解决一些关于路径问题（可以看路由嵌套小节的**路径坑**部分）

  - 可能不太支持ssr

    > while React application may be a widget that maintains its state in URL like *example.com/server/side/route#/react/route*. Some page that contains React application is served on server side for */server/side/route*, then on client side React router renders a component that it was configured to render for */react/route*, similarly to previous scenario.

  

```jsx
import { BrowserRouter } from 'react-router-dom'
//index.js
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>, document.querySelector('#root'))
```

在新建一个router文件，在其中的新建的index.js中引入 + 使用，之后再把这个路由组之间放到app组件即可

```jsx
import React from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import Home from '@/views/home'
import List from '@/views/list'

export default function Router() {
  return (
    <div>
      <BrowserRouter>
        <Route path="/home" component={Home}></Route>
        <Route path="/list" component={List}></Route>
      </BrowserRouter>
    </div>
  )
}
```

在Vue中是使用 `<router-link>`定向路由，而这里则是

```jsx
<Link to="/about">About</Link>
<Link to="/home">Home</Link>
```



#### Link

**NavLink**

如果想要使得link标签点击完后有高亮效果，可以引入 + 使用 `<NavLink>`，实际上内部还是 `<link>`，只是你点击了哪一个 `Link`，就会自动给该 `Link`添加一个 样式，类名为**active**，当然也可以定义类名（使用activeClassName），自定义link标签点击后的样式

（在Vue中是通过定义Router实例LinkActiveClass属性进行自定义类名的）

```jsx
<NavLink activeClassName="自定义类名" to="/home">Home</NavLink>
```



**Link的其他属性的补充**

默认push方式进入路由，可以替换成replace：`replace={true}`，或者直接

```jsx
<Link replace to="/home">Home</Link>
```



**插槽**

使用上述 `NavLink`、`Link` 方法来写路由链接时，有许多冗余的地方，比如多个`NavLink`使用相同类名、active类名时，有很高的重复性

```jsx
<NavLink activeClassName="自定义类名" to="/home">Home</NavLink>
<NavLink activeClassName="自定义类名" to="/about">About</NavLink>
<NavLink activeClassName="自定义类名" to="/other">Other</NavLink>
```

我们可以自己封装MyLink！(外加小插槽)

标签体内容的接收可以使用插槽，在子组件接收的props里，如果插槽有内容，则自动使用children属性进行接收

```jsx
<MyLink to="/about" >About</MyLink>
<MyLink to="/home" >Home</MyLink>
```

定义封装的子组件

```jsx
export default class MyLink extends Component {
  render() {
    return (
      <div>
        <NavLink className="list-group-item" {...this.props}}>{this.props.children}</NavLink>
      </div>
    )
  }
}
```

实际上，不仅link标签可以以这种方式是用插槽，子组件都可以这样使用，这时父子组件插槽的通用方法



#### 路由匹配

**模糊匹配和精确匹配**

路由匹配遵从模糊匹配，比如下方link的to在匹配路由时，以 `/home/a/b` 进行匹配  ，Home组件依然能得到展示。

但是一定要按照顺序，比如link 的 to里为  `/a/home/b`就不可以

```jsx
<Link to="/about">About</Link>
<Link to="/home/a/b">Home</Link>
<Route path="/about" component={About}></Route>
<Route path="/home" component={Home}></Route>   {/* 可以展示 */}
```

如果想要精准匹配（严格匹配），不要搞模糊匹配，则需要添加 **`exact`** 属性（但是这个属性在开发中少用，可能引发一些问题，比如**不能开启二级路由**，非要用到时才要用）

```jsx
<Route exact path="/home" component={Home}></Route>
```

**路由匹配**

在进行路由注册时，我们不难发现，如果是进入 `/home` 路由，则Home、Other组件都会展示

这说明路由匹配完成后还会向下匹配，如果有很多路由，则会逐个匹配，导致效率不高

并且如果使用了 `/` 路径来重定向，由于模糊匹配，更是会让浏览器无论哪个地址都跳转到重定向的组件

```jsx
<Route path="/about" component={About}></Route>
<Route path="/home" component={Home}></Route>
<Route path="/home" component={Other}></Route>
```

我们可以使用 `Switch`，用Switch组件包裹所有注册路由，这时匹配到路由后就不会继续向下匹配

```jsx
import { Switch } from 'react-router-dom';
```

```jsx
<Switch>
    <Route path="/about" component={About}></Route>
    <Route path="/home" component={Home}></Route>
    <Route path="/home" component={Other}></Route>
</Switch>
```

⚠️注意：如果使用v6版本，要把 Switch 标签替换成 Routes 标签，并且把 component 替换成 element



#### 路由重定向 | 404

```jsx
import { Redirect } from 'react-router-dom'
```

默认网页对于每个路由都不匹配（没有点击Link进行路匹配时），此时我们可以使用 `Redirect`组件进行重定向，让默认网页跳转到某个路由（Redirect一般写在路由注册的最下方，当所有路由都无法匹配时，跳转到Redirect指定路由）

```jsx
<Switch>
    <Route path="/home" component={Home}></Route>
    <Route path="/list" component={List}></Route>
    <Redirect to="/home" />
    {/* 谁都匹配不上了就去home */}
</Switch>
```

如果要配合上用户胡乱写匹配的404页面，则此时 `Redirect` 最好开启精准匹配，不然无论如何都是会进入 `Redirect` 指定的路由组件当中去

```html
<Switch>
    <Route path="/home" component={Home}></Route>
    <Route path="/list" component={List}></Route>
    <Redirect from="/" to="/home" exact />
    <Route component={NotFound}></Route>
</Switch>
```



#### 路由嵌套

**路径坑**

如果React直接在路径头嵌套，有可能导致引入文件路径也相对发生错误

```jsx
<Link to="/something/about">About</Link>
<Link to="/something/home">Home</Link>
<Route path="/something/about" component={About}></Route>
<Route path="/something/home" component={Home}></Route>
```

原本引入css样式的路径为

```html
<link rel="stylesheet" href="./css/bootstrap.css">
```

在切换路由 + F5刷新后路径会随之更改

![](/simple-blog/React(中)/react_router.jpg)

解决方法一：

改变路径，去掉当前路径 `./`，直接 `/`是去到url的public目录下

```html
<link rel="stylesheet" href="/css/bootstrap.css">
```

解决方法二：与上方同理

```html
<link rel="stylesheet" href="%PUBLIC_URL%/css/bootstrap.css">
```

解决方法三：使用HashRouter

因为它有一个锚点 `#`，这样子发送请求时会忽略 `#`后面的相关哈希值（路由）



**路由嵌套二级路由**

和Vue一样，使用多重路由嵌套只需在路由组件里，再放置路由组件（Link + Route 组合），切记，这里和Vue一样，link里的to必须要写完整路径（带上父级路由），这样子计算子路由组件未显示，路由也能遵从模糊匹配至少展示一级路由的页面效果

比如在我们home组件内

```jsx
{/* 这里需要给完整的路径， 不能直接to="/news" */}
<MyLink to="/home/news">News</MyLink>
<MyLink to="/home/messages">Messages</MyLink>
{/* 路由注册 */}
<Switch>
    <Route path="/home/Messages" component={Messages} />
    <Route path="/home/News" component={News }/>
    <Redirect to="/home/Messages" />
</Switch>
```

> 但是实质上仍有一个bug，就是在url地址栏，单单输入一级路由的地址，就只会出现一级路由的组件，嵌套路由的组件全部消失



#### 路由传参

传递参数主要有两种类型：params和query（同Vue）

**params**：需要在Route里进行声明（只有params才需要声明接收参数），然后在Link中跳转url的时候记得带上参数就好了

在Route通过`/路径/:自定义参数名`来声明

```jsx
<Route path="/home/Messages/Detail/:id/:title" component={Detail} />
```

```jsx
return (
    <div>
        <ul>
            {
                messageArr.map(item => {
                    return (
                        <li key={item.id}>
                            {/* 向路由组件传递params参数 */}
                            <Link to={`/home/Messages/Detail/${item.id}/${item.title}`}>{item.title}</Link>
                        </li>
                    )
                })
            }
        </ul>
    </div>
)
```

此时你查看子路由组件 Detail 的 props上接收的参数会有所变化，稍稍查看可得知，在`this.props.match.params`可找到你传递的参数



**search**传参

search传参的方式实际上也就是query参数

无需在Route里进行声明

```jsx
messageArr.map(item => {
    return (
        <li key={item.id}>
            {/* 向路由组件传递search参数 */}
            <Link to={`/home/messages/detail/?id=${item.id}&title=${item.title}`}>{item.title}</Link>
        </li>
    )
})
```

此时你查看子路由组件 Detail 的 props上接收的参数会有所变化，稍稍查看可得知，在`this.props.location.search`可找到你传递的参数

可是！

但是参数的形式是 "?id=01&titile=message1"

对于query参数 ：key=value&key=value其实是一种叫urlencoded的编码形式

我们可以使用React脚手架帮我们下载好的库 `querystring`直接转换

```jsx
import qs from 'querystring'
qs.stringify(obj)//对象转urlencoded
qs.parse(str)//urlencoded转对象
```

然后我们可以进行正式的格式转换了

```jsx
const { search } = this.props.location;
const { id, title } = qs.parse(search.slice(1)); //截取掉开头的"?"
console.log(this.props, id, search);
```

会不会感觉有点像json和string的相互转换？：

`JSON.stringify(对象)`     JavaScript 值(对象或数组)转换为 JSON 字符串

`JSON.parse(data)`            字符转对象



**state传参**

这个是路由组件独有的状态，和一般组件里的state是不一样的

state传参你在url地址栏是看不到的，而params和search传参在地址栏可以看到明显的改变

无需在Route里进行声明

```jsx
messageArr.map(item => {
    return (
        <li key={item.id}>
            {/* 向路由组件传递state参数 */}
            {/* to要写成一个对象的形式 */}
            <Link to={{ pathname: '/home/messages/detail', state: { id: item.id, title: item.title } }}>{item.title}</Link>
        </li>
    )
})
```

（Maybe你会发现和Vue的query传参有点像？）

此时你查看子路由组件 Detail 的 props上接收的参数会有所变化，稍稍查看可得知，在`this.props.location.state`可找到你传递的参数

虽然使用state传参方式，刷新页面不会丢失参数（实际上是因为history对象帮你缓存了），但是如果你强行清除缓存，在接收时就会“不见了”



在v6版本使用state传参 + 跳转

```js
const navigate = useNavigate();

const goRouter = useCallback(
  (pathname: string, option = {}) => {
  navigate({
    pathname,
    search: location?.search
  }, option);
},
[location?.search, navigate]);

```

```js
const goHome = () => {
  const path = '/home';
  goRouter(path, {
    state: {
      visitType: 2,
      targetUserIdStr: id
    }
  });
};
```



#### **编程式路由替换link**

在不借助 `Link`的条件下进行路由切换，自己定义函数进行跳转切换，这种方式叫做编程式路由导航

感觉有点像Vue中对router-link原理的延伸 ：` this.$router.push("/home");`

记得编程式路由传参的时候，使用params的方式，Route要声明参数（上面路由传参部分有讲述到）

```jsx
//编程式路由导航 + params传参
replaceCheck = (id, title) => {
    return () => {
        this.props.history.replace(`/home/messages/detail/${id}/${title}`);
    }
}
//编程式路由导航 + query传参
pushcheck = (id, title) => {
    return () => {
        this.props.history.push(`/home/messages/detail?id=${id}&title=${title}`);
        //this.props.history.push("/home/messages/detail?", query: {id: id, title: title});
    }
}
//编程式路由导航 + state传参
pushcheck = (id, title) => {
    return () => {
        this.props.history.push(`/home/messages/detail`, {id:id, title:title});
    }
}
```

同样的，如果想实现网页前进 + 后退功能；也可以使用

`this.props.history.goForward()`、`this.props.history.goBack()`



对于函数式组件，可以通过组件接收的props，通过 `props.history.push()`来跳转路由，还可以通过history Hook来跳转

> V6之后是useNavigate

```js
import { useHistory } from 'react-router-dom'
export default function Index(){
    const history = useHistory();
    const pushcheck = () => {
        return () => {
            history.push(`/home/messages/detail?id=${id}&title=${title}`);
        }
    } 
}
```



#### withRouter

**一般组件和路由组件**

上方阐述的是路由组件的使用，他们有各自的不同之处

1.一般组件直接使用，路由组件通过路由 `link`切换，然后依靠路由（`<Route component=xxx>`）匹配决定渲染哪一个

2.一般组件如果父组件没传props，则收到空对象，路由组件默认会接收到props：history、location、match

3.传参方式不一样，一般组件直接属性传值，props接收，路由组件有三种传参方式



上方讲述了许多关于路由组件的api，但是这些都仅限于路由组件，如果想要在一般组件使用，可以使用到 `withRouter`

`withRouter(一般组件)` 就会添加上路由组件身上特有的三个属性：history、location、match！

```jsx
import { withRouter } from 'react-router-dom'
class Header extends Component{
 //
}
export default withRouter(Header);
```



#### 路由守卫

同vue，用于拦截每一次路由跳转之前的一次回调函数，使用方法：

```jsx
<Route path="home" render={() => <Home />}></Route>
//实质上，这个写法和<Route path="/home" component={Home}></Route>一样
```

此时，只需要我们在render的函数里写上自己需要的拦截逻辑即可

```jsx
<Route path="/" render={() => 
        是否授权 ? (<SandBox />) : (<Redirect to="/login" />);
    }></Route>
```

但是此时传入的组件是被当做普通组件来使用，并不是路由组件（不会带上路由组件的api），我们可以通过render带的props参数放入组件中（或者在组件导出的时候直接报过withRouter），此时组件就可以使用路由组件的api了

```jsx
<Route path="home" render={(props) => {
        是否授权 ? <Home {...props}/> : <Redirect to="/login"/>
    }></Route>
```

在vue中，他有自己一套严格的路由拦截体系，但是在react只是这种简单的，实质上压根没有拦截这个概念



不过咋v6之后，可以直接传，不用render

```js
<Route path=":userId" element={<Profile animate={true} />} />
```



#### 旧版本升级到 v6

可以查看官网：https://reactrouter.com/en/main/upgrading/v5



#### keep-alive

react中没有类似于vue router 的 keep alive功能，keep alive用于缓存之前页面打开的组件数据和内容

曾经有人在官方提过功能 issues ，但官方认为这个功能容易造成内存泄露

keep-alive的库推荐：



早期的react-keep-alive

原理：

使用`React.createPortal API`实现了这个效果。

缺点：

- 这个库存在断层现象，虽然可以缓存最后一次状态渲染结果，但是后面数据变化无法再进行数据驱动。而且是借助React.createPortal 借助实现
- 总体来说，`react-keep-alive`这个库比较重，实现原理也不难，就是笨重，断层，源码跳来跳去，真的理清楚了就好



现在：react-activation

原理

- 抽取children属性，再封装一次HOC高阶组件即可。



建议关注 `React 18.x` 中的官方实现 `<Offscreen />`



## 关于react-router-keep-alive

 在 Vue 中，我们可以非常便捷地通过`<keep-alive>`标签实现状态的保存

React 中并没有keep-alive这个功能，曾经有人在官方提过功能 issues ，但官方认为这个功能容易造成内存泄露，表示暂时不考虑支持



所以我们必须自己对组件进行缓存

一些通用主流做法：

- 通过样式来控制组件的显示（`display：none | block;`），不过但是这可能会导致问题，例如切换组件时，无法使用动画；

- 或者使用像 Mobx 和 Redux 这样的数据流管理工具，但这可能有点麻烦



## React-keep-alive

特性

- 不基于 React Router，因此可以在任何需要缓存的地方使用它。
- 你可以轻松地使用 `<KeepAlive>` 包装你组件来使它们保持活力。
- 因为并不是使用 `display: none | block` 来控制的，所以可以使用动画。
- 你将能够使用最新的 React Hooks。
- 能够手动控制你的组件是否需要保持活力。

原理

通过 [React.createPortal API](https://reactjs.org/docs/portals.html) 实现了这个效果。

`react-keep-alive` 有两个主要的组件 `<Provider>` 和 `<KeepAlive>`；

`<Provider>` 负责保存组件的缓存（React.createContext存储数据流），并在处理之前通过 `React.createPortal` API 将缓存的组件渲染在应用程序的外面。

缓存的组件必须放在 `<KeepAlive>` 中，`<KeepAlive>` 会把在应用程序外面渲染的组件挂载到真正需要显示的位置。



一些缺点：

这个库会造成数据驱动断层（即你缓存后，切换回来，确实可以看到跟之前一样的dom，但是数据驱动此时失效了）



## 路由转场动画

可以看 《React的一些工具》章节，其实就是利用 CSSTransition + TransitionGroup 做路由转场



## 参考

[react-keep-alive文档](https://github.com/StructureBuilder/react-keep-alive/blob/master/README.zh-CN.md)

[如何在React中实现keep-alive？](https://mp.weixin.qq.com/s?__biz=MzkwODIwMDY2OQ==&mid=2247488224&idx=1&sn=780a585cea8507c4922de895be16bd60&source=41#wechat_redirect)

[在React中实现和Vue一样舒适的keep-alive](https://segmentfault.com/a/1190000023263395)

