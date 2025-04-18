---
author: Hello
pubDate: 2020-07-31 
categories: 前端
title: Canvas
description: 'Canvas相关'
---

## 红宝书关于Canvas

绘制图形需要先取得绘图上下文

```js
let drawing = document.getElementByTagName('canvas');
if(drawing.getContext) {
    //...
}
```

#### 2D绘图

drawText2D上下文的坐标原点（0，0）在canvas标签的左上角，x向右增长，y向下增长

##### **矩形**

`fillRect`、`strokeRect`、`clearRect`接收4个参数，分别为x坐标、y坐标、矩形宽度、高度

`fillRect`: 绘制矩形 + 填充

`strokeRect`: 绘制非实星填充

 `clearRect` : 清除指定的矩形区域 

```js
if(drawing.getContext) {
    let context = drawing.getContext("2d");
    context.fillStyle = "#ff000";
    context.fillRect(10, 10, 50, 50)
}
```

`clearRect`方法可以擦除画布中某个区域，让其变得透明

##### **路径**

在绘制路径之前，需要“创建路径”，结束之后再“描画路径”

- beginPath：创建路径（线条）
- stroke：画路径

```js
if(drawing.getContext) {
    let context = drawing.getContext("2d");
    context.beginPath(); //创建路径
    //..
    context.stroke();//描画路径
}
```

方法一：画初始点和末尾点

```js
ctx.beginPath(); //我要开始画画了
ctx.strokeStyle = 'blue';
ctx.moveTo(80,40);  //路径先初始点的坐标
ctx.lineTo(200,40); //路径先末尾点的坐标
ctx.stroke(); //我画完了
```

方法二：当然也可以通过画圆的方式来画

`arc(x, y, radius, startAngle, endAngle, counterclockwise)`

- x，y坐标为圆心
- radius为半径，startAngle开始角度，endAngle结束角度
- counterclockwise是否逆时针计算

```js
ctx.arc(x, y, 30, 0, 2 * Math.PI); //画一个圆
ctx.arc(x, y, 30, 0, Math.PI); //画一个半圆
```

方法三：画一个弧

`arcTo(x1,y1,x2,y2,r); `

| 参数   | 描述            |
|:---- |:------------- |
| *x1* | 两切线交点的横坐标。    |
| *y1* | 两切线交点的纵坐标。    |
| *x2* | 第二条切线上一点的横坐标。 |
| *y2* | 第二条切线上一点的纵坐标。 |
| *r*  | 弧的半径。         |

![](/Canvas/canvas4.png)

##### **变换**

当然我们也可以在其中使用我们熟悉的老朋友

- `rorate（angle）`
- `scale(scaleX, scaleY)`
- `translate(x, y)`，执行这个操作之后，原本我们要仪仗的(0, 0)的原点坐标，变成了(x, y)

所有的变换，包括fillStyle、strokeStyle属性，都会一直保留在上下文中，直到再次修改他们。虽然没有办法明确地将所有之都重置为默认值，但是有两个方法可以帮我们跟踪变化：`save()`被调用之后，，当前时刻的所有设置会放到一个暂存栈中，之后调用 `restore()`方法可以取出并恢复之前保存的设置。

记住保存的是上下文的设置和变换，并没有保存上下文的内容。

### **绘制图像**

> 或者可以使用 [`canvas.toBlob`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob)

```js
let img = document.imges[0];
context.drawImage(img, 10, 10)
```

`drawImage(图像, 绘制目标的x坐标, 绘制目标的y坐标)`

`drawImage(图像, 绘制目标的x坐标, 绘制目标的y坐标, 目标宽度, 目标高度)`

`toDataURL` 转换图片为dataURL，一般使用为：

```js
canvas.getContext('2d').drawImage(img, 0, 0, width, height)
const dataUrl = canvas.toDataURL('image/png');
```

#### （1）usage

在画布上定位图像：

| JavaScript 语法：                                                    |                       |
|:----------------------------------------------------------------- | --------------------- |
| *context*.drawImage(*img,x,y*);                                   | 在画布上定位图像              |
| *context*.drawImage(*img,x,y,width,height*);                      | 在画布上定位图像，并规定图像的宽度和高度： |
| *context*.drawImage(*img,sx,sy,swidth,sheight,x,y,width,height*); | 剪切图像，并在画布上定位被剪切的部分    |

参数值

| 参数        | 描述                     |     |
|:--------- |:---------------------- | --- |
| *img*     | 规定要使用的图像、画布或视频。        |     |
| *sx*      | 可选。开始剪切的 x 坐标位置。       |     |
| *sy*      | 可选。开始剪切的 y 坐标位置。       |     |
| *swidth*  | 可选。被剪切图像的宽度。           |     |
| *sheight* | 可选。被剪切图像的高度。           |     |
| *x*       | 在画布上放置图像的 x 坐标位置。      |     |
| *y*       | 在画布上放置图像的 y 坐标位置。      |     |
| *width*   | 可选。要使用的图像的宽度（伸展或缩小图像）。 |     |
| *height*  | 可选。要使用的图像的高度（伸展或缩小图像）。 |     |

#### （2）转化成图像

或者将当前canvas转化成一个图像

```js
<canvas id="canvas" width="5" height="5"></canvas>
```

Copy to Clipboard

可以用这样的方式获取一个 data-URL

```js
var canvas = document.getElementById("canvas");
var dataURL = canvas.toDataURL();
console.log(dataURL);
// "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNby
// blAAAADElEQVQImWNgoBMAAABpAAFEI8ARAAAAAElFTkSuQmCC"
```

或许你想要获取的是图像的帧数据

```js
const imageData = ctx.getImageData(0, 0, width, height);
const pixelData = new Uint8Array(imageData.data.buffer);
```

此时还能用upng进行压缩

```js
import UPNG from 'upng-js';
//....
const pngData = UPNG.encode([pixelData], width * scale, height * scale, 256);
```

#### （3）压缩图片质量

```js
var base64 = canvas.toDataURL('image/jpeg', quality);
```

**type 可选** 图片格式，默认为 image/png

**encoderOptions 可选** 在指定图片格式为 image/jpeg 或 image/webp的情况下，可以从 0 到 1 的区间内选择图片的质量。如果超出取值范围，将会使用默认值 0.92。其他参数会被忽略。 Chrome支持“image/webp”类型。

#### （4）获取图像信息

**`CanvasRenderingContext2D.getImageData()`** 返回一个[`ImageData`](https://developer.mozilla.org/zh-CN/docs/Web/API/ImageData)对象，用来描述 canvas 区域隐含的像素数据，这个区域通过矩形表示，起始点为*(sx, sy)、*宽为*sw、*高为*sh。*

[语法](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/getImageData#语法)

```
ctx.getImageData(sx, sy, sw, sh);
```

Copy to Clipboard

[参数](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/getImageData#参数)

- `sx`
  
  将要被提取的图像数据矩形区域的左上角 x 坐标。

- `sy`
  
  将要被提取的图像数据矩形区域的左上角 y 坐标。

- `sw`
  
  将要被提取的图像数据矩形区域的宽度。

- `sh`
  
  将要被提取的图像数据矩形区域的高度。

#### （5）画一个圆并且塞入图像

```js
ctx.save();
ctx.beginPath();
ctx.arc(x + radius, y + radius, radius, 0, 2 * Math.PI); // 画一个圆
ctx.closePath();
ctx.clip();

ctx.drawImage(userAvator, x, y, radius * 2, radius * 2);
```

#### （6）canvas在高清屏幕的绘制

由于 canvas 不是矢量图，而是像图片一样是位图模式的。高 dpi 显示设备意味着每平方英寸有更多的像素。也就是说二倍屏，浏览器就会以2个像素点的宽度来渲染一个像素，该 canvas 在 Retina 屏幕下相当于占据了2倍的空间，相当于图片被放大了一倍，因此绘制出来的图片文字等会变模糊。

我们可以先把所有的宽高比都设置成 * dpr

比如设置canvas宽高（style）为 320px × 400px，则

```js
const dpr = window.devicePixelRatio || 2;
export const MODAL_WIDTH = 320;
export const MODAL_HEIGHT = 400;

myCanvas.style.width = MODAL_WIDTH + 'px';
myCanvas.style.height = MODAL_HEIGHT + 'px';

myCanvas.width = MODAL_WIDTH * ratio;
myCanvas.height = MODAL_HEIGHT * ratio;
```

绘制内部：

方法1:

```js
const context = myCanvas.getContext('2d');
context.font = "36px Georgia"; //一倍屏下18px字体
context.fillStyle = "#999";
context.fillText("我是清晰的文字", 50*ratio, 50*ratio);// 坐标位置乘以像素比
```

方法2:

```js
const context = myCanvas.getContext('2d');
context.scale(ratio, ratio);
context.font = "18px Georgia";
context.fillStyle = "#999";
context.fillText("我是清晰的文字", 50, 50);
```

#### 小实战

画一个刮刮乐

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <style>
      #ggk {
        width: 400px;
        height: 100px;
        position: relative;
        left: 50%;
        transform: translate(-50%, 0);
      }

      .jp,
      canvas {
        position: absolute;
        width: 400px;
        height: 100px;
        left: 0;
        top: 0;
        text-align: center;
        font-size: 25px;
        line-height: 100px;
        color: deeppink;
      }
    </style>
  </head>
  <body>
    <h1 style="text-align: center">刮刮乐</h1>
    <div id="ggk">
      <div class="jp">不抽大嘴巴子</div>
      <canvas id="canvas" width="400" height="100"></canvas>
      <script>
        document.addEventListener("selectstart", function (e) {
          e.preventDefault();
        });
        let canvas = document.querySelector("#canvas");
        let ctx = canvas.getContext("2d");
        ctx.fillStyle = "darkgray";
        ctx.fillRect(0, 0, 400, 100);
        let ggkDom = document.querySelector("#ggk");
        let jp = document.querySelector(".jp");
        let isDraw = false;
        canvas.onmousedown = function () {
          isDraw = true;
        };
        canvas.onmousemove = function (e) {
          if (isDraw) {
            let x = e.pageX - ggkDom.offsetLeft + ggkDom.offsetWidth / 2;
            console.log(e.pageX, 'pageX', ggkDom.offsetLeft, 'ggkDom.offsetLeft', ggkDom.offsetWidth / 2, 'ggkDom.offsetWidth / 2');
            let y = e.pageY - ggkDom.offsetTop;
            ctx.beginPath();
            ctx.arc(x, y, 30, 0, 2 * Math.PI);
            ctx.globalCompositeOperation = "destination-out";
            ctx.fill();
            ctx.closePath();
          }
        };
        document.onmouseup = function () {
          isDraw = false;
        };
      </script>
    </div>
  </body>
</html>
```

- `globalCompositeOperation`：合成属性
  
  Canvas 2D API 的 **`Canvas.globalCompositeOperation`** 属性设置要在绘制新形状时应用的合成操作的类型，其中 type 是用于标识要使用的合成或混合模式操作的字符串。
  
  它的每个属性值在官网里都有图文介绍：https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
  
  当然，在w3c网上面也有介绍：https://www.runoob.com/w3cnote/html5-canvas-intro.html
  
  - `source-over`: 旧画布图形直接覆盖新的图形
  - `source-in`: 仅会出现旧画布图形和新的图形重叠的部分（展示新图像），有点像&&的感觉
  - `source-out`: 仅显示新图形部分，且仅仅新图形与老图形没有重叠的部分，其余部分全部透明
  - `destination-over`: 新图像会在老图像的下面。
  - `destination-in`: 仅会出现旧画布图形和新的图形重叠的部分（展示老图像），有点像&&的感觉
  - `destination-out`: 仅显示老图形部分，且仅仅老图形与新图形没有重叠的部分，其余部分全部透明

- **`Canvas.fill()`** 是 Canvas 2D API 根据当前的填充样式，填充当前或已存在的路径的方法。采取非零环绕或者奇偶环绕规则。

- **`Canvas.closePath()`** 是 Canvas 2D API 将笔点返回到当前子路径起始点的方法。它尝试从当前点到起始点绘制一条直线。如果图形已经是封闭的或者只有一个点，那么此方法不会做任何操作。
  
  ![](/Canvas/canvas1.png)

![](/Canvas/canvas2.png)

#### 其他小案例

取自菜鸟教程

一个小太阳、一个是小时钟案例

https://www.runoob.com/w3cnote/html5-canvas-intro.html

```js
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>菜鸟教程(runoob.com)</title>
<style>
    body {
        padding: 0;
        margin: 0;
        background-color: rgba(0, 0, 0, 0.1)
    }

    canvas {
        display: block;
        margin: 200px auto;
    }
</style>
</head>
<body>
<canvas id="solar" width="300" height="300"></canvas>
<script>
init();

function init(){
    let canvas = document.querySelector("#solar");
    let ctx = canvas.getContext("2d");
    draw(ctx);
}

function draw(ctx){
    requestAnimationFrame(function step(){
        drawDial(ctx); //绘制表盘
        drawAllHands(ctx); //绘制时分秒针
        requestAnimationFrame(step);
    });
}
/*绘制时分秒针*/
function drawAllHands(ctx){
    let time = new Date();

    let s = time.getSeconds();
    let m = time.getMinutes();
    let h = time.getHours();

    let pi = Math.PI;
    let secondAngle = pi / 180 * 6 * s;  //计算出来s针的弧度
    let minuteAngle = pi / 180 * 6 * m + secondAngle / 60;  //计算出来分针的弧度
    let hourAngle = pi / 180 * 30 * h + minuteAngle / 12;  //计算出来时针的弧度

    drawHand(hourAngle, 60, 6, "red", ctx);  //绘制时针
    drawHand(minuteAngle, 106, 4, "green", ctx);  //绘制分针
    drawHand(secondAngle, 129, 2, "blue", ctx);  //绘制秒针
}
/*绘制时针、或分针、或秒针
 * 参数1：要绘制的针的角度
 * 参数2：要绘制的针的长度
 * 参数3：要绘制的针的宽度
 * 参数4：要绘制的针的颜色
 * 参数4：ctx
 * */
function drawHand(angle, len, width, color, ctx){
    ctx.save();
    ctx.translate(150, 150); //把坐标轴的远点平移到原来的中心
    ctx.rotate(-Math.PI / 2 + angle);  //旋转坐标轴。 x轴就是针的角度
    ctx.beginPath();
    ctx.moveTo(-4, 0);
    ctx.lineTo(len, 0);  // 沿着x轴绘制针
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.lineCap = "round";
    ctx.stroke();
    ctx.closePath();
    ctx.restore();
}

/*绘制表盘*/
function drawDial(ctx){
    let pi = Math.PI;

    ctx.clearRect(0, 0, 300, 300); //清除所有内容
    ctx.save();

    ctx.translate(150, 150); //一定坐标原点到原来的中心
    ctx.beginPath();
    ctx.arc(0, 0, 148, 0, 2 * pi); //绘制圆周
    ctx.stroke();
    ctx.closePath();

    for (let i = 0; i < 60; i++){//绘制刻度。
        ctx.save();
        ctx.rotate(-pi / 2 + i * pi / 30);  //旋转坐标轴。坐标轴x的正方形从 向上开始算起
        ctx.beginPath();
        ctx.moveTo(110, 0);
        ctx.lineTo(140, 0);
        ctx.lineWidth = i % 5 ? 2 : 4;
        ctx.strokeStyle = i % 5 ? "blue" : "red";
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
    ctx.restore();
}
</script>
</body>
</html>
```

其中用到了save方法

```js
let canvas = document.querySelector("#solar");
let ctx = canvas.getContext("2d");
```

```js
ctx.save(); // Canvas 2D API 通过将当前状态放入栈中，保存 canvas 全部状态的方法；你可以理解为每一次绘制完一个针后记录下来，存到栈中，然后restore的时候返回初始状态，不影响上一个针的绘制效果
ctx.restore(); //回到save之前的状态
```

![](/Canvas/canvas3.png)

可以看一下这里的mdn例子加深下理解：https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/save

还有一个

```js
ctx.clearRect(0, 0, 300, 300)
```

**`CanvasRenderingContext2D.clearRect()`**是 Canvas 2D API 的方法，这个方法通过把像素设置为透明以达到擦除一个矩形区域的目的。

**备注：** 如果没有依照 [绘制路径](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes#绘制路径) 的步骤，使用 `clearRect()` 会导致意想之外的结果。请确保在调用 `clearRect()`之后绘制新内容前调用[`beginPath()`](https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/beginPath) 。

可以理解为一个命令行中 clear的操作

参考：

[使用Canvas制作刮刮乐，看看你能刮出什么奖品来？](https://juejin.cn/post/7142839691203575838)

## pixijs

#### 1.pixi基础

使用 [PixiJS](https://link.segmentfault.com/?enc=OXNDsfmdgZ1%2Fo0XH9gicMQ%3D%3D.jSzA68fhkRkiNaP8B4%2BYeqALwPxR%2BUdj6jg%2FGMDg98VeCD82gn3dCB5uOi6z2oWL) ，我们首先应该创建一个 Pixi 应用，并且添加到当前的节点处

```js
// 创建一个Pixi 应用
let app = new PIXI.Application({width: 256, height: 256});
// 把 Pixi 应用中创建出来的 canvas 添加到页面上
document.body.appendChild(app.view);
```

**容器**（container）
容器是用来装载多个显示对象的， 它可以用 [PIXI.Container()](https://link.segmentfault.com/?enc=cIVFAaLL3JI1lb5Cyyr8xQ%3D%3D.OguUl4pMbdQ8r3%2Faq0SIkAlzBxqoeJi566dSUS5lnXg6qWJmtH7pPl%2BCJAc%2BhrOHzF41fuJCAFszeotru1h5qA%3D%3D) 方法来创建，可以把它看成一个**小组件**，里面可以包裹多个精灵，或者其他容器等

**精灵**（spirite）
精灵是可以放在容器里的特殊图像对象， 它可以用 [PIXI.Sprite()](https://link.segmentfault.com/?enc=B3TMawjfAak8cn5r6BLkYA%3D%3D.LhgujzllCu5M3bgXkHK53eeqpdyfECJCjeGtJD%2FNXDo8A8KWNZKZvjvF4Fruh84%2Boo1KS7DarTpTQGm8otDheg%3D%3D) 方法来创建。精灵是你能用代码控制图像的基础。你能够控制他们的位置，大小，和许多其他有用的属性来产生交互和动画，我自己感觉spirite对于pixi就像dom对于document一样

**纹理**（Texture）

因为 Pixi 用 WebGL 和 GPU 去渲染图像，所以图像需要转化成 GPU 可以处理的格式。可以被 GPU 处理的图像被称作 纹理 。在你让精灵显示图片之前，需要将普通的图片转化成 WebGL 纹理。

为了让所有工作执行的**快速有效率**，Pixi会自动使用 纹理缓存 来存储和引用所有你的精灵需要的纹理。纹理的名称字符串就是图像的地址。这意味着如果你有从`"images/cat.png"` 加载的图像(注意是图像，不会把json也给你存进来)，我们可以在纹理缓存中这样找到他：

```javascript
PIXI.utils.TextureCache["images/logo.png"];
```

那该如何将它转化成纹理？那就是是用Pixi已经构建好的`loader`对象（下方有loader的使用）,通过loader加载过的图片，都可以在PIXI.utils.TextureCache中找到

**PIXI.Application** 会自动选择使用 **Canvas 或者是 WebGL** 来渲染图形，这取决于您的浏览器支持情况

我们通常使用Pixi提供的`Application`方法来创建一个实例应用（app），它能**自动**创建我们等下讲到的renderer，ticker 和container、loader

> 注意：pixi从v3到v5，再到v7，关于loader的语法变动很多，大家需要注意网上学习的语法是哪个版本的，比如v5是没有的loader是没有on来监听事件的，v7甚至没有loader

Application option:

| `autoStart`             | 布尔值          | default  | 选修的构建完成后自动开始渲染。 **注意**：将此参数设置为 false 不会停止共享代码，即使您将 options.sharedTicker 设置为 true 以防它已经启动。自己阻止吧。                 |
| ----------------------- | ------------ | -------- | --------------------------------------------------------------------------------------------------------------- |
| `width`                 | 数字           |          | 选修的渲染器视图的宽度。                                                                                                    |
| `height`                | 数字           |          | 选修的渲染器视图的高度。                                                                                                    |
| `view`                  | HTML画布元素     |          | 选修的用作视图的画布，可选。                                                                                                  |
| `transparent`           | 布尔值          | False    | 选修的如果渲染视图是透明的。                                                                                                  |
| `autoDensity`           | 布尔值          | False    | 选修的以 CSS 像素为单位调整渲染器视图的大小，以允许 1 以外的分辨率。                                                                          |
| `antialias`             | 布尔值          | False    | 选修的设置抗锯齿                                                                                                        |
| `preserveDrawingBuffer` | 布尔值          | False    | 选修的启用绘图缓冲区保存，如果您需要在 WebGL 上下文中调用 toDataUrl，请启用此功能。                                                              |
| `resolution`            | 数字           | 1        | 选修的渲染器的分辨率/设备像素比，视网膜将为 2，移动端一般要根据`window.devicePixelRatio` 来。                                                   |
| `forceCanvas`           | 布尔值          | False    | 选修的阻止选择 WebGL 渲染器，即使存在，此选项仅在使用**pixi.js-legacy**或**@pixi/canvas-renderer**模块时可用，否则将被忽略。                         |
| `backgroundColor`       | 数字           | 0x000000 | 选修的渲染区域的背景颜色（如果不透明则显示）。                                                                                         |
| `clearBeforeRender`     | 布尔值          | True     | 选修的这会设置渲染器是否会在新的渲染通道之前清除画布。                                                                                     |
| `powerPreference`       | 细绳           |          | 选修的传递给 webgl 上下文的参数，对于具有双显卡的设备设置为“高性能”。**（仅限 WebGL）**。                                                          |
| `sharedTicker`          | 布尔值          | False    | 选修的`true`使用 PIXI.Ticker.shared，`false`创建新的代码。如果设置为 false，则您无法将处理程序注册为在共享代码上运行的任何内容之前发生。系统代码将始终在共享代码和应用程序代码之前运行。 |
| `sharedLoader`          | 布尔值          | False    | 选修的`true`使用 PIXI.Loader.shared，`false`创建新的 Loader。                                                              |
| `resizeTo`              | 窗口 \| HTML元素 |          |                                                                                                                 |

application还有个销毁的方法：

- （removeView，stageOptions）

| `removeView`               | 布尔值       | <可选> | 错误的 | 自动从 DOM 中移除画布。                                                  |
| -------------------------- | --------- | ---- | --- | --------------------------------------------------------------- |
| `stageOptions`             | 对象 \| 布尔值 | <可选> |     | 选项参数。布尔值将表现得好像所有选项都已设置为该值                                       |
| `stageOptions.children`    | 布尔值       | <可选> | 错误的 | 如果设置为 true，所有的孩子也将调用他们的 destroy 方法。'stageOptions' 将传递给那些调用。     |
| `stageOptions.texture`     | 布尔值       | <可选> | 错误的 | 如果 stageOptions.children 设置为 true，则仅用于子 Sprites。它是否应该破坏子精灵的纹理   |
| `stageOptions.baseTexture` | 布尔值       | <可选> | 错误的 | 如果 stageOptions.children 设置为 true，则仅用于子 Sprites。它是否应该破坏子精灵的基础纹理 |

```js
app.destroy(true, {});
```

application滑动问题：

```js
// 可滑动
app.renderer.view.style.touchAction = 'auto';
app.renderer.plugins.interaction.autoPreventDefault = false;
```

#### 2.loader

类似于threejs的loader，threejs的loader种类繁多，但是pixijs的loader只有一种，是一个用于加载资源的东西，由 Chad Engler 从 Resource Loader 派生而来，用于加载资源，传入2个参数则可以设置别名

```js
import * as PIXI from 'pixi.js';
const loader = new PIXI.Loader();
loader.add('bunny', 'data/bunny.png')
  .add('images/logo.png')
  .add('spaceship', 'assets.json')
  .add("logo", "images/logo.png")
  .load(init);

function init((loader, resources)) {
  // 以指定名稱的方式去取用 Texture Cache
  var sprite = new PIXI.Sprite(loader.resources.logo.texture);
   var sprite = new PIXI.Sprite(resources.logo.texture);
  //或者这样
  var sprite2 = new PIXI.Sprite(loader.resources['spaceship'].texture);
}
```

add也可以传入数组

```js
let app = new PIXI.Application({ width: 256, height: 256 });
app.loader
  .add([
  "images/imageOne.png",
  "images/imageTwo.png",
  "images/imageThree.png"
])
  .load((loader, res) => {
  console.log(loader === app.loader) //true
});
```

![](/Canvas/loader.png)

关于loader还有一些监听事件

```js
//可取得下載進度
loader.onProgress.add((e) => {
});
//載入檔案錯誤時
loader.onError.add((target, e, error) => {
});
//每一次加载的回调
loader.onLoad.add((e, target) => {
});
//全部加载完成后回调
loader.onComplete.add(() => {
});
```

##### V7 and loader

pixi团队一直想要删除loader，因为它的遗留方法（例如，XMLHttpRequest），是从 [resource-loader](https://github.com/englercj/resource-loader) 衍生出来的，Loader 最初的设计灵感主要是由 Flash/AS3 驱动的，现在看来已经过时了。我们希望从新的迭代中获得一些东西：静态加载、使用 Workers 加载、后台加载、基于 Promise、更少的缓存层。这是一个简单的例子，说明这将如何改变：

```js
import { Loader, Sprite } from 'pixi.js';

const loader = new Loader();
loader.add('background', 'path/to/assets/background.jpg');
loader.load((loader, resources) => {
  const image = Sprite.from(resources.background.texture);
});
```

现在变成：

```js
import { Assets, Sprite } from 'pixi.js';

const texture = await Assets.load('path/to/assets/background.jpg');
const image = Sprite.from(texture);
```

##### 删除loader缓存资源

正常我们将资源从stage移除之后，utils.TextureCache依然会存在loader加载过的资源缓存

通过

```js
sprite.destroy()
```

资源依然存在。

真正删除需要：

```js
sprite.destroy({texture: true, baseTexture: true});
```

![](/Canvas/destroy.png)

移除**TextureCache**、**BaseTextureCache** 纹理，并且会从stage消失

还有个children选项，若 **children** 设定为 **true** 時，會將 **destroy()** 的其他屬性如 **texture: true** 與 **baseTexture: true** 再傳入子物件、子孙物件

`PIXI.BaseTexture`：
纹理存储表示图像的信息。所有纹理都有一个基础纹理。

`PIXI.Texture`：
纹理存储表示图像或图像的一部分的信息。它不能直接添加到显示列表中。而是将其用作 Sprite 的纹理。如果没有提供框架，则使用整个图像。

`PIXI.Texture` 是对 `PIXI.BaseTexture` 的引用

`sprite.destroy` - 将销毁精灵，使 PIXI.Texture 和 PIXI.BaseTexture 保持不变
`sprite.destroy(true);` - 将破坏精灵和 PIXI.Texture；PIXI.BaseTexture 保持不变
`sprite.destroy(true, true);` - 将销毁精灵、PIXI.Texture 和 PIXI.BaseTexture

通常，您不希望每次调用 addSprite() 时都创建 PIXI.Texture 并在 removeSprite() 中销毁它。即使这是在 Pixi 内部处理的并且没有创建重复的纹理。
提前创建你的纹理，将它们存储到数组中并在需要时选择一个。在没有其他精灵使用它时销毁 PIXI.Texture，并在完全完成后销毁 PIXI.BaseTexture。

并且通常不太建议销毁 Texture，因为：销毁 PIXI.Texture 不会释放内存，它只会使纹理无效并将其从图像缓存中删除，因此其他精灵将无法使用它。我真的不知道什么时候必须调用它![:)](https://www.html5gamedevs.com/uploads/emoticons/default_smile.png)

销毁 PIXI.BaseTexture 会释放绑定到它的 WebGL 对象。为您使用的动态纹理或不再需要的一些静态调用它。

#### 3.设置精灵属性

比如我上面加载了一个sprite，可以设置大小、缩放、位置

```js
sprite.position.set(20, 20)
sprite.x = sprite.x + 10  // 可以对 x、y 的某一项单独设置

// 缩放
sprite.scale.set(num, num)
// 大小
sprite.width = sprite.width + 10
// 旋转
sprite.rotation += 0.1
```

**mask**

为 displayObject 设置掩码。蒙版是一种对象，它将对象的可见性限制为应用于它的蒙版的形状。在 PixiJS 中，常规掩码必须是 [PIXI.Graphics](https://pixijs.download/release/docs/PIXI.Graphics.html)或[PIXI.Sprite](https://pixijs.download/release/docs/PIXI.Sprite.html)对象。这允许在画布中更快地进行遮罩，因为它使用形状剪裁。

你可以直接理解为就是蒙版。裁剪的时候用到它

```js
 import { Graphics, Sprite } from 'pixi.js';

 const graphics = new Graphics();
 graphics.beginFill(0xFF3300);
 graphics.drawRect(50, 250, 100, 100);
 graphics.endFill();

 const sprite = new Sprite(texture);
 sprite.mask = graphics;
```

设置文本 + 文本局中 + 气泡外框

```js
// 创建文本对象
const text = new Text('您好，这是一条弹幕消息！', { fontSize: 16, fill: 0xffffff });
text.anchor.set(0.5);

// 计算文本的长度
const textWidth = text.width;

// 创建弹幕气泡对象
const bubble = new Graphics();
bubble.beginFill(0x000000, 0.8);
bubble.drawRoundedRect(0, 0, textWidth + 20, 30, 15);
bubble.endFill();
text.position.set(bubble.width / 2, bubble.height / 2);
```

#### 4.pixijs的事件

pixijs的两种渲染模式，都不是以dom结构为基础（可以联想到canvas），所以需要使用它内置的事件：

- pointerdown：类似于 mousedown。
- pointerup：类似于 mouseup。
- pointerover：类似于 mouseover。
- pointerout：类似于 mouseout。
- pointermove：类似于 mousemove。

现在我们给sprite添加事件

```js
// 第一步：设置元素为可交互的    
cat.interactive = true;
// 第二部：监听对应的事件
cat.addListener('pointerdown', (e) => {
    cat.alpha = 0.5 //类似CSS3滤镜filter
});
```

我们也可以通过代码来触发事件

```js
cat.emit('pointerdown')
```

#### 5.pixijs绘制图形

熟悉canvas的同学都知道，canvas可以利用 `fillRect`、`moveTo`、`lineTo`等随喜所欲画一些简单的矢量图形，pixijs也不例外

其中`beginFill`、`endFill`可以理解为canvas的 `beginPath`、`stroke`是一个道理

```js
//画一个矩形
let rectangle = new PIXI.Graphics();
// 外边框的颜色
rectangle.lineStyle(4, 0xFF3300, 1);
// 给矩形的内部填充颜色
rectangle.beginFill(0x66CCcc);
// 绘制矩形。它的四个参数是 x, y, width, height
rectangle.drawRect(0, 0, 64, 64);
// 结束绘制
rectangle.endFill();
```

```js
// 创建一个半径为32px的圆
const circle = new Graphics();
circle.beginFill(0xfb6a8f);
circle.drawCircle(0, 0, 32); //x\y\半径
circle.endFill();
```

#### 6.给容器添加元素

和threejs一样（threejs是往scene里添加东西），我们做好的元素，要往PIXI的容器（container）里面加，然后再通过，才能显示到屏幕上

`app.stage`是一个pixijs`Container`的实例，作为最底层的舞台(stage)，所有要渲染的图形都应放在它的内部

我们可以选择直接添加在pixi的app.stage上，也可以创建一个自定义的container，然后再添加到app.stage上（自定义container好处在于，比如说修改container的透明度，位于其中的子节点，都会受到影响）

```js
// 自定义Container
const myContainer = new Container();
// 相对于根节点偏移
myContainer.position.set(40, 40);
myContainer.addChild(rectangle);
app.stage.addChild(myContainer);
document.body.appendChild(app.view);
```

实际上这里的app.view就是app.renderer.view，打印出来是一个canvas

![](/Canvas/pixijs.png)

#### 7.渲染器Renderer

`app.renderer`是一个`Renderer`的实例，熟悉threejs的同学应该不陌生，如果WebGL 可以用，那么application自带的就是一个Renderer，否则为一个CanvasRenderer，它将场景及其所有内容绘制到支持 WebGL 的画布上。每当我们的元素变动，就需要重新渲染，然后我们就可以看到动画效果

renderer [PIXI.Renderer](https://pixijs.download/v5.3.9/docs/PIXI.Renderer.html) | [PIXI.CanvasRenderer](https://pixijs.download/v5.3.9/docs/PIXI.CanvasRenderer.html)

```scss
// 把画布重新渲染为500*500大小
app.renderer.resize(500, 500);

// 渲染一个容器
const container = new Container();
app.renderer.render(container);
```

通过打印renderer的type属性可以查看他的类型

```js
console.log(app.renderer.type);
```

| 渲染模式    | 取值  |
|:------- |:--- |
| UNKNOWN | 0   |
| WEBGL   | 1   |
| CANVAS  | 2   |

改变容器(渲染器)的底色

```js
app.renderer.backgroundColor = 0x061639;
```

![](/Canvas/blue.png)

要更改画布的大小，请使用`renderer`的`resize`方法，并提供任何新的`width`和`height`值。但是，为了确保画布的大小调整到与分辨率匹配，请将`autoResize`设置为`true`。

```js
app.renderer.autoResize = true;
app.renderer.resize(512, 512);
```

#### 8.Ticker

`Ticker`有点类似前端的`requestAnimationFrame`，当然大部分情况，我们也可以用 `requestAnimationFrame`来替代Ticker

在pixi源码可以看到，我们在注册application的时候，application会在初始化时注入ticker插件（`Application.registerPlugin(TickerPlugin);`）

他还会默认帮我们把autoStart干成true

![](/Canvas/autostart.png)

```js
// 自定义ticker
const ticker = new Ticker();
// 每次屏幕刷新重新渲染，否则只会渲染第一帧
ticker.add(() => {
  chanziAnimate.x += 1;
});
```

```js
function gameLoop() {
  chanziAnimate.x += 1;
  renderer.render(stage); // 重新渲染,如果是使用application初始化，可以忽略这一行，因为application.ticker在不断执行
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
```

尝试一下吧～https://codesandbox.io/s/elated-wind-5j60fu?file=/src/MoveDemo.js

`Ticker`可以实现简单的动画，但如果我们希望实现一些复杂效果，则需要自己编写很多代码，这时就可以选择一个兼容`pixi`的动画库。市面上比较常见的动画库有：[Tween.js](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2Ftweenjs%2Ftween.js)，[TweenMax](https://link.juejin.cn/?target=https%3A%2F%2Fwww.tweenmax.com.cn%2Fstart%2Finit%2F)（它包括了*GreenSock*动画平台的大部分核心功能）

chatGPT:

总的来说，TweenMax 更加强大，而 TweenJS 更加轻量级。TweenMax 的学习曲线可能会比 TweenJS 更陡峭，但是它可以提供更多的控制和功能。如果您需要一个全面的动画库，或者需要创建复杂的动画效果，那么 TweenMax 可能是更好的选择。如果您只需要简单的 Tween 功能，并且希望使用更轻量级的库，那么 TweenJS 可能更适合您。

如果你不存在需要持续动画渲染的功能，可以选择关闭app.ticker的启动：

```js
app.ticker.stop();
//等到需要时再渲染：
app.render();
```

#### 9.Spine

[Spine](https://so.csdn.net/so/search?q=Spine&spm=1001.2101.3001.7020) 导出的资源文件：

- .atlas：图集数据文件，内部存储了每张纹理的数据信息
- .png：图集资源
- .skel / .json 二进制文件：骨骼信息

可以参考这个[demo](https://pixijs.io/examples-v5/#/plugin-spine/spineboy.js)，使用pixi-spine创建骨骼动画

主要是通过

`[setAnimation](int trackIndex, string animationName, bool loop)`，来播放动画，或者直接添加到待播放队列

`[addAnimation](int trackIndex, [Animation]animation, bool loop, float delay): [TrackEntry]`

添加一个待播放动画, 在某轨道的当前或最后一个排队动画之后播放. 若该轨道为空, 则相当于调用[setAnimation](https://zh.esotericsoftware.com/spine-api-reference#AnimationState-setAnimation).

- `delay` 若该值 > 0, 则 [delay](https://zh.esotericsoftware.com/spine-api-reference#TrackEntry-delay)直接置为该值. 若 <= 0, 则`delay`等于前一个轨道条目的持续时间减去任何mix持续时间(取自[AnimationStateData](https://zh.esotericsoftware.com/spine-api-reference#AnimationStateData)), 再加上指定的`delay`值(即mix在前一个轨道条目持续时间刚到时(`delay` = 0)或者之前(`delay` < 0)结束). 若前一条目是循环动画, 则使用其下一个循环的完成时间而非其持续时间.
- `<return>` 一个轨道条目, 可以用它进一步定制动画的播放过程. 在[dispose](https://zh.esotericsoftware.com/spine-api-reference#AnimationStateListener-dispose)事件触发后, 不应保留对该轨道条目的引用.

还可以使用pixi-spine的debuger功能：

```ts
import { Spine, SpineDebugRenderer } from "pixi-spine";

animation = new Spine(resource.spineData);
animation.debug = new SpineDebugRenderer();
```

spine播放[官方文档](https://zh.esotericsoftware.com/spine-applying-animations#TrackEntry)

关于动画之间的过渡：spine动画融合与动画叠加[setMix](https://blog.csdn.net/weixin_34050519/article/details/93146415?spm=1001.2101.3001.6650.3&utm_medium=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-3-93146415-blog-122105913.235%5Ev43%5Epc_blog_bottom_relevance_base4&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2%7Edefault%7EBlogCommendFromBaidu%7ERate-3-93146415-blog-122105913.235%5Ev43%5Epc_blog_bottom_relevance_base4&utm_relevant_index=6)

通过

```js
// set up the mixes!
spineBoy.stateData.setMix('walk', 'jump', 1);
spineBoy.stateData.setMix('jump', 'walk', 0.4);
```

可以实现2个骨骼动画之间的平滑过渡

Spine资源反转180度时，直接把width写成负数即可

```js
const characterBody = createSpine(characterAsset?.spineData, MY_CHARACTER_ATTRIBUTE);

// 人物镜像反转
characterBody.width = -MY_CHARACTER_ATTRIBUTE.width;
characterBody.height = MY_CHARACTER_ATTRIBUTE.height;
```

或者使用x轴水平翻转实现

```js
// 水平反转
spine.scale.x = -1;
```

#### 10.纹理旋转180度

具体可以看案例：https://pixijs.com/7.x/examples/textures/texture-rotate

使用的是groupD8

```js
import * as PIXI from 'pixi.js';

const app = new PIXI.Application({ resizeTo: window });

document.body.appendChild(app.view);

PIXI.Assets.load('https://pixijs.com/assets/flowerTop.png').then((texture) =>
{
    // create rotated textures
    const textures = [texture];
    const D8 = PIXI.groupD8;

    for (let rotate = 1; rotate < 16; rotate++)
    {
        const h = D8.isVertical(rotate) ? texture.frame.width : texture.frame.height;
        const w = D8.isVertical(rotate) ? texture.frame.height : texture.frame.width;

        const { frame } = texture;
        const crop = new PIXI.Rectangle(texture.frame.x, texture.frame.y, w, h);
        const trim = crop;
        let rotatedTexture;

        if (rotate % 2 === 0)
        {
            rotatedTexture = new PIXI.Texture(texture.baseTexture, frame, crop, trim, rotate);
        }
        else
        {
            // HACK to avoid exception
            // PIXI doesnt like diamond-shaped UVs, because they are different in canvas and webgl
            rotatedTexture = new PIXI.Texture(texture.baseTexture, frame, crop, trim, rotate - 1);
            rotatedTexture.rotate++;
        }
        textures.push(rotatedTexture);
    }

    const offsetX = (app.screen.width / 16) | 0;
    const offsetY = (app.screen.height / 8) | 0;
    const gridW = (app.screen.width / 4) | 0;
    const gridH = (app.screen.height / 5) | 0;

    // normal rotations and mirrors
    for (let i = 0; i < 16; i++)
    {
        // create a new Sprite using rotated texture
        const dude = new PIXI.Sprite(textures[i < 8 ? i * 2 : (i - 8) * 2 + 1]);

        dude.scale.x = 0.5;
        dude.scale.y = 0.5;
        // show it in grid
        dude.x = offsetX + gridW * (i % 4);
        dude.y = offsetY + gridH * ((i / 4) | 0);
        app.stage.addChild(dude);
        const text = new PIXI.Text(`rotate = ${dude.texture.rotate}`, {
            fontFamily: 'Courier New',
            fontSize: '12px',
            fill: 'white',
            align: 'left',
        });

        text.x = dude.x;
        text.y = dude.y - 20;
        app.stage.addChild(text);
    }
});
```

#### 其他

##### 图片合成

前端有时会把多张图片合并成一张图片（雪碧图），而不是一张一张去加载。。通过设置`background-position`来显示不同的图片。`pixi.js`也有类似的技术，我们可以利用[Texture Packer](https://link.juejin.cn?target=https%3A%2F%2Fwww.codeandweb.com%2Ftexturepacker)软件，把多张图片合并成一张图片，合并的同时，软件会生成一份`json`配置文件，记录了每张图片的相对位置。

具体教程见[这里](https://www.codeandweb.com/texturepacker/tutorials/pixijs?mtm_campaign=inapp&mtm_kwd=texturepacker)

首先下载 -> 拖动所需图片文件至texure packer，他将会自动生成

![](/Canvas/texture.png)

制作动画：

复选右边的图片，然后点击预览动画就可以看到图片连续起来的动画效果

![](/Canvas/anima.png)

然后点击发布精灵表

![](/Canvas/publish.png)

就会对应生成一个json文件（记录每个图像名字、大小、位置）和一个png文件（雪碧图）

##### spritesheet

`Sritesheets`：https://pixijs.io/guides/basics/sprite-sheets.html

一般spritesheet用于是一张大的雪碧图（png），并且配合上一个json文件，json文件记录了雪碧图每个图片的位置以及其他信息

```javascript
import { Application, Container, Sprite, Graphics, Loader, Spritesheet } from 'pixi.js';

// myjson记录了每张图片的相对位置
import myjson from './assets/treasureHunter.json';
// mypng里面有多张图片
import mypng from './assets/treasureHunter.png';

const loader = Loader.shared;

const app = new Application({
  width: 300,
  height: 300,
  antialias: true,
  transparent: false,
  resolution: 1,
  backgroundColor: 0x1d9ce0
});

document.body.appendChild(app.view);

loader
.add('mypng', mypng)
.load(setup)

function setup() {
  const texture = loader.resources["mypng"].texture.baseTexture;
  const sheet = new Spritesheet(texture, myjson);
}
```

需要注意的是，通过spritesheet加载完成后，有一些属性是为空的，所以所以我们需要等待加载完成去执行一些操作的话，需要等待spritesheet加载完成后（异步），在进行操作，这时需要用的哦它的prase方法

```js
sheet.parse((textures) => {
  // mypng里面的一张叫treasure.png的图片
  const treasure = new Sprite(textures["treasure.png"]);
  treasure.position.set(0, 0);

  // mypng里面的一张叫blob.png的图片
  const blob = new Sprite(textures["blob.png"]);
  blob.position.set(100, 100);

  app.stage.addChild(treasure);
  app.stage.addChild(blob);
});
```

Texture Packer要收费的，免费版可能有水印（刚开始会送你7天pro），这里有个免费版的Texture Packer可以看一下：

http://free-tex-packer.com/download/

##### AnimatedSprite

可以看成一个会动的Sprite，png -> apng；Sprite -> AnimatedSprite，AnimatedSprite接受一个图像数组，按照数组顺序播放图像，然后我们就可以看到“动起来的效果”

传入2个参数

- textures
- autoUpdate，默认为true，采用PIXI.Ticker来更新动画时间

```js
import { AnimatedSprite, Texture } from 'pixi.js';

const alienImages = [
    'image_sequence_01.png',
    'image_sequence_02.png',
    'image_sequence_03.png',
    'image_sequence_04.png',
];
const textureArray = [];

for (let i = 0; i < 4; i++)
{
    const texture = Texture.from(alienImages[i]);
    textureArray.push(texture);
}

const animatedSprite = new AnimatedSprite(textureArray);
```

当然，你也可以选择在图片合成工具的texurePacker里，设置图片名称，让他自动帮你生成动画：

![](/Canvas/auto.png)

此时通过spritesheet实例化生成的精灵表中，可以看到有animations属性（一个图片集数组），我们直接把它放到AnimatedSprite，就是一个动画精灵了

```js
app.loader.add("chanziPng", chanziPng).load(async (loader, resources) => {
  const chanziSheet = new PIXI.Spritesheet(
    resources["chanziPng"].texture,
    chanzi
  );
  await chanziSheet.parse(() => {});
  // 创建动画雪碧
  const chanziAnimate = new PIXI.AnimatedSprite(
    chanziSheet.animations["ani"]
  );

  // 设置动画时间
  chanziAnimate.animationSpeed = 0.05;
  chanziAnimate.play();
  app.stage.addChild(chanziAnimate);
});
```

尝试一下：https://codesandbox.io/s/elated-wind-5j60fu?file=/src/Component.js

##### z-index

有时候我们需要对一些元素层级来定位，决定元素的层次优先级，我们可以先开启

`PIXI.settings.SORTABLE_CHILDREN`：设置容器属性“sortableChildren”的默认值。如果设置为 true，容器将在调用 updateTransform() 时按 zIndex 值对其子项进行排序，或者在调用 sortChildren() 时手动排序。

```js
PIXI.settings.SORTABLE_CHILDREN = true;
```

此时我们的 `sprite.zIndex = xx; `就可以生效了

但是目前更新版本已废弃⚠️

使用：`sortableChildren`

```js
app.stage.sortableChildren = true;
```

或者

```js
const container = new Container();
container.sortableChildren = true;
```

设置容器属性 `sortableChildren` 的默认值。如果设置为 true，则容器将在调用时 `updateTransform()` 按 zIndex 值对其子级进行排序，如果 `sortChildren()` 被调用，则手动对子项进行排序。

这实际上改变了数组中元素的顺序，因此应被视为与其他解决方案（例如 PixiJS 层）相比性能不佳的基本解决方案。
另请注意，这可能不适用于该 `addChildAt()` 函数，因为排序可能会导致子项自动 `zIndex` 排序到另一个位置。

- Default Value: 默认值：
  
  false 假

##### pixi Text资源没有销毁问题

通过react -> useEffect 创建pixi对象时，此时创建Text，Text会保存在utils中，组件销毁后重新创建，此时useEffect会重新执行，而Text它不像普通图片资源等，普通图片资源可以通过链接的形式有utils id 对应，而不会在utils中重复创建，而Text会重复创建。

如果反复执行（来回切换tab而不断创建， 销毁react组件）useEffect，此时内存会囤积大量Text的texture，像这样：

![](/Canvas/q1.png)

解决方法：

方法1: useEffect，return时通过 `app.destroy(true, true)`,把所有缓存销毁

方法2: 在constant中全局静态创建文字

方法3: 文字通过图片的形式加载，不实用Text方法

方法4（最好）：

通过`app.destroy(true, { children: true }) `的形式销毁，因为直接传true的话会把所有children下的baseTexture销毁（把图片资源也销毁了）

![image-20231108205107393](/Canvas/q2.png)

##### 低帧数低端机动画速率问题

pixi的ticker使用的是requestAnimationFrame 向下兼容 setinterval，但是 requestAnimationFrame 的执行速率取决于手机的帧率，如果在不同刷新率的手机，会出现不一样速率的效果

此时我们可以用Tweenjs做缓动动画，但是对于动画种类，动画数量比较多的情况，还得疯狂嵌套tweenjs动画，通过 `TweenA.chain(TweenB)` `TweenB.chain(TweenC)` 来执行动画，套娃起来可能有点稍微麻烦

我们看下Tweenjs源码，实际上他们都是依赖 performance.now() 去换算执行时间，而不是直接通过ticker的执行速率

![](/Canvas/low.png)

![](/Canvas/low2.png)

所以我们也可以通过每次执行ticker拿到performance.now去做timestamp的换算，去做动画

**无法滑动问题**

在手机上使用时，需要可以滚动页面。但是在游戏画布上滑动时并不能滚动页面，原因是pixi在默认情况下，会阻止所有事件的冒泡，并且会把画布的touch-action设置为none。

**解决方法**

```js
app.view.style.touchAction = 'auto';
```

**分辨率canvas画布大小问题**

```js
const app = new Application({
    autoDensity: false,
});
```

```less
#pixi-container {
    canvas {
        width: 375px;
        height: 397px;
    }
}
```

##### 一些pixi例子

[Run Pixie Run](https://link.segmentfault.com/?enc=o5FSl%2FPTAzqrsEFUHtx3gw%3D%3D.GQVDVbEJ1n%2B6gwpoXcSkERwvqilv4Scno5dDVx0gdFTb9oodnt7gpvgM8KxQ5z%2BB)

[WASTE INVADERS](https://link.segmentfault.com/?enc=PoWTuwUVvw86vIQgTXDBbg%3D%3D.Ah4gjIrIMtUsHkVBx0DCULWb2EX%2Ff%2Fdy6hv4iJKUgOA%3D)

[宝可梦实战](https://bbs.huaweicloud.com/blogs/293024)（通过TexturePacker实现动画）

[碰撞检测案例](https://blog.csdn.net/SongD1114/article/details/123945498)(飞机大战小游戏) 

[另一个飞机大战github](https://blog.csdn.net/panchuanpeng/article/details/109596380)

一些资源网站：

[爱给网](https://www.aigei.com/s?q=%E5%8F%A3%E8%A2%8B%E5%A6%96%E6%80%AA) (精灵图，场景图)

##### 参考文章

[PixiJs](https://pixijs.com/)

[PixiJS - 最快、最灵活的 2D WebGL 渲染引擎](https://juejin.cn/post/7128785645140443143)

[PixiJS基础教程](https://juejin.cn/post/6844904020939636744)

[Pixi v7迁移](https://github.com/pixijs/pixijs/wiki/v7-Migration-Guide)

[一个老版本的pixi教程](https://github.com/Zainking/LearningPixi#application)

## fabricjs

[Fabric.js](https://link.juejin.cn/?target=http%3A%2F%2Ffabricjs.com%2F) 是一个强大的H5 canvas框架，在原生canvas之上提供了交互式对象模型，通过简洁的api就可以在画布上进行丰富的操作。它也是一个**SVG-to-canvas 解析器**。
