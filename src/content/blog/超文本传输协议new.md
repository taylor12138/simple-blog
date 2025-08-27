---
author: Hello
categories: 前端
title: 超文本传输协议new
description: 'http协议'
pubDate: 2021-03-15 
---

## 1.http概述

从计算机网络的学习我们了解到：HTTP协议[超文本传输协议]，协议详细规定了浏览器和万维网服务器之间相互通信的规则

#### **http 2.0**

- 使用二进制传输（二进制分帧），减少服务端压力，连接吞吐量更大，改善TCP拥塞状况，同时慢启动时间减少

- 多路复用，多路复用允许同时通过单一的 HTTP/2 连接发起多重的请求-响应消息，所有请求都在一个TCP握手上。

  - 不同浏览器在http1或http1.1对请求的限制数量

  ![](/simple-blog/超文本传输协议new/tcpNum.png)

- 压缩headers（最小数据量化）

- 支持server push（服务端推送），**唯一一个需要开发者自己配置的功能**，他可以对客户端的一个请求发送多个响应，实际上是还没有收到浏览器的请求，服务器就把各种资源推送给浏览器。

  比如，浏览器只请求了`index.html`，但是服务器把`index.html`、`style.css`、`example.png`全部发送给浏览器。这样的话，只需要一轮 HTTP 通信，浏览器就得到了全部资源，提高了性能。

  具体可以看阮一峰老师这里的[说明](https://www.ruanyifeng.com/blog/2018/03/http2_server_push.html)

- 而且它特有的缓存机制，使用场景如下，**「如果客户端早已在缓存中有了一份 copy 怎么办？]**，此时再推送就是浪费带宽。

  这种情况下，HTTP/2 允许客户端通过 **RESET_STREAM** 主动取消 Push ，然而这样的话，原本可以用于更好方向的 Push 就白白的浪费掉数据往返的价值。

  对此，一个推荐的解决方案是，客户端使用一个简洁的 [Cache Digest](https://link.zhihu.com/?target=http%3A//mnot.github.io/I-D/h2-cache-digest/) 来告诉服务器，哪些东西已经在缓存，因此服务器也就会知道哪些是客户端所需要的，因为 Cache Digest 使用的是 [Golumb Compressed Sets](https://link.zhihu.com/?target=https%3A//www.imperialviolet.org/2011/04/29/filters.html)，浏览器客户端可以通过一个连接发送**少于 1K 字节**的 Packets 给服务端，通知哪些是已经在缓存中存在的；

  http/1处理减少请求的方式是线头阻塞（合并多个请求为一个请求），但实质上有一定的开销



下面我们阐述http 1.x版本的内容 

#### http协议的特点

- 永远都是客户端发起请求，服务器回送响应

- http协议是无状态的，但是在实际工作中，一些万维网网站希望能识别用户（给用户推销产品）=>诞生了cookie小饼干，cookie是存储在用户主机的文本文件，记录一段时间内某用户的访问记录（不太敏感的数据）
- http采用TCP作为运输层协议，但是http协议本身是无连接的 （交换http报文之前不需要建立连接）
- http连接方式：持久连接（非流水线式（有点像停等协议）、流水线式（有点像GBN或SR协议，即后退N帧协议和选择重传协议））、非持久连接（每次传输都要三次握手）



#### URL

![](/simple-blog/超文本传输协议new/url.png)

URL：统一资源定位器

**URL和域名的区别**
域名，Domain Name，通常指一个网址的顶级域名。
URL，website address，网页或网站的地址。

URL中包含了网站的域名.
比如一个网址：`www.cnblogs.com/gopark/p/8430916.html`
其中cnblogs.com是域名，cnblogs是网站名字，com是域名后缀；`www.cnblogs.com`代表一个二级域名，通常www被用来用为首页标识；
`https://www.cnblogs.com/gopark/p/8430916.html`，这个则是一个完整的网站首页URL地址。https://，这是一个协议，是网站在网上传输的协议

**URL和URI的区别：**

URI，统一资源标志符，表示的是web上每一种可用的资源，如 HTML文档、图像、视频片段、程序等都由一个URI进行标识的。

URL是URI的一个子集，通俗地说，URL是Internet上描述信息资源的字符串，主要用在各种WWW客户程序和服务器程序上

更加通俗：URI可以认为是一个编号,类似一个身份证号,用来标识其唯一性,而url既可以标识其具有唯一性,而且可以根据url找到资源的位置,这就是区别

**输入url到网页呈现的过程**：

- 域名解析
- 建立TCP连接
- 浏览器发送http请求
- 服务器返回响应
- 浏览器渲染页面
- TCP断开连接

**url编码过程**

对于正常英语，使用ASCII编码方式

对于其他语言，Unicode编码方式，而我们常说的 **UTF-8**  就是在互联网上使用最广的一种 Unicode 的实现方式。其他实现方式还包括 UTF-16（字符用两个字节或四个字节表示）和 UTF-32（字符用四个字节表示），不过在互联网上基本不用。**重复一遍，这里的关系是，UTF-8 是 Unicode 的实现方式之一。**（阮一峰老师said）

（更多可查看《计算机基础知识合集》的blog）



#### encodeURIComponent()

`**encodeURIComponent()**` 函数通过将一个，两个，三个或四个表示字符的 UTF-8 编码的转义序列替换某些字符的每个实例来编码 [URI](https://developer.mozilla.org/zh-CN/docs/Glossary/URI)（对于由两个“代理”字符组成的字符而言，将仅是四个转义序列）。

```js
// encodes characters such as ?,=,/,&,:
console.log(`?x=${encodeURIComponent('test?')}`);
// expected output: "?x=test%3F"

console.log(`?x=${encodeURIComponent('шеллы')}`);
// expected output: "?x=%D1%88%D0%B5%D0%BB%D0%BB%D1%8B"
```

**decodeURIComponent**同理，用于解密

一张图片清晰明了

![](/simple-blog/超文本传输协议new/encodecontent.png)





#### http请求

- GET：获取资源。get注重url获得的参数

  数据格式：获得get请求的内容，它的内容是在url的`?` 之后的部分

  长度限制：Get方法提交的数据大小长度并没有限制，HTTP协议规范没有对URL长度进行限制。这个限制是特定的浏览器及服务器对它的限制；而这个长度限制，每个浏览器对应的限制都是不一样的。

- POST：创建资源（带请求体）。post的信息放在Request body中（firefox浏览器除外）

  数据格式：post回退时会再次提交请求；一般情况下，私密数据传输用POST + body就好

  长度限制：理论上讲，POST是没有大小限制的。HTTP协议规范也没有进行大小限制，起限制作用的是服务器的处理程序的处理能力。

  - 有些文章中提到，post 会将 header 和 body 分开发送，先发送 header，服务端返回 100 状态码再发送 body。

    HTTP 协议中没有明确说明 POST 会产生两个 TCP 数据包，而且实际测试(Chrome)发现，header 和 body 不会分开发送。

    所以，header 和 body 分开发送是部分浏览器或框架的请求方法，不属于 post 必然行为。

- PUT：更新资源（带请求体）

  - PUT请求：如果两个请求相同，后一个请求会把第一个请求覆盖掉。（所以PUT用来改资源）Post请求：后一个请求不会把第一个请求覆盖掉。（所以Post用来增资源）

-  PATCH ： 是对 PUT 方法的补充，用来对已知资源进行局部更新 。比如使用PUT每次都要把更改后数据内容全部写上，而PATCH只需要写上更改部分的字段即可

- DELETE：删除资源

- CONNECT：方法建立一个到由目标资源标识的服务器的隧道。

- OPTIONS：方法用于描述目标资源的通信选项。

- HEAD： 只请求页面的首部。



**请求报文**：

1.行     第一部分是请求类型（GET、POST之类的）   第二部分是url的路径    第三部分是http协议的版本（目前使用最多的是1.1）

2.头（首部）     格式是值键对的形式

Host: atguigu.com

Cookie: name=guigu

Content-type = application/x-www-form-urlencoded

User-Agent: chrome 83

3.空行

4.体   GET的话，请求体为空，POST的话，请求体可以不为空

**响应报文**

1.行     第一部分是http协议的版本（目前使用最多的是1.1） 第二部分是响应状态码  第三是响应状态字符串

2.头 （首部）    格式和请求头一样

3.空行

4.体   html的内容



**Content-Type**: 内容类型，一般是指网页中存在的**Content-Type**，用于定义网络文件的类型和网页的编码，决定文件接收方将以什么形式、什么编码读取这个文件，这就是经常看到一些Asp网页点击的结果却是下载到的一个文件或一张图片的原因。

**ContentType**属性指定[响应](https://baike.baidu.com/item/响应)的 [HTTP](https://baike.baidu.com/item/HTTP)内容类型。如果未指定 ContentType，默认为[TEXT](https://baike.baidu.com/item/TEXT)/[HTML](https://baike.baidu.com/item/HTML)。

常见的Content-Type有数百个，下面例举了一些

HTML文档标记：text/html;
普通ASCII文档标记：text/html;
JPEG图片标记：image/jpeg;
GIF图片标记：image/gif;
js文档标记：application/javascript;
xml文件标记：application/xml;
更多具体内容可参考《图解HTTP》



#### 报文和实体

![](/simple-blog/超文本传输协议new/header1.png)

![](/simple-blog/超文本传输协议new/header2.png)

http报文和http实体是不同的概念，http报文类似于运输的箱子，http实体类似于箱子中的货物（个人感觉  实体 = 报文 - 行 - 除了实体首部字段的所有首部字段）

报文：网络中交换和传输的数据单元，即一次性要发送的数据块，包含了发送的完整数据信息

实体：作为请求和响应的有效载荷数据





#### http工作

- 地址解析，通过DNS解析域名,得主机的IP地址
- 封装http的请求数据包
- 封装成TCP包，建立TCP连接（三次握手）
- 客户端向服务器发送请求
- 服务器向客户端返回响应
- 关闭TCP连接（四次挥手）



#### http only

如果想要实现服务端设置cookie，返回时让客户端无法查看，可以使用 `HttpOnly`属性

（MDN：有两种方法可以确保 `Cookie` 被安全发送，并且不会被意外的参与者或脚本访问：`Secure` 属性和`HttpOnly` 属性。）

`HttpOnly = true` 的话，那此Cookie 只能通过服务器端修改，`Js` 是操作不了的，对于 `document.cookie` 来说是透明的

此预防措施有助于缓解[跨站点脚本（XSS） (en-US)](https://developer.mozilla.org/en-US/docs/Web/Security/Types_of_attacks)攻击。



## 2.持久连接

在http初始协议版本中，每进行一次http通信都要断开一次TCP连接，如果需要同时请求多个资源时就造成了无缘无故的TCP连接建立和断开，造成资源浪费，增加通信开销。

为了解决上述问题，http/1.1和http/1.0想出了持久连接的方法，其特点是只要一方没有明确提出断开，就保持TCP连接。在 http/1.1 中，所有的连接默认都是持久连接

比较新的轮询技术是[Comet](https://zh.wikipedia.org/wiki/Comet_(web技术))。这种技术虽然可以实现双向通信，但仍然需要反复发出请求。而且在Comet中普遍采用的[HTTP持久连接](https://zh.wikipedia.org/wiki/HTTP持久链接)也会消耗服务器资源。

客户端，请求头

```
Connection: Keep-Alive
```

服务端，响应头

```
Connection: Keep-Alive
```

在这种情况下，[HTML5](https://zh.wikipedia.org/wiki/HTML5)定义了WebSocket协议，能更好的节省服务器资源和带宽，并且能够更实时地进行通讯。





#### 延伸出来的管线化

持久连接使得管线化的方式成为可能，管线化技术出现后，不用等待即可发送下个请求

**非管道化**，完全串行执行，请求->响应->请求->响应...，后一个请求必须在前一个响应之后发送。

**管道化**，请求可以并行发出，但是响应必须串行返回。后一个响应必须在前一个响应之后。原因是，没有序号标明顺序，只能串行接收。

**管道化请求的致命弱点**:

1. 会造成队头阻塞，前一个响应未及时返回，后面的响应被阻塞
2. 请求必须是幂等请求，不能修改资源。因为，意外中断时候，客户端需要把未收到响应的请求重发，非幂等请求，会造成资源破坏。

由于这个原因，目前大部分浏览器和Web服务器，都关闭了管道化，采用非管道化模式。

无论是非管道化还是管道化，都会造成队头阻塞(请求阻塞)。



#### **解决http队头阻塞的方法**

**1. 并发TCP连接**：一个域名允许分配多个长连接，那么相当于增加了任务队列，不至于一个队伍的任务阻塞其它所有任务。（浏览器一个域名采用6-8个TCP连接，并发HTTP请求）
**2. 域名分片**：一个域名的并发 长连接数是一定的，比如上方说的6-8个，那我就多分几个域名（多个域名，可以建立更多的TCP连接，从而提高HTTP请求的并发）

**3.HTTP2方式**

http2使用一个域名单一TCP连接发送请求，请求包被二进制分帧，不同请求可以互相穿插，避免了http层面的请求队头阻塞。
但是不能避免TCP层面的队头阻塞。



## 3.首部字段

#### 概述

HTTP 报文包含报文首部和报文主体，报文首部包含请求行（或状态行）和首部字段。

在报文众多的字段当中，HTTP 首部字段包含的信息最为丰富。首部字段同时存在于请求和响应报文内，并涵盖 HTTP 报文相关的内容信息。使用首部字段是为了给客服端和服务器端提供报文主体大小、所使用的语言、认证信息等内容。

**结构**

格式是值键对的形式

#### 类型

分为：

1. 通用首部字段（请求和响应通用）Cache-Control、Connection等
2. 请求首部字段（请求专用）Accept、Accept-Charset、Host（请求资源所在服务器）等
3. 响应首部字段（响应专用）Accept-Ranges、Location（令客户端重定向至指定 URI）、Server（HTTP 服务器应用程序的信息）等
4. 实体首部字段（通用，针对报文的实体部分）Allow、Content-Encoding等





## 4.响应状态码

100：信息型状态响应码表示目前为止一切正常, 客户端应该继续请求, 如果已完成请求则忽略.

101：HTTP `**101 Switching Protocol**`（协议切换）状态码表示**服务器**应**客户端****升级协议**的请求对协议进行切换。

200：ok

201：代表成功的应答状态码，表示请求已经被成功处理，并且创建了新的资源，常规使用场景是作为 [`POST`](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods/POST) 、PUT请求的返回值

204：服务器接收的请求已成功处理，但在返回的响应报文中不含实体的主体部分。另外，也不允许返回任何实体的主体。

206：客户端进行了范围请求，服务器成功执行部分get请求

301：永久重定向   第一次进入a.com，请求->b.com，以后每次进入a.com就不用请求直接去b.com（请求的资源已被永久分配了新的 URI）

302：临时重定向（暂时性转移）  每一次都会进入a.com，然后请求->b.com（请求的资源已被临时分配了新的 URI）

303：有点像302，只不过303提醒你应该使用get请求

304：自从上次请求后，请求的网页未修改过，所以没有响应主体部分

307：同302

400：报文存在语法错误

401：未授权，请求用户身份认证

403：服务器理解了请求但拒绝对其进行授权，被禁止，资源访问被服务器拒绝了

404：找不到

413：表示http请求实体太大。

500：内部错误

502：错误网关，从上游服务器收到无效响应，可能也是停机维护，或者服务器暂未开启，

503：服务器目前无法使用（由于超载或停机维护）通常，这只是暂时状态。（服务不可用）

504：网关超时

![](/simple-blog/超文本传输协议new/ajax.jpg)



## 5.http缓存

常见的http缓存只能缓存get请求响应的资源，对于其他类型的响应则无能为力。对于开发者来说，长久缓存复用重复不变的资源是性能优化的重要组成部分！！！

浏览器第一次向一个web服务器发起`http`请求后，服务器会返回请求的资源，并且在响应头中添加一些有关**缓存的字段**（添加后浏览器才知道是否应该缓存资源）如：

- `Cache-Control`（控制浏览器是否可以缓存资源、强制缓存校验、缓存时间）（通用头部）

  - `no-cache`：含义是不使用本地缓存，需要使用协商缓存，也就是先与服务器确认缓存是否可用。
  - `no-store`：禁用缓存。
  - `public`：表明其他用户也可使用缓存，适用于公共缓存服务器的情况。
  - `private`：表明只有特定用户才能使用缓存，适用于公共缓存服务器的情况
  - `max-age`：最大有效时间

- `Expires`（与响应头中的 Date 对比）（实体头部）

  - `Expires` 更多的是为了兼容旧浏览器（只支持 HTTP/1.0 的上古时代浏览器）的响应标头。

    从 HTTP/1.1 以后就有了 `Cache-Control` 标头中的 `max-age`，设一个秒数；而是 `Expires` 设一个具体的时间点，显然 `Expires` 可能因为客户端与服务端时间不一致、或网络延迟导致过期时间不准确，并且 `Cache-Control` 能设的值更多也就更灵活。

- `Last-Modified`（弱校验， 根据文件**修改时间**校验，可能内容未变，不精确）（实体头部）

- `ETag`（强校验，根据文件内容校验精确，这也是有了`Last-modified`还要有`ETag`的原因，

  可以看作 `Etag`是`last-Modifed`的补充，但是检查时 `Etag`先检查  ）（响应头部）

- `Date`等等。

http缓存都是从第二次请求开始的。第二次请求时，浏览器判断这些请求参数，命中强缓存就直接200，否则就把请求参数加到request header头中传给服务器，看是否命中协商缓存（当ETag和Last-Modified同时存在时，服务器先会检查ETag，然后再检查Last-Modified），命中则返回304，否则服务器会返回新的资源

```
GET /image.jpg HTTP/1.1
Host: example.com
If-Modified-Since: Wed, 21 Oct 2023 07:28:00 GMT
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"

HTTP/1.1 304 Not Modified
```

为什么有`Last-Modified` 还要有 `ETag`？

考虑以下情况：

1.一些文件也许会周期性的更改,但是他的内容并不改变(仅仅改变的修改时间),这个时候,我们并不希望客户端认为这个文件被修改了,而重新 get
2.某些文件修改非常频繁,比如在秒以下的时间内进行修改(比方说 1s 内修改了 N 次),If-Modified-Since能检查到的粒度时 s 级的,这种修改无法判断(或者说 UNIX 记录 MTIME只能精确到秒)
3.某些服务器不能精确得到的文件的最后修改时间



#### 强缓存 + 协商缓存

之后浏览器再向该服务器请求该资源就可以视情况使用**强缓存**和**协商缓存**。

- 强缓存：（当前缓存未过期）浏览器直接从本地缓存中获取数据，不与服务器进行交互。
- 协商缓存：（当前缓存过期）浏览器发送请求到服务器，服务器判定是否可使用本地缓存。
- 联系与区别：两种缓存方式最终使用的都是本地缓存；前者无需与服务器交互，后者需要。

![](/simple-blog/超文本传输协议new/huancun2.png)



#### 缓存过期策略

1、设置 Cache-Control: max-age=1000 。响应头中的 Date 经过 1000s 过期（比起首部字段`Expires`，会优先处理`s-maxage`或`max-age`。）（`Cache-Control`HTTP / 1.1通用头字段被用于为请求和响应缓存机制指定指令l）
2、设置 Expires 。此时间与本地时间(响应头中的 Date )对比，小于本地时间表示过期，由于本地时钟与服务器时钟无法保持一致，导致比较不精确，也就是说如果修改了本地时间，可能会造成缓存失效。（http1.0时代，Pragma也是1.0时代的产物）
3、如果以上均未设置，却设置了 Last-Modified ，浏览器隐式的设置资源过期时间为 (Date - Last-Modified) * 10% 缓存过期时间。



**前端缓存图**：

![](/simple-blog/超文本传输协议new/huancun.png)





#### 添加虚拟参数，避免命中缓存

有时候我们可能并不需要命中缓存，比如这个[问题](https://www.hacksoft.io/blog/handle-images-cors-error-in-chrome)，里面记录了关于第一个img在跨域缓存后，一直会报跨域的问题。

解决方法是添加虚拟参数，比如

```js
const corsImageModified = new Image();
corsImageModified.crossOrigin = "Anonymous";
corsImageModified.src = url + "?not-from-cache-please";
```

这将强制浏览器不使用以前的缓存图像，而是为图像发送新的GET请求，我们添加的 GET 参数无关紧要，只要生成的 URL 与初始（缓存）图像 URL 不同即可。



## 6.其他

#### 范围请求

假设你正在下载一个很大的文件，已经下了四分之三，忽然网络中断了，那下载就必须重头再来一遍。为了解决这个问题，需要一种可恢复的机制，即能从之前下载中断处恢复下载，要实现该功能，这就要用到范围请求。（前提是上一次请求到这一次请求时间段内，下载对象没有发生改变）

当然，前提是服务器要支持**范围请求**，要支持这个功能，就必须加上这样一个响应头:

```http
Accept-Ranges: none
```

单一范围：我们可以请求资源的某一部分

多重范围：一次请求文档的多个部分

条件式范围：当（中断之后）重新开始请求更多资源片段的时候，必须确保自从上一个片段被接收之后该资源没有进行过修改。



#### HTTP代理

代理有三个大功能

1.**负载均衡**

2.**保障安全**

3.**缓存代理**

Via首部字段：里存储着代理服务器名称，他们的顺序为HTTP 传输中报文传达的顺序。



X-Forwarded-For首部字段：它记录的是请求方的`IP`地址，但是这意味着每经过一个不同的代理，这个字段的名字都要变

但是这会产生两个问题:

1. 意味着代理必须解析 HTTP 请求头，然后修改，比直接转发数据性能下降。
2. 在 HTTPS 通信加密的过程中，原始报文是不允许修改的。

由此产生了`代理协议`，一般使用明文版本，只需要在 HTTP 请求行上面加上这样格式的文本即可:

```
// PROXY + TCP4/TCP6 + 请求方地址 + 接收方地址 + 请求端口 + 接收端口
PROXY TCP4 0.0.0.1 0.0.0.2 1111 2222
GET / HTTP/1.1
...
复制代码
```

这样就可以解决`X-Forwarded-For`带来的问题了。



X-Real-IP首部字段：始终记录最初的客户端的IP



#### 判断是否弱网环境

- `saveData` 是用户主动开启的数据节省模式
- 当用户启用此模式时，表明希望减少数据使用

```js
// 判断是否为弱网环境
const isSlowNetwork = () => {
  if (!navigator.connection) return false;
  
  const { saveData, effectiveType, downlink } = navigator.connection;
  
  // 用户主动开启数据节省
  if (saveData) return true;
  
  // 基于有效连接类型判断
  if (['slow-2g', '2g', '3g'].includes(effectiveType)) return true;
  
  // 基于下载速度判断（Mbps）
  if (downlink && downlink < 1.5) return true;
  
  return false;
};
```



## 7.QUIC

Quic 全称 quick udp internet connection ，“快速 UDP 互联网连接”，也可以理解为http3.0

应用：速度更快、网络切换（wifi -> nG）无感知等、弱网络环境better



对比http2.0：

1. **减少了 TCP 三次握手及 TLS 握手时间。**

   ![](/simple-blog/超文本传输协议new/quic.png)

   HTTPS 的一次完全握手的建连过程，需要 2-3 个 RTT，而QUIC由于建立在UDP的基础上，只需要更少的次数即可完成安全握手。

   RTT 对比

   | 协议     | 握手次数 | RTT 消耗 | 说明               |
   | :------- | :------- | :------- | :----------------- |
   | **UDP**  | 无握手   | 0 RTT    | 直接发送数据       |
   | **QUIC** | 1次握手  | 0-1 RTT  | 首次1RTT，恢复0RTT |
   | **TCP**  | 3次握手  | 1 RTT    | 实际约1.5RTT       |

2. **确认应答机制（ACK）**

   **Packet Number 严格递增**，代替了 TCP 的 `sequence number`

   ```
   发送: Packet 1, Packet 2, Packet 3
   丢失: Packet 2
   重传: Packet 4 (内容是原 Packet 2，但编号递增)
   ```

   ```
   发送数据: SEQ=100, 数据="Hello"
   重传数据: SEQ=100, 数据="Hello" (序列号相同)
   ```

   **优势**：

   - 避免了 TCP 重传歧义问题
   - 可以精确区分原始包和重传包的 ACK

3. **更多的拥塞控制算法。**

4. **数据完整性保证**

   **Stream Offset 机制**，很像范围请求，可以说，QUIC 的 Stream Offset 是将 HTTP 范围请求的精细化思想内置到了传输层协议中，实现了更高效的数据传输和错误恢复。

   ```
   Packet N:   Stream 1, Offset 0-100
   Packet N+1: Stream 1, Offset 100-200
   Packet N+2: Stream 1, Offset 200-300
   ```

   即使 Packet 乱序到达，也能通过 Offset 正确重组数据。

   ```
   Stream 1 数据: "Hello World, this is a test message"
   
   Packet A: Stream 1, Offset 0-10,   数据: "Hello Worl"
   Packet B: Stream 1, Offset 10-20,  数据: "d, this is"  
   Packet C: Stream 1, Offset 20-34,  数据: " a test message"
   ```

   ```
   接收顺序: Packet C → Packet A → Packet B
   重组过程:
   - 收到 Packet C (Offset 20-34): 暂存，等待前面数据
   - 收到 Packet A (Offset 0-10):  放入缓冲区开头
   - 收到 Packet B (Offset 10-20): 填补中间空隙
   - 完整数据: "Hello World, this is a test message"
   ```

   

5. **避免队头阻塞的多路复用。**

   **TCP队头阻塞**：

   虽然http2也进行了多路复用，但 TCP 层面仍有队头阻塞，TCP数据包是有序传输，中间一个数据包丢失，会等待该数据包重传，造成后面的数据包的阻塞。（从丢包层来讲）

   QUIC的多路复用，也可以实现在一条 QUIC 连接上可以并发发送多个 HTTP 请求 （stream），但是stream之间没有相互依赖，这导致了彼此不会相互影响，极大程度消除了对头阻塞的影响；

   并且QUIC 最基本的传输单元是 Packet，整个加密和认证过程都是基于 Packet 的，不会跨越多个 Packet。这样就能避免 TLS 协议存在的队头阻塞。

   而对比QUIC，http2.0的多路复用会队头阻塞，本身强制使用的TLS协议也存在一个队头阻塞

   ![](/simple-blog/超文本传输协议new/quic2.png)

   ![](/simple-blog/超文本传输协议new/quic3.png)

6. **连接迁移。**

   WIFI 和 4G 移动网络切换时， ip发生变化 -> 重新建立TCP连接；而任何一条 QUIC 连接不再以 IP 及端口四元组标识，而是以一个 64 位的随机数作为 ID 来标识，继而上层业务逻辑感知不到变化

7. **前向冗余纠错**



#### QUIC的UDP优化

相信已经在尝试应用QUIC/HTTP3的服务端开发者，或多或少都会经历UDP在内核方面的性能瓶颈问题，考虑到UDP是在近几年才随着QUIC和流媒体传输的场景的逐渐流行，才被逐渐广泛地应用起来

因此内核UDP在性能方面很难与优化了三十年的TCP相抗衡，同时内核的复杂性和通用性要求，也导致一些新的高性能修改难以被迅速接收。因此，在UDP性能优化方面，我们和龙蜥社区的Anolis内核团队联合做了一版bypass内核的用户态高性能udp收发方案。

QUIC 本质上是**在 UDP 之上重新实现了一套连接管理和可靠传输机制**：

- UDP 只负责数据包传输
- QUIC 在应用层实现连接建立、状态管理、可靠性保证
- 相当于把 TCP 的功能搬到了用户态，并进行了优化



#### quic握手

1. **连接建立握手**

QUIC 在应用层实现了类似 TCP 的握手机制：

```
Client                           Server
  |                                |
  | Initial Packet                 |
  | - Connection ID                |
  | - ClientHello (TLS)            |
  |------------------------------->|
  |                                |
  | Handshake Packet               |
  | - ServerHello + Certificate    |
  | - Connection established       |
  |<-------------------------------|
  |                                |
  | Handshake Complete             |
  |------------------------------->|
```

2. **Connection ID 机制**

```
// QUIC 连接标识
Connection ID: 0x1a2b3c4d5e6f7890  // 64位随机数
```

- 不依赖 IP+端口四元组
- 双方协商确定连接标识
- 后续所有包都带此 ID

3. **状态管理**

QUIC 在应用层维护连接状态：

```
// 连接状态机
enum ConnectionState {
    INITIAL,           // 初始状态
    HANDSHAKE,         // 握手中
    ESTABLISHED,       // 已建立
    CLOSING,           // 关闭中
    CLOSED             // 已关闭
}
```

4. **可靠性保证机制**

```
Client: 发送 Packet 1, 2, 3
Server: 返回 ACK [1, 2, 3]
Client: 收到确认，继续发送
```

##### 关键区别对比

| 方面         | TCP      | UDP      | QUIC              |
| :----------- | :------- | :------- | :---------------- |
| **连接建立** | 3次握手  | 无连接   | 1次握手（应用层） |
| **状态维护** | 内核维护 | 无状态   | 应用层维护        |
| **可靠性**   | 内核保证 | 不保证   | 应用层实现        |
| **标识方式** | 四元组   | 无连接ID | Connection ID     |





QUIC参考链接

[科普：QUIC协议原理分析](https://zhuanlan.zhihu.com/p/32553477)

[如何看待 HTTP/3 ？](https://www.zhihu.com/question/302412059/answer/2530154943)



## 8.本地修改host

目前先将本地的/etc/hosts 中配置本地预览地址（mac端通过`sudo vim /etc/hosts` 打开）

```sh
# 127.0.0.1 都走成 t.baidu.163.com
127.0.0.1	t.baidu.163.com
```

来顶替目前跨域的问题



```sh
cat /etc/hosts
127.0.0.1       localhost
255.255.255.255 broadcasthost
::1             localhost
127.0.0.1       t.moyi.163.com
```

通过这个文件可以看到哪些域名对应哪些ip，哪些主机名对应哪些ip，通常情况下这个文件首先记录了本机的ip和主机名
 一般情况下hosts文件的每行为一个主机，每行由三部分组成，每个部分由空格隔开，格式如下

```sh
ip地址 主机名/域名 （主机别名）
```

