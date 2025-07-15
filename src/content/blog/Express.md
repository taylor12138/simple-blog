---
author: Hello
pubDate: 2021-01-31 
categories: 前端
title: Express
description: 'node相关知识'
---

## Express框架

基于Node.js平台快速、开放、极简的Web开发框架，高度封装了http模块

（截至在2021/4/18，在GitHub上，

- express：52.7k star；

- koa：31k star；

- Hapi：13.2k star，express占领榜首，最高活跃度）

安装：用VScode打开文件目录，然后在该目录下右键->在集成终端打开->输入命令 `npm init --yes`  进行初始化，创建一个package.json文件-> `npm i express --save` 安装框架 ->  在js中输入

它！：

- 封装API，让开发者更关注于业务代码的开发
- 有一定的流程和标准



#### 基本使用

1.`http.createServer((req, res) => {})`  =>  `express()`    创建服务器

2.`if (url.parse(req.url, true).pathname === 路径){}` => `app.get(路径, fn)` 判断路径进行处理

3.`app.use('public', express.static('./public/'));`    处理公开目录，当以`/public/`开头的时候，去`./public/`目录中查找对应的资源，如 http://127.0.0.1:5208/public/404.html，直接进行访问（常用）

第一个参数其实是别名，`app.use('a', express.static('./public/'));`    处理公开目录，当以`/a/`开头的时候，去`./public/`目录中查找对应的资源，如 http://127.0.0.1:5208/a/404.html，直接进行访问

如果省略第一个参数：`app.use(express.static('./public/'))`，则可以在原始网页网址+资源名称，如 http://127.0.0.1:5208/404.html，直接进行访问

 4.`url.parse(req.url, true).query`=> `req.query`  原来的get获取url `?` 后的参数的方法的改变（只能拿get请求的参数）

模板对象：在Express中，模板引擎的使用有更好的方式res.render('文件名', {模板对象})，可以自己尝试看art-template官方文档，让它们结合使用

5.express**不需要** `res.end()`结尾来结束响应，而且它还提供了`res.send(JSON.stringify(对象))` => `res.json()` 自动帮你把json对象转换成字符串，然后发送给浏览器

```js
// 引包
var express = require('express');
// 创建服务器，相当于原来的http.createServer()
var app = express();
//当服务器收到get请求 '/' 的时候，执行回调函数
// 不用再设置http头部文件，并且不用设置charset=utf-8:防止中文乱码，它会根据你的语言更改language
//内置处理有不认识的路径时，自动发404
app.get('/', function (req, res) {
    res.send('Hello, world!');
})
app.get('/about', function (req, res) {
    //拿出get请求参数：在Express中可以直接通过req.query来获取查询字符串参数
    //http://127.0.0.1:5208/about?a=1&b=2
    console.log(req.query);
    res.send('你好！！!');
})
// 公开指定目录（处理静态资源public那块）
// 之后你就可以通过public的方式访问public目录的所有资源了
// 替代了原来判断路径+读文件+end结束的过程
app.use('/notebook/', express.static('./notebook/'));
// 相当于server.listen
app.listen(5208, () => {
    console.log('app is running at port!');
})
```

然后继续右键在集成终端打开->输入命令  `node 该js的文件名`  

这里的 `app.get('/',(request, response)` 中的 / 是路径（当然可以写成`/路径名`  之类的），当客户端浏览器向服务器发送请求时，如果url的路径，也就是请求行的第二部分，它的路径对应该路径的话，就会执行这个回调函数里面的 代码，并且由response做出响应  

以上步骤来简单构建一个服务端，提供ajax使用



express的response方法一览

![](/Express/res.png)



#### 基本路由

服务器中get和post部分相当于路由表，帮你映射关系：

```js
app
	.get('/login', callback)
	.get('xxx', callback)
	.post('yyyy', callback)
```



#### 配置art-template模板引擎

在官方文档可以看得到Express配合使用的安装导航：https://aui.github.io/art-template/

```shell
npm install --save art-template
npm install --save express-art-template
```

**注意**：Express有个约定，把所有视图文件都放在views目录之中，如果想要修改，则`app.set('views', render函数的默认路径)`

然后 `app.engine('art', require('express-art-template'))`

第一个参数表示当渲染以`.art`结尾的文件时，使用art-template模板引擎；express-art-template专门用在Express中把art-template整合，且express-art-template依赖了art-template

而这时就可以使用模板引擎的render了

```js
app.engine('html', require('express-art-template'));
app.get('/', (req, res) => {
    //去找views目录下的404.html
	res.render('404.html');
})
```

接而根据导航一步一步指引，进行操作就行了



#### 重定向

注意：服务端重定向对异步请求是无效的（表单的异步提交），异步请求的重定向只能在客户端里面实现，可以在ajax的success里使用

```js
window.location.href = '/'
```

原来是

```js
res.statusCode = 302;
res.setHeader('Location', '/'); //响应头的Loacation路径设置为  '/'  即首页
res.end();
```

现在：

```js
res.redirect('/');
```



#### Express获取表单POST请求体数据

当以post请求/post的时候，执行指定函数，获取数据的表单form添加 `action=路径`, `method="POST"`

 这样的话我们就可以利用不同的方法，让一个请求路径使用多次

```js
app.post('/post', (req, res) => {
    // 1.获取表单post数据
    // 2.处理
    // 3.发送响应
});
```

因为express内置没有获取表单post的api，所以需要借助第三方插件，在官网->资源->body-parser

> 官网现在已经有了获取表单post的API express.json，基于[body-parser](http://expressjs.com/resources/middleware/body-parser.html)

**注意**：express4不再支持body-parser

如果仍想使用，可以npm install express@3

安装

```powershell
npm install --save body-parser
```

然后跟着官网指示一步一步进行配置

配置body-parser，则会在request请求对象上多出一个body属性，然后此时我们可以使用`req.body`获取表单post请求体数据了

```js
//引包
var bodyParser = require('body-parser');
//配置post插件body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.post('/post', (req, res) => {
    // 1.获取表单post数据
    // 2.处理
    // 3.发送响应
    console.log(req.body); //get使用的是req.query
});
```



body-parser被弃用后我们可以直接使用express自带的

```js
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
```



注意识别请求的 `Content-Type`，像如果是 `Content-Type:text/plain;charset=UTF-8` 的话，express处理是用是对应text的中间件

```js
app.use(express.text())
```



#### 定制404页面

在挂载路由`app.use(router);`之后增加

`app.use(function(req, res) => {})`处理404页面，所有未处理的请求路径都会跑到这里



#### express操作cookie

不需要任何第三方的库

```js
app.get('/send', (req, res) => {
    const value = {
        name: 'Allen',
        sex: '男',
        age: 18
    }
    res.cookie('message', JSON.stringify(value))
    res.cookie('msg2', JSON.stringify(value), {maxAge: 1000 * 30}) //在搞一个30秒过期的的cookie
})
```

然后当服务端读取客户端携带过来的cookie需要用到一个库cookie-parser

```shell
npm i cookie-parser
```

```js
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.get('/receive', (req, res) => {
	console.log(req.cookies)
    const {message} = req.cookies;
    let a = JSON.parse(message.name)
})
```



除了生成cookie，还能删除掉cookie

```js
app.get('/delete', (req, res) => {
    //第一种删除方法
    res.cookie('message', '', {maxAge: 0})
    //第二种删除方法：
    //res.clearCookie('message')
})
```



#### express使用session

```shell
npm i express-session
```

```js
const session = require('express-session')
app.use(session({
  name: 'userid',            //设置cookie的key，默认为connect.sid
  secret: 'mistoryQianMing', //参与加密的字符串（又俗称签名），加密cookie传输的字段
  saveUninitialized: false,  //是否在存储内容之前创建对话，意思就是当我直接正常请求/访问时是否也给我开session
                             //false：除非执行了req.session.xx = xxx逻辑再给我存
  resave: true,              //每次请求时，强制重新保存session，即使他们没变化（稳妥）
  cookie: {
    httpOnly: true,          //开启之后前端无法通过js操作cookie
    maxAge: 1000 * 30        //cookie过期时间
  }
}))
```

tip：

`saveUninitialized`：

强制将“未初始化”的会话保存到存储中。当一个会话是新的但未被修改时，它是未初始化的。选择`false`对于实现登录会话、减少服务器存储使用或遵守在设置 cookie 之前需要许可的法律很有用。选择`false`还有助于解决竞争条件，即客户端在没有会话的情况下发出多个并行请求。

默认值为`true`，但不推荐使用默认值，因为默认值将来会更改。请研究此设置并选择适合您的用例的设置。



此时我们在某个请求中执行以下步骤

1. 为此次请求开辟一个session空间
2. 将客户端和服务端产生的对话数据存入session会话空间
3. 获取session id
4. 将session 存入id 然后返回cookie

但是以上步骤都一步搞定！

```js
//这里的_id是使用mongoDB存储数据时，会自动生成的，这里的逻辑是通过用户名密码在数据库查找匹配的data，然后用_id来充当session id，当然你也可以换成其他的，或者自己写个id
//session._id这个是变量名，可以随便取名
app.get('/send', (req, res) => {
   	req.session._id = data._id.toString()
})
```

当服务端通过客户端返回的session id验证会话消息时

1. 获取cookie携带过来的session id
2. 根据session id 匹配session，此时我们可以根据匹配结果，要么使用匹配到的数据，要么就去让客户端重新登录

```js
//这里我们当时存放了session._id，所以用_id去取
app.get('/receive', (req, res) => {
    const { _id } = req.session //req携带过来的cookie：{key: userid, value: 经过加密的session id}
    //根据_id对数据库进行查找操作。。。
})
```



如果是配合mongodb，则需要下载(这一步是配合session持久化的，不需要持久化可不用)

```shell
npm i connect-mongo
```

```js
//导入的是一个函数，此时传参session传过去，做session持久化
const MongoStore = require("connect-mongo")(session);
app.use(session({
    //...
    store: new MongoStore({
        //往sessions_container数据库里存储，然后保存在sessions集合里
        url: "mongodb://localhost:27017/sessions_container",
        touchAfter: 24 * 3600, //修改频率（例如24小时内只更新一次）,防止过度访问数据库造成压力
    }),
}))
```



## crud案例

先初始化 `npm init -y`

装express：`npm i -S express`

建2个文件夹，分别为views和public

装模板引擎：`npm install --save art-template express-art-template` 

装bootstrap的css：`npm i -S bootstrap`

外部备上一个index.html、db.json(用于存储数据)

将app.js作为执行的js文件，而router.js作为辅佐的路由js文件，并将其引入app.js，student.js作为增删改查封装的api

| 请求方法 | 请求路径         | get参数 | post参数                      | 备注             |
| -------- | ---------------- | ------- | ----------------------------- | ---------------- |
| get      | /students        |         |                               | 渲染页面         |
| get      | /students/new    |         |                               | 渲染添加学生     |
| post     | /students/new    |         | name、age、color、hobbies     | 处理添加学生请求 |
| get      | /students/edit   | id      |                               | 渲染编辑页面     |
| post     | /students/edit   |         | id、name、age、color、hobbies | 处理编辑请求     |
| get      | /students/delete | id      |                               | 处理删除请求     |

```js
//app.js
var express = require('express');
var router = require('./router.js');
var bodyParser = require('body-parser');

var app = express();
// 一定要在挂载路由之前配置好模板引擎和bodyParser
app.engine('html', require('express-art-template'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/node_modules/', express.static('./node_modules/'));
app.use('/public/', express.static('./public/'));
//挂载路由
app.use(router);
//这里可以设置一个定制404页面，所有未处理的请求路径都会跑到这里
//app.use(function(req, res) => {})

app.listen(5208, () => {
    console.log('5208 is running!!...');
})

```

express提供了一种更好的方式，专门用来包装路由

1.创建一个路由容器，可以把它看成我们的小型app

2.把路由都挂载到router容器中

3.在我们的router中，也可以通过 `router.use(中间件)`来使用我们的中间件

```js
//处理路由的router.js文件
var fs = require('fs');
var express = require('express');
var Student = require('./student.js');
//这样也不方便模块化
// module.exports = function (app) {
//     app.get('/students', (req, res) => {

//     });
// }
var router = express.Router();
router.get('/students', (req, res) => {
    Student.find((err, data) => {
        if (err) {
            return res.status(500).send('Service err 500');
        }
        // 进行数据渲染
        res.render('index.html', {
            fruits: [
                '苹果',
                '雪梨',
                '西瓜'
            ],
            students: data
        });
    })
});
router.get('/students/new', (req, res) => {
    res.render('new.html');
});
router.post('/students/new', (req, res) => {
    // 1.获取表单数据
    // 2.处理,将数据保存与db.json中，用于持久化,即将db.json读取处理啊，转对象，往对象中push数据，再转回字符串，再把字符串写入文件
    // 3.发送响应
    var student = req.body;
    Student.save(student, (err) => {
        if (err) {
            return res.status(500).send('Service err 500');
        }
        res.redirect('/students');
    })
});
router.get('/students/edit', (req, res) => {
    // 1.在客户端处理链接问题，使用<a href="/students/edit?id={{ $value.id }}">
    // 2.获取编辑的学生id
    // 3.渲染编辑页面
    Student.findById(parseInt(req.query.id), (err, student) => {
        if (err) {
            return res.status(500).send('Service err 500');
        }
        res.render('eidt.html', {
            student: student
        })
    })

});
router.post('/students/edit', (req, res) => {
    Student.updateById(req.body, function (err) {
        if (err) {
            return res.status(500).send('Service err 500');
        }
        res.redirect('/students');
    })
});
router.get('/students/delete', (req, res) => {
    // 获取删除的id
    // 根据id，进行删除，然后发送响应
    Student.remove(req.query.id, function (err) {
        if (err) {
            return res.status(500).send('Service err 500');
        }
        res.redirect('/students');
    })
});
// 3.导出
module.exports = router;
```

student.js用于纯粹对文件封装增删改查功能

只处理数据，不关心业务

node的奥义所在：封装异步api

```js
//student.js
var fs = require('fs');
var dbPath = './db.json';
//1.获取学生列表
// callback的第一个参数是err，第二个参数是结果
exports.find = function (callback) {
    //readFile 的第二个参数是可选的，传入utf8则按照utf-8编码转成正常字符
    fs.readFile(dbPath, 'utf8', function (err, data) {
        if (err) {
            return callback(err);
        }
        // 字符串转对象
        callback(null, JSON.parse(data).students);
    })
};
// 根据id获取学生对象
exports.findById = function (id, callback) {
    fs.readFile(dbPath, 'utf8', function (err, data) {
        if (err) {
            return callback(err);
        }
        // 字符串转对象
        var students = JSON.parse(data).students;
        student = students.find((item, index) => {
            return item.id === parseInt(id);
        });
        callback(null, student);
    })
}
//2.保存学生
exports.save = function (student, callback) {
    fs.readFile(dbPath, 'utf8', function (err, data) {
        if (err) {
            return callback(err);
        }
        // 字符串转对象
        var students = JSON.parse(data).students;
        // 处理id唯一性问题
        student.id = students[students.length - 1].id + 1;
        students.push(student);
        // JavaScript 值(对象或数组)转换为 JSON 字符串
        var ret = JSON.stringify({
            students: students
        });
        ReRead(dbPath, ret, err, callback);
    })
};
//3.更新学生
exports.updateById = function (student, callback) {
    fs.readFile(dbPath, 'utf8', function (err, data) {
        if (err) {
            return callback(err);
        }
        // 先把number类型的三个值从string转number
        student.id = parseInt(student.id);
        student.age = parseInt(student.age);
        student.color = parseInt(student.color);
        // 字符串转对象
        var students = JSON.parse(data).students;
        // 使用ES6的find方法找到id对应的对象
        var stu = students.find((item) => item.id === student.id);
        // 遍历拷贝对象
        for (let key in student) {
            stu[key] = student[key];
        }
        // JavaScript 值(对象或数组)转换为 JSON 字符串
        var ret = JSON.stringify({
            students: students
        });
        ReRead(dbPath, ret, err, callback);
    })
};
//4.删除学生
exports.remove = function (id, callback) {
    fs.readFile(dbPath, 'utf8', function (err, data) {
        if (err) {
            return callback(err);
        }
        // 字符串转对象
        var students = JSON.parse(data).students;
        // 获取要删除的id对象的下标
        var deleteId = students.findIndex((item) => item.id === parseInt(id));
        // 删除该id的对象
        students.splice(deleteId, 1);
        var ret = JSON.stringify({
            students: students
        });
        ReRead(dbPath, ret, err, callback);
    })
};
// 重新读入的api
function ReRead(dbPath, ret, err, callback) {
    fs.writeFile(dbPath, ret, (err) => {
        if (err) {
            return callback(err);
        }
        // 成功为null
        callback(null);
    });
}

```



## 关于Express

#### cookie和Session

在express中，默认不支持Session和Cookie

session是基于cookie实现的

但是我们可以使用大三方中间件：express-session来解决 `npm install express-session`

配置：

```js
var session = require('express-session');
app.use(session({
    //配置加密字符串
    secret: 'keyboard cat',
    resave: false,
    //无论你是否适用session,我都给你分配一把钥匙
    saveUninitialized: true
}));
```

添加session数据：`req.session.foo = 'xxx'`

访问session数据：`req.session.foo`

这时候，服务器只需要调用`req.session.xx`就可以使用session保存的数据了



#### 中间件

使用express框架、一些其他的API之后，传进来的req和res经过了一些中间件（函数方法），使得req和res内部拥有了一些属性，可以直接使用`req.body`、`req.query`、`req.session` 等，并且在挂载路由后，在路由的js文件中，不用再次引用（require）这些api方法，同样可以使用`req.body`、`req.query`、`req.session` 等属性（其实也可以理解为，req、res等参数传进来路由器js文件时，已经被赋予以上属性，页面不用关心参数从中间件得到的属性，而是要关心是否需要引包才能使用方法）

中间件本身就是一个方法，它有三个参数：request、response、next（使用下一个中间件）



如果一个请求进入中间件，不调用next则会停留在当前中间件，调用了next后继续向后找到第一个匹配的中间件（平常我们看到很多组件好像没有next，其实已经吧next封装好了）

与ES6的Generator中的`next()`类似



在express中，对中间件有几种分类：

- （1）不关心请求路径和请求方法的中间件，也就是任何请求都会进入这个中间件
  - `app.use(function(req, res, next))`

- （2）关心请求路径的中间件，以'/xxx'开头，需要匹配才会进入此中间件，如果不匹配自动跳过，去下一个中间件
  - `app.use('/xx', function(req, res, next))`
- （3）严格匹配请求方法和请求路径的中间件
  - `app.get()`    ` app.post()`

```js
//127.0.0.1:5208/b
app.use(function (req, res, next) {
    console.log(1);
    next();
});
app.use('/a', function (req, res, next) {
    console.log('a');

});
app.use('/b', function (req, res, next) {
    console.log('b');
});
app.use(function (req, res, next) {
    console.log(3);
});
//输出: 1 b
```

上方为错误的代码，没有调用next，导致停顿在中间件中

下方利用next处理发生错误：

```js
//当调用next的时候，如果传递了参数，则直接往后找到带有四个参数的应用程序级别中间件
//if (err) {
//     next(err)
// }
//中间件要放到最后，搭配404处理一起使用
app.use(function (req, res, next) {
    res.render('404.html')
});
app.use(function (err, req, res, next) {
    res.status(500).send(err.message)
});
```



express实现中间件机制前提：

1. express函数调用返回一个app实例

2. 在express函数内部定义一个数组来存储中间件函数（队列数组）

   ```js
   constructor() {
     // 存放中间件的列表
     this.routes = {
       all: [],// 通用的中间件
       get: [],// get请求的中间件
       post: [],// post请求的中间件
     };
   }
   ```

3. 在express函数内部定义一个app函数

4. 在app函数的内部定义一个变量i保存执行的中间件的位置。

5. 在app函数中定义一个next方法，这个方法通过i值自增调用中间件

6. 在app函数内部调用next

7. 在app函数上定义一个use方法，这个方法可以将中间件函数push进中间件数组中。

一个小案例加深中间件的作用和印象

```js
function middlewareA(req, res, next) {
    console.log('middlewareA before next()');
    next();
    console.log('middlewareA after next()');
}

function middlewareB(req, res, next) {
    console.log('middlewareB before next()');
    next();
    console.log('middlewareB after next()');
}

function middlewareC(req, res, next) {
    console.log('middlewareC before next()');
    next();
    console.log('middlewareC after next()');
}

app.use(middlewareA);
app.use(middlewareB);
app.use(middlewareC);
```

执行：A开始 -> B开始 -> C开始 -> C结束 -> B结束 -> A结束

其实也可以以异步调用的方式看待中间件的执行顺序

```js
const fn = async (ctx, next) => {
  console.log(1);
  await next();
  console.log(2);
}
```

