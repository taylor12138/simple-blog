---
author: Hello
categories: 前端
title: BOM
description: 'js相关知识'
---

## 1.BOM概述

BOM是浏览器对象模型，他提供独立于内容而与浏览器窗口进行交互的对象，其核心对象是window

BOM缺乏标准，Javascript语法的标准化组织是ECMA，DOM标准化组织是W3C，BOM最初是Netscape浏览器标准的一部分，所以它的兼容性比较的差

BOM比DOM更大，它包含着DOM

window对象是浏览器的顶级对象，它是JS浏览器的一个接口，是一个全局对象，定义在全局作用域的变量（var）、函数都会变成window对象的属性和方法（alert()、prompt() ），在调用的时候可以省略window





## 2.onLoad

本来我们的内嵌式`<script></script>`只能放在所有标签标签下方  而window.onload可以解决，它是窗口加载事件，当文档内容完全加载以后才会触发该事件（包括图像、脚本、CSS），就调用该函数

```html
<script>
        window.onload = function() {
            var btn = document.querySelector('button');
            btn.onclick = function() { 
            }
        }
</script>
<button></button>
```

但是window.onload传统注册方式只能写一次，如果写多个，只以最后一个onload为准，所以推荐

```javascript
window.addEventListener('load', function() {})
```

所以一般情况下引入js文件，则该js文件都要添加 ↑  



#### pageshow事件

下面三种情况会触发load事件：

1.a标签的超链接

2.F5刷新（或者强制刷新）

3.前进或后退

但是在火狐中有个“往返缓存”，它不仅保留着页面数据，还保存着DOM和Javascript的状态，实际上将整个页面保存在内存里，导致后退按钮不能刷新页面（无法触发load事件）

所以此时可以用pageshow事件来触发，它有点像load，但是事件在页面显示时就会触发，无论页面是否来自缓存（注意这个事件是给window添加的）

```js
window.addEventListener('pageshow', fucntion(e){
//e.persisted返回的是true，就是说如果这个页面是从缓存取过来的页面，也需要重新计算一下rem
	if(e.persisted) {
		setRemUnit();   //这个函数是设置rem的
	}
})
```



#### DOMContentLoaded

当DOM加载完毕时触发，不包括样式表，图片，flash等，ie9以上支持，如果页面图片很多，onload的触发会比较久，用户体验不佳 ，此时DOMContentLoaded比较合适，执行顺序DOMContentLoaded > onload

但是值得注意的是，在iframe内不适用该属性功能，主要是因为：

iframe在初始化完成时，会有个虚拟的document在里面，该虚拟文档与通过 .src 属性加载动态内容时最终存在的文档不同，所以真正能获取到.src 属性加载动态内容的document时，一定已经到异步了，并且容易出问题

```js
document.addEventListener('DOMContentLoaded',function(){  });
```

当初始的 **HTML** 文档被完全加载和解析完成之后，**`DOMContentLoaded`** 事件被触发，而无需等待样式表、图像和子框架的完全加载。





#### load和ready

**（jQuery）**

一般情况下一个页面响应加载的基本顺序是：**域名解析 -> 加载html -> 加载js和css -> 加载图片等其他信息**

**$(document).ready()**（在原生的jS中不包括ready()）

从字面的意思上理解，就是文档准备好了。也就是浏览器已经加载并解析完整个html文档，dom树已经建立起来了,然后执行此函数（不包含图片，css等）

**load**

是当页面所有资源全部加载完成后（包括DOM文档树，css文件，js文件，图片资源等），执行一个函数，load方法就是onload事件。

所以对应的缺点是：如果图片资源较多，加载时间较长，onload后等待执行的函数需要等待较长时间，所以一些效果可能受到影响





#### unload事件

与load相对的是unload事件，它在文档卸载之后触发（有点像生命周期里的beforeDestory）；一般是从一个页面导航到另外一个页面市被触发，常用于清理引用，避免内存泄漏

```js
window.addEventListener("unload", () => {
	console.log("unLoad!!!!")
})
```



## 3.调整窗口大小

只要窗口发生变化，就会触发这个事件

`window.onresize = function() {}`

`window.addEventListener('resize', function() {})`

响应式布局原理

```html
<div></div>
<script>
	var div = document.querySelector('div');
	window.addEventListener('resize', function() {
		if (window.innerWidth <= 800) {
		div.stye.display = 'none';
		} else {
			div.style.display = 'block';    
		}
	})
</script>
```



## 4.定时事件

#### setTimeout

`window.setTimeout(调用函数, 延时时间)`   这个window在调用时可以省略，延时时间单位是毫秒，默认省略为0

延时xx毫秒后，执行该函数，写函数名不加括号、不带参数

```javascript
var a = setTimeout(function() {}, 1000);
var b = setTimeout(callback, 1000);   //callback为一个函数
```

页面中时常有很多定时器，我们经常给定时器加标识符（名字）

setTimeout() 这个调用函数我们也称之为回调函数（需要等待时间，时间到了才去调用该函数） callback ，以前onclick之类的函数也是回调函数

**注意：**

HTML5标准规定了setTimeout()的第二个参数的最小值（最短间隔），不得低于4毫秒，如果低于这个值，就会自动增加。在此之前，老版本的浏览器都将最短间隔设为10毫秒。另外，对于那些DOM的变动（尤其是涉及页面重新渲染的部分），通常不会立即执行，而是每16毫秒执行一次。这时使用requestAnimationFrame()的效果要好于setTimeout()。

在node中，当第二个参数`delay`大于`2147483647`或小于 时`1`，`delay` 将设置为`1`。非整数延迟被截断为整数。

**停止定时器**

`window.clearTimeout (timeoutID)`    timeID为定时器的名字（所以我们上方说明了经常要给定时器加名字），这里的window也可以省略，调用该停止定时器方法后，定时器的调用函数不执行，时间被停止了



#### setInterval

`window.setInterval(回调函数, [间隔毫秒数])` 重复调用一个函数，每隔这个时间就去调用一次，写函数名函数不加括号、不带参数；window也可以省略，默认省略的话为0，同样我们也经常给该定时器加标识符（名字）

- 这里的关键点是第二个参数，间隔时间，指的是向队列添加新任务之前等待的时间，
- 比如调用setTimeout的时间为`01:00:00`，间隔时间为300毫秒，这意味着 `01:00:03`时，浏览器才会把任务添加到执行队列里，浏览器不关心这个任务什么时候执行，或者执行要花多长时间
- 因此到了 `01:00:06`，它会在想队列中添加一个任务

`JavaScript`中使用 `setInterval` 开启轮询。定时器代码可能在代码再次被添加到队列之前还没有完成执行，结果导致定时器代码连续运行好几次，而之间没有任何停顿。而`javascript`引擎对这个问题的解决是：当使用`setInterval()`时，仅当没有该定时器的任何其他代码实例时，才将定时器代码添加到队列中。这确保了定时器代码加入到队列中的最小时间间隔为指定间隔。

**停止setInterval定时器**

`window.clearInterval(intervalID)` 同停止定时器

利用定时器自动调用事件

例如调用在js中的某点击事件

```js
// 自动播放轮播图
    let timer = setInterval(function () {
        arrow_r.click();
    }, 2000);
})
```

通常来说不建议使用 `setInterval`。第一，它和 `setTimeout` 一样，不能保证在预期的时间执行任务。第二，它存在执行累积的问题，请看以下伪代码

```js
function demo() {
  setInterval(function(){
    console.log(2)
  },1000)
  sleep(2000)
}
demo()
```

以上代码在浏览器环境中，如果定时器执行过程中出现了耗时操作，多个回调函数会在耗时操作结束以后同时执行，这样可能就会带来性能上的问题。





#### 定时器的问题

关于定时器延时比设定更久的原因：

最小延时 >=4ms（也就是说有4ms的延时）

在浏览器中，`setTimeout()/`[`setInterval()`](https://developer.mozilla.org/zh-CN/docs/Web/API/WindowOrWorkerGlobalScope/setInterval) 的每调用一次定时器的最小间隔是4ms（不过，Chrome 已将其更改为 2 毫秒，并且显然存在[一些问题](http://code.google.com/p/chromium/issues/detail?id=888)。），这通常是由于函数嵌套导致（嵌套层级达到一定深度），或者是由于已经执行的setInterval的回调函数阻塞导致的。例如：

```js
function cb() { f(); setTimeout(cb, 0); }
setTimeout(cb, 0);
```

```js
setInterval(f, 0);
```

如果想在浏览器中实现0ms延时的定时器，你可以参考（使用postMessage自己写一个定时器函数加载window对象上）

https://dbaron.org/log/20100309-faster-timeouts

因此，在间隔时间极端的情况下，不建议使用定时器





#### requestAnimationFrame

（IE9-浏览器不支持该方法）官方解释：若你想在浏览器下次**重绘**之前继续更新下一帧动画，那么回调函数自身必须再次调用`window.requestAnimationFrame()`

- 参数：callback

  下一次重绘之前更新动画帧所调用的函数(即上面所说的回调函数)。
  
  注意：这个callback会自带一个参数：该回调函数**会被传入[`DOMHighResTimeStamp`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMHighResTimeStamp)参数**，该参数与[`performance.now()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Performance/now)的返回值相同，它表示`requestAnimationFrame()` 开始去执行回调函数的时刻。

有点像停留时间为 1 / 60 秒的`setTimeout`，默认每秒60帧，也就是 1000 / 60，采用系统时间间隔，保持最佳绘制效率，动画不会掉帧，自然流畅

对比起 `setInterval`和 `setTimeout`的优势

- requestAnimationFrame 会把每一帧中的所有DOM操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率，一般来说，这个频率为每秒60帧。
- 在隐藏或不可见的元素中，requestAnimationFrame将不会进行重绘或回流，这当然就意味着更少的的cpu，gpu和内存使用量。

```js
(function animloop() {
        render();
        window.requestAnimationFrame(animloop);
    })();
```

当然，requestAnimationFrame也有自己的消除定时器，需要传入requestAnimationFrame的id，而id来自于requestAnimationFrame的返回。

```js
let rafId = null;
(function animloop(time) {
        console.log(time,Date.now())
        render();
        rafId = requestAnimationFrame(animloop);
        //如果left等于50 停止动画
        if(left == 50){
            cancelAnimationFrame(rafId)
        }
    })();
```



对于requestAnimationFrame 任务类型的划分：

 W3C 工作组在 2015 年 9 月 22 日的一篇工作笔记[《Timing control for script-based animations》](https://www.w3.org/TR/animation-timing/) 中提到了 `animation task source` 这一概念，在该文中，确实将 animation frame request callback list 中的 callback 作为 task 处理。另外，在 [zone.js 中也将 requestAnimationFrame 划进 macrotask 分类中](https://github.com/angular/zone.js/blob/e9f68bedcba044cb0be1a4fbf41fb35b62ca9f25/STANDARD-APIS.md)。但 whatwg 规范中对 requestAnimationFrame callback 未明确出现任何 task 相关字眼，由于 whatwg 和 w3c 的分歧，我对 requestAnimationFrame 是否该划分为 task 存保留意见。

```js
setTimeout(() => {
  console.log('A')
}, 0)
requestAnimationFrame(() => {
  console.log('B')
  Promise.resolve().then(() => {
    console.log('C')
  })
})
/*多刷新几次
结果1：
B
C
A
结果2：
A
B
C
*/
```

执行 requestAnimationFrame callback 是 UI Render 的其中一步。

如果浏览器试图实现 60Hz 的刷新率，那么 UI Render 只需要每秒执行 60 次（每 16.7 ms）。如果浏览器发现『顶层浏览器上下文』无法维持住这个频率，可能会下调到可维持的 30Hz，而不是掉帧。（本规范并不对何时进行 render 做任何规定。）类似的，如果一个顶层浏览器上下文在后台运行，用户代理可能决定将该页面的刷新率降到 4Hz，甚至更低。

由于规范没有做约定，所以浏览器在 render 策略上有充分的自主性。既有可能出现每一轮 eventloop 后都 render 的现象，也有可能出现几十轮 eventloop 都不 render 的情况。



#### performance.now()

**`performance.now()`** 方法返回一个精确到毫秒的 [`DOMHighResTimeStamp`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMHighResTimeStamp)。

**警告：** 这个时间戳实际上并不是高精度的。为了降低像[Spectre](https://spectreattack.com/)这样的安全威胁，各类浏览器对该类型的值做了不同程度上的四舍五入处理。（Firefox 从 Firefox 59 开始四舍五入到 2 毫秒精度）一些浏览器还可能对这个值作稍微的随机化处理。这个值的精度在未来的版本中可能会再次改善；浏览器开发者还在调查这些时间测定攻击和如何更好的缓解这些攻击。

它和Date.now()不同的点：

1. 和 JavaScript 中其他可用的时间类函数（比如[`Date.now`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/now)）不同的是，`window.performance.now()`返回的时间戳没有被限制在一毫秒的精确度内，相反，它们以浮点数的形式表示时间，精度最高可达微秒级。
2. 另外一个不同点是，`window.performance.now()`是以一个恒定的速率慢慢增加的，它不会受到系统时间的影响（系统时钟可能会被手动调整或被 NTP 等软件篡改）。另外，`performance.timing.navigationStart + performance.now()` 约等于 `Date.now()`。



## 5.JS执行队列

**JS原先是单线程**，也就是说同一时间只能做一件事，但是单线程就意味着，所有任务需要排队，钱一个任务结束后，才能执行下一个任务，如果JS执行时间过长，就会造成页面的渲染不连贯，导致页面渲染加载阻塞

**多线程**十分强大，但是多线程同步比较复杂，并且危险，稍有不慎就会崩溃死锁 & 造成大量并发问题

而传统上，JS旨在用于简短，快速运行的代码片段，作为浏览器脚本语言，主要用途是与用户互动，以及操作DOM，所以JS比较适合单线程

为了解决这个问题，H5提出Web Worker标准，允许JS创建多个线程（实际上是“假”并发），于是JS出现了同步（单线程）和异步（现在的JS可以同时多个任务）     他们本质的区别是，这条流水线上各个流程执行的顺序不同

#### （1）同步和异步

同步任务都放在一个主线程上执行，形成一个执行栈，按顺序执行

异步任务：JS的异步是通过回调函数实现的，一般而言，异步任务有以下三种类型

1.普通事件，如click、resize等

2.资源加载，如load、error等

3.定时器，如setTimeout、setInterval等

#### （2）宏任务和微任务

这里需要注意的是new Promise是会进入到主线程中立刻执行（promise本身不是异步，只是里面的任务是异步的罢了），而promise.then则属于微任务

**宏任务(macro-task)**：是由宿主（Node、浏览器）发起的，比如整体代码script、setTimeOut、setInterval、postMessage

**微任务(mincro-task)**：由JavaScript自身发起，比如promise.then、process.nextTick(node)

微任务先执行，宏任务后执行

同步代码执行完成后，会先执行微任务队列。注意：此时会把所有微任务队列全部执行完。再去宏队列macrotask取出一个执行，如果宏任务执行过程中产生新的微任务，会跳过微任务继续执行并立即把微任务放到异步任务队列大池子中。当前宏任务执行完后，又去检查待执行的任务队列大池子，如果有微任务，就优先执行微任务，如果没有就继续执行宏任务队列

#### （3）执行机制

1.先执行执行栈中的同步任务

- 其实我们平时也可以在报错信息看到执行栈

  ```js
  function foo() {
    throw new Error('error')
  }
  function bar() {
    foo()
  }
  bar()
  ```

  ![](/simple-blog/BOM/zhan.png)

2.异步任务（回调函数）放入任务队列中（只要异步任务有了**运行结果**，就在"任务队列"之中放置一个事件。）

3."任务队列"中的事件，除了IO设备的事件以外，还包括一些用户产生的事件（比如鼠标点击、页面滚动等等）。只要指定过回调函数，这些事件发生时就会进入"任务队列"，等待主线程读取。

4.一旦执行栈所有同步任务执行完毕，系统就会按次序读取任务队列的异步任务，于是被读取的异步任务结束等待状态，进入执行栈，开始执行

注意：！！

所谓"回调函数"（callback），就是那些会被主线程挂起来的代码。**异步任务必须指定回调函数**，当主线程开始执行异步任务，就是执行对应的回调函数。（比如setTimeout(fn, time)，第一个参数为回调函数）

![](/simple-blog/BOM/JSzhixing.png)

有异步任务交给**异步进程**处理（新开一个线程用来执行那些异步任务，我们暂且称为**工作线程**），异步任务执行完毕后推入任务队列

当主线程执行完毕就来查询任务队列，取排在第一位的事件推入主线程处理，执行完再来取，不断循环，这个过程叫作**事件循环**   （实际上细分异步事件的优先级有宏任务和微任务，优先级：微任务>宏任务）

异步任务执行顺序不一定按照原来顺序，要取决于文件大小、操作系统调度机制等多方面原因



#### （4）node的执行机制

node的事件循环包括六大阶段，每个阶段都有一个自己的先进先出的队列，只有当这个队列的事件执行完或者达到该阶段的上限时，才会进入下一个阶段。

- timers阶段（setTimeout、setInterval的事件回调）
- pending callbacks 阶段：处理上一轮循环中少数未执行的I/O回调
- idle，prepare阶段：仅node内部使用
- poll阶段：会做两件事，适当条件下node阻塞在这里
  - 两件事情：
    1. 回到 timer 阶段执行回调
    2. 执行 I/O 回调
- check阶段：执行`setImmediate`回调
- close callbacks 阶段：执行socket的close回调

这导致了node和浏览器端执行**宏任务**和**微任务**的顺序不一样！！

不过！！在node新的版本逐步完善了，也就是node新版本标准和浏览器趋于相同 （V12.7以上）

**process.nextTick**

这个函数其实是独立于node的 Event Loop 之外的，它有一个自己的队列，当每个阶段完成后，如果存在 nextTick 队列，就会清空队列中的所有回调函数，并且优先于其他 microtask 执行。



一个小案例：（https://segmentfault.com/a/1190000023315304）

```javascript
setTimeout(() => {
  setTimeout(() => {
    console.log('setTimeout');
  }, 0);
  setImmediate(() => {
    console.log('setImmediate');
  });
}, 0);
```

1. 外层是一个`setTimeout`，所以执行他的回调的时候已经在`timers`阶段了
2. 处理里面的`setTimeout`，因为本次循环的`timers`正在执行，所以他的回调其实加到了下个`timers`阶段
3. 处理里面的`setImmediate`，将它的回调加入`check`阶段的队列
4. 外层`timers`阶段执行完，之后事件循环继续往后面的阶段走，进入`pending callbacks`，`idle, prepare`，`poll`，这几个队列都是空的，所以继续往下
5. 到了`check`阶段，发现了`setImmediate`的回调，拿出来执行
6. 然后是`close callbacks`，队列是空的，跳过
7. 又是`timers`阶段，执行我们的`console`

但如果把 `setTimeout`、 `setImmediate`放在外面会怎么样？

```javascript
console.log('outer');

setTimeout(() => {
  console.log('setTimeout');
}, 0);

setImmediate(() => {
  console.log('setImmediate');
});
```

结果是！多运行几次，结果不一样![](/simple-blog/BOM/node.png)

而其中的执行是这样子的：

1. 外层同步代码一次性全部执行完，遇到异步API就塞到对应的阶段
2. 遇到`setTimeout`，虽然设置的是0毫秒触发，但是被node.js强制改为1毫秒，塞入`timers`阶段
3. 遇到`setImmediate`塞入`check`阶段
4. 同步代码执行完毕，进入Event Loop
5. 先进入`times`阶段，检查当前时间过去了1毫秒没有，如果过了1毫秒，满足`setTimeout`条件，执行回调，如果没过1毫秒，跳过
6. 跳过空的阶段，进入check阶段，执行`setImmediate`回调

**最后总结的原因是**：

通过上述流程的梳理，我们发现关键就在这个1毫秒，如果同步代码执行时间较长，进入Event Loop的时候1毫秒已经过了，`setTimeout`执行，如果1毫秒还没到，就先执行了`setImmediate`。

每次我们运行脚本时，机器状态可能不一样，导致运行时有1毫秒的差距，一会儿`setTimeout`先执行，一会儿`setImmediate`先执行





## 6.location对象

location是window对象提供给我们的一个属性，用于获取或设置窗体的URL，并且可以用于解析URL，返回的是一个对象

URL：统一资源定位符是互联网上标准资源的地址，互联网上每个文件都有唯一的URL，它包含的信息支持文件的位置以及浏览器该如何使用它（URL也就是我们的网址）

组成：  protocol://host[:port]/path/[?query]#fragment

protocol：通信协议，即http、ftp等

host：主机（域名）

port：端口号，可选

path：路径，用  / 分隔

query：参数，以键对的形式，通过 & 分隔

fragment：片段， # 后面内容，常见于链接锚点

**location对象属性**：

`location.href`     获取或设置（实现页面跳转） 整个URL（最常见）

`location.hash`     URL散列值，Vue-Router、的hash模式、React路由的HashRouter 跳转原理

`location.host`     服务器名和端口号

`location.search` 返回参数（即query部分 ）（这不就是React的search传参吗？）

`location.assign()`  跟href一样，可以跳转页面，但是可以后退

`location.replace()` 同上，但是不能记录历史，不能实现后退功能

`location.reload()` 类似于F5刷新  （location.reload(true)为强制刷新，缓存一起没了）

等等



## 7.navigator对象

navigator对象包含浏览器的信息，它可以知道你是用的是pc端浏览器还是移动端浏览器，有很多属性，最常用的是userAgent，该属性值返回又客户机发送服务器user-agent头部的值

```html
<script> 	if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
	window.location.href = "../H5/index.html"; //手机
}
</script>
```

引入以上代码可以自动判断是进入了pc端浏览器还是移动端浏览器



此外，`navigator`还暴露了一些API，可提供浏览器和操作系统的状态信息

#### Geolocation API

- `navigator.geolocation`属性暴露了Geolocation API，可以让浏览器脚本感知当前设备的地理位置。这个API只在安全执行环境（HTTPS）中可用

手机GPS的坐标系统可能具有极高的精度，而IP地址的精度就要差的很多

不过浏览器也有可能会利用 Google Location Service（Chrome和Firefox）等服务确定位置。有时候，你可能发现自己并没有GPS，但浏览器给出的坐标却十分精确，是因为浏览器会收集所有可用的无线网络，包括Wifi和蜂窝信号，拿到这些信息后，再去查询网络数据库。

```js
navigator.geolocation.getCurrentPosition((position) => console.log(position), 
                                      	(err) => console.log(err))
```

第一个是回调成功的函数，传入的 postion参数，有众多属性，

比如其中  `postion.coordinates`对象有  `latitude` 经度， `longitude`维度、`alititude`海拔、speed设备移动速度

第二个接收失败回调函数



#### Connection State 

任何时候，都可以通过 `navigator.onLine`属性来确定浏览器的联网状态，该属性返回一个布尔值，表示浏览器是否联网。

```js
const connectionStateChange = () => console.log(navigator.onLine);
window.addEventListener('onLine', connectionStateChange)
window.addEventListener('offLine', connectionStateChange)
//设备联网
//true
//断网
//false
```



#### 视频录制

**屏幕共享**

```js
const mediaDevices = navigator.mediaDevices;
```

mediaDevices 是 Navigator 只读属性，返回一个 [`MediaDevices`](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices) 对象，该对象可提供对相机和麦克风等媒体输入设备的连接访问，也包括屏幕共享。

而 [`MediaDevices`](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaDevices) 接口的 `getDisplayMedia()` 方法提示用户去**选择和授权捕获展示的内容**或部分内容（如一个窗口）在一个 [`MediaStream`](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaStream) 里. 然后，这个媒体流可以通过使用 [MediaStream Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API) 被记录或者作为[WebRTC](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API) 会话的一部分被传输，也就是被 `MediaRecorder`传输

```js
const promise = navigator.mediaDevices.getDisplayMedia(constraints);
```

此时可以共享屏幕

```js
document.querySelector('#start').onclick = function() {
    if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia({
            video: true,
            audio: false
        }).then((stream) => {
            document.querySelector('#video').srcObject = stream;
        }).catch((err) => {
            console.error(err);
        })
    } else {
        alert('不支持这个特性');
    }
}
```



**屏幕录制**

**`MediaRecorder`** 是 [MediaStream Recording API](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream_Recording_API) 提供的用来进行媒体轻松录制的接口, 他需要通过调用 [`MediaRecorder()`](https://developer.mozilla.org/zh-CN/docs/Web/API/MediaRecorder/MediaRecorder) 构造方法进行实例化.

```js
new MediaRecorder(stream, [, options]);
```

`MediaRecorder.start(timeslice)`开启录制，timeslice是一个可选参数，设置了这个参数就会按照时间段存储数据



```js
const btn = document.querySelector('.button')
btn.addEventListener('click', async () => {
    //一个捕获的接口，此时会弹出一个弹窗，让你选择捕获哪里的，返回一个promise对象（视频流）
    //目前只能录屏幕，暂无法支持音频，在监听dataavailable、stop阶段出问题
    const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false
    })
    // MediaRecorder.isTypeSupported()方法会判断其 MIME 格式能否被客户端录制。
    const mime = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
    ? "video/webm; codecs=vp9"
    : "video/webm"
    //实例化录制接口
    const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
    })
    const chunks = []
    recorder.addEventListener('dataavailable', (e) => {
        chunks.push(e.data)
    })
    recorder.addEventListener('stop', () => {
        //视频流转blob，二进制数据
        const blob = new Blob(chunks, {
            type: chunks[0].type
        })
        let url = URL.createObjectURL(blob)
        //展示视频
        const video = document.querySelector('.video')
        video.src = url
        //下载
        const a = document.createElement('a')
        a.href = url
        a.download = 'video.webm' //设置a标签下载属性
        a.click()
    })
    recorder.start() //需要我们去手动启动
})
```

查看MIME 格式支持情况

```js
const types = ["video/webm",
               "audio/webm",
               "video/webm\;codecs=vp8",
               "video/webm\;codecs=daala",
               "video/webm\;codecs=h264",
               "audio/webm\;codecs=opus",
               "video/mpeg"];
for (var i in types) {
    console.log("Is " + types[i] + " supported? " + (MediaRecorder.isTypeSupported(types[i]) ? "Maybe!" : "Nope :("));
}
```

参考资料https://cloud.tencent.com/developer/article/1793748



## 7.history对象

用于与浏览器历史记录进行交互（实际上和浏览器自带的页面后退，前进功能一样）

实际开发用的少，但是一些OA办公系统会用到

`history.back()`    后退功能

`history.forward()`   前进功能

`history.go(参数)`   前进后退功能，参数是1前进一个页面，-1后退一个页面 



`history.pushState` 历史记录管理

hashchange 会在页面URL的散列变化时被触发，开发者可以在此时执行某些操作，而状态管理API则可以让开发者改变浏览器URL而不会重新加载页面。为此 可以使用`history.pushState()`方法

接收三个参数

- 一个state对象
- 一个新的状态标题
- 一个可选的 相对URL

`history.pushState(stateObj, "my title", "baz.html")`

执行后，状态信息会被推送到历史记录中，浏览器地址栏也会改变以反映新的相对URL，即使`location.href`返回的是地址栏中的内容，浏览器不会向服务器发送请求。

可以通过 `history.state`来获取当前的状态对象，也可以使用 `replaceState()`并传入与 `pushState()`同样的前两个参数来更新状态（覆盖状态）

注意：使用HTML5状态管理时，要确保通过 `pushState()`创造的每个“假”的URL背后都对应着服务器上一个真实的的URL，否则单击“刷新”按钮会导致404.所有单页面应用程序（SPA）框架都必须通过服务器或客户端的某些配置解决这个问题。

通过pushState的方式更改href和直接点击 `<a href="/后缀名">` 不同的是，后者会向服务器请求资源



## 8.获取CSS属性的值

`Window.getComputedStyle()`方法返回一个对象，该对象在应用活动样式表并解析这些值可能包含的任何基本计算后报告元素的所有CSS属性的值。 私有的CSS属性值可以通过对象提供的API或通过简单地使用CSS属性名称进行索引来访问。

```js
let style = window.getComputedStyle(element, [pseudoElt]);
```

对比直接获取 style ：

返回的对象与从元素的 [`style` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/style) 属性返回的对象具有相同的类型;然而，两个对象具有不同的目的。从`getComputedStyle`返回的对象是只读的，可以用于检查元素的样式（包括由一个`<style>`元素或一个外部样式表设置的那些样式）。`elt.style`对象应用于在特定元素上设置样式。