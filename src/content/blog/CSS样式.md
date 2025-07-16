---
author: Hello
categories: 前端
pubDate: 2020-05-10 
title: CSS样式
description: 'CSS相关'
---

声明：**可以使用chrome的F12浏览学习别人的样式并且调试你的代码**

### 引入CSS

```css
/*1）link的写法：*/
<link rel="stylesheet" href="index.css">
/*2）import的写法：*/
<style type=”text/css”>
    @import url（“index.css”）；
</style>
```

**link和@import的区别：**

（1）link是XHTML标签，无兼容问题；@import是在CSS2.1提出的，低版本的浏览器不支持。

（2）link可以加载CSS，Javascript；@import只能加载CSS。

（3）link加载的内容是与页面同时加载；@import需要页面网页完全载入以后加载。（所以有时候浏览@import加载CSS的页面时会没有样式（就是闪烁），网速慢的时候还挺明显。）



## 1.主要定义

```css
/*是类型选择,标签选择器*/
元素（标签） {

}
/*选择所有元素*/
* {

}
/*的选择    选择多个类可以 <div class="类1 类2"></div>*/
.class(类名) {
	
}
/*id的选择,有点类似class，只能调用一次，别人切勿使用*/
#(id名) {
	
}
/*复合，后代选择器*/
元素1（可以是类名） 元素2（可以是类名） {

}
/*只选择亲儿子，孙子不选*/
元素1（可以是类名）>元素2（可以是类名） {
           
}
/*并集选择器，多个统一*/
元素1,
元素2 {
	
}
/*选择类名1的下一个兄弟节点元素2*/
类名1+元素2 {
    
}
/*m-small-cont 写成 &-cont的形式， & 表示嵌套的上一级*/
.m-small {
    &-cont {
    }
}
```

注意：如果一个元素拥有ID属性,那么ID属性的属性值就会成为window对象的属性名

#### 文字

注意：chrome默认最小展现字体为12px，想要查看需要在浏览器设置中设置

PC端解决小于12px字体问题的页面，需要自行设置使用transform属性（scale）对页面进行缩放解决

`font-size: 12px`   12像素大小文字   谷歌默认16px

`font-size: 12px`   12像素大小文字   行高为12*1.5=18

`font-weight: xxx`    字体加粗

`text-align: center`    文字水平居中对齐

`text-indent: 10px`   文本首行缩进,最好使用em，如`text-indent: 2em`,em是相对单位，当前1个文字元素的大小

`text-decoration: none`取消下划线

`line-height: 26px`    行间距，用QQ截图可以偷偷测量，等于盒子高度时垂直居中

`white-space: val;` CSS 属性是用来设置如何处理元素中的 [空白 (en-US)](https://developer.mozilla.org/en-US/docs/Glossary/Whitespace)。

- normal

  连续的空白符会被合并，换行符会被当作空白符来处理。换行在填充「行框盒子([line boxes](https://www.w3.org/TR/CSS2/visuren.html#inline-formatting))」时是必要。

- nowrap

  和 normal 一样，连续的空白符会被合并。但文本内的换行无效。

- pre

  连续的空白符会被保留。在遇到换行符或者[``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/br)元素时才会换行。 

- pre-wrap

  连续的空白符会被保留。在遇到换行符或者[``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/br)元素，或者需要为了填充「行框盒子([line boxes](https://www.w3.org/TR/CSS2/visuren.html#inline-formatting))」时才会换行。

- pre-line

  连续的空白符会被合并。在遇到换行符或者[``](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/br)元素，或者需要为了填充「行框盒子([line boxes](https://www.w3.org/TR/CSS2/visuren.html#inline-formatting))」时会换行。



#### 背景

`background-color`  //背景颜色 

使用背景渐变色： `linear-gradient`

```js
background: linear-gradient(90deg,#9370DB,#AFEEEE,#FFA500,#9370DB);
```

`background: rgba(red（数值）,green(数值),blue（数值），透明度（0-1）)`  //背景颜色 透明化

`background-image: url(地址)`//背景图片，常见于标志，logo或者超大背景图片，有点是便于控制位置

`baackground-repeat: no-repeat`//背景平铺，默认为平铺，可以改成取消平铺

`background-position: x  y`//背景图片的位置 ，可以使用方位名词，前后顺序可可以不一样top，center ，botton，left等（只写一个另外一个默认居中）。也可以使用精确单位x轴长度，y轴长度，（只写一个另外一个默认居中）

`background-attachment: scroll||fixed`//背景图像随对象内容滚动||背景图像固定`

`background`的复合方式（分别对应图片位置、图片大小，是否重复，url地址）

```css
background: left 5% / 60% 60% no-repeat-x url();
```



#### 列表

`list-style: none`//去掉无序列表里 li  列表前面的小圆点

#### 阴影

`box-shadow: 10px 10px 5px #888888;`  分别对应阴影的水平，垂直和阴影，颜色

`text-shadow:  1px 1px rgba(0,0,0,.2);`  文字阴影效果

#### input

`outline: none;` 消除输入边框

`border: 0;`   消除输入框的自带边框

#### 透明

`opacity: 0.5`   半透明

 `opacity: 1`   不透明



opacity / display none / visibility 的不同：https://segmentfault.com/a/1190000015116392



#### box-sizing

box-sizing 属性可以被用来调整这些表现:

- `content-box` 是默认值。如果你设置一个元素的宽为100px，那么这个元素的内容区会有100px 宽，并且任何边框和内边距的宽度都会被增加到最后绘制出来的元素宽度中。
- `border-box` 告诉浏览器：你想要设置的边框和内边距的值是包含在width内的。也就是说，如果你将一个元素的width设为100px，那么这100px会包含它的border和padding，内容区的实际宽度是width减去(border + padding)的值。大多数情况下，这使得我们更容易地设定一个元素的宽高。

`border-box`不包含`margin`



#### 尺寸单位

- px单位，像素单位

- em单位，em是相对于父元素的字体大小，如父元素的font-size为12px，子元素设置宽高为10em，则大小实际为10*12=120px

- rem单位，相对于html字体大小

- %单位，继承父元素单位

- dp单位，屏幕密度

- vh单位，viewpoint height，视窗高度，1vh等于视窗高度的1%。

- vw单位，viewpoint width，视窗宽度，1vw等于视窗宽度的1%。
  
  - **视区”所指为浏览器内部的可视区域大小**，即`window.innerWidth/window.innerHeight`大小，不包含任务栏标题栏以及底部工具栏的浏览器区域大小。
  
- dpr 物理像素比

  pc端一般都是1，移动端比如iPhone6/7/8都是2，移动端不尽相同

  `var dpr = window.devicePixelRatio || 1`



#### vh

视窗单位给移动端开发的适配是带来了极大的优势，但我想你在使用视窗单位的时候，应该也碰到了iOS上 Safari 的兼容性问题。因为，在iOS上的 Safari 有一个长期存在的，极其恼人的Bug，它不能与 `vh` 单位很好的配合。如果你将一个容器的高度设置为 `100vh` 时，会导致这个元素有点太高（会出现滚动条）。造成这种现象的主要原因是移动端上的 Safari 在计算 `100vh` 时忽略了它的部分用户界面。

**这是由于 Safari 和 Chrome 使用的计算方法造成的**

作者[Luke Channings](https://lukechannings.com/)于2021 年 6 月 11 日

Safari 的新浮动地址栏显示在我们的测试按钮上方，这或多或少与 iOS 14 的行为完全相同。

仍然说Safari 15 不会改变`100vh`😢 的行为。

**解决方案**：

方案1

Let’s get started first with the JS file:

您始终可以通过使用全局变量来获取当前视口的值`window.innerHeight`。该值将浏览器的界面考虑在内，并在其可见性更改时更新

```
const appHeight = () => {
 const doc = document.documentElement
 doc.style.setProperty(‘ — app-height’, `${window.innerHeight}px`)
}
window.addEventListener(‘resize’, appHeight)
appHeight()
```

**appHeigh**t function has sets new style property *var(` — app-height`)* including current window height, *— app-height* it is necessary for next steps.

```
:root {
 — app-height: 100%;
}html,
body {
 padding: 0;
 margin: 0;
 overflow: hidden;
 width: 100vw;
 height: 100vh;
 height: var( — app-height);
}
```

In the previous step I’ve created the reference *— app-height*, wrapping in the *var()* I’ve received CSS variable *var( — app-height)*. This variable is allowed to read values created by JS.

方案2

CSS solution (not recommend)
The last, but not the least solution is ` — webkit-fill-available`, this solution works only on Apple devices, it won’t solve the problem on Android devices. I don’t recommend this solution, but it’s worth showing.

诀窍在于`min-height: -webkit-fill-available;`body 作为对 的渐进增强`100vh`，它应该适用于 iOS 设备。

```
height: 100%;
height: -webkit-fill-available;
```

但是方法二在时可能出现的其他问题（例如，对旋转设备的影响、Chrome 没有完全忽略该属性等）。

参考：

[100vh problem with iOS Safari](https://medium.com/quick-code/100vh-problem-with-ios-safari-92ab23c852a8)

[移动 WebKit 中 100vh 的 CSS 修复](https://allthingssmitty.com/2020/05/11/css-fix-for-100vh-in-mobile-webkit/)



## 2.伪类选择器

```css
/*a超链接类   或者写成   a的类名:XXX{}*/
a:link            选择所有未访问的链接
a:visited         选择所有已被访问的链接
a:hover           常用，选择鼠标指向的链接
a:ative           鼠标按下未弹起的链接
/*如果全部都写，请按照LVHA的顺序写*/

/*input类，把获得光标的inut选取出来改写CSS*/
input:focus 
```



## 3.行块转换

```css
display:block            /*转块元素*/
display:inline           /*转行内元素*/
display: inline-block    /*转行内块*/
displat: table           /*成为一个块级表格元素*/
display: table-cell      /*使子元素成为表格单元格*/
/*使文字垂直居中  让文字行高=盒子的行高  行高>盒子高度偏下，<偏上*/
line-height: 盒子高度
```

#### 多行文字居中

1. 父元素 display的`table` + 子元素：`table-cell`   `vertical-align: middle` 配合可以实现多行文字居中

2. 父元素设置对应的`height`和`line-height`

   子元素设置`display:inline-block` + `vertical-align:middle`() + `line-height`

   (缺点：文本的高度不能超过外部盒子的高度。)

   ```css
   .parent {
         height: 300px;
         line-height: 300px;
       }
   
       .son {
         display: inline-block;
         width: 300px;
         line-height: 20px;
         vertical-align: middle;
       }
   ```

#### CSS水平垂直居中方式

1.绝对定位

```css
position: absolute;
top: 50%;
left: 50%;
transform:translate(-50%,-50%);
```

2.flex布局

```css
.parent{
	display:flex;
	justify-content:center;
	align-content:center;
}
```

3.grid布局，比flex的兼容性还低

```css
.parent {
    display: grid;
}

.child {
    align-self: center;
    justify-self: center;
}
```

```css
.parent{
	display: grid;
    place-items: center;
}
```

4.table-cell + vertical + text-align

```css
.parent {
    display: table-cell;
    vertical-align: middle;
    text-align: center;
}

.child {
    display: inline-block;
}
```

5.table-cell + vertical + margin

```css
.parent {
    display: table-cell;
    vertical-align: middle;
}

.child {
    /*加上 display: table 兼容ie7*/
    margin: 0 auto;
}
```

6.行内元素水平垂直居中

```css
text-align: center;
line-height: 300px;  /*和盒子高度保持一致*/
```



关于九宫格样式布局可以参考以下链接博主的讲解，很详细

https://juejin.cn/post/6886770985060532231#heading-2




#### display和visibility

`display: none`：该元素以及它的所有后代元素都会隐藏，无法使用屏幕阅读器等辅助设备访问，**占据的空间消失**

`visibility: hidden`：也可以隐藏这个元素，但是隐藏元素仍需占用与未隐藏时一样的空间，也就是说虽然元素不可见了，**但是仍然会影响页面布局。**（也就是仍然占据空间，只是隐藏起来）

除了占据空间这个重大的区别之外，还有2个区别：

- visibility具有继承性，给父元素设置`visibility:hidden`;子元素也会继承这个属性。但是如果重新给子元素设置`visibility: visible`,则子元素又会显示出来。这个和`display: none`有着质的区别
- `visibility: hidden`不会影响计数器的计数，如图所示，`visibility: hidden`虽然让一个元素不见了，但是其计数器仍在运行。这和`display: none`完全不一样



#### 解决行内元素造成的间距

- 给其父元素添加了**font-size:0**
  - 但是注意：IE6，IE7浏览器当设置font-size：0时，换行符、tab（制表符）、空格始终存在1px的空隙
    而最新版本的Safari浏览器，Chrome浏览器不支持字体大小为0的浏览器
- 设置浮动（不过可能会有布局问题）
- 设置margin为负值（感觉不太好）
- 将行内标签都放在同一行上





## 4.CSS的三大特性

#### 1.层叠性

样式冲突选择就近原则，把前面的覆盖掉，不冲突的不覆盖

#### 2.继承性

子标签会继承父标签的属性

#### 3.优先级

1.选择器相同，执行层叠性

2.选择器不同，继承/*(0,0,0,0)<元素(0,0,0,1)<类(0,0,1,0)<id(0,1,0,0)<行内样式style(1,0,0,0)<！important无限大

（属性选择器`input[class^=icon]{}`	是（0,0,0,1）（0,0,1,0） ）

（！important加在某属性后面，如color: green!important）

继承的你加了！important，权值还是（0，0，0，0），毕竟是继承过来的

3.复合选择器有权重叠加的问题

ul li{}权重为(0,0,0,1)+(0,0,0,1)                   li为(0,0,0,1)            .nav li为（0，0，1，1）

权重会叠加，但是永不进位，不是二进制           （a:hover为(0,0,1,1)）



## 5.CSS盒子

#### border

（会影响盒子大小）

```css
border-style: solid(实线边框，最常用) dashed(虚线)  dotted（点线边框） 
border-width: XXpx
border-color: XX
复写： border: 1px solid red
边框分开写法： border-top: 1px solid red

border-collapse:collapse      /*相邻边框合并*/
border-top-right-radius: 15px;  /*右上方改圆角，无top，right则全部都改*/
```

#### padding

内边距（会影响盒子大小，要设置了盒子宽高才会撑开）

适用于文字大小不一的盒子，不设置宽高，直接设置padding，字少空间小。字多空间大

子容器盒子没设置宽高，父容器盒子padding不会被撑开

```css
padding: 5px;
padding: 0 10px;    /*分别对应上下和左右*/
padding-top: 5px;    /*仅写上方内边距*/
```

#### margin

外边距，盒子和盒子之间的距离（不会撑开）

使用方法和padding是一致的	

margin可以让块级盒子水平居中：1盒子必须有宽度，盒子左右外边距设置为auto `margin: 0 auto;`(不适用于定位)

行内元素或者行内块元素水平居中只需在其父元素CSS样式中添加：text-align: center;	

#### 外边距合并问题

1.外边距合并指的是，当两个垂直外边距（2个margin）相遇时，它们将形成一个外边距。合并后的外边距的高度等于两个发生合并的外边距的高度中的较大者。而左右外边距不合并。
2.在CSS当中，相邻的两个盒子（可能是兄弟关系也可能是祖先关系）的外边距可以结合成一个单独的外边距。这种合并外边距的方式被称为折叠，并且因而所结合成的外边距称为折叠外边距。
3.注释：只有普通文档流中块框的垂直外边距才会发生外边距合并。行内框、浮动框或绝对定位之间的外边距不会合并。

4.我们可以在a元素或者b元素再包裹一个容器并触发该容器生成一个BFC，就不会发生margin重叠了

比如

```html
 <div class="container">    
     <p></p>
</div>
<div class="container">    
    <p></p>
</div>
```



#### overflow

| visible | 默认值。内容不会被修剪，会呈现在元素框之外。             |
| ------- | -------------------------------------------------------- |
| hidden  | 内容会被修剪，并且其余内容是不可见的。                   |
| scroll  | 内容会被修剪，但是浏览器会显示滚动条以便查看其余的内容。 |
| auto    | 如果内容被修剪，则浏览器会显示滚动条以便查看其余的内容。 |
| inherit | 规定应该从父元素继承 overflow 属性的值。                 |

使用了`overflow: scroll` 或者 `overflow: auto` 才可以使用scroll事件的那些 scrollTop属性等 

## 6.PS

jpg： JPEG对色彩保留好，高清颜色多

gif：常用于小图片动画，可保留透明背景

png：结合jpg和gif，储存形式丰富，支持透明背景

PSD：保存PS设计稿

图层切图：

选定图层，右键，快速导出为png

切片切图：

切片工具---》选中---》左上角文件---》导出---》存储为Web所用格式---》JPEG（png可用于保存透明图）（保存的时候选”选中的切片“）

ps插件切图：需要下载Cutterman插件



## 7.部署网站

免费的远程服务器：http://free.3v.do/



## 8.vh

vh：viewport hetght 指当前可视窗口高度 100vh为100%的可视区域

 height: 100vh;



## 9.BFC

我们常说的文档流其实分为**定位流**、**浮动流**、**普通流**三种。而普通流其实就是指BFC中的FC

Box 是 CSS 布局的对象和基本单位

Formatting context 是 W3C CSS2.1 规范中的一个概念。它是页面中的一块渲染区域，并且有一套渲染规则，它决定了其子元素将如何定位，以及和其他元素的关系和相互作用

BFC：块级格式化上下文，我个人理解的是一种规则

#### BFC布局规则

1. 内部的Box会在垂直方向，一个接一个地放置。
2. Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠（margin外边距合并问题）
3. 每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此。
4. BFC的区域不会与float box重叠。
5. BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此。
6. 计算BFC的高度时，浮动元素也参与计算（清除浮动的原理，overflow: hidden）

**触发BFC**

- 根元素（CSS 中的根元素是指 :root 选择器匹配到的元素，在 HTML 中是 html 元素）
- float属性不为none
- position为absolute或fixed
- display为inline-block, table-cell, table-caption, flex, inline-flex
- overflow不为visible

https://segmentfault.com/a/1190000013023485 这个网址里面又生成BFC的小案例，很有趣，可以加深理解

