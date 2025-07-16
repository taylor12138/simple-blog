---
author: Hello
categories: 前端
pubDate: 2022-03-05
title: React中使用TS
description: '框架相关'
---

## 在React中使用typescript

React脚手架 + typescript

```shell
npx create-react-app my-app --template typescript
```



如果是对当前React脚手架项目添加typescript支持

```shell
npm install --save typescript @types/node @types/react @types/react-dom @types/jest
```

但是有个问题就是：将 TypeScript 添加到现有项目不会添加 tsconfig 

https://github.com/facebook/create-react-app/issues/10951

作为一种较为无语的解决方法：

作为一种解决方法，我通过运行创建了一个新的 react 应用程序：
`npx create-react-app ts-example --template typescript`
然后将生成的 tsconfig.json 的内容复制粘贴到我现有的应用程序中。



#### **对于类式组件**

在构建React组件类的时候，还有这一种接口的写法 `React.Component<props接口的名称, state接口的名称>`，用来说明派生的 Component 使用的 Props 和 State 的类型

```ts
React.Component<Props, State>
```

ref对象，我们也需要手动声明它的类型

```
myRef = React.createRef<ref的元素类型>()
```

比如以下例子

```jsx
import React, { Component, createRef } from 'react';
interface IState {
  name: string
}
// 泛型第一个约定props属性、第二个约定状态
class App extends Component<any, IState> {
  state = {
    name: "allen"
  }
  myRef = createRef<HTMLInputElement>()
  render() {
    return (
      <div>
        <input type="text" ref={ this.myRef}/>
        <button onClick={
          () => {
            console.log((this.myRef.current as HTMLInputElement).value);
         }
        }></button>
        <Child name={this.state.name}></Child>
      </div>
    );
  }
}
interface IProps {
  name: string
}
class Child extends Component<IProps, IState> {
}
export default App;
```



#### **对于函数式组件**

函数式组件十分轻松，不用做什么处理，作为状态state已经被隐式推导了

而其他的规范也十分轻松

```ts
import React, {useState, useRef} from 'react'
//非要自己显式也不是不行：  const [name, setName] = useState<string>("allen")
interface IProps {
  name: string
}
export default function App(props:IProps) {
  const [name, setName] = useState("allen")
  const inputRef = useRef<HTMLInputElement>(null)
  return (
    <div>
      <div>{name}</div>
      <input type="text" ref={inputRef}/>
      <button onClick={
        () => {
          setName("Mikasa")
          console.log((inputRef.current as HTMLInputElement).value);
        }
    }></button>
    </div>
  )
}
```



#### react路由+TS

对于react-router-dom，无法直接使用，需要声明文件（declare）（或者你自己写声明文件，手动狗头）

```shell
npm i --save-dev @types/react-router-dom
```

注意事项：作为路由组件，应该带有三个属性：history、location、match

```tsx
<Route path="/home/:id" component={Home} />
<Route path="/about" component={About}></Route>
```

首先引入 `RouteComponentProps` props的声明，得到路由组件的类型推断

其次可以在该声明中传入泛型，这个泛型是指定路由参数（params）类型的泛型

```ts
import React, { useState, useRef } from 'react'
import {RouteComponentProps} from 'react-router-dom';
interface IParams {
  name: string
}
export default function App(props:RouteComponentProps<IParams>) {
    
  return (
    <div>
      {props.match.params.name}
    </div>
  )
}

```



#### redux+TS

redux已经有声明文件了，这里不用下载

三个文件

- 新建 store.js
- 新建一个处理xxx组件的 xxx-reducer.js
- 可选，新建一个处理xx组建的xxx-action.js

store几乎照常写就行了，而reducer和action传参的时候小小修改一下

```ts
interface IAction {
  type: string;
  payload?: any;
}
interface IPreState {
  isShow: boolean
}
export default function countReducer(preState: IPreState = {
  isShow: true
}, action: IAction) {
  const { type, payload } = action;
  let newState = preState;
  //...
  return newState;
}
```



## 小坑

#### alias

关于TS在create react app应用的小坑

webpack配置

```js
module.exports = {
  //...
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src')
    }
  }
};
```

但是在项目中使用alias转换的全局路径，ts不买账

为了解决这个问题，需要借助tsconfig，尽管webpack已经配置好了alias， 可是ts并不认账。

tsconfig.json配置如下

需要在compilerOptions 增加2个字段， baseUrl 指定当前工程的路径， paths 用于对别名的映射。

```json
{
  "compilerOptions": {
    // ...
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
    // ...
  }
}
```

在此就能解决上述问题了，如果不行可能需要重启vscode。