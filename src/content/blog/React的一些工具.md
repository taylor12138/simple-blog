---
author: Hello
pubDate: 2023-01-05 
categories: 前端
title: React的一些工具
description: 'React相关'
---


## 普通动画

用 transition 只能做一些简单的动画，稍微复杂的动画可以使用keyframes：

```css
.show{ animation:show-item 2s ease-in forwards; }
.hide{ animation:hide-item 2s ease-in forwards; }

@keyframes hide-item{
    0% {
        opacity:1;
        color:yellow;
    }
    50%{
        opacity: 0.5 ;
        color:red;
    }
    100%{
        opacity:0;
        color: green;
    }
}
@keyframes show-item{
    0% {
        opacity:0;
        color:yellow;
    }
    50%{
        opacity: 0.5 ;
        color:red;
    }
    100%{
        opacity:1;
        color: green;
    }
}
```



当然，React也有它好的套件：
就叫做 `react-transition-group`

```shell
npm install react-transition-group --save
```

[官方文档](https://reactcommunity.org/react-transition-group/css-transition)

它有三个核心套件：

- Transition
- CSSTransition
- TransitionGroup





## CSSTransition

```js
import { CSSTransition } from 'react-transition-group'
```

```js
render() {
    return (
        <>
            <CSSTransition
                in={this.state.isShow}   // 用户判断是否出现的状态
                timeout={2000}           // 动画持续时间
                classNames="boss-text"   // 防止重复，可以理解成 namespace
            >
                <div>BOSS - king</div>
            </CSSTransition>
            <div>
                <button onClick={this.toToggle}>召喚「風魚」 </button>
            </div>
        </>
    );
}
```



再看看官方文件說明可以知道，我们接下来就可以编写css属性了

在组件出现、进入、退出或完成过渡时应用于组件的动画类名。可以提供单个名称，每个阶段都将添加后缀，例如`classNames="fade"`applys：

- `fade-appear`, `fade-appear-active`,`fade-appear-done`
- `fade-enter`, `fade-enter-active`,`fade-enter-done`
- `fade-exit`, `fade-exit-active`,`fade-exit-done`

举个例子：

- namespace-enter: 进入前的样式 / 初始值
- namespace-enter-active：动画开始直到完成的css
- namespace-enter-done：完成时css
- namespace-exit：退出之前CSS 
- namespace-exit-active：退出动画直到完成時之前的的 CSS 。
- namespace-exit-done：退出完成時的 CSS 。

现在我们不用自己编写 / 管理classname啦🥵～

```css
.boss-text-enter{
    opacity: 0;
}
.boss-text-enter-active{
    opacity: 1;
    transition: opacity 2000ms;

}
.boss-text-enter-done{
    opacity: 1;
}
.boss-text-exit{
    opacity: 1;
}
.boss-text-exit-active{
    opacity: 0;
    transition: opacity 2000ms;

}
.boss-text-exit-done{
    opacity: 0;
}
```





#### 几个回调

##### onEnter

<Transition>组件的回调函数，当组件enter或appear时会立即调用。

type: Function(node: HtmlElement, isAppearing: bool)

##### onEntering

也是一个过渡组件的回调函数，当组件enter-active或appear-active时，立即调用此函数

type: Function(node: HtmlElement, isAppearing: bool)

##### onEntered

同样是回调函数，当组件的enter,appearclassName被移除时，意即调用此函数

type: Function(node: HtmlElement, isAppearing: bool)

##### onExit

当组件应用exit类名时，调用此函数

type: Function(node: HtmlElement)

##### onExiting

当组件应用exit-active类名时，调用此函数

type: Function(node: HtmlElement)

##### onExited

当组件exit类名被移除，且添加了exit-done类名时，调用此函数

type: Function(node: HtmlElement)



#### 其他

`mountOnEnter`：<bool = false>，默认情况子组件与transtion组件一起加载(也就是说即使in属性为false，组件也会先以隐藏状态(exited)正常加载)，当mountOnEnter 为true时，会在第一次in属性为true时加载子组件

`unmountOnExit`：<bool = false>，在元素退场时，自动把DOM也删除，这是以前用CSS动画没办法做到的。在过渡结束后卸载组件, 测试发现这里确实卸载了子组件生成的dom节点，但是并不会触发componentWillUnmount钩子，在子组件重新进入entered状态时也不会重新触发componentDidMount等创建阶段钩子





## **[react-canvas-draw](https://github.com/embiem/react-canvas-draw)**

一个canvas绘画组件

```js
import CanvasDraw from 'react-canvas-draw';
```

```jsx
<CanvasDraw
  brushRadius={5}
  brushColor="#fad54b"
  ref={saveableCanvas}
  onChange={onChange}
  backgroundColor="transparent"
  className="draw-canvas-wrap"
  hideInterface
  hideGrid />
```

```js
  static defaultProps = {
    onChange: null
    loadTimeOffset: 5,
    lazyRadius: 30,        //拖拽点距离鼠标的距离
    brushRadius: 12,       //线条粗度
    brushColor: "#444",    //线条颜色
    catenaryColor: "#0a0302",
    gridColor: "rgba(150,150,150,0.17)",
    hideGrid: false,
    canvasWidth: 400,
    canvasHeight: 400,
    disabled: false,
    imgSrc: "",
    saveData: null,
    immediateLoading: false,
    hideInterface: false,
    gridSizeX: 25,
    gridSizeY: 25,
    gridLineWidth: 0.5,
    hideGridX: false,
    hideGridY: false
    enablePanAndZoom: false,
    mouseZoomFactor: 0.01,
    zoomExtents: { min: 0.33, max: 3 },
  };
```



## 路由转场

#### 基本写法

v5写法

```jsx
<TransitionGroup className={'router-wrapper'}>
  <CSSTransition
    timeout={5000}
    classNames={'fade'}
    key={location.pathname}
    >
    <Switch location={location}>
      <Route exact path={'/'} component={HomePage} />
      <Route exact path={'/about'} component={AboutPage} />
      <Route exact path={'/list'} component={ListPage} />
      <Route exact path={'/detail'} component={DetailPage} />
    </Switch>
  </CSSTransition>
</TransitionGroup>
```

v6写法

```jsx
const location = useLocation();

//...
<TransitionGroup className={'router-wrapper'}>
  <CSSTransition
    timeout={5000}
    classNames={'fade'}
    key={location.pathname}
    >
    <Routes location={location}>
      <Route exact path={'/'} element={HomePage} />
      <Route exact path={'/about'} element={AboutPage} />
      <Route exact path={'/list'} element={ListPage} />
      <Route exact path={'/detail'} element={DetailPage} />
    </Routes>
  </CSSTransition>
</TransitionGroup>
```

注意，react-router官网上 Routes 中的 location 不是必填项，但是使用 TransitionGroup 进行转场的时候为了区分 前后路由组件，必须填写上 location，不然会此时会有fade-exit、fade-enter的组件都会是同一个路由组件

感觉可能是内部用 useLocation 取的时候，取的是最新的 location，旧的location在 TransitionGroup / CSSTransition 阶段丢失

源码：(传入location即为 `locationArg` )

```js
let locationFromContext = useLocation();
let location;

if (locationArg) {
  var _parsedLocationArg$pa;

  let parsedLocationArg = typeof locationArg === "string" ? parsePath(locationArg) : locationArg;
  !(parentPathnameBase === "/" || ((_parsedLocationArg$pa = parsedLocationArg.pathname) == null ? void 0 : _parsedLocationArg$pa.startsWith(parentPathnameBase))) ? process.env.NODE_ENV !== "production" ? UNSAFE_invariant(false, "When overriding the location using `<Routes location>` or `useRoutes(routes, location)`, " + "the location pathname must begin with the portion of the URL pathname that was " + ("matched by all parent routes. The current pathname base is \"" + parentPathnameBase + "\" ") + ("but pathname \"" + parsedLocationArg.pathname + "\" was given in the `location` prop.")) : UNSAFE_invariant(false) : void 0;
  location = parsedLocationArg;
} else {
  location = locationFromContext;
}
```



#### 转场坑点

一些路由转场的坑点在[这里](https://juejin.cn/post/6887471865720209415#heading-3)有记录，其中包括

- 页面定位问题
- 懒加载问题
- and so on



其他坑点：

1. 包过的路由组件不能用 

   ```html
   <>
   	<div />
   	<div />
   </>
   ```

   这种形式包裹，因为此时csstransition 会把 样式塞到第一个div上，这时第二个div无法响应该css转场动画，需要这样调整

   ```html
   <div>
   	<div />
   	<div />
   </div>
   ```

2. 路由组件之间高度不相等，可能会出现转场时留白的情况

   ![white](/React的一些工具/white.png)



## 参考

[彻底搞定react路由跳转动画的优化方案](https://juejin.cn/post/6887471865720209415#heading-4)

[一次react-router + react-transition-group实现转场动画的探索](https://juejin.cn/post/6844903818073899022)
