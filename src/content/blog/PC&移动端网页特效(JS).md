---
author: Hello
pubDate: 2020-11-18 
categories: 前端
title: PC&移动端网页特效(JS)
description: 'js相关知识'
---

# PC端

## 1.offset元素偏移量

我们使用offset系列相关属性可以**动态**获取元素的位置（大小）（父亲要定位此功能才有用

`element.offsetTop`  返回元素相对带有定位父元素上方的偏移，不带单位，如果没有定位或者没有父元素则以body为准

`element.offsetLeft`  返回元素相对带有定位父元素左方的偏移，情况同上

`element.offsetWidth` 返回自身宽度大小，自身宽度+padding+border

`element.offsetHeight` 返回自身高度大小，同上

`element.offsetParent` 返回带有定位的父亲，否则返回body（element.parentNode 直接返回最近一级的父节点，不管父节点是否有定位）

#### offset和style的区别：

offset可以得到任意样式表的样式值                                         style只能得到行内样式表的样式值

offset系列获得的数值没有带单位                                             style.width获得的是带单位的字符串

offsetWidth等是包含padding+border                                    style.width获得不包含padding和border的值

offsetWidth等属性是只读属性，只能获取不能赋值                style.width是可读写属性，可以赋值

所以offset适合读值，style适合赋值改值

一张图解offset

![](/simple-blog/PC&移动端网页特效(JS)/offset.png)



## 2.元素可视区client

通过client系列的相关属性可以动态得到该元素的边框大小、元素大小等（与offset不同点是边框是否囊括其中）

`element.clientTop`      返回元素上边框的大小

`element.clientLeft`    返回元素左边框的大小

`element.clientWidth`   返回自身包括padding、内容区的宽度，不包含border，返回数值不带单位

`element.clientHeight`  同上，返回高度

- `clientHeight` 可以通过 CSS `height` + CSS `padding` - 水平滚动条高度 (如果存在)来计算.
- **备注:** 此属性会将获取的值四舍五入取整数。 如果你需要小数结果, 请使用 [`element.getBoundingClientRect()`](https://developer.mozilla.org/zh-CN/docs/Web/API/Element/getBoundingClientRect).



## （番外）立即执行函数

立即执行函数，不需要调用，直接执行

传统：

```js
function fn() {}
fn();
```

立执：

```js
(function(a, b) {}(1, 2))   //第一种
(function(a, b) {})(参数1, 参数2)   //第二种
```

立即执行函数最大的优点就是独立创建了一个作用域



## 3.元素滚动scroll

获取或设置一个元素的内容垂直滚动的像素数

有点像client，但是client是盒子的大小宽高，即使内容溢出后保持不变，但是scroll面对溢出状态的盒子，它提供的宽高与内容溢出的宽高相互关联。

以下的`element`，都是针对父盒子的，无论是事件监听or属性(记得父盒子小，子盒子要大于父盒子的大小，并且设置父盒子的css样式`overflow: scroll` 或者 `overflow: auto`)

```js
father.addEventListener('scroll', () => {
    console.log(father.scrollTop);
})
```



`element.scrollHeight`  返回自身高度，不含边框，不带单位，像`clientHeight`  +  超出文字部分高度

`element.scrollWidth`  返回自身宽度，不含边框，不带单位，像`clientWidth`  +  超出文字部分宽度

`element.scrollTop`   返回被滚动条卷上去的上方距离，返回数值不带单位（要有滚动条，且内容大于盒子，往下拉的时候才会有）

`element.scrollLeft`  返回被滚动条卷左的左侧距离，同上

(window的scroll没有`scrollTop`、`scrollLeft`，但是有个api可以获取当前网页的scrollTop：

`var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;`)

![](/simple-blog/PC&移动端网页特效(JS)/scroll.png)

滚动条在滚动时发生的事件：onscroll事件

检测整个页面的滚动属性： `window.pageYOffset`    `window.pageXOffset`等  (ie9以上才支持)

让窗口滚动事件：`window.scroll(x, y)`



#### 判断元素是否有滚动条

判断竖向滚动条

```vim
el.scrollHeight > el.clientHeight
```

这条规则使用了获取元素不同高度的两个属性：

- **scrollHeight**
  指的是元素的内容高度，即如果有滚动条，它的值会等于内容实际的高度加padding值（并不包含border和margin值），在没有内容溢出的情况下它的值等于clientHeight；
- **clientHeight**
  指的是元素的内部高度的px值，包括content和padding值之和，并不包括横向滚动条（horizontal scrollbar）、border和margin的值。



判断横向滚动条

```vim
el.scrollWidth > el.clientWidth
```

同样这里使用了获取元素宽度的两个属性：

- **scrollWidth**
  指的是远的内容高度，即它的值会等于内容实际的宽度加上padding值（不包含border和margin值），在没有内容溢出的情况下它的值等于clientWidth；
- **clientWidth**
  指的是元素的内部宽度的px值，包括content和padding值之和，并不包括横向滚动条（horizontal scrollbar）、border和margin的值。



#### 滚动事件方案

`antdesign`对scroll的处理（滚动到屏幕顶部）

https://github.com/ant-design/ant-design/blob/master/components/_util/scrollTo.ts#L34

网络上的一些滚动方案

https://www.cnblogs.com/nolaaaaa/p/9021967.html



#### 三大系列总结

offset常用于获取元素位置  `element.offsetTop`   `element.offsetLeft`  只读的

client常用于获取元素大小 `element.clientWidth`   `element.clientHeight` 只读的

scroll常用于获取滚动距离  `element.scrollTop`    `element.scrollLeft`  可设置



##  4.滚动至浏览器的可视区域

方法一：图片/元素的`offsetTop`  < 当前的元素父亲的`scrollTop` 

图片/元素 `offsetTop` +图片/元素 `offsetHeight` > 当前元素父亲的 `scrollTop`

方法二：`window.scrollY` > 图片/元素的`offsetTop`

方法三：`element.getBoundingClientRect()`,返回的结果是包含完整元素的最小矩形，并且拥有`left`, `top`, `right`, `bottom`, `x`, `y`, `width`, 和 `height`这几个以像素为单位的**只读属性**用于描述整个边框。除了`width` 和 `height` 以外的属性是相对于**视图窗口**的左上角来计算的。

 图片/元素的`getBoundingClientRect().top` <  `window.innerHeight`  且

 图片/元素的`getBoundingClientRect().bottom` > 0 



![](/simple-blog/PC&移动端网页特效(JS)/getbund.png)

#### 方法四 IntersectionObserver API

传统的实现方法是，监听到`scroll`事件后，调用目标元素（绿色方块）的[`getBoundingClientRect()`](https://developer.mozilla.org/en/docs/Web/API/Element/getBoundingClientRect)方法，得到它对应于视口左上角的坐标，再判断是否在视口之内。这种方法的缺点是，由于`scroll`事件密集发生，计算量很大，容易造成[性能问题](https://www.ruanyifeng.com/blog/2015/09/web-page-performance-in-depth.html)。

目前有一个新的 [IntersectionObserver API](https://wicg.github.io/IntersectionObserver/)，可以自动"观察"元素是否可见，Chrome 51+ 已经支持。由于可见（visible）的本质是，目标元素与视口产生一个交叉区，所以这个 API 叫做"交叉观察器"。

```js
var io = new IntersectionObserver(callback, option);
```

`callback`一般会触发两次。一次是目标元素刚刚进入视口（开始可见），另一次是完全离开视口（开始不可见）。

```js
// 开始观察
io.observe(document.getElementById('example'));

// 停止观察
io.unobserve(element);

// 关闭观察器
io.disconnect();
```

`callback`函数的参数（`entries`）是一个数组，每个成员都是一个[`IntersectionObserverEntry`](https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserverEntry)对象

`IntersectionObserverEntry`对象提供目标元素的信息，一共有六个属性。

- `time`：可见性发生变化的时间，是一个高精度时间戳，单位为毫秒
- `target`：被观察的目标元素，是一个 DOM 节点对象
- `rootBounds`：根元素的矩形区域的信息，`getBoundingClientRect()`方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回`null`
- `boundingClientRect`：目标元素的矩形区域的信息
- `intersectionRect`：目标元素与视口（或根元素）的交叉区域的信息
- `intersectionRatio`：目标元素的可见比例，即`intersectionRect`占`boundingClientRect`的比例，完全可见时为`1`，完全不可见时小于等于`0`

实现懒加载实例

```js
const observer = new IntersectionObserver(function(changes) {
  changes.forEach(function(element, index) {
   // 当这个值大于0，说明满足我们的加载条件了，这个值可通过rootMargin手动设置
    if (element.intersectionRatio > 0) {
      // 放弃监听，防止性能浪费，并加载图片。
      observer.unobserve(element.target);
      element.target.src = element.target.dataset.src;
    }
  });
});
function initObserver() {
  const listItems = document.querySelectorAll('list-item-img');
  listItems.forEach(function(item) {
   // 对每个list元素进行监听
    observer.observe(item);
  });
}
initObserver();
```



#### 兼容性

- Chrome 51+（发布于 2016-05-25）
- Android 5+ （Chrome 56 发布于 2017-02-06）
- Edge 15 （2017-04-11）
- iOS 支持
- IE不支持。。。

more：阮一峰老师http://www.ruanyifeng.com/blog/2016/11/intersectionobserver_api.html



#### Chrome 的黑科技——loading 属性

从新版本 Chrome(76)开始，已经默认支持一种新的 html 属性——loading，它包含三种取值:auto、lazy 和 eager(ps: 之前有文章说是 lazyload 属性，后来 chrome 的工程师已经将其确定为 loading 属性，原因是 lazyload 语义不够明确)，我们看看这三种属性有什么不同：

**auto**：让浏览器自动决定是否进行懒加载，这其中的机制尚不明确。

**lazy**：明确地让浏览器对此图片进行懒加载，即当用户滚动到图片附近时才进行加载，但目前没有具体说明这个“附近”具体是多近。

**eager**：让浏览器立刻加载此图片。

我们可以通过 chrome 的开发工具看看这个[demo](https://codepen.io/fecoder2019/pen/jgwpqx)中的图片加载方式，我们把上一个 demo 中的 js 脚本都删掉了，只用了 loading=lazy 这个属性。接着，勾选工具栏中的 Disabled Cache 后仔细观察 Network 一栏，细心的人应该会发现，一张图片被分为了两次去请求！第一次的状态码是 206，第二次的状态码才是 200，如图所示：

**要注意**，使用这项特性进行图片懒加载时，记得先进行兼容性处理，对不支持这项属性的浏览器，转而使用 JavaScript 来实现，比如上面说到的 `IntersectionObserver`

使用：

```html
<li class="list-item">
    <img class="list-item-img" alt="loading" loading="lazy" 				           src='https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3648955221,727328923&fm=26&gp=0.jpg'>
</li>
```



**原理**

1. 浏览器会发送一个预请求，但是这个请求只拉取这张图片的头部数据，从这段数据中，浏览器就可以解析出图片的宽高等基本维度，接着浏览器立马为它生成一个空白的占位，此时返回206（范围请求）
2. 在用户滚动到图片附近时，再发起一个请求，完整地拉取图片的数据下来，这个才是我们熟悉的状态码200请求。
3. 面对连接数，不用怕，有http2.0的多路复用撑腰

兼容处理

```js
if ("loading" in HTMLImageElement.prototype) {
      // 没毛病
    } else {
      // .....
    }
```



来源https://zhuanlan.zhihu.com/p/76820878



## 5.动画函数封装

原理：获取盒子当前位置（position），通过定时器`setinterval()`不断移动盒子位置，利用定时器不断让盒子当前位置加上一个移动距离，最后加一个结束定时器条件（其实也可以用CSS  animation  定义动画）

```html
<div></div>
<script>
	//简单动画函数封装obj目标函数，target目标位置
    //给不同的元素制定了不同的定时器
    //不过再js中尽量避免这一种“先创建再补充”的动态属性赋值
	function animate(obj, target) {
        obj.timer = setInterval(function () {
            if (obj.offsetLeft >= target) {
                clearInterval(obj.timer);
            } else {
                obj.style.left = obj.offsetLeft + 5 + 'px';
            }
        }, 30);
    }
// 调用函数
	let div = document.querySelector('div');
	animate(div, 300);
</script>
```

缓动动画：让元素运动速度有所变化 ，即让它每次移动的距离有所变化（如慢慢变小）就可以达到效果

比如可以：（目标值-现在位置）/10 作为每次移动的步长

停止条件：让盒子位置等于目标位置

动画函数添加回调函数：回调函数原理为函数作为一个参数，即将这个函数作为参数传到另一个函数里，当那个函数执行完毕之后，再执行传进去的这个函数，这个过程叫做回调



添加了一点细节和回调函数后的改进代码

```javascript
//简单动画函数封装obj目标函数，target目标位置
//给不同的元素制定了不同的定时器
//不过再js中尽量避免这一种“先创建再补充”的动态属性赋值
function animate(obj, target, callback) {
	// 当我们不断点击按钮，元素速度会越来越快，因为开启了太多定时器
	// 解决方案就是让我恩的元素只有一个定时器执行,清楚之前的定时器
	clearInterval(obj.timer);
	obj.timer = setInterval(function () {
		// 把步长值改为整数，不要出现小数的问题
		let step = (target - obj.offsetLeft) / 10;
		// 正值往小的取整，负值往大的取证, 保证数值刚好等于target（）
		step = step > 0 ? Math.ceil(step) : Math.floor(step);
    	// 可以让800回到500，所以用== 而不是>= 
		if (obj.offsetLeft == target) {
			clearInterval(obj.timer);
			// 如果有回调函数，在定时器结束时调用
			/*if (callback) {
			callback();
			}*/
            //更棒写法
            callback && callback();
		} else {
			obj.style.left = obj.offsetLeft + step + 'px';
		}
	}, 30);
}
// 调用函数
let div = document.querySelector('div');
let btn500 = document.querySelector('.btn500');
let btn800 = document.querySelector('.btn800');
btn500.addEventListener('click', function () {
	animate(div, 500, function () { alert('hello') });
})
btn800.addEventListener('click', function () {
	animate(div, 800);
})
```



## 6.双击进入全屏

这可以在很多浏览器中适用，但是 it won't work in Safari。。

```js
window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
```

需要适配一下：

```js
window.addEventLisnter('dblclick', () => {
	if(!document.fullscreenElement) {
		canvas.requestFullscreem()''
	} else {
		document.exitFullscreen();
	}
})
```



# 移动端

移动端兼容性较好，我们不需要考虑以前js的兼容问题，可以放心使用原生的JS书写，但是移动端也有自己独特的地方，如touch事件等

## 1.touch事件

响应用户手指对屏幕的操作

`touchstart`  手指触摸到一个dom元素  （像`mousedown`）

`touchmove`  手指在一个dom元素上滑动   （像`mousemove`）

`touchend` 手指从一个dom元素上移开  （像`mouseup`）

```js
div.addEventListener('touchstart', function() {})
```

移动端拖动原理：盒子原来的位置+手指移动的距离

拖动三部曲：（手指移动会触发滚动屏幕，所以要在这里阻止的屏幕滚动`e.preventDefault()`）

触摸 `touchstart`  获取初始坐标

移动手指 `touchmove`  计算手指滑动距离，并且移动盒子

离开手指 `touchend` 

```html
//div加了绝对定位
<div></div>
    <script>
        let startX = 0;
        let startY = 0;
        let x = 0;
        let y = 0;
        let div = document.querySelector('div');
        div.addEventListener('touchstart', function (e) {
            // 获取第一个触碰的坐标
            startX = e.targetTouches[0].pageX;
            startY = e.targetTouches[0].pageY;
            // 获取盒子的位置
            x = this.offsetLeft;
            y = this.offsetTop;
        })
        div.addEventListener('touchmove', function (e) {
            // 计算手指移动的距离，手指移动后坐标-手指初始坐标
            let moveX = e.targetTouches[0].pageX - startX;
            let moveY = e.targetTouches[0].pageY - startY;
            // 移动盒子
            this.style.left = x + moveX + 'px';
            this.style.top = y + moveY + 'px';
            // 阻止屏幕滚动
            e.preventDefault(); 
        })
    </script>
```

无论是e中的 `targetTouches` 还是 `touches` 里面的item都属于一个[ `Touch` 对象](https://developer.mozilla.org/zh-CN/docs/Web/API/Touch)

`touches`：一个`Touch`对象代表一个触点，当有多个手指触摸屏幕时，`TouchList`就会存储多个`Touch`对象，前面说到的`identifier`就用来区分每个手指对应的`Touch`对象。

pageX、clientX、screenX的不同：https://stackoverflow.com/questions/6073505/what-is-the-difference-between-screenx-y-clientx-y-and-pagex-y



## 2.移动端常见特效

#### transitionend 事件

移动端兼容性较强，在js制作时可以穿插  `transform:translate(x, y)` 、`transition`  等，

对于`transition` ，此时需要用到 `transitionend` 事件 ，等待过渡完成之后，再去判断是否到达最后一张，监听过渡完成事件

#### classList 属性

它是h5新增的属性，返回元素的类名（返回形式为数组，因为一个元素可能包含多个类），但是ie10以上才支持（移动端也支持）

```js
let div = document.querySelector('div');
//返回第一个类的类名
console.log(div.classList[0]);
```

添加类名, 是追加，不会覆盖以前的类名，注意xx前面不用加 '.'

`element.classList.add('xx')`

移除类名

`element.classList.remove('xx')`

切换类名（原来有，就给你删除掉，原来没有，就给你加上）

`element.classList.toggle('xx')`

#### 移动端click问题

移动端click事件会有300ms的延迟，原因是移动端双击会缩放页面

解决方案1：禁用缩放功能 `<meta name="viewport" content="user-scalable=no">`  在最顶端的视口标签处写下user-scalable=no

解决方案2：利用touch事件自己封装：

手指触屏记录触摸时间

手指离开屏幕，用离开时间减去触摸的时间，若时间小于指定时间则没有缩放屏幕，定义为点击事件

禁止双指放大

```js
document.documentElement.addEventListener('touchstart', function (event) {
  if (event.touches.length > 1) { 
  //touches是一个 TouchList，其会列出所有当前在与触摸表面接触的  Touch 对象
    event.preventDefault();
  }
}, false);
```

禁止双击放大

```js
var lastTouchEnd = 0;
document.documentElement.addEventListener('touchend', function (event) {
  var now = Date.now();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);
```

解决方案3：使用fastclick插件

在 vue 中

```shell
npm i fastclick -S
```

在 main.js 中

```js
import fastClick from 'fastclick'
fastClick.attach(document.body)
```



#### 展望现在

谷歌的开发者文档[《300ms tap delay, gone away》](https://link.zhihu.com/?target=https%3A//developers.google.com/web/updates/2013/12/300ms-tap-delay-gone-away)里面还提到在2014年的Chrome 32版本已经把这个延迟去掉了，如果有一个meta标签：

```html
<meta name="viewport" content="width=device-width">
```

即把viewport设置成设备的实际像素，那么就不会有这300ms的延迟，并且这个举动受到了IE/Firefox/Safari(IOS 9.3)的支持，也就是说现在的移动端开发可以不用顾虑click会比较迟钝的问题。

如果设置initial-scale=1.0，在chrome上是可以生效，但是Safari不会：

```html
<meta name="viewport" content="initial-scale=1.0">
```

还有第三种办法就是设置CSS：

```css
html{
    touch-action: manipulation;
}
```

这样也可以取消掉300ms的延迟，Chrome和Safari都可以生效。



## 3.摇一摇事件

html5新增了一个devicemotion的事件，可以使用手机的重力感应。如下代码所示：

```js
window.ondevicemotion = function(event){
    var gravity = event.accelerationIncludingGravity;
    console.log(gravity.x, gravity.y, gravity.z);
}
```

x，y，z表示三个方向的重力加速度

![](/simple-blog/PC&移动端网页特效(JS)/shake.png)





`devicemotion`事件会被不断地触发，根据以上，我们可以拿到摇摆的角度 + 时间间隔来判断用户是否是摇一摇！

注意：ios 13 beat2 更新之后, `devicemotion`实践需要用户授权了

参考链接https://zhuanlan.zhihu.com/p/28052894



## 4.框架

比如bootstrap，同样

来自于twitter，目前最受欢迎的前端框架(拿来主义)

中文官网：https://www.bootcss.com/

官网：https://getbootstrap.com/

2.x.x	已经停止维护，功能不够完善

3.x.x  目前使用最多，但已经放弃了ie6，ie7，对ie8支持但是界面效果不好，偏向于开发响应式布局，移动设备优先的web项目

4.x.x 最新版，但是目前不流行

根据官网的介绍引入js和结构即可使用



## 5.移动端滚动

默认的滚动原理，在移动端十分卡顿

可以在github上安装 better-scroll 框架 让你的滚动更加丝滑

原生 JS 实现局部滚动：给定盒子高度，使用 `overflow:scroll`

使用better-scroll :（老师用的版本1.13.2）

安装

```shell
npm i better-scroll
```

#### 基本使用

在滚动内容外面套上一个 div 标签， `class="wrapper"`

在js里引入并且使用

```js
import BScroll from 'better-scroll'
let wrapper = document.querySelector(".wrapper");  //滚动内容部分的元素
let scroll = new BScroll(wrapper, {});             //创建BScroll实例
```

如果在vue内使用，可以把创建`BScroll`对象放在 `mounted`生命周期钩子里

html部分：

**注意**：wrapper子元素只能有一个，所以不能直接绑定在ul上 

**注意**：wrapper 在CSS里必须要有一个固定的高度

```html
<div class="wrapper">
    <ul>
  	 <!--许多的li -->
    </ul>
  </div>
```

#### 事件监听

`BScroll`创建出来的实例可以使用 `on` 监听事件

- `sroll`是滚动事件
- `pullingUp`是上拉事件

但是 **默认 **情况下

- `BScroll`是不能实时监听滚动位置的，需要配置`probeType`

- better-scroll 管理的标签内部默认会阻止浏览器原生的click事件，需要配置`click`
- 必须在实例对象里开启`pullUpLoad`才能使用`pullingUp`事件，`pullingUp`事件只会触发一次，想要在发送网络请求，将新数据展示完毕继续使用该功能的话，需要 `scroll.finishPullUp()`



`new BScroll(wrapper, {配置option})`

1.重要配置属性`probeType`,   probe：侦测,  默认值0（用scroll事件监听）

- 0、1都表示不侦测
- 1：非实时（屏幕滑动超过一定时间后）派发scroll 事件；
- 2：手指滑动时侦测，惯性滑动不侦测
- 3：只要滚动都进行侦测 

2.click，默认值false

- better-scroll管理的标签内部默认会阻止浏览器原生的click事件
- 当设置为true的时候，better-scroll会派发一个click事件

3.pullUpLoad常用于上拉加载更多 默认值false 

- 用`pullingUp`进行事件监听，传入`boolean` / `Object` ，设置为true或object开启功能

还有很多option配置，详情看官网

```js
let wrapper = document.querySelector(".wrapper");
this.scroll = new BScroll(wrapper, {
    probeType: 2,
    click: true,
    pullUpLoad: true,
});
//监听滚动事件
this.scroll.on("scroll", (position) => {
    console.log(position);
});
//回拉至x,y位置
//this.scroll.scrollTo(x, y[, time]);
//监听上拉事件
this.scroll.on("pullingUp", () => {
    console.log("上拉加载更多");
});
//监听加载一次上拉事件，需要使用此函数才可以重新开启监听上拉事件 pullingUp
this.scroll.finishPullUp();
// 修复better-scroll 因异步的网络请求图片到达，却未计算可滚动高度而无法滑动产生的bug，使用refresh进行刷新
this.scroll.refresh();
//输出滚条当前的x和y
console.log(this.scroll.x);
console.log(this.scroll.y);
```



#### 解决better-scroll可滚动区域产生的bug

better-scroll滚动区域是由 `scrollHeight`属性决定的，也就是content中子组件的高度

但有时因为异步操作（比如网络请求），导致 `scrollHeight`未能够计算出正确的组件高度

解决：

- 监听每一张图片加载完成（每一次的网络请求），只要有一张图片加载完成，就调用 `refresh()`一次
  - `img.onload() = funciton(){}`（vue中，监听加载则 `@load="函数名"`）
  - 使用事件总线 eventBus，管理、传递该加载事件到对应的组件，然后进行 `refresh()`



## 6.防抖函数

有点像节流阀，节流阀：将多次执行变为在规定时间内只执行一次

也就是说，那么**在函数执行一次之后，该函数在指定的时间期限内不再工作**，直至过了这段时间才重新生效。

防抖：

- 在规定的时间内执行多次事件只执行最后一次
  - （**在第一次触发事件时，不立即执行函数，而是给出一个期限值比如200ms**）

上述  "解决better-scroll可滚动区域产生的bug"  操作我们可以看到，每有一张图片加载完成，则发送一次请求，这样会大大降低参加程序效率、性能

为此我们可以封装一个防抖函数

```js
function debounce(func, delay) {
    let timer = null;
    return function (...args) {
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => {
            // 这里的apply只用一个传入多个参数作用，箭头函数已经指向环境this，不需要用apply绑定
            func.apply(this, args);
        }, delay);
    };
}
```

在vue中，我们可以在mounted里调用该函数

```js
mounted() {
    // 监听goodListItem中图片加载完成
    // 修复better-scroll 因异步的网络请求图片到达，却未计算可滚动高度而无法滑动产生的bug，使用refresh进行刷新
    // 然后用防抖函数优化,减少函数调用频率
    const refresh = this.debounce(this.$refs.scroll.refresh, 50);  //得到一个带计时器的函数，里面保存着闭包的timer
    this.$bus.$on("itemImageLoad", () => {
        refresh();   //调用refesh进行更新
    });
},
```



## 7.节流阀

控制速度，用于类似于防止轮播图按钮连续点击，导致播放过快的后果

即当上一个函数动画内容执行完毕再去执行下一个函数动画，让事件无法连续触发

核心思路是：利用回调函数，添加变量进行控制。锁住函数和解锁函数

```js
 // 设置节流阀
    let flag = true;
    arrow_r.addEventListener('click', function () {
        if (flag) {
            flag = false;
            fun(x, y, function () {
                flag = true;
            });
        }
    })
```



平时开发中常遇到的场景：

1. 搜索框input事件，例如要支持输入实时搜索可以使用节流方案（间隔一段时间就必须查询相关内容），或者实现输入间隔大于某个值（如500ms），就当做用户输入完成，然后开始搜索，具体使用哪种方案要看业务需求。
2. 页面resize事件，常见于需要做页面适配的时候。需要根据最终呈现的页面情况进行dom渲染（这种情形一般是使用防抖，因为只需要判断最后一次的变化情况）

这里借用老哥的节流代码 （附上原文https://segmentfault.com/a/1190000018428170/）

```js
function throttle(fn,delay){
    let valid = true
    return function() {
       if(!valid){
           //休息时间 暂不接客
           return false 
       }
       // 工作时间，执行函数并且在间隔期内把状态位设为无效
        valid = false
        setTimeout(() => {
            fn()
            valid = true;
        }, delay)
    }
}
/* 请注意，节流函数并不止上面这种实现方案,
   例如可以完全不借助setTimeout，可以把状态位换成时间戳，然后利用时间戳差值是否大于指定间隔时间来做判定。
   也可以直接将setTimeout的返回的标记当做判断条件-判断当前定时器是否存在，如果存在表示还在冷却，并且在执行fn之后消除定时器表示激活，原理都一样
    */

// 以下照旧
function showTop  () {
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
　　console.log('滚动条位置：' + scrollTop);
}
window.onscroll = throttle(showTop,1000) 
```



其实也可以称之为前置防抖，因为可以这样写

```js
// 前置执行的防抖
export const leadDebounce = (fn, delay = 400) => {
    let timer = null;
    return function () {
        if (timer) return;

        // eslint-disable-next-line prefer-rest-params
        if (fn) fn.apply(this, arguments);
        timer = setTimeout(() => {
            clearTimeout(timer);
            timer = null;
        }, delay);
    };
};
```



## 8.异步竞态

解决方案：

节流阀：可能导致用户点击无法响应

防抖：可能导致用户点击延迟相应

设置加载中的弹窗

闭包的方式：(React代码)，每一次重新渲染会重新加载`useEffect`，并且调用return里的函数，由此将闭包中的独立的`didRequest`改为true，使得数据无法更改（setState）

官方解释：如果组件多次渲染（通常如此），则**在执行下一个 effect 之前，上一个 effect 就已被清除**

```js
useEffect(() => {
	let didRequest = false;
	异步请求.then((data) => {
		if (!didRequest) {
			setState(xx);
			//..
		}
	});
	return () => didRequest = true;
})
```



## 9.懒加载

我们可以在create-react-app、 next.js、webpack中使用懒加载，先设置初始值，等到用到的时候再异步加载

在react使用懒加载的一个小例子

```js
const changeTime = async () => {
    const moment = await import("moment");
    setNowTime(moment.default(Date.now()).format());
};
```



## 10.一些其他的优化

1. 对于动画效果的实现，避免使用 setTimeout 或 setInterval，请使用 requestAnimationFrame。
2. 将长时间运行的 JavaScript 从主线程移到 Web Worker。
3. 使用微任务来执行对多个帧的 DOM 更改。
4. 使用 Chrome DevTools 的 Timeline 和 JavaScript 分析器来评估 JavaScript 的影响。