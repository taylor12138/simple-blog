---
author: Hello
categories: 数据库
pubDate: 2023-12-25 
title: MySql
description: '数据库相关'
---

## Mysql

在node中使用：

安装：

```
npm i mysql
```

使用

```js
const mysql = require("mysql");
const connection = mysql.createConnection({
  host: 'localhost', //服务器ip
  user: 'root',
  password: '123456',
  database: 'test', //连接的数据库名称
  port: 3306 //服务器端口号
});
 
connection.connect();
 
//使用查询语句，select * from users 从users 表查询所有
connection.query('select * from user', function (error, results, fields) {
  if (error) throw error;
  console.log('The solution is: ', results[0].solution);
});

connection.end();
```

