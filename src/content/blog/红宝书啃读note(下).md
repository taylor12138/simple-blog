---
author: Hello
categories: 前端
title: 红宝书啃读note(下)
description: 'js相关知识'
---

## 第12章BOM

BOM核心是window对象，window对象在浏览器有双重身份，一个是ECMAScript的Global对象，一个就是浏览器窗口的JavaScript接口。



**窗口关系**

top对象始终指向最上层窗口，即浏览器窗口本身

parent对象始终指向当前窗口的父窗口，如果当前窗口是最上层窗口，则parent = top

self对象始终指向window，是window的终极属性，实际上self和window就是同一对象，暴露self是为了和top、parent保持一致



**导航和打开新窗口**

`window.open()`用于导航到指定的URL，分别接受四个参数，返回一个对新建窗口的引用

- 加载的URL

- 目标窗口

  - 如果不是已有窗口，则会打开一个新的窗口或标签页

- 特性字符串（配置）

  - 以逗号分隔，设置字符串

  - 比如fullscreen，表示窗口是否最大化；height，新窗口的高度

- 新窗口在浏览器历史记录中是否替代当前加载页的布尔值（通常不传这个参数）

```js
let wroxWin = window.open("https//www.wrox.com/", "wroxWindow", "height=400, width=400, top=10, left=10, resizable=yes")
```

而弹出窗口有点时间被在线广告用滥了，于是，IE7之后、Firefox、Opera等开始弹窗施加限制；此外网页加载过程中调用`window.open()`没有效果，而且可能导致向用户显示错误，弹窗通常可能在鼠标点击或按下键盘中的某个键才能打开。

弹窗屏蔽：所有现代浏览器都内置了屏蔽弹窗的程序，如果是浏览器内置的弹窗屏蔽组织了弹窗，那么 `window.open()`返回null

```js
let wroxWin = window.open("https//www.wrox.com", "_blank");
if (wroxWin == null) {
  alert("The popup was block")
}
```

如果是浏览器拓展或者其他程序屏蔽弹窗时，`window.open()`通常会抛出错误



系统对话框

- `console.log()`
- `alert()`
- `confirm()` ，有点像`alert()`，但是确认框有两个按钮 `Cancel`、`OK`，返回一个布尔值
- `prompt()`，有点像 `confirm()`的升级版，还多了一个文本框让用户输入，prompt会返回文本框中的值



## 第13章客户端的检测

用户代理检测通过浏览器的用户代理字符串确定使用的是什么浏览器。用户代理字符串包含在每个HTTP请求头部，在JavaScript中可以通过 `navigator.userAgent`访问。

在服务器端，常见的做法是根据接收到的用户代理字符串确定浏览器并执行相应的操作。而在客户端，用户代理检测被认为是不可靠的（字符串可以造假）。

本来 `userAgent`是一个只读属性

```js
console.log(window.navigator.userAgent);
window.navigator.userAgent = 'foobar';  //无效
```

不过，通过简单的方法可以绕过这个限制，比如有些浏览器提供伪私有的 `__defineGetter__`方法，利用它可以篡改用户代理字符串。

```js
console.log(window.navigator.userAgent);
window.navigator.__defineGetter__('userAgent', () => 'foobar');  //无效
```



## 第14章DOM

得到的是当前节点在同一父节点下的兄弟节点: `node.previousSibling`和 `node.nextSibling`

是否有孩子节点： `hasChildNodes()`

`cloneNode()`：会返回与调用它的节点一模一样的节点，该方法接收一个布尔值参数，表示是否深复制

深复制会复制节点及其整个子DOM树，如果传入false，则只会复制调用该方法的节点。

注意：此方法并不会复制JavaScript属性，只复制了html属性

`document.URL`取得当前页面的完整URL

`document.domain`取得当前页面的域名，浏览器对domain属性还有一个限制，就是这个属性一旦放松就不能再收紧，比如把document.domain设置成A，就不能再设置成B了

```js
document.domain = 'baidu.com';
document.domain = 'google.com'; //收紧，错误
```

`document.referrer`取得来源



`element.attributes`获取当前元素所有属性，他最有用的场景是需要迭代元素上所有属性的时候，这时候往往是要把DOM结构序列化为XML或HTML字符串。

```js
function output(element){
	let pairs = [];
	let len = element.attributes.length;
	for(let i = 0; i < len; i++) {
		const attribute = element.attributes[i];
		pairs.push(`${attribute.nodeName} = ${attribute.nodeValue}`)
	}
	return pairs.join('');
}
```



用 `innerHTML`创建的 `script`标签永远不会被执行

逻辑上可以在JS修改CSS代码(除了IE)

```js
let style = document.createElement('style');
style.appendChild(document.createTextNode("body{background-color: red}"))
```





理解NodeList、HTMLCollection、NamedNodeMap是理解DOM编程的关键，这三个集合都是实时的，意味着它们的值都是“最新的”





`MutationObserver`接口：观察元素属性、子节点、文本或者前三者任意组合的变化

```js
let observer = new MutationObserver(() => console.log('<body> attributes changed'));
observer.observe(document.body, {attributes: true});
```

执行以上代码之后，body元素任何属性变化都会触发回调

它接受一个MutationRecord数组，保存着变化信息

```js
let observer = new MutationObserver((mutationRecords) => console.log(mutationRecords));
```

通常只要被观察元素不被垃圾回收，MutationObserver的回调都会相应DOM变化事件，从而被执行，若要提前终止回调，可以调用 `disconnect()`方法

```js
observer.disconnect()
```

个人感觉和  IntersectionObserver API 有所关联

`MutationObserver`的垃圾回收：

`MutationObserver`拥有对要观察的目标结点的弱引用，因为是弱引用，所以不会妨碍垃圾回收程序回收目标节点

然而目标节点对 `MutationObserver`有强引用，如果目标节点从DOM被移除，随后被垃圾回收，则关联的 `MutationObserver`也会被垃圾回收



## 第17章事件

使用click事件执行代码，有人认为，换成mousedown执行代码应用程序会更快，但是对于障碍用户使用的屏幕阅读器上，会导致代码无法执行，因为屏幕阅读器无法触发mousedown事件



`oncontextmanu`事件默认在网页出现点击鼠标右键弹出上下文菜单

contextmenu事件冒泡，因此只要给document指定一个事件处理程序就可以处理页面上的所有同类事件

这个时间可以在所有浏览器中取消，即使用`event.preventDefault`



`hashchange`事件：用于URL散列值（#后面部分发生改变而回调的事件）

hashchange事件处理必须交付给window，，它的event对象有两个新属性：oldURL、newURL



## 第19章表单脚本

表单可以通过按钮提交表单，也可以通过`form.submit()`提交表单。通过 `submit()`提交表单的时候，submit事件不会触发，因此在调用这个方法之前要先做数据验证。

表单提交的一个最大的问题是可能会提交2次表单。如果表单提交之后没有什么反应，那么没有耐心的用户可能会多次点击，结果造成服务器处理重复请求，甚至造成多次下单的严重后果！

解决方法：1.提交后禁用按钮；2.通过onsubmit事件处理程序取消之后的表单提交

同样的，也可以通过 `form.reset()`重置表单，但是与submit不同的是，`reset()`方法会像单击重置按钮一样触发reset事件

```js
let form = document.getElementById("myForm");
form.addEventListener("submit", (e) => {
	let target = e.target;
	let btn = target.elements["submit-btn"]; //name属性为submit-btn的在form内嵌的按钮
	btn.disabled = true;
})
```

注意这个功能不能直接通过提交按钮添加click事件来实现，因为不同的浏览器中触发事件的时间是不一样的，有些浏览器是触发时机：submit > click ；有一些是 submit < click9



跨浏览器得到/ 设置剪切板数据

```js
function getClipboardText(event) {
	var clipboardData = (event.clipboardData || window.clipboardData);
	return clipboardData.get("text");
}
function setClipboardText(event, value) {
    if(event.clipboardData) {
        return event.clipboardData.setData("text/plain", value);
    } else if (window.clipboardData) {
        return window.clip
    }
}
```



## 第20章JavaScript API

Notifications API 用于向用户显示通知，这里的通知很像alert

Notifications API又被滥用的可能性，因此会默认开启两项安全措施

- 通知只能在运行在安全上下文的代码中被触发
- 通知必须按照每个源的原则明确得到用户允许

```js
// 设置通知权限
Notification.requestPermission()
      .then(permission => {
        console.log(permission);
        const n = new Notification("我是通知，我在被调用");
        n.onshow = () => console.log('show');
        n.onclick = () => console.log('click');
        n.onclose = () => console.log('close');
        n.onerror = () => console.log('error');
      })
```

> 此项功能仅在[安全上下文](https://developer.mozilla.org/zh-CN/docs/Web/Security/Secure_Contexts)(HTTPS), 一些 [支持的浏览器](https://developer.mozilla.org/zh-CN/docs/Web/API/notification#browser_compatibility).



批量编码，通过 `TextEncoder` 的实例完成的，该实例上有一个 `encode`方法，接受一个字符串参数，并以Uni8Array故事返回每一个字符的UTF-8的编码

```js
const textEncoder = new TextEncoder();
const decodedText = 'foo'
const encodedText = textEncoder.encode(decodedText);
```



拖放事件

IE4最早在网页中支持图片和文本的拖放事件，IE5之后不断拓展

现在所有主流浏览器都实现了原生的拖放，在某个元素被拖动时，会按顺序触发以下事件（被拖动元素的事件）：`dragstart`、`drag`、`dragend`

`dragstart`触发之后，只要目标还在被拖动就会不断触发`drag`事件，类似于mousemove -> 拖动停止触发`dragend`

若是把元素拖动到目标上（放置位置所在元素的事件），则依次触发：`dragenter`、`dragover`、`dragleave`



大精度时间

```js
const t0 = Date.now();
foo();
const t1 = Date.now();
console.log(t1 - t1);
```

`Date.now()`只有毫秒级别的精度，如果foo执行的够快，则两者时间戳会相等

可以使用 High Resolution Time API : `Performance`

```js
const t0 = performance.now();
const t1 = performance.now();
console.log(t1 - t1);
```



template模板

在浏览器渲染的时候，不会吧template的内容渲染到页面上，它不属于活动文档，它是DocumentFragment。

它是批量向HTML添加元素的高效工具，不用一个一个 `appendChild` 。可以看得出Vue、React都有与它有异曲同工之妙在其中



影子DOM

主要解决 / 用于

1. dom树建立时能够实现维护自身边界的问题。这么说有点像vue的scope保证自身不会被外来修饰入侵或者污染。

   样式隔离

   ```javascript
   // Shadow DOM 内的样式不会影响外部
   shadowRoot.innerHTML = `
     <style>
       p { color: red; font-size: 20px; }
     </style>
     <p>这个样式只影响 Shadow DOM 内部</p>
   `;
   ```

2. 影子dom将对应的dom信息隐藏起来依然能在html文档里渲染出来。但不能通过**普通的js方法**获取到dom信息

3. 影子dom事件捕获遵从常规dom事件，在影子dom内部依然传递，同时也遵从事件冒泡，向整个文档的dom上传递事件。

4. 避免命名冲突

   ```
   // 外部有 id="title"，Shadow DOM 内部也可以有 id="title"
   // 它们不会冲突
   ```

mode：该引用是否可以被获取，open/closed，一般没人选closed

```js
const foo = document.querySelector('#foo');
const bar = document.querySelector('#bar');
const = openShadowDOM = foo.attachShadow({mode: 'open'});
const = openShadowDOM2 = bar.attachShadow({mode: 'open'});
console.log(foo.shadowRoot); // shadow-root
console.log(bar.shadowRoot); // null
console.log(openShadowDOM);  // shadow-root
console.log(openShadowDOM2); // shadow-root
```

利用影子DOM创造三种不同颜色得div

```js
for(let color of ['red', 'green', 'blue']){
    const div = document.createElement('div');
    const shadowDOM = div.attachShadow({mode: 'open'});
    document.body.appendChild(div);
    shadowDOM.innerHTML = `
		<p> Make me ${color}</p>
		<style>
			p {
				color: ${color}
			}  
		</style>
	`
}
```

影子DOM是为了自定义Web组件设计的，可以使用slot插槽嵌套dom片段（在其中同样可以看得出slot在Vue、React中的应用）

```js
document.body.innerHTML = `
      <div id="foo">
        <p>Foo</p>  
      </div>
    `;
document.querySelector('#foo')
    .attachShadow({ mode: 'open' })
    .innerHTML = `
      <div id="bar">
        <slot></slot>
      </div>
    `;
```

结果

```html
<div id="foo">
    #shadow-root(open)
    <div id="bar">
        <p>Foo</p>
    </div>
</div>
```



或者这样创建

```js
class GreetingCard extends HTMLElement {
    constructor() {
        super();
        
        const shadow = this.attachShadow({ mode: 'open' });
        
        shadow.innerHTML = `
            <style>
                .card {
                    border: 2px solid #333;
                    border-radius: 10px;
                    padding: 20px;
                    background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
                    max-width: 300px;
                }
                .title {
                    color: #333;
                    font-size: 24px;
                    margin-bottom: 10px;
                }
            </style>
            <div class="card">
                <h2 class="title">问候卡片</h2>
                <slot name="content">默认内容</slot>
            </div>
        `;
    }
}

customElements.define('greeting-card', GreetingCard);
```



## 第21章（错误处理和调试）

**finally子句**

try/catch语句中finally子句始终运行，try/catch块无法阻止finally块执行，即使是return语句

```js
function test(){
	try {
		return 2;
	} catch {
		return 1;
	} finally {
		return 0; // 始终运行，该函数始终返回0
	}
}
```



try/catch语句最好用在自己无法控制的错误上，假设你的代码中使用了一个大型JavaScript库某个函数，而该函数可能会有意或者处于错误而抛出错误。因为不能修改这个库的代码，就有必要通过try / catch 语句调用包装起来，对可能的错误进行处理。

如果你明确地知道自己的代码会发生某种错误，那么就不适合使用try / catch 语句



**error事件**

任何**没有**被try / catch 才处理的错误都会在window对象上触发error事件。在onerror事件处理程序中，任何浏览器都不会传入event对象。相反，会传入三个参数：

1. 错误信息
2. 发生错误的url
3. 行号

```js
window.onerror = (message, url, line) => {
	console.log(message);
}
```

> 注意：不同浏览器在使用这个错误处理事件存在明显的差异

这个事件处理应该是浏览器报告错误的最后一道防线，理想状态下，最好不要用到（message其实就是控制台打印的错误罢了）



抛出错误

在大型应用程序中，自定义错误通常在使用assert() 函数抛出错误。这个函数接受一个应该为true的条件，并在条件为false时抛出错误，下面是一个基本的assert函数

```js
function assert(condition, msg) {
	if(!condition) {
		throw new Error();
	}
}
```



## 第23章（JSON）

JSON是一种轻量的数据格式，方便地表示复杂数据结构

JSON语法支持表示三种类型的值（他虽然借用了JavaScript的语法，但是不要将他们混淆）

- 简单值：字符串、数值、布尔值和null（特殊值undefined不可以）
- 对象：第一种复杂数据类型
- 数组：第二种复杂数据类型

JSON的流行不仅仅因为语法和JavaScript类似，很大程度还是因为JSON可以被及解析成可用的JavaScript对象，与解析为DOM的XML相比，有很大优势

ECMAScript5增加了JSON全局对象，正式引入JSON能力，并且得到所有主流浏览器的支持

JSON对象有两个方法：

- `stringify()`：将JavaScript解析为JSON字符串
- `parse()`：将JSON解析为JavaScript值



有时候我们需要在`JSON.stringify()` 之上自定义 JSON序列化，可以在要序列化的对象中添加`toJSON`方法，序列化时会根据这个方法返回适当的JSON表示（原生的Date对象就有`toJSON`方法）

```js
const book = {
    title: 'allen',
    count: 0,
    toJSON: function () {
        return this.title;
    }
}
console.log(JSON.stringify(book)); //'allen'
```



## 第24章（网络请求和远程资源）

Headers对象

Headers对象和map对象极其相似，包括它的`get()`、`set()`、`has()`、`delete()`等实例方法

但特殊的点在于：

1. 初始化Headers对象时，可以放入键值对的对象

   ```js
   const sed = {foo: 'bar'}
   let h = new Headers(seed);
   let m = new Map(seed); //error
   ```

2. 一个HTTP头部字段可以有多个值，而Headers对象通过append方法添加多个值

   ```js
   h.append('foo', 'baz'); // 此时foo有bar、baz
   ```

   

Beacon API

很多分析工具需要在页面生命周期尽量晚一点的时候向服务器发送遥测或者分析数据，因此理想状态是通过浏览器的unload事件发送网络请求。

但是有一个问题，因为unload事件意味着浏览器没有任何理由发送任何位置结果的网络请求，例如在unload事件处理程序中创建的任何异步请求都会被浏览器取消，因此XMLHttpRequest或fetch不适合这个任务。分析工具可以强制发送同步请求，但是这样会导致用户要等待unload事件处理完成而延迟导航下一个页面

W3C引入了 Beacon API，它给navigator增加了一个sendBeacon方法

```js
navigator.sendBeacon(url, 请求参数)
```

- `sendBeacon()` 不一定在页面生命周期末尾使用，可以在任何时候使用
- 调用 `sendBeacon()` 后，浏览器会把请求添加到一个内部的请求队列，浏览器会主动发送队列中的请求
- 浏览器保证在原始页面已经关闭的情况下也会发送请求
- 状态码、超时和其他网络问题造成的失败完全是不透明的，不能通过编程解决
- 信标（beacon）请求会携带 `sendBeacon()` 时所有相关的cookie





## 第26章（模块）

ES6模块是作为一整块JavaScript代码而存在的，带有 `type="module"`属性的 script标签会告诉浏览器相关代码应该作为模块来执行

```html
<script type="module" src="xxxx"></script>
```

与传统JavaScript处理方式不同，所有模块都会像 `<scirpt defer>` 加载脚本一样按照顺序执行，解析到 `<script type="module">` 标签后会立即下载模块文件，但执行会延迟到文档解析完成。

所以模块标签的位置之只决定了文件什么时候加载，并不会影响哪个模块什么时候加载

**特点：**

- 启用 ES6 模块系统
- 支持 `import` 和 `export` 语句
- 默认采用严格模式（strict mode）
- 默认延迟执行（defer 行为）
- 具有独立的作用域，不会污染全局作用域
- 支持顶级 `await`

执行时机对比

| 属性            | 下载时机 | 执行时机       | 执行顺序   |
| :-------------- | :------- | :------------- | :--------- |
| 默认            | 阻塞解析 | 立即执行       | 按顺序     |
| `defer`         | 并行下载 | DOM解析完成后  | 按顺序     |
| `async`         | 并行下载 | 下载完成后立即 | 不保证顺序 |
| `type="module"` | 并行下载 | DOM解析完成后  | 按依赖关系 |



## 第27章（工作者线程）

工作者线程的价值：在单线程的JavaScript里，允许把主线程的工作转嫁给独立的实体，而不改变现有的单线程模型。

浏览器每打开一个页面，就会分配一个他自己的环境，每个页面有自己的内存、DOM、事件循环等，每个页面就是一个沙盒，不会相互干扰。对浏览器来说，管理多个环境是非常简单的，所以这些环境都是并行执行的。

使用工作者线程，浏览器可以在原始页面环境之外在分配一个完全独立的二级子环境，这个子环境不能依赖单线程交互的API（如DOM）等操作，但是可以与父环境并行执行代码（但是，Worker 线程可以`navigator`对象和`location`对象。）

**专用工作者线程**：只能被创建它的页面使用                                        `new Worker()`

**共享工作者线程**：可以被多个不同的上下文使用，包括不同的页面 `new ShareWorker()`

**服务工作者线程**：它主要用途用于拦截、重定向和修改页面发出的请求（它其实就是Service Worker）



但是由于启用工作者线程的代价很大，所以某些情况下可以考虑始终保持固定数量的线程活动，然后使用“线程池”
