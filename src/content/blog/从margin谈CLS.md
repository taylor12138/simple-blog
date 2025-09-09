---
author: Hello
pubDate: 2024-03-05 
categories: 前端
title: 从margin谈CLS
description: 'css相关'
---


## 问题发现

在性能监控平台上，发现cls的数据不尽人意，通过lighthouse定位到大致的dom元素位置

![](/simple-blog/从margin谈cls/m1.png)

由于此元素是个container套壳的div，里面包裹的children是懒加载的路有组件，所以我们先使用日常的“外层写定宽高”的形式去解决，设置了一个min-height，但是发现没有什么用

![](/simple-blog/从margin谈cls/m2.png)

通过删除发现children dom使用了 margin-top: 负值的形式向上移动，影响到了父元素 layout



## 问题收束

#### 外边距折叠

区块的[上](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin-top)[下](https://developer.mozilla.org/zh-CN/docs/Web/CSS/margin-bottom)外边距有时会合并（折叠）为单个边距，其大小为两个边距中的最大值（或如果它们相等，则仅为其中一个），这种行为称为**外边距折叠**。注意：有设定[浮动](https://developer.mozilla.org/zh-CN/docs/Web/CSS/float)和[绝对定位](https://developer.mozilla.org/zh-CN/docs/Web/CSS/position#定位类型)的元素不会发生外边距折叠。



会出现的情况

相邻的兄弟元素：

- 相邻的同级元素之间的外边距会被折叠（除非后面的元素需要[清除](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clear)之前的浮动）。

没有内容将父元素和后代元素分开：

- 如果没有设定边框（border）、内边距（padding）、行级（inline）内容，也没有创建[区块格式化上下文](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_display/Block_formatting_context)（BFC）或[*间隙*](https://developer.mozilla.org/zh-CN/docs/Web/CSS/clear)来分隔块级元素的上边距 （margin-top） 与其内一个或多个子代块级元素的上边距 （margin-top）；
  - BFC可以理解为房子里的一个**隔断房间**，内部 / 外部 样式不会相互影响
- 或者没有设定边框、内边距、行级内容、高度或最小高度来分隔块级元素的下边距与其内部的一个或多个后代后代块元素的下边距，则会出现这些外边距的折叠，重叠部分最终会溢出到父代元素的外面。

空的区块：

- 如果块级元素没有设定边框、内边距、行级内容、高度（[`height`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/height)）、最小高度（[`min-height`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/min-height)）来分隔块级元素的上边距及其下边距，则会出现其上下外边距的折叠。



而我们出现的情况便是其中的 “没有内容将父元素和后代元素分开”，此时我们使用`padding-top：0.1px` 稍微将父 / 子元素 分开，就解决了问题



## CLS标准

[Cumulative Layout Shift (CLS)](https://web.dev/articles/cls?hl=zh-cn) 是三个[核心网页指标](https://web.dev/articles/vitals?hl=zh-cn#core_web_vitals)指标之一。它会结合视口中可见内容的偏移量和受影响元素移动的距离来衡量内容的不稳定性。

布局偏移可能会分散用户的注意力。假设您在开始阅读一篇文章时突然元素在网页内四处移动，导致您迷失方向，需要再次找到相应位置。这在网络上非常常见，包括在阅读新闻或尝试点击“搜索”或“添加到购物车”按钮时。此类体验会造成视觉冲击和失望。通常，当可见元素因突然将另一个元素添加到页面中或调整大小而被强制移动时，就会出现这些错误。

为了提供良好的用户体验，**网站必须至少有 75% 的网页访问的 CLS 不超过 0.1**。

![良好 CLS 值不超过 0.1，较差值大于 0.25，并且介于两者之间的任何值都需要改进](https://web.dev/static/articles/optimize-cls/image/good-cls-values-are-under-1ce942cb59c08.svg?hl=zh-cn)



## 降低CLS的举措

#### 避免外边距折叠

很对父子、兄弟、空内容元素需要注意折叠问题

mdn提及到的需要注意的点：

- 上述情况的组合会产生更复杂的（超过两个外边距的）外边距折叠。
- 即使某一外边距为 0，这些规则仍然适用。因此就算父元素的外边距是 0，第一个或最后一个子元素的外边距仍然会（根据上述规则）“溢出”到父元素的外面。
- 如果包含负边距，折叠后的外边距的值为最大的正边距与最小（绝对值最大）的负边距的和。
- 如果所有的外边距都为负值，折叠后的外边距的值为最小（绝对值最大）的负边距的值。这一规则适用于相邻元素和嵌套元素。
- 外边距折叠仅与垂直方向有关。
- `display` 设置为 `flex` 或 `grid` 的容器中不会发生外边距折叠。

所以上方的示例，使用 `display` 设置为 `flex` 或 `grid`  也是可以解决的（其实就是走BFC了）



#### 使用指定宽高的图片等媒体元素占位

在图像、视频等媒体资源元素中始终包含宽度和高度大小属性。

并且使用`aspect-ratio`用来直接指定当前元素的比例。

如果考虑到浏览器支持问题，当然也可以使用 `padding HACK` 来替代 `aspect-ratio`

如果考虑浏览器支持问题仍然可以考虑使用目前一个被广泛接受的基解决方案 “Padding-Top Hack”。这个解决方案需要一个父元素和一个绝对型的子元素。然后计算出长宽比的百分比来设置为 `padding-top`。例如：

```html
<div class="container">
  <img class="media" src="..." alt="...">
</div>
```

```css
.container {
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* 16:9 Aspect Ratio */
}

.media {
  position: absolute;
  top: 0;
}
```





#### 使用不易产生偏移的 CSS

其中 `transfrom` 表现很好，以下举几个[例子](https://play.tailwindcss.com/26PxFA6UVI)。

`zoom` VS `transform: scale`

当 `zoom` 会撑大页面并向右偏移时，`transform: scale` 只是在原地放大。

![img](https://i.dawnlab.me/15eaba18394472deef6100ee48779257.png)





`margin` VS `transform: translate`

`margin` 会导致父元素变大，`transform: translate` 只是让当前元素移动。



`border` VS `box-shadow`

`border` 会撑起父元素，而 `box-shadow` 并不会。

![img](https://i.dawnlab.me/78610670a717636f7395dfc11e87cce8.png)





#### 小心使用 `transition: all`

在页面首次加载或者跳转页面时，`transition: all` 可能会导致元素的 `padding` 等从参数为 0 开始渲染，照成页面的抖动。

transition尽量注册在对应的的元素css属性上，避免问题，也能优化性能



参考文章：

[累积布局偏移优化 CLS 完全指南](https://nexmoe.com/2PRR1J7.html) 

[优化 Cumulative Layout Shift](https://web.dev/articles/optimize-cls?hl=zh-cn)

[MDN: 掌握外边距折叠](https://developer.mozilla.org/zh-CN/docs/Web/CSS/CSS_box_model/Mastering_margin_collapsing)