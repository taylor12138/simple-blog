---
author: Hello
categories: 前端
pubDate: 2020-07-31 
title: CSS渲染深究
description: 'CSS相关知识'
---



## CSS动画和JS动画的对比

CSS动画优点：

- 动画流畅（以每一帧的间隔保证恰当的时间刷新UI）
- 性能较优
- 动画效果对帧速不好的低版本浏览器
- 代码简单，调优方向固定

缺点：

- 运行过程控制较弱,无法附加事件绑定回调函数
- 代码冗长

JS动画优点：

- JavaScript动画控制能力很强，动画能力强
- 兼容性好



## CSS的repaint和reflow

![](/CSS渲染深究/reflow.jpg)

以上为浏览器解析流程图(**WebKit 主流程**)

**1、解析HTML以构建DOM树：**渲染引擎开始解析HTML文档，转换树中的html标签或js生成的标签到DOM节点，它被称为 -- 内容树；此外，CSS下载完之后对CSS进行解析，解析成CSS对象，然后把CSS对象组装起来，构建CSSOM树。

**2、构建渲染树：**解析CSS（包括外部CSS文件和样式元素以及js生成的样式），根据CSS选择器计算出节点的样式，在解析步骤中创建的CSSOM树和DOM树组合成一个Render树。（`display: none;`不会出现在render树上，`visibility: hidden`会出现在render树上，因为它们会占用空间）
**3、布局渲染树:** 也就是layout，从根节点递归调用，计算每一个元素的大小、位置等，给每个节点所应该出现在屏幕上的精确坐标。
**4、绘制渲染树:** 也就是paint，遍历渲染树，每个节点将使用UI后端层来绘制。



在 Chrome、Opera、Safari 和 Internet Explorer 中称为布局 (Layout)。 在 Firefox 中称为自动重排 (Reflow)，但实际上其过程是一样的。

#### **reflow**

对节点大小和位置的重新计算称为回流reflow/ layout，每个页面至少需要一次回流（reflow/ layout），就是页面第一次加载的时候。

对于DOM结构中的各个元素都有自己的盒子（模型），这些都需要浏览器根据各种样式（浏览器的、开发人员定义的等）来计算并根据计算结果将元素放到它该出现的位置，过程称为reflow

它一般在DOM元素位置发生改变后触发，比如JS添加 `DOM`元素，CSS `width`的改变、CSS3的`animation`（animation里面藏着width的改变）、Scroll页面

#### repaint

当各种盒子的位置、大小以及其他属性，例如颜色、字体大小等都确定下来后，浏览器于是便把这些元素都按照各自的特性绘制了一遍，于是页面的内容出现了，过程称为repaint

它一般在改变 DOM 元素的视觉效果时触发，即不涉及任何排版布局的问题时触发，比如`color`、`text-align`、



**注意：回流reflow一定会触发重绘repaint，而重绘不一定会回流**

我们应该减少reflow和repaint的操作，提高渲染速度

reflow的成本比repaint高很多

下面操作可能导致高成本的消耗：

- 当你增加、删除、修改 DOM 结点时，会导致 Reflow 或 Repaint。
- 当你移动 DOM 的位置，或是搞个动画的时候。
- 当你修改 CSS 样式的时候。
- 当你 Resize 窗口的时候（移动端没有这个问题），或是滚动的时候。
- 当你修改网页的默认字体时。
- `display:none` 会触发 reflow，而 `visibility:hidden` 只会触发 repaint



#### 优化方式

- 不要一条一条地修改 `DOM` 的样式。与其这样，还不如预先定义好 `css` 的 `class`，然后修改 `DOM` 的 `className`（或者使用的是vue、react等框架，虚拟dom会帮助你完成一次性的dom操作）
- 可以先把父元素隐藏起来，添加完子元素后，在把父元素显示出来；亦或者使用文档片段(document fragment)在当前DOM之外构建一个子树，再把它拷贝回文档
- 减少使用table布局
- 不要把 `DOM` 节点的属性值放在一个循环里当成循环里的变量
- 使用**transform、opacity、filters这些动画不会引起回流重绘**，因为他们是在paint之后的
  - 比如我在使用了`transform:translate()`后，无法获取正确的`offsetTop`、`offsetLeft`，由于他们未进行回流重绘，虽然视觉上确实是移动了，但是div在文档流中的位置是不变的

实质上Layout -> Paint -> 还有一个Composite(渲染层合并)

具体有关于会影响Layout的CSS属性可以在[CSS Triggers](https://csstriggers.com/)网站中查阅。（可以方便我们优化）



#### 浏览器对于回流重绘的优化

现代的浏览器都是很聪明的，由于每次重排都会造成额外的计算消耗，因此大多数浏览器都会通过队列化修改并批量执行来优化重排过程

但是：**当你获取布局信息的操作的时候，会强制队列刷新**，比如当你访问以下属性或者使用以下方法：

- `offsetTop`、`offsetLeft`、`offsetWidth`、`offsetHeight`
- `scrollTop`、`scrollLeft`、`scrollWidth`、`scrollHeight`
- `clientTop`、`clientLeft`、`clientWidth`、`clientHeight`
- `getComputedStyle()`
- `getBoundingClientRect`

所以我们要有可能造成回流重绘时，要避免使用以上方法，导致队列进行刷新





## 关于特殊CSS属性的优化

如果你修改一个非样式且非绘制的CSS属性，那么浏览器会在完成样式计算之后，跳过布局和绘制的过程，直接做渲染层合并。这种方式在性能上是最理想的。

不是所有属性动画消耗的性能都一样，其中消耗最低的是`transform`和`opacity`两个属性（当然还有会触发Composite的其他CSS属性），其次是Paint相关属性。所以在制作动画时，建议**使用`transform`的`translate`替代`margin`或`position`中的`top`、`right`、`bottom`和`left`，同时使用`transform`中的`scaleX`或者`scaleY`来替代`width`和`height`**。

`transform`在没有重绘的情况下，变换究竟是如何渲染动画的呢？基本答案是 CSS 转换直接发生在利用硬件加速的GPU内存中，从而避免了软件渲染。



#### 渲染层（PaintLayer）

PaintLayer 最初是用来实现 [stacking contest（层叠上下文）](https://developer.mozilla.org/zh-CN/docs/Web/Guide/CSS/Understanding_z_index/The_stacking_context)，以此来保证页面元素以正确的顺序合成（composite），这样才能正确的展示元素的重叠以及半透明元素等等。

将其分为常见的 3 类：

- NormalPaintLayer

  - 根元素（HTML）
  - 有明确的定位属性（relative、fixed、sticky、absolute）

  - 透明的（opacity 小于 1）

  - 有 CSS 滤镜（fliter）

  - 有 CSS mask 属性

  - 有 CSS mix-blend-mode 属性（不为 normal）

  - 有 CSS transform 属性（不为 none）

  - backface-visibility 属性为 hidden

  - 有 CSS reflection 属性

  - 有 CSS column-count 属性（不为 auto）或者 有 CSS column-width 属性（不为 auto）

  - 当前有对于 opacity、transform、fliter、backdrop-filter 应用动画

- OverflowClipPaintLayer
  - overflow 不为 visible

- NoPaintLayer
  - 不需要 paint 的 PaintLayer，比如一个没有视觉属性（背景、颜色、阴影等）的空 div。



#### 合成层（Compositing Layers）

合成层（Compositing Layers），合成层拥有单独的 GraphicsLayer，而其他不是合成层的渲染层，则和其第一个拥有 GraphicsLayer 父层公用一个。



#### 渲染优化

与此同时，我们通过CSS的属性来触发  **GPU加速**    浏览器会为此元素单独合成层，一个新的复合层。有了这一层，就有点React的PureComponent、usecallback内味了，进行局部更新，不影响他人。

为什么开启硬件加速动画就会变得流畅，那是因为每个页面元素都有一个独立的Render进程。

首先理解三个概念：

- CPU即中央处理器，它的功能主要是解释计算机指令以及处理计算机软件中的数据,也被称为主板。

- GPU即图形处理器，是与处理和绘制图形相关的硬件。GPU是专为执行复杂的数学和几何计算而设计的，有了它，CPU就从图形处理的任务中解放出来，可以执行其他更多的系统任务。

- 硬件加速是指在计算机中透过把计算量非常大的工作分配给专门的硬件来处理来减轻CPU的工作量的技术。在CSS `transition`, `transform`和`animation`的世界里，他暗示我们应该卸载进程到GPU，因此加快速度。这种情况通过向它自己的层叠加元素，当加载动画的时候可以加速渲染。

有了新的“层”，就有了新的“Render进程”。Render进程中包含了主线程和合成线程，主线程负责：

- JavaScript的执行
- CSS样式计算
- 计算Layout
- 将页面元素绘制成位图(Paint)
- 发送位图给合成线程

合成线程则主要负责：

- 将位图发送给GPU
- 计算页面的可见部分和即将可见部分(滚动)
- 通知GPU绘制位图到屏幕上(Draw)

我们可以得到一个大概的浏览器线程模型：

![](/CSS渲染深究/css_optimize.png)

而在什么情况下我们可以单独创建出这样一个复合层(合成层)？

它在以下情况下这样做：

- 对于 3D 或透视（opacity） CSS 转换（在我们的示例中），比如`transform: translateZ(0)`，注意它必须是 `translateZ`
- 对于`<video>`或`<canvas>`元素
- 使用 CSS 过滤器（filter）时
- 对于与提取到复合层的另一个元素重叠的元素（例如，使用`z-index`）

所以这时我们会想到：`transfrom: translate(x, y)`这种可以实现复合层吗？？？为什么2D没有会出现在上面的条件中？

雀食可以，但是我们可以看到两个额外的重绘操作在动画时间轴的开始和结束

![](/CSS渲染深究/cssoptimize2.png)

3D 和 2D 变换之间的区别在于 3D 变换使浏览器预先创建一个单独的复合层，而 **2D 变换则是即时完成**的。在动画开始时，会创建一个新的复合层并将纹理加载到 GPU，从而启动重绘。然后动画由 GPU 中的合成器执行。当动画完成时，附加的复合层将被移除，这将导致另一个重绘操作。



#### 如何开启GPU加速？

并非元素上的所有 CSS 属性更改都可以直接在 GPU 中处理。仅支持以下属性：

- `transform`
- `opacity`
- `filter`

因此，为了确保获得流畅、高质量动画的最佳机会，我们应该始终尝试使用这些 GPU 友好的属性。

或者尝试一下强制在GPU中渲染元素的方法：！

```css
.example1 {
  transform: translateZ(0);
}

.example2 {
  transform: rotateZ(360deg);
}
```

缺点：

没有什么是免费的！（英文直译hhh）

- 内存问题：最重要的问题与内存有关。向 GPU 加载过多纹理可能会导致内存问题

- 字体渲染：GPU 中的渲染会影响字体抗锯齿。这是因为 GPU 和 CPU 具有不同的渲染机制



#### will-change

我们可能听听说过，3D transform会启用GPU加速①，例如`translate3D`, `scaleZ`之类，但是呢，这些属性业界往往称之为`hack`加速法。我们实际上不需要`z`轴的变化，但是还是假模假样地声明了，欺骗浏览器，这其实是一种不人道的做法。

使用“transform hack”来创建单独的复合层的必要性很麻烦。浏览器绝对应该提供一种直接的方法来做到这一点。这就是为什么引入了[will-change 属性](https://drafts.csswg.org/css-will-change/)。这个功能可以让你通知浏览器哪个属性会发生变化，以便浏览器提前做相应的优化。

will-change 设置为 opacity、transform、top、left、bottom、right 可以将元素提升为合成层。

这是一个通知浏览器`transform`属性将被更改的示例：

```css
.element {
    transition: opacity .3s linear;
}
/* declare changes on the element when the mouse enters / hovers its ancestor */
.ancestor:hover .element {
    will-change: opacity;
}
/* apply change when element is hovered */
.element:hover {
    opacity: .5;
}
```

是不是有点缓存内味儿了？

可惜并非所有浏览器都支持will-change，但是它出现已经有些时日了，[兼容性](http://caniuse.com/will-change/embed)这块Chrome/FireFox/Opera都是支持的。



**使用**

如果使用JS添加`will-change`, 事件或动画完毕，一定要及时`remove`. 比方说点击某个按钮，其他某个元素进行动画。点击按钮(click)，要先按下(mousedown)再抬起才出发。因此，可以`mousedown`时候打声招呼, 动画结束自带回调，于是（示意，不要在意细节）：

```javascript
dom.onmousedown = function() {
    target.style.willChange = 'transform';
};
dom.onclick = function() {
    // target动画哔哩哔哩...
};
target.onanimationend = function() {
    // 动画结束回调，移除will-change
    this.style.willChange = 'auto';
};
```



**注意**：

不能过度使用 + 要节制使用 + 不能过早使用will-change（因为会消耗内存）

而且任何带有 `position: fixed` 或者 `position: absolute` 的子元素将会相对于设置了 `will-change: transform` 的元素进行相对定位。所以在你使用的时候需要确保这种意料之外 `containing block `不会对你造成影响（类似于你要对子元素使用绝对定位，父元素不设置相对定位，但是父元素如果使用transform和will-change都会导致子元素按照父元素的位置来定位）



## 性能监控+合成层数量查看

对于性能监控来说，我们可以直接使用浏览器自带的 [Performance API](https://link.juejin.im/?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FAPI%2FPerformance) 来实现这个功能。

我们只需要调用 `performance.getEntriesByType('navigation')`

亦或者再开发者模式下（F12）查看performance栏



使用 Chrome 的 `DevTools` 可以方便地查看页面的合成层数量
选择 “More tools -> Layers”

但是实际上针对不同移动端（ios和安卓）使用不同的浏览器，可能与本地电脑上调试时产生的合成层数量不同，这是手机浏览器的自带的层压缩策略不同而导致的



## 层爆炸

由于某些原因可能导致产生大量不在预期内的合成层（也就是上方所谈及的复合层），虽然有浏览器的层压缩机制，但是也有很多无法进行压缩的情况，这就可能出现层爆炸的现象（简单理解就是，很多不需要提升为合成层的元素因为某些不当操作成为了合成层）。

首先回顾一下层的创建标准

从目前来说，满足以下任意情况便会创建层：
1、3D 或透视变换(perspective transform) CSS 属性
2、使用加速视频解码的 元素
3、拥有 3D (WebGL) 上下文或加速的 2D 上下文的 元素
4、混合插件(如 Flash)
5、对自己的 opacity 做 CSS 动画或使用一个动画 webkit 变换的元素
6、拥有加速 CSS 过滤器的元素
7、元素有一个包含复合层的后代节点(换句话说，就是一个元素拥有一个子元素，该子元素在自己的层里)
8、有一个 Z 坐标比自己小的**兄弟节点**，且该节点是一个合成层(换句话说就是该元素在复合层的上层渲染)

而最容易不经意间产生层爆炸的是最后一条：

如果有一个元素，它的兄弟元素在复合层中渲染，而这个兄弟元素的z-index比较小，那么这个元素（不管是不是应用了硬件加速样式）也会被放到复合层中。

最可怕的是，**浏览器有可能给复合层之后的所有相对或绝对定位的元素都创建一个复合层来渲染**

例子演示http://fouber.github.io/test/layer/

另外一个例子演示：(B被隐式提升为合成层)![](/CSS渲染深究/image-20220619211249005.png)

![](/CSS渲染深究/image-20220619212419238.png)

但是如果调整一下b的位置

![](/CSS渲染深究/image-20220619212458805.png)



解决：人为提升动画元素（复合层标签）的z-index，让浏览器知道这个元素的层排序，就不会很傻地把其他z-index比它高的元素也弄到复合层中了



#### 解决层爆炸

最佳方案是打破 overlap 的条件，也就是说让其他元素不要和合成层元素重叠。简单直接的方式：使用3D硬件加速提升动画性能时，最好给元素**增加一个z-index属性**，人为干扰合成的排序，可以有效减少chrome创建不必要的合成层，也就是让他们回归普通的渲染层，提升渲染性能，移动端优化效果尤为明显。

或者把合成层的产生原因消除掉（在遍历元素中注意会引起层爆的样式）



## 层压缩

因为合成层有很多种情况下都可以产生，甚至不经意间产生 （overlap），这严重影响到cpu性能和内存资源，浏览器也考虑到这一点，所以浏览器有它自己的层压缩策略（所以可能产生层爆炸的时候，可能并没有产生，因为浏览器对其进行了层压缩）

比如上面的层爆炸例子http://fouber.github.io/test/layer/，它在Chrome 94 Releases 版本被优化了。（我目前时Chrome 96）所以层压缩给得看浏览器版本	

![](/CSS渲染深究/image-20220619202803517.png)

![](/CSS渲染深究/image-20220619203500002.png)

当然，浏览器也不是万能的，也有无法进行层压缩的情况，无法进行层压缩的情况：https://fed.taobao.org/blog/taofed/do71ct/performance-composite/

在上面链接中淘宝前端团队也提及到



渲染优化的文章参考链接

参考链接https://github.com/amfe/article/issues/47

参考链接:https://www.w3cplus.com/css3/introduction-css-will-change-property.html

参考链接https://www.sitepoint.com/introduction-to-hardware-acceleration-css-animations/

参考链接https://www.cnblogs.com/qiqi715/p/10207568.html

参考链接（淘宝技术团队）https://fed.taobao.org/blog/taofed/do71ct/performance-composite/

参考链接（云音乐技术团队）https://segmentfault.com/a/1190000041197292