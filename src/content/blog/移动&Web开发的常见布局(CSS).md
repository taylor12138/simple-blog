---
author: Hello
pubDate: 2020-10-02
categories: 前端
title: 移动&Web开发的常见布局(CSS)
description: 'css相关知识'
---

## 1.视口

#### 视口分类

视口可以分为布局视口，视觉视口和理想视口

布局视口：一般移动设备浏览器都默认设置一个布局视口（980px），用于早期PC端页面在手机上显示的问题

缺点：使得元素看上去很小，字体小

视觉视口：用户正在看的**网站区域**，我们可以通过缩放操作视觉视口，但是不影响布局视口

理想视口：设定最理想的浏览和阅读宽度，与要手动添加meta视口标签通知浏览器（乔布斯发明）

```css
<meta name="viewport" content="width-device-width, user-scalable=no,initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
```

content="width-device-width" 适应窗口大小

user-scalable=no 不允许用户缩放

maximum-scale=1.0 初始的最小缩放比

minimum-scale=1.0 初始的最大缩放比

## 2.多倍图

比如说2倍图，我们可以用2x图来描述，多倍图是为了在移动端上显示更加高清

在pc端，1px=一个物理像素，但是移动端不尽相同

移动端有物理像素比，可从px转化移动端时，（开发尺寸）px × 物理像素比 = 移动端显示的像素，我们可以通过

```js
Window.devicePixelRatio
//返回当前显示设备的*物理像素*分辨率与*CSS像素*分辨率之比
```

来查看当前的像素比

`icon_alipay.png`→iPhone 1-3代的手机(已经不考虑了)

`icon_alipay@2x.png`→iPhone4/4S/5/5S/6/6S/7对应尺寸，这就是我们通常所说的2倍图

`icon_alipay@3x.png`→iPhone6P/6SP/7P使用的尺寸，这就是3倍图

https://www.zhihu.com/question/26195746

#### 背景缩放background-size

注意：background-size一定要放在background属性后设置

background-size用于规定背景尺寸

```css
/*现有background:  才能设置*/
background-size: 图片宽度,图片高度; /*可以px，可以百分比（相对于父盒子）*/
background-size: cover;  /*完全盖住盒子，可能图片显示不全*/
background-size: contain; /*宽高完全适应父盒子，父盒子可能有空白区域*/
```

切图时可以用ps里的cutterman多倍切图

#### 精灵图缩放

1.使用工具（如firework）把精灵图缩放为原来的一半

2.根据大小测量坐标

3.注意代码里面的background-size也要写：精灵图原来的一半

（原图进行修改查看， 但是不要保存）

（或者直接上，用chrome调试就行了）

`background-size: 宽度（原来的大小/倍数）  高度auto`



## 3.移动端开发的选择

1.单独移动端页面（主流）：京东、淘宝

pc和手机打开后显示的网页布局不同

2.响应式页面兼容移动端：三星官网

响应屏幕宽度，制作麻烦，需要大量调整兼容性

#### CSS的初始化

推荐使用 normalize.css

#### CSS3盒子模型

传统盒子计算方式：CSS设置的width+border+padding

CSS3盒子模型：盒子宽度=CSS设置的宽度width包含了border+padding

设置方式：(CSS高级部分讲过，但是使用此方法后文字使用line-heigh居中会有所影响,原因是我们要对其的是盒子内部中间的位置，即去除掉边框的高度的中间位置，但是line-heigh会把所有方框所有高度算进去)

```css
box-sizing:border-box;
```

#### 移动端链接清除高亮

移动端点击完链接 `<a>` 会出现高亮 ，清除高亮可用

```css
-webkit-tap-highlight-color:transparent;
```

#### 移动端链接清除外观效果

在移动端浏览器默认的外观上在ios上加上这个属性才能给按钮和输入框自定义样式（清除原来的样式）

```css
-webkit-appearance: none;
```

#### 禁用长安页面弹出菜单

```css
img, a {-webkit-touch-callout: none; }
```



## 4.移动端常见布局

不需要像pc端一样排列版心

单独移动端页面（主流）：流式布局（百分比布局）（京东）、flex弹性布局（新闻网，强烈推荐）、less+rem+媒体查询布局（苏宁）、混合布局

### 流式布局

也就是百分比布局，非固定像素布局，可自由伸缩

为了保护屏幕不被拉过宽（缩过窄），导致里面的元素显示出现问题，设置最大最小宽度

```css
max-width: xxpx;
min-width: xxpx;
```



### flex布局

传统布局：兼容性好，布局繁琐，有一定局限

flex布局：操作方便，pc端浏览器支持差，IE11或者更低版本不支持或仅部分支持

flex可以让原本span（无法设置宽高）成功使用宽高属性，即不需要浮动，更不用清除浮动

#### （1）flex原理

flex是flexible box的缩写，意为弹性布局，任何一个容器都可以指定为flex布局（谁都可以用，除了IE）

父盒子设置为flex后，子元素的float、clear、vertical属性都失效

采用flex布局的元素称为flex容器，他的所有子元素自动成为容器成员，称为flex项目，即它是通过给父盒子添加flex属性，来控制子盒子的位置和排列

#### （2）flex常见父项属性

**默认主轴方向是x轴，水平向右  侧轴方向是y轴  水平向下**，我们的元素是跟着主轴排列地

`flex-direction`   设置主轴方向，剩下那个就自动变成侧轴

1.默认值row从左到右

2.row-reverse从右到左

3.column从上到下

4.column-reverse从下到上



`justify-content`  设置主轴上子元素的排列方式

1.flex-start默认

2.flex-end从尾部开始排列

3.center在主轴居中对齐

4.space-around平分剩余空间

5.space-between先两边贴边，再平分剩余空间



`flex-wrap`  设置子元素是否换行

默认不换行，装不开会缩小子元素的宽度，自动适应

- nowrap：不换行，默认
- wrap：换行
- wrap-reverse：反着来换行



`align-content`  设置侧轴上的子元素的排列方式（多行）（即有换行情况）（单行情况下没用）

1.flex-start

2.flex-end从尾部开始排列

3.center在主轴居中对齐

4.stretch拉伸，默认

5.space-around平分剩余空间

6.space-between先两边贴边，再平分剩余空间



`align-items`    设置侧轴上的子元素的排列方式（单行）

1.flex-start

2.flex-end从尾部开始排列

3.center在主轴居中对齐

4.stretch拉伸，默认，但是子盒子不要带高度



`flex-flow`  复合属性，相当于同时设置flex-direction和flex-wrap

```css
flex-flow: column wrap;
```



#### （3）flex常见子项属性

`flex`属性，定义子项目分配**剩余空间**，用flex表示占有份数

```css
flex: number;/*默认为0*/  
```

如果是flex：1的话，则将改行剩余空间全部划分给该子元素，不用设置宽高，且类似于百分比流式布局，可以根据窗口大小调节剩余空间大小

如果该行没有设置任何子元素在该行（假设当前主轴为x轴），然后将三个子元素设置flex：1，则每个盒子占33.33%的宽度（即设置该盒子的主轴长度）

A设置flex:2 ， B设置flex:1 则A占比2/3，B占比1/3

(其实可以写百分比 即flex: 20%, 相对父级来说)



`align-self`，控制子项自己在侧轴上的排列方式。

它允许单个项目与其他项目不一样的对齐方式，可以覆盖align-items属性，默认值为auto，表示继承align-items的属性

```css
span:nth-child(3) {
	align-self: flex-end; /*只让第三个盒子在侧轴上从尾部开始排列*/
}
```



`oder`定义项目的排列顺序，数值越小，排名越靠前，注意，和z-index不一样（定位属性）

```css
span:nth-child(2) {
	order:-1;  /*让2号盒子跑到1号盒子前面，因为默认是0，0<1*/
}
```



#### （4）flex的参数

```css
flex: 1
```

相当于

```css
flex-grow：1
flex-shrink：1
flex-basis：0%。
```

- 第一个参数表示: **flex-grow 定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大**
- 第二个参数表示: **flex-shrink 定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小**
- 第三个参数表示: **flex-basis**给上面两个属性分配多余空间之前, 计算项目是否有多余空间, 默认值为 auto, 即项目本身的大小**

|   单值语法    |     等同于     |     备注     |
| :-----------: | :------------: | :----------: |
| flex: initial | flex: 0 1 auto | 初始值，常用 |
|    flex: 0    |  flex: 0 1 0%  |  适用场景少  |
|  flex: none   | flex: 0 0 auto |     推荐     |
|    flex: 1    |  flex: 1 1 0%  |     推荐     |
|  flex: auto   | flex: 1 1 auto |  适用场景少  |



### Rem适配布局

#### （1）rem基础

rem是一个单位（root em），是一个相对单位，类似于em，em是父元素的字体大小，如父元素的font-size为12px，子元素设置宽高为10em，则大小实际为10*12=120px；而不同的地方在于rem是相对于html元素的字体大小，rem的优点是可以通过修改html的文字大小来改变页面中的元素大小

#### （2）媒体查询

媒体查询是CSS3的新语法，使用@media可以针对不同屏幕尺寸设置不同的屏幕样式

```css
/*用@media开头，mediatype是媒体类型，关键字and、not、only，media feature是媒体特性，要用小括号包含*/
@media mediatype and|not|only (media feature) {
	CSS-Code;
}
```

mediatype查询类型： all 用于所有设备      print 用于打印机和打印预览        **screen**用于电脑屏幕，智能手机

媒体特性：暂且先了解三个 

1.width 定义输出设备页面可见区域的宽度

2.min-width 定义输出设备页面最小可见区域宽度

3.max-width 定义输出设备页面最大可见区域宽度

```css
@media screen and (max-width: 800px) and (min-width: 540px) {   /*在屏幕上且最大宽度为800px且最小宽度为540px则设置该样式*/
	body {
		background-color: pink;
	}
}
```

当样式改变比较多的时候（如三星官网首页根据页面不同大小的变化样式的改变），可以针对不同的媒体使用不同的stylesheets（样式表）原理，直接在link中判断设备的尺寸，引用不同的CSS文件

```html
<link rel="stylesheet" href="style320.css" media="screen and (min-width: 320px)">
```

媒体查询最好的方法是从小到大



然后补充的一个点就是在@media：媒体查询第 4 级（第四版）（第五级仍然在起草）之后，支持这样的媒体查询写法：

```css
/* New Way */
@media (width <= 768px) {
 …
}
@media (width >= 375px) {
 …
}
@media (375px <= width <= 768px) {
 ...
}
```



### rem的实际适配

1.按照设计稿与设备宽度比例，动态计算并设置html根标签font-size大小（屏幕宽度/划分的份数=font-size的大小）（划分份数有15、20、10都有可能，苏宁移动端网页是15）

2.CSS中，设计稿元素宽、高、相对位置等取值，按照同等比例换算为rem

rem适配方案一：less   媒体查询  rem

适配方案二：flexible.js    rem   (推荐)



#### flexible.js -> rem

再也不用太过繁琐的写下多个媒体查询，使用js做了处理

它的原理是把当前设备自动划分为10等份

会根据屏幕自动修改文字大小

github下载地址：https://github.com/amfe/lib-flexible

但是需要加一个限定弥补不足：

```css
/* 如果屏幕超过了750px, 那么我们按照750的设计稿走，不让我们的页面超过750px*/
@media screen and (min-width: 750px) {
	html {
		font-size: 75px!important; /*提权重*/
	}
}
```



#### VScode -> rem

适配方案（add）：Vscode px转换rem插件cssrem

**（堪称外挂），及其好用** 可以使得px直接转换rem

该插件默认的html字体大小为16px（根据当前页面大小（正常大小状态）/划分份数=得到我们应该设置的字体大小）,需要在设置里更改setting.json里的`"cssrem.rootFontSize": 16`才可以



### Grid布局

也被称为网格布局。擅长于将一个页面划分为几个主要区域，以及定义这些区域的大小、位置、层次等关系（前提是HTML生成了这些区域）。类似于以下的效果

![](/移动&Web开发的常见布局(CSS)/grid.jpg)

指定父元素横竖网格的大小（从而规定子元素的大小）

```css
#container{
  display: grid;
  grid-template-columns: 50px 50px 50px;  /*33.33% 33.33% 33.33%; 也可以*/
  grid-template-rows: 50px 50px 50px;
}
```

为了方便表示比例关系，网格布局提供了`fr`关键字（一下表示宽度比 1  ： 2）

```css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr;
}
```

`justify-items`属性设置单元格内容的水平位置（左中右），`align-items`属性设置单元格内容的垂直位置（上中下）。

`justify-content`属性是整个内容区域在容器里面的水平位置（左中右），`align-content`属性是整个内容区域的垂直位置（上中下）。

`justify-self`属性设置单元格内容的水平位置（左中右），跟`justify-items`属性的用法完全一致，但只作用于单个项目。

`align-self`属性设置单元格内容的垂直位置（上中下），跟`align-items`属性的用法完全一致，也是只作用于单个项目。

可以看成和flex类似的部分

```css
.container {
    justify-items: start | end | center | stretch;
    align-items: start | end | center | stretch;
    justify-content: start | end | center | stretch | space-around | space-between | space-evenly;
    align-content: start | end | center | stretch | space-around | space-between | space-evenly;  
}
```





详情可以参考阮一峰老师的教程https://www.ruanyifeng.com/blog/2019/03/grid-layout-tutorial.html



### 响应式布局

其原理就是根据媒体查询对不同宽度设备进行布局和样式设置，从而适配不同设备的目的

小屏幕（手机）<768px 

小屏设备（平板） >=768px~<992px

中等屏幕（桌面显示器）>=992px~<1200px

宽屏设备（大桌面显示器）>=1200px

```css
@media screen and (max-width: 767px) {
            .container {
                width: 100%;

            }
        }
        @media screen and (min-width: 768px) {
            .container {
                width: 750px;
                
            }
        }
        @media screen and (min-width: 992x) {
            .container {
                width: 970px;
                
            }
        }
        @media screen and (min-width: 1200px) {
            .container {
                width: 1170px;
                
            }
        }
```



#### (1)Bootstrap前端开发框架

来自于twitter，目前最受欢迎的前端框架(拿来主义)

中文官网：https://www.bootcss.com/

官网：https://getbootstrap.com/

2.x.x	已经停止维护，功能不够完善

3.x.x  目前使用最多，但已经放弃了ie6，ie7，对ie8支持但是界面效果不好，偏向于开发响应式布局，移动设备优先的web项目

4.x.x 最新版，但是目前不流行

**样式库的**使用：1.创建文件夹结构（复制bootstrap的文件夹）-> 2.创建html骨架结构（在bootstrap中文文档官网中找到bootstrap入门-基础模板）-> 3. 引入相关样式文件 -> 使用

#### (2)Bootstrap的布局容器

bootstrap需要为页面内容和栅格系统包裹一个.container容器，Bootstrap预先定义好了这个类

.container已经定义好了响应式布局，如`@media screen and (max-width: 767px)`之类的

而.container-fluid类定义了流式布局（百分比布局）

#### (3）**Bootstrap的栅格系统**

亦称为网络系统，它指页面布局划分为等宽的列，通过样式定义来模块化页面布局（rem是把整个屏幕划分多个等份，这个是页面内容），bootstrap自动拓展到最多12等份

bootstrap里面的CSS已经包含了normalize.css即关于网页初始化的内容，所以不用再引入normalize.css进行初始化

栅格系统用于通过一系列的行row和列coloum的组合来创建页面布局 （行缩小到一定程度，模块进入下一个列）,实现列的平均划分，需要给列添加类前缀（添加类名），分别对应着响应式布局上面定义的四种媒体查询代码

超小屏幕列前缀
`.col-xs-`
小屏设备列前缀
`.col-sm-`
中等屏幕列前缀
`.col-md-`
宽屏幕列前缀
`.col-lg-`
有12份，让其占4分之一，即3份,所有盒子总和没达到12，则占不满，超过12，则另起一行（像浮动）
`.col-lg-3`

大屏幕占4分之一，即3份，中等屏幕占3分之一，即4份，小屏幕占2分之一，即6份

`.col-lg-3  col-md-4  col-sm-6` 

每一列的盒子里有默认左右15px的padding

Bootstrap的列嵌套：父盒子会产生一个padding值，使得子盒子划分的时候没有按照父盒子的宽高划分，而是按照父盒子的宽高-padding值划分，所以在嵌套的时候最好加多一个盒子进行包装，并且此时子盒子和父级一样高：

```html
    <div class="col-md-4">
        <div>
          <div class="col-md-6"></div>
          <div class="col-md-6"></div>
        </div>
    </div>
    <div class="col-md-4"></div>
    <div class="col-md-4"></div>
```

`<div class="col-mid-4  col-md-offset-4"></div>`的offset功能，在中间增加了4份的空格（1/3），实现每个盒子不必紧密相连的模型格式，其实可以把offset当成空盒子来看待

`<div class="col-md-4 colmd-push-8">左侧</div>`

`<div class="col-md-4 colmd-pull-4">右侧</div>`可以实现左右盒子颠倒的状态（做盒子推，右盒子拉）

#### (4）响应式工具

利用媒体查询功能，使用工具类可以方便针对不同设备展示或者隐藏页面内容（类似淘宝首页某类商品的隐藏）

`hidden-xs` 超小屏：隐藏      小屏：可见       中屏：可见        大屏：可见

`hidden-sm` 超小屏：可见     小屏：隐藏       中屏：可见        大屏：可见

`hidden-md` 超小屏：可见      小屏：可见       中屏：隐藏        大屏：可见

`hidden-lg` 超小屏：可见      小屏：可见       中屏：可见        大屏：隐藏

```html
<div class="col-md-3 hidden-xs"></div>
```

与之相反的是visible-xs，visible-sm等，可以实现广东财经大学首页的搜索栏隐藏模块功能

bootstrap官网里还有字体图标供给使用

bootstrap已经帮你写好清除浮动，只需添加类名`clearfix`



## 5.线性渐变颜色（针对于移动端）

pc端需要很多私有前缀，特别麻烦，但是移动端只需要添加webkit就可以了

```css
background: linear-gradient(起始方向,颜色1,颜色2); /*起始方向默认top*/
background: -webkit-linear-gradient(left,red,blue); /*一般都要添加-webkit-私有前缀*/
background: -webkit-linear-gradient(left top,red,blue); 
```



## 6.CSS变量

除了less可以声明变量，其实css自身也可以声明变量

CSS全局变量的声明是在变量名称前加两个中横线`--`，通常用于设置全局的主题颜色，主题背景颜色，字体大小等

```css
:root {
    /* css定义变量的方式 */
    /* 使用：var(变量名) */
  --color-text: #666;
  --color-high-text: #ff5777;
  --color-tint: #fd5d7b;
  --color-background: #fff;
  --font-size: 20px;
  --line-height: 1.5;
}
```

```css
/*使用*/
div {
 background-color: var(--color-tint);   
}
```



## 7.REM实战布局

对于屏幕宽度小于600px，根字体大小设置为10vw

大于等于600px的按照 600px的屏幕宽度去计算，根字体大小同样给到10vw（适配pc端）

然后对改模板下所有px采取rem适配
