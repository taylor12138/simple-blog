---
author: Hello
categories: 前端
pubDate: 2021-8-22 
title: Chrome的探索
description: 'Chrome相关'
---
## 浏览器结构

1. **用户界面** - 包括地址栏、前进/后退按钮、书签菜单等。除了浏览器主窗口显示的您请求的页面外，其他显示的各个部分都属于用户界面。
2. **浏览器引擎** - 在用户界面和呈现引擎之间传送指令。
3. **呈现引擎** - 负责显示请求的内容。如果请求的内容是 HTML，它就负责解析 HTML 和 CSS 内容，并将解析后的内容显示在屏幕上。
4. **网络** - 用于网络调用，比如 HTTP 请求。其接口与平台无关，并为所有平台提供底层实现。
5. **用户界面后端** - 用于绘制基本的窗口小部件，比如组合框和窗口。其公开了与平台无关的通用接口，而在底层使用操作系统的用户界面方法。
6. **JavaScript 解释器**。用于解析和执行 JavaScript 代码。
7. **数据存储**。这是持久层。浏览器需要在硬盘上保存各种数据，例如 Cookie。新的 HTML 规范 (HTML5) 定义了“网络数据库”，这是一个完整（但是轻便）的浏览器内数据库。



呈现引擎：用于CSS格式化HTML内容和图片

Firefox 使用的是 Gecko，这是 Mozilla 公司“自制”的呈现引擎。而 Safari 和 Chrome 浏览器使用的都是 WebKit。



## Chrome渲染流程

#### 多进程

一般一个应用对应 ->  一个进程

开发一个浏览器，它可以是单进程多线程的应用，也可以是使用 IPC 通信的多进程应用。

Chrome 采用多进程架构，其顶层存在一个 Browser process 用以协调浏览器的其它进程

chrome多进程的优点

1. 某一渲染进程出问题不会影响其他进程
2. 更为安全，在系统层面上限定了不同进程的权限

缺点：由于不同进程间的内存不共享，不同进程的内存常常需要包含相同的内容。（意思就是内存占用大呗）

如果 Chrome 运行在强大的硬件上，它会分割不同的服务到不同的进程，这样 Chrome 整体的运行会更加稳定，但是如果 Chrome 运行在资源贫瘠的设备上，这些服务又会合并到同一个进程中运行，这样可以节省内存

#### **Site Isolation**

Site Isolation 机制允许在同一个 Tab 下的跨站 iframe 使用单独的进程来渲染，这样会更为安全。（相当于网页中内嵌iframe，使得进程之间保持独立性）

#### chrome导航

tab以外的工作也都是由Browser Process控制，而它对于导航栏，用不同的线程进行处理（这些线程包含在Browser Process中）

- UI thread ： 控制浏览器上的按钮及输入框；
- network thread: 处理网络请求，从网上获取数据；
- storage thread: 控制文件等的访问

导航栏输入关键字之后：

UI thread 判断输入 -> 

network thread 获取请求，执行DNS查询，建立TLS连接 -> 

根据相应的格式进行处理 -> 

触发Safe Browsing， 如果当前匹配到的是恶意站点，则会发出警告 -> 	

一切准备就绪，network thread：我们数据ok了，UI thread：收到，然后UI thread找到一个render process进行网页渲染（所有的 JS 代码其实都由 renderer Process 控制的） -> 

Browser Process 收到 renderer process 的渲染确认消息，页面加载开始，history tab 进行更新

#### 渲染工作

在Render Process中，包含以下线程

1. 主线程 Main thread
2. 工作线程 Worker thread
3. 排版线程 Compositor thread
4. 光栅线程 Raster thread

渲染过程：

主线程main thread构建DOM -> 

若期间存在 `<img>` `<link>` 等标签，则传递给Browser Process 的network thread进行下载 ->

碰到`<script>` 标签会阻塞，除非带有defer或者async -> 

形成CSSOM树和DOM树再合成render树，计算布局、样式，也就是我们常见的layout和paint，最后合成帧，其中如果添加了 `will-change` CSS 属性的元素，会被看做单独的一层，（类似于CSS的缓存效果）

#### chrome对事件的优化

一般我们屏幕的刷新速率为 60fps，但是某些事件的触发量会不止这个值，出于优化的目的，Chrome 会合并连续的事件(如 wheel, mousewheel, mousemove, pointermove, touchmove )，并延迟到下一帧渲染时候执行 。

不过值得一提的是，那些非连续性的事件，也就是click之类的（毕竟你也点不了那么快），则会立即被触发





## AMP

AMP（加速移动页面）是一个由Google与Twitter合作开发的开源框架，它提供了一种直接的方式来创建轻量级的网页，以便用户即时使用，获得了极大改善的体验：内容更快，更具吸引力，更易于阅读。



#### **AMP页面的3个核心组件**

**AMP HTML：**一个比常规HTML更精简的HTML版本，对可以使用的HTML标签有严格的规范

**AMP JS：**为了确保移动平台上的快速页面加载，AMP限制使用任何Javascript，唯一的例外是AMP脚本

**AMP CDN：**通常称为AMP缓存，AMP平台的一个关键组件是其基于代理的内容分发网络（CDN），可提供加速移动页面。



#### **AMP的优缺点**

**优点：**

- 1、内容的加载速度非常快，用很好的移动体验感，提高了参与度和转化率。
- 2、通过移动搜索结果，可以在AMP轮播中突出显示内容。
- 3、减少服务器上的负载，因为AMP CDN缓存并响应大多数搜索结果。

**缺点：**

- 1、JavaScript有限制，用户无法自己创建，所以它可能很难编码。
- 2、没有集成插件，一些效果很难在页面中实现。
- 3、简化了HTML，css有限制，不能很好的自定义网站样式，大多是Google的默认格式。



参考链接https://zhuanlan.zhihu.com/p/47407398

参考链接https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work

参考链接https://zhuanlan.zhihu.com/p/139506473
