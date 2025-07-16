---
author: Hello
categories: 前端
title: 红宝书啃读note(上)
description: 'js相关知识'
---

## 第1、2章（JavaScript）

**Script标签**

在Script标签里面不要出现

```js
console.log("</script>")
//会把它当成script结束标签，即使是字符串也不可以，但是除非
console.log("<\/script>")
```

可以使用async代替 DOMContentLoaded事件进行 异步操作（并不是所有浏览器都支持async），使得页面保证dom渲染完毕后再执行js文件，只是不能保证执行次序

defer只对外部脚本有效，按照加载顺序执行脚本的，这一点要善加利用

async不能保证多个script标签事件执行的顺序，**加载完了就会立刻执行**

noscript标签：当浏览器禁用JavaScript，或者对脚本的支持关闭时可以使用

```js
<script async src="xxxx"> </script>
<script defer src="xxxx"> </script>
```

![](/simple-blog/红宝书啃读note/defer.jpg)



## 第3章（语言基础）

标识符第一个字符不能为数字

推荐语句以分号结尾，除了是一个好习惯之外，有助于在某些情况提升性能

变量在不初始化(直接 `var a;` )的情况下，会保存一个特殊值："undefined"

定义一个将来要保存对象值的变量时，建议使用null初始化

undefined 是由 null 派生出来的，所以 `null == undefined // true`

undefined被设计是希望**表示一个变量最原始的状态**，我们可以通过undefined来判断改变量是否存在，或者是否被赋值（初始化）

当一个对象被赋值了null 以后，原来的对象在内存中就处于游离状态，GC 会择机回收该对象并释放内存。因此，如果需要释放某个对象，就将变量设置为 null，即表示该对象已经被清空，目前无效状态。



**if语句**

会自动执行其他类型知道布尔值的转换，注意以下几个会被转化为false：(其他的一般都是true)

- false
- ""
- 0、NAN
- null
- undefined

NAN：非数值，不等于包括NAN在内的任何值，但是有一个isNAN() 函数



**字符串**

字符串一旦创建，不可改变，一般我们修改字符串，都是销毁原先的字符串，然后把新的另一个字符串保存到该变量

```js
let lang = 'Java';
lang += 'Script' //改变，进行销毁 + 赋值
```



**变量提升**

由于变量提升需要查看是否有`var`或者`function`，所以需要注意

```js
console.log(a); //undefined
var a = 100     //会变量提升
```

```js
console.log(a); //报错 a is not defined
a = 100        //不会变量提升,但是即使在函数内部声明也会创建一个全局变量，会导致内存泄漏
```



**对象方法**

`Object.getOwnPropertyNames(obj1)`返回对象实例的常规属性数组，比如 `[name, value]`

`Object.getOwnPropertySymbols(obj1)`返回对象实例的符号属性数组，比如 `[Symbol(foo), Symbol(bar)]`

这两种方法互斥，但：

`Object.getOwnPropertyDescriptors(obj1)`返回对象实例的符号 + 常规属性的**对象**



**递增递减操作符** & **一元加和减**

对于布尔值，如果是false，则转为0再做相应改变；如果为true，则转为1再做相应改变

```js
let s1 = '2', s2 = false;
s1++  //值变成了数值3
s2++  //值变成了数值1
```

而一元加和减，也会执行与`Number()`相似的类型转换

```js
let s1 = false, s2 = "1.1";
s1 = +s1;  //得到数值0
s2 = -s2;  //得到数值-1.1
```



**左右移和无符号左右移**

正常左移操作和右移操作都是直接让数值以二进制形式进行移动。

而无符号右移（`>>>`），对于正数来说，和右移`>>`操作一样；对于负数来说，会出现巨大的差异，无符号右移会继续给空位补0

而负数是以一种二补数的二进制编码存储，也就是

- 先转正数的二进制
- 0 -> 1, 1 -> 0
- 结果 +1

```js
let oldValue = -64 
let newValue = oldValue >>> 5; //得到134217726
```



**加性操作符**

当两个操作数，只有一个为字符串时，另外一个会转变为字符串，然后拼接

```js
let a = 1 + '1'; // "11"
"12" + null      //"12null"
```



**减法操作符**

当任意一个操作数是字符串、布尔值、null或undefined，则先在后台使用`Number()`转换为数值，若是对象则调用其`valueOf()`方法取得表示它的数值



**== 和 ===、`Object.is()`**

`==`和 `!=`都会先进行类型转换（强制类型转换），再确定操作数是否相等

而 `===` 和 `!==` 都不会转换操作数

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



**break & continue**

break和continue都可以使用标签语句退出多重循环

```js
let num = 0;
outermost:
for(let i = 0; i < 10; i++){
	for(let j = 0; j < 10; j++){
        if(i === 5 && j === 5)break outermost;
        num++;
    }
}
```



## 第4章（变量、作用域与内存）

原始类型初始化可以只是永远是字面量形式，如果是使用new关键字创建，则JavaScript会创建爱一个Object实例，其行为类似原始值

比如

```js
let name1 = "Allen";
let name2 = new String("Bruce");
name1.age = 18;
name2.age = 19;
console.log(name1.age)     //undefined
console.log(name2.age)     //19
console.log(typeof name1)  //string
console.log(typeof name2)  //object
```



引用值（比如对象、数组）传递参数时，会影响到函数外部的原始变量，因为传入的是指针，保存着数值存放的地址

```js
function change(obj){
	obj.name = 'allen'
}
let obj = {};
change(obj);  //{ name: 'allen' }
```

实质上参数传递有点像let 一个变量 obj2 ，然后让 obj2 = obj的操作



为了补救垃圾回收时类似循环引用的问题，IE9把BOM、DOM对象都改成了JavaScript对象





## 第5章（基本引用类型）

**正则表达式**

正则表达式使用到元字符需要使用 `\` 进行转义，如果正则表达式是使用 RegExp 构造函数来创建，由于参数模式是字符串，所以需要进行二次转义 `\\`

比如字面量模式： `/\[bc\]at/`           字符串模式：`\\[bc\\]at`

RegExp实例的主要方法是 `exec()`，返回一个数组，包含匹配的信息，匹配不到返回null

如果要获取匹配的字符串：`/.de/.exec('ffff')[0]`

g全局匹配：

```js
let text = "cat, bat, sat, fat";
let pattern = /.at/g;
let matches = pattern.exec(text);  //cat的数组
console.log(matches);
let matches2 = pattern.exec(text); //bat的数组
console.log(matches2);
```



**字符串方法**

`str.indexOf(子字符串)`从字符串开头找子字符串

`str.indexOf(子字符串, index)`从字符串index位置开始找子字符串

`str.lastindexOf(子字符串)`从字符串末尾开始查找子字符串



**单例内置对象**

Global对象：它是ECMA中最特别的对象，因为代码不会显式地访问它。事实上，不存在全局变量或全局函数这种东西，在全局作用域中定义的变量的函数都会变成Global对象的属性，我们所了解的 `isNaN()`、  `parseInt()`、  `parseFloat()`实际上都是Global对象的方法；而NAN、undefined、Array也都是Global的属性。

而我们平时属性的window对象，是Global对象的代理（ECMA-262没有规定直接访问Global对象的方式）



`eval()`方法：它可能是ECMAScript语言中最强大的方法，它就是一个完整的ECMAScript解释器

```js
eval("console.log('good!')");
//等同于
console.log("good")
```

当解释器发现 `eval()`时，会将参数解释为实际的ECMAScript语句，然后将其插入到该位置，通过 `eval()`执行的代码属于**该调用所在上下文**，被执行的代码与该上下文拥有相同的作用域链。这意味着包含上下文中的变量可以在`eval()`调用内部被引用

这里eval调用的msg属于外部上下文，因为第二行代码会被替换成一行真正的函数调用代码

```js
let msg = "Batman";
eval("console.log(msg)");  //"Batman"
```

函数say是在eval内部定义的，因为该调用会被替换为真正的函数定义

```js
eval("function say(){ console.log('good!'); }")
say();                    //good!
```



非严格模式下直接调用 `eval()` 时，里面使用 `var` 声明的变量和使用 `function` 声明的函数会修改当前词法作用域，里面使用 `let` 和 `const` 声明的变量不会修改当前词法作用域，但是会在当前创建新的词法作用域。

严格模式下直接调用的 `eval()` 时，会在当前创建一个新的独立的词法作用域。

```js
eval("let msg = 'Batman'")
console.log(msg);         //Err
```

```js
eval("var msg = 'Batman'")
console.log(msg);         //Batman
```



`eval()` 是一个危险的函数， 它使用与调用者相同的权限执行代码。如果你用 `eval()` 运行的字符串代码被恶意方（不怀好意的人）修改，您最终可能会在您的网页/扩展程序的权限下，在用户计算机上运行恶意代码。更重要的是，第三方代码可以看到某一个 `eval()` 被调用时的作用域，这也有可能导致一些不同方式的攻击。相似的 [`Function`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function) 就不容易被攻击。

`eval()` 通常比其他替代方法更慢，因为它必须调用 JS 解释器，而许多其他结构则可被现代 JS 引擎进行优化。

此外，现代JavaScript解释器将javascript转换为机器代码。 这意味着任何变量命名的概念都会被删除。 因此，任意一个eval的使用都会强制浏览器进行冗长的变量名称查找，以确定变量在机器代码中的位置并设置其值。 另外，新内容将会通过 `eval()` 引进给变量， 比如更改该变量的类型，因此会强制浏览器重新执行所有已经生成的机器代码以进行补偿。 但是，（谢天谢地）存在一个非常好的eval替代方法：只需使用 [window.Function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function)。 这有个例子方便你了解如何将`eval()`的使用转变为`Function()`。

关于eval更多介绍 https://zhuanlan.zhihu.com/p/232078517



`Eval`直接调用和间接调用

- 间接eval调用：

  ```js
  (1, eval)('...')
  (eval, eval)('...')
  (1 ? eval : 0)('...')
  (__ = eval)('...')
  var e = eval; e('...')
  (function(e) { e('...') })(eval)
  (function(e) { return e })(eval)('...')
  (function() { arguments[0]('...') })(eval)
  this.eval('...')
  this['eval']('...')
  [eval][0]('...')
  eval.call(this, '...')
  eval('eval')('...')
  ```

- 直接eval调用：

  ```js
  eval('...')
  (eval)('...')
  (((eval)))('...')
  (function() { return eval('...') })()
  eval('eval("...")')
  (function(eval) { return eval('...'); })(eval)
  with({ eval: eval }) eval('...')
  with(window) eval('...')
  ```

Ecma 规范将引用*视为*`eval`“直接 eval 调用”，但仅产生`eval`为间接的表达式 - 并且间接 eval 调用保证在全局范围内执行。

你是否注意到ES5定义说明调用表达式的eval**应当执行标准的、内置的函数**？这意味着根据上下文内容eval('1+1')**必定不是直接调用**。仅仅当eval真正地（不是重写或者隐含地）引用了标准的、内置的函数的时候，调用才被认为是直接调用。

```js
eval = (function(eval) {
    return function(expr) {
      return eval(expr);
    };
  })(eval);

  eval('1+1'); // 它看前来像直接调用，不过实际上是间接调用。
               // 这是因为`eval`解析为定制的函数，而不是标准的、内置的函数。
```

http://perfectionkills.com/global-eval-what-are-the-options/



**new Function**

除了eval之外另外一种动态执行js代码的的方式

`new Function( param1, param2, …, paramN,funcBody );`
它创建一个包含0个或者过个参数名为 param1 等的函数，函数体为 funcBody。相当于如下方式创建函数：

```js
function ( (param1), (param2), ..., (paramN) ){ 
  (funcBody)
}
```

```js
let sum = new Function('a', 'b', 'return a + b');
alert( sum(1, 2) ); // 3
```

```js
let sayHi = new Function('alert("Hello")');
sayHi(); // Hello
```

```js
let str = ... 动态地接收来自服务器的代码 ...
let func = new Function(str);
func();
```



[Eval 和 new Function 对比](https://weblogs.asp.net/yuanjian/json-performance-comparison-of-eval-new-function-and-json)



## 第6章（集合引用类型）

**对象属性**

一般通过点语法进行获取，但也可以使用中括号

```js
console.log(person["name"]);
console.log(person.name);
```

只不过中括号的主要优势在于可以通过变量访问属性

```js
let s = "name";
console.log(person[s]);
```



**属性替代**

一个对象中如果有重复的属性，则以下面的属性值为准

```js
const obj = {
  a: "ab",
  a: "cd",
};
console.log(obj); // {a:'cd'}
```



**数组**

数组空位：

使用数组字面量初始化数组时，可以使用一串逗号来创建空位。ES6之前的方法会忽略空位，ES6新增方法普遍将这些空位当成存在的元素，只不过值为undefined。

```js
const option = [,,,,];
```

索引自动扩容

如果把一个值设置给超过数组最大索引的索引，数组长度就会自动扩展到该索引值+1

```js
let colors = ["red", "blue", "green"];
colors[2] = "black";
colors[3] = "white";
console.log(colors); //red, blue, black, white
```

修改length

数组length的独特之处在于，它不是只读的，通过修改length属性，可以实现从数组末尾删除 / 添加元素（Vue2.0的缺点之一就是不能通过修改数组length得到响应式的结果），添加的元素通过undefined进行填充



**搜索位置和方法**

`indexOf()` `lastIndexOf()` `includes()`其中前两个在任何版本都可以使用，第三个时ES7新增

`indexOf()` `includes()`从开头搜索匹配元素，`lastIndexOf()`从结尾开始搜索

`indexOf()` `lastIndexOf()`找不到返回-1， `includes()`返回布尔值

它们都是用全等 `===`进行比较的



**定性数组**

`ArrayBuffer`是所有定型数组及视图引用的基本单位，它是一个普通的JS构造函数，可用于在内存中分配特定数量的字节空间。

一经创建便不能再调整大小

```js
const buf = new ArrayBuffer(16) //在内存中分配16个字节
```



## 第7、8章（迭代器和生成器，对象和类）

**生成器**`Generator`

可以使用星号增强 `yield`行为，让他能够迭代一个可迭代对象，从而一次产出一个值

```js
function * generatorFn(){
	for(const x of [1,2,3]){
        yield x;
    }
}
//可以转化为
function * generatorFn(){
	yield * [1,2,3];
}
```

实际上只是将一个可迭代对象序列化为一连串可以单独产出的值，所以这跟把yield放到一个循环里没什么不同

和迭代器类似，生成器也支持 “可关闭概念”，因为 `generator`实现了 `iterator`接口，一个实现 `iterator`接口的对象一定有 `next()`，还有一个可选的 `return()`方法用于提前终止迭代器，生成器对象除了这两个方法，还有第三个方法 `throw()`

`throw()`会在暂停的时候将一个提供的错误注入到生成器对象中，如果错误未处理，生成器就会关闭；如果生成器内部函数处理了这个错误，那生成器就不会关闭，跳过对应的 `yield`，继续执行。



**对象方法**

对象定义属性（访问器属性）使用`Object.defineProperty()`，读取属性的特性可以使用 `Object.getOwnPropertyDescriptor()`方法，它返回一个对象

- 对于访问器属性包含 `configurable`、`enumberable`、`get`、`set`
- 对于数据属性包含 `configurable`、`enumberable`、`writable`和 `value`属性

（有点像对对应`Object.definePRoperty`的属性）



`Object.assign(target, ...sources)`方法接收一个目标对象和一个或多个源对象作为参数，然后将每个源对象中可枚举和自有属性复制到目标对象（浅拷贝）

```js
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };	
const returnedTarget = Object.assign(target, source);
console.log(target);
// expected output: Object { a: 1, b: 4, c: 5 }
console.log(returnedTarget);
// expected output: Object { a: 1, b: 4, c: 5 }
```



全等升级 -> 对象标识及相等判定

```js
console.log(true === 1); //false
console.log({} === {});  //false
console.log("2" === 2);  //false

console.log(+0 === -0); //true
console.log(+0 === 0);  //true
console.log(-0 === 0);  //true

console.log(NaN === NaN); //false
console.log(isNaN(NaN));  //true
```

ES6规范新增了 Object.is() 这个方法和=== 很像，但也同时考虑了上述边界情形

```js
console.log(Object.is(true, 1)); //false
console.log(Object.is({}, {}));  //false
console.log(Object.is("2", 2));  //false

console.log(Object.is(+0, -0)); //false
console.log(Object.is(+0, 0));  //false
console.log(Object.is(-0, 0));  //false

console.log(Object.is(NaN, NaN)); //true
```



对象的可计算属性（使用变量定义属性时，必须放在方括号内，与普通键值(String)进行区分。）

```js
const name = 'Mike';
let person = {[name]: 'Matt'}
```



**原型链**

`原型对象.isPrototypeOf(实例)`方法确定两个对象之间的 `[[Prototype]]`关系

```js
console.log(Array.prototype.isPrototypeOf([])); // true
```

还有一个 `getPrototypeOf()` 和 `setPrototypeOf()`方法，分别对应湖片区参数的原型对象和修改参数的原型对象，但是  `Object.setPrototypeOf()`会严重影响代码性能

使用`Object.getPrototypeOf(obj)`方法 === `obj.__proto__`



可以使用`hasOwnProerty()`方法用于确定某个属性是实例上还是在原型对象，这个方法是继承自Object的，会在属性存在于调用它的对象实例上时返回true（这个方法也应用于Vue3.0检测数组属性的存在 + 修改属性 + 新增属性）

```js
//person1有name属性、但是没有othername属性
console.log(person1.hasOwnProperty("name")) //true
console.log(person1.hasOwnProperty("othername")) //false
```

但是hasOwnProperty是确定该实例上有没有这个属性 ，如果该实例的对象原型上有这个属性，也会返回false

`in`操作符就不一样了，`in`在 `for in`循环中使用，也可以单独使用，`in`操作符会在可以通过对象访问指定属性时，返回true

```js
//person1有name属性、但是没有othername属性
person1.name = "Bruce"
person1.prototype.othername = "Allen"
console.log("name" in person1) //true
console.log("othername" in person1) //true
```



**对象迭代**

ECMAScript2017新增了两个静态方法：`Object.values()`（返回对象值的数组）、`Object.values()`（返回键/值对的数组）



**继承拓展**

原型式继承：

- 适用情况于你有一个对象，想在它的基础上再创建一个新对象
- 它是一种不涉及严格意义上的构造函数继承方法，他的出发点是即使不自定义类型
- ES5通过增加 `Object.create()`方法把原型是继承的概念规范化了

```js
let person = {
	name:"Allen",
	friends:["Bruce", "Curry", "Devid"]
}
let anotherPerson = Object.create(person);  //object(person)也可以
anotherPerson.name = "Greg";
anotherPerson.fridens.push("Rob");

let yetAnotherPerson = Object.create(person);
yetAnotherPerson.name = "Faker";
yetAnotherPerson.fridens.push("Ariana");

console.log(person.friends);  //"Bruce", "Curry", "Devid", "Rob", "Ariana"
console.log(person.name);     //"Allen"
```

（即引用类型存共享属性，基本类型存取实例属性）



寄生式继承：

```js
function createAnother(original) {
  let clone = object(original);
  clone.sayHi = function () {
    console.log("hi!");
  }
  return clone;
}
let person = {
	name:"Allen",
	friends:["Bruce", "Curry", "Devid"]
}
let another = createAnother(person);
another.sayHi();
```

它让新返回的对象具有person的所有属性和方法，还创建了一个新的方法sayHi。

但寄生式继承给对象添加函数会导致函数难以重用，和构造函数模式（构造函数继承）类似。



传统的组合继承也存在效率问题，主要在于父类构造函数始终会被调用两次，

一次在创建子类原型时调用（`Son.prototype = new Father();`）

一次在子类构造函数中调用（`function Son(uname, age) {Father.call(this, uname, age);}`）

由此寄生式组合继承的方式可以解决这个问题

```js
//替代原来的Son.prototype = new Father();
function inheritPrototype(subType, superType) {
  let prototype = object(superType.prototype);
  prototype.constructor = subType;
  subType.prototype = prototype;
}
```



JS实现抽象类(仅继承，本身不会被实例化)

```js
class Vehicle{
 constructor(){
 	console.log(new.target);
 }
 if(new.target === Vehicle){
 	throw new Error("Vehicle annot be directly instantiated");
 }
}
```





## 第9章（代理与反射）

**代理与反射**

代理为目标对象的抽象，从很多方面来看，代理类似于C++的指针，因为他们可以用作目标对象的替身，但又完全独立于目标对象。目标对象既可以被直接操作，也可以通过代理来操作

```js
const target = {
  id:'target'
}
// 传入参数为目标对象和处理程序对象
const proxy = new Proxy(target, {});
console.log(target.id);  //target
console.log(proxy.id);   //target
target.id = "foo"
console.log(target.id);  //foo
console.log(proxy.id);   //foo
console.log(target.hasOwnproperty('id'));  //true
console.log(proxy.hasOwnproperty('id'));  //true
// 可以通过严格模式区分
console.log(target === proxy);  //false
```

使用代理的主要目的是定义捕获器（基本操作拦截器），我们在处理程序对象中定义即可，比如这里我重新定义了 该对象的 get 方法

```js
const handler = {
  get() {
  	return 'handler override';
  }
}
const proxy = new Proxy(target, handler);
console.log(target.id);  //foo
console.log(proxy.id);   //handler override
```



根据ECMAScript规范，每个捕获器都知道目标对象的上下文，捕获函数签名，而捕获程序的行为必须遵循“捕获器不变式”，捕获器不变式因方法不同而异，但通常都会防止捕获其定义出现过于反常的行为（比如目标对象有一个不可配置切不可写的数据属性，那么在捕获器返回一个与该属性不同的值时，会抛出TypeError）



**可撤销代理**

使用`new Proxy()`创建的普通代理，这种联系会在代理对象的生命周期内持续存在，所以有时可能需要中断代理对象和目标对象之间的联系。

Proxy也暴露了 `revocable()`方法，这个方法支持撤销代理对象和目标对象的关联，撤销代理后再次调用代理会抛出TypeError

```js
const {proxy, revoke} = Proxy.revocable(target, handler);
//此时我们可以撤销代理
revoke();  //撤销代理
console.log(proxy.id);   //TypeError
```



**代理的问题和不足**

- 如果target目标对象过于依赖对象标识，可能会出现意料之外的内容（比如WeakMap）

  ```js
  const wm = new WeakMap();
  class User {
    constructor(userId) {
      wm.set(this, userId)
    }
    set id(userId) {
      wm.set(this, userId);
    }
    get id() {
      return wm.get(this)
    }
  }
  const user = new User(123);
  console.log(user.id); //123
  const proxy = new Proxy(user, {});
  console.log(proxy.id); //undefined
  ```

- 有些ECMAScript内置类型可能会以来代理无法控制的机制，导致代理商调用某些方法出错，比如Date类型



**代理捕获器与反射方法**

`get()`捕获器会在获取属性值的操作中被调用，反射API为 `Reflect.get()`

`set()`捕获器会在设置属性值的操作中被调用，反射API为 `Reflect.set()`

`has()`捕获器会在in操作符中被调用，反射API为 `Reflect.has()`

`defineProperty()`捕获器会在 `Object.defineProperty()` 中被调用，反射API为 `Reflect.defineProperty()`

.......



代理模式还可以实现属性隐藏功能、属性验证功能等

```js
const hiddenProperties = ['foo', 'bar'];
const target = {
  foo: 1,
  bar: 2,
  baz:3
}
const proxy = new Proxy(target, {
  //隐藏属性功能
  get(target, property) {
    if (hiddenProperties.includes(property))
      return undefined;
    else return Reflect.get(...arguments);
  },
    //属性验证
  set(target, property, value) {
    if (typeof value !== Number) return false;//拒绝赋值
    else return Reflect.set(...arguments);
  }
})
```



## 第10章（函数）

实质上，函数是一个对象，是Function类型的实例

ECMAScript6的所有函数对象都会暴露一个只读的name属性，其中包含关于函数的信息（如果它是使用Function构造函数创建，则会表示成"anonymous"）

```js
function foo() { }
let bar = function () { }
let baz = () => { }
console.log(foo.name);                //foo
console.log(bar.name);                //bar
console.log(baz.name);                //baz
console.log((new Function()).name);   //anonymous
```



注意：ECMAScript的函数没有重载（重载指同个函数名通过接收不同的参数，包括个数、类型，而实现同函数名实现不同的方法）



事实上，JavaScript引擎在加载数据时对函数声明和函数表达式区分对待的。

JavaScript引擎在任何代码执行之前，都会读取函数声明，并在执行上下文中生成函数定义；而函数表达式必须等到代码执行到他那一行，才会在执行上下文中生成函数定义。

```js
//没问题
console.log(sum(10, 10));
function sum(num1, num2){
	return num1 + num2;
}
```

```js
//会出错，使用var也会出错
console.log(sum(10, 10));
let sum = function(num1, num2){
	return num1 + num2
}
```



我们学习过arguments，是一个伪数组，包含调用函数时传入的所有参数。实际上它还有一个callee属性，是一个指向arguments对象所在函数的指针，从而实现函数逻辑与函数名解耦

```js
function dfs(num){
	if(num <= 1)return 1;
    else return num * arguments.callee(num-1);  //相当于num * dfs(num-1)
}
```

严格模式下，运行的代码不能访问`arguments.callee`，因为访问会出错



**闭包延伸**

函数执行时，每个执行上文中都会有一个包含其中变量的对象。全局上下文中的叫变量对象，它会在代码执行期间始终存在。而函数局部上下文中叫做活动对象，只在函数执行期间存在。

函数内部的代码在访问变量时，就会使用给定的名称从作用域链1中查找变量，函数执行完毕后，局部活动对象就会被销毁，内存中就只剩下全局作用域，不过，闭包就不一样了。

在一个函数内部定义的函数，就会把其包含的函数的活动对象添加到自己的作用域链中



## 第11章（期约与异步函数）

`promise.all`：如果有期约拒绝，则第一个拒绝的契约会将自己的理由作为合成期约的拒绝理由（交给onReject或者catch处理）。之后再拒绝的期约不会影响最终期约的拒绝理由

- 如果至少有一个包含的期约待定，则合成期约待定（pedding），如果有一个包含的期约拒绝，则合成的期约也会拒绝（一个rejected，则all rejected）

`promise.race`：谁快用谁的状态；

- 第一个落定的拒绝期约，就会成为拒绝合成期约的理由。之后再拒绝的期约不会影响最终期约拒绝的理由。
- 和all类似，合成的期约会静默处理所有包含期约的拒绝操作，不会有错误跑掉。



ES6不支持取消期约和进度通知，一个主要原因是这样会导致期约连锁和期约合成过度复杂化。

但是我们可以利用闭包传入回调函数实现七月的取消和进度通知



async

async关键字用在函数声明、函数表达式、箭头函数和方法上

```js
async function foo(){}
let bar = async function(){}
let baz = async() => {}
class Quex(){
    async qux(){}
}
```

异步函数如果使用return关键字返回了值（默认返回undefined），这个值会被Promise.resolve()包装成一个期约对象

```js
async function foo(){
	console.log(1);
	return 3;  //return Promise.resolve(3)
}
foo().then(console.log(2));
console.log(2)
//1
//2 
//3
```



异步函数async和promise期约一样，抛出错误（throw err）会返回拒绝的期约

```js
async function foo(){
	console.log(1);
	throw 3;
}
foo.catch()(console.log);
console.log(2)
//1
//2
//3
```

不过，拒绝期约的错误不会被异步函数捕获

```js
async function foo(){
	console.log(1);
	Promise.reject(3);
}
foo.catch()(console.log);
console.log(2)
//1
//2
//Uncaught 3
```

对于await，面对拒绝的期约，会释放（unwrap）错误值（将拒绝期约返回）

```js
async function foo(){
	console.log(1);
	await Promise.reject(3);
	console.log(4);  //这一行不会被执行
}
foo.catch()(console.log);
console.log(2)
//1
//2
//Uncaught 3
```



await的限制：await关键字只能在异步函数（async）中使用

要完全理解await，必须知道他并非只是等待一个值可用这么简单，JavaScript运行时碰到await关键字时，会记录那里暂停执行，等到await右边的值可用了，JavaScript运行时会向消息队列推送一个任务，这个任务会恢复异步函数的执行

因此，即使await后面跟着一个立即可用的值，函数的其余部分也会被异步求值

```js
async function foo(){
	console.log(2);
    await null;   //await暂停执行，为立即可用的值null向消息队列中添加一个任务，等到同步任务执行完毕后，再取出来
    console.log(4)
}
console.log(1);
foo();
console.log(3);
//1
//2
//3
//4
```

async关键字无论从哪个方面来看，都不过是一个标识符，毕竟，异步函数如果不包含await关键字，其执行基本上跟普通函数没有什么区别。

```js
async function foo(){
	console.log(2);
}
console.log(1)
foo();
console.log(2)
//1
//2
//3
```



**期约和异步函数**

栈追踪和内存管理

期约（promise）和异步函数（async）的功能有相当程度的重叠，但是他们在内存中的表示则差别很大。

```js
function fooPromiseExecutor(res, rej) {
  setTimeout(rej, 1000, 'bar');
}
function foo() {
  new Promise(fooPromiseExecutor);
}
foo();
//Uncaught (in promise) bar
//setTimeout
//setTimeout  (async)
//fooPromiseExecutor
//foo
```

栈追踪信息应该是相当直接地表现JavaScript引擎在当前栈内存中函数调用之间的嵌套关系。在超时处理程序执行时和拒绝期约时，我们看到错误信息包含嵌套函数的标识符，那是被调用以创建初期约实例的函数。可是我们知道这些函数已经返回，因此在追踪栈中不应该看到它们。

而这是因为JavaScript引擎在创建期约时尽可能保留完整的调用栈，在抛出错误时调用栈可以由运行时的错误处理逻辑获取。当然，这意味着栈追踪信息会占用内存，带来计算存储成本。

```js
function fooPromiseExecutor(res, rej) {
  setTimeout(rej, 1000, 'bar');
}
async function foo() {
  await new Promise(fooPromiseExecutor);
}
foo();
//Uncaught (in promise) bar
//foo
//async function (async)
//foo
```

这样一改，栈追踪信息就能准确地反映了当前的调用栈。fooPromiseExecutor()已经返回，所以它不在错误信息中，但foo()由此被挂起了，并没有退出。JavaScript运行时可以简单地在嵌套函数中存储指向包含函数的指针，就跟对待同步函数调用栈一样。这个指针实际上存储在内存中，可用于再出错时生成栈追踪信息。

（这段看不太懂，不过只要理解到异步函数对比期约会减少内存消耗，因此在重视性能的应用中可以优先考虑即可）
