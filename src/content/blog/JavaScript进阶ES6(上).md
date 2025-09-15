---
author: Hello
categories: 前端
title: JavaScript进阶ES6(上)
description: 'ES6相关'
---

## 1.ESMAScript6

ES6其实是一个泛指，泛指ES2015后续的版本



## 2.新增语法

#### 声明变量

ES5之前因为if、for都没有块级作用域的概念，所以很多时候都需要借助 **function的作用域** 解决应用外部变量的问题

let 声明的变量

1.只在所处块级有效（大括号中有效，也就是说if和for都有它的块级作用域了），可以防止循环变量变成全局变量

2.不存在变量提升，只能先声明再使用，不可重复声明

3.暂时性死区（即在块级作用域中使用某变量，则会先在该块级中查找此变量）

```js
var num = 10;
if(true) {
	console.log(num);		//报错，变量声明在后面
	let num = 20;
}
```

利用let解决异步问题：（因为let仅在当前块级有效，每个迭代蓄奴含声明一个新的迭代变量，然后使用上一个迭代结束时的值来初始化这个变量。）

```js
for (let i = 0; i < lis.length; i++) {
    lis[i].onclick = function () {
        console.log(i);
    }
}
```



const声明常量，常量就是值（内存地址）不能变化的量（值可以改，内存地址不能变）

1.具有块级作用域

2.const声明常量时必须赋值

3.基本数据类型：常量赋值后，不可修改；复杂数据类型：对象赋值后（数组之类的）不可更改，但是可以更改数据结构内部的值

4.不存在变量提升，只能先声明再使用

```js
const ary = [100, 200];
ary[0] = 'a';   //可以
//ary = ['a', 200];  //不可以
```



ES6之前的块级作用域：

原来的代码

```js
{
	let a = 2;
    console.log(a);
}
console.log(a);
```

以前的代码来实现(丑的要死！！！)

```js
try{ throw 2; } catch(a) {
	console.log(a);
}
console.log(a)
```



#### 解构赋值

ES6允许从数组或者对象（分别使用[]、{}）中一一提取值，按照对应的位置，对变量赋值

```js
//数组
let ary = [1, 2, 3];
let [a, b, c, d, e] = ary;  //1, 2, 3, undefined, undefined
//也可以 let [a, b, c] = [1, 2, 3];
//对象
let person = {name: 'zhangsan', age: 20};
let {name, age} = person;
let {name, age = 18} = person;  //解构赋值，如果原来person没有age属性，则定义默认值age = 18
```

对象的另一解构写法（重命名）

```js
let {name: myName, age: myAge} = person;
```

如果name和age分别和person中的属性值匹配成功，则将左侧该属性值赋值给右边的myName，myAge变量

除此外，还有嵌套解构赋值写法

```js
//4.对象的解构赋值
let obj = {a:{b:1}};
const {a:{b}} = obj;  //我们得到b的数据
console.log(b);       //1
```



#### 箭头函数

`(形参) => {函数体}` 箭头函数用来简化定义函数语法

```js
const fn = () => {
	console.log('xx');
}
// 也可以，返回undefined
//const fn = () => console.log('xx');  
```

如果函数体只有一句话，且代码执行结果就是返回值，则可以省略大括号

```js
//传统
function sum(num1, num2) {
	return num1+num2;
}
//new
const sum1 = (num1, num2) => num1+num2; 
```

如果形参只有一个，小括号可以省略

```js
//传统
function sum(a) {
	return a;
}
//new
const sum1 = a => a; 
```

如果返回的是一个对象，不能直接加大括号

```js
//const sum1 = a => {};  错，返回undefined
const sum1 = a => ({}); //对
```



箭头函数和传统函数不一样，箭头函数的this指向函数定义位置（使用了箭头函数的那个函数）的上下文this（定义函数地点最近作用域中的this）

也就是说，箭头函数的this使用的是词法作用域，而不是this原来的动态作用域

此时我们认为箭头函数将程序员们经常犯的一个错误标准化了，也就是混淆this绑定规则（动态作用域）和词法作用域规则

但是

 1. 箭头函数不适合事件回调

```js
function fn() {
    console.log(this);
    return () => {
        console.log(this);
    }
}
const obj = { name: 'zhangsan' };
const resFn = fn.call(obj);  //这时this指向obj，所以箭头函数跟着指向obj 返回{ name: 'zhangsan' }
resFn();   //箭头函数中this指向指向上下文this，此时箭头函数this跟着上下文this发生改动，输出{ name: 'zhangsan' }
```



2.不适合对象的方法

对象不能产生作用域，所以箭头函数实际被定义在全局作用域下，所以此处的this指向window，所以箭头函数处的this.age未定义

```js
var obj = {
        age: 20,
        say: () => {
            alert(this.age);  //undefined
        },
        con: function () {
            console.log(this);  //obj
        }
    }
obj.say();
obj.con();
```

```js
const obj = {
    aaa() {
        setTimeout(function () {
            setTimeout(function () {
                console.log(1, this); //window
            })
            setTimeout(() => {
                console.log(2, this); //window
            })
            console.log(3, this);     //window
        })
        setTimeout(() => {
            setTimeout(function () {
                console.log(4, this); //window
            })
            setTimeout(() => {
                console.log(5, this); //obj  
            });
            console.log(6, this); //obj
        });
    }
}
```



3.由于箭头函数必须以赋值声明的方式出现，所以没有变量提升

```js
//会出错，使用var也会出错
console.log(sum(10, 10));
let sum = (num1, num2) => {
	return num1 + num2
}
```



4.箭头函数是不存在原型的

```js
const arrow = () => {
    console.log('a');
}
function fn() {
    console.log('a');
}
console.log(arrow.prototype); // undefined
console.log(fn.prototype); // {constructor: ƒ}
```



#### arguments的使用

当我们不确定函数用多少个参数来传递的时候，arguments实际上是当前函数的一个内置对象（函数才拥有），arguments储存了传递的所有实参,它展示的方式是伪数组，因此可以进行遍历（使用for等）

**注意：**

- **箭头函数是用不了arguments**（虽然箭头函数也用不了它，但是可以使用剩余参数补足）
- arguments对象的值不反映参数的默认值（当函数设置了默认参数值），它始终以调用函数时传入的值为准

```js
function fn(){
  console.log(agruments);
  console.log(agruments.length);
}
fn(1,2,3);  
//则输出1，2，3
//3
```

arguements 的值始终会与对应的命名参数同步（修改arguments[i]，会对应修改第i个参数的值），但这并不意味着它们都访问同一个内存地址，这种同步是单向的，修改命名参数的值，不会影响argument[i] 对应的值

```js
function a(a, b) {
  arguments[0] = 100;
  console.log(a, 'this is a');  //100
  a = 50;
  console.log(arguments[0], 'this is argument[0]');  //100
}
let aaa = 1, b = 2;
a(aaa, b)
console.log(aaa); //1
```

伪数组：1.具有length属性  2.按索引凡是储存数据   3.不具有push，pop功能

注意：

对参数使用slice会阻止某些JavaScript引擎中的优化 (比如 V8 - [更多信息](https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments))。如果你关心性能，尝试通过遍历arguments对象来构造一个新的数组。另一种方法是使用被忽视的`Array`构造函数作为一个函数：

```
var args = (arguments.length === 1 ? [arguments[0]] : Array.apply(null, arguments));
```





#### 剩余参数

剩余参数语法（展开运算符）允许我们将一个不定数量的参数表示为一个数组  `...args`

潜规则： `...args`要放到参数的最后，不然会报错

```js
//1.作为传参（rest参数）
function sum(first, ...args) {
	console.log(first); //10
	console.log(args); //20, 30
}
sum(10, 20, 30);
//2.剩余参数配合解构
let students = ['allen', 'berry', 'david'];
let [s1, ...s2] = students;   //s1为allen，s2为[berry. david]的数组
//3.作为参数传入，将数组arr2里的数据划分成若干个，然后一个一个传入数组arr1：（扩展运算符）
arr1.push(...arr2);
```

和arguments不一样的是，arguments得到的是一个对象，而...args中 args得到的是一个数组，可以使用数组方法（filter、some、map、every等）

```js
function data1(){
	console.log(arguments);
}
function data2(...args){
	 console.log(args);
}
```

  利用args手写new

应证了《你不知道的JavaScript》里

1. 创建一个全新的对象
2. 这个新对象会被执行Prototype连接
3. 新对象会绑定到函数调用的this
4. 如果函数没有其他返回值，那么new表达式中的函数调用会自动返回这个新对象

```js
function _new(Constructor, ...args) {
    var obj = {};
    obj.__proto__ = Constructor.prototype;
    var ret = Constructor.apply(obj, args)
    return ret instanceof Object ? ret : obj;
}
function One(a) {
    this.a = a;
}
let a = new One('good');
let b = _new(One, 'good');
console.log(a);
console.log(b);
```



#### 展开运算符

剩余语法(Rest syntax) 看起来和展开语法完全相同，不同点在于, 剩余参数用于解构数组和对象。从某种意义上说，剩余语法与展开语法是相反的：展开语法将数组展开为其中的各个元素，而剩余语法则是将多个元素收集起来并“凝聚”为单个元素。（来源于MDN）

运用于数组

```js
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
arr1 = [...arr2, ...arr1];
```

一般展开运算符只能展开可迭代对象，对于对象，但是可以 使用 `let person1 = {...person2}`进行展开



#### 参数默认值

可以给函数附上默认的参数值，在调用时没有给到的形参会用默认值代替

一般具有默认值的参数都靠后（潜规则）

```js
function add(a, b ,c=10){
	return a + b + c;
}
console.log(add(1, 2));  //13
```



## 3.ES6内置对象的扩展

#### array的扩展

  `...ary`

扩展运算符是和剩余参数相反的原理，它可以将数组或者对象转为用逗号分隔的参数序列  `...ary`

```js
let ary = [1, 2, 3];
console.log(...ary); // 1, 2, 3
//相当于 console.log('1', '2', '3');
```

扩展运算符应用：数组合并

```js
//方法一：
let ary1 = [1, 2, 3];
let ary2 = [3, 4, 5];
let ary3 = [...ary1, ...ary2];
//方法二
ary1.push(...ary2);
```

`...ary`扩展运算符还能把伪数组转换成真正的数组，然后可以使用数组的方法



**可计算属性名**

ES6增加了可计算属性名，可以在文字形式中使用 `[]` 包裹一个表达式当作属性名

```js
const prefix = "foo";
const obj = {
	[prefix + "bar"]: "hello"
}
```



#### string的拓展

ES6新增的创建字符串的方式，使用反引号定义 `let name = allen;`(模板字符串)

模板字符串的特点：

1.可以解析变量，不用字符串拼接`${变量名}`

2.可以换行，撰写较为美观

3.可以调用函数，得到的结果为函数返回值`${函数名()}`

```js
const saySomething = () => '我是函数';
let a = `allen`;
let = `hello, my name is ${name}`;
let html = `<div>
	<span>${saySomething()}</span>
</div>`;
```



#### set数据结构

ES6提供了新的数据结构Set。它类似于数组，但是成员的值都是唯一的，没有重复的值（不会存储重复的值）、自动去重

集合实现了 `iterator`接口，所以可以使用 `for of`

Set本身是一个构造函数，用来生成Set数据结构

```js
const s = new Set(["a", "a","b"]);
console.log(s.size);
const ary = [...s];    //数组去重
```

- `s.add(value)` 添加某个值，返回Set结构本身
- `s.delete(value)` 删除某个值，返回布尔值表示删除成功与否
- `s.has(value)` 返回布尔值，查看是否为Set成员
- `s.clear()` 清空所有成员
- `s.values()`查看所有元素
  - `s[Symbol.iterator]`
- `s.size()` 返回`Set`实例的成员总数

Set结构实例与数组一样，也有forEach方法，用于对每个成员执行某种操作，没有返回值





#### map数据结构

 是一个带键的数据项的集合，就像一个 `Object` 一样。 但是它们最大的差别是 `Map` 允许任何类型的键（key），“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键

（`Object`的键只能为字符串，其实还能为数值或符号，但它们都会转化为字符串）。

Map 的遍历顺序就是插入顺序。

**使用对象**作为键是 `Map` 最值得注意和重要的功能之一

```js
let map = new Map();
let john = { name: "John" };

map.set('1', 'str1');   // 字符串键
map.set(1, 'num1');     // 数字键
map.set(true, 'bool1'); // 布尔值键
map.set(john, 123));    // 对象键
// 还记得普通的 Object 吗? 它会将键转化为字符串
// Map 则会保留键的类型，所以下面这两个结果不同：
alert( map.get(1)   ); // 'num1'
alert( map.get('1') ); // 'str1'
alert( map.size ); // 3
```

当然也可以接受一个数组作为参数

```js
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);
```

方法 + 属性

- `new Map()` —— 创建 map。

- `map.set(key, value)` —— 根据键存储值。

- `map.get(key)` —— 根据键来返回值，如果 `map` 中不存在对应的 `key`，则返回 `undefined`。

- `map.has(key)` —— 如果 `key` 存在则返回 `true`，否则返回 `false`。

- `map.delete(key)` —— 删除指定键的值。

- `map.clear()` —— 清空 map。

- `map.size` —— 返回当前元素个数。

- `map.keys()` —— 遍历并返回所有的键（returns an iterable for keys，返回一个引用的 `Iterator` 对象。它包含按照顺序插入 `Map` 对象中每个元素的key值。）

- `map.values()` —— 遍历并返回所有的值（returns an iterable for values）

- `map.entries()`—— 遍历并返回所有的键值对，entries实际上是引用了 `[Symbol.iterator]`这个属性

  - ```js
    map.entries === map[Symbol.iterator] //true
    ```

只有对同一个对象的引用，Map 结构才将其视为同一个键。这一点要非常小心。

```js
const map = new Map();

map.set(['a'], 555);
map.get(['a']) // undefined
```

map和Object对比：

1.内存占用：给固定大小的内存，Map大约可以比Object多存储50%键值对

2.插入性能：Object和Map插入新的键值对消耗大致相当，不过插入Map在所有浏览器中一般会稍微快一点儿

3.查找速度：与插入不同，从大型Object和Map中查找键值对的性能差异极小，如果涉及大量查找工作（对两个类型而言，查找速度不会随着键值对数量增加而增加），某些情况可能Object更好一点

4.删除性能：删除Objcet属性的性能一直以来饱受诟病，而对于大多数浏览器引擎来说，Map的`delete()`删除操作甚至比插入和查找更快，无疑时Map完胜





#### 弱引用类型

（很多属性、迭代方法不能用 + 保存的元素有限制）

`let s = new WeakSet()`保存的元素必须得是引用类型（对象 / 数组）（DOM元素也是对象，所以也能存储）

`let map = new WeakMap()`的`key` 必须得是引用类型（对象 / 数组）（DOM元素也是对象，所以也能存储）

弱引用不支持遍历方法，只有四个方法可用，`get()`、`set()`、`has()`、`delete()`

正常引用类型的垃圾回收：

- 谁引用这个数据，就引用次数 + 1，

- 原来引用这组数据，后面赋值为null，引用次数 -1 

- 当这组数据引用次数为0，则根据垃圾回收机制会被回收掉

弱引用类型的垃圾回收：

- 当weak弱引用数据时，引用次数不会 + 1

这样的话优点就是，清除变量的时候，不用再去weak弱引用类型那里进行清除（不用赋值null）



#### obj的拓展

利用对象字面量创建对象即直接用`{}`创建对象而不是new出来，而ES6新增**对象字面量的增强写法**

```javascript
const name = 'Allen';
const age = 18;
const height = 1.88;
// ES5对象字面量各类属性、函数写法
obj = {
    name: name,
    age: age,
    height: height,
    run: function () { }
};
// ES6对象字面量各类属性、函数写法
obj2 = {
    name,
    age,
    height,
    run() { }  //此写法仅支持在字面量/类中
};
```

判断一个对象是否为空，可以使用

```js
Object.key(对象名称).length === 0
```



js **判断对象的属性是否存在**

**in运算符** （属性名 in 对象）

 情况1:对象自身属性

```js
var obj={a:1};
"a" in obj//true
```

情况2:对象继承的属性

```js
var objA = {a:1};
var objB = Object.create(A)
"a" in objB //true
```



查找符合条件的第一个对象

`find(function(currentValue, index, arr),thisValue)`

| 参数           | 描述                                                         |
| :------------- | :----------------------------------------------------------- |
| *currentValue* | 必需。当前元素                                               |
| *index*        | 可选。当前元素的索引值                                       |
| *arr*          | 可选。当前元素所属的数组对象                                 |
| *thisValue*    | 可选。 传递给函数的值一般用 "this" 值。<br/>如果这个参数为空， "undefined" 会传递给 "this" 值 |

```js
//实现一步查找符合条件的product
let product = state.cartList.find(item => item.id === payload.id);
```

返回符合测试条件的第一个数组元素值，如果没有符合条件的则返回 undefined。



**对象使用变量名作为键名**

```js
let a = 'name';
let obj = {};
//obj.a = 'Allen'错误！
obj[a] = Allen  //正确
```

又或者

```js
let a = 'name';
let obj = {
    [a]:'Allen'
};
```



## 4.Promise

#### callback hell

回调地狱：callback hell，异步里面套着另一个异步

![](/simple-blog/JavaScript进阶ES6(上)/callback%20hell.jpg)

无法保证异步任务执行顺序：

```js
var fs = require('fs');
fs.readFile('./index.txt', function (err, data) {
    if (err) {
        // throw的作用：抛出异常
        //即1.阻止程序的执行， 2.把错误信息打印到控制台
        throw err;
    }
    console.log(data);
});
fs.readFile('./index2.txt', function (err, data) {
    if (err) throw err;
    console.log(data);
});
fs.readFile('./index3.txt', function (err, data) {
    if (err) throw err;
    console.log(data);
});
```

通过回调嵌套的方式来保证顺序，但由此催生了回调地狱，语法十分丑陋，代码丑陋

```js
fs.readFile('./index.txt', function (err, data) {
    if (err) {
        // throw的作用：抛出异常
        //即1.阻止程序的执行， 2.把错误信息打印到控制台
        throw err;
    }
    console.log(data);
    fs.readFile('./index2.txt', function (err, data) {
        if (err) throw err;
        console.log(data);
        fs.readFile('./index3.txt', function (err, data) {
            if (err) throw err;
            console.log(data);
        });
    });
});
```



#### Promise

为了避免回调地狱嵌套，所以ES6中新增了API：`Promise`（生产微任务）

应用场景：数据来源于多个接口，出现回调嵌套

Promise本身不是异步的，只是里面的任务往往都是异步的

```js
new Promise(resolve => {
	resolve();
	console.log("promise");
}).then(value => console.log("success!"));
console.log("end");
//执行顺序:
//promise
//end
//success!
```

创建一个promise容器 => 而这里容器一旦创建，就开始执行里面的代码 => 容器中存放一个异步任务
默认pending状态，表示正准备去做，即将发生的

![](/simple-blog/JavaScript进阶ES6(上)/promise.png)

**个人觉得：resolve和reject类似于两个callback，然后再外面进行回调罢了**
finally()方法用于指定不管Promise对象最后状态如何（无论结果是fulfilled或者是rejected），都会执行的操作，该方法时ES2018引入的标准

```js
var fs = require('fs');
//封装实例化Promise+读取数据API
function ProReadFile(Path) {
    return new Promise(function (resolve, reject) {
        fs.readFile(Path, 'utf8', function (err, data) {
            if (err) {
                // 失败了，承诺容器中的任务失败
                // 把容器的pending状态改为Rejected
                // 调用reject相当于调用了then方法第二个参数函数
                reject(err);
            } else {
                // 承诺容器中的任务成功
                // 把容器的pending状态改为成功Resolved
                // 调用resolve相当于调用了then方法第一个参数函数
                resolve(data);
            }
        })
    });
};

```

当返回结果成功后，then做指定操作

**使用Promise过程中resolve或reject后，后面代码还会执行**，除非你直接return



**then的说明**：

- `then(resolve(), reject())`

- 成功状态Fulfilled时（resolve，成功则进入下一个then），then方法接收两个参数:1.容器中的resolve函数, 2.容器中的reject函数，这里把then看成一个整体，then会默认返回一个`fulfilled`状态的`Promise`

- 失败状态Rejected（自己设置判断失败的条件，然后reject函数），会回调catch
- 在类里面定义 一个then方法，那么他会包装成一个`Promise`，但是注意这个`Promise` 默认没有状态，需要手动去 `resolve` 或者 `reject`

```js
ProReadFile('./index.txt')
    .then(function (data) {
        console.log(data);
        //当第一个读取成功时，这里返回后面想要继续执行的Promise异步任务，如果没有返回，则后面收到的是undefined
        //我们真正有用的是return 一个Promise对象
   		//如果return 123，则接下来的then的function参数接受的data是123，而且并不是前面的异步任务执行完毕才进入下一个then
        return ProReadFile('./index2.txt');
    }, err => {
        console.log('读取文件失败', err);
    	throw 'error message';           //要调用这个，不然返回undefined，会进入下一个then的resolve的回调
    })
    .then(function (data) {
        console.log(data);
       //第二个读取成功时，这里返回后面想要继续执行的Promise异步任务
        return ProReadFile('./index3.txt');
    }, err => {
        console.log('读取文件失败', err);
    	throw 'error message';
    })
    .then(function (data) {
        console.log(data);
    }, err => {
        console.log('读取文件失败', err);
    })
```

catch效果和写在then的第二个参数里面一样。不过它还有另外一个作用：在执行resolve的回调（也就是上面then中的第一个参数）时，如果抛出异常了（代码出错了），那么并不会报错卡死js，而是会进到这个catch方法中（**推荐**把catch放在链式结构的最后，前面无论第几个出错，都会跑到最后执行这个catch（除非你事先在前面用reject的回调函数处理过错误结果了））。请看下面的代码：

```js
ProReadFile('./index.txt')
    .then(function (data) {
        console.log(data);
        return ProReadFile('./index2.txt');
    }).catch(err => {console.log('文件读取失败', err)})
```





#### 特殊情况

**状态传递**

**注意**：如果resolve或reject中的参数是promise实例对象

```js
var p1 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve('1');
  }, 3000);
})
var p2 = new Promise(function (resolve, reject) {
  setTimeout(function () {
    resolve(p1); // resolve的参数是一个promise对象
  }, 1000);
});
p2
  .then(function (data) {
    console.log('resolve执行')
    console.log(data) 
  }, function (err) {
    console.log(err)
  })
```

3s后依次打印 'resolve执行'  '1' （时间 = max （p1的定时时长, p2的定时时长））

这时p1的状态就会传递给p2，也就是说，p1的状态决定了p2的状态。如果p1的状态是pending，那么p2的回调函数就会等待p1的状态改变；如果p1的状态已经是resolved或者rejected，那么p2的回调函数将会立刻执行。（实际上有点像是promise.allSettle的原理？）

```js
let p1 = new Promise((resolve, reject) => {
	reject("拒绝");
})
new Promise((resolve, reject) => {
	resolve(p1);
}).then(res => {
	console.log("res");
}, err => {
	console.log("err", err);
})
//err 拒绝
```

上面说到p1的状态会传递，所以这里p1的状态是Rejected，传递给了下面这个Promise，执行的是Rejected的回调



**返回值问题**

**注意** 如果返回值为一个普通参数

then方法会返回一个新的promise,这个新promise的value由return的值决定

执行return语句后不是Promise实例，是123，则导致当前then方法返回的promise变为成功状态 pending->fulfilled(Resolved)

在这里它其实是 `return new Promise.resolve(123)`的简写

```js
var p2 = p1.then(function (data) {
    console.log(data);
    return 123456
}, err => {
    console.log('读取文件失败', err);
})
.then(function (data) {
    console.log(data);      // 这个回调一定会被调用，打印123456
}, err => {
    console.log('读取文件失败', err);
})
```

**注意**  甚至没有返回值时，它还会自动给你 pedding -> fulfilled，（因为会返回默认返回值undefined）然后进入下一个then的第一个成功的回调函数里

而反而如果你 `return` 了一个promise实例，在这个实例里面没有调用 `resolve` 或者 `reject`，就进入不了下一个then里面

所以！！！

- 因为异步操作我们才使用`Promise`，而返回值非`Promise`的情况会导致未执行完异步操作则直接进入下一步的then里面，这样和原来未使用Promise语句地执行方式相同，和我们想要有序地进行异步操作的初衷背道而驰

- 所以我们推荐返回值返回一个 `new Promise`，这样等到`Promise`实例调用`resolve / reject`后才会进入下一步`then`，才符合我们的代码规范和初衷！！





**直接抛出异常问题**

**注意** 如果想要返回后直接跳转到下一个then的reject函数里，可以直接 `throw ErrorMessage`

执行throw语句后，导致当前then方法返回的promise变为失败状态 pending->Rejected

因为它其实是 `return new Promise.reject('error message')`的简写

```js
 var p2 = p1.then(function (data) {
        console.log(data);
        throw 'error message';
    }, err => {
        console.log('读取文件失败', err);
    })
    .then(function (data) {
        console.log(data);     
    }, err => {
        console.log('读取文件失败', err);  // 这个回调一定会被调用
    })
```



**双重then问题**

**注意**    then方法提供一个供自定义的回调函数，若传入非函数，则会忽略当前then方法。

以下的例子就是忽略了第一个then，因为它未传入函数，传入的是   '新的值'

```js
let func = function() {
    return new Promise((resolve, reject) => {
        resolve('返回值');
    });
};

let cb = function() {
    return '新的值';
}
func().then(cb()).then(resp => {
    console.warn(resp);
    console.warn('=========');
});  
//输出：返回值 ============
```



**状态问题**

**注意** 在执行promise后，return时都会包装成一个新的Promise实例，但如果then方法还未被调用，则这个实例它的状态还是`pedding`

```js
let p1 = new Promise((resolve, reject) => {
    resolve("fulfilled");
})
let p2 = p1.then(
    val => {console.log(val);},
    err => {console.log(err)}
)
console.log(p1);
console.log(p2);
setTimeout(()=>{
    console.log(p1);
    console.log(p2);
})
//输出
//Promise<resolved>
//Promise<pending>
//fulfilled
//Promise<resolved>
//Promise<resolved>
```



#### Promise的all方法使用

应用场景：处理多个**相互依赖**的异步请求

```js
Promise.all([
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('hello');
        }, 1000);
    }),
    new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve('world');
        }, 2000);
    })
])
// 两个网络请求都完成后才会进入then
// 如果有一个失败，此回调直接失败，失败原因是那个第一个失败的promise
    .then(results => {
    // results是一个数组，它包含以上异步操作的结果
    console.log(results[0], results[1]);
})
```

除了 `all`之外，还有`allSettle`、`race`方法，分别表示

- `allSettled`：只有等到所有这些参数实例都返回结果，不管是`fulfilled`还是`rejected`，包装实例才会结束，返回一个对象数组，每个对象表示对应的promise结果
- `race`：谁执行的快就取决于谁的状态
- `any`：只要参数实例有一个变成`fulfilled`状态，包装实例就会变成`fulfilled`状态；如果所有参数实例都变成`rejected`状态，包装实例就会变成`rejected`状态。

（感觉race方法可能是封装ajax中设置请求超时时长的原理）

有空还可以看看大佬手写promise.all和promise.race https://blog.csdn.net/qq1498982270/article/details/93922893



#### async和await语法糖

async和await时Promise的语法糖

（2021.6.27纠正，我在《红宝书的啃读》篇目解释了它们在内存中的差别）

使用 `await 异步函数()` 相当于 `.then(res => { return 异步函数() })`，处理异步任务，有异步任务 -> 同步任务的感觉，**记得每次都把异步任务放在await后面**，而且每次在`await 异步操作`之后的同步任务就像被放在另一个then里面，会等待异步任务的完成后再执行

```js
async function pro(delay = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("hello");
        }, delay);
    })
}
async function show() {
    for (const item of ["Allen", "Bruce", "Carry"]) {
        let hello = await pro();
        console.log(item);
        console.log("hello");
        console.log("world");
    }
}
show();

// //原始方法
// let p = Promise.resolve();
// for (const item of ["Allen", "Bruce", "Carry"]) {
//   p = p.then((res) => {
//     return pro();
//   }).then(() => {
//     console.log(item);
//	   console.log("hello");
//     console.log("world");
//   })
// }
```

语法糖可以配合 `then`、 `catch`一起使用

```js
async function fn() {
    return await new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("nononon");
            resolve();
        }, 1000);
    })
}
fn().then(res => {
    console.log("success");
}).catch((err) => {
    console.log(err);
})
```

`async + await`实现并行执行 （配合Promise.all）

```js
async function fn(k) {
    return await new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(k);
            resolve(k);
        }, 1000);
    })
}
async function hd() {
    let res = await Promise.all([fn("hello"), fn("world")])
    console.log(res);
}
hd();
```

 `await` 内部实现了 `generator`，其实 `await` 就是 `generator` 加上 `Promise` 的语法糖，且内部实现了自动执行 `generator`





#### Promise缺点

- 无法取消Promise,一旦新建它就会立即执行，无法中途取消。（只能抛出错误中断（throw））(JavaScript高级程序设计有提及到)
- 如果不设置回调函数，promise内部抛出的错误，不会反应到外部。
- 当处于pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。(JavaScript高级程序设计有提及到)
- 可能代码撰写比较繁琐 + 冗长



#### 手写promise
低版本 promise polyfill 也是这个实现方式
函数体内部首先创建了常量 `that`，因为代码可能会异步执行，用于获取正确的 `this` 对象（即this一开始指向MyPromise，后面指向window）

```js
const PENDING = 'pending'
const RESOLVED = 'resolved'
const REJECTED = 'rejected'

function MyPromise(fn) {
    const self = this //此时this指向MyPromise
    self.state = PENDING
    self.value = nullt
    self.resolvedCallbacks = []
    self.rejectedCallbacks = []
    // 待完善 resolve 和 reject 函数
    function resolve(value) {
        //此时this指向window
        if (self.state === PENDING) {
            self.state = RESOLVED
            self.value = value
            self.resolvedCallbacks.map(cb => cb(self.value))
        }
    }
    function reject(value) {
        if (self.state === PENDING) {
            self.state = REJECTED
            self.value = value
            self.rejectedCallbacks.map(cb => cb(self.value))
        }
    }
    // 待完善执行 fn 函数
    try {
        fn(resolve, reject)
    } catch (e) {
        reject(e)
    }
}
// then方法
MyPromise.prototype.then = function (onFulfilled, onRejected) {
    //实际上这里面的的this都指向MyPromise，甚至不换成that也行，但是为了美观和易读性都换成that
    const self = this
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected =
        typeof onRejected === 'function'
        ? onRejected
    : r => {
        throw r
    }
    if (self.state === PENDING) {
        self.resolvedCallbacks.push(onFulfilled)
        self.rejectedCallbacks.push(onRejected)
    }
    if (self.state === RESOLVED) {
        onFulfilled(self.value)
    }
    if (self.state === REJECTED) {
        onRejected(self.value)
    }
}
```

实践

```js
new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(1) // 此时环境下this为window
    }, 2000)
}).then(value => {
    console.log(value)
})
```

这里为什么要用self指代？

```js
function PromisePolyfill(executor) {
  // 这里的 this 指向新创建的 Promise 实例
  console.log(this); // PromisePolyfill { state: 'pending', ... }
  
  function resolve(value) {
    // 但是这里的 this 可能不是 Promise 实例了！
    console.log(this); // 可能是 undefined 或 global 对象
    
    // 如果直接用 this，会出错
    // this.state = 'resolved'; // TypeError: Cannot set property 'state' of undefined
  }
}
```

#### promise嵌套
当resolve传入一个Promise时，会发生Promise解包。

Promise解包机制

```js
// 情况1：resolve传入普通值
const promise1 = new Promise(resolve => {
  resolve('hello');
});

promise1.then(value => {
  console.log(value); // 输出: 'hello'
});

// 情况2：resolve传入一个Promise
const innerPromise = new Promise(resolve => {
  setTimeout(() => resolve('inner value'), 1000);
});

const outerPromise = new Promise(resolve => {
  resolve(innerPromise); // 传入一个Promise
});

outerPromise.then(value => {
  console.log(value); // 输出: 'inner value' (不是Promise对象!)
});
```

关键点：Promise会被自动解包

```js
// 更复杂的例子
const promise1 = Promise.resolve('第一层');
const promise2 = Promise.resolve(promise1);
const promise3 = Promise.resolve(promise2);

promise3.then(value => {
  console.log(value); // 输出: '第一层'
  console.log(typeof value); // 输出: 'string'
});

// 即使嵌套多层Promise，最终都会解包到最内层的值
```
异步解包示例
```js
const asyncPromise = new Promise(resolve => {
  setTimeout(() => {
    resolve('异步结果');
  }, 2000);
});

const wrapperPromise = new Promise(resolve => {
  resolve(asyncPromise); // resolve一个异步Promise
});

wrapperPromise.then(value => {
  console.log('2秒后输出:', value); // 输出: '异步结果'
});
```
rejected状态的处理
```js
const rejectedPromise = Promise.reject('错误信息');

const wrapperPromise = new Promise(resolve => {
  resolve(rejectedPromise); // resolve一个rejected的Promise
});

wrapperPromise
  .then(value => {
    console.log('不会执行到这里');
  })
  .catch(error => {
    console.log('捕获错误:', error); // 输出: '捕获错误: 错误信息'
  });
```

与thenable对象的交互
```js
// thenable对象也会被解包
const thenable = {
  then(resolve, reject) {
    setTimeout(() => resolve('thenable值'), 1000);
  }
};

const promise = new Promise(resolve => {
  resolve(thenable);
});

promise.then(value => {
  console.log(value); // 输出: 'thenable值'
});
```
实际应用场景
```js
// 常见的链式调用场景
function fetchUser(id) {
  return new Promise(resolve => {
    // 这里可能返回另一个Promise
    if (id === 'cached') {
      resolve(Promise.resolve({ name: '缓存用户' }));
    } else {
      resolve(fetch(`/api/users/${id}`).then(res => res.json()));
    }
  });
}

fetchUser('cached').then(user => {
  console.log(user); // 直接得到用户对象，不是Promise
});
```
总结
- 当Promise.resolve()或构造函数中的resolve()传入一个Promise时：
- 外层Promise会等待内层Promise完成
- then回调接收到的是内层Promise的resolved值
- 如果内层Promise被rejected，外层Promise也会被rejected
- 这个过程是递归的，会一直解包到非Promise值



## 5.Error

当运行时错误产生时，`Error` 对象会被抛出。`Error` 对象也可用于用户自定义的异常的基础对象。下面列出了各种内建的标准错误类型。

我们通常在异步请求后使用try catch捕获，在发生请求错误的时候可以throw 一个 `Error`

```js
fetchAPI().then((res) => {
  console.log(res);
  if (!res) throw new Error('当前没有返回值？？： no response');
}).catch((e) => {
  console.log(e);
});
```



#### 其他error

除了通用的 `Error` 构造函数外，JavaScript 还有其它类型的错误构造函数。对于客户端异常，详见[异常处理语句](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Control_flow_and_error_handling#异常处理语句)。

- [`EvalError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/EvalError)

  创建一个 error 实例，表示错误的原因：与 [`eval()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/eval) 有关。

- [`RangeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RangeError)

  创建一个 error 实例，表示错误的原因：数值变量或参数超出其有效范围。

- [`ReferenceError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError)

  创建一个 error 实例，表示错误的原因：无效引用。

- [`SyntaxError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/SyntaxError)

  创建一个 error 实例，表示错误的原因：语法错误。

- [`TypeError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/TypeError)

  创建一个 error 实例，表示错误的原因：变量或参数不属于有效类型。

- [`URIError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/URIError)

  创建一个 error 实例，表示错误的原因：给 [`encodeURI()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/encodeURI) 或 [`decodeURI()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/decodeURI) 传递的参数无效。

- [`AggregateError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/AggregateError)

  创建一个 error 实例，其中包裹了由一个操作产生且需要报告的多个错误。如：[`Promise.any()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise/any) 产生的错误。

- [`InternalError`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/InternalError) 非标准

  创建一个代表 Javascript 引擎内部错误的异常抛出的实例。如：递归太多。

当然也可以自定义Error

```js
class PayError extends Error {
  constructor(code, message, other = null) {
    super(message);
    this.code = code;
    this.other = other;
  }
}
```

