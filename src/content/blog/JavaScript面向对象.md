---
author: Hello
categories: 前端
title: JavaScript面向对象
description: 'js相关知识'
---

## 1.编程思想

#### 介绍

面向过程（POP）：分析解决问题所需要的步骤，然后用函数把这些步骤一步一步实现，使用的时候再一步一步调用就行了

面向对象（OOP）：把事物分解成一个个对象，然后由对象之间分工合作（找出对象出来，然后写出这些对象的功能）

面向过程的性能比较高，适合和硬件联系很紧密的东西，如单片机，缺点是难维护、难拓展、难复用

面向对象的代码灵活，代码可复用性高，容易维护和开发，更适合多人合作的大型软件项目

面向对象：封装性（直接使用，不需要了解内部）、继承性、多态性（通过继承 + 不同的拓展）



#### JS的类

JavaScript只有一些近似类的语法元素，比如class关键字

但是这并不意味着JavaScript实际上有类，但是类是一种设计模式，所以我们可以用一些方法实现近似类的功能



## 2.面向对象

1.抽取对象公共属性和行为组织封装成一个类（class）

`class name {   class body  }`

2.对象实例化，获取类的对象（对象是特指某一个，实例化的具体对象）

`var xx = new name()`  利用类创建对象

对象由属性和方法构成

tip：

（1）class关键字创建类，类名习惯定义首字母大写

（2）`constructor()`是类的构造函数（默认方法），用于传递参数，返回实例对象，通过new命令生成对象实例时，自动调用该方法，如果没有明显定义，类内部会自动给我们创建一个`constructor()`（最好自己写上constructor）

```js
class Star {
	constructor(uname, age) {
		this.name = uname;
		this.age = age;
	}
}
var xxx = new Star('xxx', 20);
```



假如一个函数进行多次 `bind`呢？

```js
let a = {}
let fn = function () { console.log(this) }
fn.bind().bind(a)() // => ?
```





#### 类里添加方法

1.在类里面构造函数，不需要加function

2.多个方法、函数之间不需要添加逗号进行分割

```js
class Star {
	constructor(uname) {
		this.name = uname;
	}
    init() {
        //xxxx
    }
}
```



#### 类里添加实例对象的默认属性

在React，我还学到了往类里添加默认属性的骚操作，直接写入赋值语句

写入赋值语句后，实际上就是往实例自身追加一个属性，属性名为a，值为1，适用于一个不需要根据传参改变的写死的值

```js
class Star {
	a = 1;
}
```





#### 类的继承

使用extends进行继承

> 注意：JavaScript本身不提供“多重继承”功能，毕竟有诸多类似钻石问题的复杂情况，但开发者们还是通过其他方法实现多重继承，比如混入

super关键字用于访问和调用对象父类上的函数，可以调用父类的构造函数，也可以调用父类的普通函数

1. 在constructor中，super必须在子类this的之前进行调用，即必须先调用父类的构造函数，再使用子类的构造函数
2. super只能在派生类（子类）的构造函数和静态方法中使用

不过要注意的是：（错误示范❌）

```js
class Father {  
	constructor(x, y){
        this.x = x;
        this.y = y;
    }
    sum() {
        console.log(this.x + this.y);
    }
}
class Son extends Father {
    constructor(x, y) {
        this.x = x;            //会报错
        this.y = y;            //会报错
    }
}
var son = new Son(1, 2);  
son.sum();   //会报错
```

以上有两个错误：

- 类里面的语法中，只要符合类继承 + 子类有个构造函数(constructor)则一定要调用super，否则也会报错
  - 如果只需要继承到x、y的属性，自身不需要新的属性（类似于下方的id属性），则甚至可以不用写构造函数

- 此时参数传递给子类的constructor的x和y，而父类的sum函数用的是父类的constructor的x和y

```js
class Father {  
	constructor(x, y){
        this.x = x;
        this.y = y;
    }
    sum() {
        console.log(this.x + this.y);
    }
}
class Son extends Father {
    constructor(x, y, id) {
        //调用父类的构造函数
		super(x, y);   //并且一定要放在最开头，不能把this.id = id 放在它前面	
        this.id = id;
    }
}
var son = new Son(1, 2, 123);  
son.sum();   //success
```



继承中属性或者方法的查找原则：就近原则

在继承中，如果实例化子类输出一个方法，先看子类有没有这个方法，如果有就执行子类的

如果没有，就去查找父类有没有此方法，如果有就执行父类的

如果子类想要直接调用父类的方法，则：

```js
class Father {  
	say() {
		//xxx
	}
}
class Son extends Father {
    say() {
    //调用父类的普通函数
		super.say();
	}
}
var son = new Son();  
son.say();
```

如果在子类中添加了和父类相同的方法，则子类的方法会覆盖掉父类的方法（在当前屏蔽掉父类的方法），此举动可以称为方法的重写



#### 需要注意的三点

1.ES6中类没有变量提升，所以必须先定义类，才能通过实例化对象

2.类里的共有属性和方法一定要加this进行使用 （this指向我们创立的·实例化对象）

```js
var that;
class Father {  
	constructor(uname, age) {
        //that = this;
		this.uname = uname;
		this.age = age;
		//this.sing();   加小括号会立即调用
		this.btn = document.querySelector('button');
		this.btn.onclick = this.sing;
        this.init();    
	}
    init() {}
	sing() {
        //这里的this指向的是调用者，所以btn点击事件发生时，this.uname指向的是btn的uname
		console.log(this.uname);
        //所以可以外面定义变量，然后让btn固定打印的是该对象的uname
        //console.log(that.uname)
	}
}
```

3.类构造函数和构造函数最主要的区别是，类构造函数必须使用new，不然会报错，而构造函数不用new会被当作普通函数去使用



#### static

类（class）通过 **static** 关键字定义静态方法。**不能在类的实例上调用静态方法**，而应该通过类本身调用。这些通常是实用程序方法，例如创建或克隆对象的功能。（也可以解释为实例上加，要想用必先new , 对象上加，可以 直接用）

```js
class Father {  
	static sing() {
        //...
	}
}
```

 	

## 3.构造函数和原型

在ES6（ECMAScript6.0）之前，JavaScript没有类的概念，在ES6之前，对象不是基于类创建的，而是用一种称为构造函数的特殊函数来定义对象和他们的特征的。

创建对象：(JavaScript基础也有做过笔记)

1.对象字面量       `var obj = {}`

2.new Object()    `var obj = new Object()`

3.**`Object.create()`**方法创建一个新对象，使用现有的对象来提供新创建的对象的`__proto__`

#### 自定义构造函数 

```js
function 构造函数名(){
	this.属性=值;
	this.方法=function (){}
}
```

1.使用构造函数，构造函数名字首字母最好大写
如 function Star()
2.构造函数不需要return
3.使用函数
new 构造函数名();即构造一个对象，如new Array()，创建一个数组对象
4.属性方法前必须加this
如this.name=传参name        `this.song = function（传参）{}`

但毕竟终究是函数，如果在全局下直接调用该构造函数（并非使用new 创建），则会将this的属性添加到window对象上

当然也可以使用call调用，将属性添加到已将创建好的对象上



构造函数中属性和方法我们称之为成员，成员可以添加

**实例成员**：实例成员就是构造函数内部通过  **this**  添加的成员 ，实例成员只能通过实例化的对象来访问，不可以通过构造函数访问实例成员，如

```js
function Star(uname){
	this.uname = uname;
}
let star = new Star('xxx');
console.log(star.uname);
```

**静态成员**：在构造函数本身上添加的成员，静态成员只能通过构造函数来访问，不能通过对象来访问，如

```js
function Star() {};
Star.sex = 'male';
console.log(Star.sex);
```

构造函数虽然好用，但是存在浪费内存的问题

![](/JavaScript面向对象/gouzao.jpg)



#### 构造函数原型对象prototype

构造函数通过原型分配的函数是所有对象所共享的

JavaScript规定，每个构造函数都有一个prototype属性，指向另一个对象，注意这个prototype（原型）就是一个对象，这个对象的所有属性和方法，都会被构造函数所拥有

因此，我们把那些不变的方法，直接定义在prototype对象上，这样所有对象的实例就可以共享这个方法

使用方法：

```js
function Star(uname){
	this.uname = uname;
}
//第一种写法： Star.prototype.sing = function() {}
//           Star.prototype.sex = 'male'; 
//第二种写法：（但这种方法不能适用于Array、Object等，会覆盖原来的定型的方法）
Star.prototype = {
    constructor: Star,    //不可省略，因为这种写法覆盖掉原来的constructor方法
    sing: function() {},
    movie: function() {}
}
```

所以一般情况，我们的公共属性定义到构造函数里面，公共的方法我们放到原型对象的身上

**注意**：虽然随时能给圆形添加属性和方法，并能立即反应在所有对象实例上，但这和重写整个原型是两回事，如果原型的修改是在创建实例之前，则实例引用的仍是最初的原型

```js
let friend1 = new Person();
Person.prototype = {
	constructor:Person,
	saySomething(){
		console.log("yes!");
	}
}
let friend2 = new Person();
friend1.saySomething()  //错误
friend2.saySomething()  //通过
```



#### 对象中的prototype

使用for in 遍历对象时原理和查找 `[[prototype]]` 链类似，任何可以通过原型链访问到的属性（`enumberable`）都会被枚举，而使用 `in` 操作符来检查属性在对象中是否存在时，同样会查找对象的整条原型链

```js
const obj = {
  a: 2,
};
const myobj = Object.create(obj);
for (k in myobj) {
  console.log(k);
}
```



**属性屏蔽**

对于以上代码，如果添加

```js
myobj.foo = "bar"
```

会出现以下几种情况

1. foo不存在于`myobj`和 `[[prototype]]`上，直接把foo添加到`myobj`身上。
2. foo仅存在于原型链 `[[prototype]]` 上
   - 如果是只读的，进行了赋值则啥也不干（严格模式下会报错）
   - 如果存在一个setter，则执行setter
   - 其余情况则在`myobj`本身添加一个foo，这个foo为**屏蔽属性**
3. foo既存在于 `myobj`上，也存在 foo上，发生屏蔽，`myobj`中包含的foo属性会屏蔽上层原型链的所有foo属性



**相互委托**

你无法在两个或两个以上互相（双向）委托的对象之间创建循环委托，这种方法是被禁止的。尽管相互委托理论上可以正常工作，并且在某些情况下非常有用，但是之所以要禁止相互委托，是为了更加高效，也不用检查是否为无限循环引用。



#### 对象原型: `__proto__`

对象都会有一个属性 `__proto__` 指向构造函数的prototype原型对象，之所以我们对象可以使用构造函数prototype原型对象的属性和方法，就是因为 `__proto__` 的存在

`实例化的对象.__proto__ === 构造函数名.prototype` 返回true

在社区里其实也因为双下划线，被称为 “笨蛋proto”



#### constructor构造函数

对象原型（`__proto__`）和构造函数原型对象（`prototype`）里面都有一个`constructor`属性，constructor我们称为构造函数，因为它**指回构造函数本身**

> 注意，实际上 `实例化对象.constructor`是被委托给了 `prototype`，是原型链访问到的属性，而实例化对象本身没有这个属性

主要目的：用于记录该对象引用于哪个构造函数（很多情况下我们需要用它来指回原来的构造函数）

但是《你不知道的JavaScript》告诫： `constructor` 是一个不可靠并且不安全的引用，它不一定会指向默认的函数引用，通常来说尽量避免这些引用



#### 原型链

任何构造函数原型对象`prototype`，它作为一个对象，也有它自己的对象原型 `__proto__` ，而此时原型对象的 `__proto__` 指向的是`Object.prototype`， 即`某构造函数名.prototype.__proto__ === Object.prototype`

而我们Object也有prototype原型对象，而它作为一个对象，也有它自己的对象原型 `__proto__` ，而此时指向null（到达了终点）

即`Object.prototype.__proto__ === null`



**JavaScript成员查找机制**：

所以在成员查找时，先查找最底层，没有则根据它 的`__proto__`查找至他的原型对象，看看有没有该成员，没有的话继续一层一层往上查找，如果找不到该成员 ，最后返回undefined (undefined是由null派生而来的)

而根据查找规则，使用就近原则来处理重复成员定义问题（即先找到，先使用）

![](/JavaScript面向对象/yuanxinglian.jpg)

**（这里未标出实例对象 constructor 指向 构造函数）**

同时要注意的是：

```js
console.log(Object.__proto__);                      //Function.prototype
console.log(Object.__proto__.__proto__);            //Object.prototype
console.log(Object.__proto__.__proto__.__proto__);  //null
```



#### 拓展内置对象

可以通过原型对象，对原来的内置对象进行拓展自定义的方法，比如给数组增加自定义求偶数和的功能

```js
//在Array原型对象上追加函数，不能采取Array.prototype = {}形式
Array.prototype.sum = function() {
	let sum = 0;
	for(let i = 0; i < this.length; i++){
		sum+=this[i];
	}
	return sum;
}
```



## 4.继承

在ES6之前没有给我们提供extends，我们可以通过构造函数+原型对象模拟实现继承，被称为组合继承

#### call()

`fun.call(thisArg, arg1, arg2....)` （arg n那些指的是传递的其他参数）

功能：调用这个函数，并且修改函数运行时this的指向

thisArg: 当前调用函数的this的指向对象（一般在JavaScript中直接调用函数时，函数的this指向window）

#### ES5继承的两大步

**借用构造函数继承父类型的属性**

核心原理：通过`call()` 把父类型的this指向子类型的this，这样就实现了子类型继承父类型的属性

**利用原型对象继承父类型的方法**

实现如下：

```js
function Father(uname, age) {
    this.uname = uname;
    this.age = age;
}
Father.prototype.teach = function () {
    console('father')
}
//借用父构造函数继承属性
function Son(uname, age) {
    Father.call(this, uname, age);
}
// 这样直接赋值会出问题，因为是赋值父原型对象的地址，如果修改了子原型对象，父原型对象也会随之改变
// Son.prototype = Father.prototype;  ×
// 正确方法：
// 借用父构造函数继承方法
Son.prototype = new Father();
// 如果利用了对象形式修改了原型对象，别忘了利用constructor指回原来的构造函数
Son.prototype.constructor = Son;
Son.prototype.exam = function () {
    console('son')
}
let son = new Son('xxx', 18);
console.log(son);
```

**组合继承**=原型继承+构造函数继承（结合两者的优点）

组合继承方式的缺点是：

1. 原型中包含的引用值会在所有实例中共享，而使用 `Son.prototype = new Father();`的方式继承时，`Son.prototype` 是`Father`类的一个实例，`Father`的所有属性都会被继承下来，而这些属性都会被当成共享属性
2. 组合继承会构造函数实例化了两次



更优解法为**寄生组合继承**：

使用 `Object.create()`方法来实现，以下为寄生组合继承 --- 完美方式 

```js
function Shape() {
  this.x = 0;
  this.y = 0;
}
Shape.prototype.move = function(x, y) {
	//...
};

// Rectangle - 子类(subclass)
function Rectangle() {
  Shape.call(this); // call super constructor.
}

// 子类续承父类
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;
```

但实际上使用 `Object.create()` 要抛弃掉默认的 `Rectangle.prototype` ，而ES6开始之后，可以通过 

```js
Object.setPrototypeOf(Rectangle.prototype, Shape.prototype)
```

直接修改原来的原型对象（《你不知道的JavaScript》推荐）

又又又但是MDN对于  `Object.setPrototypeOf`  有个警告

**警告:** 由于现代 JavaScript 引擎优化属性访问所带来的特性的关系，更改对象的 `[[Prototype]]`在***各个***浏览器和 JavaScript 引擎上都是一个很慢的操作。其在更改继承的性能上的影响是微妙而又广泛的，这不仅仅限于 `obj.__proto__ = ...` 语句上的时间花费，而且可能会延伸到***任何***代码，那些可以访问***任何***`[[Prototype]]`已被更改的对象的代码。如果你关心性能，你应该避免设置一个对象的 `[[Prototype]]`。相反，你应该使用 [`Object.create()`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/create)来创建带有你想要的`[[Prototype]]`的新对象。

**所以**还是老老实实用 `Object.create()`



#### 对象关联来实现继承

以上为面型对象的设计模式（强调实体和实体间的关系）

以下为《你不知道的JavaScript》中谈及的对象关联的继承实现方式，书中说到该思维模式更加简洁，因为这种代码只关注一件事：对象之间的关联关系。并且看上去这种对象形式让构造和初始化分开了，但是许多情况下这两步分来的话更加灵活

而对比面向对象模式，有时却不得不使用显式伪多态的方法调用，比如这种代码，`Shape.prototype.move.call(xxx)`（除非用上es6新增的 `class`，使用super来调用 ），并且还要夹杂着new之类的

```js
const Shape = {
    init(x, y){
        this.x = x;
        this.y = y;
    },
    move(x, y){
        //...
    }
}
const Rectangle = Object.create(Shape);
Rectangle.ohterFunction = function(){
    //..
}
// 对象关联的“实例”
const r1 = Object.create(Rectangle);
r1.init(1, 2)
```



#### 类的本质（class陷阱）

class本质还是function（用 typeof 查看），它只是委托 [[prototype]]机制的一种语法糖

但是新的class写法只是让对象原型的写法更加清晰，更像面向对象编程的语法

和构造函数相同点：

1.类也有原型对象prototype，而prototype里的constructor也是指回类的本身

2.类也可以利用原型对象添加方法

3.类创建的实例对象中的 `__proto__`	原型指向类的原型对象

class陷阱：

也就是说，class并不会像传统的面向类语言一般，在声明时静态复制所有行为，如果你有意无意修改了某个父类的方法，它的子类和所有实例都会受到影响
