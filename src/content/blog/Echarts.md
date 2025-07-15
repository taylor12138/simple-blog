---
author: Hello
categories: 前端
title: Echarts
description: '框架相关知识'
---

## Echarts.js

Echart.js，它是由百度公司开发的一个使用JavaScript实现的开源可视化库（同时也有D3.js，它是国外的可视化库），兼容性强，底层依赖轻量级的 [Canvas](https://so.csdn.net/so/search?q=Canvas&spm=1001.2101.3001.7020) 类库 ZRender，可高度个性化定制数据可视化图表（移动端pc端都兼容）

安装：

```shell
npm install echarts --save
```

官网：https://echarts.apache.org/zh/index.html



#### 前端可视化工具

常见工具：ECharts、g2、d3、vis、hightChart等

g2框架封装：bizcharts（react）、viser（vue）

地理可视化 ：g2、L7、高德的loca、菜鸟的鸟图

3D可视化：three.js



## 使用步骤

1. 引入Echarts文件

   可以通过导入

   ```js
   import * as echarts from 'echarts'
   ```

   也可以直接放在全局，直接使用

   ```js
   Vue.prototype.$echarts = window.echarts
   ```

2. 准备呈现图表的盒子（一定要有宽高，比如width: 600px; height: 400px）

3. 初始化echarts对象

   init方法：

   ```ts
   (dom: HTMLDivElement|HTMLCanvasElement, theme?: Object|string, opts?: {
       devicePixelRatio?: number,
       renderer?: string,
       useDirtyRect?: boolean, // 从 `v5.0.0` 开始支持
       width?: number|string,
       height?: number|string,
       locale?: string
   }) => ECharts
   ```

   创建一个 ECharts 实例，返回 [echartsInstance](https://echarts.apache.org/zh/api.html#echartsInstance)，不能在单个容器上初始化多个 ECharts 实例。

   **参数**

   - `dom`

     实例容器，一般是一个具有高宽的`div`元素。

     **注：**如果`div`是隐藏的，ECharts 可能会获取不到`div`的高宽导致初始化失败，这时候可以明确指定`div`的`style.width`和`style.height`，或者在`div`显示后手动调用 [echartsInstance.resize](https://echarts.apache.org/zh/api.html#echartsInstance.resize) 调整尺寸。

     ECharts 3 中支持直接使用`canvas`元素作为容器，这样绘制完图表可以直接将 canvas 作为图片应用到其它地方，例如在 WebGL 中作为贴图，这跟使用 [echartsInstance.getDataURL](https://echarts.apache.org/zh/api.html#echartsInstance.getDataURL) 生成图片链接相比可以支持图表的实时刷新。

   - `theme`

     应用的主题。可以是一个主题的配置对象，也可以是使用已经通过 [echarts.registerTheme](https://echarts.apache.org/zh/api.html#echarts.registerTheme) 注册的主题名称。参见 [ECharts 中的样式简介](https://echarts.apache.org/handbook/zh/concepts/style)。

   - `opts`

     附加参数。有下面几个可选项：

     - `devicePixelRatio` 设备像素比，默认取浏览器的值`window.devicePixelRatio`。

     - `renderer` 渲染器，支持 `'canvas'` 或者 `'svg'`。参见 [使用 Canvas 或者 SVG 渲染](https://echarts.apache.org/handbook/zh/best-practices/canvas-vs-svg)。

     - `useDirtyRect` 是否开启脏矩形渲染，默认为`false`。参见 [ECharts 5 新特性](https://echarts.apache.org/handbook/zh/basics/release-note/v5-feature)。

     - `width` 可显式指定实例宽度，单位为像素。如果传入值为 `null`/`undefined`/`'auto'`，则表示自动取 `dom`（实例容器）的宽度。

     - `height` 可显式指定实例高度，单位为像素。如果传入值为 `null`/`undefined`/`'auto'`，则表示自动取 `dom`（实例容器）的高度。

     - `locale` 使用的语言，内置 `'ZH'` 和 `'EN'` 两个语言，也可以使用 [echarts.registerLocale](https://echarts.apache.org/zh/api.html#echarts.registerLocale) 方法注册新的语言包。目前支持的语言见 [src/i18n](https://github.com/apache/echarts/tree/release/src/i18n)。

       如果不指定主题，也需在传入`opts`前先传入`null`，如：

       ```js
       const chart = echarts.init(dom, null, {renderer: 'svg'});
       ```

4. 准备配置项

5. 将配置设置给echarts实例对象（配置是可以设置多次，叠加设置，这样可以分离数据的代码和初始化的代码）

```js
import * as echarts from 'echarts';
// 基于准备好的dom，初始化echarts实例(如果是vue则用ref获取)
var myChart = echarts.init(document.getElementById('main'));
// 绘制图表
myChart.setOption({
    //标题
    title: {
        text: 'ECharts 入门示例'
    },
    //通用配置，可设置对图表接触事件
    tooltip: {
        //默认mousemove，移动到每一项触发光标和详情信息
        trigger:'item',
        //设置后要click，点击才会有信息提示
        triggerOn:'click'
    },
    //工具栏，里面有很多好用的工具
    toolbox:{
        feature:{
            //可以直接到导出图片的功能
            saveAsImage:{}
        }
    }
    //x轴
    xAxis: {
    	type: "category",
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    //y轴
    yAxis: {
         type: "value",
         scale:true    //让数据不会从0开始
    },
    //系列列表，通过type决定图表类型，可以有多个对象
    series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
    }]
});
```

**轴**的type：

- `category` 类目轴

- `value`数值轴（一般为数值轴则不用设置data属性，它会去另一个轴每个类别取series找到对应的数据）

**系列表**的type：[line](https://echarts.apache.org/zh/option.html#series-line)（折线图）、[bar](https://echarts.apache.org/zh/option.html#series-bar)（柱状图）、[pie](https://echarts.apache.org/zh/option.html#series-pie)（饼图）、[scatter](https://echarts.apache.org/zh/option.html#series-scatter)（散点图）、[graph](https://echarts.apache.org/zh/option.html#series-graph)（关系图）、[tree](https://echarts.apache.org/zh/option.html#series-tree)（树图）

**折线图**数据曲线平滑：`smooth:true`

**散点图**、**涟漪散点图（effectScatter）** 需要二维数组配合使用

**饼图的数据**：`{name:'allen', value:100}`，不需要x轴、y轴

**map地图**的tooltip：提示框组件，可在里面进行修改，得到提示的内容不同

更多配置项详情查看官方文档

一个很有趣的echarts图表实例https://echarts.apache.org/examples/zh/editor.html?c=bar-race-country

还有些echats5新特性：实现图表跨系列的形变动画，更加酷炫！



## 图形原理

Echarts使用一个名为 **zrender** 的渲染引擎来管理渲染元素，并以通用的方式渲染到不同的平台

- **ZRender**：二维矢量库Zrender，用于图形元素管理、渲染器管理和事件系统。它支持多种渲染后端，包括canvas、svg和vml。
- Echarts最初采用canvas绘制图表，但是从Echarts4.x开始，发布了SVG渲染器，提供了另外一种渲染方式



## Echarts的SVG VS Canvas

![](/Echarts/vs.jpg)

知乎上的结论大图

![](/Echarts/vs2.jpg)

绿色表示推荐使用 SVG，红色表示推荐使用 Canvas，↑箭头越多表示推荐程度越强烈

使用SVG

- 移动平台优选 SVG

- 图表个数很多时优选 SVG

- 导出小文件高清晰时使用 SVG

使用Canvas

- 部分特殊渲染效果只有 Canvas 支持

  除了某些特殊的渲染可能依赖 Canvas：如[炫光尾迹特效](https://link.zhihu.com/?target=http%3A//echarts.baidu.com/option.html%23series-lines.effect)、[带有混合效果的热力图](https://link.zhihu.com/?target=http%3A//echarts.baidu.com/examples/editor.html%3Fc%3Dheatmap-bmap)等，绝大部分功能 SVG 都是支持的。此外，目前的 SVG 版中，富文本、材质功能尚未实现。

- 数据量特别大时推荐使用 Canvas 渲染

知乎地址：https://zhuanlan.zhihu.com/p/33093211