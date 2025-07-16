---
author: Hello
categories: 前端
title: JavaScript基础
description: 'JavaScript相关'
---


## 1.JS的介绍

JS是脚本语言，不需要编译，直接由js解释器逐行进行解释并执行（编译一行，执行一行），（解释型的编程语言）现在也可以基于node.js技术（后台）进行服务器编程

一般编译流程：词法分析（源程序->单词符号），语法分析（单词符号->语法单位），中间代码生成（语法单位->中间代码），代码优化和目标代码的生成（中间代码->目标代码）

实现业务逻辑和页面控制功能，浏览器的JS引擎，也就是JS解释器，用来读取JS代码

#### JS执行

**样式表（Style sheets）**

样式表采用另一种不同的模式。理论上，既然样式表不改变Dom树，也就没有必要停下文档的解析等待它们，然而，存在一个问题，脚本可能在文档的解析过程中请求样式信息，如果样式还没有加载和解析，脚本将得到错误的值，显然这将会导致很多问题，这看起来是个边缘情况，但确实很常见。Firefox在存在样式表还在加载和解析时阻塞所有的脚本，而Chrome只在当脚本试图访问某些可能被未加载的样式表所影响的特定的样式属性时才阻塞这些脚本。



- JS本身是没有预编译的
- 编译器编译（important）： 将所有声明语句，包括变量声明（以var开头）和函数声明（以function开头）里面的标识符（即变量名a和函数名foo）添加到当前作用域中（添加规则是：对var声明的变量来说，如a已存在则忽略该声明，继续编译后面语句;否则就要求在当前作用域声明一个新的变量命名为a，此时a的值是undefined；对于function开头声明的函数来说，函数名foo的声明过程与变量声明一样，不过如果遇到有function声明 2个以上同名函数foo,则后面的函数体会覆盖前面的 ）
- **一切声明的全局变量和未经声明的变量，全归window所有。**

**预解析**

js引擎运行js，分为两步：1.预解析 2.代码执行

预解析：js会把里面所有var还有function提升到当前作用域的最前面（分别为变量提升和函数提升）

变量提升：把所有变量声明提升至当前作用域于最前，但是不提升赋值操作

函数提升：把所有函数提升至当前作用域最前



#### 编译器查询

LHS代表左侧查询（找到变量容器本身），询问作用域有没有该容器

RHS代表右侧查询（但它并非真正意义上的赋值操作右侧，而是“非左侧”）

LHS、RHS是 “赋值操作的左侧和右侧”，但是不代表是 “=赋值操作符的左侧和右侧”

```js
console.log(a) // 一个RHS引用
a = 2;         // 一个LHS引用
```

- 如果RHS查询在所有嵌套的作用域中找到不到该变量，则会抛出一个`ReferenceError`异常
- 声明 + 赋值操作是LHS查找，LHS找不到引擎会帮你在顶层作用域声明一个具有该名称的变量（严格模式除外，严格模式则抛出一个`ReferenceError`）



#### 欺骗词法作用域

如果词法作用域完全由写代码期间函数所声明的位置来定义，那如何欺骗词法作用域呢？

JavaScript有两种机制

eval：接受一个字符串作为参数，将其中的内容是为好像在书写时就存在于程序中这个位置的代码（《红宝书的啃读note(上)》有解释eval方法）

with：with通常被当作重复引用同一个对象中的多个属性的快捷方式，可以不需要重复引用对象本身；尽管with块可以将一个对象处理为词法作用域，但是这个块内部正常的var声明并不会被限制在这个块的作用域中，而是被添加到with所处的函数作用域中

```js
function foo(obj) {
	with(obj) {
		a = 2;
	}
}
var o1 = { a: 1 };
var o2 = {};
foo(o1);
console.log(o1.a); //2
foo(o2);
console.log(o2.a) //undefined
console.log(a); // 2,a被泄露到全局作用域了
```

可以理解为把o1传递给with，with所声明的作用域是o1；而我们将o2设为作用域时，其中并没有a标识符，此时（非严格模式下）进行了LHS查询

`eval`和`new funciton`性能对比 ：https://weblogs.asp.net/yuanjian/json-performance-comparison-of-eval-new-function-and-json



#### JS的组成

JavaScript语法：ECMAScript

页面文档对象模型：DOM

浏览器对象模型：BOM

**ECMAScript**

它往往被称为JavaScript或JScript，但实际上后两者是ECMAScript语言的实现和拓展

**DOM**

它是标准编程接口，通过DOM提供的接口可以对页面上各种元素进行操作（大小位置颜色）

**BOM**

它提供了独立于内容，可以与浏览器窗口进行互动的对象，操作浏览器窗口比如弹出窗，控制浏览器跳转，获取分辨率等



#### JS的插入方式

 类似于CSS，有行内式，内嵌式`<script>xxxx</script>`

还有从外部引入：(script标签中间别写代码)

```html
<script src="xx.js"></script>
```



## 2.JS基本功能介绍

#### 输入输出

```js
alert(msg);  //弹出警示框
console.log(msg) //打印输出信息，是控制台输出，给程序猿测试用的
prompt(info) //弹出输入框，提供用户输入 但是都是以字符的形式输入
```

console.log()会在浏览器控制台打印出信息

console.dir()可以显示一个对象的所有属性和方法

#### 定义

使用var，自动确定类型（JS拥有动态类型）

var

- 如果没有事先声明var，直接使用，会创建一个全局变量
- var存在声明提升

#### 功能

isNaN()   判断是否**非**数字

typeof 变量名    查看数据类型

#### 转换

转字符串： 

​	变量名.toString()    number类型时，变量名.toString(16) 转换成16进制字符串

​	强制转换：String(变量名)      

​	隐式转换：变量名+"xxxx"(拼接字符串)

String转数字类型：

（1）String->int：    parseInt(String)；`parseInt()`函数将给定的字符串以指定的基数解析为整数。           

（2） String->float:    parseFloat(String)；

（3）Number强制转换（String转数值）：Number(String)    但是Number转换字符串是相对复杂且有点反常规，建议使用parseInt，比如：`Number()`在不用new操作符时，可以用来执行类型转换。如果无法转换为数字，就返回NaN。
像“123a”，`parseInt()`返回是123，`Number()`返回是NaN。

（4）利用减乘除（没有+）：String-String或String-int之类的

String转ascii码

```js
var str = "A";
str.charCodeAt();  // 65

var str1 = 'a';
str1.charCodeAt();  // 97
```

Ascii码转String

```js
//将对应的编码值转为字符
var charValue = String.fromCharCode(codeValue);
```



#### 运算符

18==‘18’  成立true，默认转换数据类型   ===为全等需要完全一致， 18===‘18’为false

逻辑与短路运算：123&&456，返回456，左式为真返回右式子，为假返回左式

逻辑或短路运算：123||456，返回123，左式为真返回左式子，为假返回右式

三元表达式：   `条件表达式？表达式1：表达式2`，条件为真返回表达式1，为假返回表达式2

#### 数组

数组名.length为数组的长度

**数组增加元素** （1）直接设定数组长度arr.length=xx,多出来的变成空

（2）arr数组有三个元素，直接arr[3]=xx，进行新增元素



#### 数据类型：

基本数据类型（简单数据类型）

- Boolean
- Null
- Undefined
- Number
- BigInt：`BigInt`数据类型的目的是比`Number`数据类型支持的范围更大的整数值。在对大整数执行数学运算时，以任意精度表示整数的能力尤为重要。使用`BigInt`，整数溢出将不再是问题。
- String
- Symbol

收录于 https://tc39.es/ecma262/#sec-primitive-value

A primitive value is a member of one of the following built-in types: **Undefined**, **Null**, **Boolean**, **Number**, **BigInt**, **String**, and **Symbol;**



复杂数据类型

- Object

![](/simple-blog/JavaScript基础/javaScript_base.jpg)

总结：USONB  （you are so niubi）

u：undefined

s：string、symbol

o：object

n：null、number

b：boolean，bigint



## 3.判断JS数据类型的四种方法

#### **typeof** 

**typeof** 是一个一元运算，放在一个运算数之前，运算数可以是任意类型。

返回值是一个字符串，该字符串说明运算数的类型。

所以经常搭配使用：`if(typeof target === 'object' && target !== null){}`

注意：

- `typeof null` 返回 object
- `typeof 函数` 返回 function

- 以创建对象的方式（显示创建原始值包装类型实例），用typeof判断是否为object都会为true，它不能精确到具体的object

  ```js
  let s = new String('abc');
  typeof s === 'object'// true
  s instanceof String // true
  ```

js 在底层存储变量的时候，会在变量的机器码的低位1-3位存储其类型信息

- 000：对象
- 010：浮点数
- 100：字符串
- 110：布尔
- 1：整数
- `null`：所有机器码均为0（这就是type null 返回 object的原因）
- `undefined`：用 −2^30 整数来表示

红宝书阐述：`typeof`虽然对原始值很有用，但是对引用值用处不大。。



#### **instanceof** 

- **instanceof** 用于判断一个变量是否某个对象的实例，如 `var a=new Array();alert(a instanceof Array);` 会返回 true

- 当然，`instanceof` 也可以判断一个实例是否是其父类型或者祖先类型的实例。

  官方解释：**`instanceof`** **运算符**用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的**原型链**上。

  注意：

  - 数组可以被 `instanceof` 判断为 Object
  - 只能判断对象，对原始类型(简单数据类型)不能判断
  - 对于 `value instanceof Array`，我们还可以使用 `Array.isArray(value)`，后者是ECMAScript提供为了解决多框架涉及多版本Array的`instancof`升级版方法
  

手写instanceOf

```js
function myInstanceof(left, right) {
    let proto = left.__proto__;
    while (true) {
        if (proto == null) return false;
        if (proto == right.prototype) return true;
        proto = proto.__proto__;
    }
}
```



#### **constructor**

- **constructor**

  ```js
  [].constructor.name;  //Array
  ''.constructor.name;  //String
  alert(c.constructor === Array) ----------> true
  alert(d.constructor === Date) -----------> true
  alert(e.constructor === Function) -------> true
  ```
  
  注意： constructor 在类继承时会出错， null 和 undefined 是无效的对象，因此是不会有 constructor 存在的



#### **toString**

- **toString**，利用toString打印出原型对象

  ```js
  Object.prototype.toString.call('') ;  // [object String]
  Object.prototype.toString.call(1) ;   // [object Number]
  Object.prototype.toString.call(true) ;// [object Boolean]
  //使用Reflect更棒！
  console.log(Reflect.toString.call(''));  // [object String]
  console.log(Reflect.toString.call(1));  // [object Number]
  console.log(Reflect.toString.call(true));// [object Boolean]
  ```
  
  



## 4.函数

```js
//1.利用函数关键字自定义函数
function 函数名(参数) {
	函数体
}
//如下：
function sort(arr){
}
//2.匿名函数
var fun=function(){
}
//调用
fun();
```

函数没有return，则返回的是undefined

**注意**在函数内部没有声明直接赋值的变量，也属于全局变量





## 5.对象

对象一定是一个具体的对象，而不是泛指的东西

属性：事物的特征，用对象的属性表示

> 函数永远不会属于一个对象，所以把对象内部引用的函数称之为“方法”不太妥，严格意义上来说只是对该函数的引用
>

#### **利用对象字面量创建对象**

```js
var obj ={
	uname:'xx',
	age:18,
	sex:'man',
	say:function(){
	 console.log('good');
	}
}
//调用对象属性(2种)
obj.uname
obj['uname']
```

(1)键 属性名: 值 属性值

(2)用逗号隔开

(3)方法冒号后面跟的一个匿名函数



#### **利用new Object创建对象**

再赋值的时候创建属性，因此此方法效率不高

```javascript
var obj = new Object
obj.uname='xx';
obj.age=18;
obj.say=funciton(){}
```

（1）利用等号赋值添加对象的属性和方法

（2）每个属性和方法用分号



#### **利用构造函数创建对象**

其过程也称为对象的实例化,构造函数是泛指的某一大类，对象是具体的事物

```javascript
function 构造函数名(){
	this.属性=值;
	this.方法=function（）{}
}
```

1.使用构造函数，构造函数名字首字母最好大写
如 function Star()
2.构造函数不需要return
3.使用函数
new 构造函数名();即构造一个对象，如new Array()，创建一个数组对象
4.属性方法前必须加this
如this.name=传参name        this.song = function（传参）{}

#### 遍历对象

```javascript
for (const k in obj){     //obj为对象
	console.log(k);     //k输出的是属性名
	console.log(obj[k]);//得到的是属性值
}  //我们使用for in 喜欢var k或者key
   //或者使用
for (const item of 迭代对象) {
    console.log(item); //每个属性的属性值，不过仅适用于可遍历对象，比如map、set、数组之类的，
                       //普通对象不行，遍历普通对象推荐使用Object.keys
}
```



#### 对象删除键值对

```js
var json = {
    name:'张三',
    age:'23'
};
delete  json.age;
```





## 6.简单类型和复杂类型

如果有个数据类型打算作为存储对象，暂时没想好放什么，可以先放null

简单数据类型（值类型）：string（但是string数值不可变）、number、boolean、undefined、null、symbol、bigint

简单数据类型放入栈里面（操作系统），栈里开辟的空间存放的是值  （用函数传参是不会影响变量的值）



复杂数据类型（引用类型）：Object、 Array、 Date

复杂数据类型放入堆里面（操作系统），于栈里存放地址，十六进制表示，然后这个地址指向堆里的数值；一般由程序员分配释放，若程序员不释放，由垃圾回收机制释放 （用函数传参是会影响对象的值）

但是复杂数据类型null赋值时断了地址联系

```js
var obj = new Object();
obj.name = 'allen';
var obj2 = obj;
console.log(obj2.name);  //allen
obj.name = 'bllen';		 //改对象
console.log(obj2.name);  //bllen
obj = null; 			 //改变量
console.log(obj2.name);  //bllen
```

但是JS里没有堆栈的概念，只是通过堆栈的方式理解代码的执行方式



## 7.其他

#### swiper插件的使用

官网地址：https://www.swiper.com.cn

（1）下载并解压包后，把其中的swiper.min.js和swiper.min.css放入网页文件夹的js和css中

（2）官网找到类似的案例，复制html，css和js（进入官网swiper演示中，然后新窗口打开，查看网页源代码）

（3）根据需求修改模块





#### 浅拷贝和深拷贝

**深拷贝和浅拷贝是只针对object和Array这样的引用数据类型的**

##### 1.赋值

当我们把一个对象赋值给一个新的变量时，**赋的其实是该对象在栈中的地址，而不是堆中的数据**，只要修改了里面的的值，原来都都会受到影响

##### 2.浅拷贝

**他会创建一个新对象**，这个对象有着原始对象属性值的一份精确拷贝。如果属性基本类型，拷贝的基本类型的值（修改后原来的变量的值不会受到影响）；如果属性是内存地址（引用类型，比如数组、对象），拷贝的就是内存地址，即其中一个变量修改了这个地址存放的对象，则另外一个会受到影响

数组的浅拷贝可以使用：`Array.prototype.concat()`、`Array.prototype.slice()`、`Array.from(arr)`，他们不会修改原数组，只是返回了一个浅拷贝的新数组

```js
let arraylike = {
	0: 'a',
	1; 'b',
	length: 2
};
let arr2 = Array.from(arraylike);  //[a, b]
```

对象可以使用 ：`Object.assgin()`或者 `let obj2 = {...obj1}` (（ECMAScript 2018规范新增特性）)

##### 3.深拷贝

所谓”深拷贝”，就是能够实现真正意义上的数组和对象的拷贝，使得两个对象不会相互影响

具体深拷贝的手写我在 “JavaScript进阶ES5+面向对象”篇章中写过



![](/simple-blog/JavaScript基础/kaobei.png)





#### 每种for的差异

从基本的for循环，到for in、 for of和数组的forEach，差异性在面试的时候有被问到，在这里记录一下

 网络上通过高数量级数组的遍历测试（地址：https://blog.csdn.net/qq_24357165/article/details/82748976），得出：

时间上：for循环遍历 < for...of遍历 < forEach遍历 < for...in遍历 < map遍历

for … in语法是第一个能够迭代对象键的JavaScript语句，循环对象键（{}）与在数组（[]）上进行循环不同，引擎会执行一些额外的工作来跟踪已经迭代的属性。

而for of 实现的是迭代器 `[Symbol.iterator]`方法实际上也是走的原生的for遍历，通过索引获取数组的数值，只是在函数里多增加了next、done判断遍历的结束与否

（实际上我个人认为，内部全都是以传统for为基准实现的遍历，时间和空间的额外花费取决于该遍历方法的调用占用）



#### 递归知识

尾递归：https://zhuanlan.zhihu.com/p/36587160

递归的简化模型https://zhuanlan.zhihu.com/p/136511316



#### 其他中的其他

小程序中使用eval / new Function：https://zhuanlan.zhihu.com/p/34191831?utm_source=wechat_session&utm_medium=social&utm_oi=757127387623206912&utm_campaign=shareopn





## 8.JS数值精度

JavaScript 内部，所有数字都是以64位浮点数形式储存，即使整数也是如此。所以，`1`与`1.0`是相同的，是同一个数

而位操作并不直接应用到64位，而是先把值转换为32位整数，在进行位操作，最后再把32位转换为34位存储起来

![](/simple-blog/JavaScript基础/jingdu.png)

- `NaN`是 JavaScript 的特殊值，表示“非数字”（Not a Number），主要出现在将字符串解析成数字出错的场合。

  - ```js
    typeof NaN // 'number'
    NaN === NaN // false，NaN不等于任何值
    Boolean(NaN) // false
    ```

- JavaScript 内所有数字都是浮点数，若遇到需要整数才能运算的情况，JavaScript 会自行将64位浮点数转成32位整数，再进行运算，而这个转换过程，便导致了精度丢失。

  - 比如：

```js
0.1 + 0.2
// 0.30000000000000004
0.1 + 0.7
// 0.7999999999999999
0.3 / 0.1
// 2.9999999999999996
(0.3 - 0.2) === (0.2 - 0.1)
// false
```

**为什么0.1+0.2===0.3 //false ？？？？**

在计算机里的数表示方式都是二进制，so

```js
0.01  = 1/4  = 0.25  ,太大
0.001 =1/8 = 0.125 , 又太小
0.0011   = 1/8 + 1/16 = 0.1875 , 逼近0.2了
0.00111 = 1/8 + 1/16 + 1/32 = 0.21875  , 又大了
0.001101 = 1/8+ 1/16 + 1/64 = 0.203125  还是大
0.0011001 = 1/8 + 1/16 + 1/128 =  0.1953125  这结果不错
0.00110011 = 1/8+1/16+1/128+1/256 = 0.19921875
```



#### 整数精度

而整数的精度最多只能到53个二进制位，这意味着，**绝对值** **小于** 2^53 的整数，即 (-2^53, 2^53) 

```js
Math.pow(2, 53)
// 9007199254740992【未丢失】

Math.pow(2, 53) + 1
// 9007199254740992【丢失】

Math.pow(2, 53) + 2
// 9007199254740994【未丢失】

Math.pow(2, 53) + 3
// 9007199254740996【丢失】

Math.pow(2, 53) + 4
// 9007199254740996【未丢失】
```

可以使用`Number.isSafeInteger(变量)` 方法来判断一个值是否为安全整数，即该整数是否在 (-2^53, 2^53) 范围内



#### 指数范围

根据 IEEE 754 标准，64位浮点数的指数部分的长度是11个二进制位，意味着指数部分的最大值是2047（211-1 = 2047）。分出一半表示正数，一半表示负数，则 JavaScript **能够表示的数值范围**为 (2^1024, 2^-1023) 【开区间】，超出这个范围的数无法表示。

正向溢出与负向溢出

- 【正向溢出】如果一个数大于等于 2^1024，那么就会发生 “正向溢出”，即 JavaScript 无法表示这么大的数，这时就会返回Infinity
- 【负向溢出】如果一个数小于等于 2^-1075（指数部分最小值-1023，再加上小数部分的52位），那么就会发生为 “负向溢出”，即 JavaScript 无法表示这么小的数，这时会直接返回0。

```js
// 正向溢出
Math.pow(2, 1024) // Infinity【正数数值非常大，无法表示，正向溢出，只能返回正无穷】
// 负向溢出
Math.pow(2, -1075) // 0【正数数值非常小，无法表示，负向溢出，返回 0】
```

所以无穷大、无穷小由此得来

无穷大：`Number.MAX_VALUE`，JavaScript里最接近infinity的正值

无穷小：`Number.MIN_VALUE`，JavaScript 里**最接近 0 的正值**，而不是最小的负值。



#### 浮点数精度修复

为了避免此类事情的发生

```js
(0.3 - 0.2) === (0.2 - 0.1)
// false
```

ECMA 给出的解决方法是：将浮点数分别乘 10n 转为整数，再除以 10n。
`((0.01 * 100) + (0.02 * 100)) / 100 === 0.03;`

```js
// 来源：https://www.iteye.com/blog/talentluke-1767138

// 两个浮点数求和
function accAdd(num1, num2) {
  var r1, r2, m;
  try {
    r1 = num1.toString().split('.')[1].length;
  } catch(e) {
    r1 = 0;
  }
  try {
    r2 = num2.toString().split(".")[1].length;
  } catch(e) {
    r2 = 0;
  }
  m = Math.pow(10,Math.max(r1,r2));
  // return (num1*m+num2*m)/m;
  return Math.round(num1*m+num2*m)/m;
}
```



还有一个办法就是，把小数部分逐个转换成字符，然后一个一个作为单个数字去做加减乘除，实现大数加减乘除，实现方法可能比较繁琐。



#### 使用BigInt

要创建BigInt，只需要在数字末尾追加n即可。

```js
console.log( 9007199254740995n );    // → 9007199254740995n	
console.log( 9007199254740995 );     // → 9007199254740996
复制代码
```

另一种创建BigInt的方法是用BigInt()构造函数、

```js
BigInt("9007199254740995");    // → 9007199254740995n
```

注意：

- BigInt不支持一元加号运算符，这可能是某些程序可能依赖于 + 始终生成 Number 的不变量，或者抛出异常。另外，更改 + 的行为也会破坏 asm.js代码

  ```js
  +10n;         // → TypeError: Cannot convert a BigInt value to a number	
  ```

- 因为隐式类型转换可能丢失信息，所以不允许在bigint和 Number 之间进行混合操作



## 9.捕获异常

try catch无法捕获异步任务的错误，这跟浏览器的执行机制有关。异步任务由 eventloop 加入任务队列，并取出入栈(js 主进程)执行，而当 task 取出执行的时候， main 的栈已经退出了，也就是上下文环境已经改变，所以 main 无法捕获 task 的错误。

```js
// 异步任务
// 捕获不到
const task = () => {
  setTimeout(() => {
   throw new Error('async error')
 }, 1000)
}
// 主任务
function main() {
  try {
    task();
  } catch(e) {
    console.log(e, 'err')
    console.log('continue...')
  }
}
```

而微任务promise中， promise.catch 才可以捕获，所以用 Promise 一定要写 catch 啊

然而通过 async await 的方式，是可以在try catch中捕获异常的

```js
async function main () {
  try {
    const res = await fetchFailure();
    console.log(res, 'res');
  } catch(e) {
    console.log(e, 'e.message');
  }
}
```



`console.error("服务端数据格式返回异常，使用本地缓存数据", erorr);` 输出台打印红色字体



运行时异常代码也捕获不到

2."运行时异常"是指非SyntaxError，也就是语法错误是无法捕获的，因为在解析JavaScript源码时就报错了，还怎么捕获呢～～

```js
// 非法标识符a->b，真心捕获不到啊亲～！
try{
  a->b = 1
} catch(e){
  console.log(e)
}
```

