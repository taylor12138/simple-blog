---
author: Hello
categories: 前端
pubDate: 2021-9-1 
title: JS内置对象和包装
description: 'js相关'
---

## 1.内置对象

JavaScript中对象分为自定义对象，内置对象，浏览器对象，前两种属于ECMAScript；第三个浏览器对象是js特有的

Javascript提供了多个和内置对象：Math、Date、Array、String

可以通过MDN/W3C来查询内置对象的使用

MDN的网址：https://developer.mozilla.org/zh-CN/

### （1）Math对象

| 方法                              | 参数     | 效果                                                         |
| --------------------------------- | -------- | ------------------------------------------------------------ |
| `Math.abs(x)`                     | 一个数值 | 得到绝对值，并且会隐式转换比如'-1' -> 1, 'pink -> NAN'       |
| `Math.PI`                         |          | 圆周率                                                       |
| `Math.floor(x)`                   | 一个数值 | 向下取整                                                     |
| `Math.ceil(x)`                    | 一个数值 | 向上取整                                                     |
| `Math.round(x)`                   | 一个数值 | 四舍五入                                                     |
| `Math.max(value1[,value2, ...]) ` | 一组数值 | 最大值, x为0或多个值。在 ECMASCript v3 之前，该方法只有两个参数。 |
| `Math.min(value1[,value2, ...)`   | 一组数值 | 最小值，同上                                                 |
| `Math.random()`                   |          | 返回一个浮点数,  伪随机数在范围从**0到**小于**1**            |
| `Math.sqrt(x)`                    | 一个数值 | 返回一个数的平方根                                           |
| `Math.pow(x, y)`                  | 两个数值 | 返回基数（x）的指数（`y`）次幂                               |

```javascript
//实现两个数之间的随机整数
Math.floor(Math.random()*(x_max-x_min+1))+x_min
```

函数 [toFixed(n)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed) 将数字舍入（四舍五入）到小数点后 `n` 位，并以**字符串**形式返回结果。如果后续还想再用该数字，记得转回number

```javascript
let num = 12.34;
alert( num.toFixed(1) ); // "12.3"
```



### （2）Date对象

是一个构造函数，可以使用new调用（但也可以直接调用其方法）

| 方法                         | 效果                                                         |
| ---------------------------- | ------------------------------------------------------------ |
| `new Date()`                 | 返回一个标准时间（复杂的字符串结构）                         |
| `Date.now()`                 | 返回一个number，自 1970 年 1 月 1 日 00:00:00 (UTC) 到当前时间的毫秒数，H5新增 |
| `new Date(xx).getFullYear()` | 返回年份                                                     |
| `new Date(xx).getMonth()+1`  | 返回月份                                                     |
| `new Date(xx).getDate()`     | 返回日期                                                     |
| `new Date(xx).getHours()`    | 返回时                                                       |
| `new Date(xx).getMinutes()`  | 返回分                                                       |
| `new Date(xx).getSeconds()`  | 返回秒                                                       |
| `new Date(xx).valueOf()`     | 返回从1970年1月1日0时0分0秒（UTC，即协调世界时）到该日期的毫秒数。 |
| `new Date(xx).getTime()`     | 同上                                                         |

```javascript
var date = new Date();  //无参数，返回当前系统的时间,复杂的字符串结构
//常用的两种时间写法
var date = new Date(2020, 10, 1);  //指定固定日期
var date = new Date('2020-10-1 8:8:8');
var d=new Date().toLocaleTimeString()    //本地时间把 Date 对象的时间部分转换为字符串
```

由于开发中时间戳转换为日期太过于常见，所以网上有直接封装好的（使用的是正则表达式）的函数，直接格式化即可

日期类转换到原始值能使用 `toString()`

注意：`const date = new Date('2020-10-1 8:8:8');`这种写法，会导致安卓端和ios端的时间上有所不同，并且有明显的差异！！最好以

`const birthday = new Date(1995, 11, 17, 3, 24, 0);`的形式进行命名

`const date = new Date('2020/10/1 8:8:8');`也可以，但是兼容性好象不如逗号分隔的形式



**深究**

1.该问题从表面上看，是Chrome浏览器和Safari对同一JavaScript代码片段解析不同造成

2.发现经过调查发现， iOS 上使用短横杠分割日期时，JS 引擎会自动以 ISO 8601 日期时间表示方法去解析这个字符串，但因为 ISO 8601 的标准格式为 YYYY-MM-DDTHH:mm:ss.sssZ（参考 ECMAScript Language Specification)，所以就导致了解析失败的情况出现。

3.对于 iOS 下的前端项目，无论是普通的网页项目还是小程序项目，都要小心处理 Date 字符串，它们使用 iOS 的 webkit 内核，所有都存在同样的兼容性问题。

平时我们看到的的是RFC2822 格式

ECMAScript基于ISO 8601 的标准格式为 YYYY-MM-DDTHH:mm:ss.sssZ

所以我们硬要写“-”，应该写为（北京时区是GMT+08:00，也就是本初子午线 + 8小时）

`new Date('2021-08-26T12:00:00+08:00')`



官方推荐：因此最好还是手动解析日期字符串（在需要适应不同格式时库能起到很大帮助）。* 

推荐的一个时间库：http://momentjs.cn/docs/



### （3）Array对象

**填充数组**

数组的每个槽位可以储存任意类型数据

```javascript
var arr1 = new Array(2,3);     //相当于[2,3]的数组
var arr = new Array(5).fill(); //创造一个数组长度为5的数组，但是此方法会自动往里面填undefined值，让数组最起码有值了！
var arr = new Array(5).fill(0);//也可以填写你想要的值，比如0
```

但是如果想创建一个用空对象填充的数组话，实际上我们在使用同一个 空对象 / 空数组进行提埃填充，这样会造成他们都是联动的，牵一发而动全身

```js
let a = new Array(5).fill({});
console.log(a); // [{}, {}, {}, {}, {}]
a[0].name = '张三';
console.log(a); // [{name: "张三"}, {name: "张三"}, {name: "张三"}, {name: "张三"}, {name: "张三"}]
```

但是可以使用这个方法创建二维数组（接收一个函数，用来对每个元素进行处理，将处理后的值放入返回的数组）

```js
const arr = Array.from(Array(n), () => Array(m).fill(0));
const arr2 = new Array(n).fill(0).map(() => new Array(m).fill(0));
//from的使用
console.log(Array.from('foo'));                   // expected output: Array ["f", "o", "o"]
console.log(Array.from([1, 2, 3], x => x + x));   // expected output: Array [2, 4, 6]
```



**删除 / 连接数组**

```js
arr.splice(2,1,"William");                                    //从index序号为2地开始，删除掉一个，并添加william元素
arr.concat(arrayX, arrayX, arryX)                             //concat()参数可以传入数组或者值。
                                                              // 它可以连接两个或多个数组
```



##### 排序

```js
arr1.sort(function(a,b) {
    return a-b;      //从小到大 
});                  //该排序可能是快排等结合的很优算法。升序 如果不加function则为按照字符串排序
```

`arr.sort([compareFunction])`，回影响到原来的数组

`compareFunction` 可选

用来指定按某种顺序进行排列的函数。如果省略，元素按照转换为的字符串的各个字符的Unicode位点进行排序。

- `firstEl`

  第一个用于比较的元素。

- `secondEl`

  第二个用于比较的元素。

  - 如果 `compareFunction(a, b)` 小于 0 ，那么 a 会被排列到 b 之前；
- 如果 `compareFunction(a, b)` 等于 0 ， a 和 b 的相对位置不变。备注： ECMAScript 标准并不保证这一行为，而且也不是所有浏览器都会遵守（例如 Mozilla 在 2003 年之前的版本）；
  - 如果 `compareFunction(a, b)` 大于 0 ， b 会被排列到 a 之前。
- `compareFunction(a, b)` 必须总是对相同的输入返回相同的比较结果，否则排序的结果将是不确定的。



##### V8排序策略

排序策略大概是：

设要排序的元素个数是n：

- 当 n <= 10 时，采用优化的`插入排序`

- 当 n > 10 时，采用

  三路快速排序

  - 10 < n <= 1000, 采用中位数作为哨兵元素
  - n > 1000, 每隔 200~215 个元素挑出一个元素，放到一个新数组，然后对它排序，找到中间位置的数，以此作为中位数






##### 其他

| 方法                                              | 参数                                                         | 效果                                                         |
| ------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `arr instanceof Array`                            |                                                              | 检验是否为数组，是返回true，否则false                        |
| `Array.isArray(x);`                               | 数组                                                         | 同上,H5新增,但这个效果好，防止多个不同版本的Array构造函数    |
| `arr.push(xx); `                                  | n个元素                                                      | 在数组末尾增加数组元素，返回结果是新数组的长度               |
| `arr.unshift(xx); `                               | n个元素                                                      | 在数组开头增加数组元素，返回结果是新数组的长度               |
| `arr.pop(); `                                     |                                                              | 删除数组的最后一个元素  返回值为被删除的元素值               |
| `arr.shift();`                                    |                                                              | 删除数组的第一个元素  返回值为被删除的元素值                 |
| `arr.reverse()`                                   |                                                              | 翻转数组，返回颠倒后的数组，该方法会改变原数组。             |
| `arr.indexOf(xx)`                                 | 1.查找的元素；2.查找开始处（可选）                           | 返回该数组元素的索引号（第一个满足条件的索引号），找不到返回-1。 |
| `arr.includes(xx)`                                | 1.查找的元素；2.查找开始处（可选）                           | 返回布尔值是否含有该元素，判断元素是否存在                   |
| `arr.lastindexOf(xx)`                             | 1.查找的元素；2.查找开始处（可选，从此位置开始逆向查找）     | 返回该数组元素的索引号（最后一个满足条件的索引号），从后往前找，找不到返回-1。 |
| `arr.toString()`                                  |                                                              | 转换成字符串，逗号分隔                                       |
| `arr.join(x);  `                                  | 分隔符                                                       | 用指定分隔符分割不同的数组元素，并转换成字符串               |
| `arr.splice(i, n, [x3, x4])`                      | 1.开始下标；2.删除的元素个数；3.添加进数组的元素（可选，可以多个，添加的第一个为开始下标） | 用于删除多组元素并且添加新元素，返回一个数组保存内容（此方法会改变原数组。） |
| `arr.slice([begin[, end]])`                       | 1.提取起始处的索引，2.终止索引（不包含end）                  | 返回一个新的数组对象，这一对象是一个由 `begin` 和 `end` 决定的原数组的**浅拷贝**（从 `begin`到 `end-1` ，不包括`end`）；可以传入负数，这是从结尾开始截取。原始数组不会被改变。 |
| `arr.concat(value1[, value2[, ...[, valueN]]])`   | 可传入1个/多个数组或者值                                     | 用于合并两个或多个数组。此方法不会更改现有数组，而是返回一个新数组。 |
| `arr.from(.from(arrayLike[, mapFn[, thisArg]]));` | 想要转换成数组的伪数组对象或可迭代对象。                     | 从一个类似数组或可迭代对象创建一个新的，浅拷贝的数组实例。   |
| `arr.flat()`                                      |                                                              | 直接扁平化多维数组 -> 一维数组                               |
| `arr.find(callback[,thisArg])`                    | callback为每一项执行的函数，可以类比到forEach的callback，函数中返回true则返回该element | 返回数组中满足条件的**第一个元素的值**，如果没有，返回undefined |
| `arr.findIndex()`                                 | 同上                                                         | 同上，找的是索引值                                           |



## 2.Object部分方法

#### **Object.create**

`Object.create(proto[, propertiesObject])`

- `proto`必填参数，是新对象的原型对象。注意，如果这个参数是`null`，那新对象就彻彻底底是个空对象，没有继承`Object.prototype`上的任何属性和方法，如`hasOwnProperty()、toString()`等。
- `propertiesObject`提供一系列附加功能，指明每个属性对应的特性

```js
const person = {
  isHuman: false,
  printIntroduction: function () {
    console.log(`My name is ${this.name}. Am I human? ${this.isHuman}`);
  }
};
const me = Object.create(person); // me.__proto__ === person
me.name = "Matthew"; // name属性被设置在新对象me上，而不是现有对象person上
me.isHuman = true; // 继承的属性可以被重写
me.printIntroduction(); // My name is Matthew. Am I human? true
```

使用 `Object.create()`实现完美继承机制

```js
// 子类续承父类
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;
```

手写`Object.create()`

```js
Object.mycreate = function(proto, properties) {
    function F() {};
    F.prototype = proto;
    if(properties) {
        Object.defineProperties(F, properties);
    }
    return new F();
}
/*其实也可以简化成
Object.mycreate = function(proto, properties) {
    function F() {};
    F.prototype = proto;
    F.prototype.constructor = F;
    return new F();
}
*/
var hh = Object.mycreate({a: 11}, {mm: {value: 10}});
console.dir(hh);
```



#### **Object.keys(obj)**

`Object.keys(obj)`

参数

- obj

  要返回其枚举自身属性的对象。

返回值

- 一个表示给定对象的所有**可枚举属性**的字符串数组。

  如果你想获取一个对象的所有属性,，甚至包括不可枚举的，请查看[`Object.getOwnPropertyNames`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyNames)。（红宝书）



#### **Object.is()**

`Object.is()`确定两个值是否[相同](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Equality_comparisons_and_sameness)。如果以下条件之一成立，则两个值相同：

- 两者 [`undefined`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined)
- 两者 [`null`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null)
- 两者`true`或两者`false`
- 相同长度的两个字符串以相同的顺序具有相同的字符
- 两者都是同一个对象（意味着两个值都引用了内存中的同一个对象）
- 数字和
  - 两者 `+0`
  - 两者 `-0`
  - 两者 [`NaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN)
  - 或两者都非零且两者都不是[`NaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN)且两者都具有相同的值

这是*不*一样根据等于 [`==`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators#equality)运算符。该 `==`运营商应用各种强制转换双方（如果它们不是同一类型）测试相等（导致这种行为像以前一样 `"" == false`是`true`），但`Object.is`不强迫任何一个值。

这也*不同于*根据[`===`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators#identity)运营商的平等 。`Object.is()`和之间的唯一区别在于`===`它们对带符号零和 NaN 的处理。例如，`===` 运算符（和`==`运算符）将数值`-0` 和`+0`视为相等。此外，`===`运算符将 [`Number.NaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/NaN)和[`NaN`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NaN)视为不相等。

```js
console.log(Object.is(true, 1)); //false
console.log(Object.is({}, {}));  //false
console.log(Object.is("2", 2));  //false

console.log(Object.is(+0, -0)); //false
console.log(Object.is(+0, 0));  //false
console.log(Object.is(-0, 0));  //false

console.log(Object.is(NaN, NaN)); //true
```



#### **Object.assgin()**

`Object.assign()` 方法用于将所有可枚举属性的值从**一个**   或.  **多个**. 源对象分配到目标对象。它将返回目标对象。

`Object.assign` 方法只会拷贝源对象自身的并且可枚举的属性到目标对象(浅拷贝)

```js
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };
const source2 = { d: 4, e: 5 };

const returnedTarget = Object.assign(target, source);

console.log(target);
// expected output: Object { a: 1, b: 4, c: 5 }

console.log(returnedTarget);
// expected output: Object { a: 1, b: 4, c: 5 }

console.log(source);
// expected output: Object { b: 4, c: 5 }

console.log(Object.assign({}, source, source2, target))
//{ b: 4, c: 5, d: 4, e: 5, a: 1 }
```



#### 对象和数组的属性名

在对象中，属性名永远是字符串，如果你使用字符串以外的其他值作为属性名，它首先会被转化为一个字符串，即使是数字也不例外。虽然数组下标中使用的确实是数字，但是在对象属性命中数字会被转化为字符串，所以不要搞混对象和数组中数字的用法。

```js
const obj = {};
obj[true] = "foo";
obj[3] = "bar";
obj[obj] = "baz";

console.log(obj["true"]);            //foo
console.log(obj["3"]);               //bar
console.log(obj["[object Object]"]); //baz
```



#### 对象属性存在性

访问对象属性：

```js
const obj = {
  a: 2,
};
console.log("a" in obj);
console.log("b" in obj);
console.log(obj.hasOwnProperty("a"));
console.log(obj.hasOwnProperty("b"));
```

`in` 操作符 会检查属性是否在对象 or 其 `[[Prototype]]` 原型链中，并且它可以在 `for in`循环中使用，也可以单独使用

`hasOwnProperty` 只会检查是否在对象中



## 3.String

基本数据类型是没有属性和方法的，而对象才有属性和方法

```js
var str = 'andy';
```

但是str可以使用str.length,因为jshui把基本数据类型包装成复杂数据类型

```js
var temp = new String('andy');
str = temp;
temp = null;
```



**字符串拼接**

因为字符串不可变，所以每次str += i ，拼接字符串会开辟另外一个内存空间，字符串赋值同理



#### String方法

| 方法                                        | 参数                                                         | 效果                                                         |
| ------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `str.indexOf(searchValue [, fromIndex])`    | 1.要被查找的字符串值；2.查找开始处（可选）                   | 返回调用它的 [`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 对象中第一次出现的指定值的索引，从 `fromIndex` 处进行搜索。如果未找到该值，则返回 -1。 |
| `str.lastIndexOf(searchValue[, fromIndex])` | 同上                                                         | 返回调用[`String`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String) 对象的指定值最后一次出现的索引，在一个字符串中的指定位置 `fromIndex`处从后向前搜索。如果没找到这个特定值则返回-1 |
| `str.charAt(index)`                         | 索引值                                                       | **charAt()** 方法从一个字符串中返回指定的字符。              |
| `str.charCodeAt(index)`                     | 索引值                                                       | 返回表示给定索引处的 UTF-16 代码单元（ASCII码）              |
| `str[index]`                                |                                                              | 同str.charAt，H5新增                                         |
| `str.replace(regexp|substr, newSubStr)`     | 1.一个正则值或者一个字符串                            2.用于替换掉第一个参数在原字符串中的匹配部分的字符串 | 方法返回一个由替换值（`replacement`）替换部分或所有的模式（`pattern`）匹配项后的新字符串。模式可以是一个字符串或者一个[正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)，**如果`pattern`是字符串，则仅替换第一个匹配项** |
| `str.includes(searchString[, position])`    | 1.搜索的字符串                             2.可选，从当前字符串的哪个索引位置开始搜寻子字符串 | 用于判断一个字符串是否包含在另一个字符串中，根据情况返回 true 或 false。 |
| `str.trim()`                                |                                                              | 方法会从一个字符串的两端删除空白字符，它并不影响本身的字符串，它返回的是一个新的字符串 |
| `str.startsWith(xx)`                        | 要被查找的字符串值                                           | 用来判断当前字符串是否以另外一个给定的子字符串开头，并根据判断结果返回 true 或 false。 |
| `str.endsWith()`                            | 同上                                                         | 表示参数字符串是否以原字符串结尾，返回布尔值                 |
| `str.repeat()`                              | 重复次数                                                     | 将原字符串重复n次，返回一个新字符串                          |
| `str.match(regexp)`                         | 一个[正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp)对象。如果传入一个非正则表达式对象，则会隐式地使用 `new RegExp(obj)` 将其转换为一个 [`RegExp`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/RegExp) | 如果使用 g 标志，则将返回与完整正则表达式匹配的所有结果，但不会返回捕获组。 如果未使用 g 标志，则仅返回第一个完整匹配及其相关的捕获组（`Array`）。在这种情况下，返回的项目将具有如下所述的其他属性。 |



#### 截取字符串

（和concat一样，他们不会影响原来的字符串，只会返回提取到的原始新字符串值）

这三个方法在面对负值参数时又有三个不同的效果

```javascript
str.substr(start,length); 		//start位置开始，length取的个数，省略length则默认取到最后
str.slice(start,end);     		//start开始，截取到end，但是end截取不到，省略end则默认取到最后
str.substring(start,end);     //start开始，截取到end，end可以截取到,省略end则默认取到最后
```

```js
arr.slice(start,end);  //数组也有slice方法
```

数组对象转字符用join()，字符转数组用split

```javascript
var str = 'red, pink, blue';
console.log(str.spilt(',')); //用逗号分隔
var arr = [1, 2, 3];
console.log(arr.join(' ')); //用' '分隔
```

`str.toUpperCase()` 转换大写，  `str.toLowerCase()` 转换小写



ES2017 引入了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。`padStart()`用于头部补全，`padEnd()`用于尾部补全。

```js
'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'
'x'.padEnd(5, 'ab')   // 'xabab'
'x'.padEnd(4, 'ab')   // 'xaba'
```

如果原字符串的长度，等于或大于指定的最小长度，则返回原字符串。



## 4.内置对象和基本数据类型

先看一看内置对象和基本数据类型的区别

```js
var strPrimitive = "I am string";//一个字面量
typeof strPrimitive; // string
strPrimitive instanceof String; // false


var strObject = new String("I am string");//一个String对象
typeof strPrimitive; // object
strPrimitive instanceof String; // true
```



不过值得注意的是，一般我们说的转换只包含字符串和数值上（string and String，number and Number）

null 和 undefined没有对应的构造形式，它们只有文字形式；相反，Date只有构造，没有文字形式。

对于Object、Array、Function、RegExp来说，无论是文字形式还是构造形式，他们都是对象，而不是字面量

而Error对象一般在抛出异常自动创建，也可以通过new的方式创建，一般都用不着



## 5.拆箱

**复杂 -> 简单**

复杂数据类型转简单数据类型，也就是和装箱相反的操作

- 调用 `x.valueOf()`，如果转换为基础类型，就返回转换的值
  - JavaScript调用`valueOf`方法将对象转换为原始值。你很少需要自己调用`valueOf`方法；当遇到要预期的原始值的对象时，JavaScript会自动调用它。
- 调用 `x.toString()`，如果转换为基础类型，就返回转换的值
  - `toString()` 方法返回一个表示该对象的字符串。
- `toString` 、 `valueOf` 方法都是存在于`Object.prototype` 对象上



**Symbol.toPrimitive**

`Symbol.toPrimitive` 是一个内置的 Symbol 值，它是作为对象的函数值属性存在的，当一个对象转换为对应的原始值时，会调用此函数。

入参：该函数被调用时，会被传递一个字符串参数 `hint` ，表示要转换到的原始值的预期类型。 `hint` 参数的取值是 `"number"`、`"string"` 和 `"default"` 中的任意一个。

```js
const object1 = {
  [Symbol.toPrimitive](hint) {
    if (hint === 'number') {
      return 42;
    }
    return null;
  }
};
```

重写 `Symbol.toPrimitive` ，该方法在对象转原始类型时调用**优先级最高**。

```js
let a = {
  valueOf() {
    return 0
  },
  toString() {
    return '1'
  },
  [Symbol.toPrimitive]() {
    return 2
  }
}
1 + a // => 3
```



#### 6.装箱

其实也就是 简单数据类型 -> 复杂数据类型（对应的引用类型的操作）

其中装箱又分为隐式装箱和显式装箱

#### 隐式装箱

```js
const s1 = 'str';
const s2 = s1.substring(2);
```

实际上会创建一个String类型的实例，然后调用String原型的方法，调用方法后会被立即销毁

```js
const s1 = new String('str');
const s2 = s1.substring(2);
s1 = null;
```

因为它会在立即销毁，这也就解释了为啥仍然不能再基本数据类型上添加属性和方法

```js
const s1 = 'str';
s1.job = 'engineer';
console.log(s1.job); // undefined
```



#### 显式装箱

别问，问就是直接装！

```js
const name = new String('str'); // 直接new一个String的实例对象
```

此时可以直接添加属性和方法

```js
var objStr = new String('str');
objStr.job = 'engineer';
console.log(objStr.job); // engineer
```



## 6.image

图片加载

```js
const image = new Image()
image.onload = () => {
  console.log('加载完毕')
}
image.src = './texutre/img.png'
```

监听图片加载完成方法

```js
const loadImage = (url) => new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'Anonymous';
    image.src = url;
    image.onload = () => resolve(image);
    image.onerror = reject;
});
```

