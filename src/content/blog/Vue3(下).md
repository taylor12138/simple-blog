---
title: 'Vue3(下)'
author: Hello
pubDate: 2021-11-05
categories: 前端
description: 'Vue3(下)相关'
---

## 6.Vue动画处理

vue有个内置组件 `transition`

基本使用：使用name定义过渡类名，然后常常与`v-if`、`v-show`、动态组件进行搭配

官方：

可以给任何元素和组件添加进入/离开过渡

- 条件渲染 (使用 `v-if`)
- 条件展示 (使用 `v-show`)
- 动态组件
- 组件根节点



#### 基本使用（CSS）

```html
<transition name="why">
    <h2 v-if="isShow">Hello World</h2>
</transition>
```

```css
.why-enter-from,
.why-leave-to {
    opacity: 0;
}

.why-enter-to, 
.why-leave-from {
    opacity: 1;
}

.why-enter-active,
.why-leave-active {
    transition: opacity 2s ease;
}
```



class几个transition的类（我们可以通过name来定义前缀，比如name="allen"，则类为`allen-enter-from`）

1. `v-enter-from`：定义进入过渡的开始状态。在元素被插入之前生效，在元素被插入之后的下一帧移除。（插入时样式）
2. `v-enter-active`：定义进入过渡生效时的状态。在整个进入过渡的阶段中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数。（插入ing样式，常存放动画）
3. `v-enter-to`：定义进入过渡的结束状态。在元素被插入之后下一帧生效 (与此同时 `v-enter-from` 被移除)，在过渡/动画完成之后移除。（插入后样式）
4. `v-leave-from`：定义离开过渡的开始状态。在离开过渡被触发时立刻生效，下一帧被移除。（移除前样式）
5. `v-leave-active`：定义离开过渡生效时的状态。在整个离开过渡的阶段中应用，在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。这个类可以被用来定义离开过渡的过程时间，延迟和曲线函数。（移除ing样式，常存放动画）
6. `v-leave-to`：离开过渡的结束状态。在离开过渡被触发之后下一帧生效 (与此同时 `v-leave-from` 被删除)，在过渡/动画完成之后移除。（移除后样式）



transition的几个props

- `name` - `string` 用于自动生成 CSS 过渡类名。例如：`name: 'fade'` 将自动拓展为 `.fade-enter`，`.fade-enter-active` 等。
- `appear` - `boolean`，是否在初始渲染时使用过渡。默认为 `false`。
- `mode` - `string` 控制离开/进入过渡的时间序列。有效的模式有 `"out-in"` （先移除，再插入）和 `"in-out"`（先插入，再移除）；默认同时进行。
- `duration` - `number | { enter: number, leave: number }`。指定过渡的持续时间，指定之后css动画里原来写好的时间则无效
- `css`，指定 `:css='false'`可以让css过渡属性失效，提高性能（用于只执行js动画）



#### 第三方动画库

##### **animate.css**

官网：https://animate.style/

```shell
npm i animate.css --save
```

然后直接在main.js里面引入

```js
import "animate.css";
```

在官网搜寻自己想要的动画名称，并且在transition类中添加，比如

```css
 .allen-enter-active {
 	animation: bounceInUp 1s linear
 }
  .allen-leave-active {
  	animation: bounceInUp 1s linear reverse
  }
```



##### gsap库

一个JS动画库（vue官方有在用），官网：https://greensock.com/

- 通过JavaScript为CSS属性，SVG、Canvas等设置动画，并且都是浏览器兼容的

```shell
npm i gsap
```

使用gsap库配合js钩子使用

```js
methods: {
    enter(el, done) {
        console.log("enter");
        gsap.from(el, {
            scale: 0,
            x: 200,
            onComplete: done
        })
    },
        leave(el, done) {
            console.log("leave");
            gsap.to(el, {
                scale: 0,
                x: 200,
                onComplete: done
            })
        }
}
```

gsap除了对元素（element）进行JS动画处理，也可以对某个普通对象，进行按照时间间隔逐步改变属性值

```vue
<template>
  <div class="app">
    <input type="number" step="100" v-model="counter">
    <h2>当前计数: {{showNumber.toFixed(0)}}</h2>
  </div>
</template>

<script>
  import gsap from 'gsap';

  export default {
    data() {
      return {
        counter: 0,
        showNumber: 0
      }
    },
    watch: {
      counter(newValue) {
        gsap.to(this, {duration: 1, showNumber: newValue})
      }
    }
  }
</script>
```





#### JS钩子

`transition`内置组件除了可以使用CSS动画，还可以配合上JS动画

此时使用里面定义好的JS钩子即可（钩子作用分别查看字面意思即可， `enter-cancelled`和 `leave-cancelled`对应的是取消操作 ）

用的最多是enter和leave

```html
<transition
  @before-enter="beforeEnter"
  @enter="enter"
  @after-enter="afterEnter"
  @enter-cancelled="enterCancelled"
  @before-leave="beforeLeave"
  @leave="leave"
  @after-leave="afterLeave"
  @leave-cancelled="leaveCancelled"
  :css="false"
>
  <!-- ... -->
</transition>
```

钩子函数可以选择带入参数：

- el：当前元素
- done：当只用 JavaScript 过渡的时候，在 **`enter` 和 `leave` 钩中必须使用 `done` 进行回调**。否则，它们将被同步调用，过渡会立即完成。

```js
// ...
methods: {
  beforeEnter(el) {
    // ...
  },
  // 当与 CSS 结合使用时
  // 回调函数 done 是可选的
  enter(el, done) {
    // ...
    done()
  },
  afterEnter(el) {
    // ...
  },
  enterCancelled(el) {
    // ...
  },

  // --------
  // 离开时
  // --------

  beforeLeave(el) {
    // ...
  },
  // 当与 CSS 结合使用时
  // 回调函数 done 是可选的
  leave(el, done) {
    // ...
    done()
  },
  afterLeave(el) {
    // ...
  },
  // leaveCancelled 只用于 v-show 中
  leaveCancelled(el) {
    // ...
  }
}
```



#### 列表插入

列表新增 / 删除元素的时候，可以模拟成v-if时，新增/ 删除 元素

只不过通过 `transition-group` 进行包裹

props：

- tag：将 `transition-group`变成 xx标签

不过，列表多出了其他元素，而添加 / 删除元素时影响到其他列表元素位置时，调整的动画该如何设置？

- 我们可以使用 v-move的class来完成动画的设置，它会在元素改变位置的时候应用，和之前的名字一样，我们可以通过name定义前缀

添加 / 删除列表元素小案例

```vue
<template>
  <div>
    <button @click="addNum">添加数字</button>
    <button @click="removeNum">删除数字</button>

    <transition-group tag="p" name="why">
      <span v-for="item in numbers" :key="item" class="item">
        {{item}}
      </span>
    </transition-group>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        numbers: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        numCounter: 10
      }
    },
    methods: {
      addNum() {
        this.numbers.splice(this.randomIndex(), 0, this.numCounter++)
      },
      removeNum() {
        this.numbers.splice(this.randomIndex(), 1)
      },
      randomIndex() {
        return Math.floor(Math.random() * this.numbers.length)
      }
    },
  }
</script>

<style scoped>
  .item {
    margin-right: 10px;
    display: inline-block;
  }

  .why-enter-from,
  .why-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }

  .why-enter-active,
  .why-leave-active {
    transition: all 1s ease;
  }

  .why-leave-active {
    position: absolute;    /*防止移除的过程中仍占据原来的位置，导致元素移动的动画不成功*/
  }

  .why-move {
    transition: transform 1s ease;
  }
</style>
```



## 7.其他

#### 自定义指令

代码的复用主要还是通过组件，但是在某些情况下，你需要对DOM元素进行底层操作，就可以用到自定义指令

- 自定义局部指令：组件通过directives选项
- 自定义全局指令：app的directives选项

案例：为组件自定义 `v-focus` 指令

```vue
<template>
  <div>
    <input type="text" v-focus>
  </div>
</template>

<script>
  export default {
    // 局部指令
    directives:{
      focus:{
        mounted(el, bindings, vnode, preVnode) {
          el.focus();
        },
      }
    }
  }
</script>
```

若为全局指令则在main.js中定义（更常用）

```js
import { createApp } from 'vue'
import App from './App.vue'

createApp(App).mount('#app');
// 全局指令
app.directive("focus", {
  mounted(el, bindings, vnode, preVnode) {
    el.focus();
  },
})
```

自定义指令内部的生命周期属性：

| 名称          |
| ------------- |
| created       |
| beforeMount   |
| mounted       |
| beforeUpdate  |
| updated       |
| beforeUnmount |
| unmounted     |

生命周期函数携带的参数

1. el：元素
2. bindings：一个对象，里面存储传入的参数、修饰符等
3. vnode虚拟节点
4. preVnode，指向上一个虚拟节点



#### teleport

在某些情况下，我们并不想要将组建挂载在组件树上，而是移动到Vue app 以外的地方（我们有其他div#app的元素）

- teleport是Vue内置组件，类似于React的Portals
- 它有两个属性
  - to：指定将其中的内容移动到目标元素，可以使用选择器
  - disabled：是否禁用teleport的功能 



#### 自定义插件

全局插件有个约定俗成的小规范：命名都加$, $开头

添加完毕之后，可以通过 this.命名来获取

但是setup比较麻烦，因为setup不能通过this拿到组件实例

```js
export default {
  install(app) {
      app.config.globalProperties.$name = "Allen"
  }
}
```

在main.js中导入

```js
import { createApp } from 'vue'
import App from './App.vue'
import plugins_object from './plugins/plugins_object'

const app = createApp(App)
app.use(plugins_object); // 使用插件
/*
内部执行plugins_object.install(app)
*/
app.mount('#app');
```



在Vue3中，use方法实际上是把插件添加进Set中，然后调用其install方法

如果没有install方法，而plugin本身就是一个方法，则调用plugin方法

```typescript
use(plugin: Plugin, ...options: any[]) {
    if (installedPlugins.has(plugin)) {
        __DEV__ && warn(`Plugin has already been applied to target app.`)
    } else if (plugin && isFunction(plugin.install)) {
        installedPlugins.add(plugin)
        plugin.install(app, ...options)
    } else if (isFunction(plugin)) {
        installedPlugins.add(plugin)
        plugin(app, ...options)
    } else if (__DEV__) {
        warn(
            `A plugin must either be a function or an object with an "install" ` +
            `function.`
        )
    }
    return app
},
```



#### vue3源码相关

三大核心

1. Complier模块，编译模板系统（tempplate -> h函数可识别的形式）
2. Runtime模块，称之为Renderer模块，真正的渲染模块（h函数可识别的形式 -> 虚拟DOM -> 真实DOM）
3. Reactivity模块，响应式系统



#### element-plus

https://element-plus.gitee.io/zh-CN/

Element Plus，一套为开发者、设计师和产品经理准备的基于 Vue 3 的**桌面端**组件库（Element是针对vue2.x的）

如果是移动端的推荐使用 `VantUI` 

使用：

方案一：直接全局引用 - >  所有组件全部集成，组件全部进行了全局注册

优点：集成比较简单，可以直接使用

缺点：全部打包‘

```typescript
// main.ts
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
```

方案二：按需引用

优点：包会比较小

缺点：引用麻烦

方案三：官网推荐的自动导入



## 8.双向绑定

**Proxy VS Object.defineProperty**

- Vue2.x版本中的双向绑定不能检测到下标的变化，不存在的属性不能被拦截（其实也是因为 `Object.defineProperty`方法必须传入对象、属性参数），属性中还有属性嵌套还得递归；proxy可以劫持整个对象，并返回一个新对象，管你属性存不存在都可以拦截

- 响应式方面 性能得到很大提升 不用初始化的时候就递归遍历属性；响应式不区分数组和对象
- 修改对象：
  - 使用 `Object.defineProperty` 我们修改原来的obj对象就触发拦截
  - 使用proxy要修改代理对象，才触发拦截（即使在getter方法中 `return target[key]`，也不会触发循环调用 ）
- Proxy能观察的类型比defineProperty更加丰富，比如has、deleteProperty等
- Proxy作为新标准将受到浏览器厂商的重点优化



more:

- 这里Proxy相对与原来Vue2.0的响应式的  “不管三七二十一，上来就给你判断对象  + 递归 ”  不一样，做了小优化，他在**修改数据时**并不是一上来就递归，而是先通过get方法获取，如果获取到的结果是一个对象，则再做一层代理，进行递归，然后再通过`set`修改
- 既然Proxy可以改属性 + 新增属性，那他怎么识别？通过 if 语句 + `对象.hasOwnProperty(属性)` 判断，原来是否有这个属性

为什么以前不用Proxy？兼容性差。。。ie11就不兼容



#### 代理模式

代理模式（英语：Proxy Pattern）是程序设计中的一种设计模式。

当一个复杂对象的多份副本须存在时，代理模式可以结合享元模式以减少内存用量。典型作法是创建一个复杂对象及多个代理者，每个代理者会引用到原本的复杂对象。而作用在代理者的运算会转送到原本对象。一旦所有的代理者都不存在时，复杂对象会被移除。



#### Proxy

Proxy代理Object   **控制和修改Object的基本行为**（覆盖对象的基本操作），比如属性调用、属性赋值、删除属性、方法调用等

`target`是被代理的对象，`handler`是一个对象，属性是各种控制或修改target基本行为的方法

你可以想象成proxy就是一个壳

```js
const p = new Proxy(target, handler);
```

`handler`里面的`get()`、`set()`和`Object.defineProperty()`的`get`方法、`set`方法有点像，重新定义了属性的读取、设置行为

`get()`拦截某个属性的读取操作。可以接受三个参数，依次为目标对象、属性名和 proxy 实例本身（严格地说，是操作行为所针对的对象），其中最后一个参数可选。

`set()`拦截某个属性的赋值操作。可以接受四个参数，依次为目标对象、属性名、属性值和 Proxy 实例本身，其中最后一个参数可选。

其实handler有13种方法

```js
handler.getPrototypeOf()
// 在读取代理对象的原型时触发该操作，比如在执行 Object.getPrototypeOf(proxy) 时。
handler.setPrototypeOf()
// 在设置代理对象的原型时触发该操作，比如在执行 Object.setPrototypeOf(proxy, null) 时。
handler.isExtensible()
// 在判断一个代理对象是否是可扩展时触发该操作，比如在执行 Object.isExtensible(proxy) 时。
handler.preventExtensions()
// 在让一个代理对象不可扩展时触发该操作，比如在执行 Object.preventExtensions(proxy) 时。
handler.getOwnPropertyDescriptor()
// 在获取代理对象某个属性的属性描述时触发该操作，比如在执行 Object.getOwnPropertyDescriptor(proxy, "foo") 时。
handler.defineProperty()
// 在定义代理对象某个属性时的属性描述时触发该操作，比如在执行 Object.defineProperty(proxy, "foo", {}) 时。
handler.has()
// 在判断代理对象是否拥有某个属性时触发该操作，比如在执行 "foo" in proxy 时。
handler.get()
// 在读取代理对象的某个属性时触发该操作，比如在执行 proxy.foo 时。
handler.set()
// 在给代理对象的某个属性赋值时触发该操作，比如在执行 proxy.foo = 1 时。
handler.deleteProperty()
// 在删除代理对象的某个属性时触发该操作，比如在执行 delete proxy.foo 时。
handler.ownKeys()
// 在获取代理对象的所有属性键时触发该操作，比如在执行 Object.getOwnPropertyNames(proxy) 时。
handler.apply()
// 在调用一个目标对象为函数的代理对象时触发该操作，比如在执行 proxy() 时。
handler.construct()
// 在给一个目标对象为构造函数的代理对象构造实例时触发该操作，比如在执行new proxy() 时。
```

里面的方法一般都需要返回值

```js
var obj = new Proxy({}, {
  get: function (target, propKey, receiver) {
    console.log(`getting ${propKey}!`);
    return Reflect.get(target, propKey, receiver);
  },
  set: function (target, propKey, value, receiver) {
    console.log(`setting ${propKey}!`);
    return Reflect.set(...arguments);
  }
});
```

甚至你可以用proxy做缓存

服务端和客户端同步一个状态可能会出现问题，这很常见，在整个操作周期内，数据都有可能被改变，并且很难去掌握需要重新同步的时机。
proxy提供了一种新的办法，可以让属性在必要的时候失效，所有的访问操作，都会被检查判断，是否返回缓存还是进行其他行为的响应。

```javascript
Copyconst timeExpired = (target, ttl = 60) => {
  const created_at = Date.now();
  const isExpired = () => (Date.now - created_at) > ttl * 1000;
  return new Proxy(tarvet, {
    get: (target, k) => isExpired() ? undefined : Reflect.get(target, k);
  })
}
```

上面的功能很简单，他在一定时间内正常返回访问的属性，当超出ttl时间后，会返回undefined。

```javascript
Copylet timeExpired = ephemeral({
  balance: 14.93
}, 10)

console.log(bankAccount.balance)    // 14.93

setTimeout(() => {
  console.log(bankAccount.balance)  // undefined
}, 10 * 1000)
```

上面的例子会输出undefined在十秒后，更多的骚操作还请自行斟酌。



#### Reflect

通过Proxy的捕获器（handler），我们可以完成基于自己的参数**重建原始操作**，但是并非所有捕获器都像 get 一样那么简单，直接返回就行了，所以通过手动写码如法炮制的想法是不现实的，所以我们使用到了Reflect完成轻松重建，**确保完成原有的行为**，然后再部署额外的功能。

- `Reflect` 将`Object`对象的一些明显属于语言内部的方法（比如`Object.defineProperty`），放到`Reflect`对象上，也就是说，从`Reflect`对象上可以拿到语言内部的方法。

- `Reflect`修改某些`Object`方法的返回结果，让其变得更合理。

  比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而`Reflect.defineProperty(obj, name, desc)`则会返回`false`。

上面两点表明 `Reflect`可能将成为日后替代 `Object`对象方法的新的王！

- 让`Object`操作都变成函数行为。某些`Object`操作是命令式，比如`name in obj`和`delete obj[name]`，而`Reflect.has(obj, name)`和`Reflect.deleteProperty(obj, name)`让它们变成了函数行为。

  ```js
  // 老写法
  'assign' in Object // true
  
  // 新写法
  Reflect.has(Object, 'assign') // true
  ```

- `Reflect`对象的方法与`Proxy`**对象的方法一一对应**，只要是`Proxy`对象的方法，就能在`Reflect`对象上找到对应的方法。这就让`Proxy`对象可以方便地调用对应的`Reflect`方法，完成默认行为，作为修改行为的基础。也就是说，不管`Proxy`怎么修改默认行为，你总可以在`Reflect`上获取默认行为。

  ```js
  Proxy(target, {
    set: function(target, name, value, receiver) {
      var success = Reflect.set(target, name, value, receiver);
      if (success) {
        console.log('property ' + name + ' on ' + target + ' set to ' + value);
      }
      return success;
    }
  });
  ```

  上面代码中，`Proxy`方法拦截`target`对象的属性赋值行为。它采用`Reflect.set`方法将值赋值给对象的属性，**确保完成原有的行为**，然后再部署额外的功能。

  个人认为：这样就形成了Proxy和Reflect的最佳搭配，既保证了原来（默认）的行为，又可以自己添加额外的行为



## 9.Vue3 + TS 项目搭建规范

#### 集成editorconfig配置

editorconfig有助于为不同IDE编辑器上同一项目多人开发的编码风格（比如控制tab缩进空格数量等）

在根目录下新建一个 `.editorconfig` 文件

> 注意，默认情况下vscode不会读取这个文件，需要安装一个插件 EditorConfig for VScode

```shell
# https://editorconfig.org

root = true

[*]                                      #所有文件适用
charset = utf-8                          #文字字符集啊uft-8
indent_style = space                     #缩进风格space
indent_size = 2                          #缩进大小
end_of_line = lf                         #控制换行类型lf、cr、crlf
insert_final_newline = true              #去除行首任意空白字符
trim_trailing_whitespace = true          #始终在文件末尾插入一个新行

[*.md]
insert_final_newline = false
trim_trailing_whitespace = false
```



#### 配置eslint

推荐先在vscode安装一下eslint插件

然后可以在根目录下的`.eslintrc.js`文件查看eslint的规则配置

但是有时候出现我们自定义prettier配置（格式化）和我们的eslint并不兼容的场面，此时我们要安装两个库（如果在创建脚手架的时候有配置过eslint + prettier选项的话，则已经帮我们安装过了）

```shell
npm i eslint-plugin-prettier eslint-config-prettier -D
```

然后在配置文件 `.eslintrc.js` 中的extends设置最后一行

```json
extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint',
    'plugin:prettier/recomended'
]
```

若想关掉一些eslint检查，可以

```js
rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'typescirpt-eslint/no-var-require': 'off' // 关闭对require引用的禁令
}
```



#### 不同的开发环境

在开发中，有时候我们需要根据不同的环境设置不同的环境变量，常见的有三种环境

- 开发环境：development
- 生产环境：production
- 测试环境：test

方法一：

为了让不同环境使用不同的变量，我们可以使用 `process.env.NODE_ENV`

这个值实际上是我们使用webapack的时候，通过它的DefinePlugin全局变量，根据环境注入不同的值，使得在不同环境下 `process.env.NODE_ENV` 的值分别是 'development' 、'production'、'test'

此时我们全局注入的变量通过 if-else 或者 switch 进行变化即可（比如 `if(process.env.NODE_ENV === 'development')` ）

方法二：

> 注意：此方法创建的变量名不能乱起，只有起固定格式的名字，才会被全局注入
>
> 官网注明：请注意，只有 `NODE_ENV`，`BASE_URL` 和以 `VUE_APP_` 开头的变量将通过 `webpack.DefinePlugin` 静态地嵌入到*客户端侧*的代码中。这是为了避免意外公开机器上可能具有相同名称的私钥。

在项目根目录下新建三个文件，文件名分别是 `.env.devlopment`、`.env.production`、`.env.test`

![](/Vue3(下)/env.jpg)

```
// .env.test
VUE_APP_BASE_URL = ''
VUE_APP_BASE_NAME = 'allen'
```

方案二此时**在客户端侧代码中使用环境变量**

只有以 `VUE_APP_` 开头的变量会被 `webpack.DefinePlugin` 静态嵌入到客户端侧的包中。你可以在应用的代码中这样访问它们：

```js
console.log(process.env.VUE_APP_SECRET)
```



#### Vuex配合TS

`createStore`可以传入一个泛型 变成 `createStore<T>` 这个泛型 规定了 state的类型

```typescript
import { createStore } from 'vuex'

interface IRootState {
  name: string
  age: number
}

export default createStore<IRootState>({
  state: () => {
    return {
      name: 'allen',
      age: 18
    }
  },
  mutations: {},
  actions: {},
  modules: {}
})
```

```typescript
// 使用
import { useStore } from 'vuex';
import {IRootState} from '@/store/types';

export default defineComponent({
  setup() {
    const store = useStore<IRootState>()
    return {}
  }
})
```

但是此时我们即使里面已经定义了一些模块，ts还是会给我们报错，比如我们的store里面有个login模块

但是使用的时候ts会报错

```typescript
store.state.login.name
```

此时就表现了vuex对TS的支持非常差（4.x版本）

不过pinia对TS的支持就相对好一点，用法也和vuex相似

当然coderwhy老师还是有解决的方法，比如导出vuex的时候，写多一个函数进行导出



#### vuex模块使用（new）

接口定义

```ts
import { ILoginState } from './login/types'
export interface IRootState {
  name: string
  age: number
}

export interface IStoreType extends IRootState {
  login: ILoginState
}
```

在store/index.ts文件中导出一个函数

```ts
import { createStore, Store, useStore } from 'vuex'

import { IRootState, IStoreType } from './types'
//....
//负责导出store（coderwhy老师的特殊处理）
export function useMyStore(): Store<IStoreType> {
  return useStore()
}
export default store
```

此时使用

```ts
import { defineComponent } from 'vue'
import { useMyStore } from '@/store'

export default defineComponent({
  setup() {
    const store = useMyStore()
    console.log(store.state.login.name) //此时使用起来没问题！
    return {}
  }
})
```



**vuex的modules模块封装**

在ts使用vuex中module来封装模块的时候，需要导入的Module类型声明也有讲究

Module类型类型声明需要传入两个泛型 `Module<S, R>`  S 为 模块中state的类型，R为根模块的state类型



#### 遇到繁琐的接口定义

百度一下：json to ts

会自动转换，把json转换成ts语法，直接帮你写好

但是遇到复杂的数据类型，嵌套，它的转换仍然是有问题的。此时就只能用any了



#### TS结合Vue3的props

有时面对props传参的时候，我们需要特定类型来规范我们传入的参数，而单单靠props自身的type我们还不满足，此时我们可以使用 `PropType`

```ts
<script lang="ts">
import { defineComponent, PropType } from 'vue'
export default defineComponent({
  props: {
    formItems: {
      type: Array as PropType<string[]>
    }
  },
  setup() {
    return {}
  }
})
</script>
```

此时我们可以在泛型里面定义接口，也是可以的

但是众所周知，在定义默认值的时候，复杂数据类型要写成一个函数的形式（《Vue(上)》篇章有提及）

但是如果是vue3 + ts的话，规定要写成一个箭头函数（使用this时）
