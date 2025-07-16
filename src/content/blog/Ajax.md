---
author: Hello
categories: 前端
title: Ajax
description: 'fetch相关'
---

## 1.Ajax概述

它最大的特点是可以在网页不刷新的情况下向服务端http请求，然后得到http响应

它全称为 Asynchronous JavaScript And XML，就是异步的JS和XML，通过Ajax可以在浏览器中向服务器发送异步请求，最大优势：**无刷新获取数据**。AJAX不是新的编程语言，而是一种将现有标准组合在一起使用的新方式 

Ajax在应用当中需要一个服务端，可以选择nodejs来配合使用



#### XML简介

XML可扩展标记语言，是被设计用来传输和存储数据的，它和html很像，它们不同的是html中都是预定义标签，而xml没有预定义标签，全是自定义标签，用来表示一些数据

最开始ajax在进行数据交换的时候，所使用的格式就是XML

但是现在ajax都是使用json了，json相对xml更为简洁，而且在数据转换这块比较容易，可以借助json的一些api方法，快速将字符串转成js对象，灵活度远胜XML



#### XML和HTML

这初看起来很奇怪：HTML 和 XML 非常相似。有很多 XML 解析器可以使用。HTML 存在一个 XML 变体 (XHTML)，那么有什么大的区别呢？

区别在于 HTML 的处理更为“宽容”，它允许您省略某些隐式添加的标记，有时还能省略一些起始或者结束标记等等。和 XML 严格的语法不同，HTML 整体来看是一种“软性”的语法。

显然，这种看上去细微的差别实际上却带来了巨大的影响。一方面，这是 HTML 如此流行的原因：它能包容您的错误，简化网络开发。另一方面，这使得它很难编写正式的语法。概括地说，HTML 无法很容易地通过常规解析器解析（因为它的语法不是与上下文无关的语法），也无法通过 XML 解析器来解析。



#### Ajax特点

优点：

1.可以无需刷新而与服务器端进行通信（提高用户体验）

2.允许根据用户事件来更新部分页面内容

缺点

1.没有浏览记录，不能回退

2.存在跨域问题（同源）

3.SEO不友好（搜索引擎优化）（源代码（响应体）没有部分商品信息，那些商品信息都是ajax向服务端发请求，通过服务端返结果，然后js动态创建到页面，所以爬虫也爬不到商品数据）



#### Ajax原理

Ajax请求数据流程最核心的依赖是浏览器提供的XMLHttpRequest对象，它扮演的角色相当于秘书，使得浏览器可以发出HTTP请求与接收HTTP响应。浏览器接着做其他事情，等收到XHR返回来的数据再渲染页面。





## 2.原生ajax的get/post请求

先在script绑定事件对象

1. 创建对象（控制平台中network也有XHR，它是对ajax请求做一个筛选）

   `XMLHttpRequest`（XHR）对象用于与服务器交互，是BOM的范畴内。通过 XMLHttpRequest 可以在不刷新页面的情况下请求特定 URL，获取数据。这允许网页在不影响用户操作的情况下，更新页面的局部内容。`XMLHttpRequest` 在 ajax 编程中被大量使用。

2. 初始化，设置请求方法（请求类型）和url
   - ```javascript
     xhr.open(method, URL, [async, user, password])
     ```
   
     此方法指定请求的主要参数：
   
     - `method` —— HTTP 方法。通常是 `"GET"` 或 `"POST"`。
   
     - `URL` —— 要请求的 URL，通常是一个字符串，也可以是 [URL](https://zh.javascript.info/url) 对象。
   
     - `async` —— 如果显式地设置为 `false`，那么请求将会以同步的方式处理，我们稍后会讲到它。
   
     - `user`，`password` —— HTTP 基本身份验证（如果需要的话）的登录名和密码。
   
       
   
   - 此外，我们还可以通过 `responseType` 来设置响应格式
   
     - `""`（默认）—— 响应格式为字符串，
     - `"text"` —— 响应格式为字符串，
     - `"arraybuffer"` —— 响应格式为 `ArrayBuffer`（对于二进制数据，请参见 [ArrayBuffer，二进制数组](https://zh.javascript.info/arraybuffer-binary-arrays)），
     - `"blob"` —— 响应格式为 `Blob`（对于二进制数据，请参见 [Blob](https://zh.javascript.info/blob)），
     - `"document"` —— 响应格式为 XML document（可以使用 XPath 和其他 XML 方法）或 HTML document（基于接收数据的 MIME 类型）
     - `"json"` —— 响应格式为 JSON（自动解析）。
   
     ```js
     xhr.open('GET', '/article/xmlhttprequest/example/json');
     xhr.responseType = 'json';
     ```
   
     
   
   
   
3. 发送，send方法可以接收一个参数，作为**请求体（body）发送的数据**，如果不需要发送请求体，则必须传null，因为这个参数在某些浏览器中是必须的
   - `xhr.send(null)`
   - `xhr.send([body])`
   
4. 事件绑定，处理服务端返回的结果  `onreadystatechange`

   on 有 when的意思，即当。。。的时候
   readystate是xhr对象当中的属性，表示状态0/1/2/3/4，分别对应以上步骤完成与否的状态
   	UNSENT，0：未初始化
   	OPENED，1：open方法已经调用完毕
   	HEADERS_RECEIVED，2：send方法已经调用完毕，并且头部和状态已经可获得
   	LOADING，3：loading, 下载中； `responseText` 属性已经包含部分数据。
   	DONE 4：服务端返回了所有的结果
   change 改变的时候触发，这里一般会触发四次，改一次触发一次

5. 此时`xhr`对象的属性有：
   - `status`状态码（200等） 
   - `statusText`  状态字符串（OK等）   
   - `getAllResponseHeaders()`  所有响应头 
   - `response` 响应体
   
6. 若收到相应之前如果想要取消异步请求，可以调通 `abort` 方法
   - `xhr.abort()`

#### ajax的get请求案例

```js
const btn = document.querySelector('button');
        const result = document.querySelector('#result');
        btn.addEventListener('click', () => {
            //1.创建对象，控制平台中network也有XHR，它是对ajax请求做一个筛选
            const xhr = new XMLHttpRequest();
            //2.初始化，设置请求方法（请求类型）和url
            xhr.open('GET', 'http://127.0.0.1:8000/server');
            //3.发送
            xhr.send();
            //4.事件绑定，处理服务端返回的结果
            xhr.onreadystatechange = () => {
                //判断,服务端返回了所有的结果
                if (xhr.readyState === 4) {
                    //判断响应状态码
                    if (xhr.status >= 200 && xhr.status < 300) {
                        //处理结果 行、头、空行和体
                        //1.响应行里的数据
                        console.log(xhr.status);  //状态码
                        console.log(xhr.statusText);   //状态字符串
                        console.log(xhr.getAllResponseHeaders());  //所有响应头
                        console.log(xhr.response);  //响应体
                        //2.设置result文本
                        result.innerHTML = xhr.response;
                    }
                }
            }
        })
    </script>
```

#### ajax的post请求

注意post和get的不同点在于：

1.初始化`xhr.open('POST', url)`

2.get是在初始化时，`xhr.open('GET', 'http://127.0.0.1:8000/server?a=100&b=200');`进行参数传递的

而post是在发送时`send(a=100&b=200);`进行参数传递的

#### load事件

Firefox最初在实现XHR的时候，曾致力于简化交互模式。最终增加了一个load事件替代readystatechange事件，load事件会在响应接收完成之后立刻触发，这样就不用检查readystate属性了。虽然onload传入了一个event对象，但是并不是所有浏览器都实现了这个event对象，所以还是使用XHR对象变量比较好

```js
let xhr = new XMLHttpRequest();
xhr.onload = function(){
	if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
		alert(xhr.response)
	} else {
		alert('err', 'xhr.status');
	}
}
xhr.open(xxxxxx);
xhr.send(null)l
```





## 3.ajax其他

#### http请求头

- Accept：浏览器可以处理的内容类型
- Accept-Charset：浏览器可以显示的字符集
- Accept-Encoding：浏览器可以处理的编码类型
- Accept-Language：浏览器使用的语言
- Connection：浏览器与服务器连接类型
- Cookie
- Host：所在域
- Referer：发送请求的页面URI
- User-Agent：浏览器的用户代理字符串

我们可以通过 `xhr.getResponseHeader(请求头名称)` 获取响应头部

当然也可以使用 `xhr.getAllResponseHeaders()` 获取所有包含响应头部的字符串



#### ajax请求头设置

设置请求头，并且必须在open之后，send之前

`xhr.setRequestHeader(属性名, 属性值);`

```js
xhr.open('POST', 'http://127.0.0.1:8000/server');
xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
xhr.send('a=100&b=200&c=300');
```

Content-Type是来设置请求体内容类型

与此同时还可以自定义属性，`xhr.setRequestHeader('name', 'Allen');`

但会报错，除非后端人员在服务器：

1.先把服务器对当前页面的post请求改成all，这样可以接受任意类型的请求

`app.post(url, callback)` => `app.all(url, callback)`

2.请求里设置 `res.setHeader('Access-Control-Allow-Headers', '*');`



#### Content-Type

Content-Type（内容类型），一般是指网页中存在的 Content-Type，用于定义网络文件的类型和网页的编码，决定浏览器将以什么形式、什么编码读取这个文件，一般用于表明该请求的数据类型

常见的媒体格式类型如下：

- text/html ： HTML格式
- text/plain ：纯文本格式
- text/xml ： XML格式
- image/gif ：gif图片格式
- image/jpeg ：jpg图片格式
- image/png：png图片格式

以application开头的媒体格式类型：

- application/xhtml+xml ：XHTML格式

- application/xml： XML数据格式

- application/atom+xml ：Atom XML聚合格式

- application/json： JSON数据格式

- application/pdf：pdf格式

- application/msword ： Word文档格式

- application/octet-stream ： 二进制流数据（如常见的文件下载）

- application/x-www-form-urlencoded ：` <form encType="">`中默认的`encType`，form表单数据被编码为key/value格式发送到服务器（表单默认的提交数据的格式）**使用与 URL 参数相同的编码**

  使用它，会导致服务端参数从number 变成 string

  [对比](https://blog.csdn.net/weixin_40599109/article/details/113614103)，看起来优势只是兼容性更棒，但是application/json服务端解析更方便

另外一种常见的媒体格式是上传文件之时使用的：

- multipart/form-data ： 需要在表单中进行文件上传时，就需要使用该格式，否则和`x-www-form-urlencoded ` 差不多



#### 响应json数据

保存在json文件的是json字符串

`JSON.stringify(对象)`     JavaScript 值(对象或数组)转换为 JSON 字符串

`JSON.parse(data)`            字符转对象

或者直接在`xhr.open`之前设置： `xhr.responseType = 'json'`，这样通过`xhr.response`得到的响应体数据都是以对象形式，不需要再进行`JSON.parse(xhr.response)`    



#### IE缓存问题

ie浏览器它会对ajax的请求结果做一个缓存，这样导致下次再次发送请求时，用的是本地之前的缓存进行响应，而不是最新数据，这样导致时效性比较强的使用场景，ajax这个缓存会影响最终的结果正确的呈现

ajax关于ie缓存问题解决方法：`xhr.open('POST', 'http://127.0.0.1:8000/server/ie?t='+Date.now());`



#### ajax请求超时问题与网络异常

我们永远不能保证服务端快速、及时的响应

这时我们对超时、异常情况给用户进行提醒（超时后自动取消请求）

```js
//超时 2s 设置
xhr.timeout = 2000;
//超时回调函数
xhr.ontimeout = function () {
	alert("网络异常，请稍后重试");
}
// 网络异常回调设置
xhr.onerror = function () {
	alert("您的网络似乎出了一点问题。。。");
}
```



#### ajax取消请求

上方是超时自动取消请求

这里演示的是手动取消请求

```js
let xhr = null;
btn[0].addEventListener('click', function () {
	xhr = new XMLHttpRequest();
	xhr.open('GET', 'http://127.0.0.1:8000/server/time');
	xhr.send();
});
//取消按钮
btn[1].addEventListener('click', function () {
    xhr.abort();
})
```



#### 请求重复发送问题

过于频繁地发送请求会导致服务器压力过大

这里可以设置，再次发送请求时，把上一个请求取消掉（这里地重复发送问题让我想起了节流阀）

```js
let isSending = false;
btn[0].addEventListener('click', function () {
    // 判断标识变量,如果正是在发送，则取消该请求，创建新的请求
    if (isSending) xhr.abort();
    xhr = new XMLHttpRequest();
    isSending = true;
    xhr.open('GET', 'http://127.0.0.1:8000/server/time');
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            // 在这里不加状态码判断，因为这可能是一个失败的请求，如果加判断的话，可能导致isSending永远不为false
            isSending = false;
        }
    }
});
```



#### 表单的同/异步提交

使用jQuery实现ajax的注册小案例

（异步提交，即使用submit事件来提交数据，同步提交是直接form表单上增加属性值： `action=路径`, `method="POST"`）

表单具有默认的提交行为，默认是同步的，同步表单提交缺点：

1.浏览器会锁死（转圈儿）等待服务端的响应结果。

2.表单的同步提交之后，无论服务端响应的是什么，都会直接把响应的结果（`res.send()`）覆盖掉当前页面。（上面crude案例没有覆盖是因为，每次post请求后都直接重定向了）

3.用户提交表单之后，页面重新渲染显示仅仅有“密码/邮箱已存在，请稍后重试”的另外一个页面，重新更改需要后退网页进行再次表单修改、提交，所以体验很不好，所以后面采用了直接`res.render(当前页面, {数据渲染})`+提示的方法

优点：由服务端处理，更加安全一点

异步提交: 减少服务器压力，让客户端处理更多交互效果

```js
//<form id="login_form">  <button type="submit">登录</button>   </form>
$('#register_form').on('submit', function (e) {
      e.preventDefault()
      var formData = $(this).serialize()
      $.ajax({
        url: '/register',
        type: 'post',
        data: formData,
        dataType: 'json',
        success: function (data) {
          var err_code = data.err_code
          if (err_code === 0) {
            // window.alert('注册成功！')
            // 服务端重定向针对异步请求无效
            window.location.href = '/'
          } else if (err_code === 1) {
            window.alert('邮箱已存在！')
          } else if (err_code === 2) {
            window.alert('昵称已存在！')
          } else if (err_code === 500) {
            window.alert('服务器忙，请稍后重试！')
          }
        }
      })
    })
```





## 4.AJAX的使用工具

### jQuery中的AJAX

要去github下载包，或者用script加载工具的网址

又或者在BootCDN网站上找到工具包网址，用script加载使用（相对于github网址更快速）

但是不建议在React、Vue里使用

**get和post**

`$.get(url, 参数, callback, type)`

`$.post(url, 参数, callback, type)`

回调函数里接收的data为响应，即服务器里send的数据

type：如响应体类型'json'则将json字符串转化为对象

```js
<button>get</button>
<button>post</button>
<script>
$('button').eq(0).click(function () {
    $.get('http://127.0.0.1:8000/server/jquery', { a: 100, b: 200 }, function (data) {
        console.log(data);
    }, 'json');
});
$('button').eq(1).click(function () {
    $.post('http://127.0.0.1:8000/server/jquery', { a: 100, b: 200 }, function (data) {
        console.log(data);
    });
})
```

**另外一种方式**，可定义的属性操作比较灵活、结构清晰，但是相对以上两种方式代码以较复杂

```js
 $('button').eq(2).click(function () {
     $.ajax({
         url: 'http://127.0.0.1:8000/server/jquery',
         data: { a: 100, b: 200 },
         type: 'GET',
         //把接收到的数据转成对象
         dataType: 'json',
         // 成功的回调
         success: function (data) {
             console.log(data);
         },
         timeout: 2000,
         // 失败的回调
         err: function () {
             console.log('出错啦！');
         },
         //头信息
         // headers: {
         //     c: 300,
         //     d: 400
         // }
     })
 })
```





### Axios

目前（2020）年最热门的ajax工具库，要去github下载包，或者用script加载工具的网址

又或者在BootCDN网站上找到工具包网址，用script加载使用（相对于github网址更快速）

项目中使用axios居多、支持Promise（当成Promise对象来看待）

axios常见配置

- url：请求地址
- method：请求方法
- baseURL：请求根路径
- transformRequest:[function(data){}]：请求前数据处理
- transformResponse:[function(data){}]：请求后数据处理
- headers:{'x-Requested-With':'XMLRequest'}：自定义请求头
- params：URL查询对象（一般用于get请求）



#### 测试请求网址

我们可以使用以下网址进行请求测试

http://httpbin.org/



####  **axios的通用方式**

和jQuery的方式都很像

```js
btn[2].addEventListener('click', function () {
    axios({
        method: 'POST',
        url: 'http://127.0.0.1:8000/axios',
        params: {
            id: 100,
            level: 500
        },
        headers: {
            a: 100,
            b: 200
        },
        // 请求体参数
        data: {
            username: 'allen',
            password: 123456
        }
    }).then(res => {
        //处理返回结果
        console.log(res);
    })
})
```



#### **get&post**

get方法：`axios.get(url[, config])`

如果不想把对应参数直接拼接到 url 的后面，则可以把对应参数放到`params`

```js
btn[0].addEventListener('click', function () {
    axios.get('http://127.0.0.1:8000/axios', {
        // url参数
        params: {
            ID: 12345
        },
    }).then(value => {
        //这里没有使用回调函数，因为axios支持Promise，所以使用痛恨处理回调
        //value是一个对象，里面包含了响应的各类信息
        console.log(value);
    });
});
```

post方法：`axios.post(url[, data[, config]])`

一般可以把对应参数放到`data`（即request.body）

```js
btn[1].addEventListener('click', function () {
    axios.post('http://127.0.0.1:8000/axios', {
        // post第二个参数可以设置请求体
        username: 'allen',
        password: 'allen'
    }, {
        //设置其他参数，如headers等
    })
});
```



#### **axios.all**

我们在Promise中学习过处理**相互依赖**的并发网络请求解决方法（多个并发网络请求的响应全部到达后才去做相应处理）

但是axios本身支持支持Promise语法，所以可以直接使用 `axios.all([axios(), axios().....]).then(result => {})`

```js
axios.all([
  axios({url: ''}),
  axios({url: ''})
]).then(results => {
    // results是一个数组，它包含以上异步操作的结果
  console.log(results[0], results[1]);
})
```



#### **全局配置**

事实上，在开发中很多参数都是固定的

这时候我们可以进行一些抽取，也可以利用axios全局配置 `axios.defaults.配置`

```js
axios.defaults.baseURL = 'http://123.207.32.32:8000';
axios.defaults.timeout = 5000; 
```

之后不用再次在axios中设置了（除非你想更改），已经有了默认值



#### axios实例和模块封装

有时我们需要从不同的服务器发送请求，则需要对应不同的ip地址，这时设置全局配置不太合适

所以一般都是创建对应axios实例进行配置

```js
// 创建实例
const instance = axios.create({
  // 在里面进行实例的基本配置
  baseURL: 'http://123.207.32.32:8000',
  timeout: 5000
});
instance({
  url:'/home/multidata'
}).then(res => {
  console.log(res);
})
```

而且在开发过程中，不推荐组件内直接引用第三方的 axios 进行依赖，如果有一天axios不再进行维护，改动时会十分麻烦

所以我们可以对其进行模块封装：

- 在src文件夹下，新建一个network文件夹，然后再该文件夹下新建一个 `request.js` 文件
- 在里面撰写基于 axios 发送网络请求、不同实例的代码

```js
//request.js
import axios from 'axios'
export function request(config) {
    // 1.创建axios实例
    const instance = axios.create({
        baseURL: 'http://123.207.32.32:8000',
        timeout: 5000,
    })
    return instance(config);
}
```

```js
//main.js
// 使用封装request模块
import { request } from './network/request'
request({
  url: '/home/multidata'
}).then(res => {
  console.log(res);
}).catch(err => {
  console.log(err);
})
```



#### axios拦截器

axios提供了拦截器，用于我们在每次发送请求或者得到响应后，进行相应的处理

拦截请求：`axios.interceptors.request.use(成功的回调, 失败的回调)`

拦截响应：`axios.interceptors.response.use(成功的回调, 失败的回调)`

下面以instance为实例，进行演示

request拦截下来的config参数其实就是我们的网络请求的配置（但没有拦截下数据）

response拦截下来的结果（包含数据）

request拦截下来进行处理

- 比如：config一些信息不符合服务器要求，添加headers之类的
- 比如：每次发送网络请求，都希望在界面中显示一个请求的图标，或者说展示loading组件
- 比如：某些网络请求（登录（token）），必须携带一些特殊的信息

```js
const instance = axios.create({
    baseURL: '...',
    timeout: 5000,
})
//每一次发送请求之前都会被调用
instance.interceptors.request.use(config => {
    console.log(config);
    // 拦截完后必须把配置给人还回去，不然网络请求会发送失败
    return config;
}, err => {
    console.log(err);
});
//每一次得到响应，则会进入到该拦截器
instance.interceptors.response.use(res => {
    console.log(res);
    // 拦截完后必须把配置给人还回去，不然网络请求无返回结果（undefined）
    //这里我只返回data,不看其他res的信息
    return res.data;
}, err => {
    console.log(err);
})
```





### 利用fetch发送ajax请求

fetch属于全局对象，可以直接去调用，不同下载什么包，返回的结果是一个promise对象

`const fetchResponsePromise = fetch(resource [, init])`

resource：url，或者一个request对象

init：可选的配置项

> 注意：使用fetch必须定义 Content-Type（axios就不用），用json格式就要设置 'application/json'
>
> application/json： 一种传输格式，在postman看到格式内容是raw的一般就是json格式的，raw指的是不会对其进行任何类型的更改

```js
const payload = JSON.stringify({
    foo: 'bar'
});
const jsonheader = new Headers({
    'Content-Type': 'application/json'
})
btn[0].addEventListener('click', function () {
    fetch('http://127.0.0.1:8000/fetch', {
        //请求方法
        method: 'POST',
        // 请求头
        headers: jsonheader
        //请求体,经MDN文档上介绍，这里可以以多种形式来撰写
        body: payload
    }).then(res => {
        //返回的结果是一个promise对象,所以使用then回调方式接收和处理结果
        //但是这里的res结果不是返回数据，而是提示联系服务器成功 or 失败
        console.log(res);
        return res.json;
    },err => console.log(err)) //除非断网，联系不到服务器，才会被调用)
	.then(data => {
        //这里才能真正得到我们想要的数据
        console.log(data);
    })
})
```

详情可进入了解fetch介绍（十分推荐）https://segmentfault.com/a/1190000003810652

缺点：兼容性较一般





## 5.TS对axios的封装

在typescript中对模块的封装又有点不同，主要在于我们需要预先对接口的定义

首先为我们的网络请求定义一个类

```typescript
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { IInterceptor, IConfig } from './type'
// 把一大堆东西封装到一块，推荐使用类进行封装
export default class MYRequest {
  instance: AxiosInstance
  interceptors?: IInterceptor
  constructor(config: IConfig) {
    this.instance = axios.create(config)
    this.interceptors = config?.interceptors
    this.instance.interceptors.request.use(
      this.interceptors?.requesInterceptor,
      this.interceptors?.requstInterceptorCatch
    )
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    )
  }
  request(config: AxiosRequestConfig): void {
    this.instance.request(config).then((res) => {
      console.log(res, 'request方法')
    })
  }
}
```

类中使用的接口（type）再给他封装成一个模块

```typescript
import { AxiosRequestConfig } from 'axios'
export interface IInterceptor {
  requesInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requstInterceptorCatch?: (err: any) => any
  responseInterceptor?: (config: AxiosRequestConfig) => AxiosRequestConfig
  responseInterceptorCatch?: (err: any) => any
}
export interface IConfig extends AxiosRequestConfig {
  interceptors?: IInterceptor
}
```

然后实例化这个类，每个实例都可以单独作为网络请求的封装函数，到时候通过 `实例.方法` 的形式进行调用

```typescript
import MYRequest from './request'
import { BASE_URL } from './request/config'
const myRequest = new MYRequest({
  baseURL: BASE_URL,
  interceptors: {
    requesInterceptor: (config) => {
      const token = '123'
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      console.log('请求成功拦截', config)
      return config
    },
    requstInterceptorCatch: (err) => {
      console.log('请求失败拦截', err)
    },
    responseInterceptor: (config) => {
      console.log('响应成功拦截', config)
      return config
    }
  }
})
export default myRequest
```



## 6.跨域

#### 同源策略

它是**浏览器**最核心也最基本的安全功能

同源，即（当前网页的url和ajax请求的目标资源的url之间）协议、域名、端口号必须完全相同，**而ajax是默认遵从同源策略**，

**而违背同源策略就是跨域**，假如当前网页时a.com，而你向b.com发送了请求，则此时是跨域请求

单台服务器的性能是有上限的，需要外加更多的计算机、服务器提升服务水平

满足同源的情况：

```js
btn.onclick = function () {
    const xhr = new XMLHttpRequest();
    // 这里满足url同源策略，所以在以
    //http://127.0.0.1:9000/home打开网站时,可以简写为/data
    xhr.open('GET', '/data');
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status >= 200 & xhr.status < 300) {
                console.log(xhr.response);
            }
        }
    }
};
```

```js
const express = require('express');
const app = express();
app.get('/home', (req, res) => {
    res.sendFile(__dirname + '/kuayu.html');
});

app.get('/data', (req, res) => {
    res.send('用户数据');
})

app.listen(9000, () => {
    console.log("服务已启动，9000端口监听中...");
})
```



#### JSONP实现跨域原理

JSONP：JSON with padding

JSONP是一个非官方解决跨域的问题，只支持get请求。

在网页有一些标签天生具备跨域能力，比如img，link，script

优点：兼容性非常好

缺点：

- 是只支持get请求，不支持post请求。
-  不好确定请求是否失败
- 要保证Web服务安全性才能使用它，因为域不可信时，可能加入恶意内容，此时只能完全删除掉JSONP

```js
<script src="http://127.0.0.1:9000/jsonp"></script>
```

```js
app.get('/jsonp', (req, res) => {
    res.send('console.log("hello world")');
})
```



#### JSONP跨域实例

动态创建script标签，添加src值为请求的域名地址，再动态添加至body内部

```js
const input = document.querySelector('input');
const p = document.querySelector('p');
// 声明handle函数
function handle(data) {
    input.style.border = "solid 1px #f00";
    p.innerHTML = data.msg;
};
input.addEventListener('blur', function () {
    let username = this.value;
    //1. 创建script标签
    const script = document.createElement('script');
    //2. 设置script的src属性
    script.src = 'http://127.0.0.1:9000/jsonp';
    //3.将script插入文档中(添加节点)
    document.body.appendChild(script);
})
```

```js
//服务器部分
//jsonp
app.get('/jsonp', (req, res) => {
    const data = {
        exist: 1,
        msg: '用户名已经存在'
    };
    // 转字符串再调用handle函数
    res.send(`handle(${JSON.stringify(data)})`);
})
```

所以使用jsonp传输数据时，后端需要处理数据讲数据转换为json格式



#### jQuery实现跨域功能

`$(*selector*).getJSON(*url,data,success(data,status,xhr))*`

getJSON() 方法使用 AJAX 的 HTTP GET 请求获取 JSON 数据。而跨域的实现是通过在url后增加`'?callback=?'`，并且在服务器上调用接收jQuerycallback参数的函数

```js
$('button').eq(0).click(function () {
    // 在jQuery里发送JSONP请求,这里第一个参数后一定要加'?callback=?'
    $.getJSON('http:127.0.0.1:9000/jQuery-jsonp?callback=?', function (data) {
        console.log(data);
        $('#result').html(`
            名称: ${data.name},</br>
            城市: ${data.city[1]}
         `)
    });
})
```

```js
//服务器部分
app.get('/jQuery-jsonp', (req, res) => {
    const data = {
        name: 'Allen',
        city: ['北京', '澳门', '广州']
    };
    // 接收jQuerycallback那个参数
    let cb = req.query.callback;
    // 转字符串再调用handle函数
    //cb实际上是jQuery+一串数字，但他保存的其实是调用jQuerygetJSON里的回调函数
    res.send(`${cb}(${JSON.stringify(data)})`);
})
```



#### CORS解决跨域问题

CORS，跨域资源共享，它是官方的跨域解决方案，它的特点是不需要在客户端做任何特殊操作，完全在服务器中进行处理，支持get、post请求，跨域资源共享标准新增了一组http首部字段，允许服务器声明哪些源站通过浏览器权限访问哪些资源

工作原理：设置一个响应头（**使用自定义的HTTP头部**）告诉浏览器，该请求允许跨域，然后浏览器收到该响应以后对响应放行

`setHeader("允许跨域响应头", "*");`

设置允许跨域的响应头，它们的格式分别所代表的含义是

1.origin 参数的值指定了允许访问该资源的外域 URI，可以指定该字段的值为通配符（*），表示允许来自所有域的请求。

```text
Access-Control-Allow-Origin: <origin> | *
```

2.指明了实际请求所允许使用的 HTTP 方法。

```
Access-Control-Allow-Methods: <method>[, <method>]*
```

3.指明了实际请求中允许携带的首部字段。

```
Access-Control-Allow-Headers: <field-name>[, <field-name>]*
```

4.表示是否允许发送Cookie。**默认情况下，Cookie不包括在CORS请求之中**，也就是说，不能发送和接受cookie。设为`true`，即表示服务器明确许可，Cookie可以包含在请求中，一起发给服务器。这个值也只能设为`true`，如果服务器不要浏览器发送Cookie，删除该字段即可。

```
Access-Control-Allow-Credentials: true
```

等等.......



第二个参数`*`是通用的意思，也可以设置专用的url

```js
//服务器部分
app.all('/CORS', (req, res) => {
    // 设置允许跨域的响应头
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    //这里表示的是只有地址为http://127.0.0.1:5500这样的网页，才能向我们这个服务发送请求
    // res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500");
    res.send('hello world');
})
```

或者是这个（append是追加http响应头）

```js
app.use((req, res, next) => {
  res.append("Access-Control-Allow-Origin", "*")
  res.append("Access-Control-Allow-Content-Type", "*")
  next();
})
```



如果设置请求头不行的话可以安装 CORS

（1）安装cors： npm install cors express --save

（2） 然后在文件中引用：

```js
var cors = require('cors');
var express = require('express');
var server = express();
server.use(cors());
```

但实际上，上线的网站，很少用cors解决跨域，因为加上这个意味着很多网站都可以访问你



#### 复杂请求和简单请求

在涉及到CORS的请求中，我们会把请求分为简单请求和复杂请求。

浏览器限制跨域请求一般有两种方式：

1. 浏览器限制发起跨域请求
2. 跨域请求可以正常发起，但是返回的结果被浏览器拦截了

一般浏览器都是第二种方式限制跨域请求，那就是说请求已到达服务器，并有可能对数据库里的数据进行了操作，但是返回的结果被浏览器拦截了，那么我们就获取不到返回结果，这是一次失败的请求，但是可能对数据库里的数据产生了影响。
为了防止这种情况的发生，规范要求，对这种可能对服务器数据产生`不可预测`影响的HTTP请求方法，浏览器必须先使用OPTIONS方法发起一个预检请求，从而获知服务器是否允许该跨域请求：如果允许，就发送带数据的真实请求；如果不允许，则阻止发送带数据的真实请求。

（OPTIONS不会携带请求参数和cookie,也不会对服务器数据产生副作用）

**复杂请求：会发送发预检请求（OPTIONS请求）**

**简单请求**

那么有哪些简单请求呢？以下是来自MDN官方引用：

1、使用下列方法之一：

GET、

POST、

HEAD。

2、不得人为设置该集合之外的其他首部字段。该集合为：

```
Accept
Accept-Language
Content-Language
Content-Type 
```

3、Content-Type 的值仅限于下列三者之一：

```
text/plain
multipart/form-data
application/x-www-form-urlencoded
```

4、请求中的任意XMLHttpRequestUpload 对象均没有注册任何事件监听器；XMLHttpRequestUpload 对象可以使用 XMLHttpRequest.upload 属性访问

5、请求中没有使用 ReadableStream 对象

那什么是复杂请求呢，除了简单请求都是复杂请求。





#### postMessage

这是由H5提出来的的API，IE8以上支持这个功能。window.postMessage() 方法可以安全地实现跨源通信。通常，对于两个不同页面的脚本，都遵循同源策略才能够实现通信。

`window.postMessage()` 方法提供了一种受控机制来规避此限制，只要正确的使用，这种方法就很安全，原理是将[通过消息事件对象暴露给接收消息的窗口](https://developer.mozilla.org/zh-CN/docs/Web/API/Window/postMessage#The_dispatched_event)。



#### nginx代理跨域

**跨域原理：** 同源策略是浏览器的安全策略，不是HTTP协议的一部分。服务器端调用HTTP接口只是使用HTTP协议，不会执行JS脚本（没有使用ajax，ajax遵守同源策略），不需要同源策略，也就不存在跨越问题。

**实现思路：** 通过nginx配置一个代理服务器（域名与domain1相同，端口不同）做跳板机，反向代理访问domain2接口，并且可以顺便修改cookie中domain信息，方便当前域cookie写入，实现跨域登录。



#### webpack配置代理

**React脚手架项目**

json文件实现代理

代理未使用ajax，所以不需要遵守同源策略，但代理的域名、端口号、协议均和客户端同源，所以可以进行信息交互

比如在React中的package.json进行配置

```json
{
    "proxy":"http://localhost:5000"
}
```

然后axios向本地的代理服务器发送请求（此时本地搭建项目地址为localhost:3000）

```js
axios.get('http:localhost:3000/students').then(res => console.log(res))
//此时先去本地3000找该资源，找不到就去到5000找
```

优点：配置简单

缺点：但是注意这个方法只能代理一个网址，这是个取巧的方式，当我同时需要对 "http//localhost:5000"、"http//localhost:5001"发送请求，就不可以使用了，此时React可以新建一个setupProxy.js 进行正向代理（请跳转至《React(上》篇章）



**vue3脚手架项目**

在vue.config.js文件中实现代理（对我们本地npm run serve 的服务器进行配置）

```js
module.exports = {
  outputDir: './build',
  devServer: {
    proxy: {
      '^/api': {
        target: '目标地址',
        pathRewrite: {
          '^/api': ''
        },
        changeOrigin: true
      }
    }
  }
}
```

