---
author: Hello
categories: 前端
title: JavaScript进阶ES6(下)
description: 'ES6相关'
---


## 5.Symbol

Symbol表示独一无二的值，是ES6引入的第七种数据类型，是一种类似于**字符串**的数据类型（永远不会重复的字符串）

特点：

- Symbol的值是唯一的。解决命名冲突的问题（内部实现唯一性，不可见，也就是打印不出来）
- Symbol不能与其他数据进行运算（隐式类型转换会报错，但是，Symbol 值可以显式转为字符串、转为布尔值）
- Symbol定义的对象属性不能使用`for in` 、`for...of`  进行循环，但是可以使用 `Reflect.ownKeys`来获取对象的所有键名

基本创建

```js
let s1 = Symbol();
// let s2 = Symbol('描述字符串');，我们可以通过描述字符串更好的理解这个值的作用
let s2 = Symbol('allen');
let s3 = Symbol('allen');
// 返回false，因为描述字符串类似于身份证上的名字，我们可能同名同姓但是不可能同一身份证
console.log(s2 === s3);  //false
```

`Symbol.for`进行创建，是作为一个函数对象，通过这种方式创建，我们是可以通过描述字符串得到得出唯一的symbol值
该方法会根据给定的键 key，来从运行时的**全局 symbol 注册表**中找到对应的 symbol，如果找到了，则返回它，否则，新建一个与该键关联的 symbol，并放入**全局 symbol 注册表**中。（用于需要共享和重用符号的实例）

```js
let s4 = Symbol.for('bruce');
let s5 = Symbol.for('bruce');  //重用已有符号
console.log(s5 === s4);  //true
Symbol.keyFor(s4);       //"bruce"
```



#### 应用

能保证不会出现同名的属性。这对于一个对象由多个模块构成的情况非常有用，能防止某一个键被不小心改写或覆盖。

**注意**：

- Symbol值作为对象属性名时，不能用点运算符。
- 在对象中使用变量定义属性时，必须放在方括号内，与普通键值(String)进行区分。

```js
let mySymbol = Symbol();
// 第一种写法
let a = {};
a[mySymbol] = 'Hello!';
// 第二种写法
let a = {
  [mySymbol]: 'Hello!'
};
a[mySymbol] // "Hello!"
```

```js
let s = Symbol();
let obj = {
  [s]: function (arg) { ... }
};
obj[s](123);
```



利用Symbol的特性可定义内部私有属性或方法

```js
function getObj(obj) {
    let privateKey = Symbol('privateKey');
    objCopy = { ...obj } || {};
    objCopy[privateKey] = function privateFunc() {
        console.log('privateFunc ')
    }
    return objCopy;
}

let newObj = getObj();
console.log(newObj[privateKey]);           // 报错，外部无法获取到privateKey的值
console.log(newObj[Symbol('privateKey')]); //undefined,此时的symbol已经变成新的symbol值
```



#### Symbol的内置属性

- `Symbol.hasInstance `：对象的`Symbol.hasInstance`属性，指向一个内部方法。当其他对象使用`instanceof`运算符，判断是否为该对象的实例时，会调用这个方法。比如，`foo instanceof Foo`在语言内部，实际调用的是`Foo[Symbol.hasInstance](foo)`。

  ```js
  class MyClass {
    [Symbol.hasInstance](foo) {
      return foo instanceof Array;
      //如果直接 return false，则调用instanceof的时候无论前面接什么实例，都会返回false
    }
  }
  
  [1, 2, 3] instanceof new MyClass() // true
  ```

- `Symbol.isConcatSpreadable `：对象的`Symbol.isConcatSpreadable`属性等于一个布尔值，表示该对象用于`Array.prototype.concat()`时，是否可以展开。

  ```js
  let arr1 = ['c', 'd'];
  ['a', 'b'].concat(arr1, 'e') // ['a', 'b', 'c', 'd', 'e']
  arr1[Symbol.isConcatSpreadable] // undefined
  
  let arr2 = ['c', 'd'];
  arr2[Symbol.isConcatSpreadable] = false;
  ['a', 'b'].concat(arr2, 'e') // ['a', 'b', ['c','d'], 'e']
  ```

- 还有很多，可以去阮一峰的ES6入门查看



#### 在学习过程踩的坑

```js
var name = Symbol();
//Uncaught TypeError: Cannot convert a Symbol value to a string
```

在网上找的的解释：

- **var** 

定义的变量会把它提升到当前**函数**作用域顶部，如果是浏览器全局作用域就会成为window的一个属性。

By the way，let会把变量提升到当前**块级**作用域顶端，如果在浏览器全局作用域下，**不**会让变量成为window的属性。

- **name**

是window对象的一个固有属性，对它的赋值，会被强制转为string。

可以打开控制台打印一下window，第二个属性就是name。

给name赋值一个对象，会自动转换为string类型

- **symbol**

Symbol的隐式类型转换会报错

使用 var 声明变量 => 给 window 的变量赋值 => window.name的赋值必须转换为字符串 => 对值Symbol()转换为字符串的过程中，触犯了的 “Symbol()隐式类型转换” 



## 6.XX器

#### 迭代器

迭代器是一种接口，为各种不同数据结构提供统一的访问机制，任何数据结构只要部署`Iterator`接口，就可以完成遍历操作

实际上 `Iterator`接口，就是对象里面的一个属性，而属性的名字就叫做 `Symbol.Iterator`

ES6创造了一种 `for of`循环，`Iterator`主要供 `for of `消费，也就是可以使用`for of `，就有 `Symbol.Iterator`属性

定义  `Symbol.Iterator`则定义它的迭代方式

错误：迭代失败！！！

```js
const banji = {
    name: "4399",
    status: [
        'Allen',
        'Bruce',
        'Cat'
    ]
}
for (item of banji) { console.log(item); }
```

`next`方法返回一个对象，表示当前数据成员的信息。这个对象具有`value`和`done`两个属性，`value`属性返回当前位置的成员，`done`属性是一个布尔值，表示遍历是否结束，即是否还有必要再一次调用`next`方法。

正确√，重新定义了迭代器，用来迭代status

```js
const banji = {
    name: "4399",
    status: [
        'Allen',
        'Bruce',
        'Cat'
    ],
    [Symbol.iterator]() {
        let index = 0;
        return {
            next: () => {
                // 这里的this指向我们的banji
                // value为迭代的值，done表示是否停止迭代的状态
                if (index < this.status.length) {
                    const result = { value: this.status[index], done: false };
                    // 下标自增，继续迭代 
                    index++;
                    return result;
                } else {
                    return { value: undefined, done: true }
                }
            }
        }
    }
}
//这里的item直接输出value
for (const item of banji) { console.log(item); }
```

迭代器中有个 `return`函数，该方法用于指定在迭代器提前关闭执行的逻辑，必须返回一个`IteratorResult`对象（通过break、continue、return、throw）

```js
class Counter{
    constructor(limit){
        this.limit = limit;
    }
    [Symbol.iterator](){
        let count = 1;
        limit = this.limit;
        return {
            next(){
                if(count <= limit){
                    return {done: false, value: count++};
                }else {
                    return {done: true};
                }
            }
            return(){
                console.log('Exiting early');
                return {done: true}
            }
        }
    }
}
```

不过，仅仅给一个不可关闭的迭代器增加这个方法并不能让它们可关闭的



#### 生成器

名词解释：

- `Generator` 函数是 ES6 提供的一种异步编程解决方案
- 形式上，Generator 函数是一个普通函数，但是有两个特征。一是，`function`关键字与函数名之间有一个星号；二是，函数体内部使用`yield`表达式，定义不同的内部状态（`yield`在英语里的意思就是“产出”）。

使用方法：

- Generator 函数的调用方法与普通函数一样，也是在函数名后面加上一对圆括号。不同的是，调用 Generator 函数后，该函数并不执行，返回的也不是函数运行结果，而是一个指向内部状态的指针对象
- 下一步，必须调用遍历器对象的`next`方法，使得指针移向下一个状态（使用yield分割）。换言之，Generator 函数是分段执行的，`yield`表达式是暂停执行的标记，而`next`方法可以恢复执行。
  - `yield`有点像函数的中间返回语句，它生成的值会出现在 `next()`方法返回的对象里，通过 `yield`关键字退出的生成器函数会处于 `{done: false}`状态，直接通过 `return` 关键字退出的生成器函数会处于 `done: true`状态
  - `yield`语句必须在生成器函数内部使用

生成器和迭代器的关系：`generator`实现了 `iterator`接口，每一次生成器调用next方法，

生成器每一次调用 `next`方法之后， 返回都得是一个对象 `{value: xx, done: false / true}`

```js
// yield用于函数代码的分割，3个分隔符产生4块代码
function* gen() {
    console.log("123");
    yield 'aaaaa';
    console.log("456");
    yield 'bbbbb';
    console.log("789");
    yield 'cccc';
}
let gen1 = gen();
console.log(gen1); //生成器对象gen
// 生成器函数的执行必须调用迭代器的next()，value的值 = yield后的值
//这里的item是执行相对代码块后，然后输出value
for (item of gen1) { console.log(item, "这是一个片段"); } 
//123
//aaaaa 这是一个片段
//456
//bbbbb 这是一个片段
//789
//cccc 这是一个片段
//或者使用：
// gen1.next();      ///123
// gen1.next();      ///456
```



在生成器的`next`传入实参，传入的参数作为上一个yield语句的整体返回结果

```js
function* gen(arg) {
    console.log(arg);
    let one = yield 111;
    console.log(one);

    let two = yield 222;
    console.log(two);

    let three = yield 333;
    console.log(three);
}
let iterator = gen('AAA');
//这里输出的是yield的返回值，而不是输出value，所以你看不到111，222，333的输出
iterator.next();             //AAA；    第一个next虽然没有传值，但是第一次调用next()，你即使传入的值不会被使用（来自红宝书 p196），因为这一次调用是为了开始执行生成器函数
iterator.next();             //undefined
iterator.next('BBB');        //BBB
iterator.next('CCC');        //CCC
```



**生成器应用异步编程**

下面使用 `setTimeout` 模拟异步任务的执行

```js
function getUser() {
    setTimeout(() => {
        let data = "用户信息"
        iterator.next(data);
    }, 1000)
}
function getGood() {
    setTimeout(() => {
        let data = "商品信息"
    }, 1000)
}
function* gen() {
    let data = yield getUser();
    console.log(data);
    yield getGood();
}
let iterator = gen();
iterator.next();
```

不过此时在内部居然要依赖外部的变量 `iterator`，有点耦合度太大了，不太好

#### async await 的实现原理

此时替换成以下形式（async await 的实现原理）

```js
function getUser() {
    return new Promise((res, rej) => {
        setTimeout(() => {
            let data = "用户信息"
            res(data)
        }, 1000)
    })
}
function getGood(args) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            let data = "商品信息 " + args
            res(data)
        }, 1000)
    })
}
function* gen() {
    const data = yield getUser();
    console.log(data);
    const data2 = yield getGood(data);
    console.log(data2);
}
function run(fn) {
    const gen = fn()
    function next(data) {
        const res = gen.next(data)
        if (res.done) return res.value
        res.value.then(res => {
            next(res)
        })
    }
    next()
}
run(gen)
```



使用迭代器构造小型计时器（案例）

```js
function* gen() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            console.log(i);
            a.next();
        }, 1000);
        yield;
    }
}
let a = gen();
a.next();
```



### 生成器实现机制

#### 协程

阮一峰老师也说过：Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权（即暂停执行）。

让生成器的阻塞机制：协程，我们需要一探究竟

协程：协程是一种比线程更加轻量级的存在，协程处在线程的环境中，一个线程可以存在多个协程，可以将协程理解为线程中的一个个任务。不像进程和线程，协程并不受操作系统的管理，而是被具体的应用程序代码所控制。

协程的切换在用户态完成，切换的代价比线程从用户态到内核态的代价小很多。

操作系统并不知道协程的存在，它只知道线程，**因此在协程调用阻塞IO操作的时候，操作系统会让线程进入阻塞状态，当前的协程和其它绑定在该线程之上的协程都会陷入阻塞而得不到调度，这往往是不能接受的。**

因此在协程中不能调用导致线程阻塞的操作。也就是说，协程只有和异步IO结合起来，才能发挥最大的威力。



一个线程一次只能**执行**一个协程。比如当前执行 A 协程，另外还有一个 B 协程，如果想要执行 B 的任务，就必须在 **A 协程中将JS 线程的控制权转交给 B协程**，那么现在 B 执行，A 就相当于处于暂停的状态

举一个例子（来源于https://juejin.cn/post/6844904004007247880#heading-24的生成器例子）

```js
function* A() {
    console.log("我是A");
    yield B(); // A停住，在这里转交线程执行权给B
    console.log("结束了");
  }
  function B() {
    console.log("我是B");
    return 100;// 返回，并且将线程执行权还给A
  }
  let gen = A();
  gen.next(); // 我是A 我是B
  gen.next(); // 结束了
```



#### 循环状态机

通过ES5babel的转换，我们可以看到以下的ES6代码的转换

```js
function* generateRandoms (max) {
  max = max || 1;

  while (true) {
    let newMax = yield Math.random() * max;
    if (newMax !== undefined) {
      max = newMax;
    }
  }
}
```

```js
var generateRandoms = regeneratorRuntime.mark(function generateRandoms(max) {
  var newMax;
  return regeneratorRuntime.wrap(function generateRandoms$(context$1$0) {
    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        max = max || 1;

      case 1:
        if (!true) {
          context$1$0.next = 8;
          break;
        }
        context$1$0.next = 4;
        return Math.random() * max;
      case 4:
        newMax = context$1$0.sent;
        if (newMax !== undefined) {
          max = newMax;
        }
        context$1$0.next = 1;
        break;
      case 8:
      case "end":
        return context$1$0.stop();
    }
  }, generateRandoms, this);
});
```

其中是通过状态机的模拟（switch + 无限循环while）实现，退出循环的时候是通过判断当前是否到达最后一步进行break

这一片文章作者自己设计代码模拟原生的generator并且讲解的很详细，值得一看https://zhuanlan.zhihu.com/p/216060145



## 7.其他

#### 可选链

可选链是ES11（2020）中增加的特性

- 它作用是当对象属性不存在时，会短路，直接返回undefined，如果存在，那么才会继续执行

- 使用：（ 如果`b`不为`undefined`则继续进行属性查找找到`c` ）

  ```js
  const a = {
      b: {
          c: "allen"
      }
  }
  console.log(a.b?.c)
  ```

  



#### 执行上下文 & 作用域

变量和函数的上下文决定了他们可以访问哪些数据，以及他们的行为，每个上下文都有一个关联的变量对象，而这个上下文中定义的所有变量和函数都存在于这个对象之上。（个人理解，上下文 = 他们的作用域）

**全局上下文**：全局上下文是最外层的上下文，根据ESMAScript的宿主环境对象可能不一样。但是在浏览器中，全局上下文就是我们常说的window对象。上下文在其所有代码都执行完毕后会被销毁，而全局上下文在应用程序退出前才会被销毁，比如关闭网页、退出浏览器。

**函数上下文**：每个函数都有自己的上下文，当函数上下文被推到一个上下文栈上，当函数执行完之后，上下文栈会弹出该函数上下文，将控制权返还给之前的上下文

内部上下文可以通过作用域链访问外部上下文的一切，但是外部上下文无法访问内部上下文的一切，即每个上下文都可以到上一级上下文中去搜索变量和函数，但任何上下文都不能到下一级上下文去搜索。

**注意**

- 除了全局上下文 和 函数上下文，还有`eval()`第三种上下文
- 而且还有其他方式来增强作用域，比如某些语句会导致在作用域链前端临时添加一个上下文，比如 `try/catch`、`with`



#### 诡异行为小思考

先上代码，先上代码

```js
console.log(a) // undefined
{
a=1
function a() {}
}
console.log(a) // 1
```

```js
console.log(a) // undefined
{
function a() {}
a=1
}
console.log(a) // func a
```

我在网上搜到的部分参考，希望对你们有帮助

![](/JavaScript进阶ES6(下)/guiyi.jpg)

![](/JavaScript进阶ES6(下)/guiyi2.jpg)

![](/JavaScript进阶ES6(下)/guiyi3.jpg)