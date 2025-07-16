---
author: Hello
categories: 前端
title: React(上)
description: '框架相关知识'
---

## 1.React简介

react由Facebook开发 & 开源的一个用于构建用户界面、将数据渲染为html视图的开源JavaScript库

react相对于原生js的优点：

- 采用组件化模式，声明式编码，提高组件复用率
- React Native中可以使用React 语法进行移动端开发
- 使用了虚拟DOM和diff算法，减少和真实DOM的交互

下载react的文件（当前阐述的是16.8版本）

- babel.js不仅适用于es6 -> es5 语法的转换，还适用于 jsx -> js 的转换
- react.development.js 为react的核心库
- react-dom-development为react的拓展库，可用于操作dom等

引入顺序

```html
<div id="container"></div>
<script src="./js/react.development.js"></script>
<script src="./js/react-dom.development.js"></script>
<script src="./js/babel.min.js"></script>
<!-- 告诉浏览器你写不是默认的js，而是jsx -->
<script type="text/babel">
  // 创建虚拟dom
    const VDOM = <h1>hello react!</h1>
    // 渲染到页面
    ReactDOM.render(VDOM, document.querySelector('#container'))
</script>
```



#### JSX的使用

直接使用原生js也能创建虚拟dom

```js
// document.createElement为创建真实dom，以下是创建虚拟dom
// 不使用jsx创建虚拟dom，React.createElement(标签名, 标签属性, 标签内容)
const VDOM = React.createElement('h1', { id: 'title', className: 'title' }, 'hello, world');
// 渲染到页面
ReactDOM.render(VDOM, document.querySelector('#container'))
```

使用jsx的原因是jsx对于多重嵌套的标签比较容易撰写，而原生js比较难顶

```js
const VDOM = React.createElement('h1', { id: 'title' }, React.createElement('h2', {}, 'hahaha'));
```

然而使用jsx

```js
const VDOM = (
    <h1 id="title">
    <span>hello, react</span>
    </h1>
)
```

综上，还是乖乖使用jsx比较吃香



#### JSX语法

1.定义虚拟DOM时，不要写引号

2.在大括号中可以填入js的表达式，但不代表所有js语句、js代码

- 表达式：一个表达式会产生一个值，可以放在任意一个需要值的地方，简单来说，就是能用变量 `const x = 表达式`接收的，均为表达式
- 不可以填入if、for等js语句（但是我们可以使用数组的map、三元表达式等语法来填补）

3.样式指定类名时不要用class，而是使用className

4.内联表达式时，style要注意键值的形式去写，这里使用双括号并不是类似于vue的八字胡语法，而是一个大括号填入js表达式，一个大括号表示这是一个对象

```js
const inner = 'hello, react'
const VDOM = (
    <h1 className="title">
    	<span style={{ color: 'white', backgroundColor: 'red' }}>{inner}</span>
	</h1>
)
// 渲染到页面
ReactDOM.render(VDOM, document.querySelector('#container'))
```

5.只能有一个根标签，有点类似vue的template模板

6.标签必须闭合，即使遇到像input这种实质上再html中单标签就可以的，也必须进行双标签闭合

```js
const VDOM = (
    <div>
        <input type="text" />
    </div>
)
```

7.标签首字母若是小写，则转换为html同名标签元素，若html无该标签对应的，则报错同名元素；**若大写字母开头**，react则取渲染对应的组件，若没定义该组件，则报错（这里和vue不同，vue也是直接小写，遇到驼峰则用 `-` 连接）

8.jsx写注释的时候，要 `{/*<input type="text" />*/}`这样写



## 2.React的组件化

#### 函数式组件

即用函数定义的组件

它适用于简单的组件定义

```html
<div id="container"></div>
<script src="./js/react.development.js"></script>
<script src="./js/react-dom.development.js"></script>
<script src="./js/babel.min.js"></script>
<!-- 告诉浏览器你写不是默认的js，而是jsx -->
<script type="text/babel">
    function MyComponent() {
      return <h2>函数定义的组件</h2>
    }
    // 记住jsx里标签必须闭合
    ReactDOM.render(<MyComponent />, document.querySelector('#container'));
</script>
```

而此时在函数内部打印this，得到的结果为undefined

```js
function MyComponent() {
	console.log(this)     //undefined
	return <h2>函数定义的组件</h2>
}
```

那是因为babel编译后开启了严格模式，使得指向window都改成指向undefined

此时内部： React解析组件标签 -> 找到组件 -> 调用函数 -> 虚拟DOM转为真实DOM，随后呈现在页面中



#### 类式组件

用类定义的组件

它适用于复杂的组件定义

```jsx
class MyComponent extends React.Component {
    render() {
        return <h2>hello React</h2>
    }
}
//这里的的render和上方类定义的render没有关系，只是同名罢了
ReactDOM.render(<MyComponent />, document.querySelector('#container'))
```

创建类式组件必须
1.继承react定义的内置类
2.必须写render
3.render必须有返回值

而此时在render打印this，得到的结果为MyComponent实例对象（React内部帮你new了一个）

```js
class MyComponent extends React.Component {     
	render() {
        console.log(this)
        return <h2>hello React</h2>
    }
}
```

此时内部： React解析组件标签 -> 找到组件 -> new出实例，调用原型上render方法 -> 将render返回的虚拟DOM转为真实DOM，随后呈现在页面中

看到其他文章中的组件对象，其实基本上可以默认他们是用类式组件定义的。



### （1）组件三大核心属性之state

实际上隶属于类式组件，毕竟有实例对象，才有对应的属性

**state**（状态）

有点像vue的data / vuex的state，存储数据，在组件化的使用过程中，我们时常把数据存储在组件们共同的父组件的state里（官方称之为状态提升）

```jsx
class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHot: true
        }
    }
    render() {
        return <h2>today is {this.state.isHot ? 'hot' : 'cold'}</h2>
    }
}
```

不过一般都是这样写的

```js
class MyComponent extends React.Component {
    state = {
        isHot: true
    }
//...
}
```

**setState**   (状态更新)

然而在React中，修改完状态，不能和Vue一样直接做到响应式，需要我们去使用setState！！从而改动页面上呈现的数据效果       

这里的setState是一个合并的动作，如果其他state属性没有发生改变，并不会发生丢失

setState要求传入一个对象

```js
class MyComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isHot: true
        }
        this.changeWeathter = this.changeWeathter.bind(this);
    }
    render() {
        return <h2 onClick={this.changeWeathter}>today is {this.state.isHot ? 'hot' : 'cold'}</h2>
    }
    changeWeathter() {
        const isHot = !this.state.isHot;
        //实际上也是因为setState这个方法，才能让state称为核心属性之一，泪目。。
        this.setState({
            isHot: isHot
        })
    }
}
ReactDOM.render(<MyComponent />, document.querySelector('#container'))
```

从这里我们可以看出，每次setState，render都会调用一次对页面进行渲染（有点控制页面回流重绘的感觉，所以绝对不能再render里进行setState），总共调用 1 + n次，而construtor只会在初始化的时候调用一次



### （2）组件三大核心属性之props

##### 类式组件props

props用于组件间数据传递

父传子，和vue的props类似，都是在组件标签上赋值传递；父组件传入的props如果是state，发生了setState，重新`render()`一次，传入的props也会随之更新

注意：props属性是只读的，不可以修改

```js
class MyComponent extends React.Component {
    render() {
        return (
            <ul>
            	<li>性名：{this.props.name}</li>
                <li>性别：{this.props.sex}</li>
                <li>年龄：{this.props.age}</li>
			</ul>
		)
	}
}
//age={18}才能传入number类型
ReactDOM.render(<MyComponent name="Allen" age={18} sex="男" />, document.querySelector('#container'));
```

在js语法中，使用 `let person1 = {...person2}`展开对象中的属性

但是通过React内置 + babel语法加成，可以直接 `...person2`进行展开，**但是仅仅适用于标签属性的传递，也就是通过props传递**

虽然你可以在这里看到一个大括号，但是这只是表明要在jsx中插入js表达式的含义

```js
const p = {name="Allen",age="18",sex="男"}
ReactDOM.render(<MyComponent {...p} />, document.querySelector('#container'));
```

接着子组件通过 `this.props.xx`进行使用



##### PropTypes

当需要对传入的props进行数据类型、数据默认值等进行**限制**时，需要引入另一个包

（像 [Flow](https://flow.org/) 和 [TypeScript](https://www.typescriptlang.org/) 等这些静态类型检查器，可以在运行前识别某些类型的问题。他们还可以通过增加自动补全等功能来改善开发者的工作流程。出于这个原因，我们建议在大型代码库中使用 Flow 或 TypeScript 来代替 `PropTypes`。）

（对于Vue，可以直接让子组件在props属性里定义props传入的数据格式即可）

```html
<!-- 引入prop-types包 -->
<script src="./js/prop-types.js"></script>
```

如果是搭建脚手架，React默认没有帮你下载这个限制包，需要自己下载

```shell
npm i prop-types
```

```js
import PropType from 'prop-types'
```



```js
// 对标签属性进行类型、必要性(required)的限制
// 记住上面的时小写props，下面的是大写Props
MyComponent.propTypes = {
    name: PropTypes.string.isRequired,  //限制name顺序性必须传入，且为string
    age: PropTypes.number,              //限制age为number
}
// 默认标签属性值
MyComponent.defaultProps = {
    sex: '男',                          //不传入时，sex默认值为'男'
    age: 18                             //不传入时，age默认值为18
}
ReactDOM.render(<MyComponent name="Allen" age={18} sex="男" />, document.querySelector('#container'));
```

如果传入的是函数

```js
MyComponent.propTypes = {
    speak: PropTypes.func              //限制speak为函数
}
ReactDOM.render(<MyComponent name="Allen" age={18} sex="男" speak={fn}/>, document.querySelector('#container'));
function fn(){}
```

不过在最好还是都写在React类的内部，但是要添加到类上，而不是类的实例的话，不能直接写表达式，要添加一个static

```js
class MyComponent extends React.Component {
      static propTypes = {
        name: PropTypes.string.isRequired,
        age: PropTypes.number,
        speak: PropTypes.func
      }
      // 默认标签属性值
      static defaultProps = {
        sex: '男',
        age: 18
      }
      render() {
        //...
      }
}
```

**propTypes类型一览**

```jsx
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  optionalArray: PropTypes.array,
  optionalBool: PropTypes.bool,
  optionalFunc: PropTypes.func,
  optionalNumber: PropTypes.number,
  optionalObject: PropTypes.object,
  optionalString: PropTypes.string,
  optionalSymbol: PropTypes.symbol,
  // 任何可被渲染的元素（包括数字、字符串、元素或数组）
  // (或 Fragment) 也包含这些类型。
  optionalNode: PropTypes.node,
  // 可以指定一个对象由某一类型的值组成
  optionalObjectOf: PropTypes.objectOf(PropTypes.number),
  // 任意类型的必需数据
  requiredAny: PropTypes.any.isRequired,
}
```



##### 函数式组件的props

上面说道属性都是隶属于类式组件，毕竟有实例对象才有属性，但是props比较特殊，函数组件也可以有，因为函数组件可以传参，即在传参部分使用props进行接收。

（实际上除非使用最新版本的hooks，不然函数式组件不能使用到state 和 refs）

```js
function MyComponent(props) {
      const { name, sex, age } = props;
      return (
        <ul>
          <li>性名：{name}</li>
          <li>性别：{sex}</li>
          <li>年龄：{age}</li>
        </ul>
      )
      MyComponent.propTypes = {
        name: PropTypes.string.isRequired,
        age: PropTypes.number,
        speak: PropTypes.func
      }
      // 默认标签属性值
      MyComponent.defaultProps = {
        sex: '男',
        age: 18
      }
}
ReactDOM.render(<MyComponent name="Allen" />, document.querySelector('#container'));
```



### （3）组件三大核心属性之refs

官网提示：请勿过度使用refs，可以通过事件对象event解决（发生事件元素 = 操作的元素），则用event解决

##### 老版字符串ref

同样的，refs也类似于vue的refs（只不过vue属性都会加上 `$`），适用于父组件操作子组件时对子组件的获取，也用于父组件获取子组件数据

```js
class Demo extends React.Component {
      showData = () => {
        alert(this.refs.input1.value);
      }
      showData2 = () => {
        alert(this.refs.input2.value);
      }
      render() {
        return (
          <div>
            <input ref="input1" type="text" placeholder="点击按钮提示数据" />
            <button onClick={this.showData}>click me</button>
            <input onBlur={this.showData2} ref="input2" type="text" placeholder="失去焦点提示数据" />
          </div>
        )
      }
    }
    ReactDOM.render(<Demo />, document.querySelector('#container'));
```

以上我使用的是字符串类型的ref（同Vue），但它目前已经不被官方所推荐使用了，甚至有可能废弃掉，以下是官网解释（可能带效率问题）。

**过时 API：String 类型的 Refs**

如果你之前使用过 React，你可能了解过之前的 API 中的 string 类型的 ref 属性，例如 `"textInput"`。你可以通过 `this.refs.textInput` 来访问 DOM 节点。我们不建议使用它，因为 string 类型的 refs 存在 [一些问题](https://github.com/facebook/react/pull/8333#issuecomment-271648615)。它已过时并可能会在未来的版本被移除。



##### **回调式refs**

它的回调函数接受 React 组件实例或 HTML DOM 元素作为参数

以 `ref = () => {}`形式进行传递

以下代码是对上方字符串形式ref的改进

```js
class Demo extends React.Component {
      showData = () => {
        alert(this.input1.value);
      }
      showData2 = () => {
        alert(this.input2.value);
      }
      render() {
        return (
          <div>
            <input ref={currentNode => { this.input1 = currentNode }} type="text" placeholder="点击按钮提示数据" />
            <button onClick={this.showData}>click me</button>
            <input onBlur={this.showData2} ref={currentNode => { this.input2 = currentNode }} type="text" placeholder="失去焦点提示数据" />
          </div>
        )
      }
    }
    ReactDOM.render(<Demo />, document.querySelector('#container'));
```

官网还有个提示：关于回调 refs 的说明

如果 `ref` 回调函数是以**内联函数的方式定义**（也就是把函数直接定义在标签内）的，在更新过程（render调用第二、三次的时候，每次setState，render也都会被调用一次）中它会被执行两次，第一次传入参数 `null`，然后第二次会传入参数 DOM 元素。**这是因为在每次渲染时会创建一个新的函数实例，所以 React 清空旧的 ref 并且设置新的**。通过将 ref 的回调函数定义成 class 的绑定函数的方式可以避免上述问题，但是大多数情况下它是**无关紧要**的。

避免方式也就是在类组件里写一个回调函数，而不是以内联的形式（但是我觉得为了定义一个id，写一个函数，太麻烦了吧0.0）



##### **createRef**

目前React最新版本的ref使用方法就是用 `React.createRef`方式

 `React.createRef`调用后会创建一个容器，该容器可以存储被ref所标识的节点（保存在current属性里）

如果你想获取多个节点，就要创建多个`React.createRef()`，因为它是专有的 

```js
 class Demo extends React.Component {
     //但是注意，该容器是专人专用的！如果再次在这个容器存储的话，会覆盖掉原来用ref标识的节点
     //所以一个容器存一个节点
      myRef = React.createRef();
      clickEvent = () => {
        //节点保存在容器里的current中
        alert(this.myRef.current.value)
      }
      render() {
        return (
          <div>
            <input type="text" ref={this.myRef} />
            <button onClick={this.clickEvent}>click me</button>
          </div>
        )
      }
    }
```



**refs的使用**

在Hook中使用`useEffect`时，如果你想得到“最新”的值，你可以使用`ref`



#### other：废物构造器

（我们在开发的时候，能省就省，几乎不写构造器的原因）

在使用类式组件时，使用其构造器，则会默认传入props，并且需要你使用`super(props)`

如果直接不传props，直接 `super()`，React官网已经明示你了，会：

- 在 React 组件挂载之前，会调用它的构造函数。在为 React.Component 子类实现构造函数时，应在其他语句之前前调用 `super(props)`。否则，`this.props` 在构造函数中可能会出现未定义的 bug！！

在React类式组件里，构造器的作用：

- 通过给 `this.state` 赋值对象来初始化内部 state。（可以直接在类中使用表达式替代）
- 为事件处理函数绑定实例                                             （可以直接在类中使用表达式 + 箭头函数替代）

实际上也就是之前我们的繁琐两步走，没什么必要。。。so weak

```js
constructor(props) {
    super(props);
    this.state = {
        isHot: true
    }
    this.changeWeathter = this.changeWeathter.bind(this);
}
```



## 3.React事件监听

#### React事件监听（前传）

原生js `onclick` -> React `onClick`        (vue的是 `v-on:click=""` 或者`@click=""`)

原生js `onblur` -> React `onBlur`             (vue的是 `v-on:blur=""` 或者`@blur=""`)

原生js `onkeyup` -> React `onKeyUp`          (vue的是 `v-on:keyup=""` 或者`@keyup=""`)

普通函数的调用（注意不要加括号！）

```js
class MyComponent extends React.Component {
    render() {
        return <h2 onClick={fn}>hello React</h2>
    }
}
ReactDOM.render(<MyComponent />, document.querySelector('#container'))
function fn(){
    console.log('today is a good day');
}
```

- React除了把大小写换了之外，实质上它内部重新自定义了方法，拥有更好的兼容性
- 除此之外，React的事件，是通过事件委托的方式处理的（委托给组件最外层元素，即将事件都加给了jsx里在外层的div）

和原生js一样，React对事件监听时，会传入事件对象event，可以通过以下形式得到事件对象，避免使用了refs

```js
clickEvent = (e) => {
    alert(e.target.value)
}
render() {
    return (
        <div>
        	<input type="text" onBlur={this.clickEvent} />
		</div>
	)
}
```



#### **react中this指向**

要注意的是：

- 以下代码中render输出this的是MyComponent组件实例
- fn输出的this是undefined
- constructor的this指向的也是MyComponent组件实例

因为在使用类式组件时，是new出组件对象实例，然后都通过该实例调用render方法，所以在render中this指向的是组件对象实例

而constructor构造函数中的this一定是指向当前对象的实例

**而这里的fn方法，是在全局下调用的，没有在render下完成调用，this应该是指向window，但是在类内部自动帮你开启了局部严格模式，所以this指向了undefined**

（我个人在es5笔记中总结的在类中的this指向的是其实例对象，实质上是因为我们调用函数时，是通过实例对象来调用的，比如`p1.render()`，此时this当然指向的是实例对象，而这里的 函数方法类似于发生了 `const x = p1.fn; x();`的操作）

```js
class MyComponent extends React.Component {
    constructor(props){
        super(props);
     }
    render() {
        console.log(this);              //实例对象
        return <h2 onClick={this.fn}>hello React</h2>
    }
    fn(){
        console.log(this);             //undefined
    }
}
ReactDOM.render(<MyComponent />, document.querySelector('#container'))
```



解决方法一：在constructor使用bind（即创造新的函数 `const f = fn.bind(xx)`，拷贝，无调用）

```js
constructor(props){
    super(props);
    this.fn = this.fn.bind(this);
}
```



解决方法二：

**简化方案**

在实际开发中，不会使用到如上比较麻烦的写法，而是**利用类中直接写赋值语句的操作**，往实例自身默认追加一个属性

此时函数成为了实例的自定义方法，且this的指向能毫不动摇指向实例

```js
class MyComponent extends React.Component {
    state = {
        isHot: true
    }
	render() {
    	return <h2 onClick={this.changeWeathter}>today is {this.state.isHot ? 'hot' : 'cold'}</h2>
	}
	//箭头函数this指向函数定义上下文的this
	//要写成 changeWeathter = function(){}的形式才能改为箭头函数，没有changeWeathter()=>{}的写法，所以只能：		changeWeathter = () =>{}
	changeWeathter = () => {
    	const isHot = !this.state.isHot;
        this.setState({
            isHot: isHot
        })
    }
}
```



#### **非受控组件** & **受控组件**

**非受控组件**

外部无法影响到组件内部

说由输入类的DOM，比如 `input`，如果是现用现取，则为非受控组件，比如下方就是一个非受控组件

```js
class Login extends React.Component {
      handle = (e) => {
        e.preventDefault();
        const { userName, password } = this;
        alert(`用户名：${userName.value}, 密码：${password.value}`)
      }
      render() {
        return (
          <div>
            <form action="https://www.baidu.com" onSubmit={this.handle}>
              用户名<input type="text" ref={node => this.userName = node} name="username" />
              密码<input type="password" ref={node => this.password = node} name="password" />
              <button>登录</button>
            </form>
          </div>
        )
      }
    }
```

**受控组件**（建议）

也可以说是利用触发本身事件，不需要使用到ref，然后保存于state

这个案例实际上可以理解为Vue的 `v-model`语法糖，只不过这里需要我们自己写

```js
class Login extends React.Component {
      state = {
        userName: null,
        passWord: null
      }
      changeName = (e) => {
        this.setState({
          userName: e.target.value
        })
      }
      changePsw = (e) => {
        this.setState({
          passWord: e.target.value
        })
      }
      handle = (e) => {
        e.preventDefault();
        const { userName, passWord } = this.state;
        alert(`用户名：${userName}, 密码：${passWord}`)
      }
      render() {
        return (
          <div>
            <form action="https://www.baidu.com" onSubmit={this.handle}>
              {/* onChange事件和DOM的onchange不一样，这里只要表单的value发生改变，就会回调事件*/}
              用户名<input type="text" onChange={this.changeName} name="username" />
              密码<input type="password" onChange={this.changePsw} name="password" />
              <button>登录</button>
            </form>
          </div>
        )
      }
    }
```



#### React函数传参

在Vue中，如果该方法不需要传递参数，则方法后面的`()`可以不用添加，

如果需要传入参数，则使用 `函数名(参数)`的形式

但是在React中，如果使用 `函数名()`的形式，比如在标签里 `<h2 onClick={this.fn()}>hello React</h2>`，则在触发事件时，并不会回调函数，而是在网页渲染的时候调用一次，此时传入的回调函数是fn里的返回值，若没写入返回值，则传入的是undefined

所以我们需要用一个巧妙的方法，方便我们传入参数，即在事件回调函数里，返回一个回调函数！！（即使用函数柯里化的方式）

**方法一**：柯里化方式

以下是对上方chang事件的优化，实现用户名 和 密码都可以使用同一个函数 

```js
cChange = (dataType) => {
    return (event) => {
        this.setState({
            // 作为键名时，如果是变量名直接写，就必须加[]
            [dataType]: event.target.value
        })
    }
}
```



然而，除此之外，还有其他不用柯里化的方式也能实现React函数传参

**方法二**：内联的箭头函数
我个人认为实质上和柯里化的意思差不多，只是在内联部分实现罢了

```js
cChange = (dataType, event) => {
        this.setState({
          // 作为键名时，如果是变量名直接写，就必须加[]
          [dataType]: event.target.value
        })
      }
      render() {
        return (
          <div>
            <form action="https://www.baidu.com" onSubmit={this.handle}>
            用户名<input type="text" onChange={event => this.cChange('userName', event)} name="username" />
            密码<input type="password" onChange={event => this.cChange('passWord', event)} name="password" />
              <button>登录</button>
            </form>
          </div>
        )
      }
```



#### React生命周期函数

生命周期函数可以不用箭头函数，因为它们和render属于同一性质，在创建页面/销毁页面的时候通过类的实例调用一次

1.挂载组件`mount`                                   卸载组件`unmount`

`componentDidMount`（和Vue的`mounted`一样，只调用一次，即挂载组件的时候调用**一次**，类似于render的兄弟，只不过setState不能在 `render`里进行调用，然而setState可以在 `mountd`里面调用  ） 

使用方式：

- `componentWillMount(){}`调用：组件即将挂载时
- `componentDidMount(){}`调用：组件挂载完毕（常用）

- ` componentWillUnmount() {}`调用：组件被卸载前执行，有点像vue里的beforeDestory（常用，一般用于解决一些内存泄漏的问题）

卸载节点(组件)的方式

`ReactDOM.unmountComponentAtNode(节点)`

2.`render`：初始化渲染或者状态更新之后（常用）

有点类似Vue的`updated`，因为Vue官方解释对于updated也是避免在里面操作DOM，可能会引起死循环，而在render里调用setState，也会引起死循环！

以下为生命周期函数小案例

```js
class Life extends React.Component {
      state = {
        opacity: 1
      }
      wind = () => {
        // 卸载节点
        ReactDOM.unmountComponentAtNode(document.querySelector('#container'))
      }
      componentDidMount() {
        if (this.timer) this.timer = null;
        this.timer = setInterval(() => {
          console.log('gg');
          let { opacity } = this.state;
          opacity -= 0.1;
          if (opacity <= 0) opacity = 1;
          this.setState({
            opacity
          })
        }, 200)
      }
      componentWillUnmount() {
        //在卸载节点之前，清除定时器，防止报错 + 内存泄露
        clearInterval(this.timer);
      }
      render() {
        return (
          <div>
            <h1 style={{ opacity: this.state.opacity }}>刮风之前</h1>
            <button onClick={this.wind}>刮风之后</button>
          </div>
        )
      }
    }
    ReactDOM.render(<Life />, document.querySelector('#container'))
```



**旧版React生命周期图**

![](/simple-blog/React(上)/react_life.png)

我们可以看到（由`ReactDOM.render()`触发）**初始化阶段**：

 `constructor` -> `componentWillMount` -> `render` -> `componentDidMount`



**更新阶段**，有 `setState`、 `forceUpdate`、 父组件重新`render` 三条时间线

- 发生了`setState` -> `shouldComponentUpdate`（是否应该重新更新页面），如果返回false，阀门关闭，则停住；如果返回true，则进行下一步（这个生命周期钩子默认返回true） ->  `componentWillUpdate `-> `render`发生更新 -> `componentDidUpdate`
- 第二条线，发生了 `forceUpdate()`  ->  `componentWillUpdate `-> `render`发生更新 -> `componentDidUpdate`
- 第三条，是当其父组件发生了render时，跳转到 -> `componentWillReceiveProps`(组件将要接收参数)  -> `shouldComponentUpdate` ->  `componentWillUpdate `-> `render`发生更新 -> `componentDidUpdate`
  - 但实质上 `componentWillReceiveProps` 有个坑，就是第一次传入时不算，不会调用这个生命周期函数；然后再第二、三次时，让父组件发生render，子组件就会调用这个生命周期函数

由此我们得到一些其他的生命周期函数

3.` shouldComponentUpdate(){}` 控制组件是否更新的阀门时钩子

4.`componentWillUpdate(){}` 组件将要发生更新时钩子

5.`componentDidUpdate(){} `组件更新完毕时钩子，它可以接收两个参数，第一个参数preProps是先前接收的props值，第二个preState是更新前的state值

6.`componentWillReceiveProps(){}`父组件 `render` 再次传入新的props调用

补充：

`forceUpdate()`是强制更新的方法、有时并不想使用`setState()`，只是单纯想让页面发生更新，可以使用这个函数



#### **新生命周期图**

![](/simple-blog/React(上)/react_lift2.png)

改动一：

在新版本（17.0以上）使用旧的生命周期函数

比如使用 `componentWillMount` 、 `componentWillUpdate`、 `componentWillReceiveProps` 就会出现黄色警告（虽然上图没出现他们三个，但是可以使用）（简称 3 Will组合，但是 `componentWillUnMount()` 没事 ）

它提示你新版本已经开始使用 `UNSAFE_componentWillMount`、 `UNSAFE_componentWillUpdate`，并且提示你可能在18.0版本以后就不能使用旧版本的以上的生命周期函数了

![](/simple-blog/React(上)/react_warn.png)

然而为什么这三个生命周期要发生改动？React官方解释道：

这些生命周期方法经常被误解和滥用（不常用，可能导致编程人员用错地方）；此外，我们预计，在异步渲染中，它们潜在的误用问题可能更大。我们将在即将发布的版本中为这些生命周期添加 “UNSAFE_” 前缀。（这里的 “unsafe” 不是指安全性，而是表示使用这些生命周期的代码在 React 的未来版本中更有可能出现 bug，尤其是在启用异步渲染之后。）

我个人认为则是fiber分片调度的存在，使得第一阶段相关的这些生命周期函数内的代码可能被多次执行，非常unstable！

改动二：

出现新的钩子：

1.`getDerivedStateFromProps`，它横跨初始化 & 更新部分（这部分英文意思可以理解为：从Props得到派生的状态）

- 它作为一个静态方法（static），应该挂载到类上，而不是挂载到实例上

- 它必须返回一个状态对象，不然会报错（不然也得返回一个null）

- 它可以接受两个参数，即接收props、state，此方法适用于[罕见的用例](https://zh-hans.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html#when-to-use-derived-state)，即 state 的值在任何时候都取决于 props（比如state的 某 `key : value` 取决于 props 传入的 `key : value`）

  ```js
  static getDerivedStateFromProps(props, state){
      
  }
  ```

但是：！！！派生状态会导致代码冗余，并使组件难以维护，所以了解即可

2.`getSnapshotBeforeUpdate`，它钩在React更新DOM 和 refs之前 （这部分英文意思可以理解为：在更新之前，获取快照）（大家回家之前，集体拍个照 * .* ）

- 它必须返回一个快照值，不然会报错（不然也得返回一个null）

  - 快照值可以是任意类型

  -  之前讲述到`componentDidUpdate(){}`生命周期函数，实质上它可以接收第三个参数，也就是 snapshotValue，而snapshotValue就是 `getSnapshotBeforeUpdate`钩子函数返回的值

    ```js
    componentDidUpdate(preProps, preState, snapshotValue){
    	//xxxx
    }
    ```

    

虽然这两个新的钩子名字巨长，很恶心，但是官方也阐述了这两个钩子的使用场景极其罕见

总结：

**初始化阶段**：

 `constructor` -> `getDerivedStateFromProps` -> `render` -> `componentDidMount`

**更新阶段**，同样也有有 `setState`、 `forceUpdate`、 父组件重新`render` 三条时间线，如上图所示



## 4.React脚手架

使用脚手架开发项目的特点：模块化，组件化，工程化

项目整体技术架构为：react + webpack + es6 + eslint

当然创建react脚手架必须在本地主机上安装react的专用脚手架库

```shell
npm i -g create-react-app 
```

切换到我们想要的目录下进行初始化

```shell
create-react-app 项目名称
```

启动项目（默认情况下）

```shell
npm start
```

打包项目（默认情况下）

```shell
npm build
```

启动项目（默认情况下）

React脚手架中通用路径写法：

`%PUBLIC_URL%/favicon.ico` ：public目录下的favicon图标

在index.html中可以看到

```js
<!-- 开启理想窗口、做移动端适配 -->
<meta name="viewport" content="width=device-width, initial-scale=1" />
<!-- 用于配置浏览器页签 + 地址栏的颜色（仅支持安卓手机） -->
<meta name="theme-color" content="#000000" />
<!-- 用于适配苹果系统的图标 -->
<link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
<!-- 在html上套上安卓 / ios的 apk壳 -->
<link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
```



在src文件夹下

于index.js我们可以看到

```js
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
```

其实也就是平时我们渲染的部分，只是 使用了 `<React.StrictMode>`，它会自动检查插入组件的撰写是否合理，检查代码合理性

而reportWebVitals.js 和 setupTests.js 分别用于页面性能分析 和 组件单元测试



tip：

在脚手架里，引入文件时，如果文件名是index.js、index.jsx，则引到该文件所处文件夹即可

在脚手架里，引入文件时，如果文件是js / jsx，可以不写后缀名

jsx**模板生成的快捷键**（类式组件）： `rcc` 

jsx**模板生成的快捷键**（函数式组件）： `rfc` 



#### 脚手架中CSS模块化

正常在jsx文件里引入css： `import './index.css'`

实现css模块化：方法一

1.`index.css` -> `index.module.css`

2.引入样式：`import xx from './index.module.css'` 

3.使用样式 :`<h2 className={xx.title}> Hello, React </h2>`

但是注意：如果在css模块中只是单纯使用标签选择器，则**无法模块化**，有全局影响性

```css
ul li {}
```

推荐加上

```css
.home ul li {}
```

在css module中仍要让样式全局化

```css
:global(.home){}
```



方法二：使用less进行嵌套

（React中less使用教程 https://www.cnblogs.com/liangziaha/p/13632623.html ）

亦或者使用vscode自带的less转化css

（还是Vue的scope舒服呀）



方法三：使用sass

```shell
npm i sass
```

```scss
$width:300px
ul {
	.item{
		width:$width
	}
}
```

```js
import style from './child.module.scss'
```

```html
<li className={style.item}></li>
```



#### react中设置全局路径

```shell
npm run eject
```

暴露出webpack的配置文件webpack.config.js

```js
resolve: {
      //...
      alias: {
        //...
        // 路径引用 @
        '@': path.resolve(__dirname, '../src')
      }
    }
```



#### react脚手架prettier和eslint

`create react app`自带`eslint`，我们需要安装prettier

```shell
npm i prettier -D
```

然后我们需要让eslint和prettier兼容

```shell
npm install eslint-config-prettier eslint-plugin-prettier --save-dev
```

在根目录下新建文件 `.eslintrc.json`

```js
{
  "extends": ["react-app", "plugin:prettier/recommended"]
}
```



## 5.React开发中应用

#### 组件数据传递（子传父）

利用的是回调函数闭包的特性，和Vue的子组件传递给父组件的 `$emit()` 有异曲同工之妙

父组件：设置函数，并在子组件上使用props传递该函数

```js
export default class App extends Component {
  addTodo = (name) => {
    console.log(name);            //得到子组件的数据
  }
  render() {
    return (
      <div>
      	<Header addTodo={this.addTodo}></Header>
      </div>
    )
  }
}
```

子组件，使用props接收传入的回调函数，并且将数据作为参数进行调用

```js
export default class Header extends Component {
  addTodo = (e) => {
    if (e.keyCode !== 13) return;
    this.props.addTodo(e.target.value);  //进行回调
  }
  render() {
    return (
      <div className="todo-header">
        <input type="text" onKeyUp={this.addTodo} placeholder="请输入你的任务名称，按回车确认" />
      </div>
    )
  }
}
```



#### id生成库

在标识数据唯一性我们需要用到id，当使用random、date.now()生成id都有一定弊端，可以借用uuid，一个id库帮助我们生成id

```shell
npm i uuid
```

开发小项目，我更加推荐的是nanoid

```shell
npm i nanoid
```

nanoid是一个函数，每次调用都会帮你生成一个字符串，保证全球唯一

```js
import {nanoid} from 'nanoid'
const str = nanoid();
```



#### React内部配置代理跨域

**(反向代理)**

在src目录下**新建一个setupProxy.js文件** 在此文件中必须使用cjs的方式撰写（CommonJS），因为这个文件是要加到webpack配置里面的，而webpack用的是node语法

```shell
npm i http-proxy-middleware
```

> 实际上 `http-proxy-middleware` 也是开了一个exporess服务器，帮你做反向代理

proxy内部选项介绍：

- 第一个参数设置前缀名，比如设置了前缀名为`/api1`，也就是以`/api`开头，

  遇到这个前缀的请求就会触发该代理配置，比如猫眼电影的请求示例

  原本请求地址 ：https://i.maoyan.com/ajax/comingList?ci=91&limit=10.... -> 此时我们需要改成  [/ajax/comingList?ci=91&limit=10](/simple-blog/ajax/comingList?ci=91&limit=10)....，就会触发代理

  ```js
  axios.get('/ajax/mostExpected?limit=10&offset=0&token=&optimus.........').then((res) => { 
      //自动找本地域名 + /ajax
    console.log(res)
  })
  ```

  

- 第二个参数是配置

  - target：我们发送的目标跨域url
  - changOrigin：默认值为false，控制服务器收到请求头中Host（请求资源所在服务器，也就是发送源）字段的值；当changOrigin: true 时，能欺骗服务器，让服务器以为是同源请求，而不知道你的真实host发送源。（实际上不加其实也没关系，但是防止服务器的限制，比较好一点）
  - pathRewrite：重写请求路径，一定要加上，不加上虽然有走代理，请求路径加上了 /api1，不存在该资源，一般会报404

```js
const proxy = require('http-proxy-middleware')
///使用proxy中间件
module.exports = function (app) {
    //中间件既视感
    app.use(
        proxy('/ajax', { 
            target: 'https://i.maoyan.com',  //目标请求地址
            changOrigin: true,
        }),
        proxy('/api1', { 
            target: 'http://localhost:5000', 
            changOrigin: true,
            pathRewrite: { '^/api1': '' }     //自动帮我们把api1给去掉
        }),
        proxy('/api2', {
            target: 'http://localhost:5001',
            changOrigin: true,
            pathRewrite: { '^/api2': '' }
        })
    )
}
```



#### 消息订阅与发布机制

工具库 ： PubSubJS

可以在github上下载，也可以直接npm 

```shell
npm i pubsub-js --s
```

引入后（`import PubSub from 'pubsub-js'` / `const PubSub = require('pubsub-js');`）

官网使用的案例

```js
//回调函数
var mySubscriber = function (msg, data) {
   	//在调用时会传入两个参数，第一个msg就是消息名，第二个data就是交互的数据
};

//订阅消息
var token = PubSub.subscribe('MY TOPIC', mySubscriber);
//第一个参数消息名
//第二个参数是收到消息后的回调函数，即如果有人发布了该消息名则进行回调

//发布消息
PubSub.publish('MY TOPIC', 'hello world!');
//第一个参数消息名
//第二个参数是传送的数据
```

```js
//token接收到订阅的返回值，后续可以使用下列方式取消订阅，防止内存泄漏
PubSub.unsubscribe(token);
```



利用这个订阅发布机制，我们可以实现兄弟组件的通信！（有点像Vue的eventBus）

小栗子：

```js
 // 订阅消息名为SearchGitHhub的消息
  componentDidMount() {
    this.token = PubSub.subscribe('SearchGitHhub', (msg, stateObj) => {
      this.setState(stateObj)
    });
  }

  componentWillUnmount() {
    // 临走前取消订阅
    PubSub.unsubscribe(this.token);
  }
```

```js
 // 发布消息名为SearchGitHhub的数据
PubSub.publish('SearchGitHhub', { isFirst: false, isLoading: true });
```
