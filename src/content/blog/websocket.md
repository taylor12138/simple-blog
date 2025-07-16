---
title: websocket
author: Hello
categories: 网络
description: websocket相关问题
pubDate: 2022-08-23 
---
## 1.轮训技术

现在，很多网站为了实现推送技术，所用的技术都是 Ajax 轮询。轮询是在特定的的时间间隔（如每x秒），由浏览器对服务器发出HTTP请求，然后由服务器返回最新的数据给客户端的浏览器，但是一部分缺点：

带宽浪费：轮询需要定期向服务器发送请求，即使服务端没有新数据可用，这将会造成大量的带宽和服务器资源浪费。

延迟高：数据的更新频率受轮询间隔影响，如果轮询间隔时间过长，会导致数据更新的延迟较高。

负载过高：要降低数据的延迟，就必须提高接口轮询的频率，但轮询的频率过高，将会导致服务器负载过高，从而影响其他用户的体验。



#### 长轮训

长轮询（Long Polling）是一种改进的轮询技术，它的主要思想是在客户端发送请求后，服务端保持连接打开，但并不立即响应，而是在有新数据可用时才响应给客户端。当客户端接收到响应后，再次发起请求，以保持连接打开。

其实可以理解为服务端请求等到有数据更新时，再返回接口数据。



相比于传统的轮询，长轮询可以降低网络延迟和服务器压力；因为长轮询的响应是异步的，服务器不需要在每个固定时间间隔内返回响应，这样可以减少不必要的请求。同时，当服务器有新数据可用时，也可以立即返回响应，从而提高数据的实时性。

但是，长轮询仍然需要消耗大量的带宽和服务器资源，因为每个连接都需要保持打开状态，可以想象有很多个请求到达服务端，服务端需要开启多个异步来保持链接在 pending 的状态。



出了轮训技术外，还有SSE通信等，详情可以在[这里](https://juejin.cn/post/7236915296962248760)查看



## 2.WebSocket概括

`WebSocket` 是 HTML5 开始提供的一种在单个 TCP 连接上进行全双工通讯的协议，是一个持久化的协议。

`WebSocket` 使得客户端和服务器之间的数据交换变得更加简单，允许服务端主动向客户端推送数据。在 `WebSocket` API 中，浏览器和服务器只需要完成一次握手，两者之间就直接可以创建持久性的连接，并进行双向数据传输。（打破了三次握手定律？？！NoNoNo，这里指的是一次握手指的是建立连接，完成握手归根到底于传输层tcp协议的三次握手）

但是`WebSocket`是基于http1.1（`Websocket` 通过HTTP/1.1 协议的101状态码进行握手。） + TCP协议的，http/2选择了基于SPDY

（借用Wikipedia的）

```http
GET /chat HTTP/1.1
Host: server.example.com
Upgrade: websocket
Connection: Upgrade                         （Connection：通用首部字段）
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw== （浏览器随机生成，验证作用）
Sec-WebSocket-Protocol: chat, superchat     （不同的服务所需要的协议）
Sec-WebSocket-Version: 13                   （协议版本）
Origin: http://example.com
```

而其中的核心在

```http
Upgrade: websocket
Connection: Upgrade
```



#### WebSocket推送技术

使用WebSocket推送

1.浏览器通过 JavaScript 向服务器发出建立 WebSocket 连接的请求，连接建立以后，客户端和服务器端就可以通过 TCP 连接直接交换数据。（通过握手建立连接，http协议升级为websocket协议，服务端响应101状态码）

2.当你获取 Web Socket 连接后，你可以通过 **send()** 方法来向服务器发送数据，并通过 **onmessage** 事件来接收服务器返回的数据。（允许服务端主动向客户端推送数据）

![](/simple-blog/websocket/WebSocket.png)

WebSocket推送技术和http2.0的服务端推送（server push）：

- HTTP协议和WebSocket协议都是应用层的协议，两者应用场景不一样。
- HTTP主要用来一问一答的方式交付信息；WebSocket让通信双方都可以主动去交换信息。
- HTTP2虽然支持服务器推送资源到客户端，但那不是应用程序可以感知的，主要是让浏览器（用户代理）提前缓存静态资源，所以我们不能指望HTTP2可以像WebSocket建立双向实时通信。



#### Socket

Socket 其实并不是一个协议，是应用层与 TCP/IP 协议通信的中间软件抽象层，它是一组接口。

通过Socket，我们才能使用TCP/IP协议。



#### websocket协议升级

```http
客户端
GET ws://localhost:3000/ws/chat HTTP/1.1
Host: localhost
Upgrade: websocket
Connection: Upgrade
Origin: http://localhost:3000
Sec-WebSocket-Key: client-random-string
Sec-WebSocket-Version: 13
```

1.GET请求的地址以`ws://`开头的地址；

2.请求头`Upgrade: websocket`和`Connection: Upgrade`表示转换成为`WebSocket`连接；

`Sec-WebSocket-Key`是用于标识这个连接，并非用于加密数据；

`Sec-WebSocket-Version`指定了`WebSocket`的协议版本。



```http
服务端
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: server-random-string
```

该响应代码101表示本次连接的HTTP协议即将被更改，更改后的协议就是`Upgrade: websocket`指定的WebSocket协议。



## 3.websocket实践

在**计网personnel篇章**中我们阐述了websocket的实现原理，websocket协议让服务端实现向客户端主动推送消息的功能，不再需要采用旧版Ajax轮询这种浪费资源的方式。

websocket基于http 1.1协议

来自客户端的握手形式

```http
GET ws://localhost/chat HTTP/1.1
Host: localhost
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==
Sec-WebSocket-Extension: permessage-deflate
Sec-WebSocket-Version: 13
```

- Upgrade表明是一个升级链接，升级为websocket
- `Sec-WebSocket-Key`是客户端采用base64位随机字符序列，服务器接收客户端HTTP协议升级的证明，用于标识该客户端，要求服务端响应一个对应的加密 `Sec-WebSocket-Accept`
- `Sec-WebSocket-Extension`协议拓展类型

来自服务端的握手形式

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: s3pPLMBiTxaQ9kYGzzhZRbK+xOo=
Sec-WebSocket-Extension: permessage-deflate
```



#### 客户端的实现

创建`websocket`对象

`var aWebSocket = new WebSocket(url [, protocols]);`

- `url`
  - 要连接的URL；这应该是WebSocket服务器将响应的URL。

- `protocols` 可选
  - 一个协议字符串或者一个包含协议字符串的数组。这些字符串用于指定子协议，这样单个服务器可以实现多个WebSocket子协议（例如，您可能希望一台服务器能够根据指定的协议（`protocol`）处理不同类型的交互）。如果不指定协议字符串，则假定为空字符串。

```js
// H5已经提供了websocket的API，可以直接使用
//这是人家websocket官方提供测试的url
let socket = new WebSocket('ws://echo.websocket.org')
```

**websocket事件**

| 事件    | 事件处理程序            | 描述                       |
| ------- | ----------------------- | -------------------------- |
| open    | websocket对象.onopen    | 建立连接时触发             |
| message | websocket对象.onmessage | 客户端接收服务端数据时触发 |
| error   | websocket对象.onerror   | 通信发生错误触发           |
| close   | websocket对象.onclose   | 连接关闭触发               |

**websocket方法**

`send()`方法，，用于给服务端发送数据

然后再浏览器调试可以看到我们发送成功了

![](/simple-blog/websocket/wsocket_send.png)

```js
//H5已经提供了websocket的API，可以直接使用
//这是人家websocket官方提供测试的url
let ws = new WebSocket('ws://echo.websocket.org');
// 1.连接成功的回调
ws.addEventListener('open', function () {
    console.log('连接成功');
})
// 2.主动给websocket发消息
button.addEventListener('click', function () {
    let val = input.value;
    ws.send(val)
})
// 3.接收websocket服务的数据，通过事件对象e可以得到服务端返回的数据
ws.addEventListener('message', function (e) {
    console.log(e);
    div.innerHTML = e.data;
})
```



#### 服务端的实现

这里我使用的是nodejs带的 [websocket包](https://github.com/sitegui/nodejs-websocket) 这个是该包对应的源码地点，里面有详解该包创建服务对象后，可以使用的方法）

```shell
npm install nodejs-websocket
```

在新建的nodejs服务器上使用

每一次只要有用户进行连接，就会执行该回调函数，**然后给当前用户创建一个connect对象**

```js
const ws = require("nodejs-websocket")
const server = ws.createServer(function (connect) {
    console.log("New connection")
    //text事件用于接收用户请求，data为用户发送的数据
    connect.on("text", function (data) {
        console.log("Received " + data)
        //服务器给客户端发送响应
        connect.sendText(data.toUpperCase() + "!!!")
    })
    //websocket连接断开（用户关闭网页等操作），执行的回调函数
    connect.on("close", function (code, reason) {
        console.log("Connection closed")
    })
    //一般使用注册close伴随着一个error事件，处理用户错误信息
    connect.on('error', () => {
        console.log('用户连接异常');
    })
    //监听端口5208
}).listen(5208, () => {
    console.log('app is running at port!');
})
```

给所有用户发送信息（广播）的方法 `broadcast`

```js
function broadcast(server, msg) {
    server.connections.forEach(function (conn) {
        conn.sendText(msg)
    })
}
```

然后在每个connect对象的事件里调用 `broadcast(msg)`即可，如果msg是一个对象，要将对象转化为字符串才能发送 `send(JSON.stringfy(msg))`



## 4.websocket框架

可以从上面看到，我们使用websocket时每一步事件都需要我们自己去封装，支持的时间太少，可能会比较麻烦，在应对搞复杂度的代码是会略显冗杂；

我们可以使用websocket框架 `socket.io` 进行替代 + 完善

说是说框架，但官方也解释了`socket.io`并不是websocket的一个实践，即使他在其中有使用到websocket的传输协议，但它作出了许多拓展，这就是为什么 WebSocket 客户端无法成功连接到 Socket.IO 服务器，而 Socket.IO 客户端也无法连接到普通 WebSocket 服务器的原因。（但在实现功能上，我们可以看成是一致的）

![](/simple-blog/websocket/socket_io.png)

附上官网 https://socket.io/



#### 服务端使用

```shell
npm install socket.io
```

在express中可以使用（官网还有在typescript、koa等语言框架中使用的方法）

```js
const app = require("express")();
const httpServer = require("http").createServer(app);   //以前我们使用原生nodejs创建服务器、发送请求调用过http包
const options = { /* ... */ };
const io = require("socket.io")(httpServer, [options]);
httpServer.listen(3000);
```

1.此时监听用户连接事件 `io.on("connection", socket => {})`

- socket 参数表示当前用户
- `socket.emit(事件名, 传入数据参数)`socket主动触发事件的方法
- `socket.on(事件名, 接收数据参数)`socket监听浏览器（客户端）/ 服务器 事件的方法
- 事件名参数是自定义的，该传递方式有点像Vue的事件总线（eventbus），实行订阅和发布消息数据

广播消息:   `io.emit`   `io.on`

```js
io.on("connection", socket => { 
    /* ... */ 
    socket.emit('send', {name:'Allen'});  //发送数据到客户端
});
```

2.此时监听用户断开事件 `io.on("disconnect", () => {})`

3.跨域问题

注意：在 `socket.io` 中使用 cors允许跨域时，必须在option选项里进行设置，不然会报错

```js
// socket 初始化
const io = require("socket.io")(server, { cors: true })
```



#### 客户端使用

安装

```html
<script  src = "/socket.io/socket.io.js" > </script> 
<script> const socket = io(); </script>
```

or

```shell
$ npm install socket.io-client
```

在同一个域通信

```js
const socket = io();
```

不同域通信

```js
const socket = io("服务器地址url");
```

相对服务端，客户端并不需要将监听和发布时间放在 `io.on("connection", () => {})`里面，直接在script/ js文件里使用 `socket.emit(事件名, 数据参数)` / `socket.on(事件名, 数据参数)`  来实施客户端的事件监听和发布

踩坑之路：

部署到服务器上时，url地址记得为协议名 + ip + 端口号





## 参考

[浅尝IM方案在H5活动场景中的应用](https://juejin.cn/post/7236915296962248760)