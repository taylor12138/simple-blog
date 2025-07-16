---
author: Hello
categories: 前端
title: JQuery
description: 'JQuery相关'
---

## 1.JQuery概述

JavaScript库：即library，是一个封装好的特定集合（方法和函数），使得我们可以快速高效的使用这些封装好的功能，而jQuery 就是一个 JavaScript函数库

其他常见地js库还有Prototype、YUI、Dojo、ExtJS和移动端的zepto

优点：

1.轻量级，文件够小

2.跨浏览器兼容，基本兼容主流浏览器

3.链式编程、隐式迭代

4.对事件、样式、动画支持，极大地简化了dom的操作，支持插件扩展开发，有丰富的第三方插件

4.免费、开源

官网下载：https://jquery.com/  最新版本早已不兼容ie6、7、8

等页面dom加载完毕再去执行代码（类似于DOMContentLoaded）

```js
//入口函数
$(function() { xxxx })
```

要在页面引入官网下载的jQuery的js文件才能使用

## 2.jQuery的基本使用

$是jquery的简称，一般在代码中用$替代jQuery

`$(function() { $('div').hide() })`  相当于  `jQuery(function( jQuery('div').hide() ) {})`

$是jQuery的顶级对象，相当于JavaScript的window，把元素$包装成jQuery对象，就可以调用jQuery方法



#### jQuery和dom

用原生js获取的对象就是dom对象

用jQuery方式获取的对象就是jQuery对象

**这两个对象是不一样的**

jQuery对象的本质就是利用$对DOM对象包装后产生的对象（伪数组的形式储存）

jQuery对象只能用jQuery方法，DOM对象则只能使用原生的JavaScript属性和方法

但是DOM对象和jQuery对象可以相互转换，因为原生js比jQuery更大，原生的一些属性和方法jQuery没有为我们进行封装，想要使用这些属性和方法需要把jQuery转换成DOM对象才能使用

```js
//DOM转jQuery
let myvideo = document.querySelector('video');
$(myvideo);
//jQuery转DOM  $('video')[index]或者$('video').get(index)
$('video');  //获取元素
$('video')[0].play();  //将只有一个元素的视频过来并且使用DOM功能
```



## 3.jQuery的API

#### jQuery选择器

`$("选择器")`  语法和CSS选择器一样即可

子代选择器 `$("ul>li")`  

后代选择器`$("ul li")`  

jQuery修改样式：`$("div").css("属性", "值")`

jQuery有隐式迭代，它会给匹配到的所有元素进行循环遍历，执行相应的方法，而不用我们再循环，简化我们的操作

```javascript
//一次性将所有选中的div元素背景颜色改为pink，不再需要for循环一个一个遍历更改
$("div").css("background", "pink");
```

jQuery筛选选择器

 `$("li:first")`  选中第一个

`$("li:last")`   选中最后一个

`$("li:eq(x)")`   选中索引号为x的元素

`$("li:odd")`  选中索引号为奇数的元素

`$("li:even")`  选中索引号为偶数的元素

`$("div").parent();`  返回的是最近一级的父元素

`$("div").parents();`   返回的是所有祖先元素的数组，可以制定"()"里的类名单独指定是哪个祖先

`$("div").children("ul");`  返回指定的亲儿子，类似于子代选择器div>ul

`$("div").find("li");`  可以选定指定的所有孩子，类似于后代选择器 div li

`$(".item").sibling("li");`  可以选定除本身外所有亲兄弟元素

`$("li").eq(x);`  选中索引号为x的元素, 类似`$("li:eq(x)")`   ，但是此方法**更推荐**

`$("li").hasCLass("类名");`    查看是否有该类名，返回true或false

jquery中的快速实现排他思想：

```js
$(function() {
            $("button").click(function() {
                $(this).css("background","pink");
                $(this).siblings("button").css("background", "")
            })
        })
```

**jQuery可以快速得到当前元素索引号，不再需要自己添加自定义属性index**

`$(this).index()`

`$("xxx:checked")`  选择复选框中被选择的元素（`$("xxx:checked").length`为被选中复选框个数）



#### jquery样式操作

使用css方法：

1.参数只写属性名，返回属性值

`$(this).css("color")`

2.设置样式，属性名必须加引号，如果属性值值如果是数字可以不用跟单位和引号

`$(this).css("color", "red")`

3.参数可以用对象的形式(里面的属性名不用加引号，如果如果属性值值如果是数字可以不用跟单位和引号)

如果是复合属性必须采取驼峰命名法（和DOM一样）

```js
$(this).css({
	width: 400,
    height: 400,
    backgroundColor: "green"
})
```

直接设置类方式：

再写一个类，里面包含了所有你想要改变的样式，然后利用jQuery添加类功能，将其添加进去（注意直接添加类名，不需要 “.类名”）

(原生js的className进行更改会覆盖原先的类名)

```js
// 1. 添加类 addClass()
$("div").click(function() {
	$(this).addClass("current");
});
// 2. 删除类 removeClass()
$("div").click(function() {
	$(this).removeClass("current");
});
// 3. 切换类 toggleClass()
$("div").click(function() {
	$(this).toggleClass("current");
});
```



#### jQuery效果

**显示和隐藏效果**

`show([speed, [easing], [fn]])` 

显示功能，参数可以省略，  speed：三种预定字符串（"speed","normal","fast"）、或者使用毫秒数表示

easing：swing（在开头/结尾移动慢，在中间移动快）、linear（匀速）              fn：回调函数

`hide([speed, [easing], [fn]])` 

隐藏功能，同上  

`toggle([speed, [easing], [fn]])` 

切换（原本显示则隐藏，原本隐藏则显示）



**滑动**

`slideDown([speed, [easing], [fn]])`

下拉显示，类似于手机官网那些下拉菜单，参数功能同上

`slideUp([speed, [easing], [fn]])`

上拉隐藏，参数同上

`slideToggle([speed, [easing], [fn]])`

拉动切换，参数同上



**事件切换**

`hover([over],out)`

over: 鼠标移到元素上触发的函数（相当于mouseenter）

out：鼠标移出元素触发的函数（类似于mouseleave）

简洁下拉菜单

```js
$(".nav>li").hover(function() {
	$(this).children("ul").slideDown(200);
}, function() {
	$(this).children("ul").slideUp(200);
});
```

或者

```js
$(".nav>li").hover(function() {
	$(this).children("ul").slideToggle();
});
```



**动画队列和其停止方法**

上述下拉菜单代码有一个问题

动画或者效果一旦触发就会执行，如果多次触发，就造成多个动画或者效果的排队执行（即鼠标一次性经过多个选项，导致鼠标在一边停下来了之后，动画还在执行（因为还没执行完毕））

停止排队：

`stop()`     stop()用于停止动画或者效果，将其写在动画或者效果的前面，相当于停止结束上一次的动画 

```js
//上述示例改进：
$(".nav>li").hover(function() {
	$(this).children("ul").stop().slideToggle();
});
```



**淡入淡出**

`fadeIn([speed, [easing], [fn]])` 

淡入功能，参数可以省略，  speed：三种预定字符串（"speed","normal","fast"）、或者使用毫秒数表示

easing：swing（在开头/结尾移动慢，在中间移动快）、linear（匀速）              fn：回调函数

`fadeOut([speed, [easing], [fn]])`  淡出

`fadeToggle([speed, [easing], [fn]])`   淡入淡出切换

`fadeTo([speed, opacity, [easing], [fn]])`  以渐进的方法修改透明度，opacity为透明度，必须写，取值范围0~1，speed也必须写



**自定义动画animate**

`animate(params, [speed], [easing], [fn])`

params：想要更改的样式属性，以对象的形式传递，必须写，属性名可以不带引号，如果是复合属性需要采取驼峰命名法

其他的speed、easing、fn和之前相同

```
$("div").animate({
	left: 500,
	top: 300,
	opacity: .4,
	width: 500
}, 500);
```



## 4.jQuery属性操作

`element.prop("属性名")`  获取属性值（固有的属性值）

`element.prop("属性名", "属性值")`   设置属性值

`element.attr("属性名")` 获取属性值（自定义属性），类似原生的getArribute

`element.attr("属性名", "属性值")` 设置属性值（自定义属性），类似原生的setArribute

`element.data("属性名", "属性值")`  设置数据缓存，data里的数据是存放在元素的内存中，而不是作为属性（这个方法可以获取data-index 即h5自带的自定义属性，不用写data-，写成$("div").data("index")）



## 5.jQuery内容文本值

`element.html()`  获取元素内容（包含标签）  相当于原生的innerHTML

`element.html("内容")` 设置元素内容

`element.text()`  获取元素内容（不包含标签）  相当于原生的innerText

`element.text("内容")`  设置元素内容

`element.val()`  获取表单值

`element.val("表单值")`  设置表单值





## 6.jQuery的元素操作

虽然jquery有隐式迭代，但是只是对同类元素做相同操作，如果想要给不同元素进行不同的操作，就需要使用到遍历

#### jQuery的遍历

`$("div").each(function (index, domEle) { xxxx; })`     

index（第一个参数）是每个元素的索引号，domELe（第二个参数）是遍历后的每个DOM元素对象，不是jQuery对象，如果想使用jQuery方法，需要给这个dom元素转换为jQuery对象（$(domEle)）

`$.each(object, function(index, element) { xxx; })`

$.each() 方法可以用于遍历任何对象，**主要用于数据处理**，如数组、对象，index（第一个参数）为索引号（如果是对象，则为属性名），element（第二个参数）为遍历内容（如果是对象，则为属性值）



#### 创建元素  

 `$("<li></li>")`  动态创建一个li标签



#### 添加元素   

（创建完之后需要添加元素）

内部添加：（生成后它们是父子关系）

`element.append("内容")`  放到匹配元素的最后面，类似于原生的appendChild

`element.prepend("内容")`  放到匹配元素的最前，类似于原生的`ul.insertBefore(xx, ul.children[0])`(指定元素的前面)

外部添加：（生成后它们是兄弟关系）

外部添加：`element.after("内容")`  把内容放入目标元素的后面

`element.before("内容")`   把内容放入目标元素前面



#### 删除元素

`element.remove()` 删除匹配元素

`element.empty()` 删除匹配元素的所有子节点

`element.html("")` 清空匹配元素的内容（孩子）



## 7.jQuery事件

#### 事件注册

`element.事件(function()  {})`    单个事件注册

如 `$("div").click(function() {事件处理})`

其他事件和原生基本一致



#### 事件处理

##### on(可以绑定多个事件)

on() 方法在匹配元素上绑定一个或多个事件的事件处理函数

element.on(events, [selector], fn)

1.events: 一个或多个用空格的事件类型，如"click"

2.selector: 元素的子元素选择器

3.fn：回调函数，即绑定在元素身上得到侦听函数

如

```js
$("div").on({
	mouseenter: function() {
		//xxxxx
	},
	click: function() {
		//xxxxx
	},
	mouseleave: function() {
	  	//xxxx
	}
})
```

不同事件类型触发同一处理函数：

`$("div").on("mouseenter mouseleave", function() {})`

##### **on的优势2**：可以进行事件委托

如

```js
//传统，但是给每个li都添加了一个事件，比较麻烦
$("ul li").click();
//事件是绑定在ul身上，但是触发对象时li，li事件冒泡，冒泡到父级的点击事件然后执行程序
$("ul").on("click", "li", function() {  })
```

此前有blind()、live()等方法处理事件绑定或事件委托，但是我们最新版本用on就行了

##### **on的优势3**：动态创建元素，on可以给未来动态创建的元素绑定事件

```js
//传统，前面绑定事件，后面创建的标签没有绑定该事件
$("ol li").click(function() {})
let li = $("<li>xxx</li>");
$("ol").append(li);
```

```js
//使用on,之后创建的也能被给予绑定效果
$("ol").on("click", "li", function() {})
let li = $("<li>xxx</li>");
$("ol").append(li);
```

##### 事件off解绑

off()方法可以移除通过on()方法添加的事件处理程序

`element.off()`  解绑该元素上所有事件

`element.off("click")`  解绑该元素上点击事件

`$("ul").on("click", "li", function() {})`

`$("ul").off("click", "li")`  解除事件委托

##### 只使用一次: 用one()来绑定

有的事件只想触发一次，可以使用one来绑定

`element.one(event, fn)`

##### 自动触发事件trigger

比如click事件：

1.`element.click()`

2.`element.trigger("click")`  和上面的差不多

3.`element.triggerHandler("click")` triggerHandler不会触发元素默认行为（包括该元素绑定的其他行为），只触发"click"



#### 事件对象

`element.on(events, [selector], function(event) {})` 中的event为事件对象

`event.preventDefault()`  或者`return false`  用于阻止默认行为

`event.stopPropagation()`  将其写于事件函数中，可以用于阻止冒泡



## 8.jQuery的其他方法

#### jQuery拷贝对象

`$.extend([deep], target, object1, [objectN])`（如果有冲突的，会覆盖掉targetObj 里面原来的数据）

1.deep: 如果为true为深拷贝，默认false为浅拷贝

（注意是复杂数据类型）浅拷贝是把被拷贝的**对象复杂数据类型中的地址**拷贝给目标对象，**修改目标对象会影响被拷贝的对象**，如果该复杂数据类型对象有冲突，直接覆盖掉

深拷贝，完全克隆，对于复杂数据类型拷贝的是对象，不是地址，修改目标对象不会影响被拷贝的对象（如果该复杂数据类型对象有冲突，但是里面的属性不冲突，则属性会合并在一起）

```js
//深拷贝时targetObject的msg会与obj的msg合并
//此时都有id，obj的id会覆盖掉targetObject的id
var targetObject = {
	id: 0,
	msg: {
		sex: '男'   //对象复杂数据类型
	}
};
var obj = {
	id: 1,
	name: 'andy',
	msg: {
		age: 18
	}
}
$.extend(targetObject,obj);
```

2.target：要拷贝的目标对象

3.object1：待被拷贝到第一个对象的对象   （object拷贝给target）



#### jQuery·多库共存

随着jquery的流行，其他js库也会使用$作为标识符，这样一起使用会起冲突

需要一个解决方案，让jQuery和其他js库不存在冲突，可以同时存在，这就叫做多库共存

jquery解决方案：

1.把里面的$符号统一改为jQuery	，比如jQuery("div")

2.自定义，释放对$对控制权

```js
var suibian = $.noConflict();
//var suibian = jQuery.noConflict();
suibian("span")  //原本是$("span")
```



#### jQuery插件

jQuery功能比较有限，想要更加复杂的效果，可以借助jQuery插件（注：这些插件是依赖于jQuery，所以必须先引入jQuery文件，因此也成为jQuery插件）

jquery常用网站：

1.jQuery插件库：http://www.jq22.com/

2.jQuery之家：http://www.htmleaf.com/   (推荐)

jQuery插件使用步骤：1.引入相关文件（jQuery、插件文件）  2.赋值相关html、css、js

图片懒加载: 在jQuery·插件可以找到，图片只加载到可视区域，减缓服务器压力

全屏滚动：jQuery的fullPage.js也十分好用

**bootstrap也是依赖于jQuery开发的，因此里面的js插件使用，也必须引入jQuery文件**



#### jQuery的位置

位置主要有三个：offset()可设置、   position()只读、   scrollTop()/scollLeft()可设置

`element.offset()`  返回一个对象，里面包含left和top，用于设置或获取相对于**文档document**的偏移坐标

但是和原生不同的是，它可以设置偏移：`element.offset({top: 10, left: 30})`，且原生js的offset返回的是相对于父元素的偏移量

`element.position()` 获取带有相对于父级的偏移距离，如果没有定义父级，则以文档为准，但是此方法只能获取不能设置

`element.scrollTop()/element.scrollLeft()`**设置或获取**被卷去的头部和左侧，类似于原生js自带的元素滚动scroll