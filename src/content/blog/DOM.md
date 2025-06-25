---
author: Hello
categories: 前端
title: DOM
description: 'html相关'
---

## DOM基础

DOM：文档对象模型，是一个应用编程接口API

W3C已经定义了一系列的dom接口，可以改变网页内容、结构、样式

文档：一个页面就是一个文档，用document表示

元素：页面内的所有标签都是元素，用element表示

节点：网页中所有内容都是一个节点（注释，文本，属性等），用node表示

顶级对象是document

**注意**：因为文档是从上往下加载，所以script要写到文档标签的下面



### （1）获取页面元素

**前情提要**：

HTMLCollection是元素集合而NodeList是节点集合（即可以包含元素，也可以包含文本节点）。所以 node.childNodes 返回 NodeList，而 node.children 和 node.getElementsByXXX 返回 HTMLCollection 。



id获取（id是大小写敏感的字符串组成）

```html
<div id="time">2019</div>
    <script>
      var timer = document.getElementById('time'); /*返回的是一个元素对象*/
      console.dir(timer);   /*dir是打印返回的元素对象，更好的查看里面的属性方法*/
    </script>
</body>
```

根据标签名获取

```html
<script>
      // 返回的是获取过来的元素对象的集合，（无论多少个）以伪数组的形式储存
      var lis = document.getElementsByTagName('li');
      console.log(lis);
      console.log(lis[0]);
    // 可以使用element.getElementsByTagName('标签名')获取，但是父元素必须是单个对象，不能是伪数组之类的
      var oll = document.getElementsByTagName('ol');
      console.log(oll[0].getElementsByTagName('li'));

</script>
```

H5新增获取元素方法，根据类名获取

`document.getElementsByClassName('类名');`

H5新增的万能选择器，`querySelector`返回选择器的第一个元素对象，切记里面选择器需要加符号

`querySelectorAll`  返回指定选择器的所有对象集合（伪数组）



`querySelectorAll`和 `getElementsByTagName`对比

通过querySelectorAll获取的是返回的是`NodeListOf<HTMLElementTagNameMap[K]>`，经过了一次包装（有了一个包装对象！），保存的是当时状态的快照，所以是静态的，是死的，不会随着数据更新而改变，最好使用 `getElementsByTagName` （返回的是`HTMLCollection`）这些进行替代

它这样做的的原因是避免了使用NodeList对象可能造成的性能问题

里面的原理我们可以从typescript角度来观看 https://blog.csdn.net/HermitSun/article/details/95780715



伪数组可以使用es6的扩展运算符转化为数组：`let lis2 = [...lis]`

```js
 // 选择类名
var firstbox = document.querySelector('.box');
// 选择id
var secondbox = document.querySelector('#nav');
// 选择标签名
var thirdbox = document.querySelector('li');
//选择全部
var fourth = document.querySelectorAll('li');
```

多重嵌套进行选择

```js
var firstbox = document.querySelector('.box').quertSelector(li);
```

```js
var firstbox = document.querySelectorAll('.box .item')
```

获取body标签和html标签比较简单特殊

```js
//获取html
var htmlEle = document.documentElement;
// 获取body元素
var bodyEle = document.body;
```

**注意**：获取到的每个DOM元素都作为一个对象来使用！



### （2）事件基础

事件是可以被js侦测到的行为，触发--响应机制

事件由三部分组成：事件源（被触发对象）    事件类型（触发类型）   事件处理程序

一个简单的事件例子：

```html
<button id="btn">哈哈哈</button>
  <script>
    var btn = document.getElementById('btn');
    btn.onclick = function() {
      alert('哈哈哈');
    }
  </script>
```



### （3）操作元素

我们可以利用dom操作元素来改变元素里面的内容

`element.innerText`  从起始位置到终止位置的内容，但它除去html标签，空格换行也会去掉（非标准）

`element.innerHTML`    从起始位置到终止位置的内容，保留（识别）html标签和空格，换行（W3C标准）

（`element.textContent` 相当于innerText，只不过

- textContent 会获取style= “display:none” 中的文本，而innerText不会
- textContent 会获取style标签里面的文本、script标签里的文本，而innerText 不会 ）

同时，这两个标签是可读写的，可以获取元素里面的内容

```js
btn.onclick = function() {
	div.innerText = '2020';  /*点击后修改它的文字*/
    img.src = 'xxxx';		/*改变图片的src*/	
    img.title = 'xxxx';     /*改变图片的文字提示*/
    input.value = 'xxx'     /*改变表单的值*/
    this.disabled = true;    /*点击后此按钮后，此按钮被禁用，this指向的是事件函数的调用者*/
}
p.innerText = 'pp';   /*刷新页面直接修改它的文字*/
console.log(p.innerText);
```

修改样式（通过JS修改后，变成行内样式，权重比较高）

```js
div.onclick = function() {
    //1.样式比较少的话使用此方法
    //采用驼峰命名，原来的 background-color  ->  backgroundColor
	this.style.backgroundColor = 'purple'; 
    //2.另一个方法就是再写一个类，里面包含了所有你想要改变的样式，但是注意，它会覆盖原先的类名
    this.className = '样式名';
    //3.保留原先得类
    this.className = '原先样式名 新样式名'
}
```

表单的获取焦点

```js
var text = document.querySelector('input');
text.onfocus = function () {
//获得焦点
	if (this.value) {
 		this.value = '';
	}
	this.style.color = '#333'
}
text.onblur = function () {
//失去焦点
	if (this.value === '') {
		this.value = '手机';
	}
	this.style.color = '#999'
}
```

表单经过事件（类似于“  :hover ”）

```js
// 1.获取元素 获取的是 tbody 里面所有的行
var trs = document.querySelector('tbody').querySelectorAll('tr');
// 2. 利用循环绑定注册事件
for (var i = 0; i < trs.length; i++) {
// 3. 鼠标经过事件 onmouseover
	trs[i].onmouseover = function() {
		this.className = 'bg';
	}
// 4. 鼠标离开事件 onmouseout
	trs[i].onmouseout = function() {
		this.className = '';
	}
}
```

全选框小案例：

```js
// 获取元素
var Btn_All = document.getElementById('Btn_All'); // 全选按钮
var Btns = document.getElementById('Btns').getElementsByTagName('input'); // 下面所有的复选框
//1.让下面所有复选框的checked属性（选中状态） 跟随 全选按钮即可
Btn_All.onclick = function () {
	for (var i = 0; i < Btns.length; i++) {
		Btns[i].checked = this.checked;
	}
}
// 2. 每次点击，都要循环查看下面所有的复选框是否有没选中的，如果有一个没选中的， 上面全选就不选中。
for (var i = 0; i < Btns.length; i++) {
	Btns[i].onclick = function () {
		var flag = true;
		for (var i = 0; i < Btns.length; i++) {
			if (!Btns[i].checked) {
				flag = false;
				break; 
			}	
		}
		Btn_All.checked = flag;
	}
}
```



### （4）自定义属性

js的两种元素属性获取方法：

`element.属性`获取属性

`element.getAttribute('属性')`也是获取属性，不过这个可以获取自定义属性

自定义属性：`<div id="demo" index="1"></div>`    中的index



设定属性值：

`element.属性 = 值`     设置内置属性

`element.setAttribute('属性','值')`  同上，主要设置自定义属性，它的class比较特殊，不使用className，使用class，如 div.setAttribute('class', 'footer'); 

- name

表示属性名称的字符串。[`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)指定要设置其值的属性的名称。`setAttribute()`在 HTML 文档中的 HTML 元素上调用时，属性名称会自动转换为全部小写。

- value

属性的值/新值。一个[`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String)包含了分配给这个属性的值。任何非字符串的值都会被自动转换为字符串。



移除属性：`element.removeAttribute('属性名')`

是否拥有该属性：`element.hasAttribute('属性名')`

**H5规范：**H5规定自定义属性以“data-”作为开头，并且赋值，比如 `<div data-index="1"></div>`

H5新增获取自定义属性的方法：`div.dataset.index`（属性名为data-index）， `div.dataset.listName`(属性名为data-list-name) ，dataset是一个集合里面存放了所有以data开头的自定义属性



### （5）节点操作

dom提供的获取元素方法比较繁琐，利用节点父子兄弟关系获取元素比较方便，但是兼容性差

在DOM的所有节点中都实现了Node这个接口

一般的，节点至少拥有节点类型（nodeType）、节点名称（nodeName）、节点值（nodeValue）

元素节点 nodeType = 1    节点操作一般都是操作元素节点，唯一使用attributes属性的DOM节点类型

属性节点 nodeType = 2

文本节点 nodeType = 3

（总共有12种节点，以下展示部分节点）

![](/DOM/jiedian.jpg)

父亲节点： `node.parentNode` (得到的是离元素最近的父节点，找不到父节点返回空值)

孩子节点： `node.childNodes` 返回包含节点的子节点的集合(NodeList，因为繁琐，所以实际开发不提倡使用childNodes)

```
var ul = document.querySelect('ul');
for (var i = 0; i < ul.childNodes.length; i++) {
	if(ul.childNodes[i].nodeType == 1) {
		console.log(lu.childNodes[i]);
	}
}
```

(new) 孩子节点： `parentNode.children`  返回所有子元素节点  （常用,HTMLCollection）

`parentNode.firsElementtChild` 返回第一个元素子节点，找不到返回null

`parentNode.firstChild` 返回第一个元素子节点，找不到返回null

`parentNode.lastChild` 返回最后一个元素子节点，找不到返回null

这两个方法有兼容问题ie9以上才能使用

所以推荐写法： `parentNode.children[0]`         `parentNode.children[parentNode.children.lenth-1]` 

下一个兄弟元素节点：`node.nextElementSibling`    找不到返回null

上一个兄弟元素节点：`node.previousElementSibling`    找不到返回null  

这两个方法有兼容问题ie9以上才能使用 



**创建节点** `document.createElement('targetName')`  动态创建节点 

**创建文本节点** `document.createTextNode(vNode)` 

**添加节点** `node.appendChild(child)` 创建完后需要添加节点，此方法是将一个节点添加到指定父节点的子节点列表末尾，类似于CSS中的after伪元素 ,child写名称不用加 ‘  ’（不支持追加字符串子元素）

**获取父节点** `parentElement = node.parentElement`

or： `node.insertBefore(child, 指定元素（子节点）)` 将一个节点添加到父节点指定的子节点**前面**

```js
var li = document.createElement('li');
var ul = document.querySelector('ul');
ul.appendChild(li);

var li_2 = document.createElement('li');
ul.insertBefore(li_2, ul.children[0]);  /*添加至开头*/

var h=document.createElement("H1")
var t=document.createTextNode("Hello World");
h.appendChild(t);  /*创建一个标题 (H1), 你必须创建 "H1" 元素和文本节点:*/
```

发表评论案例：

```js
<textarea name="" id=""></textarea>
    <button>发布</button>
    <ul></ul>
    <script>
        var btn = document.querySelector('button');
        var text = document.querySelector('textarea');
        var ul = document.querySelector('ul');
        btn.onclick = function() {
            if (text.value == '') {
                alert('您没有输入内容');
                return false;
            } else {
                var li = document.createElement('li');
                //并且添加删除功能
                li.innerHTML = text.value + "<a href='javascript:;'>删除</a>";
                //javascript:;意思是页面不发生跳转
                ul.insertBefore(li, ul.children[0]);
                //删除元素
                var as = document.querySelectorAll('a');
                for(var i = 0; i < as.length; i++) {
                    as[i].onclick = funciton() {
                        ul.removeChild(this.parentNode)
                    }
                }
            }
        }
    </script>
```

删除节点：`node.removeChild(child)` 返回删除的节点

`node.remove()`  返回删除的节点（）删除本身

复制节点： `node.cloneNode()`  克隆完节点之后，和创建节点一样也必须要添加节点才能显示出来

1.如果括号参数为空，是浅拷贝，只克隆该节点本身，不克隆其子节点，即没有任何内容	

 `node.cloneNode(true)` 深拷贝  复制标签并且复制里面的内容 



### （6）创建标签的四种方法：

1.`element.write()` 写入内容（标签），但是页面文档流加载完毕，如果在页面加载完成后再调用 `document.write()`，则会重写整个页面

```html
<script type="text/javascript">
    window.onload = function() {
        document.write("hello, world"); //hello world 重写整个页面
    }
</script>
```

2.`element.innerHTML`    从起始位置到终止位置的内容，保留（识别）html标签和空格，换行（W3C标准）

同时，这两个标签是可读写的，可以获取元素里面的内容

 3.`document.createElement('targetName')`  动态创建节点

 `document.createElement('targetName')`对比使用`element.innerHTML` 写多个标签会更省时，省空间，因为他创建多个标签时不用开辟新的空间，而innerHTML使用拼接的原理，所以每次都要要开辟新的空间

但是，如果`element.innerHTML` 不用拼接字符串的方法来实现创建多个标签，而是采用数组的形式拼接，结构写麻烦一点：

```js
var arr[];
for(var i = 0; i < 100; i++) {
	arr.push('<a href="#">百度</a>');
}
//以''进行拼接，并且转化为字符串
xx.innerHTML = arr.join('');
```

执行起来会比 `document.createElement('targetName')` 更快，但是结构不太清晰	

4. `element.insertAdjacentHTML(插入的位置, 插入的字符串)`可以直接把字符串格式元素添加到父元素中

   ```js
   element.insertAdjacentHTML("beforebegin", "<a href="#">百度</a>");
   ```

插入位置：beforebegin 元素自身前面                                             afterbegin  插入元素内部第一个子节点之前

​                   beforeend  插入元素内部的最后一个子节点之后        afterend  元素自身的后面

（注意：appendChild不支持追加字符串子元素，insertAdjacentHTML支持追加字符串子元素）

5. `document.createDocumentFragment()`

   有点类似 `document.createElement('targetName')` ，区别在于：

   （1）需要很多的插入操作和改动，使用createElement效率是比较低的，而innerHTML拼接方法灵活性比较差，利用DocumentFragment，可以弥补这两个方法的不足

   （2）createDocumentFragment创建的元素使用innerHTML并不能达到预期修改文档内容的效果

   （3）createDocumentFragment创建的元素是一次性的，添加之后再就不能操作了

   （4） 通过`createElement`新建元素必须指定元素`tagName`,因为其可用`innerHTML`添加子元素。通过`createDocumentFragment`则不必。

   （5）通过`createElement`创建的元素插入文档后，还可以取到创建时的返回值
   
6. `element.outerHTML`类似于 `innerHTML`的效果，只不过是起到了replace的效果



### （7）Shadow DOM

我们正常的dom结构就是一颗dom树

*Shadow* DOM 允许将隐藏的 DOM 树附加到常规的 DOM 树中——它以 shadow root 节点为起始根节点，在这个根节点的下方，可以是任意元素，和普通的 DOM 元素一样。

你也可以理解为：

一个 DOM 元素可以有以下两类 DOM 子树：

1. Light tree（光明树） —— 一个常规 DOM 子树，由 HTML 子元素组成。我们在之前章节看到的所有子树都是「光明的」。
2. Shadow tree（影子树） —— 一个隐藏的 DOM 子树，不在 HTML 中反映，无法被察觉。

这里举了一个很好的例子，shadow dom 就像一个video：https://www.cnblogs.com/coco1s/p/5711795.html

![](/DOM/shadowdom.png)

创建方式： `elem.attachShadow({mode: …})`

`mode` 选项可以设定封装层级。他必须是以下两个值之一：

- `「open」` —— shadow root 可以通过 `elem.shadowRoot` 访问。

  任何代码都可以访问 `elem` 的 shadow tree。

- `「closed」` —— `elem.shadowRoot` 永远是 `null`。

  我们只能通过 `attachShadow` 返回的指针来访问 shadow DOM（并且可能隐藏在一个 class 中）。浏览器原生的 shadow tree，比如 `<input type="range">`，是封闭的。没有任何方法可以访问它们。

你可以使用同样的方式来操作 Shadow DOM，就和操作常规 DOM 一样——例如添加子节点、设置属性，以及为节点添加自己的样式（例如通过 `element.style` 属性），或者为整个 Shadow DOM 添加样式（例如在 [``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/style) 元素内添加样式）。不同的是，Shadow DOM 内部的元素始终不会影响到它外部的元素（除了 [`:focus-within`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/:focus-within)），这为封装提供了便利。



## 事件部分

### 1.注册事件

传统方式：

`btn.onclick = function() {}`  注册事件唯一性，最后注册处理的函数会覆盖掉前面注册处理的函数，即一个元素只能设置一个处理函数

w3c标准的推荐方式：（ie9以前不支持此方法，即ie8等不支持）

```js
target.addEventListener(type, listener, options);
target.addEventListener(type, listener, useCapture);
```

（ie9以前使用的是`eventTarget.attachEvent(type, listener[, useCapture]);`）

- type：事件类型，如click，mouseover，不带on
- listener：事件处理，事件发生时会调用其监听函数
- useCapture：可选参数，默认false，一个布尔值，表示 `listener` 会在该类型的事件捕获阶段传播到该 `EventTarget` 时触发。
- option：一个指定有关 `listener `属性的可选参数**对象**。
  - `capture`:  [`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean)，表示 `listener` 会在该类型的事件捕获阶段传播到该 `EventTarget` 时触发。
  - `once`:  [`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean)，表示 `listener 在添加之后最多只调用一次。如果是` `true，` `listener` 会在其被调用之后自动移除。
  - `passive`: [`Boolean`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Boolean)，设置为 true 时，表示 `listener` 永远不会调用 `preventDefault()`。如果 listener 仍然调用了这个函数，客户端将会忽略它并抛出一个控制台警告。查看 [使用 passive 改善的滚屏性能](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener#使用_passive_改善的滚屏性能) 了解更多。
  - `signal`：[`AbortSignal`](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortSignal)，该 `AbortSignal` 的 [`abort()`](https://developer.mozilla.org/zh-CN/docs/Web/API/AbortController/abort) 方法被调用时，监听器会被移除。

```js
btn.addEventListener('click', function() {  //必须要字符串
	alert(xxx);
})
btn.addEventListener('click', function() {  //必须要字符串
	alert(yyy);
})
```

同一个元素同一个事件可以添加多个监听器，不会覆盖掉



### 2.解绑事件

传统方式：

`eventTarget.onclick = null` 

如 `div.onclick = function() {alert();  div.onclick = null;}`  在点击一次之后删除该事件

方法监听方式：`eventTarget.removeEventListener(type, listener[, useCapture]);`

（ie9以前使用的是`eventTarget.detach(type, listener[, useCapture]);`）

方法监听方式来解绑事件不能用匿名函数的方法，即 `var fun=function(){}` 所以使用以下策略

```js
div.addEventListener('click', fn);
function fn() {
	alert(xx);
	div.removeEventListener('click', fn);
}
```

使得目标div在点击一次之后解绑事件



### 3.dom事件流

事件发生时会在元素节点之间按照特定的顺序传播（document->Element gtml->Element body->Element div），这个传播过程即DOM事件流

DOM事件流分为**三个阶段** ：（执行顺序也是如此 捕获 - > 当前 -> 冒泡）(记住是三个，还有一个目标阶段！！！)

1.捕获阶段（从大往小传播，从最顶层开始，然后逐级向下传播到具体元素接收的过程） 

 2.当前目标阶段  

3.冒泡阶段（从小到大，从里到外的传播，由最具体的元素接收，然后逐级向上传播到DOM最顶层节点的过程）

注意：

- JS代码只能执行捕获或者冒泡其中一个阶段（除非你设置两个监听函数，一个执行捕获，一个执行冒泡）； 
- 传统**注册**事件方式（onclick、attachEvent）只能得到冒泡阶段，`eventTarget.addEventListener(type, listerner[, useCapture])`第三个参数如果是true，则在事件捕获阶段调用程序，如果是false（默认），则在冒泡阶段调用事件
- 如果事件触发在“当前目标阶段”，则当前目标会根据事件注册的先后顺序执行，而不是上面提及到的  捕获 - > 当前 -> 冒泡，比如：爷节点，父节点，子节点都绑定了 捕获事件和监听事件，而触发子节点的事件，执行爷、父的事件执行顺序一定是  捕获 - > 当前 -> 冒泡；而子节点是根据事件注册的先后顺序来执行捕获 or 冒泡事件，说白了就是无关了。



以下代码，son包含于father内，使用捕获阶段（true），则点击son后先执行father再执行son，冒泡阶段则相反

```html
<div class="father">
	<div class="son">son盒子</div>
</div>
<script>
	var son = document.querySelector('.son');
	son.addEventListener('click', function() {
		alert('son');
	}, true);
	var father = document.querySelector('.father');
	father.addEventListener('click', function() {
		alert('father');
	}, true);
</script>
```

但是实际开发中我们更关注的是冒泡，且有些事件是没有冒泡的，如onblur，onfocus，onmouseenter，onmouseleave

事件委托就是利用事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件：比如通过冒泡父元素管理多个子元素的事件



### 4.事件对象

`div.addEventListener('click', funciton(event){} )` 中的event为事件对象，写到我们监听函数的小括号里，当形参看

事件对象只有有了事件才会存在，它是系统自动为我们创建的，不需要我们传递参数

事件对象是我们事件一些列相关数据的集合

事件对象也有兼容性问题，比如ie6、7、8，通过window.event获取

常见事件对象属性（对低版本浏览器有兼容性问题）：

```js
div.addEventListener('click', function(e) {
	console.log(e.target);
	console.log(this);     /*两者有些许相似，但是e.target返回的是触发事件的元素，this返回的是绑定事件的对象（元素）*/
    console.log(e.type);  //返回事件类型
    e.preventDefault();  //阻止默认事件，让它成为一个普通盒子，比如让链接不跳转，让input不提交等
    e.stopPropagation(); //阻止事件冒泡，使得触发子事件后，不会相应触发父事件，不会向外传播
})
```

ie6\7\8

```js
div.onclick = function() {
	console.log(e.srcElement); //返回的是触发事件得元素
	e.returnValue;             // 阻止默认事件
/*我们可以利用return false 也能阻止默认行为 没有兼容性问题 特点： return 后面的代码不执行了， 而且只限于传统的注册方式*/
	return false;
    window.e.cancelBubble = true;    //阻止冒泡
}
```



### 5.事件委托

事件委托也称为事件代理，在JQuery称为事件委派，它提高了程序性能

若多个子节点同时有事件，不需要将每个子结点单独设置事件监听器，而是将事件监听器设置在父节点上，然后利用冒泡原理影响每个子节点，使得每个子节点反馈到父节点，触发父节点的事件



### 6.常用的鼠标事件

鼠标右键菜单： `contextmenu`         鼠标选中：`selectstart`

`dblclick` 鼠标双击事件

`mousedown`  鼠标按下

`mousemove`  鼠标移动 ，mousemove是鼠标指针在元素内部移动式重复触发的事件，可用于鼠标指针定位实时变化的案例

`mouseup`  鼠标松开

`mouseover`  鼠标经过， 类似于“  :hover ”    它不仅经过自身盒子会触发，经过子盒子还会再触发一次

`mouseout`    鼠标离开元素，和mouseover相互搭配

 `mouseenter`  鼠标移动到元素上，只会经过自身盒子才触发一次，之所以会这样，是因为mouseenter不会冒泡

`mouseleave`  鼠标离开元素，和mouseenter相互搭配，同样不会冒泡

`wheel`鼠标滚轮事件

- scroll事件在滚动条滚动的时候被触发

  wheel在鼠标滚轮滚动的时候被触发 由于鼠标滚轮滚动时大部分会触发scroll事件 所以时wheel事件先触发

`focus` 获得焦点

`blur`失去焦点

```js
//禁用鼠标右键 
document.addEventListener('contextmenu', function(e) {
	e.preventDefault();
})
//禁止选中文字
document.addEventListener('selectstart', function(e) {
	e.preventDefault();
})
```

（e代表事件对象，可视区域为除去收藏夹、网址等部分）

`e.clientX` 返回鼠标对于浏览器窗口可视区域的X坐标

`e.clientY` 返回鼠标对于浏览器窗口可视区域的Y坐标

`e.pageX` 返回鼠标相对于文档页面的X坐标，ie9+支持 （无滚动时同clientX）

`e.pageY` 返回鼠标相对于文档页面的Y坐标，ie9+支持   （无滚动时同clientY）

`e.screenX` 返回鼠标相对于电脑屏幕的X轴坐标

`e.screenY` 返回鼠标相对于电脑屏幕的Y轴坐标

 pink老师天使跟随鼠标案例

```html
<style>
	img {
		position: absolute;
	}
</style>
<body>
	<img src="images/angel.gif" alt="">
	<script>
		var pic = document.querySelector('img');
		document.addEventListener('mousemove', function(e) {
			/*核心原理： 每次鼠标移动，我们都会获得最新的鼠标坐标， 把这个x和y坐标做为图片的top和left 值就可以移动图片*/
			var x = e.pageX;
			var y = e.pageY;
			//千万不要忘记给left 和top 添加px 单位
			pic.style.left = x - 50 + 'px';
			pic.style.top = y - 40 + 'px';
		});
	</script>
</body>
```



### 7.常用键盘事件	

`onkeyup`   某个按键松开时被触发  （松开瞬间）

`onkeydown`  某个按键被按下时被触发  （按下瞬间），按住会持续触发

`onkeypress`  同onkeydown   但是它不识别功能键如ctrl shift等，按住会持续触发

执行顺序down>press>up    **使用addEventListener不需要加on**          keyon和keydown不能区分大小写

 keyon和keydown不能区分大小写 （a和A得到的ASCII码值得到的都是65）

键盘事件  （e代表事件对象）

`e.keyCode`    返回该键ASCII码值                              `e.key`返回按下的键位值（字符串）

注意：keydown 和 keypress 在文本框（input）比较特殊，当它们两个事件触发的时候，文字还没落入文本框中

而keyup事件触发的时候，文字已经落入文本框，



### 8.input事件

`onchange` 当input失去焦点并且它的value值发生变化时触发，它也可用于单选框与复选框改变后触发的事件。

比如复选框发生改变（单击鼠标切换“打勾”/“不打勾”状态）

`oninput`  当input的value值发生变化时就会触发，（与onchange的区别是不用等到失去焦点就可以触发了）

此时通过 `event.target.value;`事件对象中的target的value可以获取input输入的值

`onfocus`   获得焦点事件

`onblur`  失去焦点事件

`input.select()`  	让文本框里的文字处于选定状态

```js
remember.addEventListener('change', function () {
    // 勾选上
    if (this.checked) {
        localStorage.setItem('username', username.value);
    } else {
        localStorage.removeItem('username')
    }
})
```



### 9.拖拽事件

HTML 的 drag & drop 使用了 [`DOM event model`](https://developer.mozilla.org/zh-CN/docs/Web/API/Event) 以及从 [`mouse events`](https://developer.mozilla.org/zh-CN/docs/Web/API/MouseEvent) 继承而来的 *[`drag events`](https://developer.mozilla.org/zh-CN/docs/Web/API/DragEvent)* 。一个典型的拖拽操作是这样的：用户选中一个*可拖拽的（draggable）*元素，并将其拖拽（鼠标不放开）到一个*可放置的（droppable）*元素，然后释放鼠标。

在操作期间，会触发一些事件类型，有一些事件类型可能会被多次触发（比如`drag (en-US)` 和 `dragover (en-US)` 事件类型）。

所有的 [拖拽事件类型](https://developer.mozilla.org/zh-CN/docs/Web/API/DragEvent#event_types) 有一个对应的 [拖拽全局属性](https://developer.mozilla.org/zh-CN/docs/Web/API/DragEvent#globaleventhandlers)。每个拖拽事件类型和拖拽全局属性都有对应的描述文档。下面的表格提供了一个简短的事件类型描述，以及一个相关文档的链接。

| 事件                | On 型事件处理程序                                            | 触发时刻                                                     |
| :------------------ | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `drag (en-US)`      | [`ondrag`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/drag_event) | 当拖拽元素或选中的文本时触发。                               |
| `dragend (en-US)`   | [`ondragend` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragend_event) | 当拖拽操作结束时触发 (比如松开鼠标按键或敲“Esc”键). (见[结束拖拽 (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#dragend)) |
| `dragenter (en-US)` | [`ondragenter` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragenter_event) | 当拖拽元素或选中的文本到一个可释放目标时触发（见 [指定释放目标 (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#droptargets)）。 |
| `dragexit`          | [`ondragexit` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragleave_event) | 当元素变得不再是拖拽操作的选中目标时触发。                   |
| `dragleave (en-US)` | [`ondragleave`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dragleave_event) | 当拖拽元素或选中的文本离开一个可释放目标时触发。             |
| `dragover (en-US)`  | [`ondragover` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragover_event) | 当元素或选中的文本被拖到一个可释放目标上时触发（每 100 毫秒触发一次）。 |
| `dragstart (en-US)` | [`ondragstart` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/dragstart_event) | 当用户开始拖拽一个元素或选中的文本时触发（见[开始拖拽操作 (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#dragstart)）。 |
| `drop (en-US)`      | [`ondrop`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/drop_event) | 当元素或选中的文本在可释放目标上被释放时触发（见[执行释放 (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#drop)）。 |

> **注意：**当从操作系统向浏览器中拖拽文件时，不会触发 `dragstart` 和`dragend` 事件。

在浏览器才有这个事件，移动端好像没有（至少我试了好像不太行）

```html
<div    
     key={component.type}    
     draggable   
     onDragStart={() => handleDragStart(component)}   
  className="editor-left-item">   
  <span>{component.label}</span>   
  <div>{component.preview()}</div> 
</div>
```



### 10.动画结束事件

`onAnimationEnd`:

该事件在[CSS 动画](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)完成**`animationend`**时触发。如果动画在完成之前中止，例如元素从 DOM 中移除或动画从元素中移除，则不会触发该事件。`animationend`

[句法](https://developer.mozilla.org/en-US/docs/Web/API/Element/animationend_event#syntax)

在诸如 之类的方法中使用事件名称[`addEventListener()`](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)，或设置事件处理程序属性。

```
addEventListener('animationend', (event) => {});

onanimationend = (event) => { };
```
