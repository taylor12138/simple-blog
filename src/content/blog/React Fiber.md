---
author: Hello
pubDate: 2021-09-15
categories: 前端
title: React Fiber
description: '前端框架相关'
pinned: true
---

## React Fiber

> 前言：本着想一篇文章把fiber参透，但是发现越看越多，这篇还是作为小解，主要还是围绕着一些源码 + 思想概念去讲述



#### React Fiber介绍

进程（Process）和线程（Thread），在计算机科学中还有一个概念叫做Fiber，英文含义就是“纤维”，意指比Thread更细的线，也就是比线程(Thread)控制得更精密的并发处理机制。



然而虽然Fiber和React Fiber是两个不同的概念，但取名却有异曲同工之妙



**React Fiber重新实现了一套核心算法**

我们可以看到react包上react-reconciler的方法都变成fiber方法

React 实现了一个**虚拟堆栈帧**，在每个element节点都会生成对应一个fiber node， 最后也就是形成了一个和虚拟dom tree整体结构类似的Fiber tree。

但是具体虚拟dom之间和fiber之间的联系结构不一致

![](/simple-blog/ReactFiber/dom.png)



![](/simple-blog/ReactFiber/fibertree.png)

实际上，这个所谓的虚拟堆栈帧本质上是建立了多个包含节点和指针的链表数据结构。每一个节点就是一个 fiber 基本单元，这个对象存储了一定的组件相关的数据域信息。

而这种类型的指针指向，以一种**非深度递归**的形式则是串联起整个 fibers 树，减少了js调用栈（多层嵌套的递归会占用大量的 JS 调用栈）。

重新自定义堆栈带来显而易见的优点是，可以将堆栈保留在内存中，在需要执行的时候执行它们，这使得暂停遍历和停止堆栈递归成为可能。

```html
<div>
    <ul>
        <li>
            <div>中断处</div>
        </li>
        <!-- 未执行的节点 -->
    </ul>
     <!-- 未执行的节点 -->
</div>
```



所以我个人偏向理解fiber为一个工作单元（units of work），以解决任务的优先权、任务的拆分、任务的调度时间

fiber对象主要属性一览

```js
Fiber = {
    // 标识 fiber 类型的标签，详情参看下述 WorkTag
    tag: WorkTag,

    // // Fiber, 单链表
    // 指向父节点
    return: Fiber | null,
    // 指向子节点
    child: Fiber | null,
    // 指向兄弟节点
    sibling: Fiber | null,

    // 动态工作单元
    // 在开始执行时设置 props 值
    pendingProps: any,
    // 在结束时设置的 props 值
    memoizedProps: any,
    // 当前 state
    memoizedState: any,

    updateQueue = null;
    dependencies = null;
  
    // Effects
    flags = NoFlags;
    subtreeFlags = NoFlags;
    deletions = null;
  
		lanes = NoLanes;
	  childLanes = NoLanes;
    
    //调度算法
    expirationTimes = createLaneMap(NoTimestamp);
};
```



#### 整体创建 / 更新流程调试

在初始化时createRoot -> createContainer -> createFiberRoot 创建一个基本的fiber root，后续更新采用workInProgress Root进行更新

首先找到render函数（每次重新渲染）

```ts
ReactDOMHydrationRoot.prototype.render = ReactDOMRoot.prototype.render =
  function (children: ReactNodeList): void {
		//...
    updateContainer(children, root, null, null);
};
```

```ts
export function updateContainer(
  element: ReactNodeList,
  container: OpaqueRoot,
  parentComponent: ?React$Component<any, any>,
  callback: ?Function,
): Lane {
  //...
  //enqueueUpdate这里看起来就是创建了一个fiberRoot，也是一个fiber的updateQueue
  const root = enqueueUpdate(current, update, lane);
  if (root !== null) {
    //这边执行fiber的调度，并且夹杂了很多对当前fiberRoot是否等于workInProgressRoot时针对的的处理
    scheduleUpdateOnFiber(root, current, lane);
    entangleTransitions(root, current, lane);
  }

  return lane;
}
```

> 当`root === workInProgressRoot`直接进入到 `prepareFreshStack` 函数： `scheduleUpdateOnFiber`  ->  `prepareFreshStack`
>
> 并且在 `scheduleTaskForRootDuringMicrotask` 函数中会进行任务优先级划分（React事件优先级转换为Scheduler优先级），进行任务调度

从`scheduleUpdateOnFiber` -> `ensureRootIsScheduled`  -> `scheduleTaskForRootDuringMicrotask`   ->  `performConcurrentWorkOnRoot` -> `renderRootSync` -> `prepareFreshStack`，经过一个很长的链路之后，来到了`prepareFreshStack`，在这里主要用于创建workInProgress 根结点，也就是开始了 createWorkInProgress Tree的流程（包含createFiber）

```ts
function prepareFreshStack(root: FiberRoot, lanes: Lanes): Fiber {
  root.finishedWork = null;
  root.finishedLanes = NoLanes;

  const timeoutHandle = root.timeoutHandle;
  if (timeoutHandle !== noTimeout) {
    // The root previous suspended and scheduled a timeout to commit a fallback
    // state. Now that we have additional work, cancel the timeout.
    root.timeoutHandle = noTimeout;
    // $FlowFixMe[incompatible-call] Complains noTimeout is not a TimeoutID, despite the check above
    cancelTimeout(timeoutHandle);
  }
  const cancelPendingCommit = root.cancelPendingCommit;
  if (cancelPendingCommit !== null) {
    root.cancelPendingCommit = null;
    cancelPendingCommit();
  }

  resetWorkInProgressStack();
  workInProgressRoot = root;
  const rootWorkInProgress = createWorkInProgress(root.current, null);
  workInProgress = rootWorkInProgress;
  workInProgressRootRenderLanes = renderLanes = lanes;
  workInProgressSuspendedReason = NotSuspended;
  workInProgressThrownValue = null;
  workInProgressRootDidAttachPingListener = false;
  workInProgressRootExitStatus = RootInProgress;
  workInProgressRootFatalError = null;
  workInProgressRootSkippedLanes = NoLanes;
  workInProgressRootInterleavedUpdatedLanes = NoLanes;
  workInProgressRootRenderPhaseUpdatedLanes = NoLanes;
  workInProgressRootPingedLanes = NoLanes;
  workInProgressRootConcurrentErrors = null;
  workInProgressRootRecoverableErrors = null;

  finishQueueingConcurrentUpdates();

  if (__DEV__) {
    ReactStrictModeWarnings.discardPendingWarnings();
  }

  return rootWorkInProgress;
}
```

> 注意，如果中途触发了 exitStatus === RootFatalErrored 条件，也就是说 workInProgressRoot状态报错，出了点问题，也会自动刷新 `prepareFreshStack` 调用栈

然后通过  `renderRootSync` 中的 `workLoopSync ` 进行遍历整个链表调用 `performUnitOfWork`，不断更新 `workInProgress` 

```ts
function performUnitOfWork(unitOfWork: Fiber): void {
  // The current, flushed, state of this fiber is the alternate. Ideally
  // nothing should rely on this, but relying on it here means that we don't
  // need an additional field on the work in progress.
  const current = unitOfWork.alternate;
  setCurrentDebugFiberInDEV(unitOfWork);

  let next;
  // 通过beginWork，根据不同的节点类型（如函数组件、类组件、html 标签、树的根节点等），调用不同的函数，来得到下一个将要处理的jsx                     
  // 结构（即 element），然后再将得到的 element 结构解析成 fiber 节点
  if (enableProfilerTimer && (unitOfWork.mode & ProfileMode) !== NoMode) {
    startProfilerTimer(unitOfWork);
    next = beginWork(current, unitOfWork, renderLanes);
    stopProfilerTimerIfRunningAndRecordDelta(unitOfWork, true);
  } else {
    next = beginWork(current, unitOfWork, renderLanes);
  }

  resetCurrentDebugFiberInDEV();
  unitOfWork.memoizedProps = unitOfWork.pendingProps;
  if (next === null) {
    // If this doesn't spawn new work, complete the current work.
    // 走兄弟节点流程
    completeUnitOfWork(unitOfWork);
  } else {
    workInProgress = next;
  }

  ReactCurrentOwner.current = null;
}
```

beginWork方法部分截图

该函数用于

1. 初始化时根据 tag 创建不同fiber节点

2. 更新时期，复用之前的current

![](/simple-blog/ReactFiber/tree1.png)

最后通过在react/packages/react-reconciler/src/ReactChildFiber.js 里的 `reconcileChildren` 函数（diff）算法对比更新节点

```ts
const current = newFiber.alternate;
```

以此更新fiber节点



#### React Fiber出现缘由

fiber出现之前的React 处理一次 setState()（首次渲染）时会有两个阶段：

- **调度阶段（Reconciler）**：这个阶段React用新数据生成新的 Virtual DOM，遍历 Virtual DOM，然后通过 Diff 算法，快速找出需要更新的元素，放到更新队列中去。
- **渲染阶段（Renderer）**：这个阶段 React 根据所在的渲染环境，遍历更新队列，将对应元素更新。在浏览器中，就是更新对应的 DOM 元素。

然而该策略是需要深度优先遍历所有的 Virtual DOM 节点 + diff对比判断，并且要等整棵 Virtual DOM 计算完成之后，才将任务出栈释放主线程，在更新完所有组件之前不停止，而且很长时间不会返回。

你也可以理解为这种深度遍历节点，生成新虚拟dom的执行是连贯的，并不中断的。

因为JavaScript单线程的特点，每个同步任务不能耗时太长，不然就会让程序不会对其他输入作出相应，而React Fiber就是要解决这个问题。



比如 JS引擎解析JS代码 -> 样式布局 -> 样式绘制

当JS执行时间过长，超出了16.6ms（主流浏览器1000ms / 60帧），这次刷新就没有时间执行**样式布局**和**样式绘制**了。由此在同步工作而过程当中，可能绘制成功，可能要等到下一个16.6ms才能绘制出来 (图片源自[React技术揭秘](https://react.iamkasong.com/))

![](/simple-blog/ReactFiber/fault.png)

然而需要解决

- 第一：解决同步更新整个巨大的DOM的方案，就是分片操作（让我想起了cpu的时间分片）

  把当前任务进行分片，每一个小片按照Fiber本身的算法执行，这样子线程就不会被独占，让其他任务有时间去操作

  React Fiber把更新过程碎片化（分片数据结构维护的leader），每执行完一段更新过程，就把控制权交还给React负责任务协调的模块，看看有没有其他紧急任务要做，如果没有就继续去更新，如果有紧急任务，那就去做紧急任务。

  目前并发模式下分片时间段设置为5ms

- 第二：为了确保用户看到更新完全的dom，确保剩余时间能完成任务





这里插播一条知乎上[cpu时间片](https://www.zhihu.com/question/51542905/answer/2885101964)的概念

**cpu时间片的概念**

时间片即CPU分配给各个程序的时间，每个线程被分配一个时间段，称作它的时间片，即该进程允许运行的时间，使各个程序从表面上看是同时进行的。如果在时间片结束时进程还在运行，则CPU将被剥夺并分配给另一个进程。如果进程在时间片结束前阻塞或结束，则CPU当即进行切换。而不会造成CPU资源浪费。在宏观上：我们可以同时打开多个应用程序，每个程序[并行不悖](https://www.zhihu.com/search?q=并行不悖&search_source=Entity&hybrid_search_source=Entity&hybrid_search_extra={"sourceType"%3A"answer"%2C"sourceId"%3A2885101964})，同时运行。但在微观上：由于只有一个CPU，一次只能处理程序要求的一部分，如何处理公平，一种方法就是引入时间片，每个程序轮流执行。

**系统中cpu时间片是多久**

Windows 系统中线程轮转时间也就是时间片大约是20ms，如果某个线程所需要的时间小于20ms，那么不到20ms就会切换到其他线程;如果一个线程所需的时间超过20ms，系统也最多只给20ms，除非意外发生(那可能导致整个系统无响应)，而Linux/unix中则是5~800ms。



#### React16架构

React16之后架构可以分为三层（之前是只有两层，没有 Scheduler）：

- Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入**Reconciler**
- Reconciler（协调器）—— 负责找出变化的组件
- Renderer（渲染器）—— 负责将变化的组件渲染到页面上

`Fiber`包含[三层含义](https://react.iamkasong.com/process/fiber.html#fiber%E7%9A%84%E8%B5%B7%E6%BA%90)：

1. 作为架构来说，之前`React15`的`Reconciler`采用递归的方式执行，数据保存在递归调用栈中，所以被称为`stack Reconciler`。`React16`的`Reconciler`基于`Fiber节点`实现，被称为`Fiber Reconciler`，所以现在在源码中可以看到各种fiber实现的函数。
2. 作为静态的数据结构来说，每个`Fiber节点`对应一个`React element`，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的DOM节点等信息。
3. 作为动态的工作单元来说，每个`Fiber节点`保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。



## React Fiber的影响

#### 摘要

fiber tree在初始阶段创建后不再通过本身修改更新，而是随之react更新，刷新工作栈时更新的是另外一个树：`workInProgress tree`，由此构成双缓冲树结构，然后再将current指向当前 `workInProgress tree`， 此时workInProgress tree 就是新的 fiber tree

下面先说一下React的渲染过程

#### **Render阶段**

（1）Reconciliation Phase（Render阶段，低优先级）：React将更新应用于通过setState或render方法触发的组件，并确定需要在用户屏幕上做哪些更新--哪些节点需要插入，更新或删除（打上Flag，比如）

```js
// DOM需要插入到页面中
export const Placement = /*                */ 0b00000000000010;
// DOM需要更新
export const Update = /*                   */ 0b00000000000100;
// DOM需要插入到页面中并更新
export const PlacementAndUpdate = /*       */ 0b00000000000110;
// DOM需要删除
export const Deletion = /*                 */ 0b00000000001000;
```

```ts
//打上去的时候大概这样
newFiber.flags |= Placement | PlacementDEV;
```

哪些组件需要调用其生命周期方法，然后通过 `bubbleProperties` 方法， 将`Child Fiber`的`flag` 挂在当前`Fiber` 的 `subtreeFlags` 上（之前用时effectList），最后在这个阶段创建出**`workInProgress Fiber Tree`**。

但是值得注意的是，首屏渲染时期，也就是mount时间段，`reconcileChildren`中调用的`mountChildFibers`不会为`Fiber`节点赋值`effectTag`

而只有`rootFiber`会赋值`Placement effectTag`，并且使用 `appendAllChildren` 一次性全部插入

因为首次渲染的时候毫无疑问整棵fiber树为空，则每个节点都会被赋值上，`Placement effectTag`，此时每个节点都会执行一次插入操作，效果是极低的





**在生命周期图中**，render阶段被标记为纯的、没有副作用的，可能会被React暂停、终止或者重新执行。也就是说，React会根据产生的任务的优先级，安排任务的调度（schedule）。利用`setTimeout`在浏览器空闲阶段进行更新计算，而不会阻塞动画，事件等的执行，其中调度细节可以在  `scheduler` 这包看。

也就是说，也我们想要做的操作，做什么任务，以及会调用到的生命周期方法作为信息保存在 `fiber`节点树上

并且一次更新过程会分成多个分片完成，所以完全有可能一个更新任务还没有完成，就被另一个更高优先级的更新过程打断（比如用户交互的优先级 > 数据请求），这时候，优先级高的更新任务会优先处理完，而低优先级更新任务所做的工作则会**完全作废，然后等待机会重头再来**。



#### **Commit阶段**

（2）Commit Phase（Commit阶段，高优先级）：

此时并不会再遍历fiber树了，这样就太低效了..

而是会遍历`effect list`，把所有更新都commit到DOM树上。在`pre-commit`阶段，主要是执行`getSnapshotBeforeUpdate`方法

可以获取当前DOM的快照（snap，详情可以收看新生命周期图中的 `getSnapshotBeforeUpdate` ）

然后给需要卸载的组件执行`componentWillUnmount`方法。接着会把current fiber tree 替换为`workInProgress` fiber tree。最后执行DOM的插入、更新和删除（mutation阶段），给更新的组件执行`componentDidUpdate`，给插入的组件执行`componentDidMount`。



##### 处理Effect List （subtreeEffect List）

那么Effect List从哪里来呢？

同样的，在我们之前提到的 `performUnitOfWork` 遍历函数中，有一个 `completeUnitOfWork` 函数，执行完毕后，会把每一个有副作用的 fiber （存在`effectTag`）筛选出来，最后构建生成一个只带副作用的 effect list 链表。

不过在react 17之后，effect被弃用 [Issue](https://github.com/facebook/react/pull/19673)，替换为 subtreeTag

```ts
do {
  // `flushPassiveEffects` will call `flushSyncUpdateQueue` at the end, which
  // means `flushPassiveEffects` will sometimes result in additional
  // passive effects. So we need to keep flushing in a loop until there are
  // no more pending effects.
  // TODO: Might be better if `flushPassiveEffects` did not automatically
  // flush synchronous work at the end, to avoid factoring hazards like this.
  flushPassiveEffects();
} while (rootWithPendingPassiveEffects !== null);
flushRenderPhaseStrictModeWarningsInDEV();
//...
if (
  (finishedWork.subtreeFlags & PassiveMask) !== NoFlags ||
  (finishedWork.flags & PassiveMask) !== NoFlags
) {
  if (!rootDoesHavePassiveEffects) {
    rootDoesHavePassiveEffects = true;
    pendingPassiveEffectsRemainingLanes = remainingLanes;
    scheduleCallback(NormalSchedulerPriority, () => {
      flushPassiveEffects();
      return null;
    });
  }
}
```

```ts
function commitBeforeMutationEffects_begin() {
  while (nextEffect !== null) {
    //....
    //可以防止无意义DFS
    if (
      (fiber.subtreeFlags & BeforeMutationMask) !== NoFlags &&
      child !== null
    ) {
      child.return = fiber;
      nextEffect = child;
    } else {
      commitBeforeMutationEffects_complete();
    }
  }
}
```

重构之后，会将子节点的副作用冒泡到父节点的`SubtreeFlags`属性，详情可以看[这里](https://cloud.tencent.com/developer/article/1909391)， 主要体现为让子节点的flag通过树形结构冒泡到父节点

原来的链表结构替换为树形结构主要服务于react 18的 `Suspense` 功能



这一阶段无法终止（一鼓作气，再而衰，三而竭地更新DOM，不可中断）

在 commit 阶段，work 执行总是同步的，这是因为在此阶段执行的工作将导致用户可见的更改。这就是为什么在 commit 阶段， React 需要一次性提交并完成这些工作的原因。



进入到commit阶段的时候，会遍历带副作用的节点

插入DOM -> fiber节点上增加Placement的effect

更新DOM -> fiber节点上增加Update的effect

删除DOM -> fiber节点上增加Deletion的effect

更新Ref -> fiber节点上增加Ref的effect

useEffect回调执行 ->  fiber节点上增加Passive的effect

![](/simple-blog/ReactFiber/effect.png)

![](/simple-blog/ReactFiber/effect2.png)

commit阶段有三个小段：

1.beforeMutation阶段

- 处理`DOM节点`渲染/删除后的 `autoFocus`、`blur` 逻辑。
- 调用`getSnapshotBeforeUpdate`生命周期钩子。
- 调度`useEffect`（未执行回调）。

2.mutation阶段

- 根据`ContentReset effectTag`重置文字节点
- `WorkInProgress` 上的 `Fiber` 渲染在浏览器上，也就是根据`effectTag`分别进行DOM的处理，增删改DOM
- 如果是ScopeComponent，会更新 ref（safelyAttachRef）
- 执行useLayoutEffect销毁函数（commitHookEffectListUnmount）

3.layout阶段

- commitLayoutEffectOnFiber（调用生命周期钩子和`hook`相关操作）
  - `componentDidMount`、`ComponentDidUpdate` 
  - 执行`useLayoutEffect hook`的回调（commitHookLayoutEffects）
  -  ref 的更新（safelyAttachRef）
- commitAttachRef（赋值 ref）

以上三个在以上三个子阶段都执行完毕后，异步调用我们的useEffect的回调

摘录自`React`文档[effect 的执行时机 (opens new window)](https://zh-hans.reactjs.org/docs/hooks-reference.html#timing-of-effects)：

> 与 componentDidMount、componentDidUpdate 不同的是，在浏览器完成布局与绘制之后，传给 useEffect 的函数会延迟调用。这使得它适用于许多常见的副作用场景，比如设置订阅和事件处理等情况，因此不应在函数中执行阻塞浏览器更新屏幕的操作。

可见，`useEffect`异步执行的原因主要是防止同步执行时阻塞浏览器渲染。



#### 渲染大致

`this.setState`被触发 -> 

（Render阶段）reconcile算法（diff算法），计算状态变化 ->

（Commit阶段）然后进入`ReactDOM`渲染器，将状态变化渲染在视图中。

这两个阶段可以帮助我们更加认清生命周期函数

调用`ReactDOM.render`（此时未进入`ReactDOM`渲染器，是Render阶段），会采用深度优先遍历创建fiber树（也就是虚拟DOM树），并且以深度优先遍历（从父到子，APP -> P1 -> C1 -> C2 -> P2）的形式调用它们的生命周期函数（constructor、render等）

![](/simple-blog/ReactFiber/render1.png)

进入Commit阶段后，从子节点回退（从子到父,C1-> C2 -> P1 -> P2 -> APP），执行生命周期函数（`ComponentDidMount`、`CoponentDidUpdate`等）

而其中Diff算法帮助我们决定该组件是否重新渲染/ 重新执行生命周期函数

（`Vue`的生命周期亦是如此。）



#### React渲染后的结构

首次渲染之后，React 会生成一个对应于 UI 渲染的 fiber 树，称之为 current 树，也就是刚才我们在render阶段所讲的，我们想要做的操作，做什么任务，以及会调用到的生命周期方法作为信息保存在 `fiber`节点树上。

当 React 遍历 current 树时，它会为每一个存在的 fiber 节点创建了一个替代节点，这些替代节点形成 `workInProgress` 树，后续的变更在`workInProgress` 树上执行，当 `workInProgress` 树被提交后将会在 commit 阶段的某一子阶段被替换成为 `current` 树。

每次状态更新都会产生新的`workInProgress Fiber树`，通过`current`与`workInProgress`的替换，完成`DOM`更新。

多建一棵树是为了做缓存，保障构建和绘制的流畅性





#### 调度时间算法

##### ExpirationTime

expirationTime属性是调度优先级相关的到期时间

work 的过期时间，可用于标识一个 work 优先级顺序。

比如高 优先级任务 taskA 和低优先级任务 taskB，它们对应的延时分别为 0 和 500，如果它们的 currentTime 相同，那么 `taskA.expirationTime` 就比 `taskB.expirationTime` 大 500。

React 实现批量更新的方式很容易理解，只要任务满足 `task.expirationTime >= currentExecTaskTime` 即可。

在事件处理函数或生命周期函数中实现批量更新，就是通过将任务设置为相同的 ExpirationTime。如此一来，这些任务将同时满足 `task.expirationTime >= currentExecTaskTime` 并被执行。

在 React 中，为防止某个 update 因为优先级的原因一直被打断而未能执行。React 会设置一个 ExpirationTime，当时间到了 ExpirationTime 的时候，如果某个 update 还未执行的话，React 将会强制执行该 update



存在问题：

taskA优先级大于taskB时，有2种调度方式

1. 先执行 taskA 后执行 taskB。因为 taskA 无法完成，所以不会执行 taskB，结果为：页面卡住。
2. taskA 和 taskB 一起执行。

ExpirationTime 机制引起该问题的更深层次原因是，它耦合了任务的**优先级**和**批量更新**。当决定了需要执行的优先级（currentExecTaskTime）时，所有 `task.expirationTime >= currentExecTaskTime` 的任务都将被执行。





##### lane

在2020年5月，调度优先级策略经历了比较大的重构。以expirationTime属性为代表的优先级模型被lane取代，详情可以看ReactFiberLane的computeExpirationTime函数

之前：

```js
Fiber = {
    expirationTime: ExpirationTime,
};
```

现在：

```js
Fiber = {
    expirationTimes = createLaneMap(NoTimestamp);
};
```



##### （1）React中有三套优先级机制

1. React事件优先级
2. Lane优先级
3. Scheduler优先级



React事件优先级

```ts
// 离散事件优先级，例如：点击事件，input输入等触发的更新任务，优先级最高
export const DiscreteEventPriority: EventPriority = SyncLane;
// 连续事件优先级，例如：滚动事件，拖动事件等，连续触发的事件
export const ContinuousEventPriority: EventPriority = InputContinuousLane;
// 默认事件优先级，例如：setTimeout触发的更新任务
export const DefaultEventPriority: EventPriority = DefaultLane;
// 闲置事件优先级，优先级最低
export const IdleEventPriority: EventPriority = IdleLane;
```



Lane优先级转换为React事件优先级：

```js
export function lanesToEventPriority(lanes: Lanes): EventPriority {
  // 找到优先级最高的lane
  const lane = getHighestPriorityLane(lanes);
  if (!isHigherEventPriority(DiscreteEventPriority, lane)) {
    return DiscreteEventPriority;
  }
  if (!isHigherEventPriority(ContinuousEventPriority, lane)) {
    return ContinuousEventPriority;
  }
  if (includesNonIdleWork(lane)) {
    return DefaultEventPriority;
  }
  return IdleEventPriority;
}
```



React事件优先级转换为Scheduler优先级（Lane优先级转换为React事件优先级 -> Scheduler优先级 ）

```ts
//离散事件
export const ImmediatePriority = Scheduler.unstable_ImmediatePriority;
//用户block（交互）事件
export const UserBlockingPriority = Scheduler.unstable_UserBlockingPriority;
//正常事件
export const NormalPriority = Scheduler.unstable_NormalPriority;
//低级事件
export const LowPriority = Scheduler.unstable_LowPriority;
//空闲执行事件
export const IdlePriority = Scheduler.unstable_IdlePriority;
```

```ts
switch (lanesToEventPriority(nextLanes)) {
  case DiscreteEventPriority:
    schedulerPriorityLevel = ImmediateSchedulerPriority;
    break;
  case ContinuousEventPriority:
    schedulerPriorityLevel = UserBlockingSchedulerPriority;
    break;
  case DefaultEventPriority:
    schedulerPriorityLevel = NormalSchedulerPriority;
    break;
  case IdleEventPriority:
    schedulerPriorityLevel = IdleSchedulerPriority;
    break;
  default:
    schedulerPriorityLevel = NormalSchedulerPriority;
    break;
}
```



##### （2）页面交互事件优先级

由于react对事件监听都做了一层代理`addTrappedEventListener`，由此进来时会调用 getEventPriority 函数进行事件划分，然后得到对应的优先级（React事件优先级）

然后接下来会根据获取到的事件的优先级分类，设置事件触发时拥有相对应优先级的回调函数



#### React Diff

第一轮遍历，一一对比 vdom 和老的 fiber，如果可以复用就处理下一个节点，否则就结束遍历。

如果所有的新的 vdom 处理完了，那就把剩下的老 fiber 节点删掉就行。

如果还有 vdom 没处理，那就进行第二次遍历：

第二轮遍历，把剩下的老 fiber 放到 map 里，遍历剩下的 vdom，从 map 里查找，如果找到了，就移动过来。

第二轮遍历完了之后，把剩余的老 fiber 删掉，剩余的 vdom 新增。



参考链接：

[React Fiber 源码解析](https://zhuanlan.zhihu.com/p/179934120)

 [React技术揭秘](https://react.iamkasong.com/)

[「React Fiber」 详细解析](https://zhuanlan.zhihu.com/p/424967867)

[React 为什么使用 Lane 技术方案](https://juejin.cn/post/6951206227418284063)