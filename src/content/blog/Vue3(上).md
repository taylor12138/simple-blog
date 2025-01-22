---
title: 'Vue3(上)'
author: Hello
pubDate: 2021-11-05
categories: 前端
description: 'Vue3相关'
---

## 1.Vue3 Start

他在介绍中表明的是：

- 更小、更快、更易维护，一些命令的变化。
- 3.0 新加入了 TypeScript 以及 PWA 的支持
- 支持了 `composiiton` API
- `vdom`的对比算法更新，只更新绑定了动态数据部分
- 单独功能可以抽离 取代了mixin（尤雨溪作者本人指出minxin模块来源不清晰、命名问题、性能开销问题）

**源码改动**

它的源码是通过monorepo的形式管理源代码的

- Mono单个
- Repo：repository仓库
- 主要是将许多项目的代码存储在同一个repository仓库中，，这样的话可以让多个包相互独立的同时，又在同一个仓库下管理

使用TypeScript进行代码重写

**性能改动**

- 使用Proxy进行数据劫持，这也在之前做Vue2笔记的时候提及过，避免了很多索引类的bug
- 删除了一些没必要的API，如$on、$off、$once等，删除了一些特性，如filter、内联模板等
- 编译优化，生成block tree、Slot编译优化、diff算法优化

**新的API**

Options API -> Composition API

使用Hooks函数增加代码的复用性

- 在Vue2的时候也是因为Options和mixins相互关联，多个mixins还有命名冲突问题



#### 基础语法

基础语法和Vue2大致相同，除了

原来

```js
const app = new Vue({})
```

变成了

```js
const app = Vue.createApp({})
```



#### 查看源码

（2021/11/6），在官网`git clone`项目，使用pnpm下载依赖，使用 `yarn dev`打包出文件进行调试，然后在项目下引用这个打包好的包（/dist/vue.global.js）即可

可以在webpack的设置里面

```json
"scripts": {
    "dev": "node scripts/dev.js --sourcemap",
    //...
}
```

此时再次打完包之后会在dist下出现一个 `vue.global.js.map` 文件，此时调试代码的时候 进行 `step into next function`可以跳转到达文件夹而非打包文件下对应的方法

注意：需要在chrome的setting里设置 `Enable JavaScript source map`

阅读源码推荐的插件：vscode的拓展插件bookmarks，然后control + option + k 键即可标记当前函数，以后方便在拓展中直接找到（还能明明标记名称）；重复 `control + option + k `键可以取消



## 2.回顾Vnode

VNode全称Virtual Node，也就是虚拟节点（VNode Tree组成虚拟DOM）；在Vue中无论大大小小元素都可以在Vue中被VNode表示出来，

类似如下

```js
const vnode = {
    type: "div",
    props: {
        class: "title"
    },
    children: "hello world"
}
```

它本质上是一个对象，作为一个对象而未转化为DOM，最大的好处在于多平台的适配



#### diff

参考：[聊聊 Vue 的双端 diff 算法](https://mp.weixin.qq.com/s/mFGT6szPzYuCaz1Rgvt9TQ)

旧的diff流程：

- 使用key复用旧节点，**通过移动节点代替创建。**但是比如处理到第二个新的 vnode，发现它在旧的 vnode 数组中的下标为 4，说明本来就是在后面了，那就不需要移动了。反之，如果是 vnode 查找到的对应的旧的 vnode 在当前 index 之前才需要移动

  比如节点：ABCD -> DABC，移动的是ABC，移动3次

- 新的 vnode 数组全部处理完后，旧的 vnode 数组可能还剩下一些不再需要的，那就删除掉



Vue2的diff流程：

双端 diff

![](/Vue3(上)/diff1.png)

- 头和尾的指针向中间移动，直到 oldStartIdx <= oldEndIdx 并且 newStartIdx <= newEndIdx，说明就处理完了全部的节点。

  每次对比下两个头指针指向的节点、两个尾指针指向的节点，头和尾指向的节点，是不是 key是一样的，也就是可复用的。

```js
while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
  if (oldStartVNode.key === newStartVNode.key) { // 头头
    patch(oldStartVNode, newStartVNode, container)
    oldStartVNode = oldChildren[++oldStartIdx]
    newStartVNode = newChildren[++newStartIdx]
  } else if (oldEndVNode.key === newEndVNode.key) {//尾尾
    patch(oldEndVNode, newEndVNode, container)
    oldEndVNode = oldChildren[--oldEndIdx]
    newEndVNode = newChildren[--newEndIdx]
  } else if (oldStartVNode.key === newEndVNode.key) {//头尾，需要移动
    patch(oldStartVNode, newEndVNode, container)
    insert(oldStartVNode.el, container, oldEndVNode.el.nextSibling)

    oldStartVNode = oldChildren[++oldStartIdx]
    newEndVNode = newChildren[--newEndIdx]
  } else if (oldEndVNode.key === newStartVNode.key) {//尾头，需要移动
    patch(oldEndVNode, newStartVNode, container)
    insert(oldEndVNode.el, container, oldStartVNode.el)

    oldEndVNode = oldChildren[--oldEndIdx]
    newStartVNode = newChildren[++newStartIdx]
  } else {
    
    // 头尾没有找到可复用的节点
    // 那就在旧节点数组中找，找到了就把它移动过来，并且原位置置为 undefined。没找到的话就插入一个新的节点。
  }
}
```

如果旧 vnode 的尾节点是新 vnode 的头结点，那就要把它移动到旧 vnode 的头结点的位置。

此时减少了节点移动次数



vue3的diff做了一点优化，它借鉴于Inferno、ivi框架

对于diff算法来说，如果列表中有key，则执行 `patchKeyedChildren`方法；没有 key，执行 `patchUnkeyedChildren`方法

`patchUnkeyedChildren`函数：取较短的节点进行遍历，一一对比（patch），如果不是之前的节点，就直接变，不会复用，少了就mount，多了就删除

`patchKeyedChildren`函数：从头开始while循环，让节点进行对比，节点类型不同直接break；

1. 然后从头尾双端开始while，让头节点、尾节点进行对比，相同继续循环，不同直接跳出循环；（对应下面的1、2）
2. 然后判断是否新增节点，在当前子序列适当位置插入，拿一个null和新节点进行patch，挂载一个新的节点；（对应下面的3）

3. 然后再判断如有仍残留旧节点，则进行删除（unmount）；（对应下面的4）

4. 最后处理中间乱序的节点，新建一个map哈希表，以key和节点作为键值对存储，使用key进行匹配、对比，确定**最长连续的子序列**，然后对新节点数组进行移动/删除/增加（对应下面5）

详情可以看这个[解析](https://juejin.cn/post/7277026974005608483?searchId=202310172028128AFC1DC4F3762D1D8C0A#heading-9)

尤大还很贴心，源码的注释比较明了

```js
let i = 0
const l2 = c2.length
let e1 = c1.length - 1 // prev ending index
let e2 = l2 - 1 // next ending index

// 1. sync from start
// (a b) c
// (a b) d e
while (i <= e1 && i <= e2) {
  const n1 = c1[i]
  const n2 = (c2[i] = optimized
              ? cloneIfMounted(c2[i] as VNode)
              : normalizeVNode(c2[i]))
  if (isSameVNodeType(n1, n2)) {
    //...
    //patch n1,n2
  } else {
    break
  }
  i++
}

// 2. sync from end
// a (b c)
// d e (b c)
while (i <= e1 && i <= e2) {
  const n1 = c1[e1]
  const n2 = (c2[e2] = optimized
              ? cloneIfMounted(c2[e2] as VNode)
              : normalizeVNode(c2[e2]))
  if (isSameVNodeType(n1, n2)) {
    //...
    //patch n1,n2
  } else {
    break
  }
  e1--
  e2--
}

// 3. common sequence + mount
// (a b)
// (a b) c
// i = 2, e1 = 1, e2 = 2
// (a b)
// c (a b)
// i = 0, e1 = -1, e2 = 0
if (i > e1) {
  if (i <= e2) {
    const nextPos = e2 + 1
    const anchor = nextPos < l2 ? (c2[nextPos] as VNode).el : parentAnchor
    while (i <= e2) {
      patch(
        null,
        (c2[i] = optimized
         ? cloneIfMounted(c2[i] as VNode)
         : normalizeVNode(c2[i])),
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      )
      i++
    }
  }
}

// 4. common sequence + unmount
// (a b) c
// (a b)
// i = 2, e1 = 2, e2 = 1
// a (b c)
// (b c)
// i = 0, e1 = 0, e2 = -1
else if (i > e2) {
  while (i <= e1) {
    unmount(c1[i], parentComponent, parentSuspense, true)
    i++
  }
}

// 5. unknown sequence
// [i ... e1 + 1]: a b [c d e] f g
// [i ... e2 + 1]: a b [e d c h] f g
// i = 2, e1 = 4, e2 = 5
else {
  const s1 = i // prev starting index
  const s2 = i // next starting index

  // 5.1 build key:index map for newChildren
  const keyToNewIndexMap: Map<string | number | symbol, number> = new Map()
  for (i = s2; i <= e2; i++) {
    const nextChild = (c2[i] = optimized
                       ? cloneIfMounted(c2[i] as VNode)
                       : normalizeVNode(c2[i]))
    if (nextChild.key != null) {
      if (__DEV__ && keyToNewIndexMap.has(nextChild.key)) {
        warn(
          `Duplicate keys found during update:`,
          JSON.stringify(nextChild.key),
          `Make sure keys are unique.`
        )
      }
      keyToNewIndexMap.set(nextChild.key, i)
    }
  }

  // 5.2 loop through old children left to be patched and try to patch
  // matching nodes & remove nodes that are no longer present
  let j
  let patched = 0
  const toBePatched = e2 - s2 + 1
  let moved = false
  // used to track whether any node has moved
  let maxNewIndexSoFar = 0
  // works as Map<newIndex, oldIndex>
  // Note that oldIndex is offset by +1
  // and oldIndex = 0 is a special value indicating the new node has
  // no corresponding old node.
  // used for determining longest stable subsequence
  const newIndexToOldIndexMap = new Array(toBePatched)
  for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0

  for (i = s1; i <= e1; i++) {
    const prevChild = c1[i]
    if (patched >= toBePatched) {
      // all new children have been patched so this can only be a removal
      unmount(prevChild, parentComponent, parentSuspense, true)
      continue
    }
    let newIndex
    if (prevChild.key != null) {
      newIndex = keyToNewIndexMap.get(prevChild.key)
    } else {
      // key-less node, try to locate a key-less node of the same type
      for (j = s2; j <= e2; j++) {
        if (
          newIndexToOldIndexMap[j - s2] === 0 &&
          isSameVNodeType(prevChild, c2[j] as VNode)
        ) {
          newIndex = j
          break
        }
      }
    }
    if (newIndex === undefined) {
      unmount(prevChild, parentComponent, parentSuspense, true)
    } else {
      newIndexToOldIndexMap[newIndex - s2] = i + 1
      if (newIndex >= maxNewIndexSoFar) {
        maxNewIndexSoFar = newIndex
      } else {
        moved = true
      }
      patch(
        prevChild,
        c2[newIndex] as VNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      )
      patched++
    }
  }

  // 5.3 move and mount
  // generate longest stable subsequence only when nodes have moved
  const increasingNewIndexSequence = moved
  ? getSequence(newIndexToOldIndexMap)
  : EMPTY_ARR
  j = increasingNewIndexSequence.length - 1
  // looping backwards so that we can use last patched node as anchor
  for (i = toBePatched - 1; i >= 0; i--) {
    const nextIndex = s2 + i
    const nextChild = c2[nextIndex] as VNode
    const anchor =
          nextIndex + 1 < l2 ? (c2[nextIndex + 1] as VNode).el : parentAnchor
    if (newIndexToOldIndexMap[i] === 0) {
      // mount new
      patch(
        null,
        nextChild,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        isSVG,
        slotScopeIds,
        optimized
      )
    } else if (moved) {
      // move if:
      // There is no stable subsequence (e.g. a reverse)
      // OR current node is not among the stable sequence
      if (j < 0 || i !== increasingNewIndexSequence[j]) {
        move(nextChild, container, anchor, MoveType.REORDER)
      } else {
        j--
      }
    }
  }
}
```



#### render的优化

1.对于不会改动的静态节点，会进行作用域的提升

2.只对动态的节点进行diff算法（将动态的节点的数据放入dynamicChildren，diff的时候执行`patchBlockChildren`函数）

```html
<template>
    <div>Allen</div>
    <div>Allen</div>
    <div>{{message}}</div>
    <button @click="changeMessage">修改</button>
</template>
```

```typescript
function anonymous{
    //静态节点
    const _hoisted_1 =/*#_PURE_*/createVNode( "div", null,"Allen",-1/* HOISTED */);
    const _hoisted_2 =/*#_PURE_*/createNode ("h2" ,null,"Allen" , -1/* HOISTED */);
    return function render(_ctx, _cache){
        with (_ctx) {
            const { createVNode: _createWNode, toDisplayString: _toDisplayString, Fragment:_Fragment, openBlock: _openBlock, createBlock:_createBlock} = _cache;
            return (_openBlock(), _createBlock(_Fragment,null,[
                _hoisted_1,
                _hoisted_2,
                _createVode("p",null，_toDisplayString(message)，1,/* TEXT*/),
                _createVNode( "button", i oncClick: changeMessage }，"修改" , 8 /* PROPS */，[ "onClick"1)],64/*STABLE_FRAGMENT */))
        }
    }
}
```



## 3.API对于2.x的改动

#### 全局API

调用 `createApp` 返回一个*应用实例*，一个 Vue 3 中的新概念。

许多原本 `Vue.xxx`的操作，现在是通过 `const app = Vue.createApp({})`创建实例，，然后变成了 `app.xxx`

| 2.x 全局 API               | 3.x 实例 API (`app`)                       |
| -------------------------- | ------------------------------------------ |
| Vue.config                 | app.config                                 |
| Vue.config.productionTip   | *移除*                                     |
| Vue.config.ignoredElements | app.config.compilerOptions.isCustomElement |
| Vue.component              | app.component                              |
| Vue.directive              | app.directive                              |
| Vue.mixin                  | app.mixin                                  |
| Vue.use                    | app.use                                    |
| Vue.prototype              | app.config.globalProperties                |
| Vue.extend                 | *移除*                                     |



#### template

原来Vue2.x中只允许有一个根元素（一般为div）

Vue3.x以上，允许template有多个根元素，且允许不需要div标签进行包裹，从源码可以知道，如果有多个根元素，则他会在最外层给你多加一层 `Fragment`

option API - > Composition API

并且 在 Vue 2.x 中，当挂载一个具有 `template` 的应用时，被渲染的内容会替换我们要挂载的目标元素。在 Vue 3.x 中，被渲染的应用会作为子元素插入，从而替换目标元素的 `innerHTML`。

**Vue2.x**

```js
app.$mount('#app')
```

```html
<body>
  <div id="app">
    Some app content
  </div>
</body>
```

```html
<body>
  <div id="rendered">Hello Vue!</div>
</body>
```



**Vue3**

```js
app.mount('#app')
```

```html
<body>
  <div id="app" data-v-app="">
    <div id="rendered">Hello Vue!</div>
  </div>
</body>
```



#### data选项

组件选项 `data` 的声明不再接收纯 JavaScript `object`，而是接收一个 `function`（只接收 funciton 形式了）。



#### 子组件emit

Vue 3 现在提供一个 `emits` 选项，和现有的 `props` 选项类似。这个选项可以用来定义一个组件可以向其父组件触发的事件。

和 prop 类似，现在可以通过 `emits` 选项来定义组件可触发的事件：

```vue
<template>
  <div>
    <子组件 @accepted="listener">OK</button>
  </div>
</template>
```

```vue
<template>
  <div>
    <p>{{ text }}</p>
    <button @click="increment">OK</button>
  </div>
</template>
<script>
  export default {
    props: ['text'],
    emits: ['accepted'],
    methods: {
        increment() {
            this.$emit('accepted', '参数')
        }
    }
  }
</script>
```

该选项也可以接收一个对象，该对象允许开发者定义传入事件参数的验证器，和 `props` 定义里的验证器类似。

emit的对象写法，一般针对于将传递给父组件的参数进行验证，如果false，则vue会报一个警告（但是参数还是会传过去）

```js
export default {
    emits: {
    	add: null, //不需要传参数
        addn: (payload1, payload2) => { //有俩参数
            if (payload1 < 10) return false;
            return true;
        }
    }
}
```



#### keep-alive内置组件

可以传入数组类的值作为include、exclude属性

- `include` - `string | RegExp | Array`。只有名称匹配的组件会被缓存。

- `exclude` - `string | RegExp | Array`。任何名称匹配的组件都不会被缓存。
- `max` - `number | string`。最多可以缓存多少组件实例。

```html
<keep-alive include="a,b">
    <component :is="componentId"></component>
</keep-alive>
<keep-alive :include="/a|b/">
    <component :is="componentId"></component>
</keep-alive>
<keep-alive :include="[a,b]">
    <component :is="componentId"></component>
</keep-alive>
```



#### 异步组件

Vue3中使用异步组件可以导入内置的 `defineAsyncComponent`

它接受两种参数

- 类型一工厂函数，该工厂函数需要返回一个Promise对象

  - ```js
    import {defineAsyncComponent} from vue;
    // 此时vue打包时会将该异步组件单独打包到另外一个js文件里
    const AsyncComponent = defineAsyncComponent(() => import('./AsyncTest.vue'))
    ```

- 接受一个对象类型，对异步函数进行配置

  - ```js
    const AsyncComponent = defineAsyncComponent({
      loader: () => import('./AsyncTest.vue'),
      loadingComponent: Loading,  //加载时占位的组件
    })
    ```



#### 组件的v-model

在 3.x 中，自定义组件上的 `v-model` 相当于传递了 `modelValue` prop 并接收抛出的 `update:modelValue` 事件：

```html
<ChildComponent v-model="pageTitle" />

<!-- 是以下的简写: -->

<ChildComponent
  :modelValue="pageTitle"
  @update:modelValue="pageTitle = $event"
/>
```

子组件则相对处理

```vue
<template>
  <div>
    I am Son
    <input type="text" :value="modelValue" @input="changeInput" />
  </div>
</template>
<script>
export default {
  props: {
    modelValue: String,
  },
  emit: ["update:modelValue"],
  methods: {
    changeInput(event) {
      this.$emit("update:modelValue", event.target.value);
    },
  },
};
</script>
```



当然也可以使用computed，以计算属性关联数据的设置和获取，子组件直接通过v-model绑定computed，一种更优雅的方式

```vue
<template>
  <div>
    I am Son
    <input type="text" v-model="value" />
  </div>
</template>

<script>
export default {
  props: {
    modelValue: String,
  },
  emit: ["update:modelValue"],
  computed: {
    value: {
      set(value) {
        this.$emit("update:modelValue", value);
      },
      get() {
        return this.modelValue;
      },
    },
  },
};
</script>
```

> 值得注意的是，如果v-model传进去的值是一个对象，而对象里面属性值发生改变的时候，子组件的computed并不能及时emit发送消息到父组件进行更改，而是直接修改props，从而让我们“看到”父组件的对象的属性值修改以后的样子，所以这种方法面对对象类型的props时，是无用的！！！！！！

##### 组件v-model注意事项

```html
<!-- 父组件传入的pageObj是一个对象 -->
<child-component v-model="pageObj" />
```

```vue
<template>
  <div>
    I am Son
    <input type="text" v-model="value" />
  </div>
</template>

<script>
export default {
  props: {
    modelValue: Object,
  },
  emit: ["update:modelValue"],
  computed: {
    value: {
      set(newvalue) {
        this.$emit("update:modelValue", newvalue);
      },
      get() {
        return this.modelValue.value;
      },
    },
  },
};
</script>
```

实际上相当于

```vue
<template>
  <div>
    I am Son
    <input type="text" v-model="modelValue.value" />
  </div>
</template>

<script>
export default {
  props: {
    modelValue: Object,
  }
};
</script>
```



而面对复杂数据类型v-model的**解决方案**为

方案一：子组件使用ref包裹浅拷贝 + watch监听，向父组件发送事件

```ts
export default defineComponent({
  props: {
    modelValue: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props, { emit }) {
    const FormField = ref({ ...props.modelValue })
    watch(
      FormField,
      (newValue) => {
        emit('update:modelValue', newValue)
      },
      {
        deep: true
      }
    )
    return {
      FormField
    }
  }
})
```

而此时父组件修改这个props时要这样修改才有效

```vue
<template>
	<child-component v-model="pageObj" />
</template>

<script lang="ts">
//...
export default defineComponent({
  props: {
    FormItems: {
      type: Array as PropType<IFormItem[]>,
      require: true
    }
  },
  setup(props) {
    const originField: any = {}
    // 动态获取FormField属性名
    const arr = props.FormItems || []
    for (const item of arr) {
      const field = item.field
      originField[field] = ''
    }
    // 表单field数据, 这里用ref是因为reactive在v-model使用双向绑定的时候有可能会有些问题
    const FormField = ref(originField)

    // 重置函数（修改props）
    const ResetHandle = () => {
      for (const key in FormField.value) {
        FormField.value[key] = originField[key]
      }
        //FormField.value = originField  打咩，无效更改，子组件无法响应
    }

    return {
      FormField,
      ResetHandle
    }
  },
  components: {
    ChildComponent
  }
})
</script>
```

方案二：子组件直接不使用v-model，直接用值来绑定就好了（更容易理解）

对input使用v-bind分批绑定，然后input里面的修改使用事件监听 + 发送事件到父组件那边

```html
<!-- 子组件: -->

<el-input
  :modelValue=""
  @update:modelValue="事件处理"
/>
```



##### **自定义v-model**

如果想要在一个子组件上绑定多个v-model，则可以使用 `v-model:自定义名称="xx"`来定义其他绑定的属性名称

此时子组件通过 `props: {`  `自定义名称: String,` `},`来接收，通过 `this.$emit('update:自定义名称', value)`方法来发送监听事件参数

示例：

父组件

```html
<child v-model="message" v-model:title="title" />
```

子组件

```vue
<template>
  <div>
    I am Son
    <input type="text" v-model="value" />
    <input type="text" v-model="value2" />
  </div>
</template>

<script>
export default {
  props: {
    modelValue: String,
    title: String,
  },
  emit: ["update:modelValue", "update:title"],
  computed: {
    value: {
      set(value) {
        this.$emit("update:modelValue", value);
      },
      get() {
        return this.modelValue;
      },
    },
    value2: {
      set(value) {
        this.$emit("update:title", value);
      },
      get() {
        return this.title;
      },
    },
  },
};
</script>
```



#### h()函数

Vue推荐绝大多数情况下使用template模板创建你的HTML，如果一些场景你真的需要JavaScript的完全编程能力，这时候你可以使用渲染函数，他比模板更接近编译器

可以理解为 template（经过compile） -> render -> vnode，此时我们直接写render，过程可以在Vue(中)的脚手架部分的runtime only看到

h函数

- 用于创建一个vnode的函数
- 其实原名为createVNode函数，但是为了简便在Vue简称为h函数

参数传入：

```js
// @returns {VNode}
h(
    // {String | Object | Function} tag
    // 一个 HTML 标签名、一个组件、一个异步组件、或
    // 一个函数式组件。
    //
    // 必需的。
    'div',

    // {Object} props
    // 与 attribute、prop 和事件相对应的对象。
    // 这会在模板中用到。
    //
    // 可选的。
    {},

    // {String | Array | Object} children
    // 子 VNodes, 使用 `h()` 构建,
    // 或使用字符串获取 "文本 VNode" 或者
    // 有插槽的对象。
    //
    // 可选的。
    [
        'Some text comes first.',
        h('h1', 'A headline'),
        h(MyComponent, {
            someProp: 'foobar'
        })
    ]
)
```

总结就是：1.标签 | 组件，2. 属性， 3. 子组件 | 子标签

注意：如果没有props（属性），可以将子组件作为第二个传入；而如果会产生歧义，则将null作为第二个参数传入

```js
import { h } from "vue";
export default {
  render() {
    return h(
      "div",
      {
        class: "app",
      },
      "hello Render"
    );
  },
};
```



**在setup中替代h函数**

在setup函数的返回值替换成一个函数，函数返回值为h函数

```js
setup() {
    const count = ref(0);
    return () => {
      return h("div", { class: "app" }, [
        h("h2", null, `当前计数${count.value}`),
        h(
          "button",
          {
            onClick: () => count.value++,
          },
          "+"
        ),
        h(
          "button",
          {
            onClick: () => count.value--,
          },
          "-"
        ),
        h(Child, null, ""),
      ]);
    };
  },
```



#### 使用JSX

和h函数同理，只不过在render函数中写成jsx形式

```js
export default {
  render() {
    return <h1>hello world</h1>;
  },
};
```



#### 生命周期

`beforeDestroy` -> `beforeUnmount`

`destroyed` -> `unmounted`



setup函数执行 -> applyOptions调用（beforeCreate、Created生命周期函数调用）-> 剩下的生命周期转换成setup的API（`onBeforeMount`、`onMounted`）

对于beforeMount之后的生命周期函数，其中beforexxx的生命周期函数，都是立即调用，而xxx的生命周期函数，则放入队列，等到该周期完毕之后，再`flushPostFlushCbs`刷新队列，执行函数

所以setup执行时机比beforeCreate生命周期还早！



#### 路由使用

若在搭建脚手架时没有安装，则需要手动安装vue路由管理

```shell
npm i vue-router@next
```

原本导出路由：

```js
import Router from 'vue-router'
import Vue from 'vue'
Vue.use(Router);
const routes = [];
const router = new Router({
    routes
})
export default router;
```

现在同`createApp`，导出单个方法`createRouter`

而模式的选择也不是之前使用字符串的形式对mode属性赋值，而要导入 createWebHistory、createWebHashHistory

```js
import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
const router = createRouter({
    routes,
    history: createWebHistory();
})
export default router;
```

然后在main.js中

```js
//...
import router from './router'
const app = createApp(App)
app.use(router);
app.mount('#app');
```

而 `router-view`、`router-link`的使用同之前vue2.x一样



**router-link**

`v-slot` API (Vue Router3.1.0 新增)

router-link的插槽slot，同样可以使用作用域插槽，但是它的插槽自定义props对象其中有包含了一些属性

- props: href 跳转的链接
- props: route route对象
- props: navigate导航函数，需要配合custom属性使用
- props: isActive 是否当前处于活跃状态

```html
<router-link to="/home" v-slot="props">
    <h2>{{ props.href }}</h2>
</router-link>
<router-view />
```



**router-view**

`v-slot` API (Vue Router3.1.0 新增)

```html
<!-- 通过props.Component得到目前渲染出来的组件 -->
<!-- 此时通过component拿到对应的组件，然后就可以放入transition / keep-alive 中，使用动画 / 缓存了 -->
<router-view v-slot="props">
    <transition name="allen">
        <keep-alive>
            <component :is="props.Component"></component>
        </keep-alive>
    </transition>
</router-view>
```



#### 动态添加路由

有时候一些应用场景需要我们去动态添加路由，而不是一开始将routes写死，我们可以使用 `router.addRoute`

`addRoute(route: RouteConfig): () => void`  添加一条新路由规则

`addRoute(parentName: string, route: RouteConfig): () => void` 添加一条新的路由规则记录作为现有路由的子路由

```js
const routes = [];
const router = createRouter({
    routes,
})
if(管理员){
    router.addRoute({ path: "/order", component = () => import('../components/order') })
    // 添加二级路由
    router.addRoute('home', {
        path:'moment',
        component: () => import('../components/HomeMoment')
    })
}
export default router;
```

当然，除了动态添加路由，当然也有动态删除路由

1. 方式一：添加一个name相同的路由
2. 方式二：使用 `removeRoute(路由名称)`
3. 方式三：`addRoute`返回一个函数，调用这个函数则会删除该路由



#### vuex

安装

```shell
npm i vuex@next
```

使用和之前类似，只是依然要导包

```js
import { createStore } from 'vuex';
const store = createStore({
    state() {
        return {
            //...
        }
    }
});
export default store
```

然后在main.js中

```js
//...
import store from './store'
const app = createApp(App)
app.use(store);
app.mount('#app');
```



#### vue中全局变量、函数

可以使用 `  app.config.globalProperties` 进行定义（`vue.prototype`废除）

```ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

const app = createApp(App)
app.use(store)
app.use(router)
// 为了区分全局变量，在函数前面加一个$
app.config.globalProperties.$filter = {
  formatTime(time: string) {
    console.log('time', time);
  }
}
app.mount('#app')
```

在组件中使用

```html
<strong>{{ $filter.formatTime('666') }}</strong>
```



## 4.Composition API

option API 模式的弊端

- 当我们实现一个功能时，这个功能对应的代码逻辑会被拆分到各个属性当中
- 当我们的组件变得很大很复杂的时候，逻辑关注点的列表就会增长，那么同一个功能的逻辑就会被拆分的很分散
- 尤其对那些开始没有编写这些组件的人来说，代码变得难以阅读



composition API使得逻辑代码重合部分可以拆分为一个函数（使用hook，和React一样，使用useXXX命名），然后导入使用

`setup`其实就是组件的一个选项，只不过这个选项可以强大到替代之前的所有选项

**setup里面无法使用this，没有绑定！！**

setup的参数

- props
  - 还是需要写props的option进行声明
  - 父组件还是需要写components选项
- context，它包含三个属性
  - attrs：所有非props的attribute，比如class、id之类的；
  - slots：父组件传过来的插槽
  - emit：当我们组件内部需要发出事件时会用到emit（因为我们不能访问this，无法通过`this.$emit`发出事件）

setup的返回值可以在模板template中被使用，也就是说我们可以通过setup的返回值来替代data选项



#### reactive

但是在setup里定义的变量非响应式的，因为他没有放在data，所以我们可以包裹一个 `reactive`，将其变身称为响应式的（此时包裹在reactive里面的数据会被Vue使用Proxy进行数据劫持）

事实上，我们编写的data选项，也是在内部就给了reactive函数将其变成响应式的

> 注意：reactive API对传入类型是有限制的，他要求我们必须传入一个对象或者数组类型

```vue
<template>
  <div>
    <div>{{ state.count }}</div>
    <button @click="increment">+</button>
  </div>
</template>

<script>
import { reactive } from "vue";

export default {
  setup(props, { attrs, slots, emit }) {
    console.log(props);
    console.log(attrs);
    console.log(slots);
    console.log(emit);
    // let count = 100;
    const state = reactive({
      count: 100,
      message: "hello world",
    });
    // 局部函数
    const increment = () => {
      state.count++;
    };
    return {
      state,
      increment,
    };
  },
};
</script>
```

> 注意：reactive在v-model使用双向绑定的时候有可能会有些问题，所以即使数据是对象，此时也建议使用ref包裹



#### Ref API

> 官方推荐（尤雨溪）能用ref就用ref，而不是reactive，后期方便抽离

如果我们对reactive传入一个基本数据类型，就会报一个警告，提示我们使用ref

ref API会返回一个可变的响应式对象，该对象作为一个响应式引用维护它内部的值，这就是ref名称的来源

- 它内部的值是在ref的value属性被维护的

但是，虽然是最为ref的value进行存储，但是我们并不需要在模板中使用  `变量名.value`  来获取存储的数据，在tempplate模板中使用ref对象，它会自动进行解包：

1. 浅层解包，只能对未包裹外层（如果外层有包裹，必须被reactive对象包裹）的基本数据类型进行解包
2. 但是并不代表在逻辑代码里，也就是setup里有自动解包的功能，所以在setup函数里还是得通过  `变量名.value`   来操作 

```vue
<template>
  <div>
    <div>{{ count }}</div>
    <button @click="increment">+</button>
  </div>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    let count = ref(100);
    const increment = () => {
      count.value++;
    };
    return {
      count,
      increment,
    };
  },
};
</script>
```



#### Vue Reactivity Transfrom

> 该功能已经废弃，可以作为了解

已废弃的实验性功能

响应性语法糖曾经是一个实验性功能，且已被废弃，请阅读[废弃原因](https://github.com/vuejs/rfcs/discussions/369#discussioncomment-5059028)。

总结出来就是：

- 丢失`.value`使得更难进行依赖追踪，心理开销（mental overhead）变得更加明显，特别是如果语法也在 SFC 之外使用，并且在SFC内外使用可能会出现不一致
- 写法上容易和refs混淆，特别是外部函数期望使用`$refs`
- 最重要的是，潜在的碎片化风险。尽管这显然是选择加入的，但一些用户对该提案表示强烈反对，原因是他们担心他们将不得不使用不同的代码库，其中一些人选择使用它，而另一些人则没有。这是一个合理的问题，因为反应性转换需要一种不同的心智模型来扭曲JavaScript语义（变量赋值能够触发反应效应）。



在未来的一个小版本更新中，它将会从 Vue core 中被移除。

- 想要摆脱它的话，请查看这个[命令行工具](https://github.com/edison1105/drop-reactivity-transform)，它可以自动完成这一过程。
- 如需继续使用，请通过 [Vue Macros](https://vue-macros.sxzz.moe/features/reactivity-transform.html) 插件。



ref vs. 响应式变量，有点Svelte的感觉在里面

自从引入组合式 API 的概念以来，一个主要的未解决的问题就是 ref 和响应式对象到底用哪个。响应式对象存在解构丢失响应性的问题，而 ref 需要到处使用 `.value` 则感觉很繁琐，并且在没有类型系统的帮助时很容易漏掉 `.value`。

[Vue 的响应性语法糖](https://github.com/vuejs/core/tree/main/packages/reactivity-transform)是一个编译时的转换步骤，让我们可以像这样书写代码：

vue

```vue
<script setup>
let count = $ref(0)

console.log(count)

function increment() {
  count++
}
</script>

<template>
  <button @click="increment">{{ count }}</button>
</template>
```

每一个会返回 ref 的响应式 API 都有一个相对应的、以 `$` 为前缀的宏函数。包括以下这些 API：

- [`ref`](https://cn.vuejs.org/api/reactivity-core.html#ref) -> `$ref`
- [`computed`](https://cn.vuejs.org/api/reactivity-core.html#computed) -> `$computed`
- [`shallowRef`](https://cn.vuejs.org/api/reactivity-advanced.html#shallowref) -> `$shallowRef`
- [`customRef`](https://cn.vuejs.org/api/reactivity-advanced.html#customref) -> `$customRef`
- [`toRef`](https://cn.vuejs.org/api/reactivity-utilities.html#toref) -> `$toRef`



**toRefs**

- `toRefs`：将 reactive对象中所有属性都转换为ref，建立链接
- `toRef`：对 reactive对象其中一个属性转换ref，建立链接
- 注意，两者都是建立在 reactive API 之上的

正常情况下，对reactive包裹的对象做解构是无法得到响应式数据的，除非使用 `toRefs` 进行包裹，将里面结构的数据转换为 ref

如果是仅仅只需要解构reactive之后得到**一个**我们需要的属性，则使用 `toRef`就可以了（对比 `toRefs`，性能开销较小 ）

```js
// 得不到响应式的 ×
setup() {
    const info = reactive({count: 100})
    let { count } = info
    const increment = () => {
        count++;
    };
    return {
        count,
        increment,
    };
},
```

```js
import { reactive, toRefs } from "vue";
//.....
//响应式的count
setup() {
    const info = reactive({ name: 'allen', count: 100 });
    //也可以
    //let { name, count } = toRefs(info);
    let count = toRef(info, "count");
    const increment = () => {
        count.value++;
    };
    return {
        count,
        increment,
    };
}
```

还有一个 unref API，用于判断当前是否为ref

实质上也不过就是  unref(val) => 

```js
val = isRef(val) ? val.value : val;
```



**options API和Composition API 中响应式数据的命名冲突**

Vue3内部取值的时候，如果有 `$`符号，则 先找缓存，没有的话再找setup中保存的响应式数据，找不到再找data，找不到再找props，找不到再找ctx里面有没有值（ctx里面保存computed、methods的数据）

```js
if (key[0] !== '$') {
    const n = accessCache![key]
    if (n !== undefined) {
        switch (n) {
            case AccessTypes.SETUP:
                return setupState[key]
            case AccessTypes.DATA:
                return data[key]
            case AccessTypes.CONTEXT:
                return ctx[key]
            case AccessTypes.PROPS:
                return props![key]
                // default: just fallthrough
        }
    } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
        accessCache![key] = AccessTypes.SETUP
        return setupState[key]
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache![key] = AccessTypes.DATA
        return data[key]
    } else if (
        // only cache other properties when instance has declared (thus stable)
        // props
        (normalizedProps = instance.propsOptions[0]) &&
        hasOwn(normalizedProps, key)
    ) {
        accessCache![key] = AccessTypes.PROPS
        return props![key]
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache![key] = AccessTypes.CONTEXT
        return ctx[key]
    } else if (!__FEATURE_OPTIONS_API__ || shouldCacheAccess) {
        accessCache![key] = AccessTypes.OTHER  //找不到了
    }
}
```



#### ref获取组件/元素对象

```vue
<template>
  <div ref="title"></div>
</template>

<script>
import { ref } from "vue";
export default {
  setup() {
    // 只不过title要在元素挂在完毕之后才有值
    const title = ref(null);
    return {
      title
    }
  },
};
</script>
```



#### 无法使用this

官方：

**在 `setup()` 内部，`this` 不是该活跃实例的引用**，因为 `setup()` 是在解析其它组件选项之前被调用的，所以 `setup()` 内部的 `this` 的行为与其它选项中的 `this` 完全不同。这使得 `setup()` 在和其它选项式 API 一起使用时可能会导致混淆。

coderwhy老师：组件实例被创建 -> setup被调用 -> 其他option出来

也就是说

- 在 `setup` 中this并没有绑定组件实例
- 并且在 `setup` 被调用之前，data、computed、methods等option都没有被解析



#### readonly

有时候我们通过reactive 或者 ref 获取到一个响应式对象，但是我们传入其他地方（组件）的时候，并不想在另外一个地方（组件）被修改，只读就可以

比如说父组件传入到子组件，我们要遵循“单向数据流”的规范

使用readonly

- readonly会返回原生对象的只读代理（也就是它依旧是一个Proxy，这是一个proxy的set方法被劫持，而不能对其进行修改）

```js
const dataProxy = new Proxy(info, {
    get(target, key){ return target[key] },
    set(target, key, value) { warning(); }
})
```

```js
import { reactive, ref, readonly } from 'vue'
//...
setup(){
	const data = reactive({name: 'allen'});
    const data2 = ref(100);
	const readonlyData = readonly(data);
    const readonlyData2 = readonly(data2);
    readonly.name = 'bruce'; //失败，警告
}
```



#### computed

通过导包的方式，直接再 setup 函数中使用

- 传入一个函数作为参数，该返回值（也变身为ref对象）直接作为缓存 
- or 传入一个对象，包含get和set方法，同以前的computed option（也返回成一个ref对象）

```js
import { ref, computed } from "vue";
export default {
  setup() {
    const firstname = ref("Allen");
    const lastname = ref("bruce");
    const fullname = computed(() => firstname.value + " " + lastname.value);
    return {
      fullname,
    };
  },
};
```



#### watch

在composition API中，我们可以使用watchEffect和watch来完成响应式数据侦听

- watchEffect用于自动收集响应式数据依赖，首屏渲染就会立即执行一次

  立即执行一次就是为了查看函数里面包含了什么响应式的数据，进行依赖收集

  之后若该依赖发生改变，则watchEffect函数就会被触发；

  第二个参数是option，可以指定 flush："pre"|"post"|"sync"，分别是  `默认`|`dom挂载之后再执行`|`强制同步触发，低效的`

```ts
function watchEffect(
  effect: (onInvalidate: InvalidateCbRegistrator) => void,
  options?: WatchEffectOptions
): StopHandle
```

```js
setup() {
    const name = ref("Allen");
    const age = ref(18);
    const changeName = () => {
        name.value = "Bruce";
    };
    const changeAge = () => {
        age.value++;
    };
    //依赖项发生改变自动重新执行，个人感觉有点像react的useEffect来用了
    watchEffect(() => {
        console.log("name:", name.value);  // name发生改变则调用，因为name被watchEffect收集了
    });
    return {
        name,
        age,
        changeAge,
        changeName,
    };
},
```

- watch需要手动指定侦听数据源，几乎等同于watch option
  - 但是在setup里面，格式上还是有少许不同
  - 第一个参数传入一个getter函数（reactive 或者 ref 或者一个装着多个ref/reactive的数组）
  - 第二个参数传入一个函数，代表监听数据变化后进行的操作
  - 第三个参数可选，作为watch的option设置监听，比如deep（深度侦听）、immediate（是否首屏渲染就会立即执行一次）

```js
setup() {
    const info = reactive({ name: "allen", age: 18 });
    const changeName = () => (info.name = "Bruce");
    watch(info, (newval, oldval) => {
        console.log(newval, oldval);
    });
    /*
    避免newval，oldval变为一个代理proxy，解构掉reactive
    watch(() => {
    	return {...info};
    }, (newval, oldval) => {
        console.log(newval, oldval);
    });
    */
    return {
        changeName,
        info,
    };
},
```

> 注意：如果第一个参数是reactive，则默认深度监听





**停止侦听器 and 清除副作用**

`watchEffect` 返回一个 停止器，调用该停止器之后，`watchEffect`将不会被触发

`watchEffect`还接受一个参数，该参数传入的函数会在watchEffect被销毁时调用，个人感觉可以把它当成React中 useEffect的 返回值

```js
setup() {
    const name = ref("Allen");
    const age = ref(18);
    // watchEffect 返回一个停止侦听器，调用即停止
    const stop = watchEffect((onInvalidate) => {
      onInvalidate(() => {
        // 用于清除函数中的副作用，比如可以放一些取消请求功能request.cancel()
        // 当依赖项发生改变，watchEffect重新执行，则这里面的的代码也会被执行。
        console.log("我被执行了！");
      });
      console.log("name:", age.value);
    });
    const changeAge = () => {
      age.value++;
      if (age.value > 25) stop();
    };
    return {
      name,
      age,
      changeAge,
    };
  },
```



#### 生命周期替代

使用：可以直接导入 onX 函数，注册生命周期钩子函数

| option API    | Hook inside setup                             |
| ------------- | --------------------------------------------- |
| beforeCreate  | no need（由于setup比它早，放在setup执行即可） |
| created       | no need（由于setup比它早，放在setup执行即可） |
| beforeMount   | onBeforeMount                                 |
| mounted       | onMounted                                     |
| beforeUpdate  | onBeforeUpdate                                |
| updated       | onUpdated                                     |
| beforeUnmount | onBeforeUnmount                               |
| unmounted     | onUnmounted                                   |
| activated     | onActivated                                   |
| deactivated   | onDeactivated                                 |

```vue
<script>
import { onMounted, onUpdated, onUnmounted, ref } from "vue";
export default {
  setup() {
    const counter = ref(100);
    const increnment = () => counter.value++;
    onMounted(() => {
      console.log("onMounted");
    });
    // 可以注册多个生命周期
    onMounted(() => {
      console.log("onMounted2");
    });
    onUpdated(() => {
      console.log("onUpdated");
    });
    onUnmounted(() => {
      console.log("onUnmounted");
    });
    return {
      counter,
      increnment,
    };
  },
};
</script>
```



#### provide / inject

父组件：导包之后，以键值对的形式，存储于父组件的provide中

子组件：导包之后，通过`inject(键)`来获取传入的数据；也可以给inject传入第二个参数来添加默认值

```vue
<script>
// 父组件
import { provide, ref, readonly } from "vue";
import Child from "./Child.vue";
export default {
  setup() {
    const name = "Allen";
    let count = ref(10);
    provide("name", name);
    provide("count", readonly(count));
  },
  components: {
    Child,
  },
};
</script>
```

```vue
<script>
// 子组件
import { inject } from "vue";
export default {
  setup() {
    const name = inject("name");
    const count = inject("count", 10);
    return {
      name,
      count,
    };
  },
};
</script>
```



#### script setup

`script setup` 是在单文件组件 (SFC) 中使用组合式 API 的编译时语法糖。

2021.6.21为止还是实验性，但是到了2021.11.28好像已经被纳入正式版了

相比于普通的 `<script>` 语法，它具有更多优势：

- 更少的样板内容，更简洁的代码。
- 能够使用纯 Typescript 声明 props 和抛出事件。
- 更好的运行时性能 (其模板会被编译成与其同一作用域的渲染函数，没有任何的中间代理)。
- 更好的 IDE 类型推断性能 (减少语言服务器从代码中抽离类型的工作)

```vue
<script setup>
    import MyComponent from './MyComponent.vue'
    import { ref } from 'vue'
    const count = ref(0);
</script>

<template>
    <MyComponent />
    <button @click="count++">{{ count }}</button>
</template>
```

在 `<script setup>` 中必须使用 `defineProps` 和 `defineEmits` API 来声明 `props` 和 `emits`



#### 获取路由对象

依旧是因为setup中获取不到this，此时导入路由的hook

此时这里的 useRoute返回的`route = this.$route`

```js
import { useRoute } from 'vue-router';
export default {
  setup() {
    const route = useRoute();
  },
};
```

同样的，想要获取 `$router` 对象，也需要导入路由hook，通过返回的router对象，使用原来 `this.$router.push` 方法

```js
import { useRouter } from 'vue-router';
export default {
  setup() {
    const router = useRouter();
    router.push("/xxx")
  },
};
```



#### 获取vuex

依旧是因为setup中获取不到this，此时导入vuex的hook

这里引入了computed、Vuex的mapState（一个对象，传入的属性是多个函数）简化模板中的数据简写

```js
import { useStore, mapState } from 'vuex'
import { computed } from 'vue'
export default {
  setup() {
    const store = useStore();
    const sCounter = computed(() => store.state.counter);
    // 除了一个一个computed声明，也可以使用mapState
    const storeStateFns = mapState(['name', 'age']);
    const storeState = {};
    Object.keys(storeStateFns)
    .forEach(key => {
        // mapState里的函数调用时return this.$store.state.xxx，所以这里要处理this
        const fn = storeStateFns[key].bind({ $store: store });
        storeState[key] = computed(fn);
    })
    return {
        sCounter,
        ...storeState
    }
  },
};
```



#### nextTick

```js
import { nextTick } from "vue";
export default {
  setup() {
    // 使用onUpdated的话也可以，但是onUpdated比较公用，任何DOM更新都会触发
    nextTick(() => {
      //...
    });
  },
};
```

vue的nextTick原理思路有点像node.js中事件循环的nextTick

vue把watch的回调、组件更新触发的事件、生命周期的回调等任务，而任务全部被加入到微任务队列里面去！！！！

而使用nextTick，就会让nextTick中的回调任务加入到微任务任务队列中

```js
export function nextTick<T = void>(
  this: T,
  fn?: (this: T) => void
): Promise<void> {
  const p = currentFlushPromise || resolvedPromise
  return fn ? Promise.resolve().then(this ? fn.bind(this) : fn) : p
}
```




## 5.废弃

#### $children属性

在 3.x 中，`$children` property 已被移除，且不再支持。如果你需要访问子组件实例，我们建议使用 [$refs](https://v3.cn.vuejs.org/guide/component-template-refs.html#模板引用)



#### filters option

我们建议用计算属性或方法代替过滤器，而不是使用过滤器。

[迁移构建开关：](https://v3.cn.vuejs.org/guide/migration/migration-build.html#兼容性配置)

- `FILTERS`
- `COMPILER_FILTERS`



#### router-link

路由 `router-link` 的 tag 属性

因为现在可以直接再 `router-link` 中写入标签，当作slot使用



#### 可选的第三个参数 `next`

在之前的 Vue Router 版本中（当前2021年为4.x版本），也是可以使用 *第三个参数* `next` 的。这是一个常见的错误来源，可以通过 [RFC](https://github.com/vuejs/rfcs/blob/master/active-rfcs/0037-router-return-guards.md#motivation) 来消除错误。然而，它仍然是被支持的，这意味着你可以向任何导航守卫传递第三个参数。在这种情况下，**确保 `next`** 在任何给定的导航守卫中都被**严格调用一次**。它可以出现多于一次，但是只能在所有的逻辑路径都不重叠的情况下，否则钩子永远都不会被解析或报错。这里有一个在用户未能验证身份时重定向到`/login`的**错误用例**：

```js
// BAD
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  // 如果用户未能验证身份，则 `next` 会被调用两次
  next()
})
```

下面是正确的版本:

```js
// GOOD
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated) next({ name: 'Login' })
  else next()
})
```

现在更多通过返回值来控制跳转（next）

1. false：取消当前导航

2. 不反悔/ undefined：默认导航

3. 返回一个路由地址：可以是String，也可以是一个对象（包含path、params、query等信息），跳到该导航（把这个看成 `this.$router.push("/home");`  即可）

   比如

   ```typescript
   router.beforeEach((to) => {
     if (to.path !== '/login') {
       const token = LocalCache.getCache('toekn')
       if (!token) {
         return '/login'
       }
     }
   })
   ```

   



#### Vue.extend

在 Vue 2.x 中，`Vue.extend` 曾经被用于创建一个基于 Vue 构造函数的“子类”，其参数应为一个包含组件选项的对象。在 Vue 3.x 中，我们已经没有组件构造器的概念了。应该始终使用 `createApp` 这个全局 API 来挂载组件



#### v-on.native

它原来是用于组件中原生事件的触发

原来的样子

```vue
<my-component
  v-on:close="handleComponentEvent"
  v-on:click.native="handleNativeClickEvent"
/>
```

而现在`v-on` 的 `.native` 修饰符已被移除。同时，[新增的 `emits` 选项](https://v3.cn.vuejs.org/guide/migration/emits-option.html)允许子组件定义真正会被触发的事件。

因此，对于子组件中*未*被定义为组件触发的所有事件监听器，Vue 现在将把它们作为原生事件监听器添加到子组件的根元素中 (除非在子组件的选项中设置了 `inheritAttrs: false`)。

（可以理解为直接用就好了，不用加`native`）

```html
<my-component
  v-on:close="handleComponentEvent"
  v-on:click="handleNativeClickEvent"
/>
```

```vue
<script>
  //MyComponent.vue
  export default {
    emits: ['close']
  }
</script>
```



#### 事件总线

Vue3官方实例移除了 `$on` 、`$off` 、`$once`方法，所以不能像Vue2.x一样通过创建Vue实例来进行事件总线。如果我们希望继续使用事件总线，可以通过一些第三方的库，Vue3官方推荐 `mitt`或者`tiny-emitter`

**mitt库的使用**

```shell
npm i mitt
```

js文件封装

```js
import mitt from 'mitt'
const emitter = mitt();
export default emitter;
```

组件使用（直接发布订阅完事）

```js
import emitter from 'xxx.js'
事件(){
    emitter.emit('事件名称', {a: 1, b: 2})
}
```

```js
import emitter from 'xxx.js'
//创建初期直接监听发布
created(){
    emitter.on('事件名称', data => {
        //....
    })；
    emitter.on('*', (type, data) => {
        console.log(`如果是*则监听所有事件,事件类型：${type}，传递参数：${data}`);
    })
}
```

mit事件监听取消

```js
//全部一次性取消
emitter.all.clear();

//单个取消，函数需要定义
function onFoo() {}
emitter.on('foo', onFoo);
emitter.off('foo', onFoo);
```

