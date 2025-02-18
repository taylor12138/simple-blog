---
author: Hello
categories: 前端
title: TypeScript
description: 'TypeScript相关'
---

## 1.结识TypeScript

传统上，JS旨在用于简短，快速运行的代码片段，作为浏览器脚本语言，主要用途是与用户互动，以及操作DOM，所以JS比较适合单线程。

但是由此导致后期维护性比较差

- 面向对象撰写麻烦
- 没有类型规范

微软于2014年推出的TypeScript以JavaScript为基础构建的语言，JavaScript的超集（拓展）引入了类型的概念，它可以在任何支持JS的平台中运行，但是不能被JS解析器**直接执行**，所以需要我们进行编译 TS -> JS

对比：

1.引入类型，可以理解为TypeScript为JavaScript的静态语言模式，

2.增加了ES不具备的新特性，比如抽象类、工具等

3.丰富的配置选项，可以通过配置转化为兼容性强的es5、es3语法

TS官网文档doc https://www.typescriptlang.org/



#### 环境搭配

1.下载 and 安装Node.js

2.使用npm安装全局TypeScript

```shell
npm i -g typescript
```

3.创建一个ts文件

4.使用tsc对ts文件进行编译

- 进入ts文件目录
- 执行`tsc xxx.ts`  (此时就会转换成js文件，感觉有点less转css内味了)

5.在项目中，可以使用webpack / ts-node自动编译转换

ts-node有点像node，方便我们直接测试代码

```shell
npm i ts-node -g
npm i tslib @types/node -g
```

此时直接`ts-node ts文件名` 即可运行ts文件



或者在webpack项目中使用[ts](https://webpack.docschina.org/guides/typescript/#root)



## 2.TypeScript基础

#### 类型选择

|  类型   |       例子        |              描述              |
| :-----: | :---------------: | :----------------------------: |
| number  |     1, 2, -22     |           任意数字，           |
| string  |   "here we go"    |           任意字符串           |
| boolean |    true、false    |       布尔值true或false        |
| 字面量  |      其本身       |  限制变量的值就是该字面量的值  |
|   any   |         *         |            任意类型            |
| unknown |         *         |         类型安全的any          |
|  void   | 空值（undefined） |     没有值（或undefined）      |
|  never  |      没有值       |          不能是任何值          |
| object  |  {name:'Allen'}   |          任意的JS对象          |
|  array  |      [1,2,3]      |           任意JS数组           |
|  tuple  |       [4,5]       | 元素，TS新增类型，固定长度数组 |
|  enum   |    enum{A, B}     |       枚举，TS中新增类型       |

**字面量**：相当于定死一个固定的常量，`let a: 10`，此时a只能赋值为10。 在计算机科学中，字面量（literal）是用于表达源代码中一个固定值的表示法（notation）。

**any**：类似于让TS回归JS原生，可以赋值给任意变量，应用在一些类型断言上（as any），函数的参数未声明类型也是any

**unknown**：表示未知类型的值，有点类似any，只能赋值给any和unknown类型（不让你乱传人）。尽量用unknown，不要用any

```ts
let a: any;
a = true;                   //a可以表任意类型
let b: unknown;
b = "hello"                 //b可以表任意类型
let s: string;
s = a  //通过
s = b  //报错
if(typeof b === "string"){
    s = b        //通过
}
```



#### **类型声明**

```tsx
let a: number;          //声明一个变量a，同时指定它的类型为number
let b: number | string  //声明一个变量b，同时指定它的类型为number或者string
```

由此，在以后的使用过程中，a只能为number类型

```tsx
// a = 'hello';   //报错，不能将类型string分配给类型number
a = 1;
```

不过还是TS -> JS 编译成功，因为是为了让JS开发人员慢慢熟悉

最常用的类型声明方式还是：  （记住number是小写）

```ts
let a: number = 2;
//如果变量的声明和赋值是同时进行，TS可以自动对变量进行类型检测，最后可以简化为
//因为typescript会帮我们推导出来
let a = 2;
```



**函数**

虽然在变量声明看不出有多大用处，但是应用于函数上，大有文章

JS中的函数不考虑参数的类型和个数，很容易出现错误

```js
function sum(a, b) {
  return a + b;
}
console.log(sum(123, "456")); //123456，不是我们想要的结果
```

```ts
// ts语法
function Sum(a: number, b: number): number{  //设置返回值类型为number，也可以由TS自动推导
  return a + b;
}
console.log(Sum(123, "456"));  //报错
// 传入多个不定数量的参数
function other(...data: number[]){
    console.log(...data);
}
other(1, 2, 3, 5);
```

当函数作为参数传入时，函数的类型注解也要写上

```typescript
function bar(fn: () => void) {
  fn();
}
```

> 当函数返回值是void时，实际上返回啥类型都可以，TS编译都通过

有时TS类型推断并不能确定当前函数的this是否有指定的属性，此时我们给和TS说明我们给的this指定类型

```typescript
type ThisType = { name: string };
function eating(this: ThisType) {
  console.log(this.name);
}
const info = {
  name: "allen",
  eating
}
info.eating();
```



**void**：空值，常用于表示表示函数**没有返回值** | 返回undefined | 返回 null `function fn(): void{}`，如果不设置返回值也是void

**never**：空值，常用于表示表示函数**没有返回结果** `function fn(): never{}`，可用于死循环或者函数抛出异常，实际应用在检测代码对函数的错误修改，而对never类型的变量赋值

官方文档：

```typescript
function fn(x: string | number) {
  if (typeof x === "string") {
    // do something
  } else if (typeof x === "number") {
    // do something else
  } else {
    x; // has type 'never'!
  }
}
```

**object**：

```tsx
//声明一个变量d，同时指定它是一个对象，且一定有一个string类型的name属性，可以有其他新的可选属性
let d: {
    name:string, 
    [propName: string]: any
};
//或者直接使用typescript的类型推断，和第一个一样
let e = {
    name: "allen",
    age: 18
}
```

**array**：

```ts
let e: string[];           //声明一个字符串数组（存储字符串）
let arr: number[];   
let arr2 = Array<number>   //声明数值数组，两种都可以，推荐上一种，因为Array<number>这种写法jsx会有冲突
```

**tuple**：元组，也就是固定长度的数组，效率相对数组好一点 。**可以并行多种类型**

```typescript
//两个元素的数组，分别是string、number类型
let h: [string, number] = ['allen', 18];
```

**enum**：枚举的使用

```ts
// 平时我们存储男、女这些字符串，数据库占用空间大，像这种在几个值之间选择的情况，可以用枚举替代字符串
// 当然，我们可以不写值，此时Male、Female默认0、1
enum Gender {
  Male = 1,
  Female = 0
}
let i: { name: string, gender: Gender } = {
  name: 'Allen',
  gender: Gender.Male
}
console.log(i.gender === Gender.Male); //true
console.log(Gender['Male']);           //1
console.log(Gender[1]);                //Male
```

**定时器**： 类型为`NodeJS.Timeout`

##### **自定义类型**

也可以称之为类型别名

```ts
type myType = 1 | 2 | 3 | string;
let a: myType;
a = 4 //报错
```



#### 类型断言

用来告诉解析器变量实际类型，编译器不知道（所以报错），我们自己是知道的，让它放心使用

在 tsx 语法（React 的 jsx 语法的 ts 版）中必须使用前者，即 `值 as 类型`。

```ts
s = b as string  //通过 
s = <string>b    //通过
```

应用：

```js
// <img id="img" />
const el = document.querySelector('#img') as HTMLImageElement;
el.src = 'url地址'
```

```js
class Person {

}
class Student extends Person {
  study() {
    console.log("studying!");
  }
}
const foo = (p: Person) => {
  (p as Student).study()
}
const s = new Student();
foo(s);
```



**const断言**

当我们使用关键字 `const` 声明一个字面量时，类型是等号右边的文字，例如：

```ts
const x = 'x'; // x has the type 'x'
```

`const` 关键字确保不会发生对变量进行重新分配，并且只保证该字面量的严格类型。

但是如果我们用 `let` 而不是 `const`， 那么该变量会被重新分配，并且类型会被扩展为字符串类型，如下所示：

```ts
let x = 'x'; // x has the type string;
```

但是let实质上也可以使用字面量类型，而字面量类型的意义在在于结合联合类型（有点像枚举类型）

```typescript
let x: 'left' | 'right' | 'center' = 'left';
x = 'inner';  //×错误
```



`const`断言告诉编译器为表达式推断出它能推断出的**最窄或最特定**的类型。

比如

```typescript
const option = {
  url: 'xxx',
  methods: "POST"
} as const
```

会被推断为（每个属性都被转变为字面量类型）

```typescript
const option: {
    readonly url: "xxx";
    readonly methods: "POST";
}
```

如果不使用它，编译器将使用其默认类型推断行为（比如直接进行赋值 `let x = "hello"`，x自动推断为string类型），这可能会导致更广泛或**更一般**的类型。

```typescript
const option = {
  url: 'xxx',
  methods: "POST"
}
```

也就是会被推断为

```typescript
const option: {
    url: string;
    methods: string;
}
```



网络上还有一个比较形象具体的例子：

```ts
const args = [8, 5];
// const args: number[]
const angle = Math.atan2(...args); // error! Expected 2 arguments, but got 0 or more.
console.log(angle);
```

![](/TypeScript/as_const.jpg)

也可以解释为，当前类型为`number[]`，数组数量可以被修改，所以时显示 ”0或更多“

通过const断言进行改动后

```ts
const args = [8, 5] as const;
// const args: readonly [8, 5]
const angle = Math.atan2(...args); // okay
console.log(angle);
```

现在编译器推断`args`属于`readonly [8, 5]`类型。。。一个`readonly`元组，其值正好是按此顺序排列的数字`8`和`5`。具体来说，`args.length`被编译器精确地称为`2`。（看不懂 `readonly`可以拆解为 read only，只读的，它仅允许对数组、元组使用 ）

也可以解释为，当前类型为`[8, 5]`，数组数量固定死了，为2，参数数量可以接收 + 通过



#### 标符小语法

- **可选属性**

  - 可选属性后面加一个 `?`（实质上可选就是 `xx类型 | undefined` 的联合类型）

  - ```typescript
    //声明一个变量c，同时指定它是一个对象，且一定有一个string类型的name属性，可选属性age类型为number，不能有其他新的属性
    //可选属性一般要放在后面
    let c: {
        name: string, 
        age?: number
    };
    function foo(x: number, y?: number){}
    ```
    
    

- **非空类型断言**
  - 当前属性一定有值，则加一个 `!`，此时在函数里定义时不用做`null / undefined` 判断 （ 比如message一定有值，则设置`message!.length` ），可以称之为非空类型断言
  - 此时跳过ts在编译阶段对它的检测



- **可选链**
  - 当对象属性不存在时，会短路，直接返回`undefined`
  - 使用： `a.b?.c`，如果`b`属性不为`undefined`，继续查找 `c`



- `!!`，转布尔值，类似于`Boolean()`直接转



- `??`，ES11新增的特性

  - 它是空值合并操作符，当操作符的左侧为null 或者 undefined的时候，返回其右侧操作数，否则返回左侧操作数

  - ```typescript
    const message: string|null = null
    const content = message ?? "hello world"
    // 同  content = message ? message : "hello world"
    // 同  content = message || "hello world"
    ```




#### TS函数重载

函数的重载一般指函数名称相同，通过不同的参数调用不同的函数的形式

```typescript
/*
 *函数声明和函数实现分开
 */
function add(num1: number, num2: number): number; //没有函数体
function add(num1: string, num2: string): string;

// 没有函数体则会执行以下函数体的实现
// 此时要匹配到上方的重载函数才会执行，也就是说使用函数重载后，这个实现函数不能直接被调用的
function add(num1: any, num2: any): any {
  return num1 + num2
}
const res = add(1, 2);
const res2 = add('1', '2');
```



#### 编译选项

每一次对TS文件进行改动，我们都不得不使用 `tsc xxx.ts`进行重新编译

```shell
tsc xxx.ts -w
```

-w加上后，会自动监视TS文件变化。但是一个文件就得开一个窗口进行监视

如果当前项目有TS的配置文件（tsconfig.json），可以在当前目录下直接执行命令（没有配置文件直接执行命令 `tsc --init`即可 ） 

```shell
tsc    #编译所有ts文件
tsc -w #编译所有TS文件 + 监视所有TS文件的变化
```



`tsconfig.json`是ts编译器的配置文件

```json
{
    "include": [       //配置些TS文件需要被编译，这里是根目录/src/任意目录/任意文件
        "./src/**/*"
    ],
    "exclude": ["ndoe_modules"],     //不包含哪些文件
    "files": [],       //和include很像，只不过include列出路径，files直接一一列出文件
    "compilerOptions":{ //编译器配置选项
        "target": "es5",           //target用来指定ts被编译为ES版本，默认ES3 
        "module": "commonjs",      //module指定模块化的规范
        "lib": [],                                  
        //lib用来指定项目中要使用的库，使用场景一般在非浏览器环境下运行，比如在nodejs下我要使用dom，"lib": ["dom"]
        "outDir": "./",            //outDir指定编译后文件所在的目录 "outDir": "./dist", 存于个目录下dist文件夹
        "outFile":"./dist/app.js", //outFile 将代码合并为一个文件，但其实项目开发更多让打包工具去做这个事
        "allowJs": false,          //是否对js文件进行编译，默认false
        "checkJs": false,          //检查js文件符合语法规范，一般和allowJs配套使用
        "removeComments": false,   //是否移除备注
        "noEmitOnError": false,    //当有错误时不生成编译后的文件
        "strict":false,            //所有严格检查总开关
        "alwaysStrict": true,      //设置编译后JS文件是否使用严格模式，默认false
        "noImplicitAny": false,    //不允许隐式any类型
        "noImplicitThis": false,   //不允许不明确类型this
        "strictNullChecks": false, //严格检查空值（或者可能成为空值的变量）
        "moduleResolution": "node",//按照node的方式去解析模块
        "skipLibCheck": true,      //跳过一些库的类型检测（axios->类型 / lodash -> types/lodash / 其他第三方库）
                                   //避免掉无意义的检测和性能的浪费，亦或者不同库定义同名类型导致的错误
        "paths": {
            "@/*": ["src/*"]       //路径解析
        },
        "lib": ["esnext", "dom", "dom.iterable", "scripthost"], //可以指定在项目中可以使用哪里库的类型
    }
}
```

备注：

路径 

- **：任意目录 
- *：任意文件

exclude

有默认值，["node_modules", "bower_components", "jspm_packages"]，如果只想排除以上默认值，其实我们可以不用写这个配置



#### 使用webpack打包TS代码

初始化生成pack.json文件 `npm init --yes`

安装相关loader，webpack等 `npm i -D webpack webpack-cli typescript ts-loader`

新建webpack.config.js文件，并且进行配置

```js
const path = require('path')
module.exports = {
  entry: "./src/index.ts",
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    // 指定加载规则
    rules: [
      {
        test: /\.ts$/,// test指定规则生效的文件,以ts结尾的文件
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  }
}
```

新建 + 配置 TS编译的配置文件（tsconfig.json）

亦或者是通过命令 `tsc --init` 直接生成默认ts配置文件

```json
{
  "compilerOptions": {
    "module": "ES2015",
    "target": "ES2015",
    "strict": true
  }
}
```

这时在命令窗口直接输入 `webpack`，即可成功打包



TS文件模块的许可配置（webpack.config.js）

```js
// 用来设置模块，只要js、ts结尾都可以作为模块来使用
module.exports = {
  //...
  // 用来设置模块，只要js、ts结尾都可以作为模块来使用
  resolve:{
    extensions:['.ts', '.js']
  }
}
```



## 3.TypeScript对面向对象的延伸

#### 属性封装

**属性修饰符**

 如果属性是在对象中设置，则属性可以随意被修改，导致数据不安全

```ts
 class Person {
    name: string;
    age: number;
    constructor(name: string, age: number) {
      this.name = name;
      this.age = age;
    }
  }
  const SpiderMan = new Person("SpiderMan", 18);
  SpiderMan.age = -30;  //被随意修改
```

TS可以在属性前添加修饰符

- public，可以在任意位置访问 / 修改，默认值
- private，私有属性，私有属性只能在类内部进行访问 / 修改，子类也不能访问 / 修改
  - 通过在类中添加方法使得私有属性可以被外部访问
  - （但是却可以通过 `(实例as any).私有属性`进行访问。。不过有另外一种设置私有的方式，就是 `#变量`，并且还要在`tsconfig.json`对 `lib` 、`target` 进行配置）
- protected，受保护属性，仅能在当前类 or 当前类的子类中访问 / 修改

```ts
class Person {
    private _name: string;
    private _age: number;
    constructor(name: string, age: number) {
        this._name = name;
        this._age = age;
    }
    // 现在数据的读写访问权在我们编码人员上了
    getAge() {
        return this._age;
    }
    setAge(age: number) {
        if (age > 0)
            this._age = age;
    }
    // getter和setter被称为属性存取器
}
const Bruce = new Person("Bruce", 18);
//console.log(Bruce._age);  //报错
console.log(Bruce.getAge())
```



**读写语法糖**

但是TS内帮我们提供了读写属性的方法（语法糖）

实际上是应用了`Object.defineProperty()`的`get`和`set` （在使用get函数后，get后面的变量将自动保存为该实例的变量，比如 `get Name()`，然后类似于在类里添加了 `this.Name`,）

TS设置getter、setter的方式以下所示

```ts
class Person {
    private _name: string;
    private _age: number;
    constructor(name: string, age: number) {
        this._name = name;
        this._age = age;
    }
    get name() {
        console.log("我被执行了");
        return this._name
        //此时在类外面，通过实例对象.name依然可以获取，即使获取格式看似像是和以前相同
        // 但是获取方式已经和以往完全不一样了，是通过函数获取的
    }
    get age() {
        return this._age
    }
    set age(age: number) {
        if (age > 0)
            this._age = age;
    }
}
const Bruce = new Person("Bruce", 18);
//可以，此时.name并不是找属性，而是找是否有get name方法
console.log(Bruce.name);   //我被执行了
//数值大于0，可以执行
Bruce.age = 20;
```



**关于类定义属性简便写法**（语法糖）

旧的：

```ts
class Person {
    private _name: string;
    private _age: number;
    constructor(name: string, age: number) {
        this._name = name;
        this._age = age;
    }
}
```

新的：

```ts
class Person {
    constructor(private _name: string, private _age: number) {}
}
```



**只读属性**

只读属性只需在前缀增加 `readonly`即可，此时无法直接通过 `实例.属性` 进行修改的形式进行修改，但是机制有点像const，却可以更改引用地址中嵌套的属性



以下阐述的抽象类、接口均为TypeScript新增的

#### 抽象类

有时候，我们创建一个类，主要是为了作为多个类的父类，让子类通过继承得到共有的属性和方法，比如创建一个Animal类，然后让Cat、Dog类继承Animal类

- 以abstract开头的为抽象类，抽象类其实和其他类差别不大，只是不能用来创建对象，也就是专门用于继承的类
- 抽象类中可以添加抽象方法
  - 抽象方法，使用abstract开头，没有方法体
  - 抽象方法只能定义在抽象类中，子类必须对抽象方法进行重写

```ts
 abstract class Animal {
    name: string;
    constructor(name: string) {
      this.name = name;
    }
    abstract say(): void;
  }

  class Dog extends Animal {
    say() {
      console.log("gogogo");
    }
  }
```



#### 接口

在typescript基础中，我们学习到了自定义类型的写法；

而接口就是用来定义一个类的结构即类中应该包含哪些属性和方法（我个人理解为，实际上接口也可能看成一种自定义类型，该类型一定要包含接口的规范）

实际上又不一定仅限于定义类的结构，也可以作为一种类型去使用，比如用 `:myInterface`规范类型， 所以才导致出现`type` 和 `interface`都可以使用的场景，所以接口也可以当成类型声明去使用

自定义类型

```ts
type myType = {
	name: string,
	age: number
}
const obj: myType = {
	name:"allen",
	age:18
}
```

接口

```ts
// 该接口规定了我们定义了一个类，该类一定有两个属性，一个是name，一个是age
interface myInterface {
    name: string;
    age:number
}
const obj: myInterface = {
  name: 'allen',
  age: 18
}
```



##### （1）**接口 VS 自定义类型 VS抽象类**

1.接口可以同名进行重复声明：比如之前定义了 `type myType`，后面不能重复定义该类型；而前面个定义了 `interface myInterface`，后面依旧可以再次定义 `interface myInterface`（这两个 `myInterface`会进行合并）

```ts
interface myInterface{
    name: string;
    age:number
  }
interface myInterface{
    gender:string
} //两个会发生合并，这种语法在TS里是合理的
```

2.接口可以在定义类的时候，限制类的结构（这一点有点像在继承抽象类）

- 接口中所有属性都不能有实际的值（但是抽象类可以定义实际的值）
- 接口中的方法都是抽象方法（但是抽象类可以有非抽象方法）
- 定义类时让类去实现（implement）这个接口

```ts
interface myInterface{
    name: string;
    saySomething(): void;  //抽象方法啊
  }
// 实现接口，实现接口就是使类满足接口要求
  class MyClass implements myInterface{
    name: string;
    constructor(name:string) {
      this.name = name;
    }
    saySomething(): void {
      throw new Error("Method not implemented.");
    }
  }
```

3.接口可以实现多个,互相实现,抽象类的子类却只能继承一个抽象类；抽象类只针对类，接口其实也可以应用于函数、属性等

总而言之，接口就相当于一个规范，实现了接口，即满足了规范，就可以在指定场景中进行使用

推荐加点：

- 如果是定义非对象类型，推荐使用type
- 对象类型推荐使用 interface

接口的应用场景（很愿意以接口的方式来实现）：

- 后台接口
- 第三方和开发的SDK，比如Vue
- 前端的库
- 正常的开发任务来说，interface、type都差不多，type更直接更方便



##### （2）属性接口

使用场景：我们如果向约束传入参数是作为一个 `string`类型，可以直接

```ts
function fn(params: string){}
```

但如果我们需要传入一个参数，它是一个对象，但是我们要求这个对象里的某个属性（或者多个属性），必须为 `string`类型，我们可以使用属性接口

```ts
//对传入对象里面的属性进行约束
interface FullName{
	firstName:string;
	lastName:string
}
function printName(name: FullName){}
```



**freshness擦除**

通常情况下，属性接口的实现在TS检测时进行类型推断，如果有多出来的属性，则不能通过

```typescript
interface IPerson {
  name: string
  age: number
}
const p: IPerson = {
  name: 'allen',
  age: 18
  sex: 'male' //报错
}
```

但是如果通过引用地址的方式进行赋值时，TS检测会把多出来的属性进行freshness擦除掉，此时达到了满足条件，则不会报错

```typescript
interface IPerson {
  name: string
  age: number
}
const info = {
  name: 'allen',
  age: 18,
  sex: 'male' 
}
const p: IPerson = info
```

因此以后在通过函数传入参数时，参数指定属性接口，可以用引用的方式，传递相对接口规定的属性的有多余属性的对象

```typescript
function fn(p: IPerson) {
  console.log(p);
}
fn(info);
```



##### （3）函数类型接口

对函数方法进行约束 / 批量约束

```ts
interface myInterface{
    //参数为两个string类型，返回参数为string类型
    (key:string, value:string):string
}
const fn: myInterface = (a: string, b: string) => a + b;
```



##### （4）可索引接口

也可以看成针对数组、对象索引的接口

```ts
//针对数组索引
interface myArr{
	[index:number]:string
}
let arr:myArr = ['allen', 'bruce']
```

```ts
//针对对象索引值的约束
interface myObj{
  [index:string]:string
}
let obj:myObj = {name:'allen'}
```



##### （5）类类型接口

```ts
//类类型接口，也就是最上方类对接口的实现，和抽象类类似
interface myClass{
  name: string;
  action(params:String):void
}
interface myClass2{
	//...
}
class Me implements myClass, myClass2{
  name = 'Allen';
  action() {}
}
```



##### （6）接口继承

使用extends，接口可以实现对其他接口的继承，可以对接口进行拓展

> 注意：类的继承只能实现单继承，但是接口可以实现多个接口

```ts
interface Animals{
  eat(): void;
}
interface Person extends Animals{
  work(): void;
}
//这里再套一个baby类进行类的继承
class baby{}
class People extends baby implements Person{
  eat() { }
  work(){}
}
```



#### 泛型

当出现类型不明确的情况，可以使用泛型（之前也提到过使用any不太好）

之前还提及过unknown，而**泛型**针对定义函数或者类时，定义的时候类型不明确，而**在使用的时候再指定类型**的一种特性（也可以理解为类型的参数化）。

泛型比any的好处

- 1.避免跳过了类型检查部分
- 2.在这里也能体现出返回值类型和传入参数类型相同

函数 + 泛型基本使用：

```ts
// 指定了自定义的泛型：T，有点像一个变量的感觉，即类型的变量
function fn<T>(a: T): T {
  return a;
}
console.log(fn(10));               //此时T为number，此时是自动推断
console.log(fn<string>("string")); //此时T为string，此时时指定推断，这种方式应该用的比较多


// 指定多个泛型
function fn2<T, K>(a: T, b: K): T {
  console.log(`I am ${b}!`);
  return a;
}
console.log(fn2(10, "bruce"));

// 在类中使用泛型
class MyClass<T>{
  constructor(public name: T) { };
  fn(params:T) {
    return params;
  }
}
let c = new MyClass<number>(123);
let c2 = new MyClass<string>('str');
```



##### 属性接口（ + 泛型）

```typescript
interface IPerson<T1, T2> {
  name: T1
  age: T2
}
const p: IPerson<string, number> = {
  name:'allen',
  age:12
}
```



##### 限制泛型

假如我只想传入某种指定规格的数据，但是由于泛型没有对传入的参数进行规范校验，就可能可以乱传参数进去而没有被编译器发现

我们可以使用接口对泛型传入的参数加以规范

**泛型 + 接口联动**实现：应用场景：限制泛型的范围

```ts
interface myInterface {
  length: number
}
function fn3<T extends myInterface>(a: T) {
  return a.length;
}
fn3("123"); //可以通过
// fn3(123);   //报错，因为这个参数没有length属性
```



##### **泛类**

把类当作参数的泛型类

```ts
class MysqlDB<T>{
  add(info: T) {
    console.log(info);
  }
}
class User {
  name: string | undefined;
  password: string | undefined;
}
let u = new User();
u.name = "Allen";  
u.password = "123"; 
```

此时我只想让User作为传入add的参数，但是

```ts
let db = new MysqlDB();
db.add(u);
db.add(123)  //也可以,对传入的参数没能进行限制
```

所以我们要对此进行约束

```ts
let db = new MysqlDB<User>();
db.add(u);
db.add(123)  //报错
```



##### promise

在`ts`中使用`pormise`必须声明它的返回值类型，而它的返回值类型通常可以使用泛型的形式来声明

以`Promise<类型>` 的形式

```typescript
function request<T>(config: AxiosRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
        this.instance
            .request(config)
            .then((res) => {
            console.log(res, 'request方法')
            resolve(res)
        })
            .catch((err) => {
            reject(err)
        })
    })
}
```

通过泛型+泛型嵌套，实现真正约束返回值

```ts
interface IUser {
  account: string
  password: string
}
interface ILoginType {
    id: number
    name: string
    token: string
}

interface IDataType<T = any> {
    code: number
    data: T
}

export function accountRequest(user: IUser) {
    return myRequest.request<IDataType<ILoginType>>({
        method: 'POST' ,
        url: loginAPI.accountAPI,
        data: {
            //...
        }
    })
}
```



## 4.TypeScript其他

TS支持两种方法来控制我们的作用域

- 模块化开发：每个文件可以是一个独立的模块，支持ES module，也支持CommonJS
- 命名空间：通过namespace来声明一个命名空间

#### 命名空间

有时在同一模块中接口、类的名称或许会发生冲突（不同类、接口命名一致）此时一个模块里需要有多个命名空间

```ts
import { MySQL } from './database';  //报错，发生冲突

class MySQL{
  //...
}
```

此时我们可以在ts文件最上方通过 `namespace 自定义空间名`  使用命名空间

```ts
namespace A{
 //代码块
}
```

此时属于A命名空间的私有该代码块定义的接口、类等

如果我们要在外部使用该命名空间的东西，需要使用`export`对外部进行暴露

```ts
namespace A{
  interface Animal{
    name: string
    eat(): void;
  }
  export class Dog implements Animal{
    constructor(public name: string) { }
    eat(){}
  }
}
// 只能使用Dog类，因为其他比如Animal接口没有暴露，所以在外面也不能使用
let temp = new A.Dog('边牧');
```

对外部模块（比如其他文件中）导出该命名空间，直接 `export namespace A{}`即可

然后外部模块进行导入时 `import { A } from './untils/format'`



#### TS关于声明的问题

在TS中，必须在编写过程中有声明过的类型，才可以直接使用（不然通不过TS编译），但是也有一些其他的类型：

比如document、`axios`

typescript对类型的管理和查找

- 内置类型声明（TS自带的，比如document）

- 外部定义类型声明（`axios`第三方库已经帮我们做了这个类型声明文件，安装`axios`之后可以看到`node_module`文件夹的 `axios` 中有 `index.d.ts` 文件）

- 自定义类型声明（比如`lodash`库就没有自带的外部定义类型声明，需要自己自定义）

  - 可以去社区有没有人编写好对应的类型声明

  - 通过这个[网址]( https://www.typescriptlang.org/dt/search?search=)得到type，然后根据网址后面的指示进行 npm 安装

  - 完全自己编写，新建一个 `xxx.d.ts` 文件，通过declare关键字进行声明

    ```typescript
    //声明模块
    declare module 'lodash' {
      //..编写需要声明的变量、方法
    }
    //声明变量、函数
    declare let Myname: string // 声明有Myname这个变量
    declare function myFn(): void
    // 声明文件，把.jpg结尾的文件都当成模块，可以通过编译
    declare module '*.jpg'
    ```

除了`.ts`件，还有 `.d.ts` 文件（declare），这个文件是用来做类型声明的文件，他仅仅用来做类型检测，告知typescript我们有哪些类型，而不用报错



#### `InstanceType<Type>`

构造一个由 Type 中构造函数的实例类型组成的类型。

例子

```typescript
// @errors: 2344 2344
// @strict: false
class C {
  x = 0;
  y = 0;
}

type T0 = InstanceType<typeof C>;
//相当于 type T0 = C
type T1 = InstanceType<any>;
//相当于 type T1 = any
type T2 = InstanceType<never>;
//相当于 type T2 = never
type T3 = InstanceType<string>;
//报错
//Type 'string' does not satisfy the constraint 'abstract new (...args: any) => any'.
type T4 = InstanceType<Function>;
//报错
//Type 'Function' does not satisfy the constraint 'abstract new (...args: any) => any'.
//Type 'Function' provides no match for the signature 'new (...args: any): any'.
```

而对于在vue3 + ts组件使用中，对组件定义引用时，则要使用到 `InstanceType<Type>`

譬如

```typescript
const accountForm = ref<InstanceType<typeof ElForm>>()
```

这是因为，vue3组件导出是是作为一个对象（组件的描述，可以说和一个类很像）

而我们此时在另外一个组件中使用这个组件，我们是根据导出的对象来创建一个组件实例

此时我们不可以直接

```typescript
const accountForm = ref<ElForm>() //x 错误
```

因为此时`ElForm`是一个对象，而不是一个类型 or 类 之类的 ，而 `InstanceType<Type>` 可以帮助我们将这个单一的 对象 转化为一个拥有构造函数的实例

也可以理解为 对象类型 -> 被实例化的对象类型



## 5.装饰器

装饰器是一种特殊的类型声明，它能够被附加到类声明、方法、属性或参数上，可以修改类的行为

通俗来讲装饰器就是一个方法，可以注入到类、方法、属性参数上来拓展类、属性、方法、参数的功能。（把这些东西传进去，然后吐出一个更强大的值）

装饰器是过去几年JS最大成就之一，已经是ES7的标准特性之一

常见的装饰器有类装饰器、属性装饰器、方法装饰器、参数装饰器

装饰器的写法：

- 普通装饰器（无法传参）
- 装饰器工厂（可传参）

> 注意  装饰器是一项实验性特性，在未来的版本中可能会发生改变。

若要启用实验性的装饰器特性，你必须在命令行或`tsconfig.json`里启用`experimentalDecorators`编译器选项：

```shell
tsc --target ES5 --experimentalDecorators
```

```js
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true
    }
}
```

不过装饰器也类似于充当中间层，`@withScope`.其实最终export default 的是`withScope(KeepAlive)`



**基本使用**

#### （1）**类装饰器**  

`@装饰器`下一行接类

```ts
//它在不修改类 MyClass的情况下，对类的功能进行了拓展
function logClass(target: any) {
  // params就是当前类
  console.log(target);
  // 现在我们可以通过params来操作类了
  //拓展一个属性
  params.prototype.apiURL = 'xxx';  
  // 拓展一个方法
  params.prototype.fn = () => {
    console.log("I am function!");
  }
}
@logClass
class MyClass {
  constructor(public name: string) { }
}
```

但我们可以看到，通过 `@logClass`的方式进行装饰，无法传入参数（`params`是默认传入，不算）



**类装饰器（装饰器工厂）**：

实际上说的那么玄乎，不过就是运用了柯里化方式进行传参，类似于React的函数传参方式

```ts
function logClass(params: string) {
  return function (target: any) {
    //这里的target就是当前类MyClass，也就是上方普通装饰器的params
    //使用传入参数来拓展属性
    target.prototype.apiURL = params;
  }
}

@logClass('something')
class MyClass {
  constructor(public name: string) { }
}
```



除此之外，装饰器还能**修改当前类的构造函数**
下面是一个重载构造函数的例子：

- 类装饰器表达式会在运行时被调用，类的构造函数作为其唯一的参数
- 如果类装饰器返回一个值，它会使用提供的构造函数来替换类的声明

```ts
function logClass(params: any) {
  return class extends params {
    name = 'I am another name';
    //getData也要记得一起重载
    getData() { console.log(this.name); }
    //或者getData() { super.getData() }
  }
}
@logClass
class MyClass {
  constructor(public name: string) {
    console.log('我在执行constructor');
    console.log(name);
  }
  getData() { console.log(this.name); }
}
let a = new MyClass('Kobe');
a.getData();
//我在执行constructor
//Kobe
//I am another name
```



#### （2）**属性装饰器**

属性装饰器表达式会在运行时当作函数被调用，传入下列两个参数：

- 对于静态成员来说是类的构造函数（constructor），对实例成员来说是类的原型对象（prototype）
- 成员名字

`@装饰器`下一行接属性

```ts
// 属性装饰器 + 装饰器工厂传参
function logProperty(params: any) {
  return (target: any, attr: any) => {
    console.log(target); //MyClass {}
    console.log(attr);   //name
    //修改target（MyClass）类的attr（name）属性
    //中括号的主要优势在于可以通过变量访问属性
    target[attr] = params;
  }
}

class MyClass {
  // 当前有一个name的属性
  @logProperty('something')
  name: string;
  constructor(name: string) { this.name = name }
}
let a = new MyClass('Kobe');
```



#### （3）方法装饰器

它会被应用到方法的属性描述符上，可以用来监视、修改、替换方法定义

方法装饰会在运行时传入下列3个参数

- 对于静态成员来说是类的构造函数，对于实例成员来说是类的原型对象
- 成员名字
- 成员的属性描述符

`@装饰器`下一行接函数

```ts
// 方法装饰器
function logMethod(params: any) {
  return (target: any, methodName: any, desc: any) => {
    console.log(target);      //MyClass{}
    console.log(methodName);  //fn
    console.log(desc);        //关于该函数的描述（特性），比如writable、enumerable、configurable、value
    // 修改方法实现： 把参数转为字符串再传入
    //1.保存之前方法
    let fn = desc.value;
    desc.value = function(...args: any[]){
      //先把参数全部转为字符串
      let newArgs = args.map(item => String(item));
      console.log(newArgs, params);
      //复用之前的方法 + 传入参数，保留之前函数定义的内容
      fn.apply(this,newArgs);
    }
  }
}
class MyClass {
  @logMethod('Something')
  fn(...args: any[]) { } 
}
let a = new MyClass();
a.fn('123', 12345)
```



#### （4）方法参数装饰器

参数装饰器表达式会在运行时被当作函数被调用，可以使用参数装饰器为类的原型增加一些元素数据，传入下列三个参数

- 对于静态成员来说是类的构造函数，对于实例成员来说是类的原型对象
- 传入参数的方法名字
- 参数在函数参数列表中的索引

```ts
// 参数装饰器 + 装饰器工厂传参
function logParams(params: any) {
  return (target: any, methodName: any, paramsIndex: any) => {
    console.log(target);     //MyClass{}
    console.log(methodName); //fn
    console.log(paramsIndex);//0
  }
}

class MyClass {
  fn(@logParams(123) id: number) { }
}
let a = new MyClass();
```



**装饰器执行顺序**：在TypeScript中，装饰器的执行顺序为：首先执行属性装饰器，然后执行方法装饰器，其次是方法参数装饰器，最后是类装饰器。如果同一个类型的装饰器有多个，总是先执行后面的装饰器。



## 6.类型循环引用

使用此方法即可

https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-8.html