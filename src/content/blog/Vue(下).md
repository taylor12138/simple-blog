---
title: 'Vue(下)'
author: Hello
pubDate: 2021-03-22 
categories: 前端
description: 'Vue相关'
---

## 7.其他

#### 事件总线

事件总线和vuex的作用很像，只不过vuex用于管理状态（变量），而事件总线用于管理事件，利用事件传参（感觉vuex有点面向受控组件，而eventbus面向非受控组件）

1.在main.js 文件中 创建一个新的Vue实例，以得到一个bus

```js
Vue.prototype.$bus = new Vue();
```

2.发射 `this.$bus.$emit('事件名'[, 参数])` 

3.接受 `this.$bus.$on("事件名", 回调函数(参数))`

4.可以在deactivated里设置离开时不接受该事件的传递（取消全局事件监听）：`this.$bus.$off("事件名", 接收时的回调函数(参数));`，回调函数要和接收时发生的回调函数保持一致



#### provide / inject

可以理解为祖父与孙子组件们的通信方法

这对选项需要一起使用，以允许一个祖先组件向其所有子孙后代注入一个依赖，不论组件层次有多深，并在其上下游关系成立的时间里始终生效。如果你熟悉 React，这与 React 的上下文（Context）特性很相似。

`provide` 选项（option）应该是一个对象或返回一个对象的函数。该对象包含可注入其子孙的 property。在该对象中你可以使用 ES2015 Symbols 作为 key，但是只在原生支持 `Symbol` 和 `Reflect.ownKeys` 的环境下可工作。

`inject` 选项（option）应该是：

- 一个字符串数组，或
- 一个对象，对象的 key 是本地的绑定名，value 是：
  - 在可用的注入内容中搜索用的 key (字符串或 Symbol)，或
  - 一个对象，该对象的：
    - `from` property 是在可用的注入内容中搜索用的 key (字符串或 Symbol)
    - `default` property 是降级情况下使用的 value

> 提示：`provide` 和 `inject` 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的 property 还是可响应的。

```js
// 父级组件提供 'foo'
var Provider = {
  provide: {
    foo: 'bar'
  },
  //也支持写成一个函数，此时才可以使用this：provide(){ return { foo: 'bar' } }
}

// 子组件注入 'foo'
var Child = {
  inject: ['foo'],
  created () {
    console.log(this.foo) // => "bar"
  }
  // ...
}
```

既然不是响应式的，那如果用到需要响应式怎么办？！！

常规做法

```js
var Provider = {
    data(){
        return {
            foo: 'bar'
        }
    },
    provide: {
        fooProvide: this.fooFn // 传递一个引用类型函数过去
    },
    methods:{
        fooFn() {
            return this.foo
        }
    }
}
```

其他做法：

配合上计算属性computed

```js
var Provider = {
  provide() {
  	return {
        length: computed(() => this.names.length).value; //computed返回的是一个ref对象，如果拿到值必须得.value
    }
  }
}
```



#### mixin（混入）

Vue中相同逻辑的代码如何抽离？

为了减少两个对象之间重复的代码，Vue官方提供了 `minxin`（较少类重复的代码可以用es6的继承）

**全局混入**

`mixin` 用于全局混入，会影响到每个组件实例，通常插件都是这样做初始化的。

```js
Vue.mixin({
    beforeCreate() {
        // ...逻辑
        // 这种方式会影响到每个组件的 beforeCreate 钩子函数
    }
})
```

**拓展组件的局部混入**

```js
var mixin = {
  created: function () { console.log(1) }
}
var vm = new Vue({
  created: function () { console.log(2) },
  mixins: [mixin]
})
// => 1
// => 2
```

mixin合并规则：

比如Mixin对象中选项和组件对象中的选项发生冲突时

- 如果是data，则选择组件对象中的选项
- 如果是生命周期，则会把两者（生命周期函数）都放在一个数组里，等到合适的生命周期拿出来，都调用（都会执行）
- 如果是对象类型（比如methods、components、watch等），将被合并成一个对象
  - 如果对象的key相同，则会选择组件对象的键值对
  - （理论上合并，都会执行，实际上有冲突还是选择组件对象）



#### Vue插件机制

插件通常用来为 Vue 添加全局功能。插件的功能范围没有严格的限制，一般有下面几种：

1. 添加全局方法或者 property。如：[vue-custom-element](https://github.com/karol-f/vue-custom-element)
2. 添加全局资源：指令/过滤器/过渡等。如 [vue-touch](https://github.com/vuejs/vue-touch)
3. 通过全局混入来添加一些组件选项。如 [vue-router](https://github.com/vuejs/vue-router)
4. 添加 Vue 实例方法，通过把它们添加到 `Vue.prototype` 上实现。
5. 一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 [vue-router](https://github.com/vuejs/vue-router)

而使用插件的操作，需要你在调用 `new Vue`之前实现

```js
// 调用 `MyPlugin.install(Vue)`
Vue.use(MyPlugin)
new Vue({
  // ...组件选项
})
```

`Vue.use` 会自动阻止多次注册相同插件，届时即使多次调用也只会注册一次该插件。

而在use的时候（安装插件的时候），会调用install方法和vue混入机制

```js
export function install (_Vue) {
  if (Vue && _Vue === Vue) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        '[vuex] already installed. Vue.use(Vuex) should be called only once.'
      )
    }
    return
  }
  Vue = _Vue
  applyMixin(Vue)
}
```

在beforeCreate钩子函数前进行混入vuexInit（mixin）

```js
// 混入机制
Vue.mixin({ beforeCreate: vuexInit });

function vuexInit () {
    const options = this.$options
    // store injection
    if (options.store) {
      this.$store = typeof options.store === 'function'
        ? options.store()
        : options.store
    } else if (options.parent && options.parent.$store) {
      this.$store = options.parent.$store
    }
}
```



#### 自定义插件

正常情况下，我们都可以使用组件完成对应的模块功能，使用组件需要

- 1.在模板中引用

- 2.引入模块

- 3.组件的components中声明

但是如果想要在该组件完成固定功能，可能还需要

- 4.声明对应的data

- 5.写入对应的方法

- 6.组件之间传递变量

4、5、6步骤如果放在不同的组件使用一样的功能，可能要声明很多次，这时我们可以使用插件来简化（降低耦合）操作

下面以制作 Toast 自定义插件为例子（冒泡提示插件）

先建立toast组件 

```html
<template>
  <div class="toast" v-show="isShow">
    {{ message }}
  </div>
</template>
<script>
export default {
  name: "Toast",
  data() {
    return {
      message: "",
      isShow: false,
    };
  },
  methods: {
    //duration时间间隔默认2s
    showMessage(message, duration = 2000) {
      this.message = message;
      this.isShow = true;
      setTimeout(() => {
        this.isShow = false;
        this.message = "";
      }, duration);
    },
  },
};
</script>
<style scoped>
</style>
```

在toast组件的文件夹下，新建index.js文件

```js
//引入toast组件
import Toast from "./Toast";
const obj = {};
// 可以选择传进来一个Vue，对Vue对象进行操作
obj.install = function (Vue) {
    // 1.创建组件构造器（在vue外面使用组件就要用到组件构造器）
    const toastConstructor = Vue.extend(Toast);
    // 2.使用new的方式创建组件对象
    const toast = new toastConstructor();
    // 3.将组件对象挂载到某元素上,和组件使用也一样，内部也调用了$mount()进行挂载
    toast.$mount(document.createElement('div'));
    // 4.toast.$el 对应的就是 div 
    document.body.appendChild(toast.$el);
    // 5.设置prototype之后，以后调用插件方法只需要$toast即可
    Vue.prototype.$toast = toast;
}
export default obj
```

在全局的main.js中使用该插件

```js
import toast from "@/components/common/toast"
Vue.use(toast);
```

这时我们就可以再各个组件中直接使用该插件了（此时只需要执行以下代码，即可出现冒泡提示）

```js
this.$toast.showMessage("你想要输入的信息", 2000);  //2000为自定义的时间间隔
```





#### Vue.nextTick

`[Vue.nextTick( [callback, context] )]`

Vue中DOM更新是异步的，而nextTick在**下次 DOM 更新循环结束之后执行延迟回调**。在修改数据之后立即使用这个方法，获取更新后的 DOM。

```js
// 修改数据
vm.msg = 'Hello'
// DOM 还没有更新
Vue.nextTick(function () {
  // DOM 更新了
})

// 作为一个 Promise 使用，如果没有提供回调且在支持 Promise 的环境中，则返回一个 Promise
Vue.nextTick()
  .then(function () {
    // DOM 更新了
  })
```

主要应用：需要注意的是，在 created 和 mounted 阶段，如果需要操作渲染后的视图，也要使用 nextTick 方法。

官方文档说明：

> 注意 mounted 不会承诺所有的子组件也都一起被挂载。如果你希望等到整个视图都渲染完毕，可以用 vm.$nextTick 替换掉 mounted



#### vue图片懒加载

可以使用`vue-lazyload`插件  

```shell
$ npm i vue-lazyload -S
```

（在main.js里）引用时可以传递一些想要的参数，比如加载前的图片显示等

```js
import VueLazyload from 'vue-lazyload'
Vue.use(VueLazyload)
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: errorimage,
  loading: loadimage,
  attempt: 1
})
```

安装和引用之后，将原来的 

` <img :src="img.src" >`    -->   ` <img v-lazy="img.src" >`即可



#### Vue和React

相同之处：

React与Vue存在很多相似之处，例如他们都是JavaScript的UI框架，专注于创造前端的富应用。不同于早期的JavaScript框架“功能齐全”，Reat与Vue只有框架的骨架，其他的功能如路由、状态管理等是框架分离的组件。

Vue.js(2.0版本)与React的其中最大一个相似之处，就是他们都使用了'Virtual DOM'（虚拟DOM），如果需要改变任何元素的状态，那么是先在Virtual DOM上进行改变，而不是直接改变真实的DOM，这样可以减少开销；当有变化产生时，一个新的Virtual DOM对象会被创建并计算新旧Virtual DOM之间的差别。之后这些差别会应用在真实的DOM上。

不同之处：

- React与Vue最大的不同是**模板的编写**。Vue鼓励你去写近似常规HTML的模板（`template`），写起来很接近标准HTML元素，只是多了一些属性，然后用类似于Angular风格的方法去动态输出内容；而React推荐你使用 JSX 来写模板，JSX只是JavaScript混合着XML语法，有部分人使用起来会觉得很畅快。**值得一提的是**，与React一样，Vue在技术上也支持render函数和JSX，但只是不是默认的而已
- 在Vue中，state对象并不是必须的，数据由data属性在Vue对象中进行管理，而Vue提供响应式的数据，当数据改动时，界面就会自动更新；React的数据使用state对象（状态）保存，在React中你需要使用`setState()`方法去更新状态
- （我在观看视频老师对比React and Vue的时候看到的结果（虚拟DOM与DOM Diff 的原理，作者饥人谷，第二集））在测试插入10w个div标签的时候，DOM的原生渲染速度是大概2s；React的速度大概接近30s；Vue竟然是接近原生DOM，1s-3s
- 自我学习感受，React很多操作要比Vue麻烦（可能也是因为不熟练），学习React有扎实的JS基础要求



#### 原生和框架

详情可以见尤大大的答案https://www.zhihu.com/question/31809713/answer/53544875



#### Vue常见性能优化

- 不要把所有数据放在data，data的数据会增加 getter 和 setter，会收集对应的 watcher
- vue在v-for时给每项元素绑定事件需要用事件代理
- SPA采用keep-alive
- 拆分组件，减少耦合度，提高维护度
- 合理分配 v-if 和 v-show
- key保证唯一性
- Object.freeze 冻结数据
- 合理使用路由懒加载
- 尽量采用 runtime运行时版本
- 合理运用防抖节流



## 8.Element

**Element**，一套为开发者、设计师和产品经理准备的基于 Vue 的桌面端组件库

详情可以去官方文档进行学习



#### **Element-ui 的validate方法**

`validate()` 是elment-ui封装好的用于对整个表单进行验证，若不传入回调函数，则会返回以promise

=> `Function(callback : Function(boolean,obj))`，当第一个参数位true，则校验通过



#### Element组件时样式修改的问题

通常在vue组件样式中添加**scoped**，该组件样式只能够在本组件才能执行，这样我们就无法更改Element组件样式了。

如果我们取消了**scoped**的话，全局的样式有可能就会发生**冲突**。

解决方法是：

- 如果使用style修改样式，可以添加 `>>>`的前缀
- 如果使用sass或者less修改样式，可以添加`/deep/`的前缀

思路提供：https://zhuanlan.zhihu.com/p/58942147



## 9.原理相关

#### 双向绑定

`Object.defineProperty( )`的 `get` （读取属性值触发的函数）和 `set`（set就是在设置属性值触发的函数），所以Vue会根据数据变化，重新渲染到虚拟DOM，然后根据虚拟DOM，把真实DOM进行修改

`Object.defineProperty(对象名, 属性名, desciptor)` 

```js
Object.defineProperty(obj, key, {
	set(newValue) {
		console.log("监听" + key + "改变");
		value = newValue;
	},
	get() {
		console.log("获取" + key + "的值");
		return value;
	}
})
```

`Object.freeze()`会阻止修改现有的 property，也意味着响应系统无法再追踪双向绑定变化。



当数据发生改变，Vue是如何通知哪一部分发生刷新？(`set() {}` 里面该如何进行操作？)

##### 发布订阅者模式

```js
// 发布者类
class Dep {
    constructor() {
        // 用于存储订阅者的数组
        this.subs = [];
    }
    // 增加订阅者方法
    addSub(watcher) {
        this.subs.push(watcher);
    }
    // 调用之后，每个订阅者都会进行更新
    notify(){
        this.subs.forEach(item => {
            item.update()
        })
    }
}
// 订阅者类
class Watcher {
    constructor(name) {
        this.name = name;
    }
    update(){
        console.log(this.name, "发生更新");
    }
}
const dep = new Dep();
const watcher1 = new Watcher("item1");
const watcher2 = new Watcher("item2");
const watcher3 = new Watcher("item3");
dep.addSub(watcher1);
dep.addSub(watcher2);
dep.addSub(watcher3);
dep.notify();
```

data中每一个属性，都添加一个发布者类（new 一个 发布者实例）

谁通过 `get(){}`对数据进行获取，则对其添加订阅者类（new 一个 订阅者实例），然后将订阅者push进发布者的subs数组中

当数据发生修改，即触发 `set(){}`函数，在里面使用notify： `set(){ dep.notify(); }` 让所有订阅者随之发生更新（调用了所有订阅者的update方法）

（实际上watcher有很多种，正常的data属性的渲染页面watcher（下面这个）、computed的watcher、watch（用户自定义）的watcher）

![](/simple-blog/Vue(下)/vue_origin.png)



Observer：每个属性创建一个Dep对象（发布者），若data数据发生改动，则调用Dep对象的notify方法

Compile：解析el中的指令，每次使用到data的数据，就创建一个Watcher（订阅者），然后加入到该属性对应的发布者



##### Vue2.0双向绑定的缺点

1.必须在 `data` 对象上存在才能让 Vue 将它转换为响应式的

```js
var vm = new Vue({
  data:{
    a:1
  }
})
// `vm.a` 是响应式的
vm.b = 2
// `vm.b` 是非响应式的
```

2.若原来属性不存在，对象新增属性，Vue也检测不到

3.Vue 不能检测以下数组的变动：

- 1.当你利用**索引**直接设置一个数组项时，例如：`vm.items[indexOfItem] = newValue`（但是Vue提供了API进行重写，还重写了数组方法）

- 2.当你修改数组的**长度**时，例如：`vm.items.length = newLength`

  上述数组的改变无法检测得到，使用Vue.set()才能新增一个属性

实际上尤大已经回答了，是考虑到性能原因，才不用Object.defineProperty 对对象属性进行监听

4.还有个小缺陷，就是默认会递归，递归你data里的属性，可能导致性能不高



**注意** 2020年后 Vue3.0已经换成用proxy代理了 



#### 手写日常版发布订阅者模式

```js
class EventBus {
  map = {} 
  //如果有人发布了该消息名type则进行回调
  on(type, handler) {
    this.map[type] = (this.map[type] || []).concat(handler)
  }
  //发送消息
  emit(type, data) {
    this.map[type] && this.map[type].forEach(handler => handler(data))
  }
  //取消订阅
  off(type, handler) {
    if(this.map[type]) {
      if(!handler) {
        delete this.map[type]
      } else {
        let index = this.map[type].indexOf(handler)
        this.map[type].splice(index, 1)
      }
    }
  }
}
```

或者

```js
class EventBusClass {
    constructor() {
        this.eventMap = {};
    }

    on(eventName, callback) {
        const cbs = this.eventMap[eventName] || [];
        if (cbs.indexOf(callback) === -1) {
            cbs.push(callback);
        }
        this.eventMap[eventName] = cbs;
    }

    off(eventName, callback = null) {
        const cbs = this.eventMap[eventName];
        if (!cbs) return;

        if (callback) {
            const idx = cbs.indexOf(callback);
            if (idx !== -1) {
                cbs.splice(idx, 1);
            }
            this.eventMap[eventName] = cbs;
        } else {
            this.eventMap[eventName] = undefined;
        }
    }

    emit(eventName, ...args) {
        const cbs = this.eventMap[eventName] || [];
        if (!cbs) return;

        cbs.forEach((cb) => cb.apply(this, args));
    }
}
```



```js
const eventBus = new EventBus()

eventBus.on('click:btn', data => {
  console.log(data)
})

eventBus.emit('click:btn', {a: 1, b: 2})
eventBus.off('click:btn')
eventBus.emit('click:btn', {a: 1, b: 2})
```





#### Vue原理小知识

**Vue检测数组中的变化**

我们都知道数组有push、shift、pop这些方法

而Vue对data里数组的原型方法（prototype）进行了重写，`__proto__`指向新的原型对象， 通过原型链定义函数，这样的话我们就可以在其中设置响应式（原来的函数.apply   +   调用更新视图方法 `notify()`）

然后，利用`observer`对数组里的每一项进行监控

**Vue采用异步渲染**

为何Vue采用异步渲染（数据）？

- 防止一更改数据就更新视图 ，多个数据发生更改后，可以先过滤掉同一个订阅者（内置di，根据id过滤同一watcher，即不用导致watcher进行多次update），提高性能





#### 虚拟DOM

DOM实际操作是挺快的，任何基于DOM的库（Vue/React）都不可能操作DOM时比DOM快

虚拟DOM：一个能代表DOM树的对象，通常含有标签名、标签上属性、事件监听和子元素们，以及其它属性

在控制台上打印可以看得出它是一个对象，它对比真实DOM更加轻量级，使用 `debugger`可以在浏览器的 Sources 看得到它的属性对比真实DOM少得多，它最终会被Vue / React 转化为真实DOM，呈现在页面上

为什么虚拟DOM比真实DOM快？

- 减少DOM操作：可以将多次DOM操作合并为一次操作，比如添加100个节点原来是一个一个添加，现在是一次性添加，减少浏览器回流
- 虚拟DOM借助DOM diff 可以把多余的操作省略掉，比如如果它发现有一些节点已经在页面里，就不选择更新，只更新不一样的部分（比如上面“虚拟DOM渲染特殊案例”提及到的）
- 跨平台，虚拟DOM不仅可以变成DOM，还可以变成小程序、ios应用、安卓应用，因为虚拟DOM本质上只是一个JS对象

![](/simple-blog/Vue(下)/visualDOM.png)

（图片源自饥人谷）

创建虚拟DOM（原始方法）（分别对应React和Vue）

（将 `h` 作为 `createElement` 的别名是 Vue 生态系统中的一个通用惯例，实际上也是 JSX 所要求的）

![](/simple-blog/Vue(下)/visualDOM2.png)

虚拟DOM的缺点：需要额外创建函数，如createElement或h，但是有解决方法，如下：（通过babel、vue-loader转换）

现在创建DOM的方法：

![](/simple-blog/Vue(下)/visualDOM3.png)

虽然克服了虚拟DOM的缺点，但是新增了另外一个缺点，也就是严重依赖打包工具！！

但其实当规模比较合理的时候，比如几千的时候，使用虚拟DOM是很好的，他可以通过算法优化很多多余的操作，但是当规模大到一定的程度，10w以上等等，在这个情况下原生DOM能保持稳定性，而React就崩了（我在Vue和React的对比里面提及到）



#### DOM diff

diff就是一个函数，我们称之为`patch`；

`pathces= patch(oldVNode, newVNode)`，分别对应旧节点和新节点，patches就是运行的DOM操作

把虚拟DOM想象成树型，让新的虚拟DOM和旧的虚拟DOM进行对比

只更新不一样的部分（比如上面“虚拟DOM渲染特殊案例”提及到的）

- Tree diff逐层对比，查看哪里需要更新；看节点（Element diff）/组件（Component diff），查看标签名/组件类型

- 若标签类型没变，只更新div对应的DOM属性，变了的话直接替换 / 删除
- 若没有发生替换或者删除的话，进入标签后代/深入组件  后继续做 Tree  diff 递归

但DOM diff也有 bug

![](/simple-blog/Vue(下)/DOMdiff.png)

更新的时候，直接看第一个children， 把 hello -> world，然后再删除掉原来的 `span -> world`；而不是直接删除掉hello的children

所以我个人理解

优点就是：复用性提高；

缺点就是由于diff算法，导致了实际上比较简便的操作变得复杂了（可以使用key避免）

时间复杂度：两棵树的diff时间复杂度为O(n^3)，但是Vue优化了（双指针），O(n^3) -> O(n)，即4个指针分别指向新节点头，新节点尾、旧节点头、旧节点尾，两两进行比较



#### 虚拟DOM渲染特殊案例

这里在输入input数据之后，再点击切换按钮，会出现另外一个input框内仍保留之前输入的数据的情况

这是因为Vue在进行DOM渲染的时候，会先把所有元素标签通过一个虚拟DOM（virtual DOM）放到内存里，然后再渲染到浏览器上；所以出于性能考虑，会尽可能复用已经存在的元素，而不是创建新元素；复用的时候对比每个层级，把修改之后的套在原来的元素上（比如属性类型，属性id等）

在以下的案例中，Vue内部会发现原来的input元素不再使用，直接作为else中的input来使用（类似于让现任穿前任的衣服）

也就是说，在第一个`input`输入字符，然后“切换类型”，转为第二个`input`后，你依旧可以看到刚才输入的字符

解决方法：增加key属性，作为唯一的标识，key不同不进行复用 ` <input type="text" placeholder="用户名" key="username">`

```html
<div id="app">
    <div v-if="loginType">
        <label for="email">用户邮箱</label>
        <input type="text" placeholder="用户邮箱">
    </div>
    <div v-else>
        <label for="nickname">用户名</label>
        <input type="text" placeholder="用户名">
    </div>
    <button @click="loginType=!loginType">切换类型</button>
</div>
<script src="./js/vue.js"></script>
<script>
    const app = new Vue({
        el: '#app',
        data: {
            loginType: true
        }
    });
```
