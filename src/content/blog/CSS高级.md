---
author: Hello
categories: 前端
pubDate: 2020-05-31 
title: CSS高级
description: 'CSS相关知识'
---

## 1.图形

#### 精灵图

为了有效减少服务器接收和发射请求次数，提高速度出现的CSS技术。即将网页小背景图合成一张大图。

主要针对于背景图片（非产品类等更新换代图片）

主要使用background-position+x和y轴配合使用，x轴向右，y轴向下

```
background: url()no-repeat	-182px 0;		//分别对应x轴，y轴,基本都是负值
```

缺点：文件大，放大缩小会失真，更换复杂



图片压缩优化网站：

- 自动生成雪碧图样式的网站：http://www.spritecow.com/	

- 熊猫压缩较少图片体积 在线压缩网站：https://tinypng.com/

- `image` 转 `DataUrI`的网址：http://tool.c7sky.com/datauri/
  
  -  **传统的url在浏览器地址栏中输入，可以直接导航到目标地址；而data URL则是一个data的url表现，可以理解为用url代表数据**
  
  - 浏览器不会缓存内联图片资源；
  
  - 兼容性较差，只支持`ie8`以上浏览器；
  
  - 超过`1000kb`的图片，`base64`编码会使图片大小增大，导致网页整体下载速度减慢
  
  - mobify最新的测试数据：DataURI要比简单的外链资源要慢6倍。
  
    ![](/CSS高级/image-20220619235353118.png)
  
- 压缩图片可以使用统一的压缩工具 — `imagemin`，里面提供图片压缩、渐进式图片转换
  
  - 渐进式图片一开始就决定了大小，而不像Baseline图片一样，不断地从上往下加载，从而造成多次回流，但渐进式图片需要消耗CPU去多次计算渲染，这是其主要缺点

更多图片优化方式可以看https://akarin.dev/2021/11/04/progressive-image-loading/

还有nextjs对图片优化的方案：https://github.com/findxc/blog/issues/68



#### svg + canvas

`SVG` 指可伸缩矢量图形 (Scalable Vector Graphics)，基于可扩展标记语言XML（老），SVG 图像在放大或改变尺寸的情况下其图形质量不会有所损失。SVG是通过DOM操作来显示的。

`canvas`：canvas 是H5新出来的标签(技术比较新)。画布是一个矩形区域，您可以控制其每一像素，Canvas是逐像素进行渲染的，一旦图形绘制完成，就不会继续被浏览器关注。canvas 拥有多种绘制路径、矩形、圆形、字符以及添加图像的方法

SVG & canvas的区别：

- SVG不依赖分辨率
- SVG支持事件处理器
- SVG适合带有大型渲染区域的应用程序（地图）
- SVG复杂度高会减慢渲染速度（可能会reflow）
- SVG不适合游戏应用
- 但是在大部分场景中被，SVG 具有重要的优势，它的内存占用更低（这对移动端尤其重要）、渲染性能更高，并且用户使用浏览器内置的缩放功能时不会模糊。（面向低端安卓机，特定图表，水球图等）



- canvas依赖分辨率
- canvas不支持事件处理器
- canvas文本渲染能力较弱
- canvas能够以png、jpg格式保存结果图像
- canvas适合图像密集型游戏（他不会relfow）
- Canvas 更适合绘制图形元素数量较多（这一般是由数据量大导致）的图表（如热力图、地理坐标系或平行坐标系上的大规模线图或散点图等），也利于实现某些视觉 [特效](https://echarts.apache.org//examples/editor.html?c=lines-bmap-effect)



## 2.字体图标

iconfont常用于一些小图标（样式简单），展示状态时图标，实际上是字体

优点1.轻量级，够小      2.灵活性，可改多种效果      3.几乎支持所有浏览器

下载：相应网站（如https://icomoon.io/）下载后得到压缩包，解压后，把下载包里的fonts放入页面根目录下

使用：在CSS中根据说明引用全局声明，然后再在个体css中再次引用你想要的声明，同时可以自己调色和字体大小（font-size）

这里以阿里的图标为例子，把项目添加好之后，根据操作https://www.iconfont.cn/help/detail?spm=a313x.7781069.1998910419.16&helptype=code一步一步来（这里是unicode引用），注意：**复制代码的时候，一定要在url的值中补充 "http:"** 

（使用bootstrap框架，可以直接使用其官网给的图标）



##### @font-face 

CSS at-rule 指定一个用于显示文本的自定义字体；字体能从远程服务器或者用户本地安装的字体加载. 如果提供了local()函数，从用户本地查找指定的字体名称，并且找到了一个匹配项, 本地字体就会被使用. 否则, 字体就会使用url()函数下载的资源。

通过允许作者提供他们自己的字体，@font-face 让设计内容成为了一种可能，同时并不会被所谓的"网络-安全"字体所限制(字体如此普遍以至于它们能被广泛的使用). 指定查找和使用本地安装的字体名称可以让字体的自定义化程度超过基本字体，同时在不依赖网络情况下实现此功能。

在同时使用url()和local()功能时，为了用户已经安装的字体副本在需要使用时被使用，如果在用户本地没有找到字体副本就会去使用户下载的副本查找字体。

@font-face 规则不仅仅使用在CSS的顶层，还可以用在任何CSS条件组规则中.

```css
@font-face {
  font-family: "Open Sans";
  src: url("/fonts/OpenSans-Regular-webfont.woff2") format("woff2"),
       url("/fonts/OpenSans-Regular-webfont.woff") format("woff");
}
```



## 3.三角形

若盒子设置宽高为0；此时又设置边框，则会形成组成一个正方形的4个三角形，实际上我们写三角形可以利用这个原理，把其他三个三角形隐藏起来则就只有一个三角形了

```css
width: 0;
height: 0;
/*line-height: 0;	font-size: 0;	有时需要添加，看浏览器*/
/*先设置一个边框，尽量大，以边框概括盒子大小*/
border: 50px solid #ccc;
border-color: transparent red transparent transparent //上右下左的颜色
```



## 4.用户界面

#### 鼠标样式	cursor

`cursor: defalut`	默认无样式

`cursor: pointer`	小手

`cursor: move`	移动

`cursor: text`	文本

`cursor: not-allowed`	禁止



#### 轮廓线

给表单（input）添加 `outline: 0;`，点击表单时，会去掉默认的l蓝色光标



#### 防止拖拽文本域

`textarea{ resize: none }`可以使文本框没有拖拽选项



## 5.Vertical-align(图片)

css常用vertical-align让图片和文字对齐（但是只能针对行内元素或者行内块元素）

`vertical-align: middle;`	中线对齐（一般使用这个来对齐）

图片底侧放置于盒子内时，时常有一个空白缝隙，可以使用`vertical-align: middle||top||bottom;`将其解决	（其实还可以直接转成块元素，但是此方法不提倡）

其实也可以将该盒子转化成 `display: table-cell`，然后同样可以使用`vertical-align`属性



#### 常用的压缩图片地址（png）

https://tinypng.com/



## 6.文字溢出变省略号（推荐让后端写）

单行文本：`white-space: nowrap`		//强制一行内显示

​					`overflow: hidden;`		//溢出隐藏			

​					`text-overflow: ellipsis`		///变成省略号

多行文本：（有较大兼容性问题，适用于移动端或者webkit浏览器）

​					`overflow: hidden;`		+	`text-overflow: ellipsis`		

```css
display: -webkit-box;	/*单行伸缩盒子*/
-webkit-line-clamp: 2;	/*限制其文本行数*/
-webkit-box-orient: vertical; 	/*设置盒子的子元素排列方式，（垂直居中）*/
```



## 7.常见布局技巧

可以使用margin的负值来**消除浮动边框的重合**（消除产生的巨大影子）如：

`margin-left: -Xpx;`

想要**移动到某个边框内自动变色**可以使用hover，但是当排列方式为每个盒子的右边框被另外一个盒子的左边框压住时，变色效果会出bug，正确做法是：`xx:hover{ position: relative; }`添加相对定位使其马上覆盖当前所有单位

如果失败，有可能是因为当前已经添加了绝对定位了，此时只需要提高层级：`z-index: 1;`



## 8.CSS初始化

为了照顾浏览器兼容，必须首先进行CSS初始化，即重新设定CSS个标签的初始默认值



## 9.CSS3新特性

ie9+才支持

#### 属性选择器

可以不借助类选择器

`input[att] {}`  带有att属性值的被选中
`input[att="value"] {}`	带有att属性并且属性值等于value被选中

`input[class^=icon]{}`	选择类属性以icon开头的所有标签

`input[class$=icon]{}`	选择类属性以icon结尾的所有标签

`input[class*=icon]{}`	选择类属性含有icon的所有标签

如

```css
.local-nav li [class^="local-nav-icon"] {  }
```

类选择器，伪类选择器，属性选择器（伪类选择器、属性选择器一般是11，因为包含标签名+/伪类名属性名=1+10=11）它们权重都为10

#### 结构伪类选择器

first和last等可以来了解一下，实际开发不太建议使用，也比较少使用。

值得注意的是 `nth-child(n)`比较重要

n可以是数字，可以是关键字（even偶数，odd奇数），甚至公式

`ul li:nth-child(even){  }`    //选择所有的偶数孩子

`ul li:nth-child(n){  }`    //选择所有孩子,因为n是公式类似n++，依次施加CSS效果

`ul li:nth-child(2n){  }`    //选择所有的偶数孩子

`ul li:nth-child(-n+5){  }`    //选择前5个孩子

nth-of-type和nth-child的不同：

`section div:nth-child(1){ }`    //先排序，再看是否符合div，如果是div就渲染

`section div:nth-type(1){ }`    //先看是否符合div，如果是就在div里排序，选择第一个就渲染

#### 伪元素选择器

通过CSS创建新的子标签（比较简单的），从而简化html结构，（**还与之前清除浮动使用的伪元素方法有关**）

```css
element::before{ 
	content：'XX';       /*必须要有content属性，为内容*/
}                    	/*在元素内部前面（左）插入内容*/
element::after{ 
	content: 'XX';
}                    	/*在元素内部后面（右）插入内容*/
```

它和标签选择器一样，权重=1，且为行内元素，想要设置大小必须转行内块

（还可以有element:hover::before{}的操作）

#### 伪类和伪元素

单冒号(:)用于CSS3伪类，双冒号(::)用于CSS3伪元素

- 双冒号是在当前规范中引入的，用于区分伪类和伪元素。不过浏览器需要同时支持旧的已经存在的伪元素写法，比如:first-line、:first-letter、:before、:after等，而新的在CSS3中引入的伪元素则不允许再支持旧的单冒号的写法;
- 所以我们最好养成习惯，伪元素写 `::` 伪类写 `:`

![](/CSS高级/weiyuansu.jpg)

![](/CSS高级/weilei.jpg)



#### CSS3盒子模型

只需增加如下代码

```css
box-sizing: content-box;  /*默认*/
box-sizing: border-box;   /*只看盒子大小，不考虑border和padding因素*/
```

即可不用考虑border和padding因素是否会将盒子本身撑大。

标准盒模型：`box-sizing：content-box`

怪异盒模型：`box-sizing：border-box`

这里提及到盒子模型就讲一讲标准盒模型和怪异盒模型



#### 盒子模型

**W3C盒子模型(标准盒模型)和IE盒子模型(怪异盒模型)**

标准盒模型：

盒子实际内容（content）的`width/height`=我们设置的`width/height;`

盒子总宽度/高度=`width/height+padding+border+margin`。

怪异盒模型：

盒子的（content）宽度+内边距`padding`+边框`border`宽度=我们设置的`width/heigh`

盒子总宽度/高度=`width/height + margin` = `内容区宽度/高度 + padding + border + margin`。

总结：

总大小其实是一样的，只是我们设置标准盒子宽高是设置内容宽高，设置怪异盒子宽高是内容 + padding + border 宽高



#### CSS3滤镜filter

用于模糊图形效果，`filter: 函数();`

如：`filter:blur(5px);`		//模糊处理，数值越大越模糊

……

如果是只是单纯模糊背景图片，可以使用 `backdrop-filter`

```css
backdrop-filter: blur(8px);
```



#### CSS3calc函数(计算函数)

`width: calc(100% - 80px);`	//宽度永远比父盒子宽度小30px

#### CSS过渡（重点）

一些变化的动画效果（时间缓滞），经常和 :hover、transform等 一起搭配

在官网中查看到兼容性比较差，反而@keyframe的兼容性很不错？！！

```css
transition: 要过渡的属性 花费的时间（单位为s） 运动曲线（默认ease，可以省略） 何时开始（默认0s，可省略）;
transition: width 0.5s,heigh 0.5s;	/*多个属性","分割，想要更多属性，直接属性值写all*/
xx:hover{width:100px;heigh:100px;}
```

过渡的属性：

| none       | 没有属性会获得过渡效果。                              |
| ---------- | ----------------------------------------------------- |
| all        | 所有属性都将获得过渡效果。                            |
| *property* | 定义应用过渡效果的 CSS 属性名称列表，列表以逗号分隔。 |



## 10.CSS的more

### css的2D转换

`transform`可以理解为变形  移动：translate   旋转：rotate   缩放：scale

2d为二维坐标，x轴向右，y轴向下

#### translate类似于定位

```css
transform:translate(x,y);
transform:translateX(n);
transform:translateY(n);  /*单位是px，如果是百分号，则它的距离是盒子自身高宽对比出来的*/
```

translate最大的优点：不会影响其他元素的位置，绝对定位会脱标，margin会影响，（有点像相对定位，但是更方便，可以加过渡效果）

可用于定位父盒子的中间位置 使用：

```
position: absolute;
top: 50%;
left: 50%;
transform:translate(-50%,-50%);
```

但是它对行内标签没有效果

#### rotate旋转

```css
transform:rotate(度数deg);
transform-origin:x y;   /*设置元素旋转依靠的中心点*/
```

x，y默认为50%，50%，设置x，y可以可是bottom，left等，如transform-origin:left bottom;为设置左下角为中心点

#### scale之缩放

```css
transform:scale(x,y);/*里面的数字不跟单位，是倍数，x，y分别是宽，高*/
transform-origin:x y;   /*设置元素旋转依靠的中心点*/
```

若只有一个参数，则同比放大

使用scale的优点：变大时不会影响其他盒子的位置，且放大是以中心向外扩张的放大，直接修改width和heigh放大是直接往下放大



## 11.动画

用keyframes定义动画

```css
@keyframes 动画名称 {
    0%{
        width:100px....
    }
    100%{
        width:200px....
    }
}//可以设置25%，75%等多个状态，习惯上把0%也写了
//以下也可以
@keyframes 动画名称 {
    from{
        width:100px....
    }
    to{
        width:200px....
    }
}
```

0%动画的开始    100%动画的结束

1.可以做多个状态变化 keyframe关键帧

2.里面的数字为整数

3.百分比为时间的划分

使用动画：

```css
div {
	animation-name:动画名称;
	animation-duration:持续时间;
	animation-iteration-count:播放次数，可以为infinite;
	animation-direction:xx; 
    /*设置动画在每次运行完后是反向运行还是重新回到开始位置重复运行。*/
    /*默认normal，alternate为设置动画交替反向运行，reverse为反向运行*/
	animation-fill-mode:xx; //默认backwards，动画结束后返回原来位置，forwards可取消该功能
	animation-play-state:xx; //running/paused  是动画运行或者暂停
	animation-timing-fuction: ease; //默认ease加速度，linear匀速，step分步。。。
}
```

当然 `animation-timing-fuction` 可以使用 `cubic-bezier` 控制动画速度  https://cubic-bezier.com/#.51,0,.47,.99

使用多个动画用“，”分隔

如animation: bear 0.7s steps(8) infinite, move 0.7s ......

```css
animation: name duration timing-function delay iteration-count direction fill-mode play-state;
```



animation一个推荐网址：https://xsgames.co/animatiss/



### 3D转换

x轴向右，y轴向下，z轴向外，最常用的是3d位移和3d旋转,以下许多功能与2d十分相似

设置为3d模式(变形效果)

如果选择平面，元素的子元素将不会有 3D 的遮挡关系。

由于这个属性不会被继承，因此必须为元素的所有非叶子子元素设置它。

```css
transform-style: preserve-3d
```



#### 3d移动

```css
transform: translate3d(x,y,z);
transform:translateZ(n);  /*translateZ一般采用px，3d的z轴显现出来需要透视功能*/
```



#### translateZ踩的坑

1.在android上，如果对元素同时设置zindex和transform translateZ的值时，在显示上zindex的优先级要高于translateZ

2.在ios上，则相反，translateZ的优先级要高于zindex

3.所以最好在设置一系列元素时，zindex的值和translateZ的值应该一起逐级增长或逐级减少

https://blog.csdn.net/qappleh/article/details/95636682

我的解决方案：

```js
overflow:hidden //用于消除3d环境下ios层级问题
```

如果放在父级别不行，那就放在爷爷级别



网上的解决方案：

**方法1：**
父级，任意父级，非body级别，设置`overflow:hidden`可恢复和其他浏览器一样的渲染。

**方法2：**
以毒攻毒。有时候，页面复杂，我们不能给父级设置`overflow:hidden`，怎么办呢？

杨过的情花剧毒怎么解的？断肠草啊，另一种剧毒。这里也是类似。既然“穿越”的渲染问题是由3D transform变换产生的，那么，要解决此问题，我们也可以使用3D transform变换。



#### 透视

透视我们也成为视距，即眼睛到屏幕的距离，透视的单位是像素，透视越小，盒子越大

透视写在被观察元素的父盒子上

```
perspective: xxpx;
```

#### 3d旋转

一般加上透视效果会比较明显，3d**旋转方向**遵循左手定则：

左手大拇指指向旋转轴的方向，手指弯曲的方向则为旋转的方向

```css
transform: rotateX(度数); /*沿着X轴旋转*/
transform: rotateY(度数);
transform: rotateZ(度数); /*z轴旋转和2d普通rotate有点像*/
transform: rotate3d(x,y,z,度数); /*自定义轴旋转*/
```

自定义旋转只对x轴选取为transform: rotate3d(1,0,0,度数);    对角线旋转为transform: rotate3d(1,1,0,度数)

transform要看情况选择：先写旋转rotate再写移动translate或者相反情况

#### 3d呈现transform-style

控制子元素是否开启三维立体环境，代码要写给父级（一定是父级，不能爷爷级别，亲测过），此属性很重要

```css
transform-style: preserve-3d /*此为开启立体空间，但是默认值为flat，不开启立体空间*/
```



## 12.styled-components

秉承着万物皆是组件的思想，让css样式变成组件，来加入

```shell
npm i styled-components
```

如果是配合上ts，还需要下载它的声明文件

```shell
npm i --save-dev @types/styled-components
```

styled-components配合react使用

它内部还支持sass、less语法，先声明一个对象 `styled.标签名+css模板字符串`

```js
import React from "react";
import styled from 'styled-components'

export default function index() {
  const StyleFooter = styled.footer`
    background: yellow
    ul{
      display: flex;
      li{
        flex:1
      }
    }
  `
  return <div>
    <StyleFooter>
      <ul>
        <li>商店</li>
        <li>商店</li>
      </ul>
    </StyleFooter>
  </div>;
}
```

对子组件使用styled-components的方式：

 `styled(子组件)+css模板字符串`

同时子组件还需要通过`props.className`接收该样式

```js
import React from "react";
import styled from 'styled-components'

export default function Index() {
  const StyleChild = styled(Child)`
    background: yellow
  `
  return <div>
    father
    <StyleChild></StyleChild>
  </div>;
}
function Child(props: any) {
  return (
    <div className={props.className}>child</div>
  )
}
```



#### 优缺点

**常规css性能 vs cssinjs**

css in js 更小（包的大小）

常规css渲染时间更短

并且：为了更好地比较用户交互，而不仅仅是页面加载。测量了进行项目分组的拖放活动性能。结果总结如下：即使在这种情况下，Linaria在几个类别中也击败了CSS-in-JS。

参考：https://zhuanlan.zhihu.com/p/513843865



## 13.clip-path

一个用来设置蒙版的css属性，用它来绘制区域，只有在区域内的部分才能被看到，它支持

- circle（圆形）
- ellipse（椭圆）
- polygon（多边形区域）

使用该蒙版后不能搭配box-shadow，因为此时蒙版被蒙住的部分，会展示不出box-shadow

但是可以使用伪元素 before 代替阴影，设置为阴影的颜色

各种形状的示例：https://blog.csdn.net/weixin_44116302/article/details/98882841

一个小的教学视频在b站：https://www.bilibili.com/video/BV18y4y1i7oP?zw

该教学的文档https://zxuqian.cn/videos/effects/effects-glitch/



## 14 CSS3中-moz-或-webkit-是什么意思

CSS3中新增了一些属性，例如box-reduis、box-orient、text-overflow等等，而这些属性在以往的版本中是不存在的，或者不被支持的，因此，针对不同的浏览器，规定其内核名称让它们可以对这些新增属性进行解析。这看上去是一个合理的解释，即`-moz-`是针对firefox的，`-webkit-`是针对safari和chrome的。