---
author: Hello
categories: 前端
title: Nodejs
description: 'Nodejs相关知识'
pinned: true
---

## 1.Node概述

Node.js是一个能够在服务器上运行JavaScript的环境

为什么选择node：

1.node使用JavaScript语法开发后端应用   

2.一些公司要求前端人员掌握Node开发   

3.生态系统活跃，有大量开源库

4.现有前端开发工具大多居于node开发

node是基于chrome V8引擎的JavaScript代码运行环境（浏览器也是JavaScript代码运行环境），源代码-→抽象语法树-→字节码-→JIT-→本地代码(V8引擎没有中间字节码)

在命令行工具中输入  `node -v`  即可查看nodejs是否安装成功

#### node.js和JavaScript的对比

JavaScript由3部分组成，ECMAScript+DOM+BOM，可以在不同浏览器的JS引擎上运行

Node.js仅在chrome使用的V8引擎上运行

由ECMAScript及Node环境提供的一些附加API组成的

- `ECMAScript`(语言基础，如：语法、数据类型结构以及一些内置对象)
- `os`(操作系统)
- `file`(文件系统)
- `net`(网络系统)
- `database`(数据库)

他们都使用了ECMAScript语法，只是分别向前后端的方向拓展了

#### 使用

在cmd命令符窗口中使用 `node xx.js` 即可完成（在执行文件的目录下按住shift+鼠标右键可快速进入当前目录的命令符窗口，然后配合tab键位快速打开）

也可以直接使用 `node`进行回车，可以直接供测试使用（核心模块可以直接用，不用require），类似于浏览器的console控制台



## 2.Buffer缓冲区

数组不能存储二进制文件，而buffer就是专门来存储二进制数据



`Buffer` 是原生二进制数据，不是字符串、数组或普通对象。

和字符串一样，`Buffer` 可以表示文本，但与字符串不同，它是以字节的形式存储和操作的。

和普通数组一样，`Buffer` 也可以存储多个元素，但这些元素是二进制数据（字节），并且它不像 JavaScript 数组那样支持动态扩展。



从结构上buffer非常像一个数组，他的元素为16进制的两位数

```js
var str = "hello, 艾伦";
var buf = Buffer.from(str);
console.log(buf.length);          //占用内存大小
console.log(str.length);          //字符串长度
var s = buf.toString();			 //将缓冲区的数据转换回字符串
var j = buf.toJSON();			 //将缓冲区的数据转换回json对象
```

buffer存储的数据都是二进制数据，但是显示的时候都是以16进制显示，范围是00 - ff（00000000 - 11111111），所以是8 bit （位），8 bit  = 1 byte （字节）（一个英文占一个字节，一个汉字占3个字节）

buffer 构造函数（new Buffer）不推荐使用

但是可以：使用`Buffer.alloc(size)`分配一个大小为size的新建Buffer

还有：`Buffer.allocUnsafe(size)`	 创建一个指定大小的buffer，但是buffer可能含有敏感数据（分配时未清空上一次使用内存存放的数据，但是性能够好）

Buffer的大小一旦确定，则不能修改，Buffer实际上是对底层内存的直接操作

可以通过索引操作buffer中的元素 `buf[0] = 88` 这里的88是16进制，然后再控制台console.log进行输出时，显示的是10进制（只要数字在控制台输出一定是10进制）



## 3.文件系统fs

通过node操作系统中的文件，在Node中，与文件系统的交互是非常重要的，服务器的本质就将本地文件发送给远程客户端，该模块提供了一些标准文件访问api来打开，读取，写入文件，以及与其交互

引入fs模块，fs是核心模块，直接引用不用下载

fs模块中所有的操作都有两种形式可供选择：**同步和异步**  

同步文件系统会阻塞程序的执行，也就是除非操作完毕，否则不会向下执行代码（顺序执行）

异步文件系统不会阻塞程序的执行，而是在操作完成时（异步都有callback）（异步方法不可能有返回值）通过回调函数结果返回

fs中带Sync的的方法是同步方法，不带Sync的方法是异步方法



#### 文件打开

同步文件打开

`fs.openSync(path, flags[, mode])`

​	`-path` 打开的文件路径	

​	`flags` 打开文件操作类型  比如 `r` 只读的、  `w` 可写的

​	`mode` 操作权限 ，一般省略

该方法会返回一个文件描述符作为结果，我们可以通过该描述符来对文件进行各种操作

异步文件打开

`fs.open(path, flags[, mode], callback)`

​	`callback`不能省略

​		回调函数中有两个参数

​			`err`  错误对象 没有错误则为null

​			`fd`  文件描述符

无返回值





#### 文件写入

同步文件写入

`fs.writeSync(fd, string[, position[, encoding]])`

​	fd文件描述符，需要传递要写入的文件的描述符

​	string写入内容

​	position起始位置，一般省略

​	encoding 默认utf-8

异步文件写入（写在fs.open的回调函数里）

`fs.write(fd, string[, position[, encoding]], callback)`

​	当前回调有三个参数

​		`err`

​		`written`

​		`string`



#### 关闭文件

服务器是持续运行的，不想我们平时运行的文件，结束后自动释放空间

`fs.closeSync(fd)`

​	fd文件描述符，需要传递要写入的文件的描述符

`fs.close(fd, callback)`

​	异步，完成回调只有一个可能的异常参数



#### 简单文件写入（常用）

一步搞定，省略打开，关闭

`fs.writeFile(file, data[, options], callback)`

`fs.writeFileSync(file, data[, options])`

​	file 要操作文件的路径

​	data 要写入的数据

​	option 选项，可选，对写入进行配置：有encoding（默认utf-8）、mode（权限）、flag（文件操作形式，默认`w`，如果内容不存在则创建，存在则截断）

​	callback 当写入完成以后执行的函数

```js
var fs = require("fs");
fs.writeFile("index.txt", "aaa", function (err) {
    if (!err) {
        console.log("写入成功！");
    }
    else {
        console.log("error!");
    }
});
```



#### Stream流

Stream流是一个抽象的接口，在nodejs当中，很多方法，对象，他们都实现了这个接口，例如之前创建一个服务，向服务器发送一个请求，request对象，他其实就是一个流（流简单粗暴的理解就是在线看电视）

在nodeJS中，Stream有四种流类型：

​	Readable -可读操作

​	Writable -可写操作

​	Duple -可读可写操作

​	Transform -操作被写入数据，然后读出结果

所有的Stream对象都是EventEmitte（events模块）r的实例

常用事件：

​	-data 当有数据可读取时触发

​	-end 没有更多数据可读取时触发

​	-error 在接收和写入过程中，发生错误时触发

​	-finish 所有数据已经被写入之后触发

流式读取文件的方法在 **5.文件系统fs**中



#### 流式文件写入

同步、异步、简单文件的写入，都不大适合大文件的写入（都是一次写入），性能较差，容易导致内存溢出

而流式文件的传输相当于两个水池之间插入一条管道，持续的多次的写入

它本质上也是一个异步

创建一个可写流，参数功能和之前的文件读写相同

`var ws = fs.createWriteStream(path [, option])`

```js
var fs = require("fs");
var ws = fs.createWriteStream("index.txt");
// 监听文件的打开和关闭
ws.once("open", function () { //once为对象绑定一个一次性的事件，jQuery也有出现过类似的one
    console.log("流打开了");
});
ws.once("close", function () {
    console.log("流关闭了");
});
ws.write("通过可写流写入文件的内容");
ws.write("啊大苏打");
ws.write("大撒大撒");
//不再有数据写入 Writable
ws.end();

//在调用 stream.end() 方法之后，并且所有数据都已刷新到底层系统，则触发 'finish' 事件，一定在前面要有end事件。
ws.on('finish' () => {
    console.log('写入完成')
})

// 关闭流，关闭流入口
// ws.close();  当前版本也可以了（关闭流出口）
```



#### 文件读取（all kinds）

这里只讲讲简单文件读取和流式文件读取

简单文件读取（参数功能同上），读取文件内容

`fs.readFileSync(path [, options])`

`fs.readFile(path [, options], callback)`

​	callback回调函数参数 （err, data）

​		`err` 错误对象

​		`data`  读取到的数据，会返回一个Buffer

流式文件读取

它也适合一些比较大的文件，可以分多次将文件读取到内存中

创建一个可读流：

`fs.createReadStream(path)`

如果要读取一个可读流的数据，必须要为可读流绑定一个data事件，data事件绑定完毕，它会自动开始读取数据，然后读取到的数据存放在参数中返回（它的参数没有err，因为事件触发后就意味着不会再出错了）

```js
var fs = require("fs");
var rs = fs.createReadStream("cool.jpg");
var ws = fs.createWriteStream("copy.jpg")
// 监听
rs.once("open", function () {
    console.log("可读流打开了");
});
rs.once("close", function () {
    console.log("可读流关闭了");
    // 数据读取完毕，关闭可写流
    ws.end();
});
ws.once("open", function () {
    console.log("可写流打开了");
});
ws.once("close", function () {
    console.log("可写流关闭了");
});
// 开始读取
rs.on("data", function (data) {  //将数据读到data中
    // 将读取的数据写入可写流中
    ws.write(data);
})
```

流式文件原本需要data方法进行读取，但是有个更方便的方法：

将可读流和可写流管道相通，形成管道流，用了 `pipe()` 的方法

改：

```js
// 开始读取
/*
rs.on("data", function (data) {  //将数据读到data中
    // 将读取的数据写入可写流中
    ws.write(data);
})*/
// 开始读取
rs.pipe(ws);
```

**文件读取配合文件写入，可完成文件的传输**

服务器就是接收用户的请求，并返回响应，而请求和响应就是数据流



#### fs其他方法

`fs.existsSync(path)` 是否存在

`fs.stat(path, callback)` 文件状态（里面包含文件大小等信息）

`fs.readdir(path, [, option], callback)` 读取文件目录列表（用于读取目录中的文件和子目录的名称。）

`fs.rename( oldPath, newPath, callback )`  方法用于文件的异步重命名，将其从指定的旧路径移动到指定的新路径。如果新路径中已存在文件，则作将覆盖该文件。

`fs.copyFile( src, dest, mode, callback )` 用于将文件从源路径异步复制到目标路径。默认情况下，如果文件已存在于给定目标中，则 Node.js 将覆盖该文件。可选的 mode 参数可用于修改复制作的行为。

- ***\*src：\****它是一个 String、Buffer 或 URL，表示要复制的源文件名。
- ***\*dest：\****它是一个 String、Buffer 或 URL，表示复制作将创建的目标文件名。

`fs.access(tempFile)`:

- 作用：测试文件是否存在及权限
- 使用场景：在清理临时文件前，先检查文件是否存在
- 特点：如果文件不存在或没有权限，会抛出错误

`fs.unlink(tempFile)`:

- 作用：删除文件
- 使用场景：用于清理临时文件
- 特点：永久删除文件，不可恢复

![](/simple-blog/Nodejs/readdir.png)

```js
const fs = require('fs');
const path = require('path');

const dirPath = path.join(__dirname, '头冠125');

fs.readdir(dirPath, (err, files) => {
    if (err) {
        return console.error('无法读取目录:', err);
    }

    files.forEach((file) => {
        if (path.extname(file) === '.png') {
            const oldPath = path.join(dirPath, file);
            const newFileName = `new_${file}`; // 修改这里以更改文件名的格式
            const newPath = path.join(dirPath, newFileName);

            fs.rename(oldPath, newPath, (err) => {
                if (err) {
                    return console.error('重命名失败:', err);
                }
                console.log(`重命名: ${file} -> ${newFileName}`);
            });
        }
    });
});
```

`fs.truncateSync(path, size)`  截断文件，将文件修改为指定大小

`fs.lstatSync( path, options )` 它返回一个fs.Stats对象，其中包含符号链接的详细信息。

- 用 fs.Stats 还能判断是否是个文件：

  ```ts
  const stat = fs.lstatSync(path.join(dirPath, item));
  if (stat.isFile()) {
    //...
  }
  ```

  



#### 链式流

就是从一个输出流当中，读取数据，创建多个流来操作这个输出流数据的机制

链式流一般来操作管道流

常见的例子就是压缩和解压缩的例子

```js
// 链式流
var fs = require('fs');
var zlib = require('zlib');
// 压缩文件
fs.createReadStream('cool.jpg')
    .pipe(zlib.createGzip())
    .pipe(fs.createWriteStream('cool.jpg.gz'));
console.log("解压完毕！！！");
```

```js
// 链式流
var fs = require('fs');
var zlib = require('zlib');
// 解压缩
fs.createReadStream('cool.jpg.gz')
    .pipe(zlib.createGunzip())
    .pipe(fs.createWriteStream('copy2.jpg'));
console.log("解压缩完毕！！！");
```





## 4.创建服务

1.先引入模块(Nodejs本身提供了http模块)

`var _http = require('http');`

#### 创建服务器

`http.createServer([options][, requestListener])`

request监听事件需要接收两个参数，Request请求对象（获取客户端请求信息），Response响应对象（用来给客户端发送响应消息）

再创建服务器的回调函数里添加http头部信息，然后向客户端发送数据

#### 响应对象

1.响应对象`response`添加信息：`response.writeHead(statusCode[, statusMessage][, headers])`

​	`statusCode` 为状态码

​    `headers`为响应头
   	 text/plain:纯文本
   	 text/html: 可识别为html标签的文本

​		charset=utf-8:防止中文乱码（服务器默认发送数据时utf8，但是浏览器不知道你是utf8，它会默认按照当前操作系统的编码去解析）

 `response.setHeader(name, value)`也可以写响应头

（writeHeader可以设置http返回状态码，多个http响应头。但是setHeader只针对单一属性的设置。）

2.响应对象`response`发送数据，并且结束响应（end）：

`response.end("第一个http服务");`   （当然也可以`response.write("xxx");`  `response.end()`）

注意：响应内容只能是二进制数据或字符串（Buffer或String）

```js
var _http = require('http');
// 创建服务器
_http.createServer(function (request, response) {
    // http头部信息
    response.writeHead(200, { 'Content-type': 'text/plain;charset=utf-8' });
    // 向客户端发送数据，并且结束响应（end）
    response.end("第一个http服务");
}).listen(5205);    //自己设置监听的端口号最好不要用8888，8080，可能会被电脑其他应用占用，容易报错
console.log("5205已经创建!");
```

绑定端口号也可以直接给实例绑定：

​	`var server = http.createServer(){}`

​	`	server.listen(端口号, callback)`

此时打开本地浏览器，local:host5205即可查看访问

##### response的重定向

通过服务器让客户端重定向

状态码设置302临时重定向  `statusCode`

在响应头通过location告诉客户往哪重定向   `setHeader`

客户端发现收到服务器的响应状态码为302，就会自动去响应头找location，然后对该地址发起新的请求  

所以你就能看到客户端自动跳转（这里是跳转至首页）

```js
//接收表单数据后（get），进行跳转，跳转至首页
var comment = url.parse(req.url, true).query;
comments.unshift(comment);    //从头部增加数组元素，comments为数组变量
res.statusCode = 302;
res.setHeader('Location', '/'); //响应头的Loacation路径设置为  '/'  即首页
res.end();
```



#### url.parse()(弃用)

url.parse(urlString , [boolean](https://so.csdn.net/so/search?q=boolean&spm=1001.2101.3001.7020) , boolean)

parse这个方法可以将一个url的字符串解析并返回一个url的对象。

- 第一个参数传入一个url地址的字符串

- 第二个参数（可省）传入一个布尔值，默认为false，为true时，返回的url对象中，query的属性为一个对象。

- ```js
  // url.parse("http://user:pass@host.com:8080/p/a/t/h?query=string#hash");
  // return：
  {
    protocol: 'http:',
    slashes: true,
    auth: 'user:pass',
    host: 'host.com:8080',
    port: '8080',
    hostname: 'host.com',
    hash: '#hash',
    search: '?query=string',
    query: 'query=string',
    pathname: '/p/a/t/h',
    path: '/p/a/t/h?query=string',
    href: 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash'
   }
  ```

现在被弃用之后，改用新的API `WHATWG URL API`（无需导包，直接使用）

```js
const myURL = new URL('http://user:pass@host.com:8080/p/a/t/h?query=string#hash');
console.log(myURL);
```

直接返回

```js
URL {
  href: 'http://user:pass@host.com:8080/p/a/t/h?query=string#hash',
  origin: 'http://host.com:8080',
  protocol: 'http:',
  username: 'user',
  password: 'pass',
  host: 'host.com:8080',
  hostname: 'host.com',
  port: '8080',
  pathname: '/p/a/t/h',
  search: '?query=string',
  searchParams: URLSearchParams { 'query' => 'string' },
  hash: '#hash'
}
```



#### 请求对象 | 数据获取

1.请求路径为： `request.url`, url：统一资源定位符

路径优化问题：

```js
var http = require('http');
const url = require('url')
var fs = require('fs');
var wwwDir = 'C:/Users/ok-pc/blog/source/_posts';  //文件路径
http.createServer(function (req, res) {
    var url = = url.parse(req.url, true).pathname
    var filePath = '/index.html';
    if (url !== '/') {
        filePath = url;
    }
    fs.readFile(wwwDir + filePath, function (err, data) {
        if (err) {
            return res.end('404');
        } else {
            res.end(data);
        }
    })
})
```

get请求数据：

```js
http.createServer(function (req, res) {
	console.log(new URL(req.url, true).query)
})
```

post请求数据：(因为post是以流的方式传过来的)

```js
function (request, response) {
    if (request.method == 'POST') {
        var body = '';
        request.on('data', function (data) {
            body += data;

            // Too much POST data, kill the connection!
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (body.length > 1e6)
                request.connection.destroy();
        });

        request.on('end', function () {
            var post = qs.parse(body);
            // use post['blah'], etc.
        });
    }
}
```



#### ip地址与端口

所有联网的程序都需要网络通信，计算机只有一个物理网卡，网卡的地址是唯一的（ip地址）

端口号用来定位具体应用程序（类似银行窗口号，服务器类似于银行）

一切需要联网通信的软件都会占用一个端口号

端口号在 0 - 65536 之间

在计算机中有一些默认端口号，最好不要去使用 例如http服务的80

可以同时开启多个服务，但是一定要确保不同服务占用端口号不一致（在一台计算机中，同一端口号同一时间只能被一个程序占用）



#### 处理静态资源

浏览器收到html响应内容之后，就要开始从上到下进行解析，当在解析过程中，如果发现：

link    script

img    iframe

video   audio

等带有src 或者 href（link）属性标签的时候（具有外链资源的时候），浏览器会自动对这些资源发起新的请求

我们为了方便统一处理这些静态资源，所以约定把所有静态资源存放在public目录中，即如果请求路径以 `/public/`开头，则认为你是要获取public的某个资源，所以我们这时可以直接把请求路径当作文件路径进行读取

这时哪些资源能否被用户访问可以达到一个可控的状态

（注意：在服务端中，文件的路径就要要写相对路径了，因为这个时候所有资源都是通过url标识来获取，这里服务器开放了/public/目录，所以这里请求路径写成 /public/xxx）

html中的link ：`<link rel="stylesheet" href="/public/lib/bootstrap/dist/css/bootstrap.css">`

nodeJs代码：

```js
var http = require('http');
var fs = require('fs');
var rg = /^\/public\//;
http.createServer(function (req, res) {
    var url = req.url;
    if (url === '/') {
        fs.readFile('./views/index.html', function (err, data) {
            if (err) {
                return res.end('404 Not Found.');
            }
            res.end(data);
        })
    } else if (rg.test(url)) {   //  如  ：/public/lib/bootstrap/dist/css/bootstrap.css
        // url.indexOf('/public/') === 0也可以
        fs.readFile('.' + url, function (err, data) {
            if (err) {
                return res.end('404 Not Found.');
            }
            res.end(data);
        });
    }
}).listen(5208, function () {
    console.log('running!!...');
});
```





## 5.事件

nodeJs它基本上，所有事件机制，都是基于设计模式种“观察者模式”来实现的

简单来说，nodejs使用事件驱动的模型，每当接收到一个请求，就把他关掉进行处理，当这个请求完成，就把它放到处理队列当中，最后把结果返回给用户

因为它的服务一直是处理接收请求，但不等待任何读写操作，所以性能很高，这也叫做“非阻塞式IO或是事件驱动IO”

nodeJS事件使用events模块，通过实例化它里面的EventEmitter类来绑定和监听事件，也是利用了“发布订阅模式”

使用事件模块：`var eve = require('events')`

实例化EventEmitter类：`var event = new eve.EventEmitter()`

​	实例化对象里有个_eventsCount属性，显示绑定事件数量

（也可以： `var eventEmitter = require('events').EventEmitter;`

​                    ` var event = new eventEmitter();` ）

绑定事件：`event.on(事件名, callback)`（jquery也用on绑定事件）

​	事件名可以自定义，因为这里的事件名完全不同于浏览器上的各种事件，这里的事件名就是一个“标识”，实际上绑定了一个回调函数

监听事件的触发：`event.emit(事件名)`

```js
// 绑定一个事件
event.on('one', function () {
    console.log("no.1事件被触发了");
});
// 触发一个事件
event.emit('one');
```



所有nodejs里面的异步io操作，都会在完成时，发送一个事件到事件队列





## 6.模板引擎

最早诞生于服务器领域，后来发展到前端

官方文档：https://aui.github.io/art-template/

#### 安装

`npm install art-template`

#### 浏览器应用

引入 `<script src="./node_modules/art-template/lib/template-web.js"></script>`

类型改为 `type = "text/template"`

模板引擎不关心字符串内容，只关心自己能认识的模板标记语法，例如(包含if语句判断) 

```
{{ 变量名 }}

{{ if user }}  
{{ else }}
{{ /if }}
```

```
{{ each 遍历数组 }}
<li>{{ $index + 1 }}</li>
<li>{{ $value }}</li>
{{/each}}
```

该语法被称之为mustache语法，八字胡

`template('script 标签 id', {对象})`

```js
 <script src="./node_modules/art-template/lib/template-web.js"></script>
<script type="text/template" id="tql">
    hello{{ name }}
	今年 {{ age }} 岁了		
</script>
<script>
    var ret = template('tql', {
        name: 'jack',
        age: 18
    })
	console.log(ret);
	document.querySelector('#表单id号').innerHTML = ret;
</script>
```



#### nodejs应用

核心方法

引入： `var template = require('art-template');`

基于模板名渲染模板
`template(filename, data);`

将模板源代码编译成函数
`template.compile(source, options);`

将模板源代码编译成函数并立刻执行
`template.render(source, data, options);`

```js
var ret = template.render('hello {{ name }}', {
	name: 'Jack'
})
```



## 7.Path

Path是一个核心模块 `var path = require('path')`

`path.basename(path[,ext])` 获取给定路径当中文件名部分，第二个参数可以用来去除指定的后缀名

```js
console.log(path.basename('c:/a/b/c/index.js'));          //index.js
console.log(path.basename('c:/a/b/c/index.js', '.js'));   //index
console.log(path.basename('c:/a/b/c/index.js', '.html')); //index.js
```

`path.dirname(path)` 方法会返回 `path` 的目录名

`path.extname(path)` 返回 `path` 的扩展名

```js
console.log(path.extname('c:/a/b/c/index.html'););        //.html
```

`path.isAbsolute(path)` 检测 `path` 是否为绝对路径。('./c/index.js'是相对路径， '/c/index.js'是绝对路径)

`path.join([...paths])`  方法会将所有给定的 `path` 片段连接到一起，生成规范化路径

```js
path.join('/目录1', '目录2', '目录3/目录4', '目录5');
//        \\目录1\\目录2\\目录3\\目录4\\目录5'
```

`path.resolve([from...],to)` 把一个路径或路径片段的序列解析为一个绝对路径，有点像join，但是解析结果一定是绝对路径

更多知识点可查看nodejs官方文档的Path部分



在文件操作路径中，使用相对路径是不可靠的，因为相对路径设计就是相对于执行node 命令所处的路径，

所以我们要利用好（以下在node中为全局变量，直接用）

 `__filename` 当前模块的完整路径

`__dirname` 当前模块所在文件夹完整路径（所属目录的绝对路径）

配合Path进行操作（比如拼接路径过程中，防止手动拼接带来低级错误，可以使用`path.join`），把相对路劲变成绝对路径（注意是动态绝对路径）就好了

```js
//express框架公开指定目录
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')));
```

**特殊** ：模块中的路径标识（比如：`require('./a.js')`）是相对于当前文件模块，不受到node命令所处路径影响





#### 判断拓展名

如果你想判断文件扩展名是否属于某个类型（例如 `.jpg`, `.png`, `.txt` 等），可以通过 `path.extname()` 获取扩展名后进行判断：

#### 示例代码：

```js
const path = require('path');

function isImageFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif';
}

console.log(isImageFile('/path/to/image.jpg'));  // 输出: true
console.log(isImageFile('/path/to/file.txt'));  // 输出: false
```



## 8.其他

进程为我们程序的运行提供一个必备的环境（**进程是资源分配的最小单位**）

线程是计算机中最小的计算单位，线程负责执行保存到进程中的程序（**线程是CPU调度的最小单位**）

JS、浏览器、nodejs是单线程

#### 修改完自动重启服务器

我们这里可以使用一个第三方工具：`nodemon`来帮我们解决修改代码重启服务器问题

```powershell
#--global 来安装则可以在任意目录执行
npm install --global nodemon
```

原来我们在命令行输入：`node xxx.js`

现在：`nodemon xxx.js`， 他会监视你的文件变化，当文件变化时，会自动帮你重启服务器        



#### JSON方法

`JSON.stringify()` 方法将一个 JavaScript 对象或值转换为 JSON 字符串，如果指定了一个 replacer 函数，则可以选择性地替换值，或者指定的 replacer 是数组，则可选择性地仅包含数组指定的属性。

一般用于存储数据时，对对象之类数据以字符串的形式进行保存



`JSON.parse()` 方法用来解析JSON字符串，构造由字符串描述的JavaScript值或对象。提供可选的 **reviver** 函数用以在返回之前对所得到的对象执行变换(操作)。

一般用于将数据取出时，转化未真正的类型调用的方法



还有手写方法可以参考一波https://juejin.cn/post/6844903992871354375



#### 使用node.js进行爬虫

原理：当网页时后端渲染时，对网页源代码进行爬取，得到其html源码

第一步：

使用 `npm init --yes`初始化创建的文件夹

下载依赖包  `npm i superagent cheerio`

- superagent: 是一个轻量的Ajax API，和axios差不多，只不过他不支持浏览器
- cheerio：为服务器特别定制的快速灵活jQuery，它并*不会*产生视觉呈现，应用CSS，加载外部资源，或者执行JavaScript，可以用来从网页css selector取数据，使用方法和jQuery一样
  - 如果你不想用cheerio，就自己一个一个正则匹配去吧！（= = ）

第二步：

通过 superagent & cheerio获取网页数据（后端渲染）

数据处理，可以使用正则表达式，字符串切割，或者`eval()` 函数（可计算某个字符串，并执行其中的的 JavaScript 代码。）

第三步：

写入本地

```js
superagent.get('https://ncov.dxy.cn/ncovh5/view/pneumonia').then(res => {
  // 浏览器可以解析代码，node端直接返回源码,而res.text是我们需要的响应数据
  const $ = cheerio.load(res.text);    //经测试，superagent的res.text = axios的res.data
  const $getAreaStat = $('#getAreaStat').html();
  // 加入全国疫情数据
  let data = {};
  eval($getAreaStat.replace(/window/g, 'data'));  //执行里面的语句，使得data成功被赋值
  console.log(data);
  // 字符串转换json
  fs.writeFile(path.join(__dirname, './data.json'), JSON.stringify(data), err => {
    if (err) throw err;
    console.log("写入成功！！！");
  })
}).catch(err => {
  throw err;
})
```

如果是爬取到原网页后，对网页标签里的数据进行获取，可以使用

里面的使用和jQuery使用一样，可以使用`each`方法遍历

```js
const $ = cheerio.load(res.text);
const inner = $('#home .col a').text();//在外层是id为home，里面类名为col标签内里的a标签
$('#home .col a').each((index, ele) => {
    console.log($(ele))
    console.log($(ele).attr("属性名"))
    console.log($(ele).text())
})
```



#### nodejs log

nodejs在终端上log对象的美化工具：

```js
const express = require('express')
const pino = require('pino')
const app = express()

const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
          colorize: true
        }
    },
})


app.listen(3000, () => {
    console.log('app is running at port!');
})

app.use(express.json())
app.use(express.text())

app.post('/', function (req, res) {
    logger.info(JSON.parse(req.body))
})

```



## 9.process

```js
const process = require('process');
```



获取当前目录

`process.cwd()`

`process.cwd()`与`__dirname`的区别

`process.cwd() `是当前执行node命令时候的文件夹地址 ——工作目录，保证了文件在不同的目录下执行时，路径始终不变
__dirname 是被执行的js 文件的地址 ——文件所在目录



区别例子：

假设有以下目录结构：

```
/project
  /src
    app.js
  /data
    file.txt
```

在 `app.js` 中，如果你使用 `__dirname`：

```
javascript


复制代码
console.log(__dirname);
```

输出将是 `/project/src`，因为 `app.js` 文件位于 `src` 目录。





- `process.cwd()` 是 Node.js 中的一个方法，表示当前 Node.js 进程的工作目录（Current Working Directory，简称 CWD）。
- 它返回的是你在命令行中启动 Node.js 进程时所在的目录路径，而不是文件所在的目录。

**例子**：

假设你从 `/project` 目录运行 `node src/app.js`，然后在 `app.js` 中使用 `process.cwd()`：

```
console.log(process.cwd());
```

输出将是 `/project`，因为你是在 `/project` 目录下运行该命令的。



| 特性     | `__dirname`                        | `process.cwd()`                    |
| -------- | ---------------------------------- | ---------------------------------- |
| 返回值   | 当前文件的目录路径                 | 当前 Node.js 进程的工作目录路径    |
| 影响因素 | 取决于当前文件的位置               | 取决于执行 `node` 命令时的工作目录 |
| 使用场景 | 用于处理当前模块文件的位置相关逻辑 | 用于获取当前工作目录相关的路径     |



## 10.推荐的node库

**[node-fs-extra](https://github.com/jprichardson/node-fs-extra)**：`fs-extra` adds file system methods that aren't included in the native `fs` module and adds promise support to the `fs` methods. It also uses [`graceful-fs`](https://github.com/isaacs/node-graceful-fs) to prevent `EMFILE` errors. It should be a drop in replacement for `fs`.



## 11.util模块

`util` 是 Node.js 的一个内置模块（built-in module），它提供了一系列实用工具函数，主要用于支持 Node.js 的内部 API 的需求，但同时也可以被开发者使用。

在我们的代码中使用的 `promisify` 是 `util` 模块中最常用的函数之一。它的主要作用是：

1. 将遵循 Node.js 回调风格（error-first callback style）的函数转换为返回 Promise 的函数
2. 让我们可以使用 async/await 语法来处理异步操作，而不是使用回调函数

例如，我们代码中的这行：

```typescript
import { promisify } from 'util';
const execFileAsync = promisify(execFile);
```

这里将 `child_process.execFile` 从回调风格：

```typescript
// 回调风格
execFile('pngquant', ['input.png'], (error, stdout, stderr) => {
    if (error) {
        console.error('执行失败:', error);
        return;
    }
    console.log('执行成功:', stdout);
});
```

转换为 Promise 风格：

```typescript
// Promise 风格
try {
    const { stdout, stderr } = await execFileAsync('pngquant', ['input.png']);
    console.log('执行成功:', stdout);
} catch (error) {
    console.error('执行失败:', error);
}
```

`util` 模块还提供了很多其他实用函数，比如：

- `util.inspect()`: 用于调试和检查对象
- `util.types`: 用于类型检查
- `util.format()`: 格式化字符串
- `util.inherits()`: 实现类继承（虽然现在更推荐使用 ES6 的 class 语法）
- `util.deprecate()`: 将函数标记为废弃

由于是 Node.js 的内置模块，使用时不需要安装任何依赖，直接 import 即可。不过需要注意的是，这个模块主要用于 Node.js 环境，在浏览器环境中是不可用的。





## 12.child_process

`child_process` 是 Node.js 的核心模块之一，用于创建子进程

#### `execFile` 方法

`child_process.execFile(file[, args][, options][, callback])` 

- file 执行的命令
- args 该命令携带的参数

```typescript
import { execFile } from 'child_process';
import { promisify } from 'util';

// 回调方式
// 执行的命令为：ls -l
execFile('ls', ['-l'], (error, stdout, stderr) => {
  if (error) {
    console.error('执行错误:', error);
    return;
  }
  console.log('输出:', stdout);
});

// Promise 方式（使用 util.promisify）
const execFileAsync = promisify(execFile);
const { stdout } = await execFileAsync('ls', ['-l']);
```

特点：

- 直接执行可执行文件
- 不会启动额外的 shell
- 适合执行已知的可执行文件
- 输出会被缓存，直到进程结束才一次性返回
- 有最大输出限制（默认 1MB）



#### execFile的限制输出

这个限制与输入文件（如图片）的大小无关。

让我详细解释：

这个限制影响的是什么：

```typescript
// 例如执行这样的命令
execFile('some-command', ['--verbose'], (error, stdout, stderr) => {
    // stdout 和 stderr 的总大小不能超过 1MB
    console.log(stdout);
});
```

如何修改这个限制：

```typescript
execFile('some-command', ['--verbose'], {
    maxBuffer: 1024 * 1024 * 10  // 设置为 10MB
}, (error, stdout, stderr) => {
    console.log(stdout);
});
```

在图片压缩场景中：

- ✅ 可以处理任意大小的输入图片文件
- ✅ 可以生成任意大小的输出图片文件
- ❌ 只限制命令的输出信息大小

例如：

```typescript
// 这段代码可以处理任意大小的图片
await execFileAsync(this.pngquantPath, [
    '--quality', `${quality}-${quality}`,
    '--force',
    '--output', tempFile,  // 输出文件大小不受限制
    input  // 输入文件大小不受限制
]);
```

因为：

1. 图片文件是通过文件路径传递的，不是通过进程的标准输出流
2. pngquant 等工具的标准输出通常很小，主要是进度信息或错误信息
3. 实际的图片数据是直接写入到输出文件的，不经过进程间通信

如果你确实需要处理大量命令输出，有几种选择：

1. 增加 maxBuffer：

```typescript
execFile('command', [], { maxBuffer: 1024 * 1024 * 10 }, callback);
```

1. 使用 spawn 代替：

```typescript
import { spawn } from 'child_process';

const process = spawn('command', []);
process.stdout.on('data', (data) => {
    // 可以处理任意大小的输出
    console.log(data.toString());
});
```

但在我们的图片压缩场景中，不需要担心这个限制，因为：

1. 压缩工具的输出很少（通常只有进度信息和错误信息）
2. 实际的图片数据是通过文件系统处理的
3. 我们主要关注的是命令的成功/失败状态，而不是它的详细输出



#### `spawnSync` 方法

```typescript
import { spawnSync } from 'child_process';

const result = spawnSync('ls', ['-l']);
console.log('输出:', result.stdout.toString());
```

特点：

- 同步版本，会阻塞事件循环
- 直接返回结果，不需要回调或 Promise
- 可以处理大量输出
- 可以实时获取输出流



`child_process` 模块的其他重要方法：

- `spawn`: 异步版的 spawnSync，适合长时间运行的进程
- `exec`: 类似 execFile，但会启动 shell
- `fork`: 专门用于运行 Node.js 模块的特殊方法



#### spawnSync和execFile的对比

```typescript
// execFile 示例 - 适合简单的命令执行
const compressImage = async (input: string, output: string) => {
  try {
    await execFileAsync('pngquant', [
      '--quality', '80',
      '--output', output,
      input
    ]);
    console.log('压缩完成');
  } catch (error) {
    console.error('压缩失败:', error);
  }
};

// spawnSync 示例 - 适合需要详细控制的场景
const compressImageSync = (input: string, output: string) => {
  const result = spawnSync('pngquant', [
    '--quality', '80',
    '--output', output,
    input
  ]);
  
  if (result.error) {
    console.error('压缩失败:', result.error);
    return;
  }
  
  if (result.status !== 0) {
    console.error('压缩失败，退出码:', result.status);
    console.error('错误输出:', result.stderr.toString());
    return;
  }
  
  console.log('压缩完成');
};
```

一般我们使用 `execFile` 的原因：

- 命令执行时间短
- 输出数据量小
- 需要异步执行以不阻塞主线程
- 不需要实时处理输出流
- 错误处理简单直接

如果你的使用场景是：

- 需要处理大量输出：使用 `spawn` 或 `spawnSync`
- 需要执行 shell 命令：使用 `exec`
- 需要同步执行：使用 `spawnSync`
- 需要运行 Node.js 代码：使用 `fork`
- 需要简单执行程序：使用 `execFile`

在图片处理，在图片压缩中，`execFile` 是最合适的选择，因为：

1. 图片压缩命令执行时间较短
2. 不需要处理命令的实时输出
3. 错误处理相对简单
4. 异步执行不会阻塞主线程
