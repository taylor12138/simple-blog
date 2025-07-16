---
author: Hello
categories: 前端
title: MongoDB
description: 'MongoDB'
---

## 1.MongoDB概述

MongoDB 是一个基于分布式文件存储的数据库。由 C++ 语言编写。旨在为 WEB 应用提供可扩展的高性能数据存储解决方案。

mongoDB不需要学习sql语句

**NoSQL**，指的是非关系型的数据库。NoSQL有时也称作Not Only SQL的缩写

#### 关系型数据库和非关系型数据库

| 关系型数据库                             | 非关系型数据库                                           |
| ---------------------------------------- | -------------------------------------------------------- |
| 需要通过sql语言来操作                    | 不需要                                                   |
| 需要设计表结构，支持约束                 | 不需要                                                   |
| 通过事务来控制多张表的更新               | 没有事务这个概念，每一个数据集都是原子级别的。           |
| 以数据库表的形式存储                     | 用key- value键值对存储，结构不稳定                       |
| 纵向扩展，数据采用纵向扩展，提高处理能力 | 横向拓展，天然是分布式的，所以可以通过集群来实现负载均衡 |

- 非关系型数据库没有行列的概念，用json来存储数据
  
- 而MongoDB是长得最像关系型数据库的非关系型数据库
  
  - 数据库 => 数据库
  
  - 数据表 => 集合（数组）
  
  - 表记录 => （文档对象）
  
    ```
    {
    	数据库:{
    		集合:[
    		{name: 'Allen'},
    		{name: 'Allen'},
    		{name: 'Allen'},
    		]
    	}
    }
    ```
  

[MongoDB 将数据存储为 BSON 文档](https://docs.mongodb.com/manual/core/document/#documents)。BSON 是 JSON（JavaScript Object Notation）的二进制表示。

tip：

数据库之间的关系：

- 一对一（身份证号）
- 一对多（一个班级多名学生）
- 多对多（一个学生多门课程，一门课可以被多名学生选），一般再建立一个中间表，来保存两个表之间的关系信息



mac安装mongodb：https://www.mongodb.com/zh-cn/docs/v6.0/tutorial/install-mongodb-on-os-x/#std-label-install



## 2.使用（windows版）

#### 开启服务（服务端）

方式一：根据菜鸟教程提供的window MongoDB操作教程，就可以注册成window的一个服务，然后可以通过鼠标右键开启和停止这个服务了

方式二：

```shell
#mongodb 默认使用执行 mongod 命令所处盘根目录下的/data/db作为自己的数据存储目录
#所以在第一次执行该命令之前，先手动新建一个 E(MongoDB所属盘):/data/db
#然后再自己所属盘下 运行该命令
mongod
```

停止服务：ctrl + C或者直接关闭cmd窗口

如果想要修改默认的数据存储目录路径，可以（但是比较麻烦，不推荐）

```shell
mongod --dbpath=数据存储目录路径
```

> 注意，在mongoDB4.x以后，不需要开启服务这个步骤，因为在客户端执行连接命令的时候，计算机会自动帮我们开启服务



#### 连接（客户端）

用一个命令窗口来打开MongoDB数据库

此时再打开一个窗口，输入以下命令进行连接（这个命令执行成功的前提是要把`e:mongo/bin`，也就是自己安装的mongoDB的bin路径加入到当前系统的环境变量中）

```shell
#该命令默认连接本机的MongoDB服务
mongo
```

断开连接

```
exit
```



#### 基本命令

查看显示所有数据库

```shell
show dbs
```

查看当前操作的数据库，默认为test，供测试

```shell
db
```

 切换到指定数据库，如果没有该数据库则会新建一个（真正创建出来还得往该数据库里插入一条数据）

```
use 数据库名称
```

删除当前切换到的数据库

```shell
db.dropDatabase
```



查看当前数据库的集合（一个数据库有多个集合）

```shell
show collections
```

原生的查询方法对于小项目还好，对于大项目来说可能性能不是很好，推荐使用第三方库来查询

你甚至可以在命令行里写for循环来插入。。

```shell
#在当前数据库的students集合中插入一个数据（对象），没有这个集合则会新建一个
db.students.insertOne({"name": "Jack"})
#在当前数据库的students集合中再插入一个数据（对象）
db.students.insert({"name": "Allen"})

#查看当前数据库的students集合中的数据
db.students.find()
#查看当前数据库的students集合中的数据数量
db.students.find().count()
#查找当前数据库的students集合中name为Allen的数据
db.students.find({"name": "Allen"})
#查找当前数据库的students集合中name以A开头的数据
db.students.find({"name": A})
#查询前5条数据
db.students.find().limit(5)
#跳过10条数据查找
db.students.find().skip(10)

#移除 title 为“MongoDB”的文档
db.test.remove({'title': 'MongoDB'})
#一处test集合中所有数据
db.test.remove({})

#修改数据,修改name为Allen的数据，将其age改为33
db.stundents.update({"name": "Allen"}, {$set:{"age": 33}})
#完整替换掉数据
db.stundents.update({"name": "Allen"}, {"name": "Bruce"})
```

删除集合

```
db.students.drop()
```



#### 索引使用

##### 基础使用

索引是指对数据库表中一列或者多列的值进行排序的一种数据结构，可以让我们查询数据库变得更快，MongoDB的索引几乎和传统的关系型数据库一摸一样，其中也包含了一些基本的查询优化技巧

如果我们对某一字段增加索引，查询时就会先去索引列表中一次定位到特定值的行数，大大减少遍历匹配的行数，所以能明显增加查询的速度。（有点目录的感觉）

创建索引（里面传入要设置索引的字段（key），值为1升序序排序，-1为降序）

```shell
db.user.ensureIndex({"name": 1})
```

获取当前集合索引

```shell
db.user.getIndexes()
```

删除索引

```shell
db.user.dropIndex({"name": 1})
```

此时使用 `db.students.find({"name": "Allen"})`会发现快了巨多（上百倍的速度）



##### **复合索引**

如果我们使用find查询时，使用的是复合查询，也就是 `db.students.find({"name": "Allen", "age": 1})`这种类型的，此时我们需要复合索引，此时我们

1.只对查询name进行查询：会命中索引

1.对查询name & age 进行查询：会命中索引age

1.只对查询age进行查询：**不会命中索引**

```shell
db.user.ensureIndex({"name": 1, "age": 1})
```



##### **唯一索引**

在缺省的情况下创建的索引均不是唯一索引，下面示例将创建唯一索引

说人话就是设置完唯一索引以后，这个字段就不能重复，比如目前某个数据其中一个键值对为 `{"uid": 1}`，则不能再次添加 其中有个键值对为 ``{"uid": 1}`` 的数据

```shell
db.user.ensureIndex({"uid": 1}, {"unique": true})
```

```shell
#再次插入uid重复的文档后，MongDB将报错
db.user.insert({"uid": 1})
db.user.insert({"uid": 1})
```



## 3.MongoDB权限管理

1.创建超级管理员账户(root)，删除管理员为 `db,dropUser(用户名)`

```shell
use admin
#查看当前数据库的账户
show users
db.createUser({
	user:"admin",
	pwd:'123456',
	roles:[{role:'root', db:'admin'}]
})
```



2.修改Mongdb数据库配置文件

在mongodb安装目录下的bin文件夹中，找到mongod.cfg（）记得先备份一下，用文本编辑打开（注意空格格式）

```
security:
[两个空格]authorization:[一个空格]enable
```



3.重启mongodb服务



4.用超级管理员账户连接mongdob数据库，第二个取决于你注册的时候选择的db

```shell
#超级管理员登录
mongo admin -u 用户名 -p 密码
```

如果是连接远程服务器，则敲入以下命令

```shell
mongo 远程服务器ip地址 -u 用户名 -p 密码
```



5.给xx数据库创建一个账户，让其只能访问xx数据库，不能访问其他数据库

```shell
use xx
db.createUser({
	user:"xxmin",
	pwd:'123456',
	roles:[{role:'dbOwner', db:'xx'}]
})
```



1. 数据库用户角色：read、readWrite;
2. 数据库管理角色：dbAdmin、dbOwner、userAdmin；
3. 集群管理角色：clusterAdmin、clusterManager、clusterMonitor、hostManager；
4. 备份恢复角色：backup、restore；
5. 所有数据库角色：readAnyDatabase、readWriteAnyDatabase、userAdminAnyDatabase、dbAdminAnyDatabase
6. 超级用户角色：root 



## 4.在Node中操作MongoDB数据

方法一：使用官方的`mongodb`包来操作（并且根据文档提供的使用方法步骤进行操作）

https://github.com/mongodb/node-mongodb-native

（new）https://docs.mongodb.com/drivers/node/current/fundamentals/connection/

CRUD

```js
const { MongoClient } = require("mongodb");
// Connection URI
const uri = "mongodb://127.0.0.1:27017/";
// Create a new MongoClient
const client = new MongoClient(uri);
async function run() {
  try {
    // Connect the client to the server
    await client.connect();

    const db = client.db("cartoon"); //数据库名字
    const Result = await db
      .collection("bookss") //集合名词
      .find({})
      .limit(3)
      .toArray();
    console.log(Result);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
```



方法二：使用第三方`mongoose`来操作 MongoDB数据库

## 5.Mongoose

https://mongoosejs.com/

Mongoose是在nodejs异步环境下对MongoDB进行便捷操作的对象模型工具，Mongoose是NodeJS的驱动，不能作为其他语言的驱动

（mongoose所有api都支持promise，npm下载的时候直接下载mongoose就好了，不用下mongodb）

```shell
npm i mongoose --save
```

以下代码在mongoose官网也能查看到

1.引包 `require('mongoose');`  =>

2.连接数据库 `mongoose.connect` (指定连接的数据库不一定需要存在，当你插入第一条数据之后就会被自动创建出来)=> 

- 第一个参数是连接的数据库
- 第二个参数是option，mongodb4.0之后，都需要传入 `useNewUrlParser` 参数，会识别url里用户所需的db，不传入会报警告，而 `useUnifiedTopology` 是使用一个统一的拓扑结构
- 第三个参数可传入一个回调函数 fn ，告诉用户：连接成功

> 注意：MongooseServerSelectionError: connect ECONNREFUSED ::1:27017的问题可能是由于node版本号导致的，请查看当前node版本是否小于17.0

3.创建模型`mongoose.model(表名, 数据结构)`（这里模型创建十分灵活，只需要在代码中设计你的数据库就可以了） =>  

4.实例化模型(new)，并将每个实例化的数据保存 `save()` 在该模型集合里

```js
//demo.js
// 引包
const mongoose = require('mongoose');
//连接MongoDB数据库（这里顺便创建了一个叫test的数据库）
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
//如果数据库要管理员账号密码，则需要以以下方式连接(账户名:密码@)
//mongoose.connect('mongodb://allen:123456@localhost:27017/test');

//创建一个模型，说白了就是在设计数据库
//这里第一个参数是表名：Cat，第二个参数是数据结构
const Cat = mongoose.model('Cat', { name: String });
for (let i = 0; i < 10; i++) {
    // 实例化一个Cat（往cats集合里面插入每一个kitty数据）
    const kitty = new Cat({ name: 'Zildjian' });
    // 持久化保存kitty实例
    kitty.save().then(() => console.log('meow'));
}
```

连接本地的时候，连接地址可以在cmd中输入mongo，然后这里会看得到

![](/simple-blog/MongoDB/address.png)



#### 设计文档结构

在第3步创建模型之前，其实还可以独立开来，使用Schema设置文档结构，它会映射到mongodb中的一个collection

这个Schema是mongoose对比mongodb突出的一个特点

- 字段名称就是表结构的属性名称
- 约束的目的就是为了保证数据的完整性，不要有脏数据

```js
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true, useUnifiedTopology: true });
var userSchema = new Schema({
    username: {
        type: String,
        required: true   //设置该属性必须有配置，使用required
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    other:{
        type: String,
        default: 'noting'
    }
});
```

然后再用`mongoose.model(表名, 数据结构)`发布模型，此时把这个例子中`userSchema`放入第二个参数即可

```js
var User = mongoose.model('User', userSchema);
```

- 第一个参数：为传入一个大写开头的字符串，用来表示你的文档名称，这个模型会和模型名称相同的复数数据库collectrion建立连接

- 第二个传的是对文档的约束，架构Schema

- 这里我们规定的集合规范为users collection，因为的User的复数形式是users，即集合的名称

- 当然我们这里可以传入第三个参数，此时我们就可以指定集合，不用使用默认的那个第一个参数复数形式!即集合名称的规范

  ```js
  var User = mongoose.model('User', userSchema, 'user'); //我要定义user collection的规范!
  ```

- 返回值是模型构造函数，我们有了模型构造函数之后，就可以对users集合数据进行操作了



#### 操作数据

确保数据库MongoDB被打开，并且再另外一个窗口进行连接

**注意**：mongoose增加数据是给你自动生成id

**增加数据**

利用返回的模型构造函数，new一个实例对象，顺便使用`save()`进行保存

```js
let allen = new User({
    username: 'allen',
    password: '123456',
    email: 'allen@qq.com'
});
//ret是刚刚插入的那条数据
allen.save((err, ret) => {
    if (err) {
        console.log('保存失败');
    } else {
        console.log('保存成共');
        console.log(ret);
    }
})
```



**查询数据**

`模型构造函数.find()`

查询所有数据，ret返回一个数组，记录里面的数据（文档）

```js
User.find(function (err, ret) {
    if (err) {
        console.log('查询失败');
    } else {
        console.log(ret);
    }
});
```

条件查询，查询username为Bruce的数据(按条件查找，ret返回一个数组，记录里面的数据（文档）)

```js
User.find({
    username: 'Bruce'
}, function (err, ret) {
    if (err) {
        console.log('查询失败');
    } else {
        console.log(ret);
    }
});
```

只找到第一个匹配到的对象（文档）数据，ret返回一个对象

```js
User.findOne({
    username: 'Bruce',
    password: '123456'
}, function (err, ret) {
    if (err) {
        console.log('查询失败');
    } else {
        console.log(ret);
    }
});
//promise格式，因为mongoose所有api都支持promise
// User.findOne({ username: 'Bruce', password: '123456' })
//     .then(data => {
//         console.log(data);
//     }, err => {
//         console.log('查询失败');
//     })
```

利用或，满足其中一个条件查询成功

```js
User.findOne({
    $or: [
        { email: body.email },
        { nickname: body.nickname }
    ]
}, function (err, data) {
    if (err) {
        res.status(500).send('Server err');
    }else {
        console.log(data)
    }
})
```





**删除数据**

remove现在似乎已经废弃了，所以采用delete

删除单个数据，删除条件为`username: 'Zildjian'`的数据

```js
User.deleteOne({ name: 'Zildjian' }, function (err) { if (err) console.log('删除失败'); });
```

删除多个，删除条件为`username: 'Zildjian'`的数据

```js
User.deleteMany({ name: 'Zildjian' }, function (err) { if (err) console.log('删除失败'); });
```

根据id删除： `findByIdAndDelete`



**更新数据**

updateOne

- 第一个参数为查找条件
- 第二个参数为更新的数据
- 回调函数能查看更改操作成功与否

```js
User.updateOne({name: 'Allen'},{name: 'hhhh'}, function (err, data) {
    if (err) {
        res.status(500).send('Server err');
    }else {
        console.log(data)
    }
})
```

根据id更改数据

```js
User.findByIdAndUpdate('60142a5acbcef341281a7d18', { password: '789456' }, function (err, ret) {
    if (err) console.log('更新失败');
    else console.log('更新成功！');
})
```

还有其他更新数据方法可以在mongoose文档查看



#### 模块化

```js
//db.js
var mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost:27017/test",
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("数据库连接成功");
  }
);
module.exports = mongoose;
```

```js
//user.js
const mongoose = require('./db')
var Schema = mongoose.Schema;
const userSchema = new Schema({
  username: String,
  password: String
});
var User = mongoose.model('User', userSchema, 'user');
module.exports = User
```

此时我们就可以在主目录下的app.js中导入User，使用它的方法直接操作数据库了



## 6.Mongoose其他

#### 预处理修饰符

定义文档结构的一些模式修饰符

```js
var userSchema = new Schema({
    username: {
        type: String,
        trim: true, //自动去掉左右空格
        lowercase: true, //自动去掉左右空格
        uppercase: true, //自动去掉左右空格
    },
    password: {
        type: String,
        required: true
    },
});
```

除此之外，我们还可以自定义修饰符

通过set（建议使用）修饰符在增加数据的时候进行格式化

通过get（不建议使用）修饰符在实例获取数据的时候对数据进行格式化

set：

```js
const mongoose = require("./db");
var Schema = mongoose.Schema;
const focusSchema = new Schema({
  title: String,
  pic: String,
  redirect: {
    type: String,
    set(params) {
      //增加数据的时候对redirect字段进行处理
      // 这里的params是redirect对应的值
      //返回的数据为数据库实际保存的值
      const rg = /^http(s?):\/\//;
      if (rg.test(params)) return params;
      return "http://" + params;
    },
  },
});
var Focus = mongoose.model("Focus", focusSchema, "focus");
module.exports = Focus;
```

```js
const Focus = require("./model/focus");

let allen = new Focus({
  title: "title",
  pic: "pic",
  redirect: "netease.com",
});
//ret是刚刚插入的那条数据
allen.save((err, ret) => {
  if (err) {
    console.log("保存失败");
  } else {
    console.log("保存成功");
    console.log(ret); //redirect: 'https://netease.com',
  }
});
```



get：使用get方法之后的结果（感觉没啥用处。。）

```js
/*pic: {
    type: String,
    get(params) {
      return "001" + params;
    },
  },*/
const Focus = require("./model/focus");

let allen = new Focus({
  title: "title",
  pic: "pic",
  redirect: "netease.com",
});
console.log(allen.title, allen.pic) //title, 001pic
```



#### mongoose索引使用

我们可以在Schema（文档约束结构）中直接制定索引

- unique为设置唯一索引
- index为设置普通索引

```js
const userSchema = new mongoose.Schema({
  username: {
      type: String,
      unique: true
  },
  password: {
      type: String,
      index: true
  }
});
```



#### mongoose扩展静态 | 实例方法

实际情况扩展静态方法用的比较多

```js
const userSchema = new mongoose.Schema({
 //...
});
// 静态方法
userSchema.statics.fn1 = function(id, cb){
    this.find({"id": id}, function(err, dos){
        cb(err, dos)
    })
}
// 实例方法
userSchema.mehods.fn2 = function(){
    //...
}
const User = mongoose.model('User', userSchema);
```

调用方式

```js
User.fn1(123, function(){
	//...
})
let allen = new User({
    username: 'allen',
    password: '123456',
    email: 'allen@qq.com'
});
allen.fn2()
```



## 7.About数据库基础知识

**事务**：是数据库操作的最小工作单元，是作为单个逻辑工作单元执行的一系列操作；这些操作作为一个整体一起向系统提交，要么都执行、要么都不执行；事务是一组不可再分割的操作集合（工作逻辑单元）；

数据库的**事务特性**有：原子性、一致性、持久性、隔离性

- A atomicity 原子性 指的是事务包含的所有操作，要么全部成功，要么全部回滚失败（要么都做，要么都不做）
- C consistency 一致性 指的是事务必须使数据库从一个一致性状态到另一个一致性状态，即事务执行前后全部处于一致性状态
- I isolation 隔离性 指的是多个并发事物间互相隔离，也就是一个事务执行的过程中,不应该受到其他事务的干扰
- D durability 持久性 指的是事务一旦提交了，那么对数据库中数据的修改就是永久性的，即便在数据库系统遇到故障的情况下也不会丢失提交事务的操作



- 脏读：就是没有提交的数据，举个例子：比如某个事务在对数据库中某条记录进行修改，修改后没有提交也没有回滚，也就是让其处于一个待定的状态，这个时候如果有其他的事务来先一步对这条记录进行读取或者处理了的现象。
- 不可重复读取：一个事务先后读取某条记录，但在两次读取之间该条记录杯其他另一个事务给修改了，就造成了两次读取的数据不同的现象。
- 幻读：幻读就是一个事务按照查询条件查询以前检索过的数据可是发现该数据被其他事务插入了满足其查询条件的新数据的现象。



不可重复读和脏读的区别是一个是读取了前一事务提交的数据，而一个是读取了另一个事务未提交的数据

幻读和不可重复读不同的是，幻读针对的是数据条数的变化



#### 明文和密文

明文放密码的危险

- 数据库一旦被攻破，或者被黑客脱库，所有信息都被泄露
- 数据库管理员“心怀不轨”



密文：明文经过加密之后输出的结果

- 只要加密的是同一个明文，则输出结果相同
- 密文是不可以你想转换为明文的
- 用法是只将输入的转成密文，然后对密文进行对比即可



加密方式：MD5（主流），sha1（微信，不过现在估计用sha2了），而大厂可能是先交给md5加密，然后再交给sha2在加密一次，然后再依靠自己的算法，再加密一次

```shell
npm i md5
```

```shell
const md5 = require('md5')
const miwen = md5(password)
```

但是往上百度一下有md5在线解密功能！不过这个解密功能是靠大数据堆起来的，如果密码复杂一点可能就解密不了（惊喜哈哈哈）

https://www.cmd5.com/

本站针对md5、sha1等全球通用公开的加密算法进行反向查询，通过穷举字符组合的方式，创建了明文密文对应查询数据库，创建的记录约90万亿条，占用硬盘超过500TB，查询成功率95%以上，很多复杂密文只有本站才可查询。自2006年已稳定运行十余年，国内外享有盛誉。

2004年，证实MD5算法无法防止碰撞（collision），因此不适用于安全性认证



```shell
npm i sha1
```

```js
const sha1 = require('sha1')
const miwen = sha1(password)
```

但是对于弱口令密码，往上还是可以查询查得出来