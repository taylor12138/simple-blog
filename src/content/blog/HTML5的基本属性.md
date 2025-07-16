---
author: Hello
categories: 前端
title: HTML5的基本属性
description: 'html相关'
---

## 1.基本标签介绍

`<html></html>根标签`

`<head> </head>`   文档头部  

 `<title> </title>`  文档标题   

`<body></body>`    文档主体



页面解析顺序：

- （1）先解析head标签中的代码，head标签中会包含一些引用外部文件的代码，就会开始下载这些被引用的外部文件
  - 当遇到`script`标签的时候浏览器暂停解析（相关脚本会立即下载并执行），将控制权交给JavaScript引擎（解释器）如果`script`标签引用了外部脚本，就下载该脚本，否则就直接执行，执行完毕后将控制权交给浏览器
  - 当遇到一个CSS文件时，解析也可以继续进行
- （2）然后解析body中的代码（如果此时head中引用的外部文件没有下载完，将会继续下载）
  - 如果此时遇到body标签中的`script`，同样会将控制权交给JavaScript引擎来解析JavaScript，解析完毕后将控制权交还给浏览器渲染引擎。
-  （3）当body中的代码全部执行完毕、并且整个页面的css样式加载完毕后，css会重新渲染整个页面的html元素。**reflow**
- 因此，`script`标签放靠后比较好，此时操作`dom`元素才能正常操作，还能保证页面正常加载出来，如果你想放在开头，可以配合  `window.onload`就可以放在任意位置

页面具体渲染过程可以看MDN的官方文档https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work

这个链接说明也是我们面试常见问题！（输入url到网页渲染完毕发生了什么）



## 2.在vscode里使用英文“！”可以直接生成基本结构

ctrl+“+”可以放大（写代码）页面

`<!DOCTYPE html>`   

- 这是我们一直放在 HTML 文件第一行的文档类型（doc-type）声明。你可能认为这个信息是多余的，因为浏览器已经知道响应的 MIME 类型是`text/html`; 但[在 Netscape/Internet Explorer 时代](https://css-tricks.com/chapter-8-css/)，浏览器有一项艰巨的任务是确定使用哪种 HTML 标准来呈现来自多个竞争版本的页面。（也就是说这是用于确立h5标准的）

`<html lang="zh-CN">` (中文)

`<meta charset="UTF-8">`<!--（UTF-8是万国码，通用所有char，保存文字）-->

`<h1></h1>---<h6></h6>`<!--（一级标题到六级标题，重要级别递减）-->
`<p></p>`<!--（段落标签）-->

`<br />`<!--(强制换行)-->
`<strong></strong>`(字体加粗)
`<del></del>`（字体删除线）

`<em></em>` 标签告诉浏览器把其中的文本表示为强调的内容



#### meta标签

meta标签永远在head元素内部，用于提供有关页面的元信息（meta-information），比如针对搜索引擎和更新频度的描述和关键词。





## 3.盒子

类似于微信小程序的view，用于布局

`<div></div>`     //大盒子，独占一整行

`<span></span>` //小盒子   无法设置高度和宽度



## 4.img

`<img src=""  alt=""  title=""  height=""  width="">`

`srcset`属性：根据设备dpr设置x倍图片

```html
<img width="320"  src="bg@2x.png" srcset="bg.png 1x;bg@2x.png 2x"/>
```

微信小程序是image  alt为图片无法加载时显示的文字，title为鼠标移到图片上显示的文字提示,

但是对于height和width,一般只修改其中一个，另外一个就会跟着改变

src种绝对路径  \    相对路径  /

（图片设置宽高一般设置为width：100%，heigh：100%，可以自动适应盒子）

在nextjs中

> Regardless of the layout mode used, the Image component will have a consistent DOM structure of one `<img>` tag wrapped by exactly one `<span>`. For some modes, it may also have a sibling `<span>` for spacing. These additional `<span>` elements are critical to allow the component to prevent layout shifts.

也就是说一般一个img标签他都用span包裹



#### 图片禁止拖拽

```html
<img src="https://picsum.photos/360/460?random=1" draggable="false">
```



## 5.超链接< a>

`<a href="" target="" >文本或者图像</a>`

类似于微信小程序中的navigator, href用于指定目标的url，可打开内部，外部链接

target用于来链接打开方式，默认`_self`

`_blank`为在新窗口打开

锚点链接：设置href=#名字，如`<a href="#two">第二集</a>`可以快速跳转到第二集的页面位置

​                   在于目标位置标签里添加id="two"

像对于vue（router-link）、react（Link）这类的框架，他们实现的声明式路由其实差不多是这种方式（hash）：

```html
<a href="#home">首页</a>
<a href="#about">关于</a>
```

只不过对于vue、react他们还处理了通过url实现跳转时这个a链接自动高亮（react的  `NavLink` ），实现的路径和跳转标签的绑定（原理：`window.onhashChange`事件， `window.addEventListener("hashchange", fn)`监听回调 ）



`<a href="" title="">`移动到链接时会出现提示框

一般情况下，a如果包含有宽度的盒子，a需要转换为块级元素

`<a href='javascript:;'>xx</a>`  直接添加javascript:; 可以阻止链接跳转

<br />

## 6.特殊字符

空格：`&nbsp`       (因无法识别大于号和小于号)  小于号：`&lt`  大于号：`&gt`

<br />

## 7.表格（用于数据）

`<table>`

​	`<tr>`

​		`<td>单元格文字</td>或者<th></th>`

​	`</tr>`

`</table>`

table是表格，tr是行，td是单元格（th可充当表头单元格）。还可以加入`<thead>`和 `<tbody>`来帮助CSS区分表格结构

#### 单元格合并

使用colspan="（列）想要合并的单元个数"或者rowspan="（行）想要合并的单元个数"，再删除多余的td（或th）

<br />

## 8.列表（用于布局）

#### 无序列表

ul里只能放li标签，所以其他容器放li里面就可以

`<ul>`

​	`<li>列表项1</li>`

​	`<li>列表项2</li>`

`</ul>`

#### 有序列表(规则同无序)

`<ol>`

​	`<li>列表项1</li>`

​	`<li>列表项2</li>`

`</ol>`

#### 自定义列表(同上)

`<dl>`

​	 `<dt>名词1</dt>`

​	`<dd>名词1解释1</dd`

​	`<dd>名词1解释2</dd>`

`</dl>`

注意**（li默认本身没有margin）**

`list-style-type` 用于**设置不同列表列表项的样式**。

无序列表常使用：

```css
ul {
    list-style-type:circle;  /* 每一项前都是圆圈 */
}
ul {
    list-style-type:square; /* 每一项前都是正方形 */
}
ul {
    list-style-type:none; /* 去除圆点 */
}
```

有序列表也可以用 list-style-type 来设置列表项

```css
ol {
    list-style-type:upper-roman;  /* 每一项前面都是大写罗马数字 */
}
ol {
    list-style-type:lower-alpha; /* 每一项前都是小写字母 */
}
```



#### li标签包含a标签

实际开发中导航栏不会直接用a标签，而是用li（列表）包含a标签的做法，1.语义更加清晰  2.故意对其关键字有被搜索引擎降权的风险

导航栏不给宽度是不想定死，让其自动适应





## 9.表单（用于填写信息，用户注册）

`<form action="url地址" method="提交方式" name="表单域名称" maxlength=""></form>`表单域

url地址为处理表单数据的地址，method有get，post

表单具有默认的提交行为，默认是同步的，同步表单提交，浏览器会锁死（转圈儿）等待服务端的响应结果。

表单的同步提交之后，无论服务端响应的是什么，都会直接把响应的结果覆盖掉当前页面。

表单中需要提交的表单控件元素必须有name属性

#### 表单元素`<input>`

```html
<!-- 通用提交按钮 -->
<input type="submit" value="Submit Form" >
<!-- 自定义提交按钮 -->
<button type="submit">Sunbmit Form </button>
<!-- 图片提交按钮 -->
<input type="image" src="graphic.gif" > 
```

type可以为text，number，password，button，reset（重置）submit（用于提交），radio（单选框，必须添加name才能使用），checkbox（复选框）等

科普：submit是button的一个特例，用于处理大量表单数据，而此时input里的name是表单的名称，需要填写name才能提交表单数据；亦或者input放在form标签里面

value为输入框内的提示语||充当提交给后台的数据||显示的文字

`placeholder="Search..."`  显示提示的文字

**用于单选和复选的默认属性 checked**

`checked="checked"`选中 `checked="真值"`

maxlength=“最大值”



#### 标签元素`<Label>`

`<label for="sex">男 </label>`       label用于增加用户体验，点击范围内即可选中某input（一般一个label绑定一个input）

`<input type="radio" name="sex" id="sex"  />`       label中的for对应input里的id

或者把input标签放在label里面也能达到同样的效果，此时仍然需要for和id（隐式的联系）

```html
<!-- 可以从体验感感觉到两者的不同 -->
<form>
    <label for="male">Male</label>
    <input type="radio" name="sex" id="male" />
    <br />
    <input type="radio" name="sex" id="female" />
</form>
```



**其实还有** `defaultCheck`：

 `defaultCheck` 只在初次渲染时生效，更新数据时不受控制，但是允许后续你通过点击手动更改它的选定

`checked` 始终受到控制，必须通过绑定 onchange 事件来控制选中情况

总结
`defaultChecked`、`defaultValue` 只在初始渲染时由状态控制，之后更新不再跟状态有关系，而checked、value在全过程中都受状态控制

开发中更多的是使用checked + onchange 组合



#### 表单元素`<select>` 下拉列表

```html
<select>
	<option value="1">选项1</option>
	<option value="2">选项2</option>
    <!-- 默认选中选项3 -->
	<option selected="selected">选项3</option> 
	...
<select>
```



#### 表单元素`<textarea>` 文本域

`textarea` 可以写大量文字（个人介绍，评论）

输入的评论作为element.value

```html
<textarea> 文字 </textarea> //如果没文字textarea必须写到同一行
```



#### 按钮 `button`

type属性：button的类型。可选值：

- `submit`: 此按钮将表单数据提交给服务器。如果未指定属性，或者属性动态更改为空值或无效值，则此值为默认值。
- `reset`:  此按钮重置所有组件为初始值。
- `button`: 此按钮没有默认行为。它可以有与元素事件相关的客户端脚本，当事件出现时可触发。
- menu: 此按钮打开一个由指定[``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/menu)元素进行定义的弹出菜单。



## 10 元素分类

块元素，独占一行，是一个容器或者盒子如

```
<div>   <ul>     <ol>     <li>  <h1>  <h2>等
但<p>   <h>  不能内置块级元素，只能放文字
```

行元素，不能设置宽高，只能容纳文本或者其他行内元素

```
<a>    <strong>   <b>     <em>    <span>  等
但是<a>不能再放<a>    特殊情况<a>可以转块级  <b>是粗文本
```

行内块元素，能在同一行，也能设置宽高，但是行内块之间有缝隙

```
<input/>    <img/>   <td>  <button>
```



#### 行内元素和块级元素的区别

块级元素：

- 会独占一行,默认情况下,其宽度自动填满其父元素宽度
- 块级元素可以设置width,height属性.
- 块级元素即使设置了宽度,仍然是独占一行.
- 块级元素可以设置margin和padding属性.
- 块级元素对应于display:block.

------------------------------------------------------------------------------------------

行内元素

- 不会独占一行,相邻的行内元素会排列在同一行里,直到一行排不下,才会换行
- 行内元素设置width,height属性无效，它的长度高度主要根据内容决定.
- 行内元素的margin和padding属性,**水平方向的padding-left,padding-right,margin-left,margin- right都产生边距效果,但竖直方向的padding-top,padding-bottom,margin-top,margin-bottom却不 会产生边距效果**，即水平有效，垂直无效



行块的转换详情请看CSS里的《行块转换》

h5标签推荐网址：

http://www.w3school.com.cn/

http://developer.mozilla.org/zh-CN/ 





## 11.HTML5新特性

#### 新增标签

i9以上版本浏览器才支持

```html
<header>: 头部标签
<nav>: 导航标签
<article>: 内容标签
<section>: 定义文档某个区域
<aside>: 侧边栏标签
<footer>: 尾部标签
<!-- 实质上都和div差不多，只是语义化了而已，主要针对搜索引擎
但是在i9中，需要把这些元素转换成块级元素，所以移动端更喜欢使用这些标签-->
```



#### 新增`<audio>`，`<video>`

新增`<audio>`音频，`<video>`视频，抛弃flash等插件功能

video尽量使用mp4格式，谷歌把音频，视频自动播放禁止了，audio和video属性用法差不多

```html
<video src="文件地址" 
autoplay="autoplay"自动播放  谷歌需要添加muted="muted"（静音播放）,才能实现自动播放
controls="controls"添加播放组件
loop="loop"循环播放
poster="图片地址"	视频封面显示图片
></video>

遇到不兼容的情况可以写成
<video width="320" height="240">
	<source src="" type="video/mp4">
	<source src="" type="video/ogg">
</video>
```

```js
const video = document.createElement('video');
video.crossOrigin = 'anonymous';
//自动播放
video.autoplay = false;
//是否静音
video.muted = true;
```

- height

  视频显示区域的高度，单位是 [CSS 像素](https://drafts.csswg.org/css-values/#px)（仅限绝对值；[不支持百分比](https://html.spec.whatwg.org/multipage/embedded-content.html#dimension-attributes)）。

- loop

  布尔属性；指定后，会在视频播放结束的时候，自动返回视频开始的地方，继续播放。

- muted

  布尔属性，指明在视频中音频的默认设置。设置后，音频会初始化为静音。默认值是 false, 意味着视频播放的时候音频也会播放。

- playsinline

  布尔属性，指明视频将内联（inline）播放，即在元素的播放区域内。请注意，没有此属性并不意味着视频始终是全屏播放的。

- poster

  海报帧图片 URL，用于在视频处于下载中的状态时显示。如果未指定该属性，则在视频第一帧可用之前不会显示任何内容，然后将视频的第一帧会作为海报（poster）帧来显示。

- preload

  该枚举属性旨在提示浏览器，作者认为在播放视频之前，加载哪些内容会达到最佳的用户体验。可能是下列值之一：

  - `none`: 表示不应该预加载视频。
  - `metadata`: 表示仅预先获取视频的元数据（例如长度）。
  - `auto`: 表示可以下载整个视频文件，即使用户不希望使用它。
  - *空字符串*: 和值为 `auto` 一致。每个浏览器的默认值都不相同，即使规范建议设置为 `metadata`。

  

#### 透明视频

使用video并不能直接播放出透明视频

需要用到动画（canvas（2个canvas）、webgl）来协同帮助

![](/simple-blog/html5的基本属性/Snipaste_2023-06-12_15-20-47.png)

如上图所示，源素材向右扩充了一倍的像素，用来存储Alpha通道的数值，在客户端渲染的时候，直接使用右侧像素点的R值，除以255，就得到了0-1之间的alpha取值 例如第一个像素点， 红色：右侧的RGB值为(255,0,0) + 左侧的R值(128) ，混合之后的 RGBA = (255,0,0,128/255) ~= (255,0,0,0.5)

客户端渲染

客户端拿到视频轨道数据后，解码出每一帧图片，然后通过左边yuv+右边的yuv混合后再上屏，gl公式可理解为

```js
gl_FragColor = vec4( 
texture2D(texture, vec2(vUv.x/2, vUv.y)).rgb, texture2D(texture, vec2(0.5 + vUv.x/2, vUv.y)).r );
```



#### 新增input的类型

```
type="email"    type="url"   type="date"  type="number"
type="search"   type="tel"(手机号码) 
限制用户只能使用"X"类型

/*表单属性*/
<input type="search" 
required="required" 填写字段不能为空
placeholder="XX"	表单的提示信息
autofocus="autofocus"	页面完成时自动聚焦到指定表单
autocomplete="on"	打开历史记录功能，需要加上name属性，放在表单内，成功提交过，可以可选择"off"
mutiple="multiple"	选择多个文件上传
>
```

此外还有必填属性

```html
<input type="text" required>
```

除此之外还有canvas、SVG、WebSocket，我分别在css高级、计网personnel的篇章中提及到，这里就不一一继续解释了。

## 12.网站的缩略图标

一般使用favicon.ico作为图标，主要的浏览器都支持。

通过第三方网站将png图片转化成ico图标，如http://www.bitbug.net/

转化成功后，在`<head> </head>`之间引入代码：

`<link rel="shortcut icon" href="favicon.ico type="XX">`(网页那里有代码直接copy)

在某网页的页面，在它的网址后输入"/favicon.ico" 可以直接获取它的ico



## 13.网站TDK三大标签优化SEO

SEO是搜索引擎优化，目的为对网站深度优化，使得网站排名位于搜索引擎使用后较前的位置。

#### 1.title

网站名-网站介绍（不超过30字）

#### 2.description

简要概述网站内容

#### 3.keywords

页面关键字，搜索引擎的关注点

#### logo的SEO优化

logo里首先放一个h1标签来提权，h1里再放一个链接，用于返回至首页，为了让搜索引擎收录我们，我们要在链接里放文字（网站名称），但是文字不要显示出来（文字大小设置为0，font-size: 0），最后给链接一个title属性





## 14.iframe标签

`iframe` 元素会创建包含另外一个文档的内联框架

听说`iframe`标签能耗高？安全性差？还很low？我看面试有问到，（我还没用过）所以以下是选取网上我个人觉得比较有用的关于 `iframe`的知识点

听说你长这样？

```html
<iframe src="demo.html" height="300" width="500" name="demo" scrolling="auto" sandbox="allow-same-origin"></iframe>
```

```html
<iframe src="地址" frameborder="0"></iframe>
```

还可以仿造别人的页面（假装自己做的，手动狗头）

#### 局限

**1、创建比一般的 DOM 元素慢了 1-2 个数量级**

`iframe` 的创建比其它包括 scripts 和 css 的 DOM 元素的创建慢了 1-2 个数量级，使用 iframe 的页面一般不会包含太多 `iframe`，所以创建 DOM 节点所花费的时间不会占很大的比重。但带来一些其它的问题：onload 事件以及连接池（connection pool）

**2、阻塞页面加载**

及时触发 window 的 onload 事件是非常重要的。onload 事件触发使浏览器的 “忙” 指示器停止，告诉用户当前网页已经加载完毕。当 onload 事件加载延迟后，它给用户的感觉就是这个网页非常慢。

window 的 onload 事件需要在所有 `iframe` 加载完毕后（包含里面的元素）才会触发。在 Safari 和 Chrome 里，通过 JavaScript 动态设置 `iframe` 的 SRC 可以避免这种阻塞情况

**3、唯一的连接池**

浏览器只能开少量的连接到 web 服务器。比较老的浏览器，包含 Internet Explorer 6 & 7 和 Firefox 2，只能对一个域名（hostname）同时打开两个连接。这个数量的限制在新版本的浏览器中有所提高。Safari 3+ 和 Opera 9+ 可同时对一个域名打开 4 个连接，Chrome 1+, IE 8 以及 Firefox 3 可以同时打开 6 个

绝大部分浏览器，主页面和其中的 `iframe` 是共享这些连接的。这意味着 `iframe` 在加载资源时可能用光了所有的可用连接，从而阻塞了主页面资源的加载。如果 `iframe` 中的内容比主页面的内容更重要，这当然是很好的。但通常情况下，`iframe` 里的内容是没有主页面的内容重要的。这时 `iframe` 中用光了可用的连接就是不值得的了。一种解决办法是，在主页面上重要的元素加载完毕后，再动态设置 `iframe` 的 SRC。

**4、不利于 SEO**

搜索引擎的检索程序无法解读 `iframe`。另外，`iframe` 本身不是动态语言，样式和脚本都需要额外导入。

综上，`iframe` 应谨慎使用。



#### contentWindow

**`contentWindow`** 属性返回当前[HTMLIFrameElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLIFrameElement)的[Window](https://developer.mozilla.org/en-US/docs/Web/API/Window)对象. 你可以使用这个`Window` 对象去访问这个iframe的文档和它内部的DOM. 这个是可读属性, 但是它的属性像全局`Window` 一样是可以操作的. (注意必须同源访问)

[关于contentWindow的示例](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLIFrameElement/contentWindow#关于contentwindow的示例)

```js
var x = document.getElementsByTagName("iframe")[0].contentWindow;
//x = window.frames[0];

x.document.getElementsByTagName("body")[0].style.backgroundColor = "blue";
// this would turn the 1st iframe in document blue.
```





#### iframe优化方案

iframe阻塞问题：https://www.cnblogs.com/sharpxiajun/p/4077515.html

加载优化阅读：https://www.open-open.com/bbs/view/1319458447249

iframe通信和一些很实用的功能：https://afantasy.ninja/2018/07/15/dive-into-iframe/

postMessage需要子应用配合，上面那个网址还讲述了iframe在线编辑器是怎么交互的：每次修改js代码，则发送一个post请求，POST 请求中还带有一个随机生成的 key，此时iframe的src指向对应key的一个url地址

iframe的讨论：https://www.stevesouders.com/blog/2009/06/03/using-iframes-sparingly/