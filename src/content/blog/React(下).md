---
author: Hello
categories: 前端
title: React(下)
description: '框架相关知识'
---

## 10.Hooks

React的Hook 是 16.8版本新增的特性/语法，可以让我们在函数式组件中使用state和其他React特性

函数式组件最主要没有上述功能的原因是没有实例对象，没有this（现在函数式组件是主流了）

Hook主要是践行代数效应的思想（比如不使用async处理正常的函数（因为回将该函数变成一个promise），而是自定义语法以try、catch的理念将函数内部执行的无论同步、异步操作剥离出函数本身），长此以往，可能可以形成服务即组件的结果，从不同数据库，即不同的源获取，对应不同的单独组件



#### 三个常用的Hook

- State Hook：React.useState()，让我们是使用state
  - ` const [xxx, setXxx] = React.useState(initValue) `
    - 参数: 第一次初始化指定的值在内部作缓存 
    - 返回值: 包含2个元素的数组, 第1个为内部当前状态值, 第2个为更新状态值的函数
- Effect Hook：React.useEffect()，让我们使用生命周期函数
  - ` useEffect(fn, [stateValue])`
    - 根据stateValue数组的范围，可划分 `componentDidMount()`、`componentDidUpdate()`两种生命周期函数，stateValue为监听的state
    - fn是作为以上两种生命周期函数进入该周期执行的回调函数。
    - fn可以再返回一个函数fn2，fn是作为`componentWillUnmount()`这个生命周期函数
    - 综上所述，可以把 useEffect Hook 看做如下三个函数的组合
          `componentDidMount()`
          `componentDidUpdate()`
      	`componentWillUnmount()` 
- Ref Hook：React.useRef()
  - `const refContainer = useRef()`

State Hook使用示范

```jsx
import React from 'react'
// 这个demo函数调用次数 = render次数
function Demo() {
    // 保存状态和更新状态的方法，都自定义名字
    const [count, setCount] = React.useState(0);
    const [NewArr, setArr] = React.useState([0]);

    function add() {
        // 第一种写法，适用于改变一次的情况
        setCount(count + 1);
        // 第二种写法，适用于不断改变的情况，比如定时器，此时count总能获取到上次状态设置好的count
        // setCount(count => count+1)
        // setCount(preState => preState+1) 更容易理解
    }
    function addArr() {
        setArr([NewArr.length, ...NewArr])
    }
    return (
        <div>
            <h2>当前的Count为：{count}</h2>
            <button onClick={add}>+1</button>
            <button onClick={addArr}>为数组添加数据</button>
            当前数组：<ul>{
                NewArr.map((item, index) => {
                    return (
                        <li key={index}>{item}</li>
                    )
                })
            }
            </ul>
        </div>
    )
}
export default Demo;
```



Ref Hook 示范

```jsx
function Demo() {
  // 感觉和类式组件的createRef差不多
  const myRef = React.useRef();
  function show() {
    alert(myRef.current.value);
  }
  return (
    <div>
      <input type="text" ref={myRef} />
      <button onClick={show}>tip</button>
    </div>
  )
}
```

ref可以看成fiber中非链表形式，而是单纯作为一个个体存储的hook对象

```js
const hook = workInProgressHook();   //workInProgress可以理解成当前fiber的暂存区
hook.memoizedState = {current: initialValue}
```



#### useEffect

Effect Hook 示范

```jsx
// 总觉得有点像vue里的watch
//第一个参数相当于两个钩子，一个是DidMount、一个是DidUpdate
React.useEffect(() => {
    let timer = setInterval(() => {
        setCount(count => count + 1);
    }, 1000);
    return () => {    //组件卸载前执行，相当于componentWillUnmount，可以执行比如清除定时器，取消订阅等操作
        clearInterval(timer);
    }
}, [])  //这里传入空数组，可以当作componentDidMount来使用

// React.useEffect(() => {
//   // do something
// }, [count])  只监测count的变化，有点像隶属于count的watcher，如果第二个参数不传入，则全部state都监听
```

第一个参数返回值是一个清除函数，为防止内存泄漏，清除函数会在组件卸载前执行。另外，如果组件多次渲染（通常如此），则**在执行下一个 effect 之前，上一个 effect 就已被清除**

其中第二个参数为依赖数组，每次都会进行“浅比较”（`Object.js()`），判断是否重新渲染

对于Hook的理解不能只停留在这种桌面上对于周期函数 -> useEffect，更要心领神会，忘记之前所学的“生命周期”，他们还是有很多不同之处的，

比如 useEffect 直接使用state、props，会捕获到 “初始的 props和state”（当前渲染状态/ 次数下的props和state），而在useEffect中使用useRef可以获取到最新的数据之类的。

下面这篇文章可以帮助大家加深React Hook的印象https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/



在render阶段进入到commit阶段的时候，会通过一种被称为Effect（Flags）的数据结构

插入DOM -> fiber节点上增加Placement的effect

更新DOM -> fiber节点上增加Update的effect

删除DOM -> fiber节点上增加Deletion的effect

更新Ref -> fiber节点上增加Ref的effect

useEffect回调执行 ->  fiber节点上增加Passive的effect

![](/React(下)/effect.jpg)

![](/React(下)/effect2.jpg)

然后在render阶段 -> commit阶段的时候，会传递一条effect链表，里面可能包含了Placement、Passive等

commit阶段处理链表上的每个effect

commit阶段有三个小段：

1.beforeMutation阶段

2.mutation阶段

3.layout阶段

**useEffect和生命周期函数的区别**

- Placement -> （mutation阶段）新增DOM节点，使用`appendChild`方法，然后再layout阶段调用componentDidmount（同步）
- Passive -> 在以上三个子阶段都执行完毕后，**异步**调用我们的useEffect回调

此时我们可以是用`useLayoutEffect(fn, [])`，那效果就和生命周期函数一样了，都在layout阶段调用（`useLayoutEffect` 内部的更新计划将被**同步**刷新。）

摘录自`React`文档[effect 的执行时机 (opens new window)](https://zh-hans.reactjs.org/docs/hooks-reference.html#timing-of-effects)：

> 与 componentDidMount、componentDidUpdate 不同的是，在浏览器完成布局与绘制之后，传给 useEffect 的函数会延迟调用。这使得它适用于许多常见的副作用场景，比如设置订阅和事件处理等情况，因此不应在函数中执行阻塞浏览器更新屏幕的操作。

可见，`useEffect`异步执行的原因主要是防止同步执行时阻塞浏览器渲染。



#### useLayoutEffect

官方的推荐使用时机：

如果你正在将代码从 class 组件迁移到使用 Hook 的函数组件，则需要注意 `useLayoutEffect` 与 `componentDidMount`、`componentDidUpdate` 的调用阶段是一样的。但是，我们推荐你**一开始先用 `useEffect`**，只有当它出问题的时候再尝试使用 `useLayoutEffect`。

所以我们可以看到useEffect 并不等价于 componentDidMout，而useLayoutEffect 才是与 componentDidMount 等价



`useEffect` 和 `useLayoutEffect`的差异

- `useEffect` 是异步执行的，而`useLayoutEffect`是同步执行的。（所以设计到渲染操作放到`useLayoutEffect`里面去）
- `useEffect` 的执行时机是浏览器完成渲染之后，而 `useLayoutEffect` 的执行时机是浏览器把内容真正渲染到界面之前，和 `componentDidMount` 等价。
- 如果使用服务端渲染，使用 `useLayoutEffect` 可能会导致实际渲染效果和服务端渲染初衷不一致

参考链接 https://zhuanlan.zhihu.com/p/348701319



#### React Hook书写习惯

（Borrowed by Robin Wieruch，who is famous in GitHub）

1. 在useEffect中调用异步请求时，顺便在useEffect中定义异步请求，如下（使用 try/catch 块进行错误处理）

```js
useEffect(() => {
    const fetchData = async () => {
        try{
            const result = await axios(
                'https://hn.algolia.com/api/v1/search?query=redux',
            );
            setData(result.data);
        } catch {
            //.... 
        }
        fetchData();
    }, []);
```

由于挂钩不应返回任何内容或清理函数，而*async 函数*返回一个AsyncFunction对象，所以以下写法为错误的 ×

```jsx
//错误示范 ×
useEffect(async () => {
    const result = await axios(
      'https://hn.algolia.com/api/v1/search?query=redux',
    );
    setData(result.data);
  }, []);
```

2. 一般建议把不依赖props和state的函数提到你的组件外面，并且把那些仅被effect使用的函数放到effect里面。

3. 如果effect要用到外面的函数（不在effect中定义的函数）

   - 如果一个函数没有使用组件内的任何值，你应该把它提到组件外面去定义，然后就可以自由地在effects中使用

   - 也可以在定义这些函数的地方用`useCallback`包一层

5. 出现无限重复请求的问题：
   - 没有设置effect依赖参数（你至少也设置一个空数组[] ，如果没有的话个人感觉有点像进入到类式组件的redner中）
   - 无限循环的发生也可能是因为你设置的依赖总是会改变

6. 不要对依赖项进行撒谎，**effect中用到的所有组件内的值都要包含在依赖中。**这包括props，state，函数 — 组件内的任何东西。（虽然有时可能导致死循环，但是解决方法不是移除依赖项！——前端大师 Dan说到）

```jsx
function SearchResults() {
  async function fetchData() {
    // ...
  }

  useEffect(() => {
    fetchData();
  }, []); // Is this okay? Not always -- and there's a better way to write it.

  // ...
}
```

如果导致死循环，也就是依赖项在Effect中被改动，该如何是好？

- 让Effect减少依赖项，仔细思考一下，我们真的需要在Effect中时用到这个依赖项吗？减少“错误依赖”的产生，巧用 `setCount(c => c+1)`，也就是这种函数的形式，减少依赖项

- 处理state中出现相互依赖的关系时，比如 `setCount(c => c + step);`（step是一种状态），此时依赖项要添加上step，消除这个依赖项我们可以使用useReducer！

技术参考：https://overreacted.io/zh-hans/a-complete-guide-to-useeffect/





#### 自定义hook

**自定义 Hook 是一个函数，其名称以 “`use`” 开头，函数内部可以调用其他的 Hook**（实质上自定义hook也我们平时使用函数复用相同逻辑的代码是一样的，只是自定义hook这个函数里面我们可以调用其他的hook，比如State Hook、Effect Hook等）

React官方示例

```jsx
import { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  useEffect(() => {
    function handleStatusChange(status) {
      setIsOnline(status.isOnline);
    }

    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

它就像一个正常的函数。但是它的名字应该始终以 `use` 开头，这样可以一眼看出其符合 [Hook 的规则](https://zh-hans.reactjs.org/docs/hooks-rules.html)。

在React 函数中使用（分别在两个组件中使用相同的逻辑代码）

```jsx
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

```jsx
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

官方的问题回答：

- **在两个组件中使用相同的 Hook 会共享 state 吗？**不会。自定义 Hook 是一种重用*状态逻辑*的机制，他们的state是相互隔离的



#### useReducer

useReducer是useState的替代方案

```jsx
const [state, dispatch] = useReducer(reducer, initialArg, init);
```

在某些场景下，`useReducer` 会比 `useState` 更适用，例如 state 逻辑较复杂且包含多个子值，或者下一个 state 依赖于之前的 state 等。所以当你写类似`setSomething(something => ...)`这种代码的时候，也许就是考虑使用reducer的契机

**当你想更新一个状态，并且这个状态更新依赖于另一个状态（非自身状态）的值时，你可能需要用`useReducer`去替换它们。**

官网的使用示例

```jsx
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
    </>
  );
}
```

从此中我们可以看到，是有点类似于redux的模式

为什么用dispatch替换依赖项会更好？**React会保证`dispatch`在组件的声明周期内保持不变。**

这就是`dispatch`的好处之一， `dispatch` 不会随着 re-render 而重新分配记忆位置（他会暂时记忆），在作为 props 传入到 child component 的时候也可以不用担心没有 `useMemo` 而造成 re-render 的问题。

**在下面的例子中我们不再重新订阅定时器（id）**

（正常情况下使用useEffect订阅定时器，当step依赖项发生改变时，定时器将会被重新订阅；反观使用dispatch，在定时器开启后，如果step发生改变，定时器不会被重新渲染，而是采用之前的step）

```jsx
import React, { useReducer, useEffect } from "react";
import ReactDOM from "react-dom";

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { count, step } = state;

  useEffect(() => {
    const id = setInterval(() => {
      dispatch({ type: 'tick' });
    }, 1000);
    return () => clearInterval(id);
  }, [dispatch]);

  return (
    <>
      <h1>{count}</h1>
      <input value={step} onChange={e => {
        dispatch({
          type: 'step',
          step: Number(e.target.value)
        });
      }} />
    </>
  );
}

const initialState = {
  count: 0,
  step: 1,
};

function reducer(state, action) {
  const { count, step } = state;
  if (action.type === 'tick') {
    return { count: count + step, step };
  } else if (action.type === 'step') {
    return { count, step: action.step };
  } else {
    throw new Error();
  }
}
```

（你可以从依赖中去除`dispatch`, `setState`, 和`useRef`包裹的值因为React会确保它们是静态的。不过你设置了它们作为依赖也没什么问题。）



小知识：useState底层也是使用useReducer实现的

```js
export function useState<S>(
  initialState: (() => S) | S,
): [S, Dispatch<BasicStateAction<S>>] {
  return useReducer(
    basicStateReducer,
    // useReducer has a special case to support lazy useState initializers
    (initialState: any),
  );
}
function basicStateReducer<S>(state: S, action: BasicStateAction<S>): S {
  return typeof action === 'function' ? action(state) : action;
}
```



#### useState小Demo

源自魔术师卡颂）

```js
let isMount = true;
let workInProgressHook = null;

const fiber = {
  stateNode: App,
  memoizedState: null  //保存App里面的state
}

function schedule() {
  workInProgressHook = fiber.memoizedState; //初始化，得到state的表头
  const app = fiber.stateNode();
  isMount = false;
  return app;
}

function useState(initialState) {
  let hook; //hook作为一个链表
  if (isMount) {
    hook = {
      memoizedState: initialState,
      next: null,
      queue: {
        pending: null
      }
    }
    if (!fiber.memoizedState) {
      fiber.memoizedState = hook
    } else {
      workInProgressHook.next = hook;
    }
    workInProgressHook = hook;
  } else {
    hook = workInProgressHook;
    workInProgressHook = workInProgressHook.next;
  }

  let baseState = hook.memoizedState;
  if (hook.queue.pending) {
    let firstUpdate = hook.queue.pending.next;
    do {
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next;
    } while (firstUpdate !== hook.queue.pending.next)

    hook.queue.pending = null;
  }
  hook.memoizedState = baseState;
  return [baseState, dispatchAction.bind(null, hook.queue)];
}

function dispatchAction(queue, action) {
  const update = {  //作为一个环状链表
    action,
    next: null
  }
  if (queue.pending === null) {
    update.next = update
  } else {
    update.next = queue.pending.next;  //让update.next指向队头
    queue.pending.next = update;       //让当前update成为队头
  }
  queue.pending = update;
  schedule();
}

function App() {
  const [num, setNum] = useState(0);
  return {
    onClick() {
      setNum(num => num + 1);
    }
  }
}

window.app = schedule();
```



#### react依赖项

对于react那些hooks的依赖项，要切实地填写（关乎到当前地hook会不会重新渲染），对于react的依赖尽可能写详细，比如我 `currentDay.index`写成了`currentDay`，重新渲染多了一次，useEffect，导致请求多发了一次



#### React Hooks存在的问题

- hooks执行原理和原生js心智模型的差异
- 不能条件式调用
- stale Clousure(过期闭包)心智负担
- 必须手动声明useEffect依赖
- 如何正确使用useEffect是个复杂的问题
- 需要useMemo / useCallback 等手动优化

详情：[尤雨溪前端趋势2022 的主题演讲](https://www.bilibili.com/video/BV1Rr4y1L7r3/?vd_source=a7271fb5733d8e87b30bac4ea32a461f)





## 11.React拓展

#### setState使用方法

方法一：传统的对象式setState（class）

` setState(stateChange, [callback])`

- stateChange为状态改变对象（原state的key: 新的值）
- callback是可选的回调函数, 它在状态更新完毕、界面也更新后(render调用后)才被调用

（实际上，setState是一个同步的方法，但是异步执行，也就是改动state的数据是异步的，为了提高性能，会将收集到多个state一次性整合更新。这里其实和Vue的异步渲染原因是一致的）

```jsx
something = () => {
	const {a} = this.state;          //1
	this.setState({a:a+1}, () => {   //2
        console.log(this.state.a)    //2
    });
	console.log(this.state.a);       //1
}
```



方法二：函数式的setState（class）

`setState(updater, [callback])`

- updater是一个返回stateChange对象（（原state的key: 新的值）的一个对象）的函数。
- updater可以接收到state和props。
- callback是可选的回调函数, 它在状态更新、界面也更新后(render调用后)才被调用。

```jsx
something = () => {
	this.setState((state, props) => {
		return {a:state.a+1}
	},() => {   
        console.log(this.state.a)    
    });
}
something2 = () => {
	this.setState(state => {a:state.a-1});  //不再需要 const {a} = this.state;  这个语句，一行解决
}
```

对象式的setState是函数式setState的语法糖



方法三：hook的setState

```js
setCount(c => c + 1);
```

如果您将 State Hook 更新为与当前状态相同的值，React 将退出而不渲染子级或触发效果。（React 使用[`Object.is`比较算法](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is#Description)。）



#### setState同步、异步问题

React的三个模式：

```jsx
//- legancy模式： 
ReactDOM.render(<App />, rootNode)
//- blocking模式： 
ReactDOM.createBlockingRoot(root).render(<App />)
//- Concurrent模式： 
ReactDOM.createRoot(rootNode).render(<App />)
```

针对legancy模式：

- 异步渲染。根据`batchedUpdates`函数进行优化，进行批处理，将多次setState转化为一次。其实也是`batchedUpdates`函数中，有一个 `executionContext`全局变量，如果当前更新，包含了 `BatchedContext`，则会认为这是一次批处理（因为是 `|=`， 所以可能包含，可能不包含），批处理中的 setState都会被合并为一次

  ```js
  executionContext |= BatchedContext
  ```

  所以此时如果将 `setState()`方法放入`setTimeout`中（进行异步执行），比如下面这种情况
  
  ```js
  function handleClick() {
      console.log("=== click ===");
      fetchSomething().then(() => {
          setCount((c) => c + 1); // Causes a re-render
          setFlag((f) => !f); // Causes a re-render
      });
  }
  ```
  
  使得 `executionContext |= BatchedContext`不能同步得到 `BatchedContext`这个值，则此时 `executionContext `啥也没有，源码中有：
  
  ```js
  if(executionContext === NoContext) {
  	resetRenderTimer();
  	flushSyncCallbackQueue();  //同步执行本次渲染setState
  }
  ```
  
- 针对Concurrent模式：

  即使将 `setState()`方法放入`setTimeout`中（进行异步执行），也不会同步渲染，因为进入以上判断条件之前，还要进入一个判断，即是否为同步的优先级（`ReactDOM.render`），由于此时是ConCurrent模式，则不会进入这个逻辑判断，继续往下走命中

  `flushSyncCallbackQueue()`函数。

  在Concurrent模式出现之前，是通过 包裹`unstable_batchedupdates`实现异步任务中批处理
  
  实际上，Concurrent还处于实验阶段，在稳定版本中尚不可用。它面向的人群是早期使用者以及好奇心较强的人。

```js
setTimeout(() => { // 模拟异步
    ReactDOM.unstable_batchedUpdates(() => { // 仅仅加了unstable_batchedUpdates
        // 这里的两个setState会合并执行一次。
        setNum(2); 
        setStr('c');
    });
}, 1000);
```

补充：

在react18以后，不再有这三种模式，而是以“是否使用并发特性”作为“是否开启并发更新”的依据

并且从 React 18 开始`createRoot`，所有更新都将自动批处理，无论它们来自何处。这意味着超时、承诺、本机事件处理程序或任何其他事件内部的更新将以与 React 事件内部的更新相同的方式进行批处理：



#### 追溯异步回调中批处理问题

**为什么之前异步回调中的setState不能批处理？**

React 的更新是基于 [Transaction](https://zhuanlan.zhihu.com/p/28532725)（事务）的，Transacation 就是给目标执行的函数包裹一下，加上前置和后置的 hook （有点类似 koa 的 middleware），在开始执行之前先执行 initialize hook，结束之后再执行 close hook，这样搭配上 isBatchingUpdates 这样的布尔标志位就可以实现一整个函数调用栈内的多次 setState 全部入 pending 队列，结束后统一 apply 了。

但是 setTimeout 这样的方法执行是脱离了事务的，react 管控不到，所以就没法 batch 了。

（但是18.x以后都可以batch了）

**为什么Vue没有这个限制？**

是因为 vue 采用了 nexttick 的方式，利用 EventLoop，将一个同步事件循环过程中所有修改合并，它本质上属于延迟的批量更新



#### LazyLoad-React的懒加载

**懒加载组件**

如果有多个所有路由组件，所有的路由组件都会在第一次就全部给你加载完毕。我们可以借助react里面的 `Lazy` 函数

```jsx
// lazy为路由懒加载函数，Suspence为如果当前路由组件没能即使请求出来，给用户展示的页面信息
import React, { Component, lazy, Suspense } from 'react'
```

引入路由组件是写的方式有所变化

（在Vue中是直接 `const Home = () => import('../components/home');`）

```jsx
// import Home from './pages/Home'
// import About from './pages/About'
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
```

但是注册路由部分需要使用 从React 引入的 Suspense 组件进行包裹，为的是当前路由组件没能及时加载出来，给用户展示的页面信息

```jsx
{/* 注册路由部分都给我用Suspence包裹起来,fallback部分可以放置一个组件 */}
{/* 但是这个放置的加载组件，不能使用路由懒加载 */}
<Suspense fallback={<h2>Loading...</h2>}>
    {/* 注册路由 */}
    <Route path="/about" component={About}></Route>
    <Route path="/home" component={Home}></Route>
    <Redirect to="/about" />
</Suspense>
```



如果不是以 `react-router-dom` 进行路由分配，而是通过本组件的state决定是否渲染子组件的简易版动态路由，则也可以用以上类似写法

```js
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/About'))
```

```jsx
{/* 注册路由部分都给我用Suspence包裹起来,fallback部分可以放置一个组件 */}
{/* 但是这个放置的加载组件，不能使用路由懒加载 */}
<Suspense fallback={<h2>Loading...</h2>}>
    {
       isShow ? <Home /> : <About/> 
    }
</Suspense>
```



**实现原理**

当Webpack解析该语法时，他会自动开始进行代码分割，分割成一个文件（Code Spliting），当使用到这个文件时这段代码会被异步加载



当然除了异步懒加载组件，还可以异步懒加载方法，详情可以看《PC&移动端网页特效(JS)》篇章



#### Fragment

正常情况下，我们使用jsx语法们都需要在外层包裹一层div，但其实有另外一个选择，就是在外层包一层`Fragment`（隶属于源码干净强迫症患者）

```jsx
<Fragment>
    ....
</Fragment>
```

最终Fragment会被React解析，丢弃，撰写Fragment实际上是为了骗过jsx语法（类似Vue的template），由此可以得到没有太多曾div包裹的干净html代码 0.0

实际上我们可以写空标签，它也可以实现fragment的效果

```jsx
<>
	.....
</>
```

只不过如果使用fragment标签，可以给它添加key属性： `<Fragment key={1}>`，所以使用fragment标签可以进行遍历，二空标签不行



#### Context

一种组件间通信方式（生产消费者模式），常用于祖组件和后代组件的通信（祖孙），在应用开发中一般不用context, 一般都用它的封装react插件

（回忆：父传子直接props，子传父用回调，兄弟等跨父子可用订阅发布机制或者redux）

1.创建Context容器对象：`const XxxContext = React.createContext()` 

2.渲染子组时，外面包裹`xxxContext.Provider`标签, 通过value属性给后代组件传递数据

3.哪个子组件要使用，则

- 如果是类式子组件，需要 `static contextType = XxxContext;`进行声明接收；然后 `this.context.username` 就可以使用祖组件传过来的数据了
- 如果是函数式组件，则需要通过 `XxxContext.Consumer`标签进行声明接收，并且由回调函数得到祖组件传来的数据

```jsx
import React, { Component } from 'react'
//记住这里赋值变量名首字母大写，因为现在要把MyContext作为组件去使用
const MyContext = React.createContext();
export default class App extends Component {
  state = {
    username: 'Allen',
    age: 18
  }
  render() {
    const { username, age } = this.state
    return (
      <div>
        I am grandFather
        <MyContext.Provider value={{ username, age }}>
          <Son />
        </MyContext.Provider>
      </div>
    )
  }
}
class Son extends Component {
  render() {
    return (
      <div>
        <Grand />
      </div>
    )
  }
}
// class Grand extends Component {
//   // 举手示意我要使用(必须要声明才能接收到)
//   static contextType = MyContext;
//   render() {
//     return (
//       <div>
//         {this.context.username}
//       </div>
//     )
//   }
// }
// 函数式组件写法
function Grand() {
  return (
    <div>
      <MyContext.Consumer>
        {
          value => {
            return `My name is ${value.username}, my age is ${value.age}`
          }
        }
      </MyContext.Consumer>
    </div>
  )
}
```



#### useContext

函数式组件除了可以使用 Consumer 接收Context的数据，还可以使用useContext进行接收（特别是在多个context的时候，更能体现出useContext的优势）（结合上面的案例来看）

```jsx
import { useContext } from 'react'
function Grand() {
  const value = useContext(MyContext);
  return (
    <div>
      <MyContext.Consumer>
        {`My name is ${value.username}, my age is ${value.age}`}
      </MyContext.Consumer>
    </div>
  )
}
```

一般context系列和useReducer使用起来会很爽

```js
import React, { useReducer, useContext } from 'react';

const initialState = {
  count: 0
}
function reducer(state, action) {
  const { count } = state;
  switch (action.type) {
    case 'increment':
      return { count: count + 1 };
    case 'decrement':
      return { count: count - 1 }
    default:
      return state
  }
}
const MyContext = React.createContext();
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  
  return (
    <>
      <div>{state.count}</div>
      <MyContext.Provider value={
        {
          state, 
          dispatch
        }
      }>
        <Child></Child>
        <Child></Child>
        <Child></Child>
      </MyContext.Provider>
    </>
  )
}
function Child() {
  const {dispatch, state} = useContext(MyContext)
  
  return (
    <div>
      <div>{state.count}</div>
      <button onClick={() => dispatch({type: 'increment'})}>+++</button>
      <button onClick={() => dispatch({type: 'decrement'})}>---</button>
    </div>
  )
}
export default App;
```



#### React的插槽技术

在我们封装自定义的 `Link` 标签时（React（中）路由篇章部分），我们直接在自定义路由组件标签内写入文字，从而在子组件里面可以使用 `children`属性进行接收（`this.props.children`）

插槽技术的实用性在于：预留位置，随时改变整个组件

由此，我们可以看到React在处理组件插槽时的策略

```jsx
class App extends Component {
  render() {
    return (
      <div>
         <A>
          <B />
        </A> 
      </div>
    );
  }
}
class A extends Component {
  render() {
    return (
      <div>
        I am A
        {this.props.children} 
      </div>
    );
  }
}
class B extends Component {
  render() {
    return (
      <div>
        I am B
      </div>
    );
  }
}
```

此时B要算作A的子组件，可是此时B如何获取到A的state呢？以上的 `children props`只能实现传递结构，无法传递数据

我们要使用`render props`（实际上也有点像利用正常的子传父闭包特性实现）

```jsx
class App extends Component {
  render() {
    return (
      <div>
        {/* render是自定义的属性名，但是我们一般都定义为render */}
        <A render={(name) => <B name={name} />} />
      </div>
    );
  }
}
class A extends Component {
  state = {
    name: 'Allen'
  }
  render() {
    return (
      <div>
        I am A
        {this.props.render(this.state.name)}
      </div>
    );
  }
}
class B extends Component {
  render() {
    return (
      <div>
        I am B
        <br />
        {this.props.name}
      </div>
    );
  }
}
```

由此，我们也可以是实现作为插槽的父子组件数据传递了

在Vue中，以上被称为slot技术。



#### 错误边界

（react16以上）

由于某些不可控因素，代码错误、后端数据问题、服务器崩溃、返回数据undefined等

而ErrorBoundary，不要让一个子组件的错误，影响到整个组件都无法呈现

我们之前学习过 `getDerivedStateFromProps`钩子（新钩子），这一次是 我们使用 `getDerivedStateFromError`处理错误边界

`getDerivedStateFromError`：

- 如果该组件的子组件出现任何的报错，都会调用这个钩子，并携带错误信息作为参数
- 它必须返回一个状态对象，只能捕获后代组件生命周期产生的错误（包括render）
- `getDerivedStateFromError` 经常搭配另外一个不太常用的 钩子 `componentDidCatch` 一起使用 

```jsx
class App extends Component {
  state = {
    hasError: ''  //用于表示子组件是否产生错误
  }
  // 在出错组件的父组件进行处理 getDerivedStateFromError
  static getDerivedStateFromError(err) {
    return { hasError: err }
  }
  // 统计子组件错误次数，反馈给服务器，用于通知编码人员bug的解决：
  componentDidCatch() {
    console.log();
  }
  render() {
    return (
      <div>
        I am App
        {/* 不过在dev环境下其实还是会出现网页整体报错，但是打包后就不会了 0.0  */}
        {this.hasError ? <h2>当前网络不稳定，请稍后重试</h2> : <A />}
      </div>
    );
  }
}
```



#### Server Component

官方提出草案的目的是解决接口请求分散在各个组件中带来的子组建的数据请求，需要等待父组件请求完成渲染子组件时才能开始请求的数据请求队列问题

方案大概是将React拆分为Server组件和Client的组件，然而和SSR不同的地方在于Server Component返回的是序列化的组件数据（JSX），而SSR返回的是html

与此同时，仍然会带来一些问题（取自魔法师卡颂，卡老师）

1.接口返回，会额外多出冗余的组件结构

2.服务器成本问题，在目前行业大势观看，服务器的成本还是比较昂贵的，很多为了节约服务器成本，将逻辑计算下移至客户端处理

3.心智负担，ServerComponent无法使用useState、useEffect等hooks



#### forwardRef

有时候父组件需要拿到子组件的ref组件，进行直接操作（虽然我们要尽量避免这种情况），此时通过父子组件通信的方式，可能会比较麻烦（虽然可以实现，比如用props穿回调函数），从事我们可以使用forwardRef

```tsx
import React, { forwardRef, useRef } from 'react'
const Child = forwardRef((props, ref) => {
  return (
    <div>
      <h1>child</h1>
      <input type="text" ref={ref as React.LegacyRef<HTMLInputElement>}/>
    </div>
  )
})
export default function Index() {
  const text = useRef<HTMLInputElement | null>(null)
  return (
    <div>
      <h1>father</h1>
      <Child ref={text}></Child><button onClick={() => {
        console.log(text);
      }}>click</button>
    </div>
  )
}
```



#### 判断是否为React组件

```js
import React, {
    isValidElement
} from 'react';
console.log(isValidElement(xxxx)); // true
```



## 12.React优化

#### PureComponent & memo

问题一：执行`setState`的时候，即使state未发生改变，也会重新render（不过类式组件中redux的更新也由此得益）

问题二：React中使用父子组件嵌套时，父组件使用props传入state的状态，发生 setState 时state改变，setState触发 `render()`，而传入的props也随之改变，子组件也发生 `render()`；但是如果没有传入props，父组件发生 `render()`更新时，因为子组件也放在 `render()`里面，所以子组件即使没什么要改的地方，也不得不随着父组件一起 `render()`更新

造成原因：

- Component中的`shouldComponentUpdate()`总是返回true（拉闸开门）

在我们研究中，可以判断：

```jsx
shouldComponentUpdate(nextProps, nextState) {
    console.log(this.props, this.state);  //当前组件的props、state
    console.log(nextProps, nextState);    //发生更新后的props、更新后的state
    return !this.props.属性 === nextProps.属性 && !this.state.属性 === nextState.属性
}
```

在开发中解决：

对于类式组件

我们可以使用React带的 `PureComponent`，它能帮我们自动重写阀门这个逻辑

```jsx
import React, { PureComponent } from 'react'
```

然后定义类式组件时，原本继承Component -> 继承PureComponent

```jsx
export default class App extends PureComponent {
	//xxx
}
```

但实际上 `PureComponent` 有些许小瑕疵（类似于redux小bug）,它在底层也是做一个浅比较（`Object.is()`），如果只是数据对象内部数据变了，`shouldComponentUpdate()`返回false

```jsx
changeSomething = () => {
    let obj = this.state;
    obj.username = 'Bruce';
    this.setState(obj);    //地址没有改变，不发生变化
    // this.setState({ username: 'Bruce' }) 这个也不顶用了
    // 之前不推荐使用push、unshift
    const { student } = this.state;
    student.push('Olivia');
    this.setState({ student: student }); ////地址没有改变，不发生变化
}
```

 正确写法：

```jsx
this.setState({
    username:'Bruce',
    student: ['Olivia', ...student] 
});
```

亦或是需要深层比较的时候，自行实现 `shouldComponentUpdate`



对于函数式组件

我们此时无法使用到PureComponent，我们可以使用 `React.memo`

他接收一个组件作为参数返回一个新组件，新组件仅检查props变更，会将当前props和上一次props进行浅层比较，相同则阻止渲染

所以对于函数式组件来说，`React.memo` 仅检查 props 变更。如果函数组件被 `React.memo` 包裹，且其实现中拥有 [`useState`](https://zh-hans.reactjs.org/docs/hooks-state.html)，[`useReducer`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usereducer) 或 [`useContext`](https://zh-hans.reactjs.org/docs/hooks-reference.html#usecontext) 的 Hook，当 state 或 context 发生变化时，它仍会重新渲染。

```js
const ChildComponent = React.memo(function MyComponent(props) {
  /* 使用 props 渲染 */
});
```

`React.memo` 为[高阶组件](https://zh-hans.reactjs.org/docs/higher-order-components.html)。

如果你的组件在相同 props 的情况下渲染相同的结果，那么你可以通过将其包装在 `React.memo` 中调用，以此通过记忆组件渲染结果的方式来提高组件的性能表现。这意味着在这种情况下，React 将跳过渲染组件的操作并直接复用最近一次渲染的结果。

默认情况下其只会对复杂对象做浅层对比，如果你想要控制对比过程，那么请将自定义的比较函数通过第二个参数传入来实现。

```js
function MyComponent(props) {
  /* 使用 props 渲染 */
}
function areEqual(prevProps, nextProps) {
  /*
  如果把 nextProps 传入 render 方法的返回结果与
  将 prevProps 传入 render 方法的返回结果一致则返回 true，
  否则返回 false
  */
}
export default React.memo(MyComponent, areEqual);
```

此方法仅作为**[性能优化](https://zh-hans.reactjs.org/docs/optimizing-performance.html)**的方式而存在。但请不要依赖它来“阻止”渲染，因为这会产生 bug。

> 注意
>
> 与 class 组件中 [`shouldComponentUpdate()`](https://zh-hans.reactjs.org/docs/react-component.html#shouldcomponentupdate) 方法不同的是，如果 props 相等，`areEqual` 会返回 `true`；如果 props 不相等，则返回 `false`。这与 `shouldComponentUpdate` 方法的返回值相反。

**高阶组件是参数为组件，返回值为新组件的函数。**



#### **useCallback**

官方：

把内联回调函数及依赖项数组作为参数传入 useCallback，它将返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新。当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如 shouldComponentUpdate）的子组件时，它将非常有用。

这里引入一个例子

```jsx
function Foo() {
  const [count, setCount] = useState(0);

  const handleClick() {
    console.log(`Click happened with dependency: ${count}`)
  }
  return <Button onClick={handleClick}>Click Me</Button>;
}
```

这里每次渲染，都会造成handleClick重新创建，给Button是不同的引用，然后Button也跟着渲染。

```jsx
function Foo() {
  const [count, setCount] = useState(0);

  const memoizedHandleClick = useCallback(
    () => console.log(`Click happened with dependency: ${count}`), [count],
  ); 
  return <Button onClick={memoizedHandleClick}>Click Me</Button>;
}
```

此时在依赖项count不变的情况下，他会返回相同的引用，避免Button无意义的重复渲染。



源码赏析

```js
function mountCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  hook.memoizedState = [callback, nextDeps];
  return callback;
}

function updateCallback<T>(callback: T, deps: Array<mixed> | void | null): T {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;
  if (prevState !== null) {
    if (nextDeps !== null) {
      const prevDeps: Array<mixed> | null = prevState[1];
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }
  hook.memoizedState = [callback, nextDeps];
  return callback;
}
```



`useCallback(fn, deps)` 相当于 `useMemo(() => fn, deps)`。

#### useMemo

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

把“创建”函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。

关于useCallback和useMemo更深一侧的了解（利弊关系）可以查看https://jancat.github.io/post/2019/translation-usememo-and-usecallback/，实质上可以当成对时间、空间的分配置换关系来看就行了

使用场景：

一、应该使用 `useMemo` 的场景

1. 保持引用相等

- 对于组件内部用到的 object、array、函数等，如果用在了其他 Hook 的依赖数组中，或者作为 props 传递给了下游组件，应该使用 `useMemo`。
- 自定义 Hook 中暴露出来的 object、array、函数等，都应该使用 `useMemo` 。以确保当值相同时，引用不发生变化。
- 使用 `Context` 时，如果 `Provider` 的 value 中定义的值（第一层）发生了变化，即便用了 Pure Component 或者 `React.memo`，仍然会导致子组件 re-render。这种情况下，仍然建议使用 `useMemo` 保持引用的一致性。

2. 成本很高的计算

- - 比如 `cloneDeep` 一个很大并且层级很深的数据

二、无需使用 useMemo 的场景

1. 如果返回的值是原始值： `string`, `boolean`, `null`, `undefined`, `number`, `symbol`（不包括动态声明的 Symbol），一般不需要使用 `useMemo`。
2. 仅在组件内部用到的 object、array、函数等（没有作为 props 传递给子组件），且没有用到其他 Hook 的依赖数组中，一般不需要使用 `useMemo`。



源码赏析

```js
function mountMemo<T>(
  nextCreate: () => T,
  deps: Array<mixed> | void | null,
): T {
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}

function updateMemo<T>(
  nextCreate: () => T,
  deps: Array<mixed> | void | null,
): T {
  const hook = updateWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  const prevState = hook.memoizedState;
  if (prevState !== null) {
    // Assume these are defined. If they're not, areHookInputsEqual will warn.
    if (nextDeps !== null) {
      const prevDeps: Array<mixed> | null = prevState[1];
      if (areHookInputsEqual(nextDeps, prevDeps)) {
        return prevState[0];
      }
    }
  }
  const nextValue = nextCreate();
  hook.memoizedState = [nextValue, nextDeps];
  return nextValue;
}
```





#### useCallback使用场景 + 死循环

https://segmentfault.com/a/1190000020108840

死循环的出现（链接里面的两个例子）：

- 子组件的渲染依赖父组件传递的函数，而函数被在被调用的时候会触发父组件的渲染，会导致父组件内，该函数的引用发生改变 ->

  传入子组件函数发生改变，函数再次调用 -> 死循环

- 函数依赖自身自家组件的state（加上usecallback，但依赖列表也要添加自身的state），state发生改变，引用再次改变 -> 再调用，再改变，再调用，再改变。

解决方法：

- 将方法传递给子组件的时候包一层useCallback
- 自定义hook



## 13.React 17 | 18

新增特性一览（主要的，也可以说是我所关注的）

（1）在React 16和更早的版本中，React将对大多数事件执行`document.addEventListener()`。 React 17将在后调用`rootNode.addEventListener()`。（也就是将事件委托从 document 切换为 root）

一张图明示两者的差异

![](/React(下)/react17.jpg)（2) React 17支持新的JSX转换。我们还将对它支持到React 16.14.0，React 15.7.0和0.14.10。需要注意的是，这是完全选择启用的，您也不必使用它。之前的JSX转换的方式将继续存在，并且没有计划停止对其支持。

更多：https://juejin.cn/post/6885881513741647886



React18：

从带有 `createRoot` 的 React 18 开始，所有更新都将自动批处理，无论它们来自何处。（也就是说不用我们自己）

 这意味着`timeouts`、`promises`、`native events`处理程序或任何其他事件内的更新将以与 React 事件内的更新相同的方式进行批处理。我们希望这会导致更少的渲染工作，从而在您的应用程序中获得更好的性能

```js
ReactDOM.createRoot(rootElement).render(<App />);
```

通常，批处理是安全的，但某些代码可能依赖于在状态更改后立即从 DOM 中读取某些内容。对于这些用例，您可以使用 ReactDOM.flushSync() 选择退出批处理：

```js
import { flushSync } from 'react-dom'; // Note: react-dom, not react

function handleClick() {
  flushSync(() => {
    setCounter(c => c + 1);
  });
  // React 现在已经更新了 DOM
  flushSync(() => {
    setFlag(f => !f);
  });
  // React 现在已经更新了 DOM
}
```

对于之前用于异步批处理的 `unstable_batchedUpdates `：

这个 API 在 18 中仍然存在，但不再需要它了，因为批处理是自动发生的。我们不会在 18 中删除它，尽管在流行的库不再依赖于它的存在之后，它可能会在未来的主要版本中被删除。

https://juejin.cn/post/6998763055685304356



## 14.React其他

#### Portal

Portal提供了一个最好的在父组件包含DOM结构层次外的DOM节点渲染组件的方法（说人话就是，它有可以把组件渲染到root之外的能力），这里的container是指挂载的位置

```js
ReactDOM.createPortal(child, container)
```

应用场景：组件想要作为提示窗口覆盖整个窗口（fixed），但是可能因为父盒子使用了定位+z-index，导致了组件本身定位的z-index再大，也无法覆盖到全局

此时在写组件时，我们将其写为Portal组件

```tsx
import { createPortal } from 'react-dom'

export default function Dialog() {
  return createPortal(
    <div>Dialog</div>, document.body
  )
}
```

虽然通过Portal渲染的组件在父组件盒子之外，但是渲染的dom节点仍然在React元素树上，在那个dom元素上的点击事件仍然能在dom树中监听到（仍然会冒泡冒到父节点上）

#### React.StrictMode

`StrictMode` 是一个用以标记出应用中潜在问题的工具。就像 `Fragment` ，`StrictMode` 不会渲染任何真实的UI。它为其后代元素触发额外的检查和警告。

但是有个小坑：**React.StrictMode 多次调用问题，导致这个函数组件被调用了两次**。