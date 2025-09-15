---
author: Hello
categories: 前端
title: JavaScript进阶ES5
description: 'js相关知识'
---

## 1.ES5部分的方法

#### 数组方法

1.`forEach()` ：    `arr.forEach(function(vlaue, index, [array]))`  分别对应数组的value（值）、index（索引号）、数组本身

（遍历数组的全部元素，即使return true也不会终止迭代）

（因为forEach本质是一个函数，参数是一个回调函数，回调函数的return只是终止了回调函数而已，不是终止forEach，而forEach内部应该是多次调用了那个函数）

在 `forEach`遍历中，无法改变item（原数组里的元素，如果元素是数组 or 对象，那另当别论 0.0 ）

```js
// 数组改值
let arr = [1,3,5,7,9];
arr.forEach(function(item){
    item = 30;
})
console.log(arr);   //输出  [1, 3, 5, 7, 9]     
```

```js
let arr = [{ a: 1 }, { a: 2 }, { a: 3 }];
let arr2 = [[1], [1], [1]];
arr.forEach(function (item) {
  item.a = 2;
})
arr2.forEach(item => {
  item.push(2)
})
console.log(arr);                //[ { a: 2 }, { a: 2 }, { a: 2 } ]
console.log(arr2);               //[ [ 1, 2 ], [ 1, 2 ], [ 1, 2 ] ]
```

如果你硬要改变item，也不是不可以，只是方法要稍稍改动，使用引用的方式进行修改

```js
// 数组改值
let arr = [1,3,5,7,9];
arr.forEach(function(item,index,arr){
    arr[index] = 30;
})
console.log(arr); //输出 (5) [30, 30, 30, 30, 30]
```



2.`filter()`:  filter() 方法创建一个新数组，新数组中的元素是通过检查指定数组中符合条件的所有元素，主**要用于筛选数组**    

（注意它直接返回一个新数组）

`array.filter(function(currentValue, index, [arr]))`   分别对应currentValue（数组当前项的值），index（索引号），arr（数组本身），它的回调函数返回的必须是一个Boolean值，返回true自动将value加入新数组中，false则过滤掉，最后整体返回一个新数组

```js
var newArr = arr.filter(function(value, index) {
	return value >= 20;
})
```

`find()`方法有点类似filter，只不过返回的不是新数组，而是返回符合测试条件的第一个数组元素值

而对应的`findIndex()`方法返回数组中满足提供的测试函数的第一个元素的**索引**。若没有找到对应元素则返回-1。



3.`some()` ：some()方法用于检测数组中的元素是否  **存在**  满足指定条件，通俗点就是查找数组中是否有满足条件的元素，找到第一个满足条件的元素则停止

（注意它返回的是布尔值）在`some`里设置`return true` 以终止遍历

`array.some(function(currentValue, index, [arr]))`  分别对应currentValue（数组当前项的值），index（索引号），arr（数组本身） 

4.`map()` 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值。和forEach相似，不同在于：

​		如果更改数组内的值，`forEach` 不能确保数组的不变性。这个方法只有在你不接触里面的任何值时，才能保证不变性。

​		由于它们之间的主要区别在于是否有返回值，所以你会希望使用 `map` 来制作一个新的数组，而使用 `forEach` 只是为了映射到数组上(修改原来的数组)

返回值加入新数组中

```js
let newarr = arr.map(function(value, index) {
	return value * 2;
})
```

map的不变性：当数组为基础类型时原数组不变

```js
let array=[1,2,3,4,5]
let newArray=array.map((item) => item*2)
console.log(array); // [1,2,3,4,5]
console.log(newArray);//[2, 4, 6, 8, 10]
```

当数组为引用类型时原数组发生改变：

```js
let array = [{ name: 'Anna', age: 16 }, { name: 'James', age: 18 }]
let newArray=array.map((item) => {
    item.like='eat';
    return item;
})
console.log(array); // [{ name: 'Anna', age: 16,like: "eat"},{ name: 'James', age: 18,like: "eat"}]
console.log(newArray);//[{ name: 'Anna', age: 16,like: "eat"},{ name: 'James', age: 18,like: "eat"}]
```



5.`every()` 方法用于检测数组所有元素是否都符合指定条件

6.`arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])`

参数分别对应回调函数和初始值

对数组中所有内容进行汇总，点像递归

```js
let total = a.reduce(function (preValue, currValue) {
  return preValue + currValue;
}, 0);
// 遍历到第一次时，preValue为初始值，currValue为数组里的第一个值
// 遍历到第二次时，preValue为第一次返回的值，currValue为数组里第二个数
```

**以上ES5数组方法有助于链式编程（函数式编程）**，比如：

```js
//this.$store.state.cartList 是一个数组
this.$store.state.cartList
    .filter((item) => item.checked === true)
    .reduce((preValue, item) => {
    return preValue + item.count * item.price;
}, 0)
    .toFixed(2);
```



#### **数组扁平化方法**

`apply`（仅限双层）

```js
function Flat1(arr){
    return [].concat.apply([],arr);
}

var arr1 = [[1, 2],[3, 4, 5], [6, 7, 8, 9]];
console.log(Flat1(arr1)); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

展开运算符（仅限双层）

```js
function Flat1(arr){
    return [].concat(...arr);
}
```

多层需要递归

```js
function Flat5(arr){
    var newArr =[];
    for(var i= 0; i < arr.length; i++){
        if(arr[i] instanceof Array){
            newArr = newArr.concat(Flat5(arr[i]));
            // newArr.push.apply(newArr, Flat5(arr[i]));
        }else{
            newArr.push(arr[i]);
        }
    }
    return newArr;
}
```

es6方法

```js
const Flat6 = arr => arr.reduce((a, b) => a.concat(Array.isArray(b) ? Flat6(b) : b), []); 
```

如果数组的元素都是数字，那么我们可以考虑使用 toString 方法

```js
function flatten(arr) {
    return arr.toString().split(',').map(function(item){
        return +item
    })
}
```





#### 对象方法

`Object.defineProperty()` 定义对象中新属性或修改原有的属性（应用于vue响应式双向绑定，还有es5实现const的原理）

`Object.defineProperty(obj, prop, desciptor)` 

`obj`：必须，目标对象  

`prop`： 必需，需定义或修改的属性名

`descriptor`： 必须，目标属性所拥有的特性，一对象的形式{ }进行书写，

- `value`设置属性的值，默认undefined；

- `writable`值能否重写（修改），默认为false；

- `enumerable`：目标属性是否可以被枚举(是否可以被遍历，显示出来)，默认false；

- `configurable`目标属性是否可以被删除，或者再次修改特性（是否可以再次更改这个descriptor），默认false；
  - 不管是否为严格模式，尝试修改一个不可配置的属性描述符都会出错，也就是说configurable的修改为false是单向操作！！
  
- 除此外还具有以下可选键值：

  - 当定义getter、setter时，属性就会被定义为“访问描述符”，此时JavaScript会忽略他们的`value`和`writable` 特性
  - 通常来说getter和 setter是成对出现的（只定义一个的话通常会产生意料之外的行为）

  - `get`：当访问该属性时，会调用此函数。执行时不传入任何参数，但是会传入 `this` 对象（由于继承关系，这里的`this`并不一定是定义该属性的对象）。该函数的返回值会被用作属性的值。

  - `set`：当属性值被修改时，会调用此函数。该方法接受一个参数（也就是被赋予的新值），会传入赋值时的 this 对象(修改后的值)。

```js
var obj = {
	id: 1,
	pname: '小米',
	price: 1999
}
//以前的对象添加修改方式
//obj.num = 1000;
//obj.price = 99;
Object.defineProperty(obj, 'num', {
    value = 999,
    enumerable = true
})
```

`Object.keys(obj)` 方法会返回一个由一个给定对象的自身可枚举属性组成的数组，数组中属性名的排列顺序和使用 for...in 循环遍历该对象时返回的顺序一致 。如果对象的键-值都不可枚举，那么将返回由键组成的数组。

`Object.keys(obj1).length`得到当前对象属性个数

`Object.getOwnPropertyNames(obj1)`返回对象实例的常规属性数组

`Object.getOwnPropertySymbols(obj1)`返回对象实例的符号属性数组

这两种方法互斥



## 2.函数定义和调用

函数定义：

1. 自定义函数：`function fn() {};`

2. 匿名函数： `var fun = function() {};`

   - 匿名函数三大缺点：

   - 1.调用栈更难追踪

   - 2.自我引用更难（递归等）

   - 3.代码较难理解

   - ```js
     const a = function b (){
         console.log('woshib');
     }
     b();  //b is not defined
     ```

3. `new Function('参数1', '参数2', '函数体')`形式调用   像构造函数,   Function里面的参数都必须是字符串格式

```js
var f = new Function('a', 'b', 'console.log(a + b)');
```

实际上所有的函数都是Function的实例

函数也属于对象

函数调用：

1. 普通函数调用

```js
function fn() { 
    //something
}
fn();
```

2. 对象方法

```js
var o = {
	say: function() {
		//something
	}
}
o.say();
```

3. 构造函数

```js
function Star() {};
new Star();
```

4. 绑定事件函数`btn.onclick = function() {}`

5. 定时器函数 `setInterval(function() {}, 1000);`

6. 立即执行函数（自动调用） `(function() {} )();`
   - 立即执行函数和普通函数有实际意义上非常重要的区分，此时函数会被当作函数表达式和不是一个标准的函数声明来处理。此时函数只能在它所代表的位置中被访问，外部作用域不行，不会非必要的污染外部作用域



## 3.this的指向

#### 函数内this的指向

是当我们调用函数时，根据调用栈确定的（动态作用域），调用方式不同导致this指向不同

1.普通函数调用：window

2.构造函数调用：实例对象，原型对象也是指向实例对象（同样的，类中this也是指向实例对象）

3.对象方法：该方法所属对象（隐式绑定）

- 对象属性引用链只有上一层或者最后一层在调用位置中起作用

  ```js
  function foo(){
      console.log(this.a);
  }
  const obj2 = {
      a:42,
      foo
  }
  const obj1 = {
      a:2,
      obj2
  }
  obj1.obj2.foo(); //42
  ```

4.事件绑定：绑定事件对象（当前情况指的是位于回调函数的内部中this指向）

5.定时器函数：window

6.立即执行函数：window



（2）但是立即执行函数还得看这时this是否在对象方法或者构造函数中，第二个虽然是立即执行函数，但是此时它的this和foo绑定了，所以还是输出foo的a

（3）`fn`是对`foo.bar`的一个引用，实质上，它引用的是`bar`函数本身，因此此时的 `fn`是一个不带任何修饰的函数调用， 应用默认绑定（发生了隐式丢失）

（4）箭头函数按照的是词法作用域，按照词法作用域找就好了（对象没有自己的作用域）

（5）而赋值操作 ，会创建一个函数的间接引用，此时调用函数会应用默认绑定（this指向window，严格模式为undefined）

- `foo.bar = foo.bar`返回值是目标函数的引用，此时相当于直接调用 `bar()`

（6）最后一个参数传递其实就是一种隐式赋值，传入一个对foo.bar的引用，不加任何修饰，因此是默认绑定（this指向window，严格模式为undefined）

```js
var a = 1;
var foo = {
    a: 2,
    bar: function () {
        return this.a;
    },
    bad: () => {
        return this.a             //箭头函数导致this永远绑定了父级作用域window
    },
};
const fn = foo.bar;
function doFoo(fn) {
    console.log('6.', fn());
}
console.log('1.', foo.bar());            //1. 2
console.log('2.', (foo.bar)());          //2. 2
console.log('3.', fn());                 //3. 1
console.log('4.', foo.bad());            //4. 1
console.log('5.', (foo.bar = foo.bar)());//5. 1
doFoo(foo.bar);                          //6. 1
```



“匿名函数的执行环境具有全局性”，所以最里层那个函数中this指向全局环境（走了默认绑定），全局环境没有定义foo变量所以输出undefined。在匿名函数外部将this保存到一个内部函数可以访问的变量self中，可以通过self访问这个对象，所以self.foo为bar

```javascript
var myobject = {
    foo: "bar",
    func: function () {
        var self = this;
        console.log(this.foo);
        console.log(self.foo);

        (function () {
            console.log(this.foo);//undefined
            console.log(self.foo);//bar
        })();
    }
};
myobject.func();
```



#### 类的this指向

类的方法内部如果含有`this`，它默认指向类的实例。但是，必须非常小心，一旦单独使用该方法，很可能报错。

```js
class Logger {
  printName(name = 'there') {
    this.print(`Hello ${name}`);
  }

  print(text) {
    console.log(text);
  }
}

const logger = new Logger();
const { printName } = logger;
printName(); // TypeError: Cannot read property 'print' of undefined
```

上面代码中，`printName`方法中的`this`，默认指向`Logger`类的实例。但是，**如果将这个方法提取出来单独使用**，`this`会指向该方法运行时所在的环境（由于 class 内部是严格模式，所以 this 实际指向的是`undefined`），从而导致找不到`print`方法而报错。

（1）一个比较简单的解决方法是，在构造方法（constructor）中绑定`this`，这样就不会找不到`print`方法了。

```js
class Logger {
  constructor() {
    this.printName = this.printName.bind(this);
  }

  // ...
}
```

（2）另一种解决方法是使用箭头函数。

```js
class Obj {
  constructor() {
    this.getThis = () => this;
  }
}

const myObj = new Obj();
myObj.getThis() === myObj // true
```



#### 改变this指向

JavaScript为我们专门提供了一些函数方法来帮助我们处理函数内部this指向问题，常用的有bind()、call()、apply()三种方法

1.`call()`前面讲过，call的主要作用可以实现继承



2.`apply()`方法调用一个函数，简单理解为调用函数的方式，但是它可以改变this的指向

`fun.apply(thisArg, [argsArray])` 

- `thisArg`：在函数执行时指定的this对象 ，**不传，或者传null,undefined， 函数中的 this 指向 window 对象**

- `argsArray`: 传递的值，必须包含在数组（伪数组）里面**（这个是和call的不同点）**

返回值为函数的返回值，因为它就是调用函数

应用方面：apply传递数组参数，所以可以借助数学内置对象求最大值 `Math.max.apply(Math,arr)`

（es6拓展运算符...`Math.max(...arr)`也可以，但是不能 `Math.max(arr)`，因为max不接受数组，只接受一个一个的参数）



3.`bind()`方法不会调用函数，但是能改变函数内部this指向，当使用 new 操作符调用绑定函数时，该参数无效。

`fun.bind(thisArg, arg1, arg2....)` 

返回指定this值和初始化参数改造的原函数**拷贝**（即创造新的函数 `var f = fn.bind(xx)`）

应用方面：定时器等不想立即调用的函数（或者处理其他只能用that来暂时储存对象的情况）

```js
btn.onclick = function() {
	this.disabled = true;
	//var that = this;
	//old way:
	/*setTimeout(function() {
		//that.disabled = false;
	}, 3000)*/
	//new way:
    setTimeout(function() {
         this.disabled = false;
    }.bind(this), 3000)       //这个this指向btn
}
```

巧妙运用：  传参的时候可以传递其他对象过来

```js
class Tab {
    constructor(id) {
        this.main = document.querySelector(id);  //tabsbox
        this.lis = this.main.querySelectorAll('li');
     }
	// 初始化    
    init() {
        for (let i = 0; i < this.lis.length; i++) {
            this.lis[i].onclick = this.toggleTab.bind(this.lis[i], this);
        }
    }
 	// 切换功能   
    toggleTab(that) {
        that.clearTab();
        this.className = 'liactive'
        that.sections[this.index].className = 'conactive';
    }
}
```



如果一个函数进行多次 `bind`的情况：！！

```js
let a = {}
let fn = function () { console.log(this) }
fn.bind().bind(a)()
```

答案是第一下的结果，即this指向第一个bind传入的this，这里没有的话就是window

```js
// fn.bind().bind(a) 等于
let fn2 = function fn1() {
  return function() {
    return fn.apply()
  }.apply(a)
}
fn2()
```

也可以理解为变成了

```js
a.window.fn()
```



#### 三大this指向手写模式

实质上原理也是利用隐式绑定，通过 `上下文.函数()`调用改写this，从而变成显式绑定

解释一下，在`Function.prototype`里通过属性定义方法，此时this指向函数本身（因为是函数在调用）

call指向

```js
Function.prototype.myCall = function(context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  context = context || window
  context.fn = this
  const args = [...arguments].slice(1)
  const result = context.fn(...args)
  delete context.fn
  return result
}
```

bind的实现（借助一波apply / call）

```js
Function.prototype.myBind = function (context) {
  if (typeof this !== 'function') {
    throw new TypeError('Error')
  }
  const _this = this
  const args = [...arguments].slice(1)
  // 返回一个函数
  return function F() {
    // 因为返回了一个函数，我们可以 new F()，所以需要判断
    if (this instanceof F) {
      return new _this(...args, ...arguments)
    }
    return _this.apply(context, args.concat(...arguments))
  }
}
```



#### 三大this指向不安全点

如果把null 或者 undefined 作为this绑定对象，传入call、bind、apply，则调用时会被忽略，可能给全局window添加副作用，将规则绑定到全局对象，可能导致不可预计的后果

（指向参数传入null的应用场景是柯里化传参）

此时可以传入一个“更空”的空对象（没有Object.prototype这个委托），避免这种危险

```js
const d = Object.create(null);
foo.bind(d, ['a', 'b']);
```



#### 软绑定

隐式绑定：对象绑定

显式绑定：apply、call

硬绑定：bind

硬绑定可以把this强制绑定到指定对象。但是硬绑定会大大降低函数的灵活性，使用硬绑定之后则无法使用显式绑定或者隐式绑定修改this

如果可以给默认绑定指定一个除了全局对象和undefined以外的值，那就可以实现和硬绑定相同的效果，同时保留隐式绑定或者显式绑定修改this的能力

```js
if(!Function.prototype.softBind) {
    Function.prototype.softBind = function(obj) {
        var fn = this;
        var curried = [].slice.call(arguments, 1);
        var bound = function(){
            // 如果this不是window || global则不使用传入的obj，如果是，则将this绑定obj
            return fn.apply(
                (!this || this === (window || global)) ? obj : this,
                curried.concat.apply(curried, arguments)
            );
        };
        bound.prototype = Object.create(fn.prototype);
        return bound;
    }
}
```

此时实现了软绑定

```js
function foo() {
    console.log(`name: ${this.name}`);
}
var obj = { name: "obj" }
var obj2 = { name: "obj2" }
var obj3 = { name: "obj3" }
obj2.foo = foo.softBind(obj);
obj2.foo();                   //name: obj2
foo.softBind(obj).call(obj3); //name: obj3
setTimeout(obj2.foo, 1000);   //name: obj
```



## 4.严格模式

ie10以上版本才支持	它是让JavaScript以严格的条件下运行代码

1.消除了JavaScript一些语法不严谨的地方，减少怪异行为

2.消除代码一些不安全之处，保证代码运行的安全

3.提高编译器效率，增加运行速度

4.禁用了ECMAscript在未来版本中可能会定义的一些语法，为未来JavaScript做好铺垫，比如class、enum、super等

#### 开启严格模式

应用到整个到整个脚本或个别函数中，因此，我们可以讲严格模式分为脚本开启严格模式和为函数开启严格模式两种情况

为脚本开启严格模式：

```js
<script>
	"use strict";
	//xxxx
</script>
```

方法二：（写在立即执行函数里的都要按照严格模式）

```js
<script>
	(function()	{
		"use strict";
		/xxxx
	})();
</script>
```

为函数开启严格模式：(只在此函数内部有严格模式)

```js
<script>
	function fn(){
		"use strict";
		/xxxx
	}
</script>
```



#### 变化

1.严格模式禁止变量为声明就赋值

2.严禁删除已声明的变量，比如`delete x;`  是错误的

3.在严格模式下，全局作用域中函数中的this不再是window，而是undefined（但是定时器之类的还是指向window）

4.严格模式下，如果构造函数不配合new来使用，this就会报错

5.函数不能有重名参数

6.函数必须声明在顶层，因为新版本的JavaScript引入了块级作用域，所以不允许在非函数代码块内声明函数



## 5.闭包

闭包指有权访问另外一个函数作用域中变量的**函数**，简单理解就是一个作用域可以访问另外一个函数内部的局部变量

（被访问作用域的函数就是闭包函数）

```js
//在此处fun函数作用域访问了另外一个函数fn里面的局部变量num，形成了闭包，此时fun就是闭包
//fun被赋予了一个全局变量，所以fun始终保存在内存中，而fun依赖fn的num，因此num也始终在内存中
function fn() {
        var num = 10;
        function fun() {
            console.log(num);
        }
        fun();
    }
    fn();
```

在fn外部作用域访问fn内部局部变量（它返回了当时的作用域）：

```js
//所以闭包就是典型的高阶函数
function fn() {
        var num = 10;
        return function() {
            console.log(num)
        }
    }
var f = fn();
f();
```

闭包的主要作用：

- 延伸了变量的作用范围（读取函数内部的变量）
- 让这些变量的值始终保持在内存中

闭包缺点：

- 由于闭包会使得函数中的变量都被保存在内存中，内存消耗很大，所以不能滥用闭包，否则会造成网页的性能问题，在IE中可能导致内存泄露



利用闭包解决异步问题：（因为函数是一个作用域）

```js
//立即执行函数也成为了小闭包，因为立即执行函数里面任何一个函数都可以使用它的i变量，此时里面使用外层i的函数，都是闭包
for (var i = 0; i < lis.length; i++) {
    (function (i) {
        lis[i].onclick = function () {
            console.log(i)
        }
    })(i);
}
```

回调函数：获取异步操作的**结果**，只要使用了回调函数，实际上就是使用闭包---《你不知道的JavaScript》

一般情况下，把函数作为参数的目的就是为了获取函数内部的异步操作的结果

```js
//如果需要获取一个函数中异步操作的结果，则必须通过回调函数来获取
function fn(callback) {
	setTimeout(function () {
		var data = 'hello';
		callback(data);
	}, 1000)
}
fn(function (data) {
	console.log(data);
})
```



#### 高阶函数

如果一个函数符合下面两个规范的任何一个，那该函数就是高阶函数

- 若A函数，接收的参数是一个函数，那么A就可以称之为高阶函数（比如Promise、setTimout）
- 若A函数，调用的返回值仍然是一个函数，那么A就可以称之为高阶函数（比如防抖，React实现传参的回调函数）

**函数的柯里化**

通过函数调用继续返回函数的方式，实现多次接收参数最后统一处理的函数编码形式（比如React实现传参的回调函数）

```js
function sum(a){
	return (b) => {
		return (c)=> {
			return a+b+c;
		}
	}
}
sum(1)(2)(3)
```



#### 纯函数

一类特别的函数

必须遵守以下约束：

- 不得改写参数数据（如果传入数组、对象，则不能让他们发生改动）
- 只要是同样的输入（实参），必定得到同样的输出（返回）

- 不会产生任何副作用（例如网络请求，输入和输出设备）
- 不能调用`Date.now()`或者`Math.random()`等不纯方法

redux的reducer必须是一个纯函数



#### 闭包的模块

有两个主要的特征（源自《你不知道的JavaScript》）

- 为创建内部作用域而调用了一个包装函数
- 包装函数的返回值必须至少包括一个对内部函数的引用，这样就会创建涵盖整个包函数内部作用域的闭包



## 6.递归

如果一个函数在内部可以调用其本身，则这个函数是递归（俄罗斯套娃）

但是容易发生“栈溢出”错误，所以必须加退出条件“return”



#### 浅拷贝和深拷贝

（jQuery篇目有提及到（`$.extend([deep], target, object1, [objectN])`））

1.浅拷贝只是拷贝一层，更深层次对象级别的只拷贝引用

2.深拷贝拷贝多层，每一级别的数据都会拷贝

ES6中浅拷贝的语法糖：`Object.assign(target, ...source)`（把source拷贝给target，它将返回目标对象。）

```js
const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };

const returnedTarget = Object.assign(target, source);

console.log(target);
// expected output: Object { a: 1, b: 4, c: 5 }，按顺序覆盖掉原来的属性
```

利用循环写浅拷贝

```js
var obj = {
        id: 1,
        name: 'andy',
        msg: {
            age: 18
        }
    };
    var o = {};
    for (var k in obj) {
        // k是属性名， obj[k]是属性值
        o[k] = obj[k];
    }
```

利用递归写深拷贝

缺点在于：性能不好，占用内存很大

```js
var obj = {
        id: 1,
        name: 'andy',
        msg: {
            age: 18
        }
    };
    var o = {};
    function deepcopy(newobj, oldobj) {
        for(let k in oldobj) {
            // 获取属性值
            const item = oldobj[k];
            // 判断该值是否属于数组(数组也属于object，所以要先写)
            if(item instanceof Array) {
                newobj[k] = [];
                deepcopy(newobj[k], item);
            } else if(item instanceof Object) {
                // 判断该值是否为对象
                newobj[k] = {};
                deepcopy(newobj[k], item);
            } else {
                // 所以剩下的属于简单数据类型
                newobj[k] = item;
            }
        }
    }
    deepcopy(o, obj);
    console.log(o);
```

使用 `JSON.parse`和 `JSON.stringify`实现深拷贝

```js
const info = {name: "Allen", friends: {name: "Khan"}};
const newobj = JSON.parse(JSON.stringify(info));
```

这个方式的缺点在于：不能有undefined值，不然就会出现不可预期的问题（有可能删除掉undefined的字段）



#### 完整版深拷贝

github上一个叫lodash的库，使用深拷贝也差不多是类似的方法

```js
const getType = obj => Object.prototype.toString.call(obj);

const isObject = (target) => (typeof target === 'object' || typeof target === 'function') && target !== null;

const canTraverse = {
  '[object Map]': true,
  '[object Set]': true,
  '[object Array]': true,
  '[object Object]': true,
  '[object Arguments]': true,
};
const mapTag = '[object Map]';
const setTag = '[object Set]';
const boolTag = '[object Boolean]';
const numberTag = '[object Number]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';
const dateTag = '[object Date]';
const errorTag = '[object Error]';
const regexpTag = '[object RegExp]';
const funcTag = '[object Function]';

const handleRegExp = (target) => {
  const { source, flags } = target;
  return new target.constructor(source, flags);
}

const handleFunc = (func) => {
  // 箭头函数直接返回自身
  if(!func.prototype) return func;
  const bodyReg = /(?<={)(.|\n)+(?=})/m;
  const paramReg = /(?<=\().+(?=\)\s+{)/;
  const funcString = func.toString();
  // 分别匹配 函数参数 和 函数体
  const param = paramReg.exec(funcString);
  const body = bodyReg.exec(funcString);
  if(!body) return null;
  if (param) {
    const paramArr = param[0].split(',');
    return new Function(...paramArr, body[0]);
  } else {
    return new Function(body[0]);
  }
}

const handleNotTraverse = (target, tag) => {
  const Ctor = target.constructor;
  switch(tag) {
    case boolTag:
      return new Object(Boolean.prototype.valueOf.call(target));
    case numberTag:
      return new Object(Number.prototype.valueOf.call(target));
    case stringTag:
      return new Object(String.prototype.valueOf.call(target));
    case symbolTag:
      return new Object(Symbol.prototype.valueOf.call(target));
    case errorTag: 
    case dateTag:
      return new Ctor(target);
    case regexpTag:
      return handleRegExp(target);
    case funcTag:
      return handleFunc(target);
    default:
      return new Ctor(target);
  }
}

const deepClone = (target, map = new WeakMap()) => {
  if(!isObject(target)) 
    return target;
  let type = getType(target);
  let cloneTarget;
  if(!canTraverse[type]) {
    // 处理不能遍历的对象
    return handleNotTraverse(target, type);
  }else {
    // 这波操作相当关键，可以保证对象的原型不丢失！
    let ctor = target.constructor;
    cloneTarget = new ctor();
  }

  if(map.get(target)) 
    return target;
  map.set(target, true);

  if(type === mapTag) {
    //处理Map
    target.forEach((item, key) => {
      cloneTarget.set(deepClone(key, map), deepClone(item, map));
    })
  }
  
  if(type === setTag) {
    //处理Set
    target.forEach(item => {
      cloneTarget.add(deepClone(item, map));
    })
  }

  // 处理数组和对象
  for (let prop in target) {
    if (target.hasOwnProperty(prop)) {
        cloneTarget[prop] = deepClone(target[prop], map);
    }
  }
  return cloneTarget;
}
```



`immutable.js`的拷贝也值得探讨（记住是浅拷贝，如果数据类型复杂，在里面还得继续包裹immutable的Map）

它的实现原理是persistent data structure（持久化数据结构），也就是使用旧数据创建新数据时，**保证旧数据同时可用且不变**，同时避免了deepcopy把所有的节点都复制一遍带来的性能损耗，immutable使用了structural sharing（结构共享），即如果对象树中一个节点发生变化，只修改这个节点和受他影响的父节点，则其他节点进行共享

比如说

```js
a = {
	b1: {
		c1:{
			d1: 1
		},
		c2:{}
	},
	b2:{
		c3:{}
	}
}
```

此时通过 `immutable` 拷贝得到对象 a2，将里面的c1进行更改，此时不会影响到原来的对象，而是从c1分裂新生成一个新的节点，然后b1，a跟着变，得到一个既和a共享部分数据，又有自己的新数据的对象

从这张图可以看到清楚的反应[2165169-cebb05bca02f1772 (613×575) (jianshu.io)](https://upload-images.jianshu.io/upload_images/2165169-cebb05bca02f1772)

而这篇文章用于加深immutable的原理https://zhuanlan.zhihu.com/p/44571842

![](/simple-blog/JavaScript进阶ES5/immutable.png)

但是这种为了保持状态的场景比较适用于react的redux（纯函数），如果是vue的话就没必要考虑这么麻烦



## 7.正则表达式

#### 概述

正则表达式（regular expression）是用于匹配字符串中字符组合的模式，再JavaScript，正则表达式也是对象

正则表达式通常用来做检索，替换那些符合某个模式（规则）的文本，例如昵称输入框里的对中文的匹配；此外，正则表达式还常用于过滤掉页面一些敏感（替换），或者从字符串获取我们想要的特定部分（提取）等

特点：1.灵活性、逻辑性、功能性非常强

2.可以迅速用极简的形式达到对字符串复杂的控制

3.对刚接触的人来说，比较晦涩难懂

4.一般实际开发，都是直接复制写好的正则表达式，但是要求会使用正则表达式且根据实际情况修改正则表达式

#### 应用

1.通过调用RegExp对象的构造函数创建  

`var 变量名 = new RegExp(/表达式/修饰符)`

`var 变量名 = new RegExp('表达式', '修饰符')`

2.通过字面量创建   `var 变量名 = /表达式/修饰符`（正则表达式不需要加引号，不管是数字型还是字符串型）

测试正则表达式是否符合语法规范：test() 正则对象方法，用于检测字符串是否符合该规则，该对象会返回true或false，其参数是测试字符串    `regexObj.test(str)`  （只要包含有str这个字符串，返回的都是true）

```js
var rg = /123/;
var rg2 = /123/g;
console.log(rg.test(123));   //true
console.log(rg.test(12123));   //true
```

g：全局模式，查找字符串全部内容，再次匹配时会向前搜索下一个匹配项

i：不区分大小写

m：多行模式，表示查找到一行末尾会继续查找

y：粘附模式，每次调用`exec()`就只会在lastIndex的位置上寻找匹配字段

u：Unicode模式

s：dotAll模式，表示元字符 `.` 可以匹配任何字符



```js
let a = "address_address";
let rg = /a/g;
let reg = new RegExp(a, "g")  //在正则中使用变量
rg.test("字符串");             //是否包含该字符串，返回布尔值
eval(`/a${a}/`).test("字符串") //在正则中使用变量 + 其他字符
a.match(rg);                  //返回匹配的字符串 + 具体信息，若正则启用全局模式，则返回一个数组，包                               含所有匹配的字符串
rg.exec(a);                   //和match差不多，不过不会因为全局模式改变返回值，如果开全局模式，下次                               再匹配一次，则从lastIndex开始匹配，在这里也就是从 下标为1的d 开始匹配
```



#### 特殊字符

一个正则表达式可以由简单的字符构成，比如/abc/， 也可以是简单和特殊字符串的组合，比如/ab*c/。其中特殊字符也被称为元字符，在正则表达式中具有特殊意义的专用符号，如^ 、$ 、+  等

（匹配特殊字符前面增加 `\`就可以了）

正则表达式速查表：https://www.runoob.com/regexp/regexp-metachar.html

边界符：`^`  表示匹配行首的文本（以谁开始）         `$` 表示匹配行尾的文本（以谁结束）

```js
var rg = /^abc/;
console.log(rg.test('abcd'));  //true
console.log(rg.test('babc'));  //false
//必须是abc,类似全等
var rg2 = /^abc$/;
console.log(rg.test('abcd'));    //false
console.log(rg.test('abcabc'));  //false
```

字符类：`[]`表示有一系列字符可供选择，只要匹配到其中一个就可以了

```js
var rg = /[abc]/;    //只要包含有a或者b或者c就返回true
console.log(rg.test('andy'));  //返回true
//var rg = /^[abc]$/ 是三选一，只有是单个a或者b或者c才返回true
```

`[]`使用范围符号 `-`

```js
var rg = /^[a-z]$/;   //26个英文小写字母任何一个字母都返回true
var rg1 = /^[a-zA-Z]$/;  //26个英文字母任何一个字母都返回true
var rg2 = /^[a-z0-9_-]$/; //任何单个26小写字母，0-9数字，_, -,都返回true
```

`[]`里使用^：如果中括号里有`^`表示取反的意思，千万别和边界符`^`混淆，要区分开来

```js
var rg = /^[^a-z]$/;  //26个英文小写字母任何一个字母都返回false
```

量词符：用来设定某个模式出现的次数，有`*`、 `+`、 `?`、 `{}`，`{}`的量词间不要有空格，可以用test来检测下方正则表达式

```js
var rg = /^a*$/;  //a可以出现0-n次，n>=0 
var rg1 = /^a+$/; //a可以出现1-n次，n>=1
var rg2 = /^a?$/; //a可以出现1或0次 (?也可以表示禁止贪婪，往最少的匹配方式去选择)
var rg3 = /^a{3}$/; //a只能可以出现3次
var rg4 = /^a{3,}$/; //a只可以出现3-n次 n>=3 
var rg5 = /^a{3,16}$/; //a只可以出现3-16次
//普遍的用户名规定：
var name = /^[a-zA-Z0-9_-]{6,16}$/
```

 括号总结

`[]`中括号：字符集合，匹配方括号中的任意字符

`{}` 大括号：量词符，里面表示重复次数，但只让大括号前面一个字符重复 （注意：`/^abc{3}$/`，只让c重复三次，即abccc）

`()` 小括号：表示优先级 可以用来：`/^(abc){3}$/`，表示让abc重复三次，即abcabc



#### 预定义类

`\d` 匹配到0-9任意一数字，相当于`[0-9]`      (`var rg = /\d/;` 或者 `let reg = new RegExp("\\d")`)

`\D` 匹配到0-9以外的数字，相当于`[^0-9]`

`\w` 匹配任意字母、数字、下划线，相当于`[A-Za-z0-9_]`

`\W`匹配除字母数字下划线以外的字符，相当于`[^A-Za-z0-9_]`

`\s` 匹配空格（包括换行符、制表符、空格符等），相当于`[\t\r\n\v\f]`

`\S`匹配非空格字符，相当于`[^\t\r\n\v\f]`  

正则里的   "或者符号"：`|`    (`var rg = /^\d{3}-\d{8}|\d{4}-\d{7}$/;`)

`.` 除了换行外的任何字符



#### 正则替换

replace()方法可以实现替换字符串的操作，用来替换的参数可以是一个字符串或者是一个字符表达式  `stringObject.replace(regexp/substr, replacement)`

```js
var str = 'red and blue and red';
var newstr = str.replace('red', 'yellow');   //结果为yellow and blue and red
//var newstr = str.replace(/red/, 'yellow'); 同理
```

但是replace只能替换掉第一个匹配的字符/正则表达式，无法满足替换掉多个敏感词

可以使用: `/表达式/[switch]` swtich也成为修饰符，即按照什么样的模式来匹配

```js
var str = 'red and blue and red';
var newstr = str.replace(/red/g, 'yellow'); //结果为yellow and blue and yellow
```



## 8.作用域

词法作用域：是一套关于引擎如何寻找变量以及会在何处找到变量的规则。词法作用域最重要的特征是他定义过程发生在代码的书写阶段（除了eval和with）

动态作用域：是JavaScript另一个重要机制this的表亲，它让作用域作为一个运行时被动态确定的形式，而不是在写代码时进行静态确定的形式。

区别是词法作用域是写代码时确定，动态作用域是运行时确定

>  事实上JavaScript并不具备动态作用域，他只有词法作用域，简单明了，但是this机制某种程度像很像动态作用域

```js
function foo(){
    console.log(a);
}
function bar(){
    var a = 3;
    foo();
}
var a = 2;
bar(); //2
```

如果JavaScript具有动态作用域，则会输出3！



从另外一串代码看词法作用域

```js
function bar(){
    var a = 3;
    function foo(){
        console.log(a);
    }
    foo();
}
var a = 2;
bar(); //3
```

作用域链 (Scope Chain)
作用域链是JavaScript引擎查找变量的机制，当访问一个变量时，会按照以下顺序查找：

```js
var global = 'global';

function outer() {
  var outerVar = 'outer';
  
  function middle() {
    var middleVar = 'middle';
    
    function inner() {
      var innerVar = 'inner';
      
      // 查找顺序：inner -> middle -> outer -> global
      console.log(innerVar);  // 在当前作用域找到
      console.log(middleVar); // 向上一层查找
      console.log(outerVar);  // 向上两层查找
      console.log(global);    // 向上三层查找到全局
    }
    
    inner();
  }
  
  middle();
}

outer();
```

内存存储：栈还是堆？
答案：主要在栈中，但涉及闭包时会在堆中

1. 执行上下文栈 (Call Stack)
```javascript
function first() {
  var a = 1;
  second();
}

function second() {
  var b = 2;
  third();
}

function third() {
  var c = 3;
  console.log('执行中...');
}

first();

// 调用栈状态：
// |  third()  | <- 栈顶
// |  second() |
// |  first()  |
// |  global   | <- 栈底
```

闭包的特殊情况
当涉及闭包时，作用域链的引用会保存在堆内存中：

```javascript
function createCounter() {
  let count = 0; // 这个变量会保存在堆中
  
  return function() {
    count++; // 闭包引用外部变量
    return count;
  };
}

const counter = createCounter();
// counter函数保持对count变量的引用
// count变量不会被垃圾回收，存储在堆中
```


栈内存 (Stack)
- 存储基本类型值和引用类型的地址
- 存储执行上下文
- 函数调用时压栈，返回时出栈
- 速度快，但空间有限

堆内存 (Heap)
- 存储对象和闭包中的变量
- 垃圾回收器管理
- 空间大，但访问相对较慢